<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Produk</th>
            <th>Kategori</th>
            <th>Brand</th>
            <th>Varian</th>
            <th>SKU</th>
            <th>Qty</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $i => $variant)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $variant->product->name ?? '-' }}</td>
            <td>{{ $variant->product->category->name ?? '-' }}</td>
            <td>{{ $variant->product->brand->name ?? '-' }}</td>
            <td>{{ $variant->name }}</td>
            <td>{{ $variant->sku }}</td>
            <td>{{ $variant->total_stock->total_stock ?? 0 }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
