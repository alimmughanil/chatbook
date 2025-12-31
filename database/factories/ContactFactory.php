<?php
namespace Database\Factories;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory {
    protected $model = Contact::class;
    public function definition(): array {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'message' => 'Halo admin, saya ingin bertanya.',
            'is_reply' => false,
        ];
    }
}
