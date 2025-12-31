<?php

namespace Database\Seeders;

use App\Enums\GenderType;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicalRecordSeeder extends Seeder
{
  public function run(): void
  {
    $recordData = [
      [
        'date' => Carbon::parse('2025-10-01'),
        'complaint' => "Demam tinggi selama dua hari terakhir.\nSakit kepala ringan di pagi hari.\nNafsu makan menurun.",
        'note' => "Pasien tampak lemas.\nSuhu tubuh mencapai 39°C.\nTidak ditemukan tanda-tanda infeksi tenggorokan.",
        'treatment' => "Berikan paracetamol 500mg tiap 8 jam.\nAnjurkan istirahat cukup dan hidrasi yang baik.",
      ],
      [
        'date' => Carbon::parse('2025-10-02'),
        'complaint' => "Sakit kepala sebelah kanan.\nSakit muncul tiba-tiba saat stres.\nKadang disertai mual ringan.",
        'note' => "Kemungkinan migrain.\nTekanan darah 120/80 mmHg.\nTidak ada gangguan penglihatan.",
        'treatment' => "Resepkan ibuprofen 400mg bila nyeri.\nHindari kurang tidur dan konsumsi kafein berlebih.",
      ],
      [
        'date' => Carbon::parse('2025-10-03'),
        'complaint' => "Batuk kering lebih dari satu minggu.\nTidak disertai demam atau pilek.",
        'note' => "Paru-paru bersih saat auskultasi.\nTes antigen negatif.\nKemungkinan batuk akibat iritasi tenggorokan.",
        'treatment' => "Sirup dekstrometorfan 3x sehari.\nMinum air hangat dan hindari rokok.",
      ],
      [
        'date' => Carbon::parse('2025-10-04'),
        'complaint' => "Sakit perut setelah makan pedas.\nNyeri terasa di ulu hati.\nKadang mual di pagi hari.",
        'note' => "Kemungkinan gastritis ringan.\nTidak ada tanda tukak lambung.\nPerut sedikit kembung.",
        'treatment' => "Omeprazole 20mg tiap pagi.\nHindari makanan pedas dan kopi.",
      ],
      [
        'date' => Carbon::parse('2025-10-05'),
        'complaint' => "Nyeri pinggang bawah sejak dua hari.\nSakit terasa saat membungkuk.\nTidak ada riwayat jatuh.",
        'note' => "Gerakan terbatas.\nTidak ditemukan kelainan tulang pada palpasi.\nKemungkinan cedera otot ringan.",
        'treatment' => "Berikan analgesik ringan.\nLakukan peregangan dan fisioterapi ringan.",
      ],
      [
        'date' => Carbon::parse('2025-10-06'),
        'complaint' => "Ruam merah di lengan kanan.\nGatal ringan, muncul sejak 3 hari lalu.",
        'note' => "Kemungkinan reaksi alergi ringan.\nTidak ada infeksi sekunder.\nArea ruam kering.",
        'treatment' => "Gunakan salep hidrokortison.\nBerikan antihistamin oral jika gatal meningkat.",
      ],
      [
        'date' => Carbon::parse('2025-10-06'),
        'complaint' => "Sesak napas saat aktivitas berat.\nTidak disertai batuk atau nyeri dada.",
        'note' => "Terdengar wheezing halus.\nSaturasi oksigen 97%.\nKemungkinan asma ringan.",
        'treatment' => "Berikan inhaler bronkodilator.\nAnjurkan olahraga ringan dan kontrol 1 minggu.",
      ],
      [
        'date' => Carbon::parse('2025-10-07'),
        'complaint' => "Luka di kaki tidak sembuh selama 2 minggu.\nKadang terasa perih saat berjalan.",
        'note' => "Pasien memiliki riwayat diabetes.\nLuka bersih tanpa nanah.\nGula darah sedikit tinggi.",
        'treatment' => "Bersihkan luka setiap hari.\nBerikan antibiotik oral dan kontrol 3 hari.",
      ],
      [
        'date' => Carbon::parse('2025-10-07'),
        'complaint' => "Sakit tenggorokan saat menelan.\nSuara serak sejak dua hari.",
        'note' => "Faring merah.\nAmandel bengkak ringan.\nTidak ada demam tinggi.",
        'treatment' => "Amoxicillin 500mg 3x sehari.\nIstirahat suara dan konsumsi air hangat.",
      ],
      [
        'date' => Carbon::parse('2025-10-07'),
        'complaint' => "Nyeri lutut kiri saat naik tangga.\nTidak ada bengkak terlihat.\nSakit terasa setelah aktivitas berat.",
        'note' => "Kemungkinan osteoarthritis ringan.\nSendi lutut stabil.\nPerlu pemeriksaan lanjutan bila nyeri menetap.",
        'treatment' => "Rujuk fisioterapi.\nBerikan suplemen glukosamin.\nKompres hangat setiap malam.",
      ],
    ];

    $user = User::first();
    $doctor = Doctor::first();
    if (!$doctor) {
      $doctor = Doctor::create([
        "name" => "dr. Purwanto Chandra",
        "institute" => "RS. Atma Jaya",
      ]);
    }
    $patient = Patient::first();
    if (!$patient) {
      $patient = Patient::create([
        'name' => fake('id_ID')->name('male'),
        'address' => fake('id_ID')->address(),
        'phone' => "0812" . rand(11111111, 99999999),
        'birth_date' => Carbon::parse('1977-01-01'),
        'gender' => GenderType::Male,
        'medical_history' => '',
        'medication_allergy' => 'Alergi Obat (+) Antibiotik',
      ]);
    }

    $recordData = collect($recordData)->map(function ($raw) use ($doctor, $user, $patient) {
      $raw['doctor_id'] = $doctor->id;
      $raw['patient_id'] = $patient->id;
      $raw['user_id'] = $user->id;
      $raw['created_at'] = now();
      $raw['updated_at'] = now();
      return $raw;
    })->toArray();

    DB::table('medical_records')->insert($recordData);
  }
}
