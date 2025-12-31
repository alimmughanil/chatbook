<?php

namespace App\Http\Controllers\User;

use Error;
use App\Models\Quiz;
use Inertia\Inertia;
use App\Utils\Helper;
use App\Enums\GradingType;
use App\Enums\QuestionType;
use App\Models\Participant;
use Illuminate\Http\Request;
use App\Models\QuizSubmission;
use App\Enums\AnswerStatusType;
use App\Models\SubmissionAnswer;
use Illuminate\Support\Facades\DB;
use App\Enums\SubmissionStatusType;
use App\Enums\QuestionScoreMethodType;
use Illuminate\Support\Facades\Storage;
use App\Enums\SubmissionGradeResultType;
use App\Http\Controllers\Traits\LoadsCourseData;
use App\Http\Controllers\Core\BaseResourceController;

class QuizController extends BaseResourceController
{
  use LoadsCourseData;
  protected $model = Quiz::class;

  public function __construct()
  {
    $this->middleware(function (Request $request, $next) {
      if ($redirect = $this->loadCourseData($request)) {
        return $redirect;
      }

      $this->page = $this->getPage($request);
      return $next($request);
    });
  }

  public function show($id, Request $request)
  {
    $id = $request->route()->parameter('quiz');
    $id = base64_decode($id);

    $quiz = Quiz::query()->where('id', $id)->first();
    if (!$quiz) {
      return Helper::redirectBack("error", "Data {$this->page["label"]} tidak ditemukan");
    }

    $submission = QuizSubmission::where('user_id', auth()->id())
      ->where('quiz_id', $quiz->id)
      ->first();

    if ($submission) {
      $referer = request()->headers->get('referer');
      if (str($referer)->endsWith('result') && in_array($submission->grade_status, [SubmissionGradeResultType::Failed])) {
        // 
      } else {
        return redirect(route("app.quiz.result", [$this->course->slug, base64_encode($quiz->id)]));
      }
    }

    $questions = $quiz->questions()->with([
      'answers' => function ($query) {
        $query->inRandomOrder();
      }
    ])->inRandomOrder()->get();

    $page = $this->page;
    $page["name"] = str($page["name"])->singular()->value();

    $course = $this->course;

    $description = $quiz->description;
    if (!$description) {
      $description = $course->description ? strip_tags($course->description) : null;
    }

    $meta = [
      'title' => "$quiz?->title - $course?->title - " . config('app.name'),
      'description' => $description,
      'image' => $course->thumbnail ?? null,
    ];

    $data = [
      'title' => $meta['title'],
      "page" => $page,
      "quiz" => $quiz,
      "questions" => $questions,
      'meta' => $meta,
    ];

    return Inertia::render('User/Course/Quiz/Show', $data);
  }

  public function store(Request $request)
  {
    DB::beginTransaction();
    try {
      $user = auth()->user();
      $quiz = Quiz::query()->with('questions.answers')->where('id', $request->input('quiz_id'))->first();
      if (!$quiz) {
        return back()->with("error", "Data kuis tidak ditemukan");
      }

      $answereds = $request->all()['answers'];

      foreach ($answereds as $questionId => $answers) {
        if (!is_array($answers)) {
          $answereds[$questionId] = [$answers];
        }
      }

      $questions = $quiz->questions->each(function ($question) use ($answereds) {
        $question->answered = $answereds[$question->id] ?? [];
        $question->correct_answer = $question->answers
          ->where('is_correct', true)
          ->pluck('id')
          ->values()
          ->toArray();

        $question->score = $this->calculateScore($question);
        $question->is_correct = $question->score == 1;

        return $question;
      });

      $isManualGrading = $questions->whereIn('type', [QuestionType::Essay, QuestionType::FileUpload])->isNotEmpty();

      $totalScore = $questions->sum('score');
      $score = round(($totalScore / max(1, $questions->count())) * 100);

      $status = SubmissionStatusType::Submitted;
      $gradeStatus = SubmissionGradeResultType::Pending;
      if ($quiz->grading_type == GradingType::Auto && !$isManualGrading) {
        $status = SubmissionStatusType::Graded;
        $gradeStatus = SubmissionGradeResultType::Failed;
        if (floatval($score) >= floatval($quiz->min_score)) {
          $gradeStatus = SubmissionGradeResultType::Passed;
        }
      }

      $participant = Participant::where(['user_id' => auth()->id(), 'course_id' => $this->course->id])->first();
      $quizSubmission = QuizSubmission::create([
        'user_id' => auth()->id(),
        'participant_id' => $participant->id,
        'quiz_id' => $quiz->id,
        'total_point' => $totalScore,
        'final_score' => $score,
        'status' => $status,
        'grade_status' => $gradeStatus,
      ]);

      $submissionAnswerData = [];
      $submissionDirectory = (new SubmissionAnswer())->getTable();

      if (!Storage::disk('local')->exists($submissionDirectory)) {
        Storage::disk('local')->makeDirectory($submissionDirectory);
      }

      foreach ($questions as $question) {
        $isCorrect = (bool) $question->is_correct;
        foreach ($question->answered as $index => $answered) {
          $answerData = [
            'quiz_submission_id' => $quizSubmission->id,
            'question_id' => $question->id,
            'answer_id' => is_numeric($answered) ? $answered : null,
            'essay_answer' => is_string($answered) ? $answered : null,
            'file_answer' => null,
            'created_at' => now(),
            'updated_at' => now(),
            "score" => $question->score,
            'status' => AnswerStatusType::Pending
          ];

          if (in_array($question->type, [QuestionType::SingleChoice, QuestionType::MultipleChoice])) {
            $answerData['status'] = $isCorrect ? AnswerStatusType::Correct : AnswerStatusType::Incorrect;
          }

          if ($answered instanceof \Illuminate\Http\UploadedFile) {
            $validator = \Validator::make(
              ['file' => $answered],
              ['file' => 'mimes:pdf,xls,xlsx,doc,docx|max:20480']
            );

            if ($validator->fails()) {
              throw new Error("Format file tidak valid atau ukuran terlalu besar", 403);
            }

            $allowedMime = [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ];

            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $realMime = $finfo->file($answered->getPathname());

            if (!in_array($realMime, $allowedMime, true)) {
              throw new Error("Tipe file tidak diizinkan berdasarkan isi file (MIME mismatch)", 403);
            }

            $fileExt = strtolower($answered->getClientOriginalExtension());
            $fileName = str($user->name)->slug('_') . "-";
            $fileName .= "-{$answerData['quiz_submission_id']}-$question->id-";
            $fileName .= time() . "-$index.$fileExt";

            $fileName = Helper::safeFileName($fileName);

            $filePath = Storage::disk('local')->putFileAs($submissionDirectory, $answered, $fileName);
            if (!$filePath) {
              throw new Error('Gagal upload file jawaban, cobalah beberapa saat lagi', 400);
            }

            $answerData['file_answer'] = $filePath;
          }

          $submissionAnswerData[] = $answerData;
        }
      }

      $submissionAnswerChunks = array_chunk($submissionAnswerData, 1000);
      $submissionAnswersTable = (new SubmissionAnswer())->getTable();

      foreach ($submissionAnswerChunks as $chunk) {
        DB::table($submissionAnswersTable)->insert($chunk);
      }

      $message = "Selamat! Anda telah menyelesaikan kuis ini. ";
      DB::commit();

      return redirect(route("app.quiz.result", [$this->course->slug, base64_encode($quiz->id)]))->with('success', $message);
    } catch (\Throwable $th) {
      DB::rollBack();
      if ($th->getCode() < 500) {
        return back()->with("error", $th->getMessage());
      }
      return back()->with("error", "Kuis gagal diselesaikan, silahkan hubungi Admin untuk informasi lebih lanjut.");
    }
  }

