<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    protected $fillable = [
        'uuid',
        'user_id',
        'total_price',
        'admin_fee',
        'grand_total',
        'status',
        'unpaid_at',
        'processing_at',
        'shipping_at',
        'completed_at',
        'failed_at',
        'expired_at',
        'note',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Relasi ke transaction_items (jika nanti ditambahkan)
     */
    public function items()
    {
        return $this->hasMany(TransactionItem::class, 'transaction_uuid', 'uuid');
    }
}
