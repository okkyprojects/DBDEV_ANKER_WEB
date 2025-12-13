<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guard_name = 'web';
    protected $fillable = [
        'name',
        'img',
        'email',
        'gender',
        'dob',
        'img',
        'phone_number',
        'password',
        'otp',
        'otp_expires_at',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'otp',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'otp_expires_at' => 'datetime',
    ];

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
    public function seller()
    {
        return $this->hasOne(Seller::class);
    }
    public function main_address()
    {
        return $this->hasOne(Address::class)->where('is_main', true)
            ->with(['province', 'city', 'district']);
    }
    // public function roles()
    // {
    //     return $this->belongsToMany(\Spatie\Permission\Models\Role::class, 'model_has_roles', 'model_id', 'role_id');
    // }
}
