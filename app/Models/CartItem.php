<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CartItem extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'uuid',
        'cart_uuid',
        'variant_uuid',
        'quantity',
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_uuid', 'uuid')->withTrashed();
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_uuid', 'uuid')->withTrashed();
    }
}
