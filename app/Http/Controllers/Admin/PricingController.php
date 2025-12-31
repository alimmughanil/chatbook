<?php

namespace App\Http\Controllers\Admin;

use App\Models\Tag;
use App\Models\Pricing;
use App\Enums\PricingType;
use App\Models\PricingTag;
use Illuminate\Http\Request;
use App\Enums\PricingUnitType;
use App\Enums\OriginStatusType;
use App\Enums\PricingAppliedType;
use App\Http\Controllers\Core\BaseResourceController;
use App\Utils\Helper;

class PricingController extends BaseResourceController
{
  protected $model = Pricing::class;

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "pricing",
      "inertia" => "Admin/Pricing",
      "label" => "Pricing",
      "url" => "/admin/pricing",
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function indexQuery($query, Request $request)
  {
    return $query->with('tags');
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        'name' => 'required',
        'type' => 'required',
        'unit' => 'required',
        'value' => 'required',
        'applied_to' => 'required',
        'status' => 'required',
        'tags' => 'nullable|array',
      ],
      "default" => [
        'type' => PricingType::Addition,
        'unit' => PricingUnitType::Percentage,
        'applied_to' => PricingAppliedType::Platform,
        'status' => OriginStatusType::Active,
      ]
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $tags = Tag::get()->map(fn($tag) => ([
      'value' => $tag->id,
      'label' => $tag->title,
    ]))->toArray();

    $pricingTags = [];
    if ($model) {
      $pricingTags = PricingTag::where('pricing_id', $model->id)->with('tag')->get();
      if (!empty($pricingTags)) {
        $pricingTags = $pricingTags->map(fn($pricingTag) => ([
          'id' => $pricingTag->id,
          'value' => $pricingTag->tag->id,
          'label' => $pricingTag->tag->title,
        ]))->toArray();
      }
    }

    if ($this->modelInstance && !empty($pricingTags)) {
      $this->modelInstance->tags = $pricingTags;
    }

    return [
      ...parent::getFormData($request, $model),
      'typeOptions' => PricingType::getValues(),
      'unitOptions' => PricingUnitType::getValues(),
      'appliedToOptions' => PricingAppliedType::getValues(),
      'statusOptions' => OriginStatusType::getValues(),
      'tags' => $tags,
      'pricingTags' => $pricingTags
    ];
  }

  protected function afterSave($model, Request $request)
  {
    $tags = $request->tags;
    if (empty($tags)) {
      $model->pricingTag()->delete();
    } else {
      $model->pricingTag()->delete();
      $tags = collect($tags)->map(function ($tag) use ($model) {
        return [
          'pricing_id' => $model->id,
          'tag_id' => $tag['value'],
          'created_at' => now(),
          'updated_at' => now(),
        ];
      })->toArray();

      PricingTag::insert($tags);
    }
  }
}
