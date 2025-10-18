export const statusBadge = {
    0: {
        label: () => "Belum Dibayar",
        className: "bg-yellow-100 text-yellow-700",
    },
    1: {
        label: () => "Menunggu Konfirmasi",
        className: "bg-blue-100 text-blue-700",
    },
    2: {
        label: () => "Pesanan Diproses",
        className: "bg-indigo-100 text-indigo-700",
    },
    3: {
        label: () => "Pesanan Dikirim",
        className: "bg-cyan-100 text-cyan-700",
    },
    4: {
        label: (item) =>
            `Pesanan Selesai${
                item?.completed_by?.name ? ` - ${item.completed_by.name}` : ""
            }`,
        className: "bg-green-100 text-green-700",
    },
    5: {
        label: () => "Cancel",
        className: "bg-red-100 text-red-700",
    },
};
