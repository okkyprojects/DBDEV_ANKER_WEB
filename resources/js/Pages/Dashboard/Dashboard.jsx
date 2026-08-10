import { FiSearch } from "react-icons/fi";
import { GrFilter } from "react-icons/gr";
import { HiOutlinePrinter } from "react-icons/hi2";
import DefaultLayout from "@/Layouts/DefaultLayout";
import {
    PiChartLineUpLight,
    PiCubeLight,
    PiCurrencyCircleDollarLight,
    PiShoppingCartLight,
    PiUsersThreeLight,
} from "react-icons/pi";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { LuTrendingUp } from "react-icons/lu";
import Chart from "react-apexcharts";
import ModalFilter from "@/Components/Modal/Dashboard/ModalFilter";
import { statusBadge } from "@/Config/const";
import { formatRupiah } from "@/Utils/utils";

export default function Dashboard({ data }) {
    console.log("MASUU");
    console.log(data);
    const [showModalFilter, setShowModalFilter] = useState(false);
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        router.visit(route("home.index"), {
            method: "get",
            data: { filter: newFilter },
            preserveScroll: true,
            preserveState: true,
        });
    };
    const dataCard = [
        {
            title: "Pendapatan Kotor",
            count: formatRupiah(data?.summary?.pendapatan_kotor),
            iconBg: "bg-green-100",
            iconColor: "text-green-500",
            icon: <PiCurrencyCircleDollarLight size={24} />,
        },
        {
            title: "Total Pesanan",
            count: data?.summary?.total_pesanan,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-500",
            icon: <PiShoppingCartLight size={24} />,
        },
        {
            title: "Item Terjual",
            count: data?.summary?.item_terjual,
            iconBg: "bg-red-100",
            iconColor: "text-red-500",
            icon: <PiCubeLight size={24} />,
        },
    ];
    const [filter, setFilter] = useState("Harian");

    const chartData = data.chart;

    const series = [
        {
            name: "Pendapatan",
            type: "line",
            data: chartData.pendapatan || [],
        },
        {
            name: "Pesanan",
            type: "line",
            data: chartData.pesanan || [],
        },
    ];

    const options = {
        chart: {
            type: "line",
            height: 350,
            toolbar: { show: false },
            fontFamily: "DIN Next, sans-serif",
        },
        grid: {
            yaxis: { lines: { show: false } },
            xaxis: { lines: { show: false } },
        },
        colors: ["#22C55E", "#3B82F6"],
        stroke: { curve: "smooth", width: 2 },
        markers: {
            size: 3,
            strokeWidth: 0,
            strokeColors: "#fff",
            hover: { size: 4 },
        },
        xaxis: {
            categories: chartData.categories || [],
        },
        yaxis: [
            {
                title: { text: "Pendapatan (Rp)", style: { fontSize: "10px" } },
                labels: {
                    formatter: (val) => `Rp ${val.toLocaleString("id-ID")}`,
                },
            },
            {
                opposite: true,
                title: { text: "Pesanan", style: { fontSize: "10px" } },
                labels: { formatter: (val) => `${val}` },
            },
        ],
        legend: {
            position: "top",
            horizontalAlign: "right",
            fontFamily: "DIN Next, sans-serif",
        },
        tooltip: {
            style: { fontFamily: "DIN Next, sans-serif" },
            shared: true,
            y: {
                formatter: function (val, { seriesIndex }) {
                    return seriesIndex === 0
                        ? `Rp ${val.toLocaleString("id-ID")}`
                        : `${val} Pesanan`;
                },
            },
        },
    };
    const handleApplyFilter = (filters) => {
        const params = {
            ...filters,
        };

        router.get(route(route().current()), params, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };
    const filters = ["Harian",  "Bulanan"];
    return (
        <DefaultLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-xl sm:text-2xl font-semibold">
                        Dashboard
                    </p>
                    <button
                        onClick={() => {
                            setShowModalFilter(!showModalFilter);
                        }}
                        className="p-2.5 rounded-xl border border-neutral-400 text-neutral-400 hover:bg-gray-100 transition"
                    >
                        <GrFilter size={20} />
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {dataCard.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-5 relative shadow-sm"
                        >
                            <div
                                className={`absolute top-5 right-5 p-2 rounded-md ${item.iconBg} ${item.iconColor}`}
                            >
                                {item.icon}
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-neutral-500">
                                    {item.title}
                                </p>
                                <p className="text-xl font-semibold">
                                    {item.count}
                                </p>
                                {/* <div className="flex items-center gap-1 text-green-600 text-sm ">
                                    <LuTrendingUp size={16} />
                                    <span>10%</span>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
                        <p className="text-lg font-medium">
                            Performa Penjualan
                        </p>
                        <div className="flex gap-2 items-center ">
                            {filters.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleFilterChange(item)}
                                    className={`px-4 py-1.5 text-sm rounded-full transition ${
                                        filter === item
                                            ? "bg-primary-50 text-primary-600"
                                            : "text-neutral-500"
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Chart
                        options={options}
                        series={series}
                        height={350}
                        type="line"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-white rounded-xl p-5">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-lg font-medium">
                                Produk Terlaris
                            </p>
                            <Link
                                href={route("produk.product.index")}
                                className="text-primary-600 text-sm"
                            >
                                Lihat semua
                            </Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            {data?.products.map((item, idx) => (
                                <div
                                    key={item.product.uuid}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.product.img}
                                            alt={item.product.name}
                                            className="w-12 h-12 rounded-xl object-cover"
                                        />
                                        <div>
                                            <p className="text-sm text-neutral-800">
                                                {item.product.name}
                                            </p>
                                            <span
                                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                    parseInt(
                                                        item.stok_saat_ini
                                                    ) <= 5
                                                        ? "bg-red-100 text-red-500"
                                                        : "bg-green-100 text-green-500"
                                                }`}
                                            >
                                                Stok : {item.stok_saat_ini}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium whitespace-nowrap text-neutral-700">
                                        {item.terjual} Unit
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-lg font-medium">
                                Pesanan Terbaru
                            </p>
                            <Link
                                href={route("pesanan.manajemen.index")}
                                className="text-primary-600 text-sm"
                            >
                                Lihat semua
                            </Link>
                        </div>

                        {data?.transactions?.length === 0 ? (
                            <p className="text-center text-neutral-500 italic py-5">
                                Belum ada pesanan
                            </p>
                        ) : (
                            <table className="w-full table-auto text-sm overflow-x-auto">
                                <thead className="text-left text-neutral-700">
                                    <tr>
                                        <th className="py-2 font-normal">
                                            ID Pesanan
                                        </th>
                                        <th className="py-2 font-normal">
                                            Pemesan
                                        </th>
                                        <th className="py-2 font-normal">
                                            Tanggal
                                        </th>
                                        <th className="py-2 font-normal">
                                            Jumlah
                                        </th>
                                        <th className="py-2 min-w-40 font-normal">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.transactions.map((item) => (
                                        <tr
                                            key={item.uuid}
                                            className="text-sm text-neutral-600"
                                        >
                                            <td className="py-2">
                                                {item.transaction_code}
                                            </td>
                                            <td className="py-2">
                                                {item.user?.name}
                                            </td>
                                            <td className="py-2">
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="py-2">
                                                Rp{" "}
                                                {item.grand_total.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </td>
                                            <td className="py-2">
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full text-xs ${
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
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
                                    onApplyFilter={handleApplyFilter}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
}
