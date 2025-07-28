import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";
import { formatRupiah } from "@/Utils/utils";

const ModalDetailPesanan = ({ isOpen, onClose, item }) => {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-200 ease-in-out ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-0 ">
                <div
                    className={`relative mx-auto w-full max-w-xl transform rounded-xl overflow-y-auto scrollbar-hidden max-h-[40rem] bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                        isOpen
                            ? "translate-y-0 scale-100"
                            : "translate-y-10 scale-95"
                    }`}
                >
                    <div className="flex sticky z-10 bg-white top-0 items-center justify-between px-6 py-6 text-sm">
                        <h3 className="text-base font-semibold ">
                            Detail Transaksi
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            <IoIosClose size={25} />
                        </button>
                    </div>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <div className="px-6 py-4 text-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                <div className="flex gap-2">
                                    <span className="text-primary-600 font-medium">
                                        #{item?.transaction_code}
                                    </span>
                                    <span className="bg-success-100 text-success-700 px-2 py-0.5 rounded-full text-xs">
                                        Selesai
                                    </span>
                                </div>
                                <span className="text-neutral-500 text-sm">
                                    {moment(item?.created_at).format(
                                        "D/MM/YYYY, HH.mm"
                                    )}
                                </span>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-medium text-sm mb-2">
                                    Produk
                                </h4>
                                <div className="flex flex-col gap-2">
                                    {item?.items?.map((product, index) => (
                                        <div className="w-full" key={index}>
                                            <div className="flex gap-3 items-center">
                                                <img
                                                    src={product.img}
                                                    alt={product.product_name}
                                                    className="w-16 h-16 object-cover bg-neutral-200 rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-neutral-800">
                                                        {product.product_name}
                                                    </div>
                                                    <div className="text-xs text-neutral-600">
                                                        {product.variant_name}
                                                    </div>
                                                    <div className="text-xs text-neutral-600 mt-0.5 mb-1">
                                                        Jumlah :{" "}
                                                        {product.quantity}
                                                    </div>
                                                    <div className="text-sm text-neutral-800">
                                                        {formatRupiah(
                                                            product.price
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-medium mb-2">
                                    Informasi Penerima
                                </h4>
                                <div className="flex justify-between">
                                    <span className="text-neutral-700">
                                        Nama Lengkap
                                    </span>
                                    <span className=" text-neutral-700">
                                        {item?.address?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-neutral-700">
                                        No. Telephone/HP
                                    </span>
                                    <span className=" text-neutral-700">
                                        {item?.address?.phone_number}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-medium mb-2">
                                    Informasi Pengiriman
                                </h4>
                                <div className="flex justify-between mt-1">
                                    <span className="text-neutral-700">
                                        Alamat pengiriman
                                    </span>
                                    <div className="text-right text-neutral-700 text-sm ">
                                        <p>{item?.address?.address}</p>
                                        <p>
                                            {item?.address?.district?.nama},{" "}
                                            {item?.address?.city?.nama}
                                        </p>
                                        <p>
                                            {item?.address?.province?.nama} [
                                            {item?.address?.postal_code}]
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-medium mb-2">
                                    Metode Pembayaran
                                </h4>
                                <span className="text-neutral-700 text-sm">
                                    {item?.bill?.bank_name}
                                </span>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-medium mb-2">
                                    Rincian Belanja
                                </h4>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-neutral-700">
                                        Subtotal harga barang
                                    </span>
                                    <span className="text-neutral-900 ">
                                        {formatRupiah(item?.total_price)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-neutral-700">
                                        Ongkos kirim
                                    </span>
                                    <span className="text-neutral-900 ">
                                        Rp 0
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-neutral-700">
                                        Biaya aplikasi
                                    </span>
                                    <span className="text-neutral-900 ">
                                        {formatRupiah(item?.admin_fee)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm font-medium border-t pt-4">
                                <span className="text-neutral-900">
                                    Total Belanja
                                </span>
                                <span className="text-neutral-900">
                                    {formatRupiah(item?.grand_total)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalDetailPesanan;
