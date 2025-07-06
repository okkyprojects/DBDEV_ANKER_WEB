import { FiSearch } from "react-icons/fi";
import { GrFilter } from "react-icons/gr";
import { HiOutlinePrinter } from "react-icons/hi2";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { PiCubeLight } from "react-icons/pi";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import ModalFilter from "@/Components/Modal/Stok/ManajemenStok/ModalFilter";

export default function StokPage() {
    const [showModalFilter, setShowModalFilter] = useState(false);
    const data = [
        {
            nama: "Sabun Cuci Piring Lemon 500ml",
            kategori: "Kebutuhan Rumah Tangga",
            brand: "Anker",
            jumlahVarian: 2,
            stok: 12,
            status: "Active",
            keyProduk: "P001",
        },
        {
            nama: "Minyak Goreng 1L",
            kategori: "Sembako",
            brand: "Anker",
            jumlahVarian: 1,
            stok: 3,
            status: "Inactive",
            keyProduk: "P002",
        },
        {
            nama: "Gula Pasir 1kg",
            kategori: "Sembako",
            brand: "Anker",
            jumlahVarian: 1,
            stok: 0,
            status: "Rejected",
            keyProduk: "P003",
        },
        {
            nama: "Susu Kental Manis",
            kategori: "Minuman",
            brand: "Anker",
            jumlahVarian: 3,
            stok: 50,
            status: "Inreview",
            keyProduk: "P004",
        },
    ];

    const dataCard = [
        {
            title: "Produk Aktif",
            count: 100,
            iconBg: "bg-green-100",
            iconColor: "text-green-500",
        },
        {
            title: "Produk Stok Menipis",
            count: 2,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-500",
        },
        {
            title: "Produk Stok Habis",
            count: 5,
            iconBg: "bg-red-100",
            iconColor: "text-red-500",
        },
    ];

    const [dropdownOpen, setDropdownOpen] = useState(null);
    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-base sm:text-2xl font-semibold">
                        Manajemen Stok
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
                        <button
                            onClick={() => {
                                setShowModalFilter(!showModalFilter);
                            }}
                            className="p-2.5 rounded-xl border border-neutral-400 text-neutral-400 hover:bg-gray-100 transition"
                        >
                            <GrFilter size={20} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-600/90 transition text-white">
                            <HiOutlinePrinter size={20} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {dataCard.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-5 flex items-center gap-4"
                        >
                            <div
                                className={`p-3 rounded-xl ${item.iconBg} ${item.iconColor}`}
                            >
                                <PiCubeLight size={24} />
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
                        <p className="text-lg font-medium">Daftar Produk</p>
                        <Link
                            href="/stok/manajemen-stok/create"
                            className="flex gap-1 items-center bg-primary-600 hover:bg-primary-600/90 text-neutral-50 text-sm px-5 py-2 rounded-full"
                        >
                            <FaPlus />
                            Tambah Produk
                        </Link>
                    </div>
                    <div className="max-w-full overflow-x-auto ">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="min-w-[25px] px-4 py-4 xl:pl-11 " />
                                    <th className="min-w-[280px] px-4 py-4 ">
                                        Produk
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Kategori
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Brand
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Jumlah Varian
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Stok
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
                                        <td className=" px-4 py-5 pl-9 xl:pl-11">
                                            {index + 1}
                                        </td>
                                        <td className=" px-4 py-5">
                                            {item.nama}
                                        </td>
                                        <td className=" px-4 py-5">
                                            {item.kategori}
                                        </td>
                                        <td className=" px-4 py-5">
                                            {item.brand}
                                        </td>
                                        <td className=" px-4 py-5">
                                            {item.jumlahVarian}
                                        </td>
                                        <td className=" px-4 py-5">
                                            {item.stok}
                                        </td>
                                        <td className=" px-4 py-5">
                                            <span
                                                className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                                                    item.status === "Active"
                                                        ? "bg-green-300 text-green-600"
                                                        : item.status ===
                                                          "Inactive"
                                                        ? "bg-yellow-300 text-yellow-600"
                                                        : item.status ===
                                                          "Rejected"
                                                        ? "bg-red-300 text-red-600"
                                                        : item.status ===
                                                          "Inreview"
                                                        ? "bg-blue-300 text-blue-600"
                                                        : ""
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className=" px-4 py-5">
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
                </div>
            </div>
        </DefaultLayout>
    );
}
