<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariantStock extends Model
{
    use HasFactory;
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'uuid',
        'variant_uuid',
        'quantity',
        'note',
    ];
    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_uuid', 'uuid');
    }
}
