<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = new User();

        $admin->name = 'Admin';
        $admin->email = 'admin@admin.com';
        $admin->phone_number = '0000000000';
        $admin->password = bcrypt('password');

        $admin->save();

//        $superAdminRole = Role::create(['guard_name' => 'admin', 'name' => 'super-admin', 'display_name' => 'Super Admin']);
//        $superAdminRole->syncPermissions(config('permission.admin-permissions'));
//        $admin->syncRoles([$superAdminRole]);
    }
}
