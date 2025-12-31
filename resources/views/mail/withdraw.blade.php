<div style="padding: 4px">
  @if ($isAdmin == true)
  <p>Ada permintaan penarikan dana baru dari:</p>
  <p><b>Nama:</b> <br> {{$withdraw->user->name}}</p>
  <p><b>Email:</b> <br> <a href="mailto:{{$withdraw->user->email}}">{{$withdraw->user->email}}</a></p>
  <p><b>Whatsapp:</b> <br> <a href="https://api.whatsapp.com/send/?phone={{str_starts_with($withdraw->user->phone, '0') ? "62".substr($withdraw->user->phone,1) : "62".$withdraw->user->phone}}&text&type=phone_number&app_absent=0">{{$withdraw->user->phone}}</a></p>
  <p>Berikut rincian penarikan dana yang diajukan:</p>
  @else
  <p>Hai <b>{{$withdraw->user->name}}</b>, terima kasih telah menggunakan layanan kami. Berikut rincian penarikan dana yang diajukan:</p>
  @endif
  <p><b>No. Transaksi:</b> <br> #{{$withdraw->transaction_number}}</p>
  <p><b>Metode Pembayaran:</b> <br> {{$method}}</p>
  <p><b>Bank Tujuan:</b> <br> {{$withdraw->bank->bank_name}}</p>
  <p><b>Nomor Rekening:</b> <br> {{$withdraw->bank->bank_account}}</p>
  <p><b>Nama Pemilik Rekening:</b> <br> {{$withdraw->account_name ?: $withdraw->bank->bank_alias}}</p>
  <p><b>Nominal Yang Ditarik:</b> <br> Rp {{number_format($withdraw->gross_amount, 0, ",", ".")}}</p>
  {{-- <p><b>Biaya Layanan:</b> <br> Rp {{number_format($platform_fee, 0, ",", ".")}}</p>
  <p><b>Biaya Transfer:</b> <br> Rp {{number_format($transfer_fee, 0, ",", ".")}}</p> --}}
  <p><b>Total Biaya Potongan:</b> <br> Rp {{number_format($withdraw->fee, 0, ",", ".")}}</p>
  <p><b>Total Yang Diterima:</b> <br> Rp {{number_format($withdraw->net_amount, 0, ",", ".")}}</p>
  <p><b>Waktu Pengajuan:</b> <br> {{$withdraw->created_at->format('d-M-Y H:i:s')}} </p>
  <p><b>Status:</b> <br> {{$status}}</p>

  @if ($isAdmin == true && $withdraw->status == 'pending')
  <p>Harap segera diproses untuk permintaan penarikan dana tersebut.</p>
  @else
    @if ($withdraw->status == 'pending')
      <p>Penarikan dana sedang diproses, mohon ditunggu</p>
    @endif
    @if ($withdraw->status == 'processing')
      <p>Penarikan dana sedang diproses, mohon ditunggu</p>
    @endif
    @if ($withdraw->status == 'success')
      <p>Penarikan dana telah selesai, terima kasih telah menggunakan layanan kami.</p>
    @endif
    @if ($withdraw->status == 'cancel')
      <p>Penarikan dana gagal diproses. Untuk detail lebih lengkap anda dapat melihat di dashboard anda.</p>
    @endif
  @endif
  <br>
  <p>Salam, <br> Proyekin.ID </p>
</div>

