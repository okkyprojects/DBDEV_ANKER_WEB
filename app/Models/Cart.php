<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    protected $fillable = [
        'uuid',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Relasi ke Variant
     */
    public function variants()
    {
        return $this->belongsToMany(Variant::class, 'cart_items', 'cart_uuid', 'variant_uuid')
            ->withPivot('quantity', 'price')
            ->withTimestamps();
    }
}
