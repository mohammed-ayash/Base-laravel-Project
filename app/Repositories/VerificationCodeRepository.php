<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\VerificationCode;
use Carbon\Carbon;

class VerificationCodeRepository
{
    public function findValidOne(User $user): ?VerificationCode
    {
        # User Does not Have Any Existing OTP
        $verificationCode = VerificationCode::where('user_id', $user->id)->latest()->first();

        $now = Carbon::now();

        if($verificationCode && $now->isBefore($verificationCode->expire_at)){
            return $verificationCode;
        }

        return null;
    }

    public function create(User $user, $phoneNumber): VerificationCode
    {
        return VerificationCode::create([
            'user_id' => $user->id,
            'phone_number' => $phoneNumber,
            'otp' => rand(123456, 999999),
            'expire_at' => Carbon::now()->addMinutes(10)// TODO use const value in Model
        ]);
    }

    public function findByPhoneNumber($phoneNumber): ?VerificationCode
    {
        return VerificationCode::wherePhoneNumber($phoneNumber)->latest()->first();
    }

}
