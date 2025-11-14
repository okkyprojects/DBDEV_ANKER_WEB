import { FiSearch } from "react-icons/fi";
import { GrFilter } from "react-icons/gr";
import { HiOutlinePrinter } from "react-icons/hi2";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { PiCubeLight, PiGearLight } from "react-icons/pi";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import {
    PiCheckCircleLight,
    PiClockLight,
    PiTruckLight,
    PiXCircleLight,
} from "react-icons/pi";
import { formatRupiah } from "@/Utils/utils";
import PaginationDashboard from "@/Components/Pagination/PaginationDashboard";
import ModalDetailPesanan from "@/Components/Modal/Pesanan/ModalDetailPesanan";
import ModalDeletePesanan from "@/Components/Modal/Pesanan/ModalDeletePesanan";
import ModalFilter from "@/Components/Modal/Pesanan/ModalFilter";
import { router } from "@inertiajs/react";
import { statusBadge } from "@/Config/const";
import moment from "moment";
import ModalUpdatePesanan from "@/Components/Modal/Pesanan/ModalUpdatePesanan";
import { PiMoneyLight, PiWarningLight } from "react-icons/pi";
import { HiOutlineUpload } from "react-icons/hi";
import ModalImport from "@/Components/Modal/Pesanan/ModalImport";
import { toast } from "react-toastify";
import ModalBatalPesanan from "@/Components/Modal/Pesanan/ModalBatalPesanan";
import ModalUpdateResi from "@/Components/Modal/Pesanan/ModalUpdateResi";

