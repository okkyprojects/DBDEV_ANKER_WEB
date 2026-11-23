<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    use HasFactory;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'uuid',
        'name',
        'description',
        'type',
        'product_uuid',
        'min_purchase',
        'free_variant_uuid',
        'free_quantity',
        'quota',
        'used_quota',
        'start_at',
        'end_at',
        'is_active',
    ];
    protected $casts = [
        'min_purchase' => 'integer',
        'free_quantity' => 'integer',
        'quota' => 'integer',
        'used_quota' => 'integer',
        'start_at' => 'datetime:Y-m-d\TH:i',
        'end_at' => 'datetime:Y-m-d\TH:i',
        'is_active' => 'boolean',
    ];

    /**
     * Barang yang harus dibeli
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_uuid', 'uuid');
    }

    /**
     * Barang yang didapat gratis
     */
    public function free_variant()
    {
        return $this->belongsTo(Variant::class, 'free_variant_uuid', 'uuid');
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class, 'promo_uuid', 'uuid');
    }
}
