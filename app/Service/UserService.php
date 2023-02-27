<?php

namespace App\Service;


use App\Http\QueryFilter\Models\Dashboard\UserFilter;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserService
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function add($validatedData, $avatar): User
    {
        $admin = new User($validatedData);

        if ($validatedData['password'])
            $admin->password = bcrypt($validatedData['password']);

        if ($avatar)
            $admin->avatar = Storage::disk('public')->put('admins', $avatar);

        $admin->save();

        return $admin;

    }

    public function update($validatedData, User $admin, $avatar): User
    {
        if ($validatedData['password'])
            $admin->password = bcrypt($validatedData['password']);

        unset($validatedData['password']);

        $admin->update($validatedData);

        if ($avatar) {
            // if there is an old avatar delete it
            if ($admin->avatar != null) {
                $admin->avatar = Storage::disk('public')->delete($admin->avatar);
            }

            // store the new image
            $admin->avatar = Storage::disk('public')->put('admins', $avatar);
        }

        $admin->save();

        return $admin;
    }

    public function delete(User $admin)
    {
        if ($admin->image != null)
            $admin->image = Storage::disk('public')->delete($admin->image);

        $admin->delete();
    }

    public function getUsers(UserFilter $userFilter)
    {
        return User::filter($userFilter);
    }
}
