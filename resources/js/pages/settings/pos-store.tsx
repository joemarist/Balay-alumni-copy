import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PosSettings = {
    store_name: string;
    store_address: string;
    store_phone: string;
    store_email: string;
    currency: string;
    currency_symbol: string;
    tax_rate: number;
    receipt_header: string;
    receipt_footer: string;
    show_store_contact_on_receipt: boolean;
    low_stock_threshold: number;
    invoice_prefix: string;
};

type PageProps = {
    auth: Auth;
    settings: PosSettings;
    canManageSettings: boolean;
    status?: string;
    errors?: Record<string, string>;
};

export default function PosStoreSettingsPage({
    settings,
    canManageSettings,
    status,
}: PageProps) {
    const { auth, errors } = usePage<PageProps>().props;
    const isAdmin = auth.user.roles?.includes('admin') ?? false;
    const isStaff = auth.user.roles?.includes('staff') ?? false;
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const payload = Object.fromEntries(formData.entries());

        // Checkboxes omit the field entirely when unchecked — explicitly set to '1' or '0'
        // so the value survives Inertia's FormData serialization and passes Laravel's boolean validation.
        payload.show_store_contact_on_receipt = formData.has('show_store_contact_on_receipt') ? '1' : '0';

        router.put('/settings/pos', payload, {
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <>
            <Head title="POS Store Settings" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="POS Store Settings"
                    description="Manage the café and store configuration used for POS operations."
                />

                {!canManageSettings && (
                    <div className="rounded-xl border border-[#eadfd9] bg-[#fffaf9] p-3 text-sm text-[#765f63]">
                        {isAdmin || isStaff
                            ? 'You have read-only access to these settings.'
                            : 'You do not have access to POS store settings.'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="store_name">Store name</Label>
                            <Input
                                id="store_name"
                                name="store_name"
                                defaultValue={settings.store_name ?? ''}
                                disabled={!canManageSettings}
                            />
                            <InputError message={errors?.store_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="store_address">Store address</Label>
                            <Input
                                id="store_address"
                                name="store_address"
                                defaultValue={settings.store_address ?? ''}
                                disabled={!canManageSettings}
                            />
                            <InputError message={errors?.store_address} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="store_phone">Store phone</Label>
                                <Input
                                    id="store_phone"
                                    name="store_phone"
                                    defaultValue={settings.store_phone ?? ''}
                                    disabled={!canManageSettings}
                                />
                                <InputError message={errors?.store_phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="store_email">Store email</Label>
                                <Input
                                    id="store_email"
                                    type="email"
                                    name="store_email"
                                    defaultValue={settings.store_email ?? ''}
                                    disabled={!canManageSettings}
                                />
                                <InputError message={errors?.store_email} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Input
                                    id="currency"
                                    name="currency"
                                    defaultValue={settings.currency ?? 'PHP'}
                                    disabled={!canManageSettings}
                                />
                                <InputError message={errors?.currency} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="currency_symbol">Currency symbol</Label>
                                <Input
                                    id="currency_symbol"
                                    name="currency_symbol"
                                    defaultValue={settings.currency_symbol ?? '₱'}
                                    disabled={!canManageSettings}
                                />
                                <InputError message={errors?.currency_symbol} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tax_rate">Tax rate (%)</Label>
                                <Input
                                    id="tax_rate"
                                    name="tax_rate"
                                    type="number"
                                    step="0.01"
                                    defaultValue={settings.tax_rate ?? 0}
                                    disabled={!canManageSettings}
                                />
                                <InputError message={errors?.tax_rate} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="receipt_header">Receipt header</Label>
                            <Input
                                id="receipt_header"
                                name="receipt_header"
                                defaultValue={settings.receipt_header ?? ''}
                                disabled={!canManageSettings}
                            />
                            <InputError message={errors?.receipt_header} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="receipt_footer">Receipt footer</Label>
                            <Input
                                id="receipt_footer"
                                name="receipt_footer"
                                defaultValue={settings.receipt_footer ?? ''}
                                disabled={!canManageSettings}
                            />
                            <InputError message={errors?.receipt_footer} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="low_stock_threshold">Low stock threshold</Label>
                                <Input
                                    id="low_stock_threshold"
                                    name="low_stock_threshold"
                                    type="number"
                                    min="0"
                                    defaultValue={settings.low_stock_threshold ?? 10}
                                    disabled={!canManageSettings}
                                />
                                <InputError message={errors?.low_stock_threshold} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="invoice_prefix">Invoice prefix</Label>
                                <Input
                                    id="invoice_prefix"
                                    name="invoice_prefix"
                                    defaultValue={settings.invoice_prefix ?? 'INV-'}
                                    disabled={!canManageSettings}
                                />
                                <InputError message={errors?.invoice_prefix} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-[#eadfd9] bg-[#fffaf9] p-3">
                            <input
                                type="checkbox"
                                id="show_store_contact_on_receipt"
                                name="show_store_contact_on_receipt"
                                defaultChecked={settings.show_store_contact_on_receipt ?? true}
                                value="1"
                                disabled={!canManageSettings}
                                className="h-4 w-4 rounded border-[#b89b93] text-[#7b3f3d] focus:ring-[#7b3f3d]"
                            />
                            <Label htmlFor="show_store_contact_on_receipt">
                                Show store contact on receipt
                            </Label>
                        </div>

                        {status && (
                            <div className="rounded-xl border border-[#d7f0dd] bg-[#edf9ef] px-3 py-2 text-sm font-medium text-[#235b38]">
                                {status}
                            </div>
                        )}

                        {canManageSettings && (
                            <div className="flex justify-end">
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save POS settings'}
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { Auth } from '@/types';

PosStoreSettingsPage.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'POS Store Settings',
                href: '/settings/pos',
            },
        ]}
    >
        <SettingsLayout>{page}</SettingsLayout>
    </AppLayout>
);
