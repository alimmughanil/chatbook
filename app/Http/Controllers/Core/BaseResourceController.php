<?php

namespace App\Http\Controllers\Core;

use Inertia\Inertia;
use App\Utils\Helper;
use App\Enums\UserType;
use App\Enums\ActionType;
use Illuminate\Http\Request;
use App\Models\Traits\Filterable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Enums\AttachmentContentType;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use App\Http\Services\SoftDeleteService;
use Illuminate\Database\Eloquent\SoftDeletes;

abstract class BaseResourceController extends Controller
{
  /**
   * Model yang wajib didefinisikan di child
   */

  /** @var Model $model */
  protected $model;

  /** @var Model $modelInstance */
  protected $modelInstance;
  /**
   * Hak akses admin
   */
  protected array $adminRole = [UserType::Admin];
  protected bool $isAdmin = false;
  protected bool $isEdit = false;

  /**
   * Konfigurasi halaman
   */
  protected array $page = [];
  protected string $routeType = "";

  public function __construct()
  {
    $this->model = app($this->model);
    $this->middleware(function (Request $request, $next) {
      $routeName = $request->route()->getName();
      $routeName = explode(".", $routeName);
      $this->routeType = end($routeName);

      $user = auth()->user();
      $this->page = $this->getPage($request);
      $this->isAdmin = $user && in_array($user->role, $this->adminRole);

      return $next($request);
    });
  }

  /**
   * --- CRUD METHODS ---
   */

  public function index(Request $request)
  {
    $indexValidation = $this->indexValidation($request);
    if ($indexValidation instanceof \Illuminate\Http\RedirectResponse)
      return $indexValidation;

    $perPage = $request->input("per_page", 20);
    $modelClass = $this->model;
    $query = $modelClass::query();
    $query = $this->indexQuery($query, $request);
    $query = $this->selectParams($query, $request);

    $useFilterable = in_array(Filterable::class, class_uses_recursive($modelClass));
    if ($useFilterable) {
      $query = $query->filter($request);
    }

    $instance = $query->paginate($perPage);
    $instance = collect($instance);
    $instance['data'] = $this->instanceData(collect($instance['data']));

    $data = [
      "title" => $this->page["label"],
      "page" => $this->page,
      $this->page["name"] => $instance,
      "isAdmin" => $this->isAdmin,
      ...$this->indexData($request),
    ];

    return $this->inertiaRender("Index", $data);
  }

  public function create(Request $request)
  {
    $formData = $this->getFormData($request);
    return $this->inertiaRender("Create", [
      ...$formData,
      "title" => "Tambah {$this->page["label"]}",
    ]);
  }

  public function edit($id, Request $request)
  {
    $this->isEdit = true;
    $modelClass = $this->model;
    $query = $modelClass::query();
    $query = $this->selectParams($query, $request);
    $model = $query->first();

    if (!$model) {
      return Helper::redirectBack("error", "Data {$this->page["label"]} tidak ditemukan");
    }

    $authorize = $this->getAuthorize($request, $model, ActionType::Update);
    if ($authorize instanceof \Illuminate\Http\RedirectResponse)
      return $authorize;

    $formData = $this->getFormData($request, $model);

    $page = $this->page;
    $page["name"] = str($page["name"])->singular()->value();

    $data = [
      ...$formData,
      "title" => "Edit {$this->page["label"]}",
      "page" => $page,
      $page["name"] => $model,
    ];

    return $this->inertiaRender("Edit", $data);
  }
  public function show($id, Request $request)
  {
    $modelClass = $this->model;
    $query = $modelClass::query();
    $query = $this->selectParams($query, $request);
    $query = $this->showQuery($query, $request);
    $model = $query->first();

    if (!$model) {
      return Helper::redirectBack("error", "Data {$this->page["label"]} tidak ditemukan");
    }

    $authorize = $this->getAuthorize($request, $model, ActionType::Update);
    if ($authorize instanceof \Illuminate\Http\RedirectResponse)
      return $authorize;

    $showData = $this->getShowData($request, $model);

    $page = $this->page;
    $page["name"] = str($page["name"])->singular()->value();

    $data = [
      "title" => "Detail {$this->page["label"]}",
      ...$showData,
      "page" => $page,
      $page["name"] => $model,
    ];

    return $this->inertiaRender("Show", $data);
  }

