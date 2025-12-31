<?php

use App\Enums\QuestionScoreMethodType;
use App\Enums\QuestionType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('questions', function (Blueprint $table) {
      $table->id();
    $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
      $table->longText('question_text')->fulltext();
      $table->decimal('point')->default(1);
      $table->string('score_method')->default(QuestionScoreMethodType::Exact)->index(); 
      $table->string('type')->default(QuestionType::SingleChoice)->index();
      $table->boolean('is_active')->default(true)->index();

      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('questions');
  }
};
