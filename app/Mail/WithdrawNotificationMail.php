<?php

namespace App\Mail;

use App\Models\Withdraw;
use App\Models\Attachment;
use App\Enums\WithdrawStatusType;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Enums\DisbursementMethodType;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;

class WithdrawNotificationMail extends Mailable
{
  use Queueable, SerializesModels;

  public $withdraw, $isAdmin, $subject, $method, $status;
  /**
   * Create a new message instance.
   */
  public function __construct($withdraw, $isAdmin = false, $resendType = null)
  {
    $this->withdraw = $withdraw;
    $this->isAdmin = $isAdmin;

    $this->status = 'Sedang Diproses';
    $this->subject =  "[Proyekin.ID] Permintaan penarikan dana sedang diproses";
    if ($withdraw->status == WithdrawStatusType::Success) {
      $this->subject =  "[Proyekin.ID] Penarikan dana telah berhasil";
      $this->status = 'Berhasil';
    }
    if ($withdraw->status == WithdrawStatusType::Cancel) {
      $this->subject =  "[Proyekin.ID] Penarikan dana gagal diproses";
      $this->status = 'Gagal Diproses';
    }
    if ($isAdmin) {
      $this->subject =  "[Proyekin.ID] Permintaan penarikan dana baru";
    }

    if ($resendType) {
      $this->subject = "[Proyekin.ID] Bukti Penarikan dana";
    }

    $this->method = 'Transfer Manual';
    if ($withdraw->method == DisbursementMethodType::BIFAST) {
      $this->method = 'BI FAST';
    }
    if ($withdraw->method == DisbursementMethodType::RTOL) {
      $this->method = 'Transfer Online';
    }
  }

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: $this->subject,
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'mail.withdraw',
      with: [
        'withdraw' => $this->withdraw,
        'isAdmin' => $this->isAdmin,
        'status' => $this->status,
        'method' => $this->method,
      ]
    );
  }

  /**
   * Get the attachments for the message.
   *
   * @return array<int, \Illuminate\Mail\Mailables\Attachment>
   */
  public function attachments(): array
  {
    $attachments = [];
		if (isset($this->withdraw?->attachment)) {
			array_push($attachments, Attachment::fromPath(public_path($this->withdraw?->attachment)));
		}
    return $attachments;
  }
}
