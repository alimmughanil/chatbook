<?php

namespace App\Http\Services;

use Error;
use App\Models\Seo;
use App\Utils\Helper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class TranslationService
{
  public static function get($key)
  {
    $lang = Helper::getLangActive(request());
    $translation = self::getData($lang);

    if (empty($translation)) return config('app.name');
    if (empty($translation[$key])) {
      $translation = self::getJson($lang);
    };

    if (empty($translation[$key])) return config('app.name');
    return $translation[$key];
  }
  public static function getMeta($key)
  {
    $seo = Seo::where(['type' => $key, ...Helper::langStatus()])->first();
    if (!$seo) {
      $seo = Seo::where(['type' => $key, ...Helper::langStatus()])->first();
    }
    if (!$seo) return [];

    return [
      'title' => $seo->title,
      'keywords' => $seo->seo_keyword,
      'description' => $seo->seo_description,
    ];
  }

  public static function getData($lang = null)
  {
    if (!$lang) {
      $lang = Helper::getLangActive(request());
    }

    $translation = null;
    try {
      $translation = DB::table('translations')->where('lang', $lang)->first();
      if (!$translation) {
        throw new Error('Data Not Found', 404);
      }

      $translation = json_decode($translation->content, true);
    } catch (\Throwable $th) {
      $translation = self::getJson($lang);
    }

    return $translation;
  }

  public static function getJson($lang)
  {
    $defaultLang = 'id';
    $translationPath = resource_path("js/locales/$lang/translations.json");
    if (!File::exists($translationPath)) {
      $translationPath = resource_path("js/locales/$defaultLang/translations.json");
    }

    $translation = File::get($translationPath);
    $translation = json_decode($translation, true);
    return $translation;
  }
}
