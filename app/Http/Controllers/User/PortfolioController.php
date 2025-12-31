<?php

namespace App\Http\Controllers\User;

use Carbon\Carbon;
use App\Models\PortfolioProject;
use Inertia\Inertia;
use App\Models\PortfolioImage;
use App\Models\PortfolioCategory;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Controller;

class PortfolioController extends Controller
{
	public function index()
	{
		$categories = $this->portfolioCategories();
    $portfolioCount = PortfolioProject::where('status', PublishStatusType::Publish)->count();

		$data = [
			'title' => config('app.name') ." Portofolio",
			'categories' => $categories,
			'portfolioCount' => $portfolioCount,
		];

		return Inertia::render('User/Portfolio/Index', $data);
	}

	public function show(string $slug, Request $request)
	{
		$portfolio = PortfolioProject::with('user','category','portfolioImage')
      ->where('slug', $slug)
      ->when($request->mode != 'preview', function ($query) {
        return $query->where('status', PublishStatusType::Publish);
      })
      ->first();

		if (!$portfolio) return redirect('/portfolio')->with('error', 'Portfolio tidak ditemukan');
    if ($request->mode == 'preview' && \App\Utils\Helper::authorize($portfolio->user_id) != true) {
      return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk melihat portofolio ini');
    }

		$portfolio->short_description ??= \App\Utils\Helper::htmlToString($portfolio->description, 160);
		// $portfolio->published_at = Carbon::createFromDate($portfolio->published_at)->diffForHumans();

		$relatedPortfolios = PortfolioProject::with('user')->where('category_id', $portfolio->category_id)->where('status', PublishStatusType::Publish)->where('id', '!=', $portfolio->id)->orderByDesc('published_at')->take(5)->get();

		$image = $portfolio->thumbnail ?? $portfolio->banner_image;

		if (!$image && $portfolio->portfolioImage->count() > 0) {
			$image = $portfolio->portfolioImage->first()->value;
			$portfolio->thumbnail = $image;
		}

		if ($image) {
			$image = str($image)->startsWith('/storage') ? config('app.url') . $image : $image;
		}

		$keywords = $portfolio->keyword ?? '';

		$meta = [
			'title' => $portfolio->title,
			'description' => $portfolio->short_description,
			'image' => $image,
			'keywords' => $keywords,
		];

    $portfolioUrl = config('app.url') . "/portfolio/{$portfolio->slug}";
		$data = [
			'title' => $portfolio->title,
			'portfolio' => $portfolio,
			'relatedPortfolios' => $relatedPortfolios,
			'meta' => $meta,
			'portfolioUrl' => $portfolioUrl,
      'schema' => $this->getPortfolioSchema($portfolio, $meta),
		];

		return Inertia::render('User/Portfolio/Show', $data);
	}

	public function categoryIndex(string $slug, Request $request)
	{
		$category = PortfolioCategory::where('slug', $slug)->first();
		if (!$category) return redirect('/portfolio')->with('error', 'Kategori tidak ditemukan');
		$portfolios = PortfolioProject::with('user')->where('category_id', $category?->id)->where('status', PublishStatusType::Publish)->orderByDesc('published_at')->paginate(20);
		$portfolios = collect($portfolios);

		$portfolios['data'] = collect($portfolios['data'])->map(function ($portfolio) {
			$portfolio['short_description'] = \App\Utils\Helper::htmlToString($portfolio['description'], 160);
			// $portfolio['published_at'] = Carbon::createFromDate($portfolio['published_at'])->diffForHumans();

			$image = $portfolio['thumbnail'];

			if (!$image) {
				$portfolioImage = PortfolioImage::where('portfolio_project_id', $portfolio['id'])->where('type', 'slider')->first();
				if ($portfolioImage) {
					$image = $portfolioImage->value;
				}
				$portfolio['thumbnail'] = $image;
			}

			return $portfolio;
		});

		$meta = [
			'title' => $category->title,
			'description' => \App\Utils\Helper::htmlToString($category->description, 160),
			'image' => str($category->image)->startsWith('/storage') ? config('app.url') . $category->image : $category->image,
		];

		$data = [
			'title' => $category->title,
			'category' => $category,
			'portfolios' => $portfolios,
			'meta' => $meta,
      'schema' => $this->getCategorySchema($category, $meta['description']),
		];

		return Inertia::render('User/Portfolio/Category', $data);
	}

  public function portfolioCategories() {
    $categories = PortfolioCategory::with([
			'portfolio' => function ($query) {
				$query->with('user')->where('status', PublishStatusType::Publish)->orderByDesc('published_at')->take(5);
			}
		])->get();

		$categories = $categories->map(function ($category) {
			$category->portfolio = $category->portfolio->map(function ($portfolio) {
				$portfolio->short_description ??= \App\Utils\Helper::htmlToString($portfolio->description, 160);
				// $portfolio->published_at = Carbon::createFromDate($portfolio->published_at)->diffForHumans();

				$image = $portfolio->thumbnail ?? $portfolio->banner_image;

				if (!$image && $portfolio->portfolioImage->count() > 0) {
					$image = $portfolio->portfolioImage->first()->value;
					$portfolio->thumbnail = $image;
				}
				return $portfolio;
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
			"@id" => config('app.url') . "/portfolio/category/{$category->slug}",
			"url" => config('app.url') . "/portfolio/category/{$category->slug}",
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

	public function getPortfolioSchema($portfolio, $meta)  {
    $portfolioUrl = config('app.url') . "/portfolio/{$portfolio->slug}";
		$author = $portfolio->user?->name ?? '';
		$publishedAt = Carbon::createFromDate($portfolio->published_at);
		$thumbnail = $portfolio->thumbnail ?? $portfolio->banner_image;
		$thumbnail = str($thumbnail)->startsWith('/storage') ? config('app.url') . $thumbnail : $thumbnail;

		$portfolioCategory = $portfolio->category->title;

		$data = [
      "@context" => "https://schema.org/",
      "@type" => "NewsArticle",
			"@id" => $portfolioUrl,
			"headline" => $portfolio->title,
			"keywords" => $meta['keywords'],
			"datePublished" => $portfolio->published_at,
			"dateModified" => $portfolio->updated_at,
			"articleSection" => $portfolioCategory,
			"description" => $meta['description'],
			"copyrightYear" => $publishedAt->format('Y'),
			"name"=> $portfolio->title,
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
					"@id" => $portfolioUrl,
					"url" => $portfolioUrl,
					"name" => $portfolio->title,
					"datePublished" => $portfolio->published_at,
					"dateModified" => $portfolio->updated_at,
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
