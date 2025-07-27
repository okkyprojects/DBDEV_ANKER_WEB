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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('transaction_code')->unique();
            $table->decimal('total_price', 16, 2);
            $table->decimal('admin_fee', 16, 2)->default(0);
            $table->decimal('grand_total', 16, 2);
            $table->unsignedTinyInteger('status')->default(0); // 0=unpaid, 1=processing, 2=shipping, 3=completed, 4=failed, 5=expired
            $table->timestamp('unpaid_at')->nullable();
            $table->timestamp('processing_at')->nullable();
            $table->timestamp('shipping_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
