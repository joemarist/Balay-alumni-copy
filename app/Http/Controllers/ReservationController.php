<?php

namespace App\Http\Controllers;

use App\Models\EventPackage;
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

        $reservations = Reservation::with([
            'venue',
            'user',
            'eventPackage',
        ])
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
            'min:0.01',
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

    $submittedAmount = number_format(
        (float) $validated['payment_amount'],
        2,
        '.',
        ''
    );

    $requiredAmount = number_format(
        (float) $reservation->total_amount,
        2,
        '.',
        ''
    );

    if ($submittedAmount !== $requiredAmount) {
        throw ValidationException::withMessages([
            'payment_amount' =>
                'The payment amount must be exactly ₱' .
                number_format((float) $reservation->total_amount, 2) .
                '.',
        ]);
    }

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
            'event_package_id' => [
                'nullable',
                'exists:event_packages,id',
            ],
            'event_type' => ['required', 'string', 'max:255'],
            'guest_count' => ['required', 'integer', 'min:1'],
            'event_date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'special_requests' => ['nullable', 'string'],
            'payment_method' => ['required', 'string', 'max:255'],

            'selected_addons' => [
                'nullable',
                'array',
            ],

            'selected_addons.*.name' => [
                'required',
                'string',
            ],

            'selected_addons.*.price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'venue_extension_hours' => [
            'nullable',
            'integer',
            'min:0',
            'max:12',
            ],
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

            $package = null;

                if (! empty($validated['event_package_id'])) {
                    $package = EventPackage::query()
                        ->whereKey($validated['event_package_id'])
                        ->where('available', true)
                        ->with('venues')
                        ->firstOrFail();
                }

                if ($package) {
                    $packageVenue = $package->venues
                        ->firstWhere('id', $venue->id);

                    if (! $packageVenue) {
                        throw ValidationException::withMessages([
                            'venue_id' =>
                                'The selected venue is not included in this event package.',
                        ]);
                    }
                }

                if ($package) {
                    $start = \Carbon\Carbon::createFromFormat(
                        'H:i',
                        $validated['start_time']
                    );

                    $end = \Carbon\Carbon::createFromFormat(
                        'H:i',
                        $validated['end_time']
                    );

                    $durationHours = $start->diffInMinutes($end) / 60;

                    $allowedHours =
                        $package->included_duration_hours +
                        (int) ($validated['venue_extension_hours'] ?? 0);

                    if ($durationHours > $allowedHours) {
                        throw ValidationException::withMessages([
                            'end_time' =>
                                'The selected time exceeds the package duration. ' .
                                'This package includes ' .
                                $package->included_duration_hours .
                                ' hours, plus any approved venue extension.',
                        ]);
                    }
                }

                $packageAmount = $package
                ? (float) $package->price
                : 0;

            /*
             * Calculate the actual reservation duration
             * from the customer's selected start and end time.
             */
            $start = \Carbon\Carbon::createFromFormat(
                'H:i',
                $validated['start_time']
            );

            $end = \Carbon\Carbon::createFromFormat(
                'H:i',
                $validated['end_time']
            );

            $durationHours = $start->diffInMinutes($end) / 60;

            /*
             * Normal venue booking:
             *
             * The venue's minimum booking hours represent
             * the number of hours already included in the base rate.
             *
             * Example:
             * Base rate = ₱15,000
             * Minimum booking = 4 hours
             * Extension rate = ₱2,500/hour
             *
             * 4 hours = ₱15,000
             * 5 hours = ₱17,500
             * 6 hours = ₱20,000
             */
            $minimumBookingHours = (int) $venue->minimum_booking_hours;

            if (! $package && $durationHours < $minimumBookingHours) {
                throw ValidationException::withMessages([
                    'end_time' =>
                        'This venue requires a minimum reservation duration of ' .
                        $minimumBookingHours .
                        ' hours.',
                ]);
            }

            /*
             * For normal venue reservations, the system automatically
             * determines the extension hours.
             *
             * Customers do NOT enter these hours themselves.
             */
            $automaticVenueExtensionHours = ! $package
                ? max(0, $durationHours - $minimumBookingHours)
                : 0;

            $automaticVenueExtensionRate = ! $package
                ? (float) $venue->extension_rate_per_hour
                : 0;

            $automaticVenueExtensionAmount =
                $automaticVenueExtensionHours *
                $automaticVenueExtensionRate;

            /*
             * Normal venue rental:
             *
             * Base rate + automatically calculated extension.
             *
             * Event packages continue using the package pricing
             * logic below.
             */
            $venueRental = $package
                ? 0
                : (float) $venue->rate +
                  $automaticVenueExtensionAmount;

            /*
             * Existing event-package extension logic.
             *
             * This is intentionally kept separate from the
             * automatic normal-venue extension calculation.
             */
            $venueExtensionHours = $package
                ? (int) ($validated['venue_extension_hours'] ?? 0)
                : (int) $automaticVenueExtensionHours;

            $venueExtensionAmount = $package
                ? 0
                : $automaticVenueExtensionAmount;

            if ($package && $venueExtensionHours > 0) {
                $packageVenue = $package->venues
                    ->firstWhere('id', $venue->id);

                if (! $packageVenue) {
                    throw ValidationException::withMessages([
                        'venue_id' =>
                            'The selected venue is not included in this package.',
                    ]);
                }

                $extensionRate = (float) (
                    $packageVenue->pivot->extension_rate_per_hour ?? 0
                );

                if ($extensionRate <= 0) {
                    throw ValidationException::withMessages([
                        'venue_extension_hours' =>
                            'Venue extension is not available for this package.',
                    ]);
                }

                $venueExtensionAmount =
                    $extensionRate * $venueExtensionHours;
            }

                $addonAmount = 0;
                $selectedAddons = [];

                if ($package && ! empty($validated['selected_addons'])) {
                    $availableAddons = collect($package->addons ?? []);

                    foreach ($validated['selected_addons'] as $selectedAddon) {
                        $matchingAddon = $availableAddons->firstWhere(
                            'name',
                            $selectedAddon['name']
                        );

                        if (! $matchingAddon) {
                            throw ValidationException::withMessages([
                                'selected_addons' =>
                                    'One or more selected add-ons are not available for this package.',
                            ]);
                        }

                        $addonPrice = (float) $matchingAddon['price'];

                        $selectedAddons[] = [
                            'name' => $matchingAddon['name'],
                            'price' => $addonPrice,
                        ];

                        $addonAmount += $addonPrice;
                    }
                }

                $subtotal =
                $packageAmount +
                $venueRental +
                $addonAmount;

                $serviceFee = round($subtotal * 0.05, 2);

                $totalAmount = $subtotal + $serviceFee;

                Reservation::create([
                    'user_id' => Auth::id(),
                    'venue_id' => $venue->id,
                    'event_package_id' => $package?->id,

                    'event_type' => $validated['event_type'],
                    'guest_count' => $validated['guest_count'],
                    'event_date' => $validated['event_date'],
                    'start_time' => $validated['start_time'],
                    'end_time' => $validated['end_time'],
                    'special_requests' => $validated['special_requests'] ?? null,

                    'payment_method' => $validated['payment_method'],

                    'venue_rental' => $venueRental,
                    'package_amount' => $packageAmount,
                    'addon_amount' => $addonAmount,

                    'venue_extension_hours' => $venueExtensionHours,
                    'venue_extension_amount' => $venueExtensionAmount,

                    'selected_addons' => $selectedAddons ?: null,

                    'service_fee' => $serviceFee,
                    'total_amount' => $totalAmount,

                    'status' => 'pending',
                    'payment_status' => 'unpaid',
                ]);

        });

        return redirect()
            ->route('payments')
            ->with('success', 'Reservation submitted successfully. Please submit your payment proof.');
    }
}
