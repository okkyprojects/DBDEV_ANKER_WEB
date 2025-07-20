import { FiSearch } from "react-icons/fi";
import { GrFilter } from "react-icons/gr";
import { HiOutlinePrinter } from "react-icons/hi2";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import PaginationDashboard from "@/Components/Pagination/PaginationDashboard";
import { FaPlus } from "react-icons/fa6";
import ModalTambahKategori from "@/Components/Modal/Category/ModalTambahKategori";
import ModalEditKategori from "@/Components/Modal/Category/ModalEditKategori";

export default function Index({ data }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [category, setCategory] = useState();
    console.log(data);
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                {/* HEADER & SEARCH */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-base sm:text-2xl font-semibold">
                        Kategori
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
                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-medium">Daftar Kategori</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex gap-1 items-center bg-primary-600 hover:bg-primary-600/90 text-neutral-50 text-sm px-5 py-2 rounded-full"
                        >
                            <FaPlus />
                            Tambah Kategori
                        </button>
                    </div>
                    <div className="max-w-full overflow-x-auto ">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="min-w-[25px] px-4 py-4 xl:pl-11" />
                                    <th className="min-w-[200px] px-4 py-4">
                                        Nama
                                    </th>
                                    <th className="min-w-[150px] px-4 py-4">
                                        Status
                                    </th>
                                    <th className="min-w-[150px] px-4 py-4">
                                        Gambar
                                    </th>
                                    <th className="px-4 py-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.categories?.data?.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 text-sm text-neutral-700"
                                    >
                                        <td className="px-4 py-5 pl-9 xl:pl-11">
                                            {data?.categories?.from + index}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.status
                                                ? "Aktif"
                                                : "Tidak Aktif"}
                                        </td>
                                        <td className="px-4 py-5">
                                            <img
                                                src={`${window.location.origin}/${item.img}`}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        </td>
                                        <td className="px-4 py-5">
                                            <button
                                                onClick={() => {
                                                    setCategory(item);
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
                            links={data?.categories?.links}
                            meta={data?.categories}
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
                            <ModalTambahKategori
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
                            <ModalEditKategori
                                isOpen={showEditModal}
                                onClose={() => {
                                    setShowEditModal(!showEditModal);
                                }}
                                kategori={category}
                            />
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}
