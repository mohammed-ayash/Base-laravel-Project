<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\QueryFilter\Models\Dashboard\UserFilter;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Http\Traits\Responsible;
use App\Models\User;
use App\Service\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    use Responsible;

    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(UserFilter $userFilter): JsonResponse
    {
        $users = $this->userService->getUsers($userFilter);

        return $this->respondSuccess(UserResource::collection($users), $users);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UserRequest $request
     * @return JsonResponse
     */
    public function store(UserRequest $request): JsonResponse
    {
        $user = $this->userService->add($request->validated(), $request->file('avatar'));

        return $this->respondSuccess($user);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $user = User::findOrFail($id);

        return $this->respondSuccess($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserRequest $request
     * @param $id
     * @return JsonResponse
     */
    public function update(UserRequest $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $user = $this->userService->update($request->validated(), $user, $request->file('avatar'));
        return $this->respondSuccess($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);

        $this->userService->delete($user);

        return $this->respondSuccess($user);
    }
}


