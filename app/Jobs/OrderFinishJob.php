<?php

namespace App\Jobs;

use App\Enums\HistoryType;
use App\Enums\OrderStatusType;
use App\Enums\WorkStatusType;
use App\Http\Controllers\Admin\OrderController;
use App\Models\Configuration;
use App\Models\Order;
use App\Models\WorkHistory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class OrderFinishJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  /**
   * Create a new job instance.
   */
  public function __construct()
  {
    //
  }

  /**
   * Execute the job.
   */
  public function handle(): void
  {
    $orders = Order::where('status', OrderStatusType::Processing)->get();
    $work_submit_ttl = Configuration::where('type', 'WORK_SUBMIT_TTL')->first();
    $work_submit_ttl = $work_submit_ttl ? intval($work_submit_ttl->value) : 3;

    if (is_nan($work_submit_ttl)) {
      $work_submit_ttl = 3;
    }

    foreach ($orders as $order) {
      $workHistory = WorkHistory::where('order_id', $order->id)->latest()->first();

      if (
        isset($workHistory)
        && $workHistory->type == HistoryType::Request
        && $workHistory->status == WorkStatusType::Finish
        && $workHistory->created_at->addDays($work_submit_ttl) < now()
      ) {
        $workFinishData = [
          'order_number' => $order->order_number,
          'type' => HistoryType::Response,
          'status' => WorkStatusType::Finish,
          'message' => 'Pekerjaan telah diselesaikan oleh sistem, pengajuan submit pekerjaan telah melewati batas waktu yang ditentukan',
        ];
        (new OrderController())->finishOrder($order->order_number, $workFinishData);
      }
    }
  }
}
