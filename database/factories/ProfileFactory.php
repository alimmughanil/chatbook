<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
{
  /**
   * The name of the factory's corresponding model.
   *
   * @var string
   */
  protected $model = Profile::class;

  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    $roles = [
      'Full Stack Developer',
      'Graphic Designer',
      'Content Writer',
      'Digital Marketer',
      'Video Editor',
      'UI/UX Designer',
      'Virtual Assistant',
      'Translator'
    ];

    $adjectives = [
      'Profesional',
      'Berpengalaman',
      'Kreatif',
      'Bersertifikat',
      'Terpercaya'
    ];

    $shortBio = fake()->randomElement($adjectives) . ' ' . fake()->randomElement($roles) . ' siap membantu proyek Anda.';

    return [
      'short_bio' => $shortBio,
      'about' => $this->generateRealAbout(),
      'address' => fake('id_ID')->streetAddress(),
      'city' => fake('id_ID')->cityName(),
      'country' => 'Indonesia',
    ];
  }

  private function generateRealAbout()
  {
    $paragraphs = [
      "Halo! Saya memiliki pengalaman lebih dari 5 tahun di industri ini. Saya berdedikasi untuk memberikan hasil terbaik bagi setiap klien.",
      "Spesialisasi saya mencakup berbagai aspek teknis dan kreatif. Saya terbiasa bekerja dengan tenggat waktu yang ketat tanpa mengurangi kualitas.",
      "Sebelumnya saya telah bekerja sama dengan berbagai UMKM dan perusahaan startup untuk membantu mereka mencapai target bisnis.",
      "Silakan cek portofolio saya untuk melihat hasil kerja sebelumnya. Saya sangat menantikan kesempatan untuk berkolaborasi dengan Anda."
    ];

    return collect($paragraphs)->random(rand(2, 3))->implode("\n\n");
  }
}