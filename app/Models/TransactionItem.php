<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'transaction_uuid',
        'variant_uuid',
        'product_name',
        'variant_name',
        'quantity',
        'price',
        'subtotal',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transaction_uuid', 'uuid');
    }

    /**
     * Relasi ke Variant
     */
    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_uuid', 'uuid');
    }
}
