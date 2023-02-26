<?php

namespace App\Exceptions;

use Throwable;
use BadMethodCallException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        if ($e instanceof ValidationException) {
            return response()->json([
                'result' => 'error',
                'error_message' => $e->validator->errors(),
            ], 400);

        } else if ($e instanceof ModelNotFoundException) {
            return response()->json([
                'result' => 'error',
                'error_message' => 'Item Not Found',
            ], 404);

        } else if ($e instanceof UnauthorizedException) {
            return response()->json([
                'result' => 'error',
                'error_message' => 'no permission to admit this action',
            ], 403);
        } else if ($e instanceof AuthenticationException) {
            return response()->json([
                'result' => 'error',
                'error_message' => 'Unauthenticated',
            ], 403);

        } else if ($e instanceof ThrottleRequestsException) {
            return response()->json([
                'result' => 'error',
                'error_message' => __('auth.throttle'),
            ], 429);

        } else if ($e instanceof BadMethodCallException) {
            return response()->json([
                'result' => 'error',
                'error_message' => $e->getMessage(),
            ], 404);
        }

        return parent::render($request, $e);
    }
}
