<?php

namespace App\Http\Services\Payment\Duitku;

use Error;
use App\Models\Bank;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Wallet;
use GuzzleHttp\Client;
use App\Models\Withdraw;
use App\Enums\WithdrawStatusType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Enums\DisbursementMethodType;

class DisbursementService extends Controller
{
  public $client, $secretKey, $userId, $email, $isProduction, $headers;
  public function __construct()
  {
    // sandbox
    $baseUrl =  env('DISBURSE_BASE_URL', 'https://sandbox.duitku.com/webapi/api/disbursement/');
    // production
    // $baseUrl = 'https://passport.duitku.com/webapi/api/disbursement';

    $this->isProduction = str($baseUrl)->contains('passport.duitku.com') ? true : false;
    $this->client = new Client(['base_uri' => $baseUrl]);
    $this->secretKey      = env('DISBURSE_SECRET_KEY', 'de56f832487bc1ce1de5ff2cfacf8d9486c61da69df6fd61d5537b6b7d6d354d');
    $this->userId         =  env('DISBURSE_USER_ID', 3551);
    $this->email          = env('DISBURSE_EMAIL', 'test@chakratechnology.com');
    $this->headers = [
      'Accept' => 'application/json',
      'Content-Type' => 'application/json',
    ];
  }

  public function inquiry($validatedData) {
    try {
      $disburse = json_decode(json_encode($validatedData));
      $bank = Bank::with('supportedBank')->where('id', $disburse->bank_id)->first();
      $user = User::where('id', $disburse->user_id)->first();

      $data = [
        'amountTransfer' => intval($disburse->net_amount),
        'bankAccount' => $bank->bank_account,
        'bankCode' => $bank->supportedBank?->bank_code,
        'purpose' => 'Penarikan Dana di '. env('APP_NAME'),
        'timestamp' => round(microtime(true) * 1000),
        'senderId' => $user->id,
        'senderName' => $user->name,
      ];

      if (!isset($data['bankCode'])) throw new Error('Data rekening bank tidak valid, harap perbarui rekening bank anda terlebih dahulu.', 400);

      $response = null;
      if ($disburse->method == DisbursementMethodType::RTOL) {
        $response =  $this->inquiryTransferOnline($data);
        if ($response->responseCode != 00) throw new Error($response->responseDesc, $response->responseCode);
        $data['custRefNumber'] = $response->custRefNumber;
      }

      if ($disburse->method == DisbursementMethodType::BIFAST) {
        $data['custRefNumber'] = $validatedData['user_id'] . $validatedData['bank_id'] . time();
        $data['type'] = DisbursementMethodType::BIFAST;
        $response =  $this->inquiryClearing($data);
        if ($response->responseCode != 00) throw new Error($response->responseDesc, $response->responseCode);
      }
      if (!$response) throw new Error('Method not found', 400);

      $inquiry = [];
      $inquiry['reff_number'] = $response->custRefNumber;
      $inquiry['account_name'] = $response->accountName;
      $inquiry['disburse_id'] = $response->disburseId;

      $inquiry['account_number'] = $bank->bank_account;
      $inquiry['bank_name'] = $bank->supportedBank->bank_name;

      $data['accountName'] = $response->accountName;
      $inquiry['data'] = $data;

      return Inertia::render('Admin/Withdraw/Create', [
        'inquiry' => $inquiry
      ]);
    } catch (\Throwable $th) {
      return redirect()->back()->with('error', $th->getMessage());
    }
  }
  public function process($withdrawId) {
    try {
      $withdraw = Withdraw::with('user', 'bank.supportedBank')->where('id', $withdrawId)->first();
      if (!$withdraw) throw new Error('Withdraw not found', 404);

      $detail = json_decode($withdraw->detail, true);
      $data = $detail['data'];
      $response = null;

      if ($withdraw->method == DisbursementMethodType::RTOL) {
        $response =  $this->transferOnline($withdraw->disburse_id, $data);
        if ($response->responseCode != 00) throw new Error($response->responseDesc, $response->responseCode);

        if ($response->responseCode == 00) {
          $withdraw->status = WithdrawStatusType::Success;
          $withdraw->status_message = $response->responseDesc;
          $withdraw->save();

          return redirect("/admin/withdraw")->with('success', 'Penarikan Dana Berhasil Diproses');
        }
      }

      if ($withdraw->method == DisbursementMethodType::BIFAST) {
        $data['type'] = DisbursementMethodType::BIFAST;
        $response =  $this->clearing($withdraw->disburse_id, $data);
        if ($response->responseCode != 00) throw new Error($response->responseDesc, $response->responseCode);
      }

      if (!$response) throw new Error('Method not found', 400);

      // check status
      $status = $this->inquiryStatus($withdraw->disburse_id);
      if ($status->responseCode != 00) throw new Error($status->responseDesc, $status->responseCode);

      if ($status->responseCode == 00) {
        $withdraw->status = WithdrawStatusType::Success;
        $withdraw->status_message = $status->responseDesc;
        $withdraw->save();

        return redirect("/admin/withdraw")->with('success', 'Penarikan Dana Berhasil Diproses');
      }

    } catch (\Throwable $th) {
      if (str($th->getCode())->startsWith('-')) {
        $withdraw->status = WithdrawStatusType::Cancel;
        $withdraw->status_message = $th->getMessage();
        $wallet = Wallet::where('withdraw_id', $withdraw->id)->first();
        $wallet?->delete();
        $withdraw->save();

      }

      return redirect()->back()->with('error', $th->getMessage());
    }
  }

