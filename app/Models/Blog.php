<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\User;
use App\Models\BlogImage;
use App\Models\BlogCategory;
use Spatie\Sitemap\Tags\Url;
use App\Models\Traits\Published;
use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sitemap\Contracts\Sitemapable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Blog extends Model implements Sitemapable
{
  use HasFactory, Filterable, Published;
  protected $guarded = ['id'];

  public function user()
  {
    return $this->belongsTo(User::class, 'user_id', 'id')->withTrashed();
  }
  public function category()
  {
    return $this->belongsTo(BlogCategory::class, 'category_id', 'id')->withTrashed();
  }
  public function blogImage()
  {
    return $this->hasMany(BlogImage::class, 'blog_id', 'id');
  }

  public function toSitemapTag(): Url | string | array
  {
    return Url::create(route('app.blog.show', $this->slug))
      ->setLastModificationDate(Carbon::create($this->updated_at))
      ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
      ->setPriority(0.8);
  }
}
