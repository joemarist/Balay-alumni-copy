<?php

namespace App\Http\Controllers;

use App\Models\EventPackage;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
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

    private function imageUrl(?string $image): ?string
    {
        if (! $image) {
            return null;
        }

        // Keep existing public paths such as /images/venue/...
        if (
            str_starts_with($image, '/') ||
            str_starts_with($image, 'http://') ||
            str_starts_with($image, 'https://')
        ) {
            return $image;
        }

        // Uploaded images stored on the public disk.
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return $disk->url($image);
    }

    public function welcome(): Response
{
    $venues = Venue::query()
        ->where('available', true)
        ->orderBy('name')
        ->get()
        ->map(function (Venue $venue) {
            $venue->image = $this->imageUrl($venue->image);

            return $venue;
        });

    $packages = EventPackage::query()
        ->where('available', true)
        ->with('venues')
        ->orderByDesc('popular')
        ->orderBy('price')
        ->get();

    return Inertia::render('welcome', [
        'venues' => $venues,
        'packages' => $packages,
    ]);
}

    public function index(): Response
    {
        $venues = Venue::orderBy('name')
            ->get()
            ->map(function (Venue $venue) {
                $venue->image = $this->imageUrl($venue->image);

                return $venue;
            });

        return Inertia::render('UserVenues', [
            'venues' => $venues,
        ]);
    }

    public function adminIndex(): Response
    {
        $this->authorizeAdmin();

        $venues = Venue::orderBy('name')
            ->get()
            ->map(function (Venue $venue) {
                $venue->image = $this->imageUrl($venue->image);

                return $venue;
            });

        return Inertia::render('AdminVenues', [
            'venues' => $venues,
        ]);
    }

    public function store(Request $request): RedirectResponse
{
    $this->authorizeAdmin();

    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'description' => ['required', 'string'],
        'category' => [
            'required',
            'in:Function Hall,Conference,Whole Venue',
        ],
        'minimum_capacity_pax' => ['required', 'integer', 'min:1'],
        'maximum_capacity_pax' => [
            'required',
            'integer',
            'min:1',
            'gte:minimum_capacity_pax',
        ],
        'rate' => ['required', 'numeric', 'min:0'],

        'minimum_booking_hours' => [
            'required',
            'integer',
            'min:1',
        ],

        'extension_rate_per_hour' => [
            'required',
            'numeric',
            'min:0',
        ],
        'inclusions' => ['required', 'array', 'min:1'],
        'inclusions.*' => ['string', 'max:255'],
        'note' => ['nullable', 'string'],
        'image' => [
            'nullable',
            'image',
            'mimes:jpeg,png,jpg,gif,webp',
            'max:5120',
        ],
        'available' => ['sometimes', 'boolean'],
    ]);

    if ($request->hasFile('image')) {
        $validated['image'] = $request->file('image')->store('venues', 'public');
    }

    Venue::create($validated);

    return back()->with('success', 'Venue added successfully.');
}

public function update(Request $request, Venue $venue): RedirectResponse
{
    $this->authorizeAdmin();

    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'description' => ['required', 'string'],
        'category' => [
            'required',
            'in:Function Hall,Conference,Whole Venue',
        ],
        'minimum_capacity_pax' => ['required', 'integer', 'min:1'],
        'maximum_capacity_pax' => [
            'required',
            'integer',
            'min:1',
            'gte:minimum_capacity_pax',
        ],
        'rate' => ['required', 'numeric', 'min:0'],

        'minimum_booking_hours' => [
            'required',
            'integer',
            'min:1',
        ],

        'extension_rate_per_hour' => [
            'required',
            'numeric',
            'min:0',
        ],
        'inclusions' => ['required', 'array', 'min:1'],
        'inclusions.*' => ['string', 'max:255'],
        'note' => ['nullable', 'string'],
        'image' => [
            'nullable',
            'image',
            'mimes:jpeg,png,jpg,gif,webp',
            'max:5120',
        ],
        'available' => ['sometimes', 'boolean'],
    ]);

    /*
     * Only replace the image if a NEW image was uploaded.
     */
    if ($request->hasFile('image')) {
        /*
         * Delete the old uploaded image.
         *
         * Do not delete old seeded /images/... files.
         */
        if (
            $venue->image &&
            ! str_starts_with($venue->image, '/') &&
            ! str_starts_with($venue->image, 'http://') &&
            ! str_starts_with($venue->image, 'https://')
        ) {
            Storage::disk('public')->delete($venue->image);
        }

        $validated['image'] = $request->file('image')->store('venues', 'public');
    } else {
        /*
         * No new image was selected.
         * Keep the existing image.
         */
        unset($validated['image']);
    }

    $venue->update($validated);

    return back()->with('success', 'Venue updated successfully.');
}

    public function destroy(Venue $venue): RedirectResponse
    {
        $this->authorizeAdmin();

        $venue->delete();

        return back()->with('success', 'Venue deleted successfully.');
    }

    public function toggleAvailability(Venue $venue): RedirectResponse
    {
        $this->authorizeAdmin();

        $venue->update([
            'available' => ! $venue->available,
        ]);

        return back()->with('success', 'Venue availability updated.');
    }
}
