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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('material_id')->constrained()->restrictOnDelete();
            $table->decimal('width', 10, 2); // W
            $table->decimal('height', 10, 2); // H
            $table->enum('printing_type', ['DTF', 'Laser', 'CNC'])->nullable();
            $table->string('design_attachment_url')->nullable();

            // Financials
            $table->decimal('processing_fee', 10, 2)->default(0);
            $table->decimal('profit_margin', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
