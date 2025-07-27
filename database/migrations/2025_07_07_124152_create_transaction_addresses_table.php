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
        Schema::create('transaction_addresses', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->uuid('transaction_uuid')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedInteger('province_id')->nullable();
            $table->unsignedInteger('city_id')->nullable();
            $table->unsignedInteger('district_id')->nullable();
            $table->enum('category', ['rumah', 'kantor'])->default('rumah');
            $table->string('name');
            $table->string('phone_number');
            // (1 = utama, 0 = tidak)
            $table->boolean('is_main')->default(false);
            $table->text('address');
            $table->string('postal_code', 10);
            $table->text('note')->nullable();
            $table->timestamps();
            $table->foreign('transaction_uuid')->references('uuid')->on('transactions')->nullOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_addresses');
    }
};
