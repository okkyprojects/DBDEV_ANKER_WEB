<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Produk</th>
            <th>Stok Masuk</th>
            <th>Terjual</th>
            <th>Jumlah Pendapatan</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $i => $item)
        <tr>
            <td>{{ $i + 1 }}</td>
        <td className="px-4 py-5">
                                                {item.transaction_code}
                                            </td>{" "}
                                            <td className="px-4 py-5">
                                                {moment(item.created_at).format(
                                                    "DD/MM/YYYY, HH:mm"
                                                )}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.user.name}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.user.phone_number}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.address.address}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.address.province.nama}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.address.city.nama}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.address.postal_code}
                                            </td>
                                            <td className="px-4 py-5">
                                                {formatRupiah(item.total_price)}
                                            </td>
                                            <td className="px-4 py-5">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full text-green-800 ${
                                                        statusBadge[item.status]
                                                            ?.className
                                                    }`}
                                                >
                                                    {statusBadge[item.status]
                                                        ?.label ??
                                                        "Tidak Diketahui"}
                                                </span>
                                            </td>
        </tr>
        @endforeach
    </tbody>
</table>
