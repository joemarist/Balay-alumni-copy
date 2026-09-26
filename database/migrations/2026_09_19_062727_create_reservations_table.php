<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('reservations', function (Blueprint $table) {
        $table->id();

        $table->foreignId('user_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->foreignId('venue_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->string('event_type');
        $table->unsignedInteger('guest_count');

        $table->date('event_date');
        $table->time('start_time');
        $table->time('end_time');

        $table->text('special_requests')->nullable();

        $table->string('payment_method');

        $table->decimal('venue_rental', 10, 2);
        $table->decimal('service_fee', 10, 2);
        $table->decimal('total_amount', 10, 2);

        $table->enum('status', [
            'pending',
            'approved',
            'rejected',
            'cancelled',
            'completed',
        ])->default('pending');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
