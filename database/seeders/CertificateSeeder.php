<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\CertificateLabel;
use App\Models\Course;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();
         if($courses->isEmpty()){
            $this->command->warn('No courses found, skipping certificate seeding.');
            return;
        }

        // Setiap course punya 1 sertifikat (misalnya)
        foreach ($courses as $course) {
            Certificate::factory()
                ->has(
                    CertificateLabel::factory()
                        ->count(fake()->numberBetween(3, 6)), // Setiap sertifikat punya 3-6 label (nama, tgl, dll)
                    'label'
                )
                ->create(['course_id' => $course->id]);
        }
    }
}
