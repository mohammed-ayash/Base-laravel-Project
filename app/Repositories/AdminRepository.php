<?php

namespace App\Repositories;

use App\Http\QueryFilter\NoPagination;
use App\Http\QueryFilter\Order\OrderByName;
use App\Http\QueryFilter\Search\AdminSearch;
use App\Http\QueryFilter\Sort;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;

class AdminRepository
{
    public function add(Request $request): Admin
    {
        $admin = new Admin($request->validated());

        if ($request->has('password'))
            $admin->password = bcrypt($request->get('password'));

//        $admin->syncRoles($request->get('role'));

//        $admin = moveFiles($request, $admin, $admin, 'public');
        $admin->save();

        return $admin;
    }

}
