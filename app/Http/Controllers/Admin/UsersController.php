<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Enums\UserType;
use App\Enums\OriginStatusType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Core\BaseResourceController;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Laravolt\Avatar\Avatar;

class UsersController extends BaseResourceController
{
  protected $model = User::class;

  protected function indexQuery($query, $request)
  {
    $query->when($request->filled("role"), fn($q) => $q->where("role", $request->role))
      ->when($request->filled("status"), fn($q) => $q->where("status", $request->status));

    return $query;
  }

  protected function getPage($request, $id = null): array
  {
    return [
      "name" => "users",
      "inertia" => "Users",
      "label" => "Pengguna",
      "url" => "/admin/users",
      "fields" => \App\Utils\Helper::getFormFields($this->validation($request)),
    ];
  }

  protected function validation($request, $id = null): array
  {
    return [
      "validation" => [
        "name" => "required|string|max:255",
        "username" => ["nullable", "string", "max:255", Rule::unique(User::class, "username")->ignore($id)],
        "email" => "required|string|email|max:255|unique:" . User::class . ",email," . $id,
        "password" => ["nullable", "confirmed", Rules\Password::defaults()],
        "role" => "required|string|max:255",
        "picture" => ["nullable", ...[is_file($request->picture) ? ["image", "mimes:jpeg,png,jpg,gif,svg,webp,avif", "max:2048"] : []]],
        "status" => "nullable",
        "phone" => ["nullable", "numeric", "digits_between:10,13", "starts_with:08,02"],
      ],
      "default" => [
        "status" => OriginStatusType::Active,
      ],
    ];
  }

  protected function getFormData($request, $user = null): array
  {
    return [
      "page" => $this->page,
      "isAdmin" => $this->isAdmin,
      "roles" => UserType::getValues(),
      "status" => OriginStatusType::getValues(),
    ];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    if ($request->file("picture")) {
      $file = Storage::disk("public")->put("picture", $request->file("picture"));
      $validatedData["picture"] = $file ? "/storage/$file" : null;
    }

    if (empty($validatedData["picture"])) {
      $avatar = new Avatar();
      $validatedData["picture"] = $avatar->create($request->name)
        ->setBackground("#7842f5")
        ->setForeground("#ffffff")
        ->setDimension(200)
        ->setFontSize(100)
        ->toBase64();
    }

    if (!empty($request->password)) {
      $validatedData["password"] = Hash::make($request->password);
    } else {
      unset($validatedData["password"]);
    }

    return $validatedData;
  }

  protected function afterSave($model, Request $request)
  {
    if (!$request->id) {
      $emailParts = explode("@", $model->email);
      $username = preg_replace("/[^A-Za-z0-9]/", "-", $emailParts[0] . $model->id);
      $model->username = $username;
      $model->save();
    }
  }

  protected function beforeSoftDelete($model, Request $request)
  {
    $model->username = "$model->username|deleted:" . time();
    $model->email = "$model->email|deleted:" . time();
    $model->save();
  }

  protected function getAuthorize(Request $request, $user = null, $action = ActionType::Read)
  {
    if ($this->isAdmin)
      return true;
    if (!$user)
      return true;

    $allowedEditedRole = [UserType::User];
    return in_array($user->role, $allowedEditedRole);
  }
}
