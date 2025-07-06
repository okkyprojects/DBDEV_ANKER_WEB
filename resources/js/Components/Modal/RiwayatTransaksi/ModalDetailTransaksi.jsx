import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";

const ModalDetailTransaksi = ({ isOpen, onClose, onApplyFilter }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState();
    const [dateValue, setDateValue] = useState({
        startDate: null,
        endDate: null,
    });
    const handleDateChange = (newValue) => {
        setDateValue(newValue);
    };
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
    const handleApplyFilter = () => {
        onApplyFilter({
            startDate: dateValue.startDate
                ? moment(dateValue.startDate).format("YYYY-MM-DD")
                : null,
            endDate: dateValue.endDate
                ? moment(dateValue.endDate).format("YYYY-MM-DD")
                : null,
            status,
        });
        onClose();
    };

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
                                        #ID-Transaksi
                                    </span>
                                    <span className="bg-success-100 text-success-700 px-2 py-0.5 rounded-full text-xs">
                                        Selesai
                                    </span>
                                </div>
                                <span className="text-neutral-500 text-sm">
                                    5/06/2025, 13.00
                                </span>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-medium text-sm mb-2">
                                    Produk
                                </h4>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-neutral-200 rounded-full " />
                                        <p className="text-sm font-medium text-neutral-800">
                                            Nama Toko
                                        </p>
                                    </div>
                                    <div className="w-full">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-16 h-16 bg-neutral-200 rounded-lg" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-neutral-800">
                                                    Nama produk
                                                </div>
                                                <div className="text-xs text-neutral-600">
                                                    Varian X
                                                </div>
                                                <div className="text-xs text-neutral-600 mt-0.5 mb-1">
                                                    Jumlah : 1
                                                </div>
                                                <div className="text-sm  text-neutral-800">
                                                    Rp 400.000
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                        Joan Doe
                                    </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-neutral-700">
                                        No. Telephone/HP
                                    </span>
                                    <span className=" text-neutral-700">
                                        +62888-8888-8888
                                    </span>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-medium mb-2">
                                    Informasi Pengiriman
                                </h4>
                                <div className="flex justify-between">
                                    <span className="text-neutral-700">
                                        Kurir
                                    </span>
                                    <span className=" text-neutral-700">
                                        JNE
                                    </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-neutral-700">
                                        Alamat pengiriman
                                    </span>
                                    <div className="text-right text-neutral-700 text-sm ">
                                        <p>JL Kemana saja No 99</p>
                                        <p>Kecamatan Mana, Kabupaten Saja</p>
                                        <p>Jawa Timur [Kode pos]</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-medium mb-2">
                                    Metode Pembayaran
                                </h4>
                                <span className="text-neutral-700 text-sm">
                                    BRI Virtual Account
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
                                        Rp 400.000
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-neutral-700">
                                        Ongkos kirim
                                    </span>
                                    <span className="text-neutral-900 ">
                                        Rp 20.000
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-neutral-700">
                                        Biaya aplikasi
                                    </span>
                                    <span className="text-neutral-900 ">
                                        Rp 1.000
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm font-medium border-t pt-4">
                                <span className="text-neutral-900">
                                    Total Belanja
                                </span>
                                <span className="text-neutral-900">
                                    Rp 421.000
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalDetailTransaksi;
