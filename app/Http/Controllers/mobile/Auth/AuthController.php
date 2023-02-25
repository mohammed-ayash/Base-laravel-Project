<?php

namespace App\Http\Controllers\mobile\Auth;

use App\Http\Requests\Admin\LoginAdminRequest;
use App\Http\Requests\AdminRequest;
use App\Http\Requests\api\OtpLoginRequest;
use App\Http\Requests\api\VerifyOtpLoginRequest;
use App\Http\Traits\Responsible;
use App\Models\Admin;
use App\Models\User;
use App\Models\VerificationCode;
use App\Repositories\AdminRepository;
use App\Repositories\UserRepository;
use App\Repositories\VerificationCodeRepository;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class AuthController
{
    use Responsible;

    private UserRepository $userRepository;
    private VerificationCodeRepository $verificationCodeRepository;

    public function __construct(UserRepository $userRepository, VerificationCodeRepository $verificationCodeRepository)
    {
        $this->userRepository = $userRepository;
        $this->verificationCodeRepository = $verificationCodeRepository;
    }

    // Generate OTP
    public function generateOtpCode(OtpLoginRequest $request): JsonResponse
    {
        $user = $this->userRepository->findOrCreate($request->phone_number);

        $verificationCode = $this->verificationCodeRepository->findValidOne($user);
        if (!$verificationCode)
            $verificationCode = $this->verificationCodeRepository->create($user, $request->phone_number);

        //TODO send OTP code via SMS message

        return $this->respondSuccess([
            'message' => "Your OTP To Login is - " . $verificationCode->otp
        ]);

    }

    public function verifyOtpLogin(VerifyOtpLoginRequest $request): JsonResponse
    {
        $verificationCode = $this->verificationCodeRepository->findByPhoneNumber($request->phone_number);
        if (!$verificationCode || $verificationCode->otp !== $request->otp_code)
            return $this->respondError('Your OTP is not correct');

        $now = Carbon::now();
        if ($now->isAfter($verificationCode->expire_at))
            return $this->respondError('Your OTP has been expired');

        $user = $verificationCode->user;
        // Expire The OTP
        $verificationCode->update([
            'expire_at' => Carbon::now()
        ]);

        if (!$user->token) {
            $token = $user->createToken('admin Token', [User::ABILITIES['customer']]);
            $user->token = $token->plainTextToken;
            $user->save();
        }

        return $this->respondSuccess([
            'user' => $user,
            'token' => $user->token
        ]);

    }

    public function profile(): JsonResponse
    {
        return $this->respondSuccess([
            'user' => auth()->user(),
        ]);
    }

}
