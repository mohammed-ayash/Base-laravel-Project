<?php

namespace App\Service;


use App\Http\QueryFilter\Models\Dashboard\BrandFilter;
use App\Models\Brand;
use App\Repositories\BrandRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BrandService
{
    private BrandRepository $brandRepository;

    public function __construct(BrandRepository $brandRepository)
    {
        $this->brandRepository = $brandRepository;
    }

    public function add($validatedData, $image)
    {
        $brand = new Brand($validatedData);

        if ($image)
            $brand->image = Storage::disk('public')->put('brands', $image);

        $brand->save();
        return $brand;
    }

    public function update($validatedData, Brand $brand, $image)
    {
        $brand->update($validatedData);

        if ($image) {
            // if there is an old avatar delete it
            if ($brand->image != null && Storage::disk('public')->exists($brand->image)) {
                $$brand->image = Storage::disk('public')->delete($brand->image);
            }

            // store the new image
            $brand->image = Storage::disk('public')->put('brands', $image);
        }

        $brand->save();
        return $brand;
    }

    public function delete(Brand $brand)
    {
        return $brand->delete();
    }

    public function findAll(BrandFilter $brandFilter)
    {
        return Brand::filter($brandFilter);
    }
}

;
