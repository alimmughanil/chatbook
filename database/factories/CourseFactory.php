<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Course;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Enums\CourseLevelType;
use App\Enums\CoursePaymentType;
use App\Enums\PublishStatusType;
use App\Enums\CourseTimeLimitType;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseFactory extends Factory
{
  protected $model = Course::class;

  public function definition(): array
  {
    $jsonPath = resource_path('json/seeders/lessons.json');
    $data = json_decode(File::get($jsonPath), true);
    $video = fake()->randomElements($data)[0];

    $course = fake()->randomElements($this->courses())[0];
    $title = $course['title'];

    return [
      'user_id' => User::where('role', 'admin')->inRandomOrder()->first()->id ?? User::factory(['role' => 'admin']), // Ambil instruktur
      'category_id' => Category::inRandomOrder()->first()->id ?? Category::factory(),
      'title' => $title,
      'slug' => Str::slug($title) . "-" . rand(1000, 9999),
      'payment_type' => fake()->randomElement(CoursePaymentType::getValues()), // GANTI DENGAN TIPE SEBENARNYA
      'price' => fake()->randomElement([0, fake()->numberBetween(10000, 100000)]),
      'participant_start_number' => "0001",
      'participant_format_number' => '{NNNN}',
      'description' => $course['description'],
      'thumbnail' => $video['thumbnail'],
      'start_at' => fake()->optional()->dateTimeThisYear('+1 month'),
      'close_at' => fake()->optional()->dateTimeThisYear('+3 months'),
      'registration_start_at' => fake()->optional()->dateTimeThisYear(),
      'registration_close_at' => fake()->optional()->dateTimeThisYear('+2 weeks'),
      'time_limit' => fake()->randomElement(CourseTimeLimitType::getValues()), // GANTI DENGAN BATAS WAKTU SEBENARNYA
      'level' => fake()->randomElement(CourseLevelType::getValues()), // GANTI DENGAN LEVEL SEBENARNYA
      'status' => fake()->randomElement(PublishStatusType::getValues()), // GANTI DENGAN STATUS SEBENARNYA
      'is_featured' => fake()->boolean(80),
    ];
  }

  public function courses()
  {
    return
      $courses = [
        [
          "title" => "Kursus PHP 8: Dari Pemula Menjadi Mahir",
          "description" => '<p>Selami dunia backend development dengan <strong>PHP 8</strong>. Kursus ini didesain khusus untuk pemula tanpa pengalaman pemrograman, memandu Anda langkah demi langkah.</p>
<p>Kita akan mulai dari dasar:</p>
<ul>
    <li>Setup environment (XAMPP/Laragon).</li>
    <li>Sintaks dasar: Variabel, Tipe Data, dan Operator.</li>
    <li>Struktur Kontrol: If/Else, Switch, dan Looping (For, While).</li>
    <li>Fungsi, Array, dan String Manipulation.</li>
    <li>Pengenalan OOP (Class, Object, Inheritance).</li>
    <li>Fitur baru PHP 8: Match Expression, Named Arguments, dan Atribut.</li>
</ul>
<p>Di akhir kursus, Anda akan siap membangun aplikasi web dinamis dan memiliki fondasi kuat untuk lanjut ke framework seperti Laravel.</p>'
        ],
        [
          "title" => "Masterclass Laravel 11: Membangun Aplikasi Skala Penuh",
          "description" => '<p>Ini bukan kursus Laravel biasa. Ini adalah <strong>Masterclass</strong> yang fokus membangun aplikasi <em>real-world</em> berskala besar menggunakan <strong>Laravel 11</strong>.</p>
<p>Apa yang akan Anda bangun dan pelajari:</p>
<ul>
    <li>Arsitektur proyek yang solid (Services, Repositories).</li>
    <li>Advanced Eloquent: Relasi kompleks, Eager Loading, dan Query Scopes.</li>
    <li>Autentikasi: Laravel Breeze/Sanctum untuk SPA &amp; API.</li>
    <li>Fitur Lanjutan: Queues, Events, Notifications, dan Scheduling Task.</li>
    <li>Testing: TDD (Test Driven Development) dengan Pest dan PHPUnit.</li>
    <li>Deployment: CI/CD pipeline dasar ke server produksi.</li>
</ul>
<p>Kursus ini dirancang untuk Anda yang sudah memahami dasar Laravel dan ingin meningkatkan keahlian Anda ke level profesional.</p>'
        ],
        [
          "title" => "JavaScript Modern (ES6+): Panduan Lengkap untuk Developer",
          "description" => '<p>Tinggalkan sintaks JavaScript lama! Kursus ini adalah panduan lengkap Anda untuk menguasai fitur <strong>ES6 (ECMAScript 2015)</strong> dan yang lebih baru, yang esensial untuk development modern.</p>
<p>Fokus utama materi:</p>
<ul>
    <li>Sintaks Modern: <code>let</code>, <code>const</code>, Arrow Functions, dan Template Literals.</li>
    <li>Struktur Data: Destructuring (Object &amp; Array) dan Spread/Rest Operator.</li>
    <li>Asynchronous JS: Menguasai <strong>Promises</strong>, <code>fetch()</code>, dan sintaks <code>async/await</code>.</li>
    <li>OOP di JS: Bekerja dengan <strong>Classes</strong> dan Prototypes.</li>
    <li>Modules: Mengorganisir kode dengan <code>import</code> dan <code>export</code>.</li>
</ul>
<p>Setelah kursus ini, kode JavaScript Anda akan lebih bersih, efisien, dan siap untuk framework modern seperti React, Vue, atau AdonisJS.</p>'
        ],
        [
          "title" => "Belajar JavaScript DOM: Membuat Website Interaktif dari Nol",
          "description" => '<p>Ubah halaman web statis (HTML/CSS) Anda menjadi hidup! Kursus ini fokus pada <strong>Document Object Model (DOM)</strong>, yang merupakan jembatan antara JavaScript dan HTML Anda.</p>
<p>Anda akan belajar:</p>
<ul>
    <li>Apa itu DOM Tree dan bagaimana browser membacanya.</li>
    <li><strong>Seleksi Elemen:</strong> Menggunakan <code>getElementById</code>, <code>querySelector</code>, dan <code>querySelectorAll</code>.</li>
    <li><strong>Manipulasi Elemen:</strong> Mengubah teks (<code>innerText</code>), HTML (<code>innerHTML</code>), dan atribut (<code>setAttribute</code>).</li>
    <li><strong>Manipulasi CSS:</strong> Mengubah style dan mengelola class (<code>classList.add/remove/toggle</code>).</li>
    <li><strong>Event Handling:</strong> Menangani aksi pengguna seperti <i>click</i>, <i>submit</i>, <i>keyup</i>, dan memahami event bubbling.</li>
</ul>
<p>Kita akan membuat beberapa studi kasus proyek seperti To-Do List dan Image Gallery interaktif dari nol.</p>'
        ],
        [
          "title" => "Full-Stack Laravel dan Vue.js: Membangun Proyek Dunia Nyata",
          "description" => '<p>Jadilah Full-Stack Developer yang dicari industri dengan menguasai dua teknologi terpopuler: <strong>Laravel</strong> untuk Backend dan <strong>Vue.js</strong> untuk Frontend.</p>
<p>Dalam kursus ini, kita akan membangun <strong>Single Page Application (SPA)</strong> yang utuh dari nol.</p>
<p><strong>Bagian Backend (Laravel):</strong></p>
<ul>
    <li>Membangun RESTful API yang cepat dan aman.</li>
    <li>Autentikasi API menggunakan Laravel Sanctum.</li>
    <li>Eloquent Resources untuk transformasi data JSON yang rapi.</li>
</ul>
<p><strong>Bagian Frontend (Vue.js 3):</strong></p>
<ul>
    <li>Setup Vue 3 dengan Vite (Composition API).</li>
    <li>Routing sisi klien dengan <strong>Vue Router</strong>.</li>
    <li>State Management terpusat dengan <strong>Pinia</strong> (Store resmi Vue).</li>
    <li>Menghubungkan Vue ke API Laravel menggunakan Axios.</li>
</ul>'
        ],
        [
          "title" => "PHP OOP: Panduan Mendalam Konsep Object-Oriented Programming",
          "description" => '<p>PHP bukan hanya bahasa prosedural. Kuasai <strong>Object-Oriented Programming (OOP)</strong> untuk menulis kode yang modular, reusable, dan mudah dikelola (scalable), yang merupakan fondasi dari semua framework modern.</p>
<p>Kursus ini adalah panduan mendalam tentang pilar-pilar OOP di PHP:</p>
<ul>
    <li><strong>Dasar:</strong> Class, Object, Property, dan Method.</li>
    <li><strong>Encapsulation:</strong> Memahami visibility <code>public</code>, <code>private</code>, dan <code>protected</code>.</li>
    <li><strong>Inheritance:</strong> Mewariskan properti dan method dari class lain (<code>extends</code>).</li>
    <li><strong>Polymorphism:</strong> Memahami bagaimana object bisa memiliki banyak bentuk dan perilaku.</li>
    <li><strong>Konsep Lanjutan:</strong> Abstract Class, Interface, Traits, dan Static Methods/Properties.</li>
</ul>
<p>Memahami OOP adalah syarat wajib jika Anda ingin serius menguasai framework seperti Laravel atau Symfony.</p>'
        ],
        [
          "title" => "Belajar Cepat AdonisJS: Membangun API dengan TypeScript",
          "description" => '<p>Masuki ekosistem Node.js dengan framework yang elegan dan "batteries-included": <strong>AdonisJS 6</strong>. Sering disebut sebagai "Laravel-nya Node.js", kursus ini mengajarkan Anda membangun REST API berperforma tinggi dengan kekuatan <strong>TypeScript</strong>.</p>
<p>Materi yang dibahas:</p>
<ul>
    <li>Setup proyek AdonisJS 6 dan keunggulan menggunakan TypeScript.</li>
    <li>Struktur folder MVC (Model-View-Controller) di Adonis.</li>
    <li>Routing, Controller, dan Middleware.</li>
    <li><strong>Lucid ORM:</strong> Interaksi database yang powerful (Migrations, Models, Relationships).</li>
    <li><strong>VineJS:</strong> Sistem validasi data generasi baru yang sangat cepat.</li>
    <li>Autentikasi API (Access Tokens/Session).</li>
</ul>
<p>Sangat cocok untuk developer JavaScript/TypeScript yang menginginkan backend terstruktur seperti Laravel.</p>'
        ],
        [
          "title" => "Panduan Lengkap Validasi Data di Laravel (Request & Regex)",
          "description" => '<p>Jangan pernah percaya input dari pengguna! Validasi adalah garda terdepan keamanan dan integritas data aplikasi Anda. Kursus spesialisasi ini adalah panduan A-Z untuk semua hal tentang validasi di Laravel.</p>
<p>Anda akan menguasai:</p>
<ul>
    <li>Validasi dasar di Controller vs <strong>Form Request</strong> (Best Practice).</li>
    <li>Ratusan aturan bawaan: <code>required</code>, <code>email</code>, <code>unique</code>, <code>exists</code>, <code>image</code>, <code>min</code>, <code>max</code>, dll.</li>
    <li>Validasi data kompleks seperti Array dan Nested JSON.</li>
    <li>Membuat <strong>Aturan Validasi Kustom</strong> (Custom Rules) Anda sendiri untuk logika bisnis yang unik.</li>
    <li>Menggunakan <strong>Regular Expression (Regex)</strong> untuk memvalidasi pola-pola rumit (cth: format NIK, nomor telepon, atau format waktu kustom <code>HH:MM:SS</code>).</li>
</ul>
<p>Setelah kursus ini, Anda dapat memvalidasi data serumit apapun dengan percaya diri.</p>'
        ],
        [
          "title" => "Mastering Web Development: HTML, CSS, JS, dan PHP",
          "description" => '<p>Ini adalah kursus "Zero to Hero" yang mencakup semua fondasi dasar yang dibutuhkan untuk menjadi Web Developer. Anda tidak perlu pengalaman apapun untuk memulai.</p>
<h3>HTML: Fondasi Web</h3>
<ul>
    <li>Membangun struktur halaman yang semantik (<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>).</li>
    <li>Bekerja dengan Form, Tabel, dan Media (Audio/Video).</li>
</ul>
<h3>CSS: Mendesain Halaman</h3>
<ul>
    <li>Styling fundamental (Warna, Font, Box Model).</li>
    <li>Layouting Modern dengan <strong>Flexbox</strong> dan <strong>CSS Grid</strong>.</li>
    <li>Membuat website yang <strong>Responsive</strong> menggunakan Media Queries.</li>
</ul>
<h3>JavaScript: Membuat Interaktif</h3>
<ul>
    <li>Dasar-dasar JS (Variabel, Fungsi, Tipe Data).</li>
    <li>Manipulasi DOM (Mengubah konten halaman secara dinamis).</li>
    <li>Event Handling (Menanggapi aksi user seperti Click atau Submit).</li>
</ul>
<h3>PHP: Sisi Server</h3>
<ul>
    <li>Dasar PHP untuk memproses data dari Form HTML.</li>
    <li>Menghubungkan website ke database (MySQLi/PDO).</li>
    <li>Membuat sistem CRUD (Create, Read, Update, Delete) sederhana.</li>
</ul>'
        ],
        [
          "title" => "JavaScript Asynchronous: Menguasai Promise dan Async/Await",
          "description" => '<p>Pahami salah satu konsep paling fundamental namun paling membingungkan di JavaScript: <strong>Asynchronous</strong>. Pelajari cara menangani operasi yang memakan waktu (seperti mengambil data API) tanpa memblokir eksekusi kode (non-blocking).</p>
<p>Kita akan bongkar tuntas:</p>
<ul>
    <li>Masalah klasik <strong>"Callback Hell"</strong> dan mengapa kita harus menghindarinya.</li>
    <li><strong>Promise:</strong> Memahami status (Pending, Fulfilled, Rejected) dan cara menggunakannya (<code>.then()</code>, <code>.catch()</code>, <code>.finally()</code>).</li>
    <li>Cara membuat Promise Anda sendiri.</li>
    <li>Menggunakan <code>Promise.all()</code> untuk menjalankan banyak operasi sekaligus.</li>
    <li>Menggunakan <strong>Fetch API</strong> untuk mengambil data dari server.</li>
    <li>Sintaks modern <strong><code>async/await</code></strong> yang membuat kode asinkron terlihat sinkron dan jauh lebih bersih (menggunakan <code>try...catch</code>).</li>
</ul>
<p>Kuasai async JS dan jangan pernah bingung lagi saat bekerja dengan API atau operasi I/O lainnya.</p>'
        ]
      ];
  }
}
