<?php

namespace App\Http\Controllers\User;

use Carbon\Carbon;
use App\Models\Blog;
use Inertia\Inertia;
use App\Models\BlogImage;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Controller;

class BlogController extends Controller
{
	public function index()
	{
		$categories = $this->blogCategories();
    $blogCount = Blog::where('status', PublishStatusType::Publish)->where('published_at', '<', now())->count();

		$data = [
			'title' => config('app.name') ." Blog",
			'categories' => $categories,
			'blogCount' => $blogCount,
		];

		return Inertia::render('User/Blog/Index', $data);
	}

	public function show(string $slug, Request $request)
	{
		$blog = Blog::with('user','category','blogImage')
      ->where('slug', $slug)
      ->when($request->mode != 'preview', function ($query) {
        return $query->where('status', PublishStatusType::Publish)->where('published_at', '<', now());
      })
      ->first();

		if (!$blog) return redirect('/blog')->with('error', 'Blog tidak ditemukan');
    if ($request->mode == 'preview' && \App\Utils\Helper::authorize($blog->user_id) != true) {
      return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk melihat artikel ini');
    }

		$blog->short_description ??= \App\Utils\Helper::htmlToString($blog->description, 160);
		// $blog->published_at = Carbon::createFromDate($blog->published_at)->diffForHumans();

		$relatedBlogs = Blog::with('user')->where('category_id', $blog->category_id)->where('status', PublishStatusType::Publish)->where('published_at', '<', now())->where('id', '!=', $blog->id)->orderByDesc('published_at')->take(5)->get();

		$image = $blog->thumbnail ?? $blog->banner_image;

		if (!$image && $blog->blogImage->count() > 0) {
			$image = $blog->blogImage->first()->value;
			$blog->thumbnail = $image;
		}

		if ($image) {
			$image = str($image)->startsWith('/storage') ? config('app.url') . $image : $image;
		}

		$keywords = $blog->keyword ?? '';

		$meta = [
			'title' => $blog->title,
			'description' => $blog->short_description,
			'image' => $image,
			'keywords' => $keywords,
		];

    $blogUrl = config('app.url') . "/blog/{$blog->slug}";

		$data = [
			'title' => $blog->title,
			'blog' => $blog,
			'relatedBlogs' => $relatedBlogs,
			'meta' => $meta,
			'blogUrl' => $blogUrl,
      'schema' => $this->getBlogSchema($blog, $meta),
		];

		return Inertia::render('User/Blog/Show', $data);
	}

	public function categoryIndex(string $slug, Request $request)
	{
		$category = BlogCategory::where('slug', $slug)->first();
		if (!$category) return redirect('/blog')->with('error', 'Kategori tidak ditemukan');
		$blogs = Blog::with('user')->where('category_id', $category?->id)->where('status', PublishStatusType::Publish)->where('published_at', '<', now())->orderByDesc('published_at')->paginate(20);
		$blogs = collect($blogs);

		$blogs['data'] = collect($blogs['data'])->map(function ($blog) {
			$blog['short_description'] = \App\Utils\Helper::htmlToString($blog['description'], 160);
			// $blog['published_at'] = Carbon::createFromDate($blog['published_at'])->diffForHumans();

			$image = $blog['thumbnail'] ?? $blog['banner_image'];

			if (!$image) {
				$blogImage = BlogImage::where('blog_id', $blog['id'])->where('type', 'slider')->first();
				if ($blogImage) {
					$image = $blogImage->value;
				}
				$blog['thumbnail'] = $image;
			}

			return $blog;
		});

		$meta = [
			'title' => $category->title,
			'description' => \App\Utils\Helper::htmlToString($category->description, 160),
			'image' => str($category->image)->startsWith('/storage') ? config('app.url') . $category->image : $category->image,
		];

		$data = [
			'title' => $category->title,
			'category' => $category,
			'blogs' => $blogs,
			'meta' => $meta,
      'schema' => $this->getCategorySchema($category, $meta['description']),
		];

		return Inertia::render('User/Blog/Category', $data);
	}

