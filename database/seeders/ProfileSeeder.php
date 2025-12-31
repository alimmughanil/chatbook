<?php
namespace Database\Seeders;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder {
    public function run(): void {
        $users = User::where('role', 'partner')->get();
        foreach($users as $user) { Profile::factory()->create(['user_id' => $user->id]); }
    }
}
