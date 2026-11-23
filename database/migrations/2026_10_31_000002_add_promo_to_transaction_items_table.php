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
        Schema::table('transaction_items', function (Blueprint $table) {
            $table->uuid('promo_uuid')->nullable()->after('variant_uuid');
            $table->boolean('is_free')->default(false)->after('price');
            $table->foreign('promo_uuid')->references('uuid')->on('promos')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction_items', function (Blueprint $table) {
            $table->dropForeign(['promo_uuid']);
            $table->dropColumn(['promo_uuid', 'is_free']);
        });
    }
};
