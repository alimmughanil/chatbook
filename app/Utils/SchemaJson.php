<?php

namespace App\Utils;

use App\Models\Course;
use App\Models\Category;

class SchemaJson
{
  public static function getSchema($id, $type)
  {
    if (str_starts_with(config('app.url'), 'http://localhost')) return null;
  
    $data = [];

    if ($type == 'course') {
      $course = Course::where('id', $id)->first();

      $data = [
        "@context" => "https://schema.org/",
        "@type" => "Product",
        "@id" => config('app.url'),
        "name" => $course->title,
        "description" => strip_tags($course->description),
        "image" => config('app.url') . "{$course->thumbnail}",
        "url" => config('app.url') . "/course/{$course->slug}",
        "offers" => [
          "@type" => "AggregateOffer",
          "availability" => "https://schema.org/InStock",
          "price" => $course->price,
          "priceCurrency" => "IDR",
        ],
      ];
    }

    if ($type == 'category') {
      $category = Category::where('id', $id)->first();

      $data = [
        "@context" => "https://schema.org/",
        "@type" => "Product",
        "@id" => config('app.url'),
        "name" => $category->title,
        "description" => strip_tags($category->description),
        "url" => config('app.url') . "/app/category/{$category->slug}",
      ];
    }
  
    $schema = '<script type="application/ld+json">';
    $schema .= collect($data)->toJson();
    $schema .= '</script>';
    return $schema;
  }
}
