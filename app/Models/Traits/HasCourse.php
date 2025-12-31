<?php

namespace App\Models\Traits;

use App\Models\Course;
use App\Models\User; // Pastikan import Model User
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Exception;

trait HasCourse
{
  public function scopeCourse($query, $columns = ['*'], $relations = [])
  {
    $currentTable = $this->getTable();

    $hierarchyPath = [
      'submission_answers' => ['parent' => 'questions', 'fk' => 'question_id'],
      'questions' => ['parent' => 'quizzes', 'fk' => 'quiz_id'],
      'quizzes' => ['parent' => 'lessons', 'fk' => 'lesson_id'],
      'lessons' => ['parent' => 'modules', 'fk' => 'module_id'],
      'modules' => ['parent' => 'courses', 'fk' => 'course_id'],
    ];

    if ($currentTable !== 'courses') {
      $stepsToJoin = [];
      $pointer = $currentTable;
      while ($pointer !== 'courses' && isset($hierarchyPath[$pointer])) {
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

    $courseColumns = [];
    if (empty($columns) || (isset($columns[0]) && $columns[0] === '*')) {
      $courseColumns = Schema::getColumnListing('courses');
    } else {
      if (!in_array('id', $columns))
        $columns[] = 'id';

      if (in_array('user', $relations) && !in_array('user_id', $columns))
        $columns[] = 'user_id';
      $courseColumns = $columns;
    }

    foreach ($courseColumns as $column) {
      $query->addSelect("courses.$column as joined_course_$column");
    }

    $loadedRelations = [];

    if (in_array('user', $relations)) {
      $query->join('users as course_instructor', 'course_instructor.id', '=', 'courses.user_id');

      $userColumns = Schema::getColumnListing('users');
      foreach ($userColumns as $uCol) {
        $query->addSelect("course_instructor.$uCol as joined_course_user_$uCol");
      }
      $loadedRelations[] = 'user';
    }


    $relationsStr = implode(',', $loadedRelations);
    $query->addSelect(DB::raw("'$relationsStr' as _course_loaded_relations"));
    $query->addSelect(DB::raw("'1' as _course_scope_loaded"));

    return $query;
  }

  public function getCourseAttribute()
  {
    if (!array_key_exists('_course_scope_loaded', $this->attributes)) {
      throw new Exception("Error: Panggil ::course() terlebih dahulu.");
    }

    $courseAttributes = [];
    $relationAttributes = [];

    foreach ($this->attributes as $key => $value) {
      if (str_starts_with($key, 'joined_course_')) {
        if (str_starts_with($key, 'joined_course_user_')) {
          $realKey = str_replace('joined_course_user_', '', $key);
          $relationAttributes['user'][$realKey] = $value;
        } else {
          $realKey = str_replace('joined_course_', '', $key);
          $courseAttributes[$realKey] = $value;
        }
      }
    }

    if (empty($courseAttributes))
      return null;

    $courseModel = new Course();
    $courseModel->setRawAttributes($courseAttributes, true);

    $loadedRelationsStr = $this->attributes['_course_loaded_relations'] ?? '';
    $loadedRelations = array_filter(explode(',', $loadedRelationsStr));

    if (in_array('user', $loadedRelations) && !empty($relationAttributes['user'])) {
      $userModel = new User();
      $userModel->setRawAttributes($relationAttributes['user'], true);

      $courseModel->setRelation('user', $userModel);
    }

    return $courseModel;
  }
}