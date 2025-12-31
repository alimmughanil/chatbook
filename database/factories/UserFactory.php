<?php
namespace Database\Factories;
use App\Enums\UserType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory {
    protected $model = User::class;
    public function definition(): array {
        $name = fake()->name();
        return [
            'name' => $name,
            'username' => Str::slug($name) . fake()->numerify('##'),
            'phone' => '08' . fake()->numerify('##########'),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => fake()->randomElement(UserType::getValues()),
            'picture' => 'https://ui-avatars.com/api/?name=' . urlencode($name),
            'status' => 'active',
            'remember_token' => Str::random(10),
        ];
    }
}
