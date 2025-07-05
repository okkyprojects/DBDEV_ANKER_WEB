import { FiSearch } from "react-icons/fi";
import { GrFilter } from "react-icons/gr";
import { HiOutlinePrinter } from "react-icons/hi2";
import DefaultLayout from "@/Layouts/DefaultLayout";
import {
    PiChartLineUpLight,
    PiCubeLight,
    PiShoppingCartLight,
    PiUsersThreeLight,
} from "react-icons/pi";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { LuTrendingUp } from "react-icons/lu";
import Chart from "react-apexcharts";
import ModalFilter from "@/Components/Modal/Dashboard/ModalFilter";

export default function Dashboard() {
    const [showModalFilter, setShowModalFilter] = useState(false);
    const dataCard = [
        {
            title: "Pendapatan",
            count: "Rp 70.000.000",
            icon: <PiChartLineUpLight size={20} />,
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            title: "Pesanan",
            count: "200",
            icon: <PiShoppingCartLight size={20} />,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            title: "Pengunjung",
            count: "2.500",
            icon: <PiUsersThreeLight size={20} />,
            iconBg: "bg-red-50",
            iconColor: "text-red-500",
        },
    ];
    const chartData = {
        Harian: {
            categories: [
                "1 Juli",
                "2 Juli",
                "3 Juli",
                "4 Juli",
                "5 Juli",
                "6 Juli",
                "7 Juli",
                "8 Juli",
                "9 Juli",
                "10 Juli",
                "11 Juli",
                "12 Juli",
            ],
            pendapatan: [
                15000000, 20000000, 13000000, 21000000, 27000000, 33000000,
                39000000, 42000000, 50000000, 55000000, 60000000, 58000000,
            ],
            pesanan: [20, 25, 18, 30, 45, 60, 70, 80, 90, 100, 90, 85],
        },
        Mingguan: {
            categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
            pendapatan: [120000000, 170000000, 150000000, 180000000],
            pesanan: [300, 400, 380, 420],
        },
        Bulanan: {
            categories: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"],
            pendapatan: [
                500000000, 600000000, 550000000, 700000000, 650000000,
                750000000, 720000000,
            ],
            pesanan: [1000, 1200, 1100, 1300, 1250, 1400, 1380],
        },
    };

    const [filter, setFilter] = useState("Harian");

    const series = [
        {
            name: "Pendapatan",
            type: "line",
            data: chartData[filter].pendapatan,
        },
        {
            name: "Pesanan",
            type: "line",
            data: chartData[filter].pesanan,
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
            yaxis: {
                lines: {
                    show: false,
                },
            },
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },

        colors: ["#22C55E", "#3B82F6"],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        markers: {
            size: 3,
            strokeWidth: 0,
            strokeColors: "#fff",
            hover: {
                size: 4,
            },
        },
        xaxis: {
            categories: chartData[filter].categories,
        },
        yaxis: [
            {
                title: {
                    text: "Pendapatan (Rp)",
                    style: { fontSize: "10px" },
                },
                labels: {
                    formatter: (val) => `Rp ${val.toLocaleString("id-ID")}`,
                },
            },
            {
                opposite: true,
                title: {
                    text: "Pesanan",
                    style: { fontSize: "10px" },
                },
                labels: {
                    formatter: (val) => `${val}`,
                },
            },
        ],
        legend: {
            position: "top",
            horizontalAlign: "right",
            fontFamily: "DIN Next, sans-serif",
        },
        tooltip: {
            style: {
                fontFamily: "DIN Next, sans-serif",
            },
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

    const filters = ["Harian", "Mingguan", "Bulanan"];
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-xl sm:text-2xl font-semibold">
                        Dashboard
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
                        <button
                            onClick={() => {
                                setShowModalFilter(!showModalFilter);
                            }}
                            className="p-2.5 rounded-xl border border-neutral-400 text-neutral-400 hover:bg-gray-100 transition"
                        >
                            <GrFilter size={20} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-600/90 transition text-white">
                            <HiOutlinePrinter size={20} />
                        </button>
                    </div>
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
                                <div className="flex items-center gap-1 text-green-600 text-sm ">
                                    <LuTrendingUp size={16} />
                                    <span>10%</span>
                                </div>
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
                                    onClick={() => setFilter(item)}
                                    className={`px-4 py-1.5 text-sm rounded-full transition ${
                                        filter === item
                                            ? "bg-primary-50 text-primary-600 "
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
                            <a href="#" className="text-primary-600 text-sm">
                                Lihat semua
                            </a>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[...Array(5)].map((_, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-neutral-300" />
                                        <div>
                                            <p className="text-sm text-neutral-800">
                                                Nama produk
                                            </p>
                                            <span
                                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                    idx === 1
                                                        ? "bg-red-100 text-red-500"
                                                        : "bg-green-100 text-green-500"
                                                }`}
                                            >
                                                Stok : {idx === 1 ? "1" : "10"}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium whitespace-nowrap text-neutral-700">
                                        300 Unit
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
                            <a href="#" className="text-primary-600 text-sm">
                                Lihat semua
                            </a>
                        </div>
                        <table className="w-full table-auto text-sm">
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
                                    <th className="py-2 font-normal">Jumlah</th>
                                    <th className="py-2 font-normal">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, idx) => (
                                    <tr
                                        key={idx}
                                        className="text-sm text-neutral-600"
                                    >
                                        <td className="py-2">#ID-Pesanan</td>
                                        <td className="py-2">John Doe</td>
                                        <td className="py-2">01/07/2025</td>
                                        <td className="py-2">Rp 700.000</td>
                                        <td className="py-2">
                                            <span className="px-3 py-0.5 text-xs font-medium bg-green-100 text-green-600 rounded-full">
                                                Selesai
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>{" "}
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
                                    onApplyFilter={() => {}}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
}
