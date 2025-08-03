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
import PaginationDashboard from "@/Components/Pagination/PaginationDashboard";
import { useEffect } from "react";
import { useRef } from "react";
import { router } from "@inertiajs/react";
import ModalFilter from "@/Components/Modal/Penjualan/ModalFilter";

export default function Penjualan({ data }) {
    console.log(data);
    const [showModalFilter, setShowModalFilter] = useState(false);
    const debounceRef = useRef(null);
    const searchParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const dataCard = [
        {
            title: "Pendapatan Kotor",
            count: formatRupiah(1500000),
            iconBg: "bg-green-100",
            iconColor: "text-green-500",
            icon: <PiCurrencyCircleDollarLight size={24} />,
        },
        {
            title: "Total Pesanan",
            count: 2,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-500",
            icon: <PiShoppingCartLight size={24} />,
        },
        {
            title: "Item per Pesanan",
            count: 5,
            iconBg: "bg-red-100",
            iconColor: "text-red-500",
            icon: <PiCubeLight size={24} />,
        },
    ];

    const [dropdownOpen, setDropdownOpen] = useState(null);
    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-base sm:text-2xl font-semibold">
                        Penjualan
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
                        <button
                            onClick={() => setShowModalFilter(true)}
                            className="p-2.5 rounded-xl border border-neutral-400 text-neutral-400 hover:bg-gray-100 transition"
                        >
                            <GrFilter size={20} />
                        </button>
                        <a
                            href={route("reporting.penjualan.export", {
                                search: searchParams.get("search") || "",
                                brand: searchParams.get("brand") || "",
                                category: searchParams.get("category") || "",
                            })}
                            className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-600/90 transition text-white"
                        >
                            <HiOutlinePrinter size={20} />
                        </a>
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
                            Penjualan per Produk
                        </p>
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
                                        Stok Masuk
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Terjual
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Jumlah Pendapatan
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
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.product_name}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.kuantitas}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.terjual}
                                            </td>
                                            <td className="px-4 py-5">
                                                {formatRupiah(item.pendapatan)}
                                            </td>

                                            <td className="px-4 py-5">
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
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    <PaginationDashboard
                        links={data?.transactions?.links}
                        meta={data?.transactions}
                    />
                </div>
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
            </div>
        </DefaultLayout>
    );
}
