<?php

namespace App\Constants;

class NotifConstants
{
    public static $CLIENT = [
        'PAYMENT_SUCCESS' => 'Pembayaran {order_id} berhasil dilakukan. Pekerjaan telah diberikan kepada freelancer.',
        'WORK_CANCELLED' => '{username/email} mengajukan pembatalan pekerjaan {order_id}. Dana akan dikembalikan 1x24 jam.',
        'WORK_SUBMITTED' => 'Pekerjaan {order_id} telah dikirimkan kepada anda.',
        'REQUEST_REVISION' => 'Revisi pesanan {order_id} anda telah berhasil disubmit.',
        'SUBMIT_REVISION' => 'Freelancer mengirimkan revisi pekerjaan {order_id}.',
        'FIRSTLOGIN' => 'Selamat datang di freelancerr.id. Cara mudah menciptakan pekerjaan masa depan.',
    ];
    public static $FREELANCER = [
        'PAYMENT_SUCCESS' => 'Anda mendapatkan pekerjaan baru {order_id}.',
        'WORK_CANCELLED' => 'Berhasil melakukan pembatalan pekerjaan {order_id}. Dana akan dikembalikan 1x24 jam.',
        'REQUEST_REVISION' => 'Client mengajukan revisi untuk pekerjaan {order_id}.',
        'WORK_APPROVED' => 'Selamat! client telah menerima hasil pekerjaan {order_id}.',
        'REQUEST_PRODUCT' => 'Produk anda {product_name} telah disetujui oleh admin.',
        'FIRSTLOGIN' => 'Selamat datang di freelancerr.id. Cara mudah menciptakan pekerjaan masa depan.',
    ];
    public static $ADMIN = [
        'WORK_CANCELLED' => 'Pekerjaan {order_id} dibatalkan oleh {partner_name/email}. Segera proses pengembalian dana kepada {client_name/email}',
        'WORK_APPROVED' => 'Pekerjaan {order_id} telah diselesaikan. Segera proses pembayaran kepada freelancer {partner_name/email} 1x24 jam.',
        'REQUEST_PRODUCT' => '1 produk yang membutuhkan moderasi ditambahkan oleh {partner_name/email}.',
    ];
}
