<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Withdraw;
use App\Models\Configuration;
use App\Enums\OriginStatusType;
use App\Http\Controllers\Controller;
use App\Enums\ConfigNotificationType;
use App\Jobs\WithdrawNotificationJob;
use App\Jobs\ProductReviewNotificationJob;

class NotificationApiController extends Controller
{
  public function sendWithdrawEmailNotification($withdrawId, $isAdminNotification = false) {
    try {
      $withdraw = Withdraw::with('user')->whereId($withdrawId)->first();

      if (!$withdraw) throw new \Error('Withdraw not found');
      if ($withdraw->user?->email) {
        WithdrawNotificationJob::dispatch($withdraw->user->email, $withdraw, false);
      }
      if (!$isAdminNotification) return true;
      $notificationConfig = Configuration::where(['type'=> ConfigNotificationType::DISBURSEMENT_REQUEST, 'status'=> OriginStatusType::Active])->first();

      if ($notificationConfig) {
        $notifications = json_decode($notificationConfig->value, true);

        for ($i=0; $i < count($notifications); $i++) {
          $notification = $notifications[$i];

          if (filter_var($notification['email'], FILTER_VALIDATE_EMAIL) && $notification['status'] == 1) {
            WithdrawNotificationJob::dispatch($notification['email'], $withdraw, true)->delay(now()->addSeconds($i));;
          }
        }
      }
    } catch (\Throwable $th) {
      \Illuminate\Support\Facades\Log::info("Withdraw Notification Job: " . $th->getMessage());
    }
  }
  public function sendProductReviewEmailNotification($productId) {
    try {
      $product = Product::with('user')->whereId($productId)->first();
      $notificationConfig = Configuration::where(['type'=> ConfigNotificationType::DISBURSEMENT_REQUEST, 'status'=> OriginStatusType::Active])->first();
      if ($notificationConfig) {
        $notifications = json_decode($notificationConfig->value, true);

        for ($i=0; $i < count($notifications); $i++) {
          $notification = $notifications[$i];

          if (filter_var($notification['email'], FILTER_VALIDATE_EMAIL) && $notification['status'] == 1) {
            ProductReviewNotificationJob::dispatch($notification['email'], $product, true)->delay(now()->addSeconds($i));;
          }
        }
      }
    } catch (\Throwable $th) {
      \Illuminate\Support\Facades\Log::info("Product Notification Job: " . $th->getMessage());
    }
  }
}
