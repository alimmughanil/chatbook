<?php

namespace App\Http\Controllers\Admin;

use App\Models\Contact;
use App\Utils\Helper;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Core\BaseResourceController;

class ContactController extends BaseResourceController
{
  protected $model = Contact::class;

  protected function indexQuery($query, Request $request)
  {
    return $query;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "contacts",
      "inertia" => "Admin/Contact",
      "label" => "Kontak",
      "url" => "/" . $request->path(),
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    $pageUrl = explode("/{$page["name"]}", $page["url"]);
    $page["url"] = "{$pageUrl[0]}/{$page["name"]}";
    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "name" => "required|string|max:255",
        "email" => "required|string|email|max:255",
        "message" => "required|string",
        "is_reply" => "required|boolean",
      ],
      "default" => [],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    return [...parent::getFormData($request, $model)];
  }
}
