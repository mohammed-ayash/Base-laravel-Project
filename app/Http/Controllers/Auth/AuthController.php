<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\Admin\LoginAdminRequest;
use App\Http\Requests\AdminRequest;
use App\Models\Admin;
use App\Repositories\AdminRepository;
use Illuminate\Http\JsonResponse;

class AuthController
{
    private $adminRepository;

    public function __construct(AdminRepository $adminRepository)
    {
        $this->adminRepository = $adminRepository;
    }

    public function register(AdminRequest $request): JsonResponse
    {
        $admin = $this->adminRepository->add($request);

        if (!$admin->token) {
            $token = $admin->createToken('API');
            $admin->token = $token->plainTextToken;
            $admin->save();
        }

        return response()->json([
            'result' => 'success',
            'content' => $admin,
        ], 200);
    }

    public function login(LoginAdminRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');
        if (auth('admin')->attempt($credentials)) {
            $admin = Admin::whereId(auth('admin')->id())->first();
            if (!$admin->token) {
                $token = $admin->createToken('API');
                $admin->token = $token->plainTextToken;
                $admin->save();
            }

            return response()->json([
                'result' => 'success',
                'content' => [
                    'admin' => $admin,
                    'token' => $admin->token,
                ],
            ], 200);
        }
        return response()->json([
            'result' => 'error',
            'error_des' => __('auth.email_password_invalid'),
        ], 400);
    }

    public function profile(): JsonResponse
    {
        $admin = Admin::findOrFail(auth()->id());

        return response()->json([
            'result' => 'success',
            'content' => $admin,
        ], 200);
    }

}
