<?php

namespace App\Models;

use App\Models\PortfolioProject;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PortfolioImage extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

		public function portfolioProject()
		{
				return $this->belongsTo(PortfolioProject::class, 'portfolio_project_id', 'id');
		}
}
