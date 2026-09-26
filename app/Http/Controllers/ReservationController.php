<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(): Response
    {
        $reservations = Reservation::with('venue')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('reservations', [
            'reservations' => $reservations,
        ]);
    }

        public function adminIndex(): Response
    {
        $user = Auth::user();

        abort_unless(
            $user instanceof User &&
            $user->hasAnyRole(['admin', 'superadmin', 'staff']),
            403
        );

        $reservations = Reservation::with(['venue', 'user'])
            ->latest()
            ->get();

        return Inertia::render('reservations', [
            'reservations' => $reservations,
        ]);
    }

    public function payments(): Response
{
    $reservations = Reservation::with('venue')
        ->where('user_id', Auth::id())
        ->latest()
        ->get();

    return Inertia::render('payments', [
        'reservations' => $reservations,
    ]);
}

    public function updateStatus(
        Request $request,
        Reservation $reservation,
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
                'in:pending,approved,rejected,cancelled,completed',
            ],
        ]);

        $reservation->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Reservation status updated.');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'event_type' => ['required', 'string', 'max:255'],
            'guest_count' => ['required', 'integer', 'min:1'],
            'event_date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'special_requests' => ['nullable', 'string'],
            'payment_method' => ['required', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($validated) {
            $venue = Venue::whereKey($validated['venue_id'])
                ->lockForUpdate()
                ->firstOrFail();

            if (! $venue->available) {
                throw ValidationException::withMessages([
                    'venue_id' => 'This venue is currently unavailable.',
                ]);
            }

            if ($validated['guest_count'] > $venue->capacity_pax) {
                throw ValidationException::withMessages([
                    'guest_count' => 'The number of guests exceeds the venue capacity.',
                ]);
            }

            $hasConflict = Reservation::query()
                ->where('venue_id', $venue->id)
                ->whereDate('event_date', $validated['event_date'])
                ->whereIn('status', ['pending', 'approved'])
                ->where('start_time', '<', $validated['end_time'])
                ->where('end_time', '>', $validated['start_time'])
                ->exists();

            if ($hasConflict) {
                throw ValidationException::withMessages([
                    'event_date' => 'The selected venue is already reserved during this time.',
                ]);
            }

            $venueRental = (float) $venue->rate;
            $serviceFee = round($venueRental * 0.05, 2);

            Reservation::create([
                'user_id' => Auth::id(),
                'venue_id' => $venue->id,
                'event_type' => $validated['event_type'],
                'guest_count' => $validated['guest_count'],
                'event_date' => $validated['event_date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'special_requests' => $validated['special_requests'] ?? null,
                'payment_method' => $validated['payment_method'],
                'venue_rental' => $venueRental,
                'service_fee' => $serviceFee,
                'total_amount' => $venueRental + $serviceFee,
                'status' => 'pending',
            ]);
        });

        return redirect()
            ->route('payments')
            ->with('success', 'Reservation submitted successfully. Please submit your payment proof.');
    }
}
