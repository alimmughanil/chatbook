<?php

namespace App\Http\Controllers\User;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Services\Payment\Duitku\PaymentService as DuitkuPaymentService;

class PaymentController extends Controller
{
  public function duitkuCallback(Request $request)
  {
    return (new DuitkuPaymentService())->callback($request);
  }
}
