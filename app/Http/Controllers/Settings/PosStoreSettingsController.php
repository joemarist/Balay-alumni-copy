<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Settings\PosStoreSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PosStoreSettingsController extends Controller
{
    /**
     * Show the POS store settings page.
     */
    public function edit(Request $request)
    {
        abort_unless($request->user()?->can('view-settings'), 403);

        $settings = app(PosStoreSettings::class);

        return Inertia::render('settings/pos-store', [
            'settings' => [
                'store_name' => $settings->store_name ?? '',
                'store_address' => $settings->store_address ?? '',
                'store_phone' => $settings->store_phone ?? '',
                'store_email' => $settings->store_email ?? '',
                'currency' => $settings->currency ?? 'PHP',
                'currency_symbol' => $settings->currency_symbol ?? '₱',
                'tax_rate' => $settings->tax_rate ?? 0,
                'receipt_header' => $settings->receipt_header ?? '',
                'receipt_footer' => $settings->receipt_footer ?? '',
                'show_store_contact_on_receipt' => (bool) ($settings->show_store_contact_on_receipt ?? true),
                'low_stock_threshold' => (int) ($settings->low_stock_threshold ?? 10),
                'invoice_prefix' => $settings->invoice_prefix ?? 'INV-',
            ],
            'canManageSettings' => $request->user()->can('manage-settings'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the POS store settings.
     */
    public function update(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->can('manage-settings'), 403);

        // Normalize checkbox: FormData sends "on" when checked, omits field when unchecked.
        // Laravel's boolean validation only accepts true/false/1/0/"1"/"0".
        $request->merge([
            'show_store_contact_on_receipt' => in_array(
                $request->input('show_store_contact_on_receipt'),
                ['1', 'on', 'true', true, 1],
                true,
            ),
        ]);

        $validated = $request->validate([
            'store_name' => ['required', 'string', 'max:255'],
            'store_address' => ['nullable', 'string', 'max:500'],
            'store_phone' => ['nullable', 'string', 'max:50'],
            'store_email' => ['nullable', 'email', 'max:255'],
            'currency' => ['required', 'string', 'max:10'],
            'currency_symbol' => ['required', 'string', 'max:10'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'receipt_header' => ['nullable', 'string', 'max:500'],
            'receipt_footer' => ['nullable', 'string', 'max:500'],
            'show_store_contact_on_receipt' => ['required', 'boolean'],
            'low_stock_threshold' => ['required', 'integer', 'min:0'],
            'invoice_prefix' => ['required', 'string', 'max:20'],
        ]);

        $settings = app(PosStoreSettings::class);

        foreach ($validated as $key => $value) {
            if (in_array($key, ['store_address', 'store_phone', 'store_email', 'receipt_header', 'receipt_footer'], true) && $value === '') {
                $value = null;
            }

            $settings->{$key} = $value;
        }

        $settings->save();

        return redirect()->route('pos-settings.edit')->with('status', 'POS store settings updated successfully.');
    }
}
