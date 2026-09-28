<?php

namespace App\Http\Controllers;

use App\Models\EventPackage;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EventPackageController extends Controller
{
    private function authorizeAdmin(): void
    {
        $user = Auth::user();

        abort_unless(
            $user instanceof User &&
            $user->hasAnyRole(['admin', 'superadmin']),
            403,
        );
    }

    public function index(): Response
    {
        $packages = EventPackage::query()
            ->where('available', true)
            ->with('venues')
            ->orderByDesc('popular')
            ->orderBy('price')
            ->get();

        return Inertia::render('event-packages', [
            'packages' => $packages,
        ]);
    }

    public function adminIndex(): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('AdminPackages', [
            'packages' => EventPackage::with('venues')
                ->orderBy('type')
                ->orderBy('price')
                ->get(),

            'venues' => Venue::query()
                ->where('available', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
{
    $this->authorizeAdmin();

    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],

        'type' => [
            'required',
            'in:Basic,Standard,Premium',
        ],

        'description' => [
            'nullable',
            'string',
        ],

        'price' => [
        'required',
        'numeric',
        'min:1',
        ],

        'included_duration_hours' => [
            'required',
            'integer',
            'min:1',
        ],

        'features' => [
            'nullable',
            'array',
        ],

        'features.*' => [
            'string',
            'max:255',
        ],

        'addons' => [
            'nullable',
            'array',
        ],

        'addons.*.name' => [
            'required',
            'string',
            'max:255',
        ],

        'addons.*.price' => [
            'required',
            'numeric',
            'min:0',
        ],

        'venue_ids' => [
            'required',
            'array',
            'min:1',
        ],

        'venue_ids.*' => [
            'integer',
            'exists:venues,id',
        ],

        'venue_extension_rates' => [
            'nullable',
            'array',
        ],

        'venue_extension_rates.*' => [
            'numeric',
            'min:1',
        ],

        'popular' => [
            'sometimes',
            'boolean',
        ],

        'available' => [
            'sometimes',
            'boolean',
        ],
    ]);

    $package = EventPackage::create([
        'name' => $validated['name'],
        'type' => $validated['type'],
        'description' => $validated['description'] ?? null,
        'price' => $validated['price'],
        'included_duration_hours' =>
            $validated['included_duration_hours'],
        'features' => $validated['features'] ?? [],
        'addons' => $validated['addons'] ?? [],
        'popular' => $validated['popular'] ?? false,
        'available' => $validated['available'] ?? true,
    ]);

    $venueSync = [];

    foreach ($validated['venue_ids'] as $venueId) {
        $venueSync[$venueId] = [
            'extension_rate_per_hour' =>
                $validated['venue_extension_rates'][$venueId] ?? 0,
        ];
    }

    $package->venues()->sync($venueSync);

    return back()->with(
        'success',
        'Event package added successfully.',
    );
}

public function update(
    Request $request,
    EventPackage $eventPackage,
): RedirectResponse {
    $this->authorizeAdmin();

    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],

        'type' => [
            'required',
            'in:Basic,Standard,Premium',
        ],

        'description' => [
            'nullable',
            'string',
        ],

        'price' => [
        'required',
        'numeric',
        'min:1',
        ],

        'included_duration_hours' => [
            'required',
            'integer',
            'min:1',
        ],

        'features' => [
            'nullable',
            'array',
        ],

        'features.*' => [
            'string',
            'max:255',
        ],

        'addons' => [
            'nullable',
            'array',
        ],

        'addons.*.name' => [
            'required',
            'string',
            'max:255',
        ],

        'addons.*.price' => [
            'required',
            'numeric',
            'min:0',
        ],

        'venue_ids' => [
            'required',
            'array',
            'min:1',
        ],

        'venue_ids.*' => [
            'integer',
            'exists:venues,id',
        ],

        'venue_extension_rates' => [
            'nullable',
            'array',
        ],

        'venue_extension_rates.*' => [
            'numeric',
            'min:1',
        ],

        'popular' => [
            'sometimes',
            'boolean',
        ],

        'available' => [
            'sometimes',
            'boolean',
        ],
    ]);

    $eventPackage->update([
        'name' => $validated['name'],
        'type' => $validated['type'],
        'description' => $validated['description'] ?? null,
        'price' => $validated['price'],
        'included_duration_hours' =>
            $validated['included_duration_hours'],
        'features' => $validated['features'] ?? [],
        'addons' => $validated['addons'] ?? [],
        'popular' => $validated['popular'] ?? false,
        'available' => $validated['available'] ?? true,
    ]);

    $venueSync = [];

    foreach ($validated['venue_ids'] as $venueId) {
        $venueSync[$venueId] = [
            'extension_rate_per_hour' =>
                $validated['venue_extension_rates'][$venueId] ?? 0,
        ];
    }

    $eventPackage->venues()->sync($venueSync);

    return back()->with(
        'success',
        'Event package updated successfully.',
    );
}

public function destroy(
    EventPackage $eventPackage,
): RedirectResponse {
    $this->authorizeAdmin();

    $eventPackage->delete();

    return back()->with(
        'success',
        'Event package deleted successfully.',
    );
}

public function toggleAvailability(
    EventPackage $eventPackage,
): RedirectResponse {
    $this->authorizeAdmin();

    $eventPackage->update([
        'available' => ! $eventPackage->available,
    ]);

    return back()->with(
        'success',
        'Package availability updated.',
    );
}
}
