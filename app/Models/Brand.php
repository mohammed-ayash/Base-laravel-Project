<?php

namespace App\Models;

use App\Traits\Filterable;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory, Translatable, Filterable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['image'];

    public $translatedAttributes = ['name', 'description'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

    protected $filterable = [
        'name' => 'like',
        'description' => 'like'
    ];

    protected $sort = ['id', 'name', 'description', 'created_at'];
}
