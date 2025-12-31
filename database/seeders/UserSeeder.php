<?php

namespace Database\Seeders;

use App\Models\User;
use Laravolt\Avatar\Avatar;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $avatar = new Avatar();

        User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('rahasia123'),
            'remember_token' => Hash::make('secret123'),
            'role' => "admin",
            'picture' => $avatar->create('Admin')->setBackground('#7842f5')->setForeground('#ffffff')->setDimension(100)->toBase64()
        ]);
        User::create([
            'name' => 'Partner',
            'username' => 'partner',
            'email' => 'partner@admin.com',
            'password' => Hash::make('rahasia123'),
            'remember_token' => Hash::make('secret123'),
            'role' => "partner",
            'picture' => $avatar->create('Partner')->setBackground('#7842f5')->setForeground('#ffffff')->setDimension(100)->toBase64()
        ]);
    }
}
