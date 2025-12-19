<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Kategori</th>
            <th>Brand</th>
            <th>Kode Produk</th>
            <th>Gambar Produk</th>
            <th>Produk</th>
            <th>Status</th>
            <th>Deskripsi Produk</th>
            <th>Varian</th>
            <th>Gambar Varian</th>
            <th>SKU</th>
            <th>Harga</th>
            <th>Qty</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $i => $variant)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $variant->product->category->name ?? '-' }}</td>
                <td>{{ $variant->product->brand->name ?? '-' }}</td>
                <td>{{ $variant->product->code ?? '-' }}</td>
                <td>
                    {{ str_starts_with($variant->product->img, 'http') ? $variant->product->img : url()->to($variant->product->img) }}
                </td>

                <td>{{ $variant->product->name ?? '-' }}</td>
                <td>{{ $variant->product->status == 1 ? 'Aktif' : 'Tidak Aktid' }}</td>
                <td>{{ $variant->product->description ?? '-' }}</td>
                <td>{{ $variant->name ?? '-' }}</td>
                <td>
                    {{ str_starts_with($variant->img, 'http') ? $variant->img : url()->to($variant->img) }}
                </td>


                <td>{{ $variant->sku ?? '-' }}</td>
                <td>{{ $variant->price }}</td>

                <td>{{ $variant->stock ?? 0 }}</td>
            </tr>
        @endforeach
    </tbody>

</table>
