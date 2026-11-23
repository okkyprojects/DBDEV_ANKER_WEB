import { FiSearch } from "react-icons/fi";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { PiBellLight } from "react-icons/pi";
import PaginationDashboard from "@/Components/Pagination/PaginationDashboard";
import { FaPlus } from "react-icons/fa6";
import ModalTambahPromo from "@/Components/Modal/Promo/ModalTambahPromo";
import ModalEditPromo from "@/Components/Modal/Promo/ModalEditPromo";
import { Head, router, usePage } from "@inertiajs/react";
import { useRef } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { formatRupiah } from "@/Utils/utils";

const promoStatus = (item) => {
    if (!item.is_active) {
        return { label: "Nonaktif", className: "bg-gray-400 text-white" };
    }
    if (item.used_quota >= item.quota) {
        return { label: "Kuota Habis", className: "bg-red-100 text-red-700" };
    }
    if (item.end_at && moment(item.end_at).isBefore(moment())) {
        return { label: "Berakhir", className: "bg-red-100 text-red-700" };
    }
    if (item.start_at && moment(item.start_at).isAfter(moment())) {
        return {
            label: "Terjadwal",
            className: "bg-yellow-100 text-yellow-700",
        };
    }
    return { label: "Aktif", className: "bg-primary-200 text-primary-800" };
};

export default function Index({ data }) {
    const { permissions } = usePage().props;
    const debounceRef = useRef(null);
    const searchParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [promo, setPromo] = useState();
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

    const handleNotify = (item) => {
        if (
            confirm(`Kirim notifikasi promo "${item.name}" ke semua user?`)
        ) {
            router.post(
                route("promosi.promo.notify", item.uuid),
                {},
                {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const result = page.props.data?.result;
                        toast.success(
                            `Notifikasi terkirim ke ${result?.success ?? 0} dari ${result?.total ?? 0} perangkat`
                        );
                    },
                    onError: (errors) => {
                        toast.error(
                            Object.values(errors)[0] ||
                                "Gagal mengirim notifikasi."
                        );
                    },
                }
            );
        }
    };

    return (
        <DefaultLayout>
            <Head title="Promo" />
            <div className="flex flex-col gap-5">
                {/* HEADER & SEARCH */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-base sm:text-2xl font-semibold">
                        Promo
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
                                placeholder="Cari promo"
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-medium">Daftar Promo</p>
                        {permissions.includes("promo-add") && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex gap-1 items-center bg-primary-600 hover:bg-primary-600/90 text-neutral-50 text-sm px-5 py-2 rounded-full"
                            >
                                <FaPlus />
                                Tambah Promo
                            </button>
                        )}
                    </div>
                    <div className="max-w-full overflow-x-auto ">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="min-w-[25px] px-4 py-4 xl:pl-11" />
                                    <th className="min-w-[180px] px-4 py-4">
                                        Nama Promo
                                    </th>
                                    <th className="min-w-[220px] px-4 py-4">
                                        Syarat Pembelian
                                    </th>
                                    <th className="min-w-[220px] px-4 py-4">
                                        Barang Gratis
                                    </th>
                                    <th className="min-w-[120px] px-4 py-4">
                                        Kuota
                                    </th>
                                    <th className="min-w-[180px] px-4 py-4">
                                        Periode
                                    </th>
                                    <th className="min-w-[120px] px-4 py-4">
                                        Status
                                    </th>
                                    <th className="px-4 py-4">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data?.promos?.data?.map((item, index) => {
                                    const status = promoStatus(item);
                                    return (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 text-sm text-neutral-700"
                                        >
                                            <td className="px-4 py-5 pl-9 xl:pl-11">
                                                {data?.promos?.from + index}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.name}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.type === "value"
                                                    ? `Belanja ${formatRupiah(
                                                          item.min_purchase
                                                      )}`
                                                    : `Beli ${item.min_purchase} pcs`}
                                                <div className="text-xs text-neutral-500">
                                                    {item.product?.name ?? "-"}
                                                </div>
                                            </td>
                                            <td className="px-4 py-5">
                                                {`Gratis ${item.free_quantity} pcs`}
                                                <div className="text-xs text-neutral-500">
                                                    {item.free_variant
                                                        ? `${item.free_variant?.product?.name} - ${item.free_variant?.name}`
                                                        : "-"}
                                                </div>
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.used_quota} /{" "}
                                                {item.quota}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.start_at
                                                    ? moment(
                                                          item.start_at
                                                      ).format(
                                                          "D/MM/YYYY, HH.mm"
                                                      )
                                                    : "-"}
                                                {" s/d "}
                                                {item.end_at
                                                    ? moment(
                                                          item.end_at
                                                      ).format(
                                                          "D/MM/YYYY, HH.mm"
                                                      )
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-5">
                                                <span
                                                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${status.className}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-5">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setPromo(item);
                                                            setShowEditModal(
                                                                true
                                                            );
                                                        }}
                                                        className="rounded-full border border-primary-600 text-primary-600 flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-primary"
                                                    >
                                                        <MdOutlineRemoveRedEye
                                                            size={18}
                                                        />
                                                    </button>
                                                    {permissions.includes(
                                                        "notification-add"
                                                    ) && (
                                                        <button
                                                            onClick={() =>
                                                                handleNotify(
                                                                    item
                                                                )
                                                            }
                                                            title="Kirim notifikasi promo"
                                                            className="rounded-full border border-primary-600 text-primary-600 flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-primary"
                                                        >
                                                            <PiBellLight
                                                                size={18}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <PaginationDashboard
                            links={data?.promos?.links}
                            meta={data?.promos}
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
                            <ModalTambahPromo
                                isOpen={showAddModal}
                                onClose={() => {
                                    setShowAddModal(!showAddModal);
                                }}
                                products={data?.products}
                                variants={data?.variants}
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
                            <ModalEditPromo
                                isOpen={showEditModal}
                                onClose={() => {
                                    setShowEditModal(!showEditModal);
                                }}
                                promo={promo}
                                products={data?.products}
                                variants={data?.variants}
                            />
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}
