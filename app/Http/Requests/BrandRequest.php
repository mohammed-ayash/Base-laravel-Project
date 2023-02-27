<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BrandRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        switch ($this->method()) {
            case 'GET':
            case 'DELETE':
                return [];
            case 'POST':
                return [
                    'en.name' => 'required|max:20',
                    'en.description' => 'required|max:400',
                    'ar.name' => 'required|max:20',
                    'ar.description' => 'required|max:400',
                ];
            case 'PUT':
            case 'PATCH':
                return [
                    'en.name' => 'max:20',
                    'en.description' => 'max:400',
                    'ar.name' => 'max:20',
                    'ar.description' => 'max:400',
                ];
            default:
                break;
        }
        return [];

    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            '*.name.required' => 'A name with  is required',
            '*.description.required' => 'A description is required',
        ];
    }
}
