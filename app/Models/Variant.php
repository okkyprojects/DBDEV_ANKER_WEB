<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    use HasFactory;
    protected $fillable = [
        'uuid',
        'product_uuid',
        'name',
        'img',
        'price',
        'discount_price',
        'status',
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
        )->withPivot('quantity')->withTimestamps();
    }
}
