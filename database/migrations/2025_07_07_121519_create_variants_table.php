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
        Schema::create('variants', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->uuid('product_uuid')->nullable();
            $table->string('name');
            $table->string('sku');
            $table->text('img')->nullable();
            $table->bigInteger('price')->default(0);
            $table->bigInteger('discount_price')->nullable();
            $table->bigInteger('stock')->default(0);
            $table->timestamps();
            $table->foreign('product_uuid')->references('uuid')->on('products')->nullOnDelete();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variants');
    }
};