  public function store(Request $request)
  {
    $validation = $this->validation($request)["validation"];
    $detailValidation = isset($this->validation($request)["detail_validation"]) ? $this->validation($request)["detail_validation"] : [];
    $validation = array_merge($validation, $detailValidation);

    $validated = $request->validate($validation);

    DB::beginTransaction();
    try {
      $validated = $this->beforeSave($validated, $request);
      $modelClass = $this->model;
      $model = $modelClass::create($validated);
      $this->modelInstance = $model;

      $this->afterSave($model, $request);

      DB::commit();
      return $this->inertiaRedirect($request, "Tambah");
    } catch (\Throwable $th) {
      DB::rollBack();
      if ($th->getCode() < 500) {
        return back()->with("error", $th->getMessage());
      }
      return back()->with("error", "Tambah {$this->page["label"]} Gagal: {$th->getMessage()}");
    }
  }

  public function update($id, Request $request)
  {
    if ($request->restore_data == '1')
      return $this->restoreSoftDelete($id);

    $actionUpdate = $this->actionUpdate($id, $request);
    if ($actionUpdate)
      return $actionUpdate;

    $this->isEdit = true;

    $validation = $this->validation($request, $id)["validation"];
    $detailValidation = isset($this->validation($request, $id)["detail_validation"]) ? $this->validation($request, $id)["detail_validation"] : [];
    $validation = array_merge($validation, $detailValidation);

    $validated = $request->validate($validation);

    DB::beginTransaction();
    try {
      $modelClass = $this->model;
      $query = $modelClass::query();
      $query = $this->selectParams($query, $request);
      $model = $query->first();
      if (!$model)
        return Helper::redirectBack("error", "Data {$this->page["label"]} tidak ditemukan");

      $this->modelInstance = $model;
      $authorize = $this->getAuthorize($request, $model, ActionType::Update);
      if ($authorize instanceof \Illuminate\Http\RedirectResponse)
        return $authorize;

      $validated = $this->beforeSave($validated, $request);
      $model->update($validated);
      $this->afterSave($model, $request);

      DB::commit();
      return $this->inertiaRedirect($request, "Update");
    } catch (\Throwable $th) {
      DB::rollBack();
      if ($th->getCode() < 500) {
        return back()->with("error", $th->getMessage());
      }
      return back()->with("error", "Update {$this->page["label"]} Gagal: {$th->getMessage()}");
    }
  }

  public function destroy($id, Request $request)
  {
    DB::beginTransaction();
    try {
      $modelClass = $this->model;
      $query = $modelClass::query();
      $query = $this->selectParams($query, $request);
      $model = $query->first();

      if (!$model)
        return Helper::redirectBack("error", "Data {$this->page["label"]} tidak ditemukan");

      $authorize = $this->getAuthorize($request, $model, ActionType::Delete);
      if ($authorize instanceof \Illuminate\Http\RedirectResponse)
        return $authorize;

      $this->beforeDelete($model, $request);
      if ($model->deleted_at) {
        $model->forceDelete();
      } else {
        $this->beforeSoftDelete($model, $request);
        $model->delete();
      }
      $this->afterDelete($model, $request);

      DB::commit();
      return $this->inertiaRedirect($request, "Hapus");
    } catch (\Throwable $th) {
      DB::rollBack();
      if ($th->getCode() < 500) {
        return back()->with("error", $th->getMessage());
      }
      return back()->with("error", "Hapus {$this->page["label"]} Gagal: {$th->getMessage()}");
    }
  }

