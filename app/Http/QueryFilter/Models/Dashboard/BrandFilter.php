<?php


namespace App\Http\QueryFilter\Models\Dashboard;

use Illuminate\Http\Request;
use App\Http\QueryFilter\QueryFilter;

class BrandFilter extends QueryFilter {
    public function __construct(Request $request)
    {
        $this->validationArray = [
            'name' => 'string',
            'description' => 'string'
        ];
        parent::__construct($request);
    }
};
