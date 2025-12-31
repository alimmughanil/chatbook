<?php

namespace Database\Seeders;

use App\Enums\LanguageLevelType;
use App\Models\User;
use App\Models\Profile;
use App\Models\ProfileDetail;
use App\Enums\ProfileDetailType;
use Illuminate\Database\Seeder;

class ProfileDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereHas('profile')->get();

        foreach ($users as $user) {
            $profile = $user->profile;

            // Education
            ProfileDetail::create([
                'profile_id' => $profile->id,
                'type' => ProfileDetailType::Education,
                'value' => [
                    'school' => 'Universitas Gadjah Mada',
                    'degree' => 'Master of Science',
                    'start_year' => '2018',
                    'end_year' => '2020',
                ]
            ]);
            ProfileDetail::create([
                'profile_id' => $profile->id,
                'type' => ProfileDetailType::Education,
                'value' => [
                    'school' => 'Universitas Brawijaya',
                    'degree' => 'Bachelor of Science',
                    'start_year' => '2014',
                    'end_year' => '2018',
                ]
            ]);

            // Experience
            ProfileDetail::create([
                'profile_id' => $profile->id,
                'type' => ProfileDetailType::Experience,
                'value' => [
                    'company' => 'Universitas Gadjah Mada',
                    'position' => 'Research Assistant',
                    'start_date' => '2021-01-01',
                    'end_date' => '2022-04-01',
                    'description' => 'Assisted in research projects related to environmental science.'
                ]
            ]);
            ProfileDetail::create([
                'profile_id' => $profile->id,
                'type' => ProfileDetailType::Experience,
                'value' => [
                    'company' => 'Anak Hebat Indonesia Publisher',
                    'position' => 'Book Author',
                    'start_date' => '2020-01-01',
                    'end_date' => '2024-02-01',
                    'description' => 'Authored several educational books for children.'
                ]
            ]);

            // Skills
            $skills = ['Academic Writing', 'Content Writing', 'Copywriting', 'Editing & Proofreading', 'EN-ID/ID-EN Translation', 'Microsoft Office'];
            foreach ($skills as $skill) {
                ProfileDetail::create([
                    'profile_id' => $profile->id,
                    'type' => ProfileDetailType::Skill,
                    'value' => ['name' => $skill]
                ]);
            }

            // Languages
            ProfileDetail::create([
                'profile_id' => $profile->id,
                'type' => ProfileDetailType::Language,
                'value' => ['language' => 'English', 'level' => LanguageLevelType::Advanced]
            ]);
            ProfileDetail::create([
                'profile_id' => $profile->id,
                'type' => ProfileDetailType::Language,
                'value' => ['language' => 'Indonesian', 'level' => LanguageLevelType::Native]
            ]);

            // Certificates
            $certificates = [
                'First Best Presentation of the 7th International Conference of ISLAB-GM',
                'International Youth Involvement Forum of Indonesia Youth Forum',
                'Best Favorite Team of Brawijaya Young Entrepreneur Olympiad'
            ];
            foreach ($certificates as $cert) {
                ProfileDetail::create([
                    'profile_id' => $profile->id,
                    'type' => ProfileDetailType::Certificate,
                    'value' => ['title' => $cert]
                ]);
            }
        }
    }
}
