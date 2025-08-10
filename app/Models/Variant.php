<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    use HasFactory;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'uuid',
        'sku',
        'product_uuid',
        'name',
        'img',
        'price',
        'discount_price',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_uuid', 'uuid');
    }
    public function carts()
    {
        return $this->belongsToMany(
            Cart::class,
            'cart_items',
            'variant_uuid',
            'cart_uuid',
            'uuid',
            'uuid'
        )->withPivot('uuid', 'quantity', 'created_at', 'updated_at')
            ->withTimestamps();
    }
    public function stocks()
    {
        return $this->hasMany(VariantStock::class, 'variant_uuid', 'uuid');
    }
    public function total_stock()
    {
        return $this->hasOne(VariantStock::class, 'variant_uuid', 'uuid')
            ->selectRaw('variant_uuid,
            SUM(quantity) - (
                SELECT COALESCE(SUM(quantity), 0)
                FROM transaction_items
                WHERE transaction_items.variant_uuid = variant_stocks.variant_uuid
            ) as total_stock')
            ->groupBy('variant_uuid')
            ->withDefault([
                'total_stock' => 0
            ]);
    }
}
