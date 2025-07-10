export const formatRupiah = (angka) => {
    const bulat = Math.round(Number(angka) || 0); 
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(bulat);
};