  public function example(){
    $data = [
      'amountTransfer' => 50000,
      'bankAccount'    =>'8760673566',
      'bankCode'       =>'014',
      'purpose'        =>'Test Disbursement with duitku',
      'timestamp'      => round(microtime(true) * 1000),
      'senderId'       => 123456789,
      'senderName'     =>'John Doe',
    ];

      $response =  $this->getListBank();
      // $response =  $this->getBalance();

      // transfer online (instant)
      // $response =  $this->inquiryTransferOnline($data);

      // $data['accountName'] = $response->accountName;
      // $data['custRefNumber'] = $response->custRefNumber;
      // $disburseId = $response->disburseId ?? 640298;
      // $response =  $this->transferOnline($disburseId, $data);

      // clearing (bi fast)
      // $data['bankAccount'] = '8760673466';
      // $data['custRefNumber'] = '12345789';
      // $data['type'] = 'BIFAST';
      // $response =  $this->inquiryClearing($data);

      // $data['accountName'] = $response->accountName;
      // $disburseId = $response->disburseId ?? 640300;
      // $response =  $this->clearing($disburseId, $data);

      // $response =  $this->inquiryStatus(640298);

      dd($response, $data);
  }

  public function getListBank()
  {
    $secretKey = $this->secretKey;
    $userId = $this->userId;
    $email = $this->email;
    $timestamp      = round(microtime(true) * 1000);
    $paramSignature = $email . $timestamp . $secretKey;

    $signature      = hash('sha256', $paramSignature);

    $params = array(
        'userId'    => $userId,
        'email'     => $email,
        'timestamp' => $timestamp,
        'signature' => $signature
    );

    try {
      $url = $this->isProduction ? 'listBank' : 'listBank';
      $req = $this->client->post($url, [
        'headers' => $this->headers,
        'json' => $params
      ]);
      $response = $req->getBody()->getContents();
      $response = json_decode($response);
      return $response;
    } catch (\Throwable $th) {
      return $this->responseError($th, $response);
    }
  }
  public function getBalance()
  {
    $secretKey = $this->secretKey;
    $userId = $this->userId;
    $email = $this->email;
    $timestamp      = round(microtime(true) * 1000);
    $paramSignature = $email . $timestamp . $secretKey;

    $signature      = hash('sha256', $paramSignature);

    $params = array(
        'userId'    => $userId,
        'email'     => $email,
        'timestamp' => $timestamp,
        'signature' => $signature
    );

    try {
      $url = $this->isProduction ? 'checkbalance' : 'checkbalance';
      $req = $this->client->post($url, [
        'headers' => $this->headers,
        'json' => $params
      ]);
      $response = $req->getBody()->getContents();
      $response = json_decode($response);
      return $response;
    } catch (\Throwable $th) {
      return $this->responseError($th, $response);
    }
  }
  public function inquiryStatus($disburseId)
  {
    $secretKey = $this->secretKey;
    $userId = $this->userId;
    $email = $this->email;
    $timestamp      = round(microtime(true) * 1000);
    $paramSignature = $email . $timestamp . $disburseId . $secretKey;

    $signature      = hash('sha256', $paramSignature);

    $params = array(
        'disburseId' => $disburseId,
        'userId'     => $userId,
        'email'      => $email,
        'timestamp'  => $timestamp,
        'signature'  => $signature
    );
    try {
      $url = $this->isProduction ? 'inquirystatus' : 'inquirystatus';
      $req = $this->client->post($url, [
        'headers' => $this->headers,
        'json' => $params
      ]);
      $response = $req->getBody()->getContents();
      $response = json_decode($response);
      return $response;
    } catch (\Throwable $th) {
      return $this->responseError($th, $response);
    }
  }
  public function inquiryTransferOnline($data)
  {
    $secretKey = $this->secretKey;
    $userId = $this->userId;
    $email = $this->email;

    $amountTransfer = $data['amountTransfer'];
    $bankAccount    = $data['bankAccount'];
    $bankCode       = $data['bankCode'];
    $purpose        = $data['purpose'];
    $timestamp      = $data['timestamp'];
    $senderId       = $data['senderId'];
    $senderName     = $data['senderName'];
    $paramSignature = $email . $timestamp . $bankCode . $bankAccount . $amountTransfer . $purpose . $secretKey;

    $signature = hash('sha256', $paramSignature);

    $params = array(
        'userId'         => $userId,
        'amountTransfer' => $amountTransfer,
        'bankAccount'    => $bankAccount,
        'bankCode'       => $bankCode,
        'email'          => $email,
        'purpose'        => $purpose,
        'timestamp'      => $timestamp,
        'senderId'       => $senderId,
        'senderName'     => $senderName,
        'signature'      => $signature
    );

    try {
      $url = $this->isProduction ? 'inquiry' : 'inquirysandbox';
      $req = $this->client->post($url, [
        'headers' => $this->headers,
        'json' => $params
      ]);
      $response = $req->getBody()->getContents();
      $response = json_decode($response);
      return $response;
    } catch (\Throwable $th) {
      return $this->responseError($th, $response);
    }
  }
  public function transferOnline($disburseId, $data)
  {
    $secretKey = $this->secretKey;
    $userId = $this->userId;
    $email = $this->email;

    $accountName    = $data['accountName'];
    $custRefNumber  = $data['custRefNumber'];

    $amountTransfer = $data['amountTransfer'];
    $bankAccount    = $data['bankAccount'];
    $bankCode       = $data['bankCode'];
    $purpose        = $data['purpose'];
    $timestamp      = $data['timestamp'];
    $paramSignature = $email . $timestamp . $bankCode . $bankAccount . $accountName . $custRefNumber . $amountTransfer . $purpose . $disburseId . $secretKey;

    $signature = hash('sha256', $paramSignature);

    $params = array(
        'disburseId'     => $disburseId,
        'userId'         => $userId,
        'email'          => $email,
        'bankCode'       => $bankCode,
        'bankAccount'    => $bankAccount,
        'amountTransfer' => $amountTransfer,
        'accountName'    => $accountName,
        'custRefNumber'  => $custRefNumber,
        'purpose'        => $purpose,
        'timestamp'      => $timestamp,
        'signature'      => $signature
    );

    try {
      $url = $this->isProduction ? 'transfer' : 'transfersandbox';
      $req = $this->client->post($url, [
        'headers' => $this->headers,
        'json' => $params
      ]);
      $response = $req->getBody()->getContents();
      $response = json_decode($response);
      return $response;
    } catch (\Throwable $th) {
      return $this->responseError($th, $response);
    }
  }
  public function inquiryClearing($data)
  {
    $secretKey = $this->secretKey;
    $userId = $this->userId;
    $email = $this->email;

    $custRefNumber  = $data['custRefNumber'];
    $type           = $data['type'];

    $amountTransfer = $data['amountTransfer'];
    $bankAccount    = $data['bankAccount'];
    $bankCode       = $data['bankCode'];
    $purpose        = $data['purpose'];
    $timestamp      = $data['timestamp'];
    $senderId       = $data['senderId'];
    $senderName     = $data['senderName'];

    $paramSignature    = $email . $timestamp . $bankCode . $type . $bankAccount . $amountTransfer . $purpose . $secretKey;

    $signature = hash('sha256', $paramSignature);

    $params = array(
        'userId'         => $userId,
        'email'          => $email,
        'bankCode'       => $bankCode,
        'bankAccount'    => $bankAccount,
        'amountTransfer' => $amountTransfer,
        'custRefNumber'  => $custRefNumber,
        'senderId'       => $senderId,
        'senderName'     => $senderName,
        'purpose'        => $purpose,
        'type'           => $type,
        'timestamp'      => $timestamp,
        'signature'      => $signature
    );

    try {
      $url = $this->isProduction ? 'inquiryclearing' : 'inquiryclearingsandbox';
      $req = $this->client->post($url, [
        'headers' => $this->headers,
        'json' => $params
      ]);
      $response = $req->getBody()->getContents();
      $response = json_decode($response);
      return $response;
    } catch (\Throwable $th) {
      return $this->responseError($th, $response);
    }
  }
  public function clearing($disburseId, $data)
  {
    $secretKey = $this->secretKey;
    $userId = $this->userId;
    $email = $this->email;

    $accountName    = $data['accountName'];

    $custRefNumber  = $data['custRefNumber'];
    $type           = $data['type'];

    $amountTransfer = $data['amountTransfer'];
    $bankAccount    = $data['bankAccount'];
    $bankCode       = $data['bankCode'];
    $purpose        = $data['purpose'];
    $timestamp      = $data['timestamp'];

    $paramSignature = $email . $timestamp . $bankCode . $type . $bankAccount . $accountName . $custRefNumber . $amountTransfer . $purpose . $disburseId . $secretKey;
    $signature = hash('sha256', $paramSignature);

    $params = array(
        'disburseId'     => $disburseId,
        'userId'         => $userId,
        'email'          => $email,
        'bankCode'       => $bankCode,
        'bankAccount'    => $bankAccount,
        'amountTransfer' => $amountTransfer,
        'accountName'    => $accountName,
        'custRefNumber'  => $custRefNumber,
        'type'           => $type,
        'purpose'        => $purpose,
        'timestamp'      => $timestamp,
        'signature'      => $signature
    );

    try {
      $url = $this->isProduction ? 'transferclearing' : 'transferclearingsandbox';
      $req = $this->client->post($url, [
        'headers' => $this->headers,
        'json' => $params
      ]);
      $response = $req->getBody()->getContents();
      $response = json_decode($response);
      return $response;
    } catch (\Throwable $th) {
      return $this->responseError($th, $response);
    }
  }
  public function clearingCallback(Request $request)
  {
    try {
      $secretKey = $this->secretKey;
      $result = collect($request->all())->toArray();

      $disburseId     = $result['disburseId'] ?? null;
      $userId         = $result['userId'] ?? null;
      $email          = $result['email'] ?? null;
      $bankCode       = $result['bankCode'] ?? null;
      $bankAccount    = $result['bankAccount'] ?? null;
      $amountTransfer = $result['amountTransfer'] ?? null;
      $accountName    = $result['accountName'] ?? null;
      $custRefNumber  = $result['custRefNumber'] ?? null;
      $statusCode     = $result['statusCode'] ?? null;
      $statusDesc     = $result['statusDesc'] ?? null ;
      $errorMessage   = $result['errorMessage'] ?? null;
      $signature      = $result['signature'] ?? null;

      if(empty($email) && empty($bankCode) && empty($bankAccount) && empty($accountName) && empty($custRefNumber) && empty($amountTransfer) && empty($disburseId) && empty($signature)){
        throw new Error('Bad Parameter', 400);
      }

      $params = $email . $bankCode . $bankAccount . $accountName . $custRefNumber .  $amountTransfer . $disburseId . $secretKey;
      $calcSignature = hash('sha256', $params);
      if($signature != $calcSignature) throw new Error('Bad Signature', 400);

      // disbursement handling
      $withdraw = Withdraw::where('reff_number', $custRefNumber)->first();
      if (!$withdraw) throw new Error('Withdraw not found', 404);

      $status = $this->inquiryStatus($withdraw->disburse_id);

      if (str($status->responseCode)->startsWith('-')) {
        $withdraw->status = WithdrawStatusType::Cancel;
        $wallet = Wallet::where('withdraw_id', $withdraw->id)->first();
        $wallet?->delete();
      }

      if ($status->responseCode == 00) {
        $withdraw->status = WithdrawStatusType::Success;
      }

      $withdraw->status_message = $status->responseDesc;
      $withdraw->save();

      return response()->json(['message' => 'update disbursement is successful'], 200);
    } catch (\Throwable $th) {
      $data = ['message' => $th->getMessage()];
      return response()->json($data, $th->getCode());
    }
  }

  public function responseError($th, $response) {
    $response = explode(':', $th->getMessage());
    $data = [
      'responseCode' => 02,
      'responseDesc' => $response[count($response) - 1],
    ];
    return json_decode(collect($data)->toJson());
  }
}
