<?php

namespace App\Http\Services;

use Carbon\Carbon;
use App\Utils\Helper;
use App\Enums\ProfileType;

class SchemaService
{
  public static function getSchema($metaData)
  {
    $appUrl = rtrim(config('app.url'), '/');
    $currentUrl = url()->current();
    $imageUrl = $appUrl . '/image/icon.png';
    $logoUrl = $appUrl . '/image/icon.png';

    $companyName = 'PT. Gayamakmur Techno Nusantara';
    $companyNameProfile = Helper::getCache('profile.' . ProfileType::CompanyName);
    if (!empty($companyNameProfile)) {
      $companyName = $companyNameProfile->content ?? $companyName;
    }
    $type = $metaData['type'] ?? 'Organization';

    $data = [
      "@context" => "https://schema.org",
      "@type" => $type,
    ];

    if ($type === 'Organization') {
      $data += [
        "name" => $companyName,
        "url" => $appUrl,
        "logo" => [
          "@type" => "ImageObject",
          "url" => $logoUrl,
        ],
        "description" => $metaData['description'] ?? null,
        "keywords" => $metaData['keywords'] ?? null,
      ];
    }

    if ($type === 'Product') {
      $data += [
        "name" => $metaData['title'] ?? $companyName,
        "description" => $metaData['description'] ?? null,
        "keywords" => $metaData['keywords'] ?? null,
        "image" => [
          $metaData['image'] ?? $imageUrl,
        ],
        "brand" => [
          "@type" => "Brand",
          "name" => $metaData['brand'] ?? $companyName,
        ],
        "offers" => [
          "@type" => "Offer",
          "url" => $metaData['url'] ?? $currentUrl,
          "itemCondition" => "https://schema.org/NewCondition",
          "availability" => "https://schema.org/InStock",
          "priceCurrency"=> "IDR",
          "seller" => [
            "@type" => "Organization",
            "name" => $companyName,
            "url" => $appUrl,
            "logo" => [
              "@type" => "ImageObject",
              "url" => $logoUrl,
            ],
          ],
        ],
      ];

      if (!empty($metaData['ratingValue']) && !empty($metaData['reviewCount'])) {
        $data['aggregateRating'] = [
          "@type" => "AggregateRating",
          "ratingValue" => $metaData['ratingValue'],
          "reviewCount" => $metaData['reviewCount'],
        ];
      }
    }


    if (in_array($type, ['Article', 'NewsArticle', 'BlogPosting'])) {
      $data += [
        "mainEntityOfPage" => [
          "@type" => "WebPage",
          "@id" => $currentUrl,
        ],
        "headline" => $metaData['title'] ?? config('app.name'),
        "description" => $metaData['description'] ?? null,
        "keywords" => $metaData['keywords'] ?? null,
        "image" => [
          "@type" => "ImageObject",
          "url" => $imageUrl,
        ],
        "author" => [
          "@type" => "Organization",
          "name" => $companyName,
          "url" => $appUrl,
        ],
        "publisher" => [
          "@type" => "Organization",
          "name" => $companyName,
          "logo" => [
            "@type" => "ImageObject",
            "url" => $logoUrl,
          ],
        ],
        "datePublished" => $metaData['datePublished'] ?? null,
        "dateModified" => $metaData['dateModified'] ?? null,
      ];
    }

    $filteredData = collect($data)->filter(function ($value) {
      if (is_array($value)) {
        return count(array_filter($value)) > 0;
      }
      return !is_null($value);
    });

    $schema = '<script type="application/ld+json">';
    $schema .= $filteredData->toJson(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    $schema .= '</script>';

    return $schema;
  }
}
