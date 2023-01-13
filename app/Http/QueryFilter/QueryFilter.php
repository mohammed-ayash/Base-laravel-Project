<?php

namespace App\Http\QueryFilter;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;


class QueryFilter
{

    protected $request;

    protected $builder;

    protected $validationArray = [];

    /**
     * QueryFilter constructor.
     * @param  Request  $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;

        if($this->validationArray)
            Validator::validate($request->all(), array_merge($this->validationArray, ['sorts' => 'array']));
    }

    /**
     * @param  Builder  $builder
     * @param  null  $perPage
     * @return mixed
     */
    public function apply(Builder $builder, $perPage = null)
    {
        $this->builder = $builder;

        foreach ($this->filters() as $name => $value)
            if (method_exists($this, $name) && $value !== '0' && $value !== '')
                call_user_func_array([$this, $name], array_filter([$value]));
            else if(method_exists($this, $name) && $value === '0' && $value !== '')
                call_user_func_array([$this, $name], [$value]);

        // apply sort
        foreach ($this->sorts() as $name => $type)
            if(in_array($type, ['asc', 'desc']))
            {
                if(method_exists($this, Str::camel(Str::replace('.', ' ', $name)).'Sort'))
                {
                    call_user_func_array([$this, Str::camel(Str::replace('.', ' ', $name)).'Sort'], array_filter([$type]));
                }
                elseif(is_array($this->builder->getModel()->getSorts()) and in_array($name, $this->builder->getModel()->getSorts())) {
                    $this->builder->orderBy($name, $type);
                }
            }

        // handling pagination
        if($perPage) return $this->builder->paginate($perPage)->appends(request()->query());

        return $this->builder;
    }

    public function filters(): array
    {
        return $this->request->all();
    }

    public function sorts()
    {
        return $this->request->get('sorts') ?? [];
    }

    public function load_ids($ids)
    {
        return $this->builder
            ->whereRaw('1 = 1')
            ->orWhereIn($this->builder->getModel()->getTable().'.id', $ids)
            ->orderByRaw(
                'case '. $this->builder->getModel()->getTable().'.id '.
                str_repeat("WHEN ? THEN 1 ", count($ids)). 'END DESC'
                , $ids);
    }
}
