<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockHistory extends Model
{
    use HasFactory;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'uuid',
        'variant_uuid',
        'user_id',
        'before_stock',
        'after_stock',
        'current_stock',
        'action',
    ];
    protected $casts = [
        'before_stock' => 'integer',
        'after_stock' => 'integer',
        'current_stock' => 'integer',
    ];

    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_uuid', 'uuid');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
