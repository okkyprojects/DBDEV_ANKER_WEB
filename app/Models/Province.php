<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'name',
    ];

    public function sellers()
    {
        return $this->hasMany(Seller::class, 'province_id', 'id');
    }
}
