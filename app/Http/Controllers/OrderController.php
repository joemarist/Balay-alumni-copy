<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'pickup_time' => ['nullable', 'date_format:Y-m-d H:i:s'],
        ]);

        $order = DB::transaction(function () use ($validated) {
            $orderTotal = 0;

            $order = Order::create([
                'user_id' => Auth::id(),
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => null,
                'payment_proof' => null,
                'pickup_time' => $validated['pickup_time'] ?? null,
                'total_amount' => 0,
            ]);

            foreach ($validated['items'] as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);

                if (! $menuItem->available) {
                    throw ValidationException::withMessages([
                        'items' => "{$menuItem->name} is currently unavailable.",
                    ]);
                }

                $unitPrice = (float) $menuItem->price;
                $quantity = (int) $item['quantity'];
                $subtotal = $unitPrice * $quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ]);

                $orderTotal += $subtotal;
            }

            $order->update([
                'total_amount' => $orderTotal,
            ]);

            return $order;
        });


        return redirect()
            ->back()
            ->with('success', "Order #{$order->id} submitted successfully. Please wait for cashier confirmation.");
    }

    public function updateStatus(
        Request $request,
        Order $order,
    ): RedirectResponse {
        $user = Auth::user();

        abort_unless(
            $user instanceof User &&
            $user->hasAnyRole(['admin', 'superadmin', 'staff']),
            403,
        );

        $validated = $request->validate([
            'status' => [
                'required',
                'in:confirmed,rejected,preparing,ready,completed,cancelled',
            ],
        ]);

        $currentStatus = $order->status;
        $newStatus = $validated['status'];

        $allowedTransitions = [
            'pending' => ['confirmed', 'rejected', 'cancelled'],
            'confirmed' => ['preparing', 'cancelled'],
            'preparing' => ['ready'],
            'ready' => ['completed'],
            'completed' => [],
            'rejected' => [],
            'cancelled' => [],
        ];

        if (! in_array($newStatus, $allowedTransitions[$currentStatus] ?? [], true)) {
            throw ValidationException::withMessages([
                'status' => "Cannot change order status from {$currentStatus} to {$newStatus}.",
            ]);
        }

        $order->update([
            'status' => $newStatus,
        ]);

        return back()->with(
            'success',
            "Order #{$order->id} status updated to {$newStatus}.",
        );
    }

    public function staffIndex(): Response
    {
        $user = Auth::user();

        abort_unless(
            $user instanceof User &&
            $user->hasAnyRole(['admin', 'superadmin', 'staff']),
            403,
        );

        $orders = Order::query()
            ->with([
                'user',
                'items.menuItem',
            ])
            ->latest()
            ->get();

        return Inertia::render('StaffCafe', [
            'orders' => $orders,
        ]);
    }
    
    
}