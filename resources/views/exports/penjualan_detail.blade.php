<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Variant</th>
            <th>Kategori</th>
            <th>Brand</th>
            <th>Terjual</th>
            <th>Pendapatan</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item->variant_name }}</td>
                <td>{{ $item->category_name }}</td>
                <td>{{ $item->brand_name }}</td>
                <td>{{ (int) $item->terjual }}</td>
                <td>{{ $item->pendapatan }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
