<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kartu Peserta</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .card {
            border: 1px solid #000;
            width: 100%;
            height: auto;
            text-align: center;
        }
        .card-header {
            background-color: #f4f4f4;
            font-weight: bold;
            font-size: 18px;
            border-bottom: 1px solid #000;
        }
        .card-body {
            padding: 10px;
        }
        .card-body img {
            width: 200px;
            height: 200px;
        }
        .card-body .info {
            text-align: left;
            margin: 0 auto;
            padding: 0;
        }
        .card-body .info table {
            width: 100%;
            border-collapse: collapse;
        }
        .card-body .info table td {
            padding: 5px;
        }
        .card-footer {
            background-color: #f4f4f4;
            padding: 10px;
            font-size: 14px;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
        }
    </style>
</head>
<body>

<div class="card">
    <div class="card-header">
        Kartu Peserta
    </div>
    <div class="card-body">
        <div class="info">
            <table>
                <tr>
                    <td><strong>Nama Peserta</strong></td>
                    <td colspan="12">: {{$participant->name}}</td>
                </tr>
                <tr>
                    <td><strong>Nomor Peserta</strong></td>
                    <td colspan="12">: {{$participant->participant_number}}</td>
                </tr>
                <tr>
                    <td><strong>Whatsapp</strong></td>
                    <td colspan="12">: {{$participant->phone}}</td>
                </tr>
                <tr>
                    <td><strong>Email</strong></td>
                    <td colspan="12">: {{$participant->email}}</td>
                </tr>
                <tr>
                    <td><strong>Instansi</strong></td>
                    <td colspan="12">: {{$participant->institute}}</td>
                </tr>
                <tr>
                    <td><strong>Nama Acara</strong></td>
                    <td colspan="12">: {{$event->title}}</td>
                </tr>
                <tr>
                    <td><strong>Waktu Acara</strong></td>
                    <td colspan="12">: {{$event->start_at}} - {{$event->finish_at}}</td>
                </tr>
            </table>
        </div>
        <img src="{{$participant->qr_code}}" alt="QR Code">
        <p>Tunjukan Kode QR ini kepada panitia saat menghadiri acara</p>
    </div>
    <div class="card-footer">
        Terima kasih telah bergabung dengan acara kami
    </div>
</div>

</body>
</html>
