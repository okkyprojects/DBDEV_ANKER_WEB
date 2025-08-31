import { FiSearch } from "react-icons/fi";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { useState, useRef, useEffect } from "react";
import PaginationDashboard from "@/Components/Pagination/PaginationDashboard";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { router } from "@inertiajs/react";
import ModalTambahUser from "@/Components/Modal/User/ModalTambahUser";
import ModalEditUser from "@/Components/Modal/User/ModalEditUser";

export default function Index({ data }) {
    const debounceRef = useRef(null);
    const searchParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [user, setUser] = useState();

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

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                {/* HEADER & SEARCH */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-base sm:text-2xl font-semibold">User</p>
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
                                placeholder="Cari user..."
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-medium">Daftar User</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex gap-1 items-center bg-primary-600 hover:bg-primary-600/90 text-neutral-50 text-sm px-5 py-2 rounded-full"
                        >
                            <FaPlus />
                            Tambah User
                        </button>
                    </div>
                    <div className="max-w-full overflow-x-auto ">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="min-w-[25px] px-4 py-4 xl:pl-11" />
                                    <th className="min-w-[120px] px-4 py-4">
                                        Foto
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4">
                                        Nama
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4">
                                        Email
                                    </th>
                                    <th className="min-w-[150px] px-4 py-4">
                                        Telepon
                                    </th>
                                    <th className="min-w-[120px] px-4 py-4">
                                        Gender
                                    </th>
                                    <th className="px-4 py-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.users?.data?.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 text-sm text-neutral-700"
                                    >
                                        <td className="px-4 py-5 pl-9 xl:pl-11">
                                            {data?.users?.from + index}
                                        </td>
                                        <td className="px-4 py-5">
                                            <img
                                                src={
                                                    item?.img
                                                        ? `${window.location.origin}/${item.img}`
                                                        : `/images/profile/profil.jpg`
                                                }
                                                alt={
                                                    item?.name ||
                                                    "Default Profil"
                                                }
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.email}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.phone_number || "-"}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.gender === "L"
                                                ? "Laki-laki"
                                                : item.gender === "P"
                                                ? "Perempuan"
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-5">
                                            <button
                                                onClick={() => {
                                                    setUser(item);
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
                            links={data?.users?.links}
                            meta={data?.users}
                        />
                    </div>
                </div>

                {/* MODAL TAMBAH */}
                {showAddModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalTambahUser
                                isOpen={showAddModal}
                                onClose={() => setShowAddModal(!showAddModal)}
                            />
                        </div>
                    </div>
                )}

                {/* MODAL EDIT */}
                {showEditModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalEditUser
                                isOpen={showEditModal}
                                onClose={() => setShowEditModal(!showEditModal)}
                                user={user}
                            />
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}
