<?php

namespace App\Http\Controllers\Admin\Module;

use App\Enums\QuestionType;
use App\Enums\SubmissionGradeResultType;
use App\Enums\SubmissionStatusType;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizSubmission;
use App\Utils\Helper;
use Illuminate\Http\Request;
use App\Enums\AnswerStatusType;
use App\Models\SubmissionAnswer;
use App\Http\Controllers\Core\BaseResourceController;
use Illuminate\Support\Collection;

class SubmissionAnswerController extends BaseResourceController
{
  protected $model = SubmissionAnswer::class;

  public function index(Request $request)
  {
    $perPage = $request->input("per_page", 20);
    $routes = $request->route()->parameters();

    $query = Question::where('quiz_id', $routes['quiz_id']);
    $query = $this->indexQuery($query, $request);
    $query = $query->filter($request);
    $instance = $query->paginate($perPage);
    $instance = collect($instance);
    $instance['data'] = $this->instanceData(collect($instance['data']));

    $data = [
      "title" => $this->page["label"],
      "page" => $this->page,
      "questions" => $instance,
      "isAdmin" => $this->isAdmin,
      ...$this->indexData($request),
    ];

    return $this->inertiaRender("Index", $data);
  }

  protected function indexQuery($query, Request $request)
  {
    $query->with('answers', 'submissionAnswers.answer');
    $query->when($request->filled("status"), fn($q) => $q->whereRelation("submissionAnswers", "status", "=", $request->status));
    return $query;
  }

  protected function instanceData(Collection $instance)
  {
    $instance = $instance->map(function ($question) {
      $submissionAnswers = collect($question['submission_answers']);
      $question['essay_answers'] = [];

      if (in_array($question['type'], [QuestionType::Essay])) {
        $question['essay_answers'] = $submissionAnswers->pluck('essay_answer')->toArray();
      }


      $question['choice_answer_ids'] = [];
      if (in_array($question['type'], [QuestionType::SingleChoice, QuestionType::MultipleChoice])) {
        $question['choice_answer_ids'] = $submissionAnswers->pluck('answer_id')->toArray();
      }

      $question['choice_answers'] = [];
      if (in_array($question['type'], haystack: [QuestionType::SingleChoice, QuestionType::MultipleChoice])) {
        $question['choice_answers'] = $submissionAnswers->pluck('answer')->toArray();
      }

      $question['answer_score'] = $submissionAnswers->sum('score');
      $question['answer_status'] = $submissionAnswers->pluck('status')->unique()->first();
      return $question;
    });

    return $instance;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "submission_answers",
      "inertia" => "Admin/Module/SubmissionAnswer",
      "label" => "Jawaban Terkumpul",
      "url" => "/" . $request->path(),
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    $params = $request->route()->parameters();
    $url = collect($params)
      ->map(function ($value, $key) {
        $key = str_replace('_id', '', $key);
        $key = str($key)->plural()->value();
        return "{$key}/{$value}";
      })
      ->implode('/');

    if (!str($url)->contains($page["name"])) {
      $url .= "/answers";
    }

    if (in_array($this->routeType, ['edit', 'update', 'destroy'])) {
      $pageUrl = explode("/answers", $url);
      $url = "{$pageUrl[0]}/answers";
    }

    $url = "/admin/{$url}";
    $page["url"] = $url;
    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "status" => "required|string|max:255",
      ],
      "default" => [
        "status" => AnswerStatusType::Pending,
      ],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $formData = [];
    return [...parent::getFormData($request, $model), ...$formData];
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    $params = $request->route()->parameters();
    $quiz = Quiz::find($params['quiz_id']);

    $question = null;
    // if ($request->question_id) {
    //   $question = Question::with(['answers', 'submissionAnswers.answer'])->whereId($request->question_id)->first();
    // }

    $data = [
      ...parent::indexData($request, $isFormData),
      "title" => "Jawaban: $quiz->title",
      "quiz" => $quiz,
      "question" => $question,
      "status" => AnswerStatusType::getValues()
    ];

    return $data;
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $routes = $request->route()->parameters();
    $quiz = Quiz::find($routes['quiz_id']);
    if (!$quiz)
      throw new \Error("Kuis tidak ditemukan", 404);

    return $validatedData;
  }

  protected function afterSave($model, Request $request)
  {
    $quizSubmission = QuizSubmission::with('quiz')->where('id', $model->quiz_submission_id)->first();
    $submissionAnswerQuery = SubmissionAnswer::query()->where('quiz_submission_id', $model->quiz_submission_id)->where('status', AnswerStatusType::Correct);
    
    $questionTotal = Question::where('quiz_id', $quizSubmission->quiz_id)->count();
    $correntAnswerTotal = $submissionAnswerQuery->distinct('question_id')->count();
    
    $quizSubmissionData = [
      'total_point' => $correntAnswerTotal,
      'final_score' => round(($correntAnswerTotal / max(1, $questionTotal)) * 100),
    ];
    
    $existPending = SubmissionAnswer::query()->where('quiz_submission_id', $model->quiz_submission_id)->where('status', AnswerStatusType::Pending)->exists();
    if (!$existPending) {
      $quizSubmissionData['status'] = SubmissionStatusType::Graded;
      $quizSubmissionData['grade_status'] = SubmissionGradeResultType::Passed;
      
      $minScore = $quizSubmission?->quiz?->min_score;
      if (!!$minScore && floatval($quizSubmissionData['final_score']) >= floatval($minScore)) {
        $quizSubmissionData['grade_status'] = SubmissionGradeResultType::Passed;
      } else {
        $quizSubmissionData['grade_status'] = SubmissionGradeResultType::Failed;
      }
    }

    $quizSubmission->update($quizSubmissionData);
  }

  protected function selectParams($query, Request $request)
  {
    $routeParams = $request->route()->parametersWithoutNulls();
    if (empty($routeParams))
      return $query;

    $id = $routeParams['answer'];
    $query->where("id", $id);

    return $query;
  }
}
