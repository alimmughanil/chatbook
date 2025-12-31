<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

class ModuleFactory extends Factory
{
  protected $model = Module::class;
  private static $order = 1;

  public function definition(): array
  {
    $module = fake()->randomElements($this->modules())[0];

    return [
      'course_id' => Course::factory(),
      'title' => $module['title'],
      'description' => $module['description'],
      'thumbnail' => null,
      'order' => self::$order++,
    ];
  }

  // Reset order counter for each new course
  public function configure()
  {
    return $this->afterCreating(function (Module $module) {
      if ($module->order >= 7) { // Assuming max 7 modules, reset for next course
        self::$order = 1;
      }
    });
  }

  public function modules()
  {
    $laravelModules = [
      [
        'title' => 'Modul 1: Instalasi dan Konsep Inti Laravel',
        'description' => 'Mempelajari setup environment, instalasi Laravel 11, struktur folder, dan konsep dasar Routing serta arsitektur MVC (Model-View-Controller).'
      ],
      [
        'title' => 'Modul 2: Database, Migrations, dan Eloquent ORM',
        'description' => 'Membahas cara mengelola database, membuat schema dengan migration, seeding data, dan menguasai Eloquent ORM untuk interaksi database yang efisien.'
      ],
      [
        'title' => 'Modul 3: Blade Template Engine dan Autentikasi',
        'description' => 'Fokus pada frontend dengan Blade, layouting, serta implementasi sistem autentikasi (Login & Register) bawaan Laravel.'
      ],
      [
        'title' => 'Modul 4: Validasi, Form, dan Fitur Lanjutan',
        'description' => 'Mendalami Form Request Validation, menangani file upload, dan menjelajahi fitur lanjutan seperti Middleware, Service Provider, dan Event.'
      ],
      [
        'title' => 'Modul 5: Testing dan Deployment Aplikasi',
        'description' => 'Mempelajari dasar-dasar TDD (Test Driven Development) dengan Pest/PHPUnit dan cara mendeploy aplikasi Laravel ke server produksi.'
      ]
    ];

    // Kursus: "JavaScript Modern (ES6+): Panduan Lengkap untuk Developer"
    $jsModernModules = [
      [
        'title' => 'Modul 1: Sintaks Modern ES6',
        'description' => 'Memperkenalkan sintaks JavaScript modern, termasuk `let`, `const`, Arrow Functions, Template Literals, dan Default Parameters.'
      ],
      [
        'title' => 'Modul 2: Destructuring dan Metode Array',
        'description' => 'Mendalami cara efisien bekerja dengan data menggunakan destructuring (Object & Array) dan metode array populer (map, filter, reduce).'
      ],
      [
        'title' => 'Modul 3: Asynchronous JavaScript (Async/Await)',
        'description' => 'Menguasai JavaScript asinkron, mulai dari konsep Callback, beralih ke Promises, hingga menggunakan sintaks Async/Await yang bersih.'
      ],
      [
        'title' => 'Modul 4: Bekerja dengan API (Fetch)',
        'description' => 'Belajar cara mengambil dan mengirim data dari/ke server eksternal (API) menggunakan Fetch API modern dan menangani respons JSON.'
      ],
      [
        'title' => 'Modul 5: ES Modules dan OOP (Class)',
        'description' => 'Mempelajari cara mengorganisir kode dengan ES Modules (import/export) dan konsep Object-Oriented Programming menggunakan sintaks Class.'
      ]
    ];

    // Kursus: "Full-Stack Laravel dan Vue.js: Membangun Proyek Dunia Nyata"
    $fullStackModules = [
      [
        'title' => 'Modul 1: Membangun REST API dengan Laravel',
        'description' => 'Fokus pada backend. Mempersiapkan proyek Laravel, membuat migration, model, dan controller untuk menyediakan data sebagai RESTful API.'
      ],
      [
        'title' => 'Modul 2: Dasar-Dasar Vue 3 (Composition API)',
        'description' => 'Mempelajari fundamental Vue 3, termasuk setup, Composition API, data binding, event handling, dan membuat komponen yang reusable.'
      ],
      [
        'title' => 'Modul 3: State Management dengan Pinia',
        'description' => 'Mengelola state aplikasi (data global) secara efisien di frontend menggunakan Pinia, state management resmi untuk Vue.'
      ],
      [
        'title' => 'Modul 4: Integrasi Vue Router dan Autentikasi API',
        'description' => 'Membuat Single Page Application (SPA) dengan Vue Router dan mengamankan rute menggunakan token (Sanctum/JWT) dari API Laravel.'
      ],
      [
        'title' => 'Modul 5: Proyek Studi Kasus: CRUD Full-Stack',
        'description' => 'Menggabungkan semua konsep untuk membangun fitur Create, Read, Update, Delete (CRUD) secara penuh dari frontend Vue ke backend Laravel.'
      ]
    ];

    return [
      ...$laravelModules,
      ...$jsModernModules,
      ...$fullStackModules
    ];
  }
}
