<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionBill extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'uuid',
        'transaction_uuid',
        'account_number',
        'bank_name',
        'account_holder_name',
        'is_main',
    ];
    public function transaction()
    {
        return $this->belongsTo(Transaction::class)->withTrashed();
    }
}
