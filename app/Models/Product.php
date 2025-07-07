<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'uuid',
        'name',
        'category_uuid',
        'brand_uuid',
        'status',
        'img',
        'description',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_uuid', 'uuid');
    }

    /**
     * Relasi ke Brand
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_uuid', 'uuid');
    }

    public function variants()
    {
        return $this->hasMany(Variant::class, 'product_uuid', 'uuid');
    }
}
