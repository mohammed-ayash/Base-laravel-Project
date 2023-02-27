<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\QueryFilter\Models\Dashboard\BrandFilter;
use App\Http\Requests\BrandRequest;
use App\Http\Resources\BrandResource;
use App\Http\Traits\Responsible;
use App\Models\Brand;
use App\Service\BrandService;
use Illuminate\Http\JsonResponse;

class BrandController extends Controller
{
    use Responsible;

    private BrandService $brandService;

    public function __construct(BrandService $brandService)
    {
        $this->brandService = $brandService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(BrandFilter $brandFilter): JsonResponse
    {
        $brands = $this->brandService->findAll($brandFilter);
        return $this->respondSuccess(BrandResource::collection($brands), $brands);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param BrandRequest $request
     * @return JsonResponse
     */
    public function store(BrandRequest $request): JsonResponse
    {
        $brand = $this->brandService->add($request->validated(), $request->file('image'));
        return $this->respondSuccess($brand);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $brand = Brand::findOrFail($id);

        return $this->respondSuccess($brand);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param BrandRequest $request
     * @param $id
     * @return JsonResponse
     */
    public function update(BrandRequest $request, $id): JsonResponse
    {
        $brand = Brand::findOrFail($id);

        $brand = $this->brandService->update($request->validated(), $brand,  $request->file('image'));
        return $this->respondSuccess($brand);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $brand = Brand::findOrFail($id);

        $this->brandService->delete($brand);

        return $this->respondSuccess($brand);
    }
}
