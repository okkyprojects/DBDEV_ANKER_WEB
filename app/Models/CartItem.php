<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'cart_uuid',
        'variant_uuid',
        'quantity',
        'price',
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_uuid', 'uuid');
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_uuid', 'uuid');
    }
}
