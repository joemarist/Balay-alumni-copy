<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MenuItemController extends Controller
{
    /**
     * Display all menu items.
     */
    public function index()
    {
        $menuItems = MenuItem::latest()->get();

        return Inertia::render('AdminCafe', [
            'menuItems' => $menuItems,
        ]);
    }

    /**
     * Store a new menu item.
     */
    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'available' => ['nullable', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        // Upload image if provided
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('cafe', 'public');
        }

        // Make sure availability has a default value
        $validated['available'] = $request->boolean('available', true);

        MenuItem::create($validated);

        return redirect()
            ->route('admin.cafe')
            ->with('success', 'Menu item added successfully.');
    }

    /**
     * Update an existing menu item.
     */
    public function update(Request $request, MenuItem $menuItem)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'available' => ['nullable', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        // If a new image was uploaded
        if ($request->hasFile('image')) {

            // Delete the old image
            if ($menuItem->image && Storage::disk('public')->exists($menuItem->image)) {
                Storage::disk('public')->delete($menuItem->image);
            }

            // Store the new image
            $validated['image'] = $request->file('image')->store('cafe', 'public');
        } else {
            // Keep the existing image
            unset($validated['image']);
        }

        $validated['available'] = $request->boolean('available', $menuItem->available);

        $menuItem->update($validated);

        return redirect()
            ->route('admin.cafe')
            ->with('success', 'Menu item updated successfully.');
    }

    /**
     * Delete a menu item.
     */
    public function destroy(MenuItem $menuItem)
    {
        // Delete the item's image from storage
        if ($menuItem->image && Storage::disk('public')->exists($menuItem->image)) {
            Storage::disk('public')->delete($menuItem->image);
        }

        $menuItem->delete();

        return redirect()
            ->route('admin.cafe')
            ->with('success', 'Menu item deleted successfully.');
    }

    /**
     * Toggle menu item availability.
     */
    public function toggleAvailability(MenuItem $menuItem)
    {
        $menuItem->update([
            'available' => !$menuItem->available,
        ]);

        return redirect()
            ->route('admin.cafe')
            ->with(
                'success',
                $menuItem->available
                    ? 'Menu item is now available.'
                    : 'Menu item is now unavailable.'
            );
    }
}