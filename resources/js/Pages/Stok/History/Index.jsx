import { FiSearch } from "react-icons/fi";
import { GrFilter } from "react-icons/gr";
import { PiColumnsLight } from "react-icons/pi";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import ModalFilterStockHistory from "@/Components/Modal/StockHistory/ModalFilterStockHistory";
import PaginationDashboard from "@/Components/Pagination/PaginationDashboard";
import { Head, router } from "@inertiajs/react";

const ACTION_LABELS = {
    reduce_from_order: "Reduce from Order",
    increase_from_order_cancel: "Increase from Order Cancel",
    update_manual: "Update Manual",
};

const ACTION_BADGE_CLASS = {
    reduce_from_order: "bg-error-100 text-error-600",
    increase_from_order_cancel: "bg-success-100 text-success-600",
    update_manual: "bg-neutral-100 text-neutral-600",
};

const COLUMN_DEFS = [
    { key: "user", label: "User" },
    { key: "before_stock", label: "Before Stock" },
    { key: "after_stock", label: "After Stock" },
    { key: "current_stock", label: "Current Stock" },
    { key: "created_at", label: "Tanggal" },
    { key: "action", label: "Action" },
];

const VISIBLE_COLUMNS_STORAGE_KEY = "stock_history_visible_columns";

const loadVisibleColumns = () => {
    try {
        const stored = window.localStorage.getItem(
            VISIBLE_COLUMNS_STORAGE_KEY
        );
        if (!stored) return null;
        return JSON.parse(stored);
    } catch (e) {
        return null;
    }
};

export default function Index({ data }) {
    const debounceRef = useRef(null);
    const searchParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const stored = loadVisibleColumns();
        if (stored) return stored;
        return COLUMN_DEFS.reduce((acc, col) => {
            acc[col.key] = true;
            return acc;
        }, {});
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(
                VISIBLE_COLUMNS_STORAGE_KEY,
                JSON.stringify(visibleColumns)
            );
        } catch (e) {
            // ignore write errors (private mode, storage full, etc.)
        }
    }, [visibleColumns]);

    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isColumnVisible = (key) => visibleColumns[key] !== false;

    useEffect(() => {
        clearTimeout(debounceRef.current);
        const currentParams = new URLSearchParams(window.location.search);
        const page = currentParams.get("page") || 1;

        debounceRef.current = setTimeout(() => {
            router.get(
                route(route().current()),
                { ...Object.fromEntries(currentParams), search, page: 1 },
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
            <Head title="History Stok" />
            <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-base sm:text-2xl font-semibold">
                        History Stok
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
                                placeholder="Cari produk / SKU"
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowColumnDropdown((prev) => !prev)
                                }
                                className="p-2.5 rounded-xl border border-neutral-400 text-neutral-400 hover:bg-gray-100 transition"
                            >
                                <PiColumnsLight size={20} />
                            </button>
                            {showColumnDropdown && (
                                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-neutral-200 bg-white shadow-lg z-20 p-3">
                                    <p className="text-xs font-medium text-neutral-500 mb-2">
                                        Tampilkan Kolom
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {COLUMN_DEFS.map((col) => (
                                            <label
                                                key={col.key}
                                                className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isColumnVisible(
                                                        col.key
                                                    )}
                                                    onChange={() =>
                                                        toggleColumn(col.key)
                                                    }
                                                    className="accent-primary-600"
                                                />
                                                {col.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setShowModalFilter(true)}
                            className="p-2.5 rounded-xl border border-neutral-400 text-neutral-400 hover:bg-gray-100 transition"
                        >
                            <GrFilter size={20} />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-medium">
                            Riwayat Perubahan Stok
                        </p>
                    </div>
                    <div className="max-w-full overflow-x-auto ">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="min-w-[25px] px-4 py-4 xl:pl-11" />
                                    <th className="min-w-[280px] px-4 py-4">
                                        Produk
                                    </th>
                                    {isColumnVisible("user") && (
                                        <th className="min-w-[180px] px-4 py-4">
                                            User
                                        </th>
                                    )}
                                    {isColumnVisible("before_stock") && (
                                        <th className="min-w-[140px] px-4 py-4">
                                            Before Stock
                                        </th>
                                    )}
                                    {isColumnVisible("after_stock") && (
                                        <th className="min-w-[140px] px-4 py-4">
                                            After Stock
                                        </th>
                                    )}
                                    {isColumnVisible("current_stock") && (
                                        <th className="min-w-[140px] px-4 py-4">
                                            Current Stock
                                        </th>
                                    )}
                                    {isColumnVisible("created_at") && (
                                        <th className="min-w-[180px] px-4 py-4">
                                            Tanggal
                                        </th>
                                    )}
                                    {isColumnVisible("action") && (
                                        <th className="min-w-[200px] px-4 py-4">
                                            Action
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {data?.stock_histories?.data?.map(
                                    (item, index) => (
                                        <tr
                                            key={item.uuid || index}
                                            className="hover:bg-gray-50 text-sm text-neutral-700"
                                        >
                                            <td className="px-4 py-5 pl-9 xl:pl-11">
                                                {data?.stock_histories?.from +
                                                    index}
                                            </td>
                                            <td className="px-4 py-5">
                                                <p>
                                                    {
                                                        item?.variant?.product
                                                            ?.name
                                                    }
                                                </p>
                                                <p className="text-neutral-500 text-xs mt-0.5">
                                                    {item?.variant?.sku}
                                                    {" - "}
                                                    {item?.variant?.name}
                                                </p>
                                            </td>
                                            {isColumnVisible("user") && (
                                                <td className="px-4 py-5">
                                                    {item?.user?.name ?? "-"}
                                                </td>
                                            )}
                                            {isColumnVisible(
                                                "before_stock"
                                            ) && (
                                                <td className="px-4 py-5">
                                                    {item?.before_stock}
                                                </td>
                                            )}
                                            {isColumnVisible(
                                                "after_stock"
                                            ) && (
                                                <td className="px-4 py-5">
                                                    {item?.after_stock}
                                                </td>
                                            )}
                                            {isColumnVisible(
                                                "current_stock"
                                            ) && (
                                                <td className="px-4 py-5">
                                                    {item?.current_stock}
                                                </td>
                                            )}
                                            {isColumnVisible(
                                                "created_at"
                                            ) && (
                                                <td className="px-4 py-5">
                                                    {moment(
                                                        item?.created_at
                                                    ).format(
                                                        "DD/MM/YYYY, HH:mm"
                                                    )}
                                                </td>
                                            )}
                                            {isColumnVisible("action") && (
                                                <td className="px-4 py-5">
                                                    <span
                                                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                                                            ACTION_BADGE_CLASS[
                                                                item?.action
                                                            ] ??
                                                            "bg-neutral-100 text-neutral-600"
                                                        }`}
                                                    >
                                                        {ACTION_LABELS[
                                                            item?.action
                                                        ] ?? item?.action}
                                                    </span>
                                                </td>
                                            )}
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    <PaginationDashboard
                        links={data?.stock_histories?.links}
                        meta={data?.stock_histories}
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
                            <ModalFilterStockHistory
                                isOpen={showModalFilter}
                                onClose={() => setShowModalFilter(false)}
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
