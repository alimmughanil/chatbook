<?php

namespace App\Jobs;

use App\Mail\ProductReviewMail;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ProductReviewNotificationJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  /**
   * Create a new job instance.
   */
  public $email, $product, $isAdmin, $resendType;
  public function __construct($email, $product, $isAdmin = true)
  {
    $this->product = $product;
    $this->email = $email;
    $this->isAdmin = $isAdmin;
  }

  /**
   * Execute the job.
   */
  public function handle(): void
  {
    Mail::to($this->email)->send(new ProductReviewMail($this->product, $this->isAdmin));
  }
}
