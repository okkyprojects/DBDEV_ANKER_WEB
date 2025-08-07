<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Produk</th>
            <th>Variant</th>
            <th>Jumlah</th>
            <th>Tanggal</th>
            <th>Keterangan</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $index => $item)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $item->variant?->product?->name ?? '-' }}</td>
            <td>{{ $item->variant?->name ?? '-' }}</td>
            <td>{{ $item->quantity ?? 0 }}</td>
            <td>{{ \Carbon\Carbon::parse($item->created_at)->format('d/m/Y, H:i') }}</td>
            <td>{{ $item->note ?? '-' }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
