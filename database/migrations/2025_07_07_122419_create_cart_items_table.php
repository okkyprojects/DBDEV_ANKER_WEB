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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->uuid('cart_uuid');
            $table->uuid('variant_uuid');
            $table->unsignedInteger('quantity')->default(1);
            $table->timestamps();
            $table->foreign('cart_uuid')->references('uuid')->on('carts')->onDelete('cascade');
            $table->foreign('variant_uuid')->references('uuid')->on('variants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
