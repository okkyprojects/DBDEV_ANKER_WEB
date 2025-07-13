<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'city_id',
        'nama',
    ];
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }
}
