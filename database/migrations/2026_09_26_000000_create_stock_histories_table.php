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
        Schema::create('stock_histories', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->uuid('variant_uuid')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->bigInteger('before_stock');
            $table->bigInteger('after_stock');
            $table->bigInteger('current_stock');
            $table->string('action');
            $table->timestamps();
            $table->foreign('variant_uuid')->references('uuid')->on('variants')->nullOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_histories');
    }
};
