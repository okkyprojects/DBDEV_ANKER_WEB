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
        Schema::create('promos', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type')->default('qty'); // qty = minimal jumlah pcs, value = minimal nominal belanja (Rp)
            $table->uuid('product_uuid')->nullable(); // barang yang harus dibeli
            $table->bigInteger('min_purchase'); // per kelipatan, dibulatkan ke bawah
            $table->uuid('free_variant_uuid')->nullable(); // barang gratis
            $table->unsignedInteger('free_quantity')->default(1); // pcs gratis per kelipatan
            $table->unsignedInteger('quota'); // maksimal total pcs gratis
            $table->unsignedInteger('used_quota')->default(0);
            $table->timestamp('start_at')->nullable();
            $table->timestamp('end_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->foreign('product_uuid')->references('uuid')->on('products')->nullOnDelete();
            $table->foreign('free_variant_uuid')->references('uuid')->on('variants')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
