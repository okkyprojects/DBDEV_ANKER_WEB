<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'province_id', 
        'nama',
    ];

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }
    public function districts()
    {
        return $this->hasMany(District::class, 'city_id', 'id');
    }
    public function sellers()
    {
        return $this->hasMany(Seller::class, 'city_id', 'id');
    }
}
