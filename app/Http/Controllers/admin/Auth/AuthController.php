<?php

namespace App\Http\Controllers\admin\Auth;

use App\Http\Requests\Admin\LoginAdminRequest;
use App\Http\Traits\Responsible;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AuthController
{
    use Responsible;

    public function login(LoginAdminRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');
        if (auth('api')->attempt($credentials)) {
            $admin = auth('api')->user();
            if (!$admin->token) {
                $token = $admin->createToken('admin-api', [User::ABILITIES['admin']]);
                $admin->token = $token->plainTextToken;
                $admin->save();
            }

            return $this->respondSuccess([
                'admin' => $admin,
                'token' => $admin->token,
            ]);
        }

        return $this->respondError(__('auth.email_password_invalid'), null , 400);
    }

    public function profile(): JsonResponse
    {
        return $this->respondSuccess(auth()->user());
    }

}
