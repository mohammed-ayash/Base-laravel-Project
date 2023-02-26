<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;

trait Responsible
{
    public function respondSuccess($content = [], $paginator = []): JsonResponse
    {
        $res = [
            'result' => 'success',
            'content' => $content,
        ];

        if (!empty($paginator))
            $res['paginator'] = $paginator;

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
