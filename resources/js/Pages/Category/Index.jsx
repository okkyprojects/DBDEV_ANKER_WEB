import { FiSearch } from "react-icons/fi";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { useState, useEffect, useRef } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import PaginationDashboard from "@/Components/Pagination/PaginationDashboard";
import { FaPlus, FaTrash } from "react-icons/fa6";
import ModalTambahKategori from "@/Components/Modal/Category/ModalTambahKategori";
import ModalEditKategori from "@/Components/Modal/Category/ModalEditKategori";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

export default function Index({ data }) {
    const debounceRef = useRef(null);
    const searchParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [category, setCategory] = useState();

    // state untuk bulk delete
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        const currentParams = new URLSearchParams(window.location.search);
        const page = currentParams.get("page") || 1;

        debounceRef.current = setTimeout(() => {
            router.get(
                route(route().current()),
                { search, page },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        }, 500);
    }, [search]);

    // toggle pilih 1
    const handleSelect = (uuid) => {
        setSelected((prev) =>
            prev.includes(uuid)
                ? prev.filter((id) => id !== uuid)
                : [...prev, uuid]
        );
    };

    // toggle semua
    const handleSelectAll = () => {
        if (selectAll) {
            setSelected([]);
        } else {
            setSelected(data?.categories?.data?.map((item) => item.uuid) || []);
        }
        setSelectAll(!selectAll);
    };

    // bulk delete
    const handleBulkDelete = () => {
        if (selected.length === 0) return;

        if (!confirm("Yakin hapus kategori terpilih?")) return;

        router.delete(route("master.category.bulk_destroy"), {
            data: { uuids: selected },
            preserveScroll: true,
            onSuccess: () => {
                setSelected([]);
                setSelectAll(false);
                toast.success("Berhasil menghapus kategori!");
            },
        });
    };

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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kategori"
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-medium">Daftar Kategori</p>
                        <div className="flex gap-2">
                            {selected.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="flex gap-1 items-center bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-full"
                                >
                                    <FaTrash />
                                    Hapus Terpilih ({selected.length})
                                </button>
                            )}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex gap-1 items-center bg-primary-600 hover:bg-primary-600/90 text-neutral-50 text-sm px-5 py-2 rounded-full"
                            >
                                <FaPlus />
                                Tambah Kategori
                            </button>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto ">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                            className="accent-primary-600"
                                        />
                                    </th>
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
                                        <td className="px-4 py-5">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(
                                                    item.uuid
                                                )}
                                                onChange={() =>
                                                    handleSelect(item.uuid)
                                                }
                                                className="accent-primary-600"
                                            />
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.status == 1
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
                                                className="rounded-full border border-primary-600 text-primary-600 flex items-center gap-1.5 px-3 py-1 text-sm font-medium"
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

                {/* Modal Tambah */}
                {showAddModal && (
                    <div
                        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                            showAddModal ? "animate-fadeIn" : "animate-fadeOut"
                        }`}
                    >
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalTambahKategori
                                isOpen={showAddModal}
                                onClose={() => setShowAddModal(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Modal Edit */}
                {showEditModal && (
                    <div
                        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                            showEditModal ? "animate-fadeIn" : "animate-fadeOut"
                        }`}
                    >
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalEditKategori
                                isOpen={showEditModal}
                                onClose={() => setShowEditModal(false)}
                                kategori={category}
                            />
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}
