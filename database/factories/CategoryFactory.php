<?php

namespace Database\Factories;

use App\Enums\CategoryType;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
  protected $model = Category::class;

  public function definition(): array
  {
    $name = fake()->randomElement($this->categories());

    return [
      // 'parent_id' => null, // Biarkan null dulu, atur di seeder jika perlu
      'name' => $name,
      'slug' => Str::slug($name),
      'type' => fake()->randomElement(CategoryType::getValues()), // GANTI DENGAN TIPE SEBENARNYA
      'thumbnail' => null,
      'description' => fake()->optional()->paragraph(),
    ];
  }

  public function categories()
  {
    return [
      [
        "name" => 'Teknologi Informasi',
        "description" => '<p>Semua tentang komputasi, sistem, dan jaringan komputer.</p>',
      ],
      [
        "name" => 'Pemrograman Web',
        "description" => '<p>Membangun website dan aplikasi web dari dasar.</p>',
      ],
      [
        "name" => 'Data Science & Analitik',
        "description" => '<p>Analisis data untuk menemukan wawasan dan tren bisnis.</p>',
      ],
      [
        "name" => 'Desain Grafis',
        "description" => '<p>Menciptakan konsep visual untuk komunikasi yang efektif.</p>',
      ],
      [
        "name" => 'Desain UI/UX',
        "description" => '<p>Merancang antarmuka dan pengalaman pengguna yang optimal.</p>',
      ],
      [
        "name" => 'Bisnis & Manajemen',
        "description" => '<p>Prinsip dasar menjalankan dan mengelola sebuah bisnis.</p>',
      ],
      [
        "name" => 'Keuangan & Akuntansi',
        "description" => '<p>Mengelola uang, aset, dan pencatatan keuangan.</p>',
      ],
      [
        "name" => 'Pemasaran Digital',
        "description" => '<p>Strategi pemasaran produk secara online (SEO, SEM, media sosial).</p>',
      ],
      [
        "name" => 'Pengembangan Diri',
        "description" => '<p>Meningkatkan keterampilan pribadi, soft skills, dan pola pikir.</p>',
      ],
      [
        "name" => 'Komunikasi & Public Speaking',
        "description" => '<p>Keterampilan berbicara efektif di depan umum dan profesional.</p>',
      ],
      [
        "name" => 'Bahasa Inggris',
        "description" => '<p>Mempelajari bahasa Inggris untuk semua tingkatan.</p>',
      ],
      [
        "name" => 'Bahasa Asing Lain',
        "description" => '<p>Mempelajari berbagai bahasa asing selain bahasa Inggris.</p>',
      ],
      [
        "name" => 'Musik & Produksi Audio',
        "description" => '<p>Menciptakan, merekam, dan memproduksi musik serta suara.</p>',
      ],
      [
        "name" => 'Fotografi & Videografi',
        "description" => '<p>Teknik mengambil gambar dan merekam video secara profesional.</p>',
      ],
      [
        "name" => 'Kecerdasan Buatan (AI)',
        "description" => '<p>Membangun sistem yang dapat berpikir dan belajar seperti manusia.</p>',
      ],
      [
        "name" => 'Cyber Security',
        "description" => '<p>Melindungi sistem digital, jaringan, dan data dari ancaman.</p>',
      ],
      [
        "name" => 'Jaringan & Infrastruktur IT',
        "description" => '<p>Mengelola jaringan komputer dan perangkat keras IT.</p>',
      ],
      [
        "name" => 'Manajemen Proyek',
        "description" => '<p>Merencanakan dan melaksanakan proyek agar selesai tepat waktu.</p>',
      ],
      [
        "name" => 'Sertifikasi Profesional (IT, Manajemen, dsb)',
        "description" => '<p>Persiapan untuk mengambil ujian sertifikasi resmi.</p>',
      ],
      [
        "name" => 'Kewirausahaan (Entrepreneurship)',
        "description" => '<p>Cara memulai, membangun, dan mengembangkan bisnis baru.</p>',
      ],
      [
        "name" => 'Kesehatan & Gaya Hidup',
        "description" => '<p>Topik seputar kebugaran, nutrisi, dan kesehatan mental.</p>',
      ],
      [
        "name" => 'Pendidikan & Pelatihan Guru',
        "description" => '<p>Pelatihan dan metode mengajar untuk para pendidik.</p>',
      ],
      [
        "name" => 'Teknik & Arsitektur',
        "description" => '<p>Prinsip-prinsip rekayasa dan perancangan bangunan.</p>',
      ],
      [
        "name" => 'Hukum & Etika Bisnis',
        "description" => '<p>Aturan hukum dan pedoman etika dalam dunia bisnis.</p>',
      ],
      [
        "name" => 'Pemasaran Produk Kreatif',
        "description" => '<p>Strategi pemasaran untuk industri kreatif seperti seni dan desain.</p>',
      ],
      [
        "name" => 'Pengembangan Aplikasi Mobile',
        "description" => '<p>Membangun aplikasi untuk platform Android dan iOS.</p>',
      ],
      [
        "name" => 'Cloud Computing & DevOps',
        "description" => '<p>Layanan cloud dan otomatisasi proses pengembangan software.</p>',
      ],
      [
        "name" => 'Game Development',
        "description" => '<p>Proses merancang dan menciptakan video game.</p>',
      ],
      [
        "name" => 'Menulis & Copywriting',
        "description" => '<p>Seni menulis teks untuk pemasaran, iklan, dan konten.</p>',
      ],
      [
        "name" => 'Kecerdasan Emosional & Soft Skills',
        "description" => '<p>Mengembangkan keterampilan interpersonal dan emosional.</p>',
      ],
      [
        "name" => 'Seni & Kreativitas',
        "description" => '<p>Mengeksplorasi berbagai bentuk seni dan ekspresi kreatif.</p>',
      ],
      [
        "name" => 'Ilmu Sosial & Humaniora',
        "description" => '<p>Studi tentang masyarakat, budaya, dan perilaku manusia.</p>',
      ],
      [
        "name" => 'Matematika & Sains',
        "description" => '<p>Dasar-dasar perhitungan matematika dan ilmu pengetahuan alam.</p>',
      ],
      [
        "name" => 'Produktivitas & Efisiensi Kerja',
        "description" => '<p>Alat dan metode untuk bekerja lebih cerdas dan efisien.</p>',
      ],
      [
        "name" => 'Customer Service & Penjualan',
        "description" => '<p>Teknik melayani pelanggan dan strategi penjualan produk.</p>',
      ],
      [
        "name" => 'Keamanan Data & Privasi',
        "description" => '<p>Cara melindungi data pribadi dan perusahaan dari kebocoran.</p>',
      ],
      [
        "name" => 'Teknologi Blockchain & Web3',
        "description" => '<p>Generasi baru internet terdesentralisasi dan mata uang kripto.</p>',
      ],
      [
        "name" => 'Machine Learning & Deep Learning',
        "description" => '<p>Topik lanjutan dalam Kecerdasan Buatan dan pemodelan data.</p>',
      ],
      [
        "name" => 'Robotika',
        "description" => '<p>Ilmu merancang, membangun, dan mengoperasikan robot.</p>',
      ],
      [
        "name" => 'Analisis Bisnis (Business Analysis)',
        "description" => '<p>Menganalisis kebutuhan bisnis dan menemukan solusi terbaik.</p>',
      ],
      [
        "name" => 'Manajemen SDM (HR Management)',
        "description" => '<p>Mengelola sumber daya manusia dalam sebuah organisasi.</p>',
      ],
    ];
  }
}