  public function result($id, Request $request)
  {
    $id_base64 = $request->route()->parameter('quiz');
    $id = base64_decode($id_base64);

    $quiz = Quiz::query()->withCount('questions')->where('id', $id)->first();
    if (!$quiz) {
      return Helper::redirectBack("error", "Data {$this->page["label"]} tidak ditemukan");
    }

    $submission = QuizSubmission::select('quiz_submissions.*')
      ->addSelect([
        'answers_count' => SubmissionAnswer::selectRaw('COUNT(DISTINCT question_id)')
          ->whereColumn('quiz_submission_id', 'quiz_submissions.id')
      ])
      ->where('user_id', auth()->id())
      ->where('quiz_id', $quiz->id)
      ->first();

    $quizPageUrl = route("app.quiz.show", [$this->course->slug, base64_encode($quiz->id)]);

    if (!$submission)
      return redirect($quizPageUrl);

    if ($submission->status == SubmissionStatusType::Submitted) {
      $submission->score = null;
    }

    $course = $this->course;
    $description = $quiz->description;
    if (!$description) {
      $description = $course->description ? strip_tags($course->description) : null;
    }

    $meta = [
      'title' => "Hasil $quiz?->title - $course?->title - " . config('app.name'),
      'description' => $description,
      'image' => $course->thumbnail ?? null,
    ];

    $modulePageUrl = route("app.module.index", $this->course->slug);

    $data = [
      'title' => $meta['title'],
      "page" => $this->page,
      "quiz" => $quiz,
      "submission" => $submission,
      'meta' => $meta,
      'modulePageUrl' => $modulePageUrl,
      'quizPageUrl' => $quizPageUrl,
    ];

    return Inertia::render('User/Course/Quiz/Result', $data);
  }

  private function calculateScore($question): float
  {
    if ($question->type === QuestionType::Essay) {
      return 0.0;
    }

    $mode = $question->score_method ?? QuestionScoreMethodType::Exact;

    return match ($mode) {
      QuestionScoreMethodType::Exact => $this->scoreExact($question),
      QuestionScoreMethodType::PartialProportional => $this->scorePartialProportional($question),
      QuestionScoreMethodType::PartialWeighted => $this->scorePartialWeighted($question),
      QuestionScoreMethodType::Manual => 0.0,
      default => 0.0,
    };
  }

  private function scoreExact($question): float
  {
    $answered = $question->answered;
    $correct = $question->correct_answer;

    sort($answered);
    sort($correct);

    return ($answered === $correct) ? 1.0 : 0.0;
  }

  private function scorePartialProportional($question): float
  {
    $correct = $question->correct_answer;
    $answered = $question->answered;

    if (count($correct) === 0) {
      return 0.0;
    }

    $intersection = array_intersect($answered, $correct);
    return count($intersection) / count($correct);
  }

  private function scorePartialWeighted($question): float
  {
    $correctAnswers = $question->answers->where('is_correct', true);

    $totalWeight = $correctAnswers->sum('weight');
    if ($totalWeight == 0)
      return 0.0;

    $earnedWeight = $correctAnswers
      ->whereIn('id', $question->answered)
      ->sum('weight');

    return $earnedWeight / $totalWeight;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $courseSlug = $this->courseSlug;

    $page = [
      "name" => "quiz",
      "inertia" => "User/Course/Quiz",
      "label" => "Kuis",
      "url" => "/course/{$courseSlug}/quiz",
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [],
      "default" => [],
    ];
  }
}
