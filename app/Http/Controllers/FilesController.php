<?php

namespace App\Http\Controllers;

use App\Enums\UserType;
use App\Http\Controllers\Controller;

class FilesController extends Controller
{
  public function getAuthorize($model, $user)
  {
    $currentUser = auth()->user();

    if ($currentUser->role === UserType::Admin) {
      return true;
    }

    if ($currentUser->id === $user->id) {
      return true;
    }

    if ($currentUser->id === $model->user_id) {
      return true;
    }

    return false;
  }
}
