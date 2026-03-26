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
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['Sheet', 'Roll', 'Unit']);
            $table->decimal('width', 10, 2)->nullable(); // In meters or cm depending on logic
            $table->decimal('height', 10, 2)->nullable();
            $table->decimal('thickness', 10, 2)->nullable();
            $table->decimal('cost_per_unit', 10, 2);
            $table->decimal('current_stock', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
