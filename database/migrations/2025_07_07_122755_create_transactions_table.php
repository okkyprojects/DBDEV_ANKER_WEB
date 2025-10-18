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
            $table->unsignedBigInteger('completed_by')->nullable();
            $table->string('transaction_code')->unique();
            $table->bigInteger('total_price');
            $table->bigInteger('admin_fee')->default(0);
            $table->bigInteger('grand_total');
            $table->unsignedTinyInteger('status')->default(0); // 0=Belum Dibayar , 1=Menunggu Konfirmasi, 2=Pesanan Diproses 3=Pesanan Dikirim, 4=Pesanan Selesai, 5=Cancel
            $table->timestamp('unpaid_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('processing_at')->nullable();
            $table->timestamp('shipping_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->text('note')->nullable();
            $table->text('note_transaction')->nullable();
            $table->string('file')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('completed_by')->references('id')->on('users')->nullOnDelete();
            $table->softDeletes();
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
