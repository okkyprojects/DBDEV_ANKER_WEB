<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Kode</th>
            <th>Produk</th>
            <th>Kategori</th>
            <th>Brand</th>
            <th>Jumlah Varian</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $i => $item)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $item->code }}</td>
            <td>{{ $item->name }}</td>
            <td>{{ $item->category->name }}</td>
            <td>{{ $item->brand->name }}</td>
            <td>{{ $item->variant_count }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
