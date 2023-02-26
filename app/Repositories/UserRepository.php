<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function findOrCreate($phoneNumber): User
    {
        $user = User::query()->where(['phone_number' => $phoneNumber])->first();

        if (!$user)
            $user = User::create(['phone_number' => $phoneNumber]);

        return $user;
    }

}
