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
            <th>Produk</th>
            <th>Variant</th>
            <th>SKU Variant</th>
            <th>Quantity</th>
            <th>Harga</th>
            <th>Total Harga</th>
            <th>Bukti Pembayaran</th>
            <th>Catatan</th>
            <th>Status</th>
            <th>Keterangan Batal</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $i => $item)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $item->transaction->transaction_code ?? '-' }}</td>
                <td>{{ \Carbon\Carbon::parse($item->transaction->created_at)->format('d/m/Y, H:i') }}</td>
                <td>{{ $item->transaction->user->name ?? '-' }}</td>
                <td>{{ $item->transaction->user->email ?? '-' }}</td>
                <td>{{ $item->transaction->user->phone_number ?? '-' }}</td>
                <td>{{ $item->transaction->address->address ?? '-' }}</td>
                <td>{{ $item->transaction->address->province->nama ?? '-' }}</td>
                <td>{{ $item->transaction->address->city->nama ?? '-' }}</td>
                <td>{{ $item->transaction->address->postal_code ?? '-' }}</td>

                {{-- ambil nama produk dari relasi variant.product --}}
                <td>{{ $item->variant->product->name ?? '-' }}</td>

                {{-- ambil nama dan SKU varian dari relasi variant --}}
                <td>{{ $item->variant->name ?? '-' }}</td>
                <td>{{ $item->variant->sku ?? '-' }}</td>

                <td>{{ $item->quantity }}</td>
                <td>Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                <td>Rp {{ number_format($item->subtotal ?? $item->price * $item->quantity, 0, ',', '.') }}</td>
                <td>
                    @if (!empty($item->transaction->file))
                        <a href="{{ url($item->transaction->file) }}" target="_blank"
                            class="text-primary-600 hover:underline">
                            Lihat Bukti Pembayaran
                        </a>
                    @else
                        <span>-</span>
                    @endif
                </td>
                <td>{{ $item->transaction->note }}</td>
                <td>
                    @php
                        $statusList = [
                            0 => 'Belum Dibayar',
                            1 => 'Konfirmasi Pembayaran',
                            2 => 'Pesanan Diproses',
                            3 => 'Pesanan Dikirim',
                            4 => 'Pesanan Selesai',
                            5 => 'Cancel',
                        ];
                        $statusText = $statusList[$item->transaction->status] ?? 'Tidak Diketahui';
                        if ($item->transaction->status == 4 && $item->transaction->completedBy) {
                            $statusText .= ' - ' . $item->transaction->completedBy->name;
                        }
                    @endphp
                    {{ $statusText }}
                </td>
                <td>{{ $item->note_transaction ?? '-' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
