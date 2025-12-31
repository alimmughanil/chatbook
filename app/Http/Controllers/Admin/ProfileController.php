<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Utils\Helper;
use App\Enums\UserType;
use App\Enums\ActionType;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Controller;

class ProfileController extends Controller
{
  public $adminRole = [UserType::Admin];
  public $isAdmin = false;
  public $page = null;

  public function __construct()
  {
    $this->middleware(function ($request, $next) {
      $user = auth()->user();
      $this->page = $this->getPage($request);
      $this->isAdmin = $user && in_array($user->role, $this->adminRole);
      return $next($request);
    });
  }

  public function index(Request $request)
  {
    $profiles = Profile::when($request->filled("status"), function ($query) use ($request) {
      $query->where("status", $request->status);
    })
      ->filter($request)
      ->paginate(20);

    $data = [
      "title" => "{$this->page["label"]}",
      "status" => PublishStatusType::getValues(),
      "page" => $this->page,
      "profiles" => collect($profiles),
      "isAdmin" => $this->isAdmin,
    ];

    return Inertia::render("Admin/Profile/Index", $data);
  }

  protected function getFormData($request, $profile = null)
  {
    $page = $this->getPage($request);
    $data = [
      "isAdmin" => $this->isAdmin,
      "page" => $page,
      "status" => PublishStatusType::getValues(),
    ];

    return $data;
  }

  public function create(Request $request)
  {
    $formData = $this->getFormData($request);
    $data = [...$formData, "title" => "Tambah {$this->page["label"]}"];

    return Inertia::render("Admin/Profile/Create", $data);
  }

  public function edit($id, Request $request)
  {
    $profile = Profile::where("id", $id)->first();
    $authorize = $this->getAuthorize($request, $profile, ActionType::Update);
    if ($authorize instanceof \Illuminate\Http\RedirectResponse) {
      return $authorize;
    }

    $formData = $this->getFormData($request, $profile);

    $data = [...$formData, "title" => "Edit {$this->page["label"]}", "profile" => $profile];
    $data["page"]["name"] = str($this->page["name"])->singular();

    return Inertia::render("Admin/Profile/Edit", $data);
  }

  public function store(Request $request)
  {
    $validatedData = $request->validate($this->validation($request)["validation"]);

    DB::beginTransaction();
    try {
      $validationResult = $this->processValidateData($validatedData, $request);
      if ($validationResult instanceof \Illuminate\Http\RedirectResponse) {
        return $validationResult;
      }

      [$validatedData] = $validationResult;
      Profile::create($validatedData);

      DB::commit();
      return redirect(\App\Utils\Helper::getRefurl(request()) ?? $this->page["url"])->with("success", "Tambah {$this->page["label"]} Baru Berhasil");
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()
        ->back()
        ->with("error", "Tambah {$this->page["label"]} Baru Gagal. Kesalahan sistem internal");
    }
  }

  public function update($id, Request $request)
  {
    $validatedData = $request->validate($this->validation($request, $id)["validation"]);

    DB::beginTransaction();
    try {
      $profile = Profile::where("id", $id)->first();

      $authorize = $this->getAuthorize($request, $profile, ActionType::Update);
      if ($authorize instanceof \Illuminate\Http\RedirectResponse) {
        return $authorize;
      }

      $validationResult = $this->processValidateData($validatedData, $request);
      if ($validationResult instanceof \Illuminate\Http\RedirectResponse) {
        return $validationResult;
      }

      [$validatedData] = $validationResult;
      $profile->update($validatedData);

      DB::commit();
      return redirect(\App\Utils\Helper::getRefurl(request()) ?? $this->page["url"])->with("success", "Update {$this->page["label"]} Berhasil");
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()
        ->back()
        ->with("error", "Update {$this->page["label"]} Gagal. Kesalahan sistem internal");
    }
  }

  protected function processValidateData($validatedData, $request)
  {
    // $validatedData['user_id'] = auth()->id();
    return [$validatedData];
  }

  public function destroy($id, Request $request)
  {
    DB::beginTransaction();
    try {
      $profile = Profile::where("id", $id)->first();

      $authorize = $this->getAuthorize($request, $profile, ActionType::Delete);
      if ($authorize instanceof \Illuminate\Http\RedirectResponse) {
        return $authorize;
      }

      $message = "Hapus {$this->page["label"]} Berhasil";
      $profile->delete();

      DB::commit();
      return redirect(\App\Utils\Helper::getRefurl(request()) ?? $this->page["url"])->with("success", $message);
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()
        ->back()
        ->with("error", "Hapus {$this->page["label"]} Gagal. {$this->page["label"]} ini masih digunakan oleh fitur lain");
    }
  }

  protected function getAuthorize($request, $data = null, $action = ActionType::Read)
  {
    $user = auth()->user();
    if ($user->role == UserType::Admin) {
      return true;
    }

    $actionLabels = Helper::getEnumTranslation(ActionType::class, "id");
    $forbiddenMessage = "Anda tidak diperbolehkan {$actionLabels[$action]} {$this->page["label"]} ini";

    return Helper::redirectBack("error", $forbiddenMessage);
  }

  protected function getPage($request, $id = null)
  {
    $fields = \App\Utils\Helper::getFormFields($this->validation($request));

    $page = [
      "name" => "profiles",
      "label" => "Profil",
      "url" => "/admin/profiles",
      "data" => null,
      "fields" => $fields,
    ];

    return $page;
  }

  protected function validation($request, $id = null)
  {
    return [
      "validation" => [
        "type" => "required|string",
        "label" => "required|string",
        "content" => "required|string",
        "status" => "required|string",
      ],
      "default" => [
        "status" => PublishStatusType::Draft,
      ],
    ];
  }
}
