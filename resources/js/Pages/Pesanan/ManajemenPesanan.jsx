import { FiSearch } from "react-icons/fi";
import { GrFilter } from "react-icons/gr";
import { HiOutlinePrinter } from "react-icons/hi2";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { PiCubeLight } from "react-icons/pi";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { useState } from "react";
import {
    PiCheckCircleLight,
    PiClockLight,
    PiTruckLight,
    PiXCircleLight,
} from "react-icons/pi";
import { formatRupiah } from "@/Utils/utils";

export default function ManajemenPesanan() {
    const data = [
        {
            namaPemesan: "Ilham Arkan",
            nomorHp: "081234567890",
            alamat: "Jl. Ikan Paus No. 21",
            provinsi: "Jawa Timur",
            kota: "Malang",
            kodePos: "65145",
            nominal: 250000,
            status: "Menunggu Pembayaran",
        },
        {
            namaPemesan: "Ayu Lestari",
            nomorHp: "085678912345",
            alamat: "Jl. Kenanga Raya No. 8",
            provinsi: "DKI Jakarta",
            kota: "Jakarta Selatan",
            kodePos: "12420",
            nominal: 500000,
            status: "Selesai",
        },
        {
            namaPemesan: "Budi Santoso",
            nomorHp: "089876543210",
            alamat: "Jl. Cendrawasih No. 3",
            provinsi: "Jawa Barat",
            kota: "Bandung",
            kodePos: "40291",
            nominal: 350000,
            status: "Dikirim",
        },
        {
            namaPemesan: "Rina Wulandari",
            nomorHp: "082233445566",
            alamat: "Jl. Merpati No. 10",
            provinsi: "Bali",
            kota: "Denpasar",
            kodePos: "80235",
            nominal: 420000,
            status: "Dibatalkan",
        },
    ];

    const dataCard = [
        {
            title: "Pesanan Selesai",
            count: 100,
            iconBg: "bg-green-100",
            iconColor: "text-green-500",
            icon: <PiCheckCircleLight size={24} />,
        },
        {
            title: "Pesanan Belum Diproses",
            count: 2,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-500",
            icon: <PiClockLight size={24} />,
        },
        {
            title: "Pesanan Dikirim",
            count: 5,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-500",
            icon: <PiTruckLight size={24} />,
        },
        {
            title: "Pesanan Ditolak",
            count: 5,
            iconBg: "bg-red-100",
            iconColor: "text-red-500",
            icon: <PiXCircleLight size={24} />,
        },
    ];

    const [dropdownOpen, setDropdownOpen] = useState(null);
    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                {/* HEADER & SEARCH */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-base sm:text-2xl font-semibold">
                        Manajemen Pesanan
                    </p>
                    <div className="flex items-center gap-2 w-full sm:max-w-sm">
                        <div className="relative w-full">
                            <FiSearch
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type="text"
                                placeholder="Cari produk"
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl border border-neutral-400 text-neutral-400 hover:bg-gray-100 transition">
                            <GrFilter size={20} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-600/90 transition text-white">
                            <HiOutlinePrinter size={20} />
                        </button>
                    </div>
                </div>

                {/* KARTU STATISTIK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {dataCard.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-5 flex items-center gap-4"
                        >
                            <div
                                className={`p-3 rounded-xl ${item.iconBg} ${item.iconColor}`}
                            >
                                {item.icon}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm text-neutral-500">
                                    {item.title}
                                </p>
                                <p className="text-xl font-medium">
                                    {item.count}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TABEL PRODUK */}
                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-medium">Daftar Pesanan</p>
                    </div>
                    <div className="max-w-full overflow-x-auto ">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="min-w-[25px] px-4 py-4 xl:pl-11 " />
                                    <th className="min-w-[280px] px-4 py-4 ">
                                        Nama pemesan
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Nomor HP
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Alamat
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Provinsi
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Kota
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Kode Pos
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Nominal
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Status
                                    </th>
                                    <th className="px-4 py-4 ">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 text-sm text-neutral-700"
                                    >
                                        <td className="px-4 py-5 pl-9 xl:pl-11">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.namaPemesan}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.nomorHp}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.alamat}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.provinsi}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.kota}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.kodePos}
                                        </td>
                                        <td className="px-4 py-5">
                                            {formatRupiah(item.nominal)}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.status}
                                        </td>
                                        <td className="px-4 py-5">
                                            <button
                                                onClick={() =>
                                                    toggleDropdown(index)
                                                }
                                                className="rounded-full border border-primary-600 text-primary-600 flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-primary"
                                            >
                                                Aksi <FaChevronDown size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
