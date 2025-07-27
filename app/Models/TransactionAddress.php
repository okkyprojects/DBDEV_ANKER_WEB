<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionAddress extends Model
{
    use HasFactory;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'uuid',
        'transaction_uuid',
        'user_id',
        'province_id',
        'city_id',
        'district_id',
        'category',
        'name',
        'phone_number',
        'is_main',
        'address',
        'postal_code',
        'note',
    ];
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
