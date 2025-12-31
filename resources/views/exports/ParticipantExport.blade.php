<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
  <table>
    <thead>
    <tr>
        <th style="text-align: left">Nomor Peseerta</th>
        <th style="text-align: left">Jenis Peserta</th>
        <th style="text-align: left">Nama</th>
        <th style="text-align: left">Email</th>
        <th style="text-align: left">Nomor Handphone</th>
        <th style="text-align: left">Instansi</th>
        <th style="text-align: left">Cabang</th>
        {{-- <th style="text-align: left">Status</th> --}}
        <th style="text-align: left">Waktu</th>
    </tr>
    </thead>
    <tbody>
    @foreach($props->participant as $participant)
        <tr>
            <td style="width: 200px; font-size: 12px;">{{ $participant->participant_number }}</td>
            <td style="width: 200px; font-size: 12px;">{{ $participant->type }}</td>
            <td style="width: 200px; font-size: 12px;">{{ $participant->name }}</td>
            <td style="width: 200px; font-size: 12px;">{{ $participant->email }}</td>
            <td style="width: 200px; font-size: 12px;">{{ $participant->phone }}</td>
            <td style="width: 200px; font-size: 12px;">{{ $participant->institute }}</td>
            <td style="width: 200px; font-size: 12px;">{{ $participant->branch }}</td>
            {{-- <td style="width: 200px; font-size: 12px;">{{ $participant->status }}</td> --}}
            <td style="width: 200px; font-size: 12px;">{{ $participant->created_at }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>