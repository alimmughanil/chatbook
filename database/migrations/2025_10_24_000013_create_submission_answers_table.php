<?php

use App\Enums\AnswerStatusType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submission_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->foreignId('answer_id')->nullable()->constrained()->onDelete('set null');
            $table->longText('essay_answer')->nullable();
            $table->text('file_answer')->nullable();
            $table->string('status')->default(AnswerStatusType::Pending)->index();
            $table->float('score')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submission_answers');
    }
};
