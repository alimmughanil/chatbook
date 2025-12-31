<?php

namespace App\Models;

use App\Models\PortfolioProject;
use App\Models\Traits\SelectOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PortfolioCategory extends Model
{
    use HasFactory, SoftDeletes, SelectOptions;
    protected $guarded = ['id'];

		public function portfolioProject()
		{
				return $this->hasMany(PortfolioProject::class, 'category_id', 'id');
		}
		public function portfolio()
		{
				return $this->hasMany(PortfolioProject::class, 'category_id', 'id');
		}
}
