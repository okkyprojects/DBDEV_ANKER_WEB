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
        Schema::create('transaction_bills', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->uuid('transaction_uuid')->nullable();
            $table->string('account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('account_holder_name')->nullable();
            $table->boolean('is_main')->default(false);
            $table->timestamps();
            $table->foreign('transaction_uuid')->references('uuid')->on('transactions')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_bills');
    }
};
