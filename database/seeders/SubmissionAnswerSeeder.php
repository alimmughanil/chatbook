<?php

namespace Database\Seeders;

use App\Enums\AnswerStatusType;
use App\Enums\QuestionType;
use App\Models\Enrollment;
use App\Models\Quiz;
use App\Models\QuizSubmission;
use App\Models\SubmissionAnswer;
use Illuminate\Database\Seeder;

class SubmissionAnswerSeeder extends Seeder
{
    public function run(): void
    {
        $enrollments = Enrollment::with('user', 'course.modules.lessons.quiz.questions.answers')->get();

         if($enrollments->isEmpty()){
            $this->command->warn('No enrollments found, skipping quiz submission seeding.');
            return;
        }

        foreach ($enrollments as $enrollment) {
            $quizzes = $enrollment->course->modules->flatMap->lessons->pluck('quiz')->filter(); // Ambil quiz yang tidak null

            foreach ($quizzes as $quiz) {
                 // 50% kemungkinan user submit quiz ini
                if (fake()->boolean(50)) {
                    $submission = QuizSubmission::factory()->create([
                        'user_id' => $enrollment->user_id,
                        'quiz_id' => $quiz->id,
                        'submitted_at' => fake()->dateTimeBetween($enrollment->enrolled_at, 'now'),
                    ]);

                    $correctCount = 0;
                    foreach ($quiz->questions as $question) {
                        $answerId = null;
                        $essayAnswer = null;
                        $status = AnswerStatusType::Incorrect; // Default

                        if ($question->type === QuestionType::Essay) {
                            $essayAnswer = fake()->paragraph();
                            $status = AnswerStatusType::Pending; // Esai perlu dinilai manual
                        } else {
                            // Pilih satu jawaban acak
                            $chosenAnswer = $question->answers->random();
                            $answerId = $chosenAnswer->id;
                            if ($chosenAnswer->is_correct) {
                                $status = AnswerStatusType::Correct;
                                $correctCount++;
                            }
                        }

                        SubmissionAnswer::factory()->create([
                            'quiz_submission_id' => $submission->id,
                            'question_id' => $question->id,
                            'answer_id' => $answerId,
                            'essay_answer' => $essayAnswer,
                            'status' => $status,
                        ]);
                    }

                    // Update score (jika bukan semua esai)
                    if ($quiz->questions->where('type', '!==', QuestionType::Essay)->count() > 0) {
                        $totalQuestions = $quiz->questions->count();
                        $score = ($totalQuestions > 0) ? round(($correctCount / $totalQuestions) * 100) : 0;
                        $submission->update(['score' => $score]);
                    }
                }
            }
        }
    }
}
