<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function index(): Response
    {
        $venues = Venue::orderBy('name')->get();

        return Inertia::render('UserVenues', [
            'venues' => $venues,
        ]);
    }

    public function adminIndex(): Response
    {
        $this->authorizeAdmin();

        $venues = Venue::orderBy('name')->get();

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
            'capacity_pax' => ['required', 'integer', 'min:1'],
            'capacity_label' => ['nullable', 'string', 'max:255'],
            'rate' => ['required', 'numeric', 'min:0'],
            'rate_duration' => ['required', 'string', 'max:255'],
            'inclusions' => ['required', 'array', 'min:1'],
            'inclusions.*' => ['string', 'max:255'],
            'note' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'available' => ['sometimes', 'boolean'],
        ]);

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
            'capacity_pax' => ['required', 'integer', 'min:1'],
            'capacity_label' => ['nullable', 'string', 'max:255'],
            'rate' => ['required', 'numeric', 'min:0'],
            'rate_duration' => ['required', 'string', 'max:255'],
            'inclusions' => ['required', 'array', 'min:1'],
            'inclusions.*' => ['string', 'max:255'],
            'note' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'available' => ['sometimes', 'boolean'],
        ]);

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
