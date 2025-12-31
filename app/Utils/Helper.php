<?php

namespace App\Utils;

use App\Enums\UserType;
use BenSampo\Enum\Enum;
use App\Enums\LanguageType;
use Illuminate\Support\Str;
use App\Enums\CertificateType;
use App\Enums\PublishStatusType;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class Helper
{
  public static function getSearch($query, $searchBy, $searchQuery)
  {
    $tableName = $query->getModel()->getTable();

    $searchQuery = trim($searchQuery);
    $searchQuery = urldecode($searchQuery);

    $searchBy = trim($searchBy);
    $searchBy = urldecode($searchBy);
    $searchs = explode('|', $searchBy);

    if (count($searchs) > 1)
      return self::multipleSearch($query, $searchs, $searchQuery);

    $searchBy = explode('.', $searchBy);
    $column = end($searchBy);

    if (count($searchBy) > 1) {
      array_pop($searchBy);
      $searchBy = implode('.', $searchBy);

      return $query->whereRelation($searchBy, $column, 'LIKE', "%$searchQuery%");
    } else {
      return $query->where("$tableName.$column", 'LIKE', "%$searchQuery%");
    }
  }

  public static function multipleSearch($query, $searchables, $searchQuery)
  {
    $tableName = $query->getModel()->getTable();
    return $query->where(function ($q) use ($searchables, $searchQuery, $tableName) {
      $searchTerm = "%{$searchQuery}%";

      foreach ($searchables as $field) {
        if (str_contains($field, '.')) {
          $searchBy = explode('.', $field);
          $column = end($searchBy);

          array_pop($searchBy);
          $searchBy = implode('.', $searchBy);

          $q->orWhereHas($searchBy, function ($relationQuery) use ($column, $searchTerm) {
            $relationQuery->where($column, 'LIKE', $searchTerm);
          });
        } else {
          $q->orWhere("$tableName.$field", 'LIKE', $searchTerm);
        }
      }
    });
  }

  public static function getSearchDate($query, $searchBy, $request)
  {
    $tableName = $query->getModel()->getTable();
    $startDate = $request->input('startDate', now()->toDateString());
    $endDate = $request->input('endDate', now()->toDateString());

    $searchBy = explode('.', $searchBy);
    $column = end($searchBy);

    if (count($searchBy) > 1) {
      array_pop($searchBy);
      $searchBy = implode('.', $searchBy);

      return $query->whereRelation($searchBy, $column, '>=', $startDate)->whereRelation($searchBy, $column, '<=', $endDate);
    } else {
      return $query->where("$tableName.$column", '>=', $startDate)->where("$tableName.$column", '<=', $endDate);
    }
  }
  public static function getSort($query, $sortBy, $sortDirection = 'asc')
  {
    $sortByParts = explode('.', $sortBy);
    if (count($sortByParts) > 1) {
      // --- Pengurutan via Relasi ---
      $column = array_pop($sortByParts);
      $relationName = implode('.', $sortByParts);

      if (str_contains($sortBy, '.')) {
        try {
          $subquery = self::buildNestedRelationSubquery($query, $sortBy);
          return $query->orderBy($subquery, $sortDirection);
        } catch (\Exception $e) {
          return $query;
        }
      }

      // Mengambil instance dari relasi untuk mendapatkan informasi tabel dan key
      $relation = $query->getRelation($relationName);

      // Membuat subquery untuk mengambil nilai dari kolom relasi
      $subquery = $relation->getRelated()->newQuery()
        ->select($column)
        ->whereColumn(
          $relation->getQualifiedOwnerKeyName(), // e.g., 'categories.id'
          $relation->getQualifiedForeignKeyName() // e.g., 'posts.category_id'
        )->limit(1);

      return $query->orderBy($subquery, $sortDirection);
    } else {
      // --- Pengurutan Langsung ---
      return $query->orderBy($sortBy, $sortDirection);
    }
  }
  private static function buildNestedRelationSubquery($mainQuery, $relationPath)
  {
    $relations = explode('.', $relationPath);
    $columnToSelect = array_pop($relations);

    $currentModel = $mainQuery->getModel();
    $subquery = null;
    $firstPass = true;

    foreach ($relations as $relationName) {
      $relation = $currentModel->{$relationName}();
      $relatedModel = $relation->getRelated();
      $relatedTable = $relatedModel->getTable();

      if ($relation instanceof \Illuminate\Database\Eloquent\Relations\BelongsTo) {
        $parentKey = $relation->getQualifiedOwnerKeyName(); // e.g., 'parent_table.id'
        $relatedKey = $relation->getQualifiedForeignKeyName(); // e.g., 'current_table.parent_id'
      } else { // Handles HasOne, HasMany, etc.
        $parentKey = $relation->getQualifiedParentKeyName(); // e.g., 'parent_table.id'
        $relatedKey = $relation->getQualifiedForeignKeyName(); // e.g., 'related_table.parent_id'
      }

      if ($firstPass) {
        $subquery = $relatedModel->newQuery();
        // Menghubungkan subquery ke query utama
        $subquery->whereColumn(
          // Untuk relasi pertama, kuncinya dibalik untuk whereColumn
          $relation instanceof \Illuminate\Database\Eloquent\Relations\BelongsTo ? $relatedKey : $parentKey,
          $relation instanceof \Illuminate\Database\Eloquent\Relations\BelongsTo ? $parentKey : $relatedKey
        );
        $firstPass = false;
      } else {
        // Untuk relasi berikutnya, kita lakukan JOIN di dalam subquery
        $subquery->join($relatedTable, $parentKey, '=', $relatedKey);
      }

      $currentModel = $relatedModel;
    }

    if (is_null($subquery)) {
      throw new \Exception("Relasi tidak valid: " . $relationPath);
    }

    // Pilih kolom terakhir dan batasi hasilnya
    return $subquery->select($currentModel->getTable() . '.' . $columnToSelect)->limit(1);
  }

  public static function getRefurl($request)
  {
    $locationUrl = $request?->ref_url;
    if (!$locationUrl) {
      return null;
    }

    $queryString = parse_url($locationUrl, PHP_URL_QUERY);
    if (!$queryString) {
      return null;
    }
    parse_str($queryString, $queryParams);

    return $queryParams['ref'] ?? null;
  }

  public static function getFormFields($validation)
  {
    $default = collect($validation["default"]);
    $fields = collect(array_keys($validation["validation"]));

    $fields = $fields->map(function ($field) use ($default) {
      $data = [
        "name" => $field,
        "defaultValue" => null,
      ];
      if (!$default->has($field))
        return $data;

      $data["defaultValue"] = $default->get($field);
      return $data;
    })->toArray();

    return $fields;
  }

  public static function whatsappNumber($phone)
  {
    $phone = str($phone);
    if ($phone->startsWith('+')) {
      $phone = $phone->substr(1);
    }
    if ($phone->startsWith('0')) {
      $phone = $phone->replaceFirst('0', '62');
    }
    return $phone;
  }

  public static function currency($number, $code = 'Rp ')
  {
    return $code . number_format($number, 0, ',', '.');
  }

  public static function authorize($userId = null)
  {
    if (!auth()->check())
      return false;
    if (auth()->user()->role == UserType::Admin)
      return true;
    if (isset($userId) && $userId == auth()->id())
      return true;
    return false;
  }

  public static function htmlToString($html, $length = null)
  {
    if (is_null($html)) {
      return '';
    }

    $string = strip_tags($html);

    $string = html_entity_decode($string, ENT_QUOTES, 'UTF-8');
    $string = str_replace("\u{200B}", "", $string);
    $string = trim(preg_replace('/\s+/', ' ', $string));

    if ($length && mb_strlen($string) > $length) {
      $string = mb_substr($string, 0, $length, 'UTF-8');
      $string .= '...';
    }

    return $string;
  }

  public static function filterCharset($lists)
  {
    return array_map(function ($list) {
      return array_map('utf8_encode', (array) $list);
    }, $lists);
  }

  public static function getYearActive($request = null)
  {
    $request = $request ?? request();

    $year = $request->cookie('year');

    if (empty($year)) {
      return now()->year;
    }

    $validator = Validator::make(['year' => $year], [
      'year' => 'integer|digits:4'
    ]);

    if ($validator->fails()) {
      return now()->year;
    }

    return (int) $year;
  }

  public static function getLangActive($request = null)
  {
    $request = $request ?? request();

    $lang = $request->cookie('language');

    if ($request->filled('lang') && in_array($request->get('lang'), LanguageType::getValues())) {
      $lang = $request->get('lang');
    }

    if (empty($lang)) {
      return LanguageType::Id;
    }

    $validator = Validator::make(['lang' => $lang], [
      'lang' => 'string|in:id,en'
    ]);

    if ($validator->fails()) {
      return LanguageType::Id;
    }
    // $lang = substr($lang, 5);

    return $lang;
  }
  public static function getEnumTranslation(string $enumClass, string $lang)
  {
    if (!class_exists($enumClass) || !is_subclass_of($enumClass, Enum::class)) {
      return [];
    }
    $values = $enumClass::getValues();

    return collect($values)
      ->mapWithKeys(function ($value) use ($lang, $enumClass) {
        $key = "enums.$enumClass.$value";
        return [$value => Lang::get($key, [], $lang)];
      })
      ->toArray();
  }

  public static function slugify($text)
  {
    $text = str_replace(' ', '-', strtolower($text));
    $text = preg_replace('/[^A-Za-z0-9-]/', '', $text);

    return $text;
  }

  public static function redirectBack($session = '', $message = '')
  {
    $redirectTarget = redirect()->back()->getTargetUrl();

    if ($redirectTarget === url()->current()) {
      return redirect('/app/dashboard')->with($session, $message);
    }

    return redirect()->back()->with($session, $message);
  }

  public static function publishStatus()
  {
    $publishStatus = ['status' => PublishStatusType::Publish];
    return $publishStatus;
  }
  public static function langStatus()
  {
    $lang = self::getLangActive(request());
    $langStatus = ['lang' => $lang];
    return $langStatus;
  }

  public static function savePageCache($page, $column, $data)
  {
    $key = "{$page['name']}.{$data[$column]}";
    return self::saveCache($key, $data);
  }

  public static function saveCache($key, $data)
  {
    \Cache::forget($key);
    return \Cache::rememberForever($key, function () use ($data) {
      return $data;
    });
  }

  public static function getCache($key)
  {
    $cache = \Cache::get($key);
    if ($cache)
      return $cache;
    return null;
  }
  public static function safeFileName(string $originalName, int $maxLength = 50, ?array $allowedExtensions = null): string
  {
    if ($allowedExtensions === null) {
      $allowedExtensions = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'svg',
        'webp',
        'avif',
        'pdf',
        'txt',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'csv',
        'ppt',
        'pptx',
        'mp4',
        'mp3',
        'wav',
        'ogg',
        'webm',
        'zip',
        'rar',
        '7z'
      ];
    }

    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $nameWithoutExt = pathinfo($originalName, PATHINFO_FILENAME);
    
    if (!in_array($extension, $allowedExtensions)) {
      throw new \Exception("File type not allowed: $extension");
    }

    $safeName = preg_replace('/[^A-Za-z0-9_-]/', '-', $nameWithoutExt);
    $safeName = preg_replace('/-+/', '-', $safeName);

    $safeName = Str::limit($safeName, $maxLength, '');
    if ($extension) {
      $safeName .= ".$extension";
    }

    return $safeName;
  }

  public static function extractParticipantFormatNumber(string $code = "0001", string $pattern = "{NNNN}/IX/03/2025")
  {
    // Detect placeholders {NNN}
    preg_match_all('/\{N+\}/', $pattern, $tokens);
    $regex = preg_quote($pattern, '/');
    foreach ($tokens[0] as $token) {
      $count = substr_count($token, 'N');
      $escapedToken = preg_quote($token, '/');

      $regex = str_replace($escapedToken, "([0-9]{{$count}})", $regex);
    }

    $regex = '/^' . $regex . '$/u';

    $result = [
      'number' => null,
      'placeholder' => $tokens[0][0],
      'digits' => substr_count($tokens[0][0], 'N'),
    ];

    if (preg_match($regex, $code, $matches)) {
      $result['number'] = $matches[1];
    }

    return (object) $result;
  }

  public static function getCertificateLabelType($value)
  {
    return strtolower(CertificateType::getKey($value));
  }

  public static function timeToSeconds(string $timeString): int
  {
    // 1. Split string berdasarkan ":"
    $parts = explode(':', $timeString);

    $totalSeconds = 0;

    if (count($parts) === 2) {
      // Format diasumsikan: MM:SS (Menit:Detik)
      $minutes = (int) $parts[0];
      $seconds = (int) $parts[1];

      $totalSeconds = ($minutes * 60) + $seconds;

    } elseif (count($parts) === 3) {
      // Format diasumsikan: HH:MM:SS (Jam:Menit:Detik)
      $hours = (int) $parts[0];
      $minutes = (int) $parts[1];
      $seconds = (int) $parts[2];

      $totalSeconds = ($hours * 3600) + ($minutes * 60) + $seconds;
    }

    return $totalSeconds;
  }
}
