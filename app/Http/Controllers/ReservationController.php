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
use Illuminate\Support\Facades\Storage;

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
    $user = Auth::user();

    if (
        $user instanceof User &&
        $user->hasAnyRole(['admin', 'superadmin', 'staff'])
    ) {
        $reservations = Reservation::with(['venue', 'user'])
            ->latest()
            ->get();
    } else {
        $reservations = Reservation::with('venue')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();
    }

    return Inertia::render('payments', [
        'reservations' => $reservations,
    ]);
}

public function submitPaymentProof(
    Request $request,
    Reservation $reservation,
): RedirectResponse {
    abort_unless(
        $reservation->user_id === Auth::id(),
        403,
    );

    $validated = $request->validate([
        'payment_amount' => [
            'required',
            'numeric',
            'min:1',
            'max:' . $reservation->total_amount,
        ],
        'payment_method' => [
            'required',
            'in:GCash,Bank Transfer,Cash',
        ],
        'payment_reference' => [
            'required',
            'string',
            'max:255',
        ],
        'payment_remarks' => [
            'nullable',
            'string',
        ],
        'payment_proof' => [
            'required',
            'file',
            'mimes:jpg,jpeg,png,gif,webp,pdf',
            'max:10240',
        ],
    ]);

    if ($request->hasFile('payment_proof')) {
        $validated['payment_proof'] = $request
            ->file('payment_proof')
            ->store('payment-proofs', 'public');
    }

    $reservation->update([
        'payment_method' => $validated['payment_method'],
        'payment_amount' => $validated['payment_amount'],
        'payment_reference' => $validated['payment_reference'],
        'payment_proof' => $validated['payment_proof'],
        'payment_status' => 'pending',
        'payment_remarks' => $validated['payment_remarks'] ?? null,
        'payment_submitted_at' => now(),
    ]);

    return back()->with(
        'success',
        'Payment proof submitted successfully. Please wait for verification.',
    );
}

public function updatePaymentStatus(
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
        'payment_status' => [
            'required',
            'in:confirmed,rejected',
        ],
        'payment_remarks' => [
            'nullable',
            'string',
        ],
    ]);

    $reservation->update([
        'payment_status' => $validated['payment_status'],
        'payment_remarks' => $validated['payment_remarks']
            ?? $reservation->payment_remarks,
    ]);

    return back()->with(
        'success',
        'Payment status updated successfully.',
    );
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

    /*
     * A reservation cannot be approved unless
     * its payment has already been confirmed.
     */
    if (
        $validated['status'] === 'approved' &&
        $reservation->payment_status !== 'confirmed'
    ) {
        throw ValidationException::withMessages([
            'status' => 'This reservation cannot be approved until the payment has been confirmed.',
        ]);
    }

    if ($validated['status'] === 'approved') {
        $venue = $reservation->venue;

        if (
            $reservation->guest_count < $venue->minimum_capacity_pax ||
            $reservation->guest_count > $venue->maximum_capacity_pax
        ) {
            throw ValidationException::withMessages([
                'status' =>
                    'This reservation cannot be approved because the guest count is outside the venue capacity range of ' .
                    $venue->minimum_capacity_pax .
                    '-' .
                    $venue->maximum_capacity_pax .
                    ' pax.',
            ]);
        }
    }

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

            if (
                $validated['guest_count'] < $venue->minimum_capacity_pax ||
                $validated['guest_count'] > $venue->maximum_capacity_pax
            ) {
                throw ValidationException::withMessages([
                    'guest_count' =>
                        'The number of guests must be between ' .
                        $venue->minimum_capacity_pax .
                        ' and ' .
                        $venue->maximum_capacity_pax .
                        ' pax for this venue.',
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
