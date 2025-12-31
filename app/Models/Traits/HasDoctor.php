<?php

namespace App\Models\Traits;

use App\Models\Doctor;
use App\Models\User; // Pastikan import Model User
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Exception;

trait HasDoctor
{
  public function scopeDoctor($query, $columns = ['*'], $relations = [])
  {
    $currentTable = $this->getTable();

    $hierarchyPath = [
      'submission_answers' => ['parent' => 'questions', 'fk' => 'question_id'],
      'questions' => ['parent' => 'quizzes', 'fk' => 'quiz_id'],
      'quizzes' => ['parent' => 'lessons', 'fk' => 'lesson_id'],
      'lessons' => ['parent' => 'modules', 'fk' => 'module_id'],
      'modules' => ['parent' => 'doctors', 'fk' => 'doctor_id'],
    ];

    if ($currentTable !== 'doctors') {
      $stepsToJoin = [];
      $pointer = $currentTable;
      while ($pointer !== 'doctors' && isset($hierarchyPath[$pointer])) {
        $step = $hierarchyPath[$pointer];
        $stepsToJoin[] = ['parent' => $step['parent'], 'child' => $pointer, 'fk' => $step['fk']];
        $pointer = $step['parent'];
      }
      foreach ($stepsToJoin as $step) {
        $query->join($step['parent'], $step['parent'] . '.id', '=', $step['child'] . '.' . $step['fk']);
      }
    }

    if (empty($query->getQuery()->columns)) {
      $query->select($currentTable . '.*');
    }

    $doctorColumns = [];
    if (empty($columns) || (isset($columns[0]) && $columns[0] === '*')) {
      $doctorColumns = Schema::getColumnListing('doctors');
    } else {
      if (!in_array('id', $columns))
        $columns[] = 'id';

      if (in_array('user', $relations) && !in_array('user_id', $columns))
        $columns[] = 'user_id';
      $doctorColumns = $columns;
    }

    foreach ($doctorColumns as $column) {
      $query->addSelect("doctors.$column as joined_doctor_$column");
    }

    $loadedRelations = [];

    if (in_array('user', $relations)) {
      $query->join('users as doctor_instructor', 'doctor_instructor.id', '=', 'doctors.user_id');

      $userColumns = Schema::getColumnListing('users');
      foreach ($userColumns as $uCol) {
        $query->addSelect("doctor_instructor.$uCol as joined_doctor_user_$uCol");
      }
      $loadedRelations[] = 'user';
    }


    $relationsStr = implode(',', $loadedRelations);
    $query->addSelect(DB::raw("'$relationsStr' as _doctor_loaded_relations"));
    $query->addSelect(DB::raw("'1' as _doctor_scope_loaded"));

    return $query;
  }

  public function getDoctorAttribute()
  {
    if (!array_key_exists('_doctor_scope_loaded', $this->attributes)) {
      throw new Exception("Error: Panggil ::doctor() terlebih dahulu.");
    }

    $doctorAttributes = [];
    $relationAttributes = [];

    foreach ($this->attributes as $key => $value) {
      if (str_starts_with($key, 'joined_doctor_')) {
        if (str_starts_with($key, 'joined_doctor_user_')) {
          $realKey = str_replace('joined_doctor_user_', '', $key);
          $relationAttributes['user'][$realKey] = $value;
        } else {
          $realKey = str_replace('joined_doctor_', '', $key);
          $doctorAttributes[$realKey] = $value;
        }
      }
    }

    if (empty($doctorAttributes))
      return null;

    $doctorModel = new Doctor();
    $doctorModel->setRawAttributes($doctorAttributes, true);

    $loadedRelationsStr = $this->attributes['_doctor_loaded_relations'] ?? '';
    $loadedRelations = array_filter(explode(',', $loadedRelationsStr));

    if (in_array('user', $loadedRelations) && !empty($relationAttributes['user'])) {
      $userModel = new User();
      $userModel->setRawAttributes($relationAttributes['user'], true);

      $doctorModel->setRelation('user', $userModel);
    }

    return $doctorModel;
  }
}