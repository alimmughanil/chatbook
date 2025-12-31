<?php

namespace App\Models\Traits;

use App\Models\Product;
use App\Models\User; // Pastikan import Model User
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Exception;

trait HasProduct
{
  public function scopeProduct($query, $columns = ['*'], $relations = [])
  {
    $currentTable = $this->getTable();

    $hierarchyPath = [
      'submission_answers' => ['parent' => 'questions', 'fk' => 'question_id'],
      'questions' => ['parent' => 'quizzes', 'fk' => 'quiz_id'],
      'quizzes' => ['parent' => 'lessons', 'fk' => 'lesson_id'],
      'lessons' => ['parent' => 'modules', 'fk' => 'module_id'],
      'modules' => ['parent' => 'products', 'fk' => 'product_id'],
    ];

    if ($currentTable !== 'products') {
      $stepsToJoin = [];
      $pointer = $currentTable;
      while ($pointer !== 'products' && isset($hierarchyPath[$pointer])) {
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

    $productColumns = [];
    if (empty($columns) || (isset($columns[0]) && $columns[0] === '*')) {
      $productColumns = Schema::getColumnListing('products');
    } else {
      if (!in_array('id', $columns))
        $columns[] = 'id';

      if (in_array('user', $relations) && !in_array('user_id', $columns))
        $columns[] = 'user_id';
      $productColumns = $columns;
    }

    foreach ($productColumns as $column) {
      $query->addSelect("products.$column as joined_product_$column");
    }

    $loadedRelations = [];

    if (in_array('user', $relations)) {
      $query->join('users as product_instructor', 'product_instructor.id', '=', 'products.user_id');

      $userColumns = Schema::getColumnListing('users');
      foreach ($userColumns as $uCol) {
        $query->addSelect("product_instructor.$uCol as joined_product_user_$uCol");
      }
      $loadedRelations[] = 'user';
    }


    $relationsStr = implode(',', $loadedRelations);
    $query->addSelect(DB::raw("'$relationsStr' as _product_loaded_relations"));
    $query->addSelect(DB::raw("'1' as _product_scope_loaded"));

    return $query;
  }

  public function getProductAttribute()
  {
    if (!array_key_exists('_product_scope_loaded', $this->attributes)) {
      throw new Exception("Error: Panggil ::product() terlebih dahulu.");
    }

    $productAttributes = [];
    $relationAttributes = [];

    foreach ($this->attributes as $key => $value) {
      if (str_starts_with($key, 'joined_product_')) {
        if (str_starts_with($key, 'joined_product_user_')) {
          $realKey = str_replace('joined_product_user_', '', $key);
          $relationAttributes['user'][$realKey] = $value;
        } else {
          $realKey = str_replace('joined_product_', '', $key);
          $productAttributes[$realKey] = $value;
        }
      }
    }

    if (empty($productAttributes))
      return null;

    $productModel = new Product();
    $productModel->setRawAttributes($productAttributes, true);

    $loadedRelationsStr = $this->attributes['_product_loaded_relations'] ?? '';
    $loadedRelations = array_filter(explode(',', $loadedRelationsStr));

    if (in_array('user', $loadedRelations) && !empty($relationAttributes['user'])) {
      $userModel = new User();
      $userModel->setRawAttributes($relationAttributes['user'], true);

      $productModel->setRelation('user', $userModel);
    }

    return $productModel;
  }
}