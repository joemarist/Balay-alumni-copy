<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->decimal('payment_amount', 10, 2)->nullable()->after('total_amount');
            $table->string('payment_reference')->nullable()->after('payment_amount');
            $table->string('payment_proof')->nullable()->after('payment_reference');

            $table->enum('payment_status', [
                'unpaid',
                'pending',
                'confirmed',
                'rejected',
            ])->default('unpaid')->after('payment_proof');

            $table->text('payment_remarks')->nullable()->after('payment_status');
            $table->timestamp('payment_submitted_at')->nullable()->after('payment_remarks');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn([
                'payment_amount',
                'payment_reference',
                'payment_proof',
                'payment_status',
                'payment_remarks',
                'payment_submitted_at',
            ]);
        });
    }
};
