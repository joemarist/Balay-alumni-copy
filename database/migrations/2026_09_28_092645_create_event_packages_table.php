<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_packages', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('type');

            $table->text('description')->nullable();

            $table->decimal('price', 10, 2);

            $table->unsignedInteger('included_duration_hours');

            $table->json('features')->nullable();
            $table->json('addons')->nullable();

            $table->boolean('popular')->default(false);
            $table->boolean('available')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_packages');
    }
};
