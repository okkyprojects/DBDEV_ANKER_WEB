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
        Schema::create('variant_stocks', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->uuid('variant_uuid')->nullable();
            $table->bigInteger('quantity');
            $table->string('note')->nullable();
            $table->timestamps();

            $table->foreign('variant_uuid')->references('uuid')->on('variants')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_stocks');
    }
};
