<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'seller_uuid',
        'account_number',
        'bank_name',
        'account_holder_name',
        'is_main',
    ];

    /**
     * Relationship: a bill belongs to a user.
     */
    public function seller()
    {
        return $this->belongsTo(Seller::class, 'seller_uuid', 'uuid');
    }
}
