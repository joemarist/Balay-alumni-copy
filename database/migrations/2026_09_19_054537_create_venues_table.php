<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venues', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('description');

            $table->string('category');

            $table->unsignedInteger('capacity_pax');
            $table->string('capacity_label')->nullable();

            $table->decimal('rate', 10, 2);
            $table->string('rate_duration');

            $table->json('inclusions');

            $table->text('note')->nullable();

            $table->string('image')->nullable();

            $table->boolean('available')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venues');
    }
};