  /**
   * Default authorization
   */
  protected function getAuthorize(Request $request, $data = null, $action = ActionType::Read)
  {
    $user = auth()->user();
    if ($user->role == UserType::Admin)
      return true;

    if ($user->role == UserType::Partner) {
      $userId = $data?->user_id;
      if ($userId && $userId == $user->id)
        return true;
    }

    $actionLabels = Helper::getEnumTranslation(ActionType::class, "id");
    return Helper::redirectBack("error", "Anda tidak diperbolehkan {$actionLabels[$action]} {$this->page["label"]} ini");
  }

  /**
   * Method abstract wajib di-override di child
   */
  abstract protected function getPage(Request $request, $id = null): array;
  abstract protected function validation(Request $request, $id = null): array;
  protected function indexQuery($query, Request $request)
  {
    return $query;
  }
  protected function showQuery($query, Request $request)
  {
    return $this->indexQuery($query, $request);
  }

  /**
   * Bisa dioverride untuk form tambahan
   */
  protected function indexValidation(Request $request)
  {
    return null;
  }
  protected function indexData(Request $request, $isFormData = true): array
  {
    if (!$isFormData)
      return [];
    return $this->getFormData($request, null);
  }
  protected function instanceData(Collection $instance)
  {
    return $instance;
  }
  protected function getFormData(Request $request, $model = null): array
  {
    return [
      "page" => $this->page,
      "isAdmin" => $this->isAdmin,
    ];
  }
  protected function getShowData(Request $request, $model = null): array
  {
    return [
      "page" => $this->page,
      "isAdmin" => $this->isAdmin,
    ];
  }

  /**
   * Hooks sebelum create/update
   */
  protected function beforeSave(array $validatedData, Request $request): array
  {
    return $validatedData;
  }

  /**
   * Hooks setelah create/update
   */
  protected function afterSave($model, Request $request)
  {
    // Bisa dioverride di child
  }

  /**
   * Hooks sebelum delete
   */
  protected function beforeDelete($model, Request $request)
  {
    // Bisa dioverride di child
  }
  protected function beforeSoftDelete($model, Request $request)
  {
    if (!in_array(SoftDeletes::class, class_uses_recursive($this->model))) {
      return;
    }

    $columns = Schema::getColumnListing($model->getTable());
    $timestamp = time();
    $thditedColumns = ['slug', 'code', 'email', 'username'];

    foreach ($thditedColumns as $field) {
      if (in_array($field, $columns) && !empty($model->$field)) {
        $model->$field .= "|deleted:{$timestamp}";
      }
    }

    $model->save();
  }
  /**
   * Hooks setelah delete
   */
  protected function afterDelete($model, Request $request)
  {
    // Bisa dioverride di child
  }
  protected function actionUpdate($id, Request $request)
  {
    return null;
  }

  protected function restoreSoftDelete($modelId)
  {
    if (!in_array(SoftDeletes::class, class_uses_recursive($this->model))) {
      return redirect()->back()->with('error', "{$this->page['label']} tidak menggunakan fitur soft delete");
    }

    return SoftDeleteService::restore($this->model->getTable(), $modelId, $this->page);
  }
  protected function inertiaRender($component, $data, $prefix = "Admin")
  {
    $pagePath = ucfirst($this->page["inertia"]);
    if ($prefix && !str($pagePath)->startsWith($prefix)) {
      $pagePath = "$prefix/$pagePath";
    }

    $pagePath = "$pagePath/$component";
    return Inertia::render($pagePath, $data);
  }
  protected function inertiaRedirect(Request $request, $type)
  {
    $pageUrl = $this->page["url"];
    return redirect(Helper::getRefurl($request) ?? $pageUrl)->with("success", "$type {$this->page["label"]} Berhasil");
  }
  protected function selectParams($query, Request $request)
  {
    $routeParams = $request->route()->parametersWithoutNulls();
    if (empty($routeParams))
      return $query;

    $tableName = $this->model->getTable();
    $columns = Schema::getColumnListing($tableName);
    $modelName = str($tableName)->singular()->value();

    $validColumnsAsKeys = array_flip($columns);
    $validRouteParams = array_intersect_key($routeParams, $validColumnsAsKeys);

    if (!empty($validRouteParams)) {
      $query->where($validRouteParams);
    }
    if (!empty($routeParams[$modelName])) {
      $query->where("id", $routeParams[$modelName]);
    }

    return $query;
  }

