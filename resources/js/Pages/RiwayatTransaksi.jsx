import { Link, Head } from "@inertiajs/react";
import HomeLayout from "@/Layouts/HomeLayout";
import { FiFilter, FiSearch } from "react-icons/fi";
import { FaCircle } from "react-icons/fa";
import ModalFilter from "@/Components/Modal/RiwayatTransaksi/ModalFilter";
import { useState } from "react";
import ModalDetailTransaksi from "@/Components/Modal/RiwayatTransaksi/ModalDetailTransaksi";

export default function RiwayatTransaksi() {
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [showModalDetailTransaksi, setShowModalDetailTransaksi] =
        useState(false);
    return (
        <HomeLayout>
            <Head title="Riwayat Transaksi" />
            <section className="max-w-7xl mx-auto px-5 pt-10 pb-10">
                <h2 className="text-xl sm:text-2xl font-medium text-neutral-900 mb-5">
                    Daftar Transaksi
                </h2>

                <div className="flex flex-col gap-5">
                    {" "}
                    <div className="flex items-center gap-2">
                        <div className="relative w-full">
                            <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                                <FiSearch size={16} />
                            </span>
                            <input
                                type="text"
                                placeholder="Cari transaksi"
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-400"
                            />
                        </div>
                        <button
                            onClick={() => setShowModalFilter(true)}
                            className="border border-neutral-400 px-5 py-2 rounded-xl text-sm bg-white text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5"
                        >
                            <FiFilter size={16} />
                            <span>Filter</span>
                        </button>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-primary-600 font-medium">
                                    #ID-Transaksi
                                </span>
                                <span className="bg-success-100 text-success-700 px-2 py-0.5 rounded-full text-xs">
                                    Selesai
                                </span>
                            </div>
                            <span className="text-xs md:text-sm text-neutral-500">
                                5/12/2025, 12.00
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {" "}
                            <div className="w-8 h-8 bg-neutral-200 rounded-full" />
                            <h3 className="font-medium text-sm text-neutral-800">
                                Nama Toko
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="w-14 h-14 bg-neutral-200 rounded-lg" />
                                    <div className="flex-1 text-sm text-neutral-800">
                                        <div className="font-medium">
                                            Nama produk
                                        </div>
                                        <div className="text-xs text-neutral-600">
                                            Varian X
                                        </div>
                                        <div className="text-xs text-neutral-600">
                                            Jumlah : 1
                                        </div>
                                    </div>
                                    <div className="text-sm text-right text-neutral-800">
                                        Rp 400.000
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="my-4 border-t border-neutral-200" />
                        <div className="flex justify-between items-center text-sm">
                            <div className="text-neutral-700 font-medium">
                                Total belanja
                            </div>
                            <div className="flex items-center gap-2 text-neutral-900 font-bold">
                                Rp 920.000
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-4">
                            <button
                                onClick={() =>
                                    setShowModalDetailTransaksi(true)
                                }
                                className="text-sm text-primary-600 "
                            >
                                Lihat detail transaksi
                            </button>
                            <button className="bg-primary-600 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-primary-700 transition">
                                Beli lagi
                            </button>
                            <button className="px-2 py-1 rounded-full border text-neutral-700 hover:bg-neutral-100">
                                ...
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-primary-600 font-medium">
                                    #ID-Transaksi
                                </span>
                                <span className="bg-info-100 text-info-700 px-2 py-0.5 rounded-full text-xs">
                                    Dalam Pengiriman
                                </span>
                            </div>
                            <span className="text-xs md:text-sm text-neutral-500">
                                5/12/2025, 12.00
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {" "}
                            <div className="w-8 h-8 bg-neutral-200 rounded-full" />
                            <h3 className="font-medium text-sm text-neutral-800">
                                Nama Toko
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="w-14 h-14 bg-neutral-200 rounded-lg" />
                                    <div className="flex-1 text-sm text-neutral-800">
                                        <div className="font-medium">
                                            Nama produk
                                        </div>
                                        <div className="text-xs text-neutral-600">
                                            Varian X
                                        </div>
                                        <div className="text-xs text-neutral-600">
                                            Jumlah : 1
                                        </div>
                                    </div>
                                    <div className="text-sm text-right text-neutral-800">
                                        Rp 400.000
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="my-4 border-t border-neutral-200" />
                        <div className="flex justify-between items-center text-sm">
                            <div className="text-neutral-700 font-medium">
                                Total belanja
                            </div>
                            <div className="flex items-center gap-2 text-neutral-900 font-bold">
                                Rp 920.000
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-4">
                            <Link
                                href="#"
                                className="text-sm text-primary-600 "
                            >
                                Lacak pengiriman
                            </Link>
                            <button className="bg-primary-600 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-primary-700 transition">
                                Beli lagi
                            </button>
                            <button className="px-2 py-1 rounded-full border text-neutral-700 hover:bg-neutral-100">
                                ...
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-primary-600 font-medium">
                                    #ID-Transaksi
                                </span>
                                <span className="bg-warning-100 text-warning-700 px-2 py-0.5 rounded-full text-xs">
                                    Di Proses
                                </span>
                            </div>
                            <span className="text-xs md:text-sm text-neutral-500">
                                5/12/2025, 12.00
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {" "}
                            <div className="w-8 h-8 bg-neutral-200 rounded-full" />
                            <h3 className="font-medium text-sm text-neutral-800">
                                Nama Toko
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="w-14 h-14 bg-neutral-200 rounded-lg" />
                                    <div className="flex-1 text-sm text-neutral-800">
                                        <div className="font-medium">
                                            Nama produk
                                        </div>
                                        <div className="text-xs text-neutral-600">
                                            Varian X
                                        </div>
                                        <div className="text-xs text-neutral-600">
                                            Jumlah : 1
                                        </div>
                                    </div>
                                    <div className="text-sm text-right text-neutral-800">
                                        Rp 400.000
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="my-4 border-t border-neutral-200" />
                        <div className="flex justify-between items-center text-sm">
                            <div className="text-neutral-700 font-medium">
                                Total belanja
                            </div>
                            <div className="flex items-center gap-2 text-neutral-900 font-bold">
                                Rp 920.000
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-4">
                            <Link
                                href="#"
                                className="text-sm text-primary-600 "
                            >
                                Batalkan pesanan
                            </Link>
                            <button className="bg-primary-600 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-primary-700 transition">
                                Beli lagi
                            </button>
                            <button className="px-2 py-1 rounded-full border text-neutral-700 hover:bg-neutral-100">
                                ...
                            </button>
                        </div>
                    </div>{" "}
                    {showModalFilter && (
                        <div
                            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                                showModalFilter
                                    ? "animate-fadeIn"
                                    : "animate-fadeOut"
                            }`}
                        >
                            <div className="bg-white p-6 rounded shadow-lg">
                                <ModalFilter
                                    isOpen={showModalFilter}
                                    onClose={() => {
                                        setShowModalFilter(!showModalFilter);
                                    }}
                                    onApplyFilter={() => {}}
                                />
                            </div>
                        </div>
                    )}
                    {showModalDetailTransaksi && (
                        <div
                            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                                showModalDetailTransaksi
                                    ? "animate-fadeIn"
                                    : "animate-fadeOut"
                            }`}
                        >
                            <div className="bg-white p-6 rounded shadow-lg">
                                <ModalDetailTransaksi
                                    isOpen={showModalDetailTransaksi}
                                    onClose={() => {
                                        setShowModalDetailTransaksi(
                                            !showModalDetailTransaksi
                                        );
                                    }}
                                    onApplyFilter={() => {}}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </HomeLayout>
    );
}
