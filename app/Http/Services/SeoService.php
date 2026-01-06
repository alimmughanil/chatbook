<?php

namespace App\Http\Services;

use App\Models\Seo;
use App\Utils\Helper;

class SeoService
{
  public static function get($key, $defaultMeta = [])
  {
    $seo = Seo::where(['type' => $key])->first();
    if (!$seo) {
      $seo = Seo::where(['type' => $key])->first();
    }
    if (!$seo) return [];

    $meta = self::getMeta($seo, $defaultMeta);
    
    return [
      "title" => $meta['title'],
      "meta" => $meta,
      "schema" => SchemaService::getSchema($meta)
    ];
  }

  public static function getMeta($seo, $defaultMeta)
  {
    $type = $seo->type == 'default' ? 'Organization' : 'Article';
    $datePublished = $seo->created_at->format('Y-m-d');
    $dateModified = $seo->updated_at->format('Y-m-d');

    if(!empty($defaultMeta['type'])) {
      $type = $defaultMeta['type'];
    }
    if(!empty($defaultMeta['datePublished'])) {
      $datePublished = $defaultMeta['datePublished'];
    }
    if(!empty($defaultMeta['dateModified'])) {
      $dateModified = $defaultMeta['dateModified'];
    }

    return [
      ...$defaultMeta,
      'title' => !empty($defaultMeta['title']) ? $defaultMeta['title'] : $seo->title,
      'keywords' => !empty($defaultMeta['keywords']) ? $defaultMeta['keywords'] : $seo->seo_keyword,
      'description' => !empty($defaultMeta['description']) ? $defaultMeta['description'] : $seo->seo_description,
      'type' => $type,
      'datePublished' => $datePublished,
      'dateModified' => $dateModified,
    ];
  }
}