export default function ManajemenPesanan({ data }) {
    console.log(data);
    const debounceRef = useRef(null);
    const searchParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [showModalImport, setShowModalImport] = useState(false);
    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };
    const dropdownRef = useRef(null);
    const [pesanan, setPesanan] = useState();
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showUpdateResiModal, setShowUpdateResiModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [aksi, setAksi] = useState();
    const [showEditModal, setShowEditModal] = useState(false);
    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setDropdownOpen(null);
        }
    };

    useEffect(() => {
        if (dropdownOpen !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);
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
    const dataCard = [
        {
            title: "Belum Dibayar",
            count: data?.summary?.pesanan_belum_dibayar ?? 0,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-500",
            icon: <PiClockLight size={24} />,
        },
        {
            title: "Menunggu Konfirmasi",
            count: data?.summary?.pesanan_konfirmasi_pembayaran ?? 0,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-500",
            icon: <PiWarningLight size={24} />,
        },
        {
            title: "Pesanan Diproses",
            count: data?.summary?.pesanan_diproses ?? 0,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-500",
            icon: <PiGearLight size={24} />,
        },
        {
            title: "Pesanan Dikirim",
            count: data?.summary?.pesanan_dikirim ?? 0,
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-500",
            icon: <PiTruckLight size={24} />,
        },
        {
            title: "Pesanan Selesai",
            count: data?.summary?.pesanan_selesai ?? 0,
            iconBg: "bg-green-100",
            iconColor: "text-green-500",
            icon: <PiCheckCircleLight size={24} />,
        },
        {
            title: "Cancel",
            count: data?.summary?.pesanan_dibatalkan ?? 0,
            iconBg: "bg-red-100",
            iconColor: "text-red-500",
            icon: <PiXCircleLight size={24} />,
        },
    ];

    const handleApplyFilter = (filters) => {
        const params = {
            search,
            ...filters,
        };

        router.get(route(route().current()), params, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari pesanan"
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={() => setShowModalFilter(true)}
                            className="p-2.5 rounded-xl border border-neutral-400 text-neutral-400 hover:bg-gray-100 transition"
                        >
                            <GrFilter size={20} />
                        </button>
                        {/* <button onClick={()=> {
                    setShowModalImport(!showModalImport);
                    }}
                    className="p-2.5 rounded-xl bg-info-600 hover:bg-info-600/90 transition text-white cursor-pointer"
                    >
                    <HiOutlineUpload size={20} />
                </button> */}
                        <a
                            href={route("pesanan.manajemen.export", {
                                search: searchParams.get("search") || "",
                                brand: searchParams.get("brand") || "",
                                category: searchParams.get("category") || "",
                                status: searchParams.get("status") || "",
                                startDate: searchParams.get("startDate") || "",
                                endDate: searchParams.get("endDate") || "",
                            })}
                            className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-600/90 transition text-white"
                        >
                            <HiOutlinePrinter size={20} />
                        </a>
                    </div>
                </div>
                {/* KARTU STATISTIK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {dataCard.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl py-3 px-3 flex items-center gap-4"
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
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Kode Pesanan
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Tanggal
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Nama pemesan
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Email pemesan
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Nomor HP
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Nominal
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Bukti Pembayaran
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        No Resi
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Status
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Keterangan Batal
                                    </th>
                                    <th className="px-4 py-4 ">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.transactions?.data?.map(
                                    (item, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 text-sm text-neutral-700"
                                        >
                                            <td className="px-4 py-5 pl-9 xl:pl-11">
                                                {data?.transactions?.from +
                                                    index}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item?.transaction_code}
                                            </td>{" "}
                                            <td className="px-4 py-5">
                                                {moment(
                                                    item?.created_at
                                                ).format("DD/MM/YYYY, HH:mm")}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item?.user?.name}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item?.user?.email}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item?.user?.phone_number}
                                            </td>
                                            <td className="px-4 py-5">
                                                {formatRupiah(
                                                    item?.total_price
                                                )}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item?.file ? (
                                                    <button
                                                        onClick={() => {
                                                            window.open(
                                                                `${window.location.origin}/${item.file}`,
                                                                "_blank"
                                                            );
                                                        }}
                                                        className="inline-flex text-center rounded-lg bg-opacity-10 px-3 py-2 text-xs font-medium bg-primary-500 text-primary-700"
                                                    >
                                                        Lihat Bukti Pembayaran
                                                    </button>
                                                ) : (
                                                    <p className="italic text-gray-400 text-xs">
                                                        Belum Ada Bukti
                                                        Pembayaran
                                                    </p>
                                                )}
                                            </td>{" "}
                                            <td className="px-4 py-5">
                                                {item?.resi ? (
                                                    <span>{item.resi}</span>
                                                ) : (
                                                    <p className="italic text-gray-400 text-xs">
                                                        Belum Ada No Resi
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-5">
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                        statusBadge[item.status]
                                                            ?.className
                                                    }`}
                                                >
                                                    {typeof statusBadge[
                                                        item.status
                                                    ]?.label === "function"
                                                        ? statusBadge[
                                                              item.status
                                                          ].label(item)
                                                        : statusBadge[
                                                              item.status
                                                          ]?.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-5">
                                                {item?.note_transaction ? (
                                                    item.note_transaction
                                                ) : (
                                                    <p className="italic text-gray-400 text-xs">
                                                        Tidak Ada Keterangan
                                                        Batal
                                                    </p>
                                                )}
                                            </td>
                                            <td className="relative px-4 py-5">
                                                <button
                                                    onClick={() =>
                                                        toggleDropdown(index)
                                                    }
                                                    className="rounded-full border border-primary-600 text-primary-600 flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-primary"
                                                >
                                                    Aksi{" "}
                                                    <FaChevronDown size={14} />
                                                </button>
                                            </td>
                                            {dropdownOpen === index && (
                                                <div
                                                    ref={dropdownRef}
                                                    className={`absolute right-10 z-10 mt-14 w-40 rounded-md bg-white
                                shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out
                                lg:right-18 ${
                                    dropdownOpen === index
                                        ? "opacity-100"
                                        : "pointer-events-none opacity-0"
                                }`}
                                                >
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => {
                                                                setPesanan(
                                                                    item
                                                                );
                                                                setShowDetailModal(
                                                                    true
                                                                );
                                                            }}
                                                            className="text-gray-700 flex w-full items-center justify-start text-left px-4 py-2 text-sm hover:bg-slate-100 hover:bg-opacity-30"
                                                        >
                                                            Detail Pesanan
                                                        </button>

                                                        {item.status == 1 && (
                                                            <button
                                                                onClick={() => {
                                                                    setPesanan(
                                                                        item
                                                                    );
                                                                    setAksi(2);
                                                                    setShowUpdateModal(
                                                                        true
                                                                    );
                                                                }}
                                                                className="text-gray-700 flex w-full items-center justify-start text-left px-4 py-2 text-sm hover:bg-slate-100 hover:bg-opacity-30"
                                                            >
                                                                Konfirmasi
                                                                Pembayaran
                                                            </button>
                                                        )}
                                                        {item.status == 2 && (
                                                            <button
                                                                onClick={() => {
                                                                    setPesanan(
                                                                        item
                                                                    );
                                                                    setAksi(3);
                                                                    setShowUpdateModal(
                                                                        true
                                                                    );
                                                                }}
                                                                className="text-gray-700 flex w-full items-center justify-start text-left px-4 py-2 text-sm hover:bg-slate-100 hover:bg-opacity-30"
                                                            >
                                                                Konfirmasi
                                                                Pesanan Dikirim
                                                            </button>
                                                        )}
                                                        {item.status == 3 && (
                                                            <button
                                                                onClick={() => {
                                                                    setPesanan(
                                                                        item
                                                                    );
                                                                    setAksi(4);
                                                                    setShowUpdateModal(
                                                                        true
                                                                    );
                                                                }}
                                                                className="text-gray-700 flex w-full items-center justify-start text-left px-4 py-2 text-sm hover:bg-slate-100 hover:bg-opacity-30"
                                                            >
                                                                Konfirmasi
                                                                Pesanan Selesai
                                                            </button>
                                                        )}
                                                        {item.status != 5 &&
                                                            item.status !=
                                                                4 && (
                                                                <button
                                                                    onClick={() => {
                                                                        setPesanan(
                                                                            item
                                                                        );
                                                                        setAksi(
                                                                            5
                                                                        );
                                                                        setShowCancelModal(
                                                                            true
                                                                        );
                                                                    }}
                                                                    className="text-gray-700 flex w-full items-center justify-start text-left px-4 py-2 text-sm hover:bg-slate-100 hover:bg-opacity-30"
                                                                >
                                                                    Batalkan
                                                                    Pesanan
                                                                </button>
                                                            )}
                                                        {item?.resi &&
                                                            item?.status !=
                                                                4 && (
                                                                <button
                                                                    onClick={() => {
                                                                        setPesanan(
                                                                            item
                                                                        );
                                                                        setAksi(
                                                                            4
                                                                        );
                                                                        setShowUpdateResiModal(
                                                                            true
                                                                        );
                                                                    }}
                                                                    className="text-gray-700 flex w-full items-center justify-start text-left px-4 py-2 text-sm hover:bg-slate-100 hover:bg-opacity-30"
                                                                >
                                                                    Update No
                                                                    Resi
                                                                </button>
                                                            )}

                                                        {/* <button onClick={()=> {
                                        setPesanan(
                                        item
                                        );
                                        setShowDeleteModal(
                                        true
                                        );
                                        }}
                                        className="text-error-700 flex w-full items-center justify-start px-4 py-2 text-sm hover:bg-slate-100 hover:bg-opacity-30"
                                        >
                                        Hapus Pesanan
                                    </button> */}
                                                    </div>
                                                </div>
                                            )}
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>{" "}
                    </div>{" "}
                    <PaginationDashboard
                        links={data?.transactions?.links}
                        meta={data?.transactions}
                    />
                </div>{" "}
                {showDetailModal && (
                    <div
                        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                            showDetailModal
                                ? "animate-fadeIn"
                                : "animate-fadeOut"
                        }`}
                    >
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalDetailPesanan
                                isOpen={showDetailModal}
                                onClose={() => {
                                    setShowDetailModal(!showDetailModal);
                                }}
                                item={pesanan}
                            />
                        </div>
                    </div>
                )}
                {showUpdateModal && (
                    <div
                        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                            showUpdateModal
                                ? "animate-fadeIn"
                                : "animate-fadeOut"
                        }`}
                    >
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalUpdatePesanan
                                isOpen={showUpdateModal}
                                onClose={() => {
                                    setShowUpdateModal(!showUpdateModal);
                                }}
                                item={pesanan}
                                aksi={aksi}
                            />
                        </div>
                    </div>
                )}
                {showUpdateResiModal && (
                    <div
                        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                            showUpdateResiModal
                                ? "animate-fadeIn"
                                : "animate-fadeOut"
                        }`}
                    >
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalUpdateResi
                                isOpen={showUpdateResiModal}
                                onClose={() => {
                                    setShowUpdateResiModal(
                                        !showUpdateResiModal
                                    );
                                }}
                                item={pesanan}
                                aksi={aksi}
                            />
                        </div>
                    </div>
                )}
                {showDeleteModal && (
                    <div
                        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                            showDeleteModal
                                ? "animate-fadeIn"
                                : "animate-fadeOut"
                        }`}
                    >
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalDeletePesanan
                                isOpen={showDeleteModal}
                                onClose={() => {
                                    setShowDeleteModal(!showDeleteModal);
                                }}
                                item={pesanan}
                            />
                        </div>
                    </div>
                )}
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
                                data={data}
                                onApplyFilter={handleApplyFilter}
                            />
                        </div>
                    </div>
                )}
                {showModalImport && (
                    <div
                        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                            showModalImport
                                ? "animate-fadeIn"
                                : "animate-fadeOut"
                        }`}
                    >
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalImport
                                isOpen={showModalImport}
                                onClose={() => {
                                    setShowModalImport(!showModalImport);
                                }}
                                data={data}
                                onApplyFilter={handleApplyFilter}
                            />
                        </div>
                    </div>
                )}
                {showCancelModal && (
                    <div
                        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                            showCancelModal
                                ? "animate-fadeIn"
                                : "animate-fadeOut"
                        }`}
                    >
                        <div className="bg-white p-6 rounded shadow-lg">
                            <ModalBatalPesanan
                                isOpen={showCancelModal}
                                onClose={() => setShowCancelModal(false)}
                                item={pesanan}
                                aksi={aksi}
                            />
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}
