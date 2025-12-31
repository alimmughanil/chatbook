<?php

use App\Enums\SubmissionStatusType;
use Illuminate\Support\Facades\Schema;
use App\Enums\SubmissionGradeResultType;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
            $table->foreignId('participant_id')->constrained()->restrictOnDelete();
            $table->boolean('is_show_score')->default(true);
            $table->float('total_point')->nullable();
            $table->float('final_score')->nullable();
            $table->text('comment')->nullable();
            $table->string('grade_status')->default(SubmissionGradeResultType::Pending)->index();
            $table->string('status')->default(SubmissionStatusType::Submitted)->index();

            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_submissions');
    }
};
