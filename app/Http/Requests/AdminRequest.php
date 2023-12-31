<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminRequest extends FormRequest
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
        switch($this->method()) {
            case 'GET':
            case 'DELETE':
                return [];
            case 'POST':
                return [
                    'name' => 'required|max:100',
                    'username' => 'required|max:100|unique:admins',
                    'email' => 'required|email|unique:admins',
                    'password' => 'required|confirmed|min:6',
                ];
            case 'PUT':
            case 'PATCH':
            $admin = $this->route()->admin;
            return [
                'name' => 'required|max:100',
                'username' => 'required|max:100|unique:admins,username,'.$admin->id,
                'email' => 'required|email|unique:admins,email,'.$admin->id,
                'password' => 'nullable|confirmed|min:6',
            ];
            default:break;
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
            'name.required' => 'A name with  is required',
            'username.required' => 'A username is required',
            'email.required'  => 'An email is required',
        ];
    }
}
