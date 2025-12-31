<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\DB;

class SoftDeleteService
{
  public static function restore($table, $id, $page)
  {
    DB::beginTransaction();
    try {
      $current = DB::table($table)->where('id',$id)->first();
      $data = [
        'deleted_at'=> null
      ];

      if ($table == 'users') {
        $data['username'] = explode('|',$current->username)[0];
        $data['email'] = explode('|',$current->email)[0];
      }
      DB::table($table)->where('id',$id)->update($data);

      DB::commit();
      return redirect($page['url'])->with('success', "Data {$page['label']} berhasil dipulihkan");
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()->back()->with('error', "Kesalahan Server. Data {$page['label']} gagal dipulihkan");
    }
  }
}
