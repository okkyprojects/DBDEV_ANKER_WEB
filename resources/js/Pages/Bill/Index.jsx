import { FiSearch } from "react-icons/fi";
import { GrFilter } from "react-icons/gr";
import { HiOutlinePrinter } from "react-icons/hi2";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import PaginationDashboard from "@/Components/Pagination/PaginationDashboard";
import { FaPlus } from "react-icons/fa6";
import ModalTambahBill from "@/Components/Modal/Bill/ModalTambahBill";
import ModalEditBill from "@/Components/Modal/Bill/ModalEditBill";
import { router, usePage } from "@inertiajs/react";
import { useRef } from "react";
import { useEffect } from "react";

export default function Index({ data }) {
    const debounceRef = useRef(null);
    const searchParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [bill, setBill] = useState();
    useEffect(() => {
        clearTimeout(debounceRef.current);
        const currentParams = new URLSearchParams(window.location.search);
        const page = currentParams.get("page") || 1;

        debounceRef.current = setTimeout(() => {
            router.get(
                route(route().current()),
                { search,page },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        }, 500);
    }, [search]);
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                {/* HEADER & SEARCH */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-base sm:text-2xl font-semibold">
                        Rekening
                    </p>
                    <div className="flex items-center gap-2 w-full sm:max-w-sm">
                        <div className="relative w-full">
                            <FiSearch
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari produk"
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                            />
                        </div>
                        {/* <button className="p-2.5 rounded-xl border border-neutral-400 text-neutral-400 hover:bg-gray-100 transition">
                            <GrFilter size={20} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-600/90 transition text-white">
                            <HiOutlinePrinter size={20} />
                        </button> */}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-medium">Daftar Rekening</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex gap-1 items-center bg-primary-600 hover:bg-primary-600/90 text-neutral-50 text-sm px-5 py-2 rounded-full"
                        >
                            <FaPlus />
                            Tambah Rekening
                        </button>
                    </div>
                    <div className="max-w-full overflow-x-auto ">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="min-w-[25px] px-4 py-4 xl:pl-11" />
                                    <th className="min-w-[200px] px-4 py-4">
                                        Nama Pemilik Rekening
                                    </th>
                                    <th className="min-w-[150px] px-4 py-4">
                                        Nama Bank
                                    </th>
                                    <th className="min-w-[150px] px-4 py-4">
                                        Nomor Rekening
                                    </th>
                                    <th className="min-w-[150px] px-4 py-4">
                                        Status
                                    </th>
                                    <th className="px-4 py-4">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data?.bills?.data?.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 text-sm text-neutral-700"
                                    >
                                        <td className="px-4 py-5 pl-9 xl:pl-11">
                                            {data?.bills?.from + index}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.account_holder_name}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.bank_name}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.account_number}
                                        </td>
                                        <td className="px-4 py-5">
                                            <span
                                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
        ${
            item.is_main
                ? "bg-primary-200 text-primary-800"
                : "bg-gray-400 text-white"
        }`}
                                            >
                                                {item.is_main
                                                    ? "Utama"
                                                    : "Biasa"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <button
                                                onClick={() => {
                                                    setBill(item);
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
                                ))}
                            </tbody>
                        </table>

                        <PaginationDashboard
                            links={data?.bills?.links}
                            meta={data?.bills}
                        />
                    </div>
                </div>
                {showAddModal && (
                    <div
                        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                            showAddModal ? "animate-fadeIn" : "animate-fadeOut"
                        }`}
                    >
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalTambahBill
                                isOpen={showAddModal}
                                onClose={() => {
                                    setShowAddModal(!showAddModal);
                                }}
                            />
                        </div>
                    </div>
                )}
                {showEditModal && (
                    <div
                        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                            showEditModal ? "animate-fadeIn" : "animate-fadeOut"
                        }`}
                    >
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalEditBill
                                isOpen={showEditModal}
                                onClose={() => {
                                    setShowEditModal(!showEditModal);
                                }}
                                bill={bill}
                            />
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}
