<?php

namespace App\Models;

use App\Models\User;
use App\Models\PortfolioImage;
use App\Models\PortfolioCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PortfolioProject extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

		public function user()
		{
				return $this->belongsTo(User::class, 'user_id', 'id');
		}

		public function client()
		{
				return $this->belongsTo(User::class, 'client_id', 'id');
		}
		public function category()
		{
				return $this->belongsTo(PortfolioCategory::class, 'category_id', 'id');
		}
    public function portfolioImage()
    {
        return $this->hasMany(PortfolioImage::class, 'portfolio_project_id', 'id');
    }
}
