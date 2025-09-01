<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionItem extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'transaction_uuid',
        'variant_uuid',
        'product_name',
        'variant_name',
        'quantity',
        'price',
        'img',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transaction_uuid', 'uuid')->withTrashed();;
    }

    /**
     * Relasi ke Variant
     */
    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_uuid', 'uuid')->withTrashed();;
    }
}
