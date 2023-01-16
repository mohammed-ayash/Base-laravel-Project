<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = new Admin();

        $admin->name = 'Admin';
        $admin->email = 'admin@admin.com';
        $admin->username = 'admin.admin';
        $admin->password = bcrypt('password');
        $admin->remember_token = Str::random(10);

        $admin->save();

        $superAdminRole = Role::create(['guard_name' => 'admin', 'name' => 'super-admin', 'display_name' => 'Super Admin']);
        $superAdminRole->syncPermissions(config('permission.admin-permissions'));
        $admin->syncRoles([$superAdminRole]);
    }
}
