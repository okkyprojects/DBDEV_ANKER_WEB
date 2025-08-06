<table>
    <thead>
        <tr>
            <th style="text-align:left;">No</th>
            <th style="text-align:left;">Produk</th>
            <th style="text-align:left;">Stok Masuk</th>
            <th style="text-align:left;">Terjual</th>
            <th style="text-align:left;">Jumlah Pendapatan</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $i => $item)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $item->product_name }}</td>
            <td>{{ $item->kuantitas }}</td>
            <td>{{ $item->terjual }}</td>
            <td>Rp {{ number_format($item->pendapatan, 0, ',', '.') }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
