<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;

class ProductReviewMail extends Mailable
{
  use Queueable, SerializesModels;

  public $product, $isAdmin, $subject, $method, $status;
  /**
   * Create a new message instance.
   */
  public function __construct($product, $isAdmin = true)
  {
    $this->product = $product;
    $this->isAdmin = $isAdmin;

    $this->status = 'Butuh Konfirmasi';
    $this->subject =  "[Proyekin.ID] Permintaan Konfirmasi Produk Baru";
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
      view: 'mail.product',
      with: [
        'product' => $this->product,
        'isAdmin' => $this->isAdmin,
        'status' => $this->status,
      ]
    );
  }

  /**
   * Get the attachments for the message.
   *
   * @return array<int, \Illuminate\Mail\Mailables\Attachment>
   */
}
