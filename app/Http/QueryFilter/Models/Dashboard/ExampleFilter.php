<?php


namespace App\Http\QueryFilter\Models\Dashboard;

use Illuminate\Http\Request;
use App\Http\QueryFilter\QueryFilter;

class ExampleFilter extends QueryFilter
{

    public function __construct(Request $request)
    {
        $this->validationArray = [
            'section_id' => 'numeric',
            'special_offer' => 'bool',
            'nearest_expired' => 'bool',
            'categories' => 'array',
            'categories.*' => 'numeric',
            'price' => 'array',
            'price.*' => 'numeric',
            'brands' => 'array',
            'brands.*' => 'numeric',

            'load_id' => 'array',
            'load_id.*' => 'numeric',
        ];

        parent::__construct($request);
    }


    public function section_id($section_id)
    {
        return $this->builder->where('section_id', $section_id);
    }

    public function published($published)
    {
        return $this->builder->where('publish', $published);
    }
}
