<?php

namespace App\Http\Controllers;

use App\Utils\Helper;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
  public $companyName = '';
  public $baseFilter = [];
  public function __construct()
  {
    $this->middleware(function (Request $request, $next) {
      $this->baseFilter = [...Helper::publishStatus()];
      return $next($request);
    });
  }

  public function index()
  {
    return redirect("/login");
  }
}
