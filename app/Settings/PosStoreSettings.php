<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class PosStoreSettings extends Settings
{
    public string $store_name = 'Balay Alumni';

    public ?string $store_address = null;

    public ?string $store_phone = null;

    public ?string $store_email = null;

    public string $currency = 'PHP';

    public string $currency_symbol = '₱';

    public float $tax_rate = 0.0;

    public ?string $receipt_header = null;

    public ?string $receipt_footer = null;

    public bool $show_store_contact_on_receipt = true;

    public int $low_stock_threshold = 10;

    public string $invoice_prefix = 'INV-';

    public static function group(): string
    {
        return 'pos';
    }
}
