import { FiSearch } from "react-icons/fi";
import { GrFilter } from "react-icons/gr";
import { HiOutlinePrinter } from "react-icons/hi2";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { formatRupiah } from "@/Utils/utils";
import {
    PiCurrencyCircleDollarLight,
    PiShoppingCartLight,
    PiCubeLight,
} from "react-icons/pi";
import moment from "moment";
import ModalTambahVariantStock from "@/Components/Modal/VarianStock/ModalTambahVariantStock";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import ModalEditVariantStock from "@/Components/Modal/VarianStock/ModalEditVariantStock";

export default function Item({ data }) {
    console.log(data);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [variantStock, setVariantStock] = useState();
    const dataCard = [
        {
            title: "Stok Masuk",
            count: 100,
            iconBg: "bg-success-100",
            iconColor: "text-success-500",
            icon: <PiCubeLight size={24} />,
        },
        {
            title: "Stok Terjual",
            count: 2,
            iconBg: "bg-info-100",
            iconColor: "text-info-500",
            icon: <PiCubeLight size={24} />,
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
                        Barang Masuk
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-medium">
                            Laporan Barang Masuk
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex gap-1 items-center bg-primary-600 hover:bg-primary-600/90 text-neutral-50 text-sm px-5 py-2 rounded-full"
                        >
                            <FaPlus />
                            Tambah Barang
                        </button>
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
                                        Jumlah
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Tanggal
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Keterangan
                                    </th>
                                    <th className="px-4 py-4 ">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.variant_stocks?.data?.map(
                                    (item, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 text-sm text-neutral-700"
                                        >
                                            <td className="px-4 py-5 pl-9 xl:pl-11">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-5">
                                                <p>
                                                    {item.variant.product.name}
                                                </p>
                                                <p className="text-neutral-500 text-xs mt-0.5">
                                                    {item.variant.name}
                                                </p>
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.quantity}
                                            </td>{" "}
                                            <td className="px-4 py-5">
                                                {moment(item.created_at).format(
                                                    "DD/MM/YYYY, HH:mm"
                                                )}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.note}
                                            </td>
                                            <td className="px-4 py-5">
                                                <button
                                                    onClick={() => {
                                                        setVariantStock(item);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="rounded-full border border-primary-600 text-primary-600 flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-primary"
                                                >
                                                    <MdOutlineRemoveRedEye
                                                        size={18}
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    {showAddModal && (
                        <div
                            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                                showAddModal
                                    ? "animate-fadeIn"
                                    : "animate-fadeOut"
                            }`}
                        >
                            <div className="bg-white p-6 rounded shadow-lg">
                                <ModalTambahVariantStock
                                    isOpen={showAddModal}
                                    onClose={() => {
                                        setShowAddModal(!showAddModal);
                                    }}
                                />
                            </div>
                        </div>
                    )}{" "}
                    {showEditModal && (
                        <div
                            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                                showEditModal
                                    ? "animate-fadeIn"
                                    : "animate-fadeOut"
                            }`}
                        >
                            <div className="bg-white p-6 rounded shadow-lg">
                                <ModalEditVariantStock
                                    isOpen={showEditModal}
                                    onClose={() => {
                                        setShowEditModal(!showEditModal);
                                    }}
                                    item={variantStock}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
}
