<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Blog;
use Spatie\Sitemap\Tags\Url;
use App\Models\Traits\Published;
use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sitemap\Contracts\Sitemapable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BlogCategory extends Model implements Sitemapable
{
  use HasFactory, SoftDeletes, Filterable, Published;
  protected $guarded = ['id'];

  public function blog()
  {
    return $this->hasMany(Blog::class, 'category_id', 'id');
  }
  public function toSitemapTag(): Url | string | array
  {
    return Url::create(route('app.blog.category.show', $this->slug))
      ->setLastModificationDate(Carbon::create($this->updated_at))
      ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
      ->setPriority(0.8);
  }
}
