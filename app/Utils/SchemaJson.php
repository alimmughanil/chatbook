<?php

namespace App\Utils;

class SchemaJson
{
  public static function getSchema($id, $type)
  {
    if (str_starts_with(config('app.url'), 'http://localhost')) return null;
  
    $data = [];
  
    $schema = '<script type="application/ld+json">';
    $schema .= collect($data)->toJson();
    $schema .= '</script>';
    return $schema;
  }
}