  protected function setDefaultValue(Request $request, $defaultValues = [], $model = null, $page = null)
  {
    if (!empty($model)) {
      $array = collect($model->toArray())->only($defaultValues)->toArray();
      $request->merge([...$array, ...$request->all()]);
    }

    if (!$page) {
      $page = $this->page;
    }

    foreach ($defaultValues as $value) {
      if ($request->filled($value)) {
        $page["fields"] = collect($page["fields"])->map(function ($field) use ($request, $value) {
          if ($field["name"] == $value) {
            $field["defaultValue"] = $request->input($value);
          }
          return $field;
        })->toArray();
      }
    }

    return $page;
  }

  protected function saveFiles(Request $request, $validatedData, $fields = [], $isRemoveUnused = true, $fileName = null, $disk = 'public')
  {
    $files = [];
    try {
      foreach ($fields as $field) {
        $fileContent = $request->file($field);
        if ($fileContent) {
          $directory = str($this->model->getTable())->singular()->value();
          if (!Storage::disk($disk)->exists($directory)) {
            Storage::disk($disk)->makeDirectory($directory);
          }

          $fileExt = $fileContent->getClientOriginalExtension();
          if (!$fileName) {
            $originFileName = $fileContent->getClientOriginalName();
            $fileName = Helper::safeFileName($originFileName);
          } else {
            $fileName = str($fileName)->slug()->limit(50, '')->value();
            $fileName = config('app.name') . "-$fileName.$fileExt";
          }

          $filePath = Storage::disk($disk)->putFileAs($directory, $fileContent, $fileName);
          if (!$filePath) {
            throw new \Error("Gagal upload file", 422);
          }

          if ($disk == 'public') {
            $filePath = "/storage/$filePath";
          }
          $validatedData[$field] = $filePath;
          $files[] = $validatedData[$field];
        }

        if (!$this->isEdit || !$isRemoveUnused || !empty($validatedData[$field]))
          continue;

        if (empty($this->modelInstance) || empty($this->modelInstance->{$field}))
          continue;

        $currentFilePath = $this->modelInstance->{$field};
        if (str($currentFilePath)->startsWith("/storage/")) {
          $currentFilePath = str_replace("/storage/", "", $currentFilePath);
        }
        Storage::disk($disk)->delete($currentFilePath);
      }

      return $validatedData;
    } catch (\Throwable $th) {
      if (count($files) > 0) {
        foreach ($files as $file) {
          $filePath = $file;
          if (str($filePath)->startsWith("/storage/")) {
            $filePath = str_replace("/storage/", "", $filePath);
          }
          Storage::disk($disk)->delete($filePath);
        }
      }

      throw $th;
    }
  }
  protected function saveAttachments(Request $request, $attachmentModel, $attachmentType, $attachmentData = [], $attachmentField = 'attachment', $fileName = null, $disk = 'public')
  {
    $files = [];
    try {
      $attachmentModel = new $attachmentModel;
      $fields = $request->input($attachmentField);
      $latestAttachment = collect($fields)->pluck('id')->whereNotNull()->toArray();
      $deleteAttachment = $attachmentModel->query()
        ->whereNotIn('id', $latestAttachment)
        ->whereNotIn('content_type', [AttachmentContentType::Link])
        ->when(!empty($attachmentData), function ($query) use ($attachmentData) {
          $query->where($attachmentData);
        })
        ->get();

      if ($deleteAttachment->isNotEmpty()) {
        foreach ($deleteAttachment as $attachment) {
          $filePath = Helper::safeFileName($attachment->value);
          if (str($filePath)->startsWith("/storage/")) {
            $filePath = str_replace("/storage/", "", $filePath);
          }

          if (Storage::disk($disk)->exists($filePath)) {
            Storage::disk($disk)->delete($filePath);
          }
          $attachment->delete();
        }
      }

      $fields = $request->file($attachmentField);
      if (!$fields || empty($fields))
        return;

      foreach ($fields as $field) {
        $fileContent = $field;

        $directory = str($attachmentModel->getTable())->singular()->value();
        if (!Storage::disk($disk)->exists($directory)) {
          Storage::disk($disk)->makeDirectory($directory);
        }

        $fileExt = strtolower($fileContent->getClientOriginalExtension());
        $originFileName = $fileContent->getClientOriginalName();

        if (!$fileName) {
          $fileName = Helper::safeFileName($originFileName);
        } else {
          $fileName = str($fileName)->slug()->limit(50, '')->value();
          $fileName = config('app.name') . "-$fileName.$fileExt";
        }

        $filePath = Storage::disk($disk)->putFileAs($directory, $fileContent, $fileName);
        if (!$filePath) {
          throw new \Error("Gagal upload file", 422);
        }

        if ($disk == 'public') {
          $filePath = "/storage/$filePath";
        }

        $attachmentData = [
          ...$attachmentData,
          'type' => $attachmentType,
          'label' => $originFileName,
          'value' => $filePath,
          "content_type" => AttachmentContentType::fromExtension($fileExt)
        ];
        $files[] = $attachmentModel->create($attachmentData);
      }

      return $files;
    } catch (\Throwable $th) {
      if (count($files) > 0) {
        foreach ($files as $file) {
          $filePath = $file->value;
          if (str($filePath)->startsWith("/storage/")) {
            $filePath = str_replace("/storage/", "", $filePath);
          }
          Storage::disk($disk)->delete($filePath);
        }
      }

      throw $th;
    }
  }
  protected function saveMultipleForms(Request $request, $modelClass, $multipleFormData = [], $multipleFormField = 'attachment_link')
  {
    $modelInstance = new $modelClass;
    $rawInput = $request->input($multipleFormField);

    if (is_string($rawInput)) {
      $inputs = json_decode($rawInput, true) ?? [];
    } else {
      $inputs = is_array($rawInput) ? $rawInput : [];
    }
    $keepIds = collect($inputs)->pluck('id')->filter()->toArray();
    $modelInstance->query()
      ->whereNotIn('id', $keepIds)
      ->when(!empty($multipleFormData), function ($query) use ($multipleFormData) {
        $query->where($multipleFormData);
      })
      ->delete();

    return $modelClass::multipleFormInput($inputs, $multipleFormData);
    ;
  }

  protected function updateStatus($status, Request $request)
  {
    DB::beginTransaction();
    try {
      $modelClass = $this->model;
      $query = $modelClass::query();
      $query = $this->selectParams($query, $request);
      $model = $query->first();
      if (!$model)
        return Helper::redirectBack("error", "Data {$this->page["label"]} tidak ditemukan");

      $this->modelInstance = $model;
      $authorize = $this->getAuthorize($request, $model, ActionType::Update);
      if ($authorize instanceof \Illuminate\Http\RedirectResponse)
        return $authorize;

      $validated = [
        "status" => $status
      ];

      $tableName = $this->model->getTable();
      $columns = Schema::getColumnListing($tableName);

      if (in_array('status_message', $columns) && $request->filled('status_message')) {
        $validated['status_message'] = $request->status_message;
      }

      $model->update($validated);
      $this->afterSave($model, $request);

      DB::commit();
      return $this->inertiaRedirect($request, "Update");
    } catch (\Throwable $th) {
      DB::rollBack();
      if ($th->getCode() < 500) {
        return back()->with("error", $th->getMessage());
      }
      return back()->with("error", "Update {$this->page["label"]} Gagal: {$th->getMessage()}");
    }
  }
}
