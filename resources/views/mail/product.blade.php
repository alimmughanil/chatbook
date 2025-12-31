<div style="padding: 4px">
  @if ($isAdmin == true)
  <p>Ada permintaan konfirmasi produk baru dari:</p>
  <p><b>Nama:</b> <br> {{$product->user->name}}</p>
  <p><b>Email:</b> <br> <a href="mailto:{{$product->user->email}}">{{$product->user->email}}</a></p>
  <p><b>Whatsapp:</b> <br> <a href="https://api.whatsapp.com/send/?phone={{str_starts_with($product->user->phone, '0') ? "62".substr($product->user->phone,1) : "62".$product->user->phone}}&text&type=phone_number&app_absent=0">{{$product->user->phone}}</a></p>
  <p>Berikut rincian produk yang ditambahkan:</p>
  @else
  <p>Hai <b>{{$product->user->name}}</b>, terima kasih telah menggunakan layanan kami. Berikut rincian produk yang ditambahkan:</p>
  @endif
  <p><b>Nama Produk:</b> <br> {{$product?->name}}</p>
  <p><b>Deskripsi Produk:</b></p><br>
  <p>{!!$product->description!!}</p>

  @if ($isAdmin == true && $product->status == 'review')
  <p>Harap segera diproses untuk konfirmasi produk tersebut.</p>
  @else
    @if ($product->status == 'review')
      <p>Publikasi produk sedang diproses, mohon ditunggu</p>
    @endif
    @if ($product->status == 'publish')
      <p>Produk telah dipublikasi, terima kasih telah menggunakan layanan kami.</p>
    @endif
  @endif
  <br>
  <p>Salam, <br> Proyekin.ID </p>
</div>
