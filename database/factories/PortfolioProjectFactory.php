<?php
namespace Database\Factories;
use App\Enums\PortfolioStatusType;
use App\Enums\PublishStatusType;
use App\Models\PortfolioProject;
use App\Models\User;
use App\Models\PortfolioCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PortfolioProjectFactory extends Factory {
    protected $model = PortfolioProject::class;
    public function definition(): array {
        $name = "Project " . fake()->company();
        return [
            'user_id' => User::where('role','partner')->inRandomOrder()->first()->id ?? User::factory(),
            'category_id' => PortfolioCategory::inRandomOrder()->first()->id ?? PortfolioCategory::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'duration_unit' => 'Days',
            'description' => 'Hasil pengerjaan website company profile.',
            'is_show_client' => true,
            'project_status' => PortfolioStatusType::Active,
            'status' => PublishStatusType::Publish,
            'published_at' => now(),
        ];
    }
}
