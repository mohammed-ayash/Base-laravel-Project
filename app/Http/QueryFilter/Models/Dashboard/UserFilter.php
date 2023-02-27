<?php


namespace App\Http\QueryFilter\Models\Dashboard;

use Illuminate\Http\Request;
use App\Http\QueryFilter\QueryFilter;

class UserFilter extends QueryFilter
{

    public function __construct(Request $request)
    {
        $this->validationArray = [
            'name' => 'string',
            'email' => 'string',
            'phone_number' => 'numeric',
        ];

        parent::__construct($request);
    }

}
