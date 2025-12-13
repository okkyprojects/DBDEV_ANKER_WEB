<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use HasFactory;
    protected $fillable = [
        'uuid',
        'name',
        'status',
        'img',
    ];
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    public function products()
    {
        return $this->hasMany(Product::class, 'brand_uuid', 'uuid');
    }
}
