<?php

namespace App\Http\Controllers\Admin\Module;

use App\Utils\Helper;
use App\Models\Answer;
use App\Models\Question;
use App\Enums\QuestionType;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Core\BaseResourceController;

class AnswerController extends BaseResourceController
{
  protected $model = Answer::class;

  protected function indexQuery($query, Request $request)
  {
    return $query;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "answers",
      "inertia" => "Admin/Module/Answer",
      "label" => "Jawaban",
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

    if (in_array($this->routeType, ['edit', 'update', 'destroy'])) {
      $pageUrl = explode("/questions", $url);
      $url = "{$pageUrl[0]}/questions";
    }

    $url = "/admin/{$url}";
    $page["url"] = $url;

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "answer_text" => "required|string|max:255",
        "is_correct" => "nullable|boolean",
      ],
      "default" => [
        "is_correct" => false,
      ],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    return [...parent::getFormData($request, $model)];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $routes = $request->route()->parameters();
    $question = Question::find($routes['question_id']);
    if (!$question)
      throw new \Error("Pertanyaan tidak ditemukan", 404);

    if (in_array($question->type, [QuestionType::Essay])) {
      throw new \Error("Pilihan jawaban tidak diperlukan untuk pertanyaan jenis essay");
    }

    if (in_array($question->type, [QuestionType::SingleChoice]) && $validatedData['is_correct']) {
      $existAnswer = Answer::query()->where('question_id', $question->id)->where('is_correct', true)->first();
      if ($existAnswer) {
        $existAnswer->is_correct = false;
        $existAnswer->save();
      }
    }

    $validatedData['question_id'] = $question->id;
    return $validatedData;
  }

  protected function inertiaRedirect(Request $request, $type)
  {
    $pageUrl = $this->page["url"];
    $routes = $request->route()->parameters();

    if (isset($routes['question_id'])) {
      $pageUrl .= "?question_id={$routes['question_id']}";
    }

    return redirect(Helper::getRefurl($request) ?? $pageUrl)->with("success", "$type {$this->page["label"]} Berhasil");
  }
}
