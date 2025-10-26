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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('name');
            $table->uuid('category_uuid')->nullable();
            $table->uuid('brand_uuid')->nullable();
            $table->text('img')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->foreign('category_uuid')->references('uuid')->on('categories')->nullOnDelete();
            $table->foreign('brand_uuid')->references('uuid')->on('brands')->nullOnDelete();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
