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
        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('transaction_uuid')->nullable();
            $table->uuid('variant_uuid')->nullable(); 
            $table->string('product_name');       
            $table->string('variant_name'); 
            $table->integer('quantity')->default(1);
            $table->decimal('price', 16, 2);    
            $table->decimal('subtotal', 16, 2); 
            $table->timestamps();
            $table->foreign('transaction_uuid')->references('uuid')->on('transactions')->nullOnDelete();
            $table->foreign('variant_uuid')->references('uuid')->on('variants')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions_items');
    }
};
