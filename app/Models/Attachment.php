<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attachment extends Model
{
  use HasFactory, Filterable;
  protected $guarded = ['id'];

  public function workHistory()
  {
    return $this->belongsTo(\App\Models\WorkHistory::class, 'lesson_id', 'id');
  }

  public static function multipleFormInput(array $inputs, array $extraData = []): Collection
  {
    $savedRecords = collect([]);

    foreach ($inputs as $input) {
      if (empty($input['label']) && empty($input['value'])) {
        continue;
      }

      $dataToSave = array_merge($extraData, [
        'label' => $input['label'] ?? null,
        'value' => $input['value'] ?? null,
      ]);

      $record = null;
      if (isset($input['id']) && $input['id']) {
        $record = self::find($input['id']);
      } 

      if ($record) {
        $record->update($dataToSave);
      } else {
        $record = self::create($dataToSave);
      }

      $savedRecords->push($record);
    }

    return $savedRecords;
  }
}
