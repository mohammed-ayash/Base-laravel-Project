<?php

namespace App\Traits;

use App\Http\QueryFilter\QueryFilter;
use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    /**
     * @param $query
     * @param QueryFilter $filter
     * @param bool $execute
     * @return Builder|mixed|void
     */
    public function scopeFilter($query, QueryFilter $filter, bool $execute = true)
    {

        // if execute is false then no execute on this query at all
        if(! $execute)
            return $filter->apply($query);

        // if $pagination is false then no pagination on this query at all
        elseif (request()->has('paginate') && !request()->get('paginate'))
            return ['data'=> $filter->apply($query)->get()];

        // apply pagination with default value of 8
        elseif($perPage = request()->get('perPage') ?? 8)
            return $filter->apply($query, $perPage);
    }

    public function getSorts()
    {
        return $this->sorts ?? [];
    }
}
