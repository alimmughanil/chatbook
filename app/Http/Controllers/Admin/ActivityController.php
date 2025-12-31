<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Activity;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ActivityController extends Controller
{
  public function index(Request $request)
  {
    $sort = $request->sort && $request->sort != 'name' ? $request->sort : 'id';

    if ($request->show) {
      $data = collect(Activity::with(['user' => function ($query) use ($request) {
        if ($request->sort == 'name') return $query->select('id', 'name')->orderBy('name');
        return $query->select('id', 'name');
      }])->orderBy($sort)->get());

      $activities = ['data' => $data];
    } else {
      $activities = collect(Activity::with(['user' => function ($query) use ($request) {
        if ($request->sort == 'name') return $query->select('id', 'name')->orderBy('name');
        return $query->select('id', 'name');
      }])->orderBy($sort)->paginate(10));
    }

    $data = [
      'title' => 'activity',
      'activities' => $activities
    ];
    return Inertia::render('Admin/Activity/Index', $data);
  }

  public function store($request, $menu, $type): void
  {
    $activity = [
      'user_id' => auth()->user()->id,
      'ip_address' => $request->ip(),
      'menu' => $menu,
      'type' => $type,
    ];
    $store = Activity::create($activity);
  }
}