  public function blogCategories() {
    $categories = BlogCategory::with([
			'blog' => function ($query) {
				$query->with('user')->where('status', PublishStatusType::Publish)->where('published_at', '<', now())->orderByDesc('published_at')->take(5);
			}
		])->get();

		$categories = $categories->map(function ($category) {
			$category->blog = $category->blog->map(function ($blog) {
				$blog->short_description ??= \App\Utils\Helper::htmlToString($blog->description, 160);
				// $blog->published_at = Carbon::createFromDate($blog->published_at)->diffForHumans();

				$image = $blog->thumbnail ?? $blog->banner_image;

				if (!$image && $blog->blogImage->count() > 0) {
					$image = $blog->blogImage->first()->value;
					$blog->thumbnail = $image;
				}
				return $blog;
			});

			return $category;
		});

    return $categories;
  }

	public function getCategorySchema($category, $description) {
		$image = str($category->image)->startsWith('/storage') ? config('app.url') . $category->image : $category->image;

		$data = [
			"@context" => "https://schema.org/",
			"@type" => "CollectionPage",
			"@id" => config('app.url') . "/blog/category/{$category->slug}",
			"url" => config('app.url') . "/blog/category/{$category->slug}",
			"name" => $category->title,
			"description" => $description,
			"image" => $image,
			"inLanguage" => "id",
			"isPartOf" => [
				"@type" => "WebSite",
				"@id" => config('app.url'),
				"url" => config('app.url'),
				"name" => config('app.name'),
				"inLanguage" => "id",
			],
		];

    $schema = '<script type="application/ld+json">';
    $schema .= collect($data)->toJson();
    $schema .= '</script>';
    return $schema;
	}

	public function getBlogSchema($blog, $meta)  {
    $blogUrl = config('app.url') . "/blog/{$blog->slug}";
		$author = $blog->user?->name ?? '';
		$publishedAt = Carbon::createFromDate($blog->published_at);
		$thumbnail = $blog->thumbnail ?? $blog->banner_image;
		$thumbnail = str($thumbnail)->startsWith('/storage') ? config('app.url') . $thumbnail : $thumbnail;

		$blogCategory = $blog->category->title;

		$data = [
      "@context" => "https://schema.org/",
      "@type" => "NewsArticle",
			"@id" => $blogUrl,
			"headline" => $blog->title,
			"keywords" => $meta['keywords'],
			"datePublished" => $blog->published_at,
			"dateModified" => $blog->updated_at,
			"articleSection" => $blogCategory,
			"description" => $meta['description'],
			"copyrightYear" => $publishedAt->format('Y'),
			"name"=> $blog->title,
			"inLanguage" => "id",
			"author" => [
				"@type" => "Person",
				"name" => $author
			],
			"publisher" => [
				"@type" => "Organization",
				"name" => config('app.name'),
				"url" => config('app.url'),
				"logo" => [
					"@type" => "ImageObject",
					"url" => config('app.url') . "/images/logo.png",
					"width" => 60,
					"height" => 60
				]
			],
			"copyrightHolder" => [
				"@type" => "Organization",
				"name" => config('app.name'),
				"url" => config('app.url'),
				"logo" => [
					"@type" => "ImageObject",
					"url" => config('app.url') . "/images/logo.png",
					"width" => 60,
					"height" => 60
				],
				"mainEntityOfPage" => [
					"@type" => "WebPage",
					"@id" => $blogUrl,
					"url" => $blogUrl,
					"name" => $blog->title,
					"datePublished" => $blog->published_at,
					"dateModified" => $blog->updated_at,
					"isPartOf" => [
						"@type" => "WebSite",
						"@id" => config('app.url'),
						"url" => config('app.url'),
						"name" => config('app.name'),
						"inLanguage" => "id",
					],
				]
			],
    ];
    $schema = '<script type="application/ld+json">';
    $schema .= collect($data)->toJson();
    $schema .= '</script>';
    return $schema;

	}
}
