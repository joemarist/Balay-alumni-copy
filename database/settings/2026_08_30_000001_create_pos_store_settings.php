<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('pos.store_name', 'Balay Alumni');
        $this->migrator->add('pos.store_address', null);
        $this->migrator->add('pos.store_phone', null);
        $this->migrator->add('pos.store_email', null);
        $this->migrator->add('pos.currency', 'PHP');
        $this->migrator->add('pos.currency_symbol', '₱');
        $this->migrator->add('pos.tax_rate', 0);
        $this->migrator->add('pos.receipt_header', null);
        $this->migrator->add('pos.receipt_footer', null);
        $this->migrator->add('pos.show_store_contact_on_receipt', true);
        $this->migrator->add('pos.low_stock_threshold', 10);
        $this->migrator->add('pos.invoice_prefix', 'INV-');
    }
};
