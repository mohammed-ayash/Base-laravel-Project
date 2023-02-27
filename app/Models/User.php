<?php

namespace App\Models;

use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, Filterable;

    const ABILITIES = [
        'admin' => 'is-admin',
        'customer' => 'is-customer'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'email', 'password', 'phone_number', 'avatar'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password', 'remember_token', 'token'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

    /**
     * The attributes that use as filter.
     *
     * @var array<int, string>
     */
    protected $filterable = [
        'name' => 'like',
        'email' => 'like',
        'phone_number' => 'like',
    ];

    protected $sorts = ['id', 'name', 'email', 'phone_number', 'created_at'];


    public function userPhoneVerified(): bool
    {
        return !is_null($this->phone_verified_at);
    }

    public function phoneVerifiedAt()
    {
        return $this->forceFill([
            'phone_verified_at' => $this->freshTimestamp(),
        ])->save();
    }
}
