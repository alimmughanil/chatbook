<?php

namespace App\Jobs;

use App\Mail\WithdrawNotificationMail;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class WithdrawNotificationJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  /**
   * Create a new job instance.
   */
  public $email, $withdraw, $isAdmin, $resendType;
  public function __construct($email, $withdraw, $isAdmin = false, $resendType = null)
  {
    $this->withdraw = $withdraw;
    $this->email = $email;
    $this->isAdmin = $isAdmin;
    $this->resendType = $resendType;
  }

  /**
   * Execute the job.
   */
  public function handle(): void
  {
    Mail::to($this->email)->send(new WithdrawNotificationMail($this->withdraw, $this->isAdmin, $this->resendType));
  }
}
