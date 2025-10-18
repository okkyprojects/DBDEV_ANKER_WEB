<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'uuid',
        'transaction_code',
        'user_id',
        'completed_by',
        'total_price',
        'admin_fee',
        'grand_total',
        'status',
        'paid_at',
        'unpaid_at',
        'processing_at',
        'shipping_at',
        'completed_at',
        'failed_at',
        'expired_at',
        'note',
        'note_transaction',
        'file',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->withTrashed();
    }
    public function completedBy()
    {
        return $this->belongsTo(User::class, 'completed_by', 'id')->withTrashed();
    }
    public function items()
    {
        return $this->hasMany(TransactionItem::class, 'transaction_uuid', 'uuid')->withTrashed();
    }
    public function address()
    {
        return $this->hasOne(TransactionAddress::class)->withTrashed();
    }
    public function bill()
    {
        return $this->hasOne(TransactionBill::class)->withTrashed();
    }
}
