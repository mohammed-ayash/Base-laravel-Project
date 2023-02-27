<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Session;

class Localization
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {

        if (Session::has('applocale')) {
            $lang = Session::get('applocale');
        } else if (request('applocale')) {
            $lang = request('applocale');
        } else {
            $lang = 'en';
        }

        if ($request->hasHeader('Accept-Language')) {
            if(array_key_exists($request->header('Accept-Language'),config('languages'))){
                $lang = $request->header('Accept-Language');
            }
        }



        // set laravel localization
        app()->setLocale($lang);
        Config::set('translatable.locale', $lang);
        Session::put('applocale', $lang);

        return $next($request);
    }
}
