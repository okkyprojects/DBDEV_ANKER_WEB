<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Kode Transaksi</th>
            <th>Tanggal</th>
            <th>Nama Pemesan</th>
            <th>Email Pemesan</th>
            <th>No. HP</th>
            <th>Alamat</th>
            <th>Provinsi</th>
            <th>Kota</th>
            <th>Kode Pos</th>
            <th>Total Harga</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $i => $item)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $item->transaction_code }}</td>
            <td>{{ \Carbon\Carbon::parse($item->created_at)->format('d/m/Y, H:i') }}</td>
            <td>{{ $item->user->name }}</td>
            <td>{{ $item->user->email }}</td>
            <td>{{ $item->user->phone_number }}</td>
            <td>{{ $item->address->address }}</td>
            <td>{{ $item->address->province->nama }}</td>
            <td>{{ $item->address->city->nama }}</td>
            <td>{{ $item->address->postal_code }}</td>
            <td>Rp {{ number_format($item->total_price, 0, ',', '.') }}</td>
            <td>
                {{
                    [
                        0 => 'Belum Dibayar',
                        1 => 'Sudah Dibayar',
                        2 => 'Sedang Diproses',
                        3 => 'Dikirim',
                        4 => 'Selesai',
                        5 => 'Gagal',
                        6 => 'Kedaluwarsa',
                    ][$item->status] ?? 'Tidak Diketahui'
                }}
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
