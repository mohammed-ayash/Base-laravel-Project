<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

trait Responsible
{
    public function respondSuccess($content = [], $paginator = []): JsonResponse
    {
        $res = [
            'result' => 'success',
            'content' => $content,
        ];

        if ($paginator instanceof LengthAwarePaginator)
            $res['paginator'] = [
                'total_count' => $paginator->total(),
                'limit' => $paginator->perPage(),
                'total_page' => ceil($paginator->total() / $paginator->perPage()),
                'current_page' => $paginator->currentPage(),
            ];


        return response()->json($res, 200);
    }

    public function respondError($message, $validationError = null, $status = 400): JsonResponse
    {
        return response()->json([
            'result' => 'error',
            'error_message' => $message,
            'error_validation' => $validationError,
            'date' => date('Y-m-d')
        ], $status);
    }

    public function respondOut($message): JsonResponse
    {
        return response()->json([
            'result' => 'error',
            'content' => [],
            'error_message' => $message,
            'error_code' => -1,
            'date' => date('Y-m-d')
        ]);
    }

    public function respondMessage($message): JsonResponse
    {
        return response()->json([
            'result' => 'success',
            'content' => [],
            'error_message' => $message,
            'error_code' => 0,
            'date' => date('Y-m-d')
        ]);
    }

    public function respondMobileError($message): JsonResponse
    {
        return response()->json([
            'result' => 'error',
            'content' => $message,
            'error_message' => $message,
            'error_code' => 1,
            'date' => date('Y-m-d')
        ], 200);
    }

}
