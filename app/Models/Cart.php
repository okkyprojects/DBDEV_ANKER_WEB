<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cart extends Model
{
    use HasFactory;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'uuid',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->withTrashed();
    }

    /**
     * Relasi ke Variant
     */
    public function variants()
    {
        return $this->belongsToMany(
            Variant::class,
            'cart_items',
            'cart_uuid',
            'variant_uuid',
            'uuid',
            'uuid'
        )
            ->withPivot('uuid', 'quantity', 'created_at', 'updated_at')
            ->withTimestamps()->withTrashed();
    }
}
