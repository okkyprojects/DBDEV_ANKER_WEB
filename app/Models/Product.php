<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'uuid',
        'name',
        'category_uuid',
        'brand_uuid',
        'img',
        'description',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_uuid', 'uuid')->withTrashed();
    }

    /**
     * Relasi ke Brand
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_uuid', 'uuid')->withTrashed();
    }

    public function variants()
    {
        return $this->hasMany(Variant::class, 'product_uuid', 'uuid')->withTrashed();
    }
}
