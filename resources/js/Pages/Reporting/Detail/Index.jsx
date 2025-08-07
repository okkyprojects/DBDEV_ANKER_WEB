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
import { Link, router } from "@inertiajs/react";
import { LuTrendingUp } from "react-icons/lu";
import Chart from "react-apexcharts";
import ModalFilter from "@/Components/Modal/Dashboard/ModalFilter";
import { BsBoxSeam, BsCart2, BsJournalText } from "react-icons/bs";
import PaginationDashboard from "@/Components/Pagination/PaginationDashboard";
import { formatRupiah } from "@/Utils/utils";
import { useEffect } from "react";
import { useRef } from "react";

export default function Index({ data }) {
    console.log(data);
    const debounceRef = useRef(null);
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
    const mantap = {
        variant_stocks: {
            data: [
                {
                    variant: {
                        product: { name: "Sepatu Lari Pro" },
                        name: "Ukuran 42",
                    },
                    category: "Olahraga",
                    brand: "Nike",
                    quantity: 120,
                    terjual: 85,
                    pendapatan: 25500000,
                },
                {
                    variant: {
                        product: { name: "T-Shirt Casual" },
                        name: "Size M",
                    },
                    category: "Pakaian",
                    brand: "Uniqlo",
                    quantity: 200,
                    terjual: 140,
                    pendapatan: 14000000,
                },
                {
                    variant: {
                        product: { name: "Headphone Wireless" },
                        name: "Black",
                    },
                    category: "Elektronik",
                    brand: "Sony",
                    quantity: 50,
                    terjual: 30,
                    pendapatan: 7500000,
                },
            ],
            links: [],
        },
    };
    useEffect(() => {
        clearTimeout(debounceRef.current);
        const currentParams = new URLSearchParams(window.location.search);
        const page = currentParams.get("page") || 1;

        debounceRef.current = setTimeout(() => {
            router.get(
                route(route().current()),
                { page },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        }, 500);
    }, []);
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-xl sm:text-2xl font-semibold">
                        Detail Penjualan
                    </p>
                    <button
                        onClick={() =>
                            (window.location.href = route(
                                "reporting.penjualan.export.detail",
                                data?.product?.uuid
                            ))
                        }
                        className="p-2.5 rounded-xl bg-primary-600 w-fit hover:bg-primary-600/90 transition text-white"
                    >
                        <HiOutlinePrinter size={20} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Gambar Produk */}
                    <div className="md:col-span-4">
                        <img
                            src={
                                typeof data?.product?.img === "string"
                                    ? data.product.img.startsWith("http")
                                        ? data.product.img
                                        : `${window.location.origin}/${data.product.img}`
                                    : data?.product?.img
                                    ? URL.createObjectURL(data.product.img)
                                    : ""
                            }
                            alt={data?.product?.name || "Product Image"}
                            className="h-64 w-full rounded-lg object-cover"
                            width={300}
                            height={300}
                        />
                    </div>

                    {/* Detail Produk */}
                    <div className="md:col-span-8">
                        <div className="flex flex-col gap-5">
                            <div className="bg-white rounded-xl p-5">
                                <p className="text-2xl font-medium">
                                    {data?.product?.name}
                                </p>
                                <div className="mt-2.5 flex flex-wrap gap-2">
                                    <div className="px-3 py-1.5 rounded-full bg-info-100 text-info-800 text-sm w-fit">
                                        {data?.product?.brand?.name}
                                    </div>
                                    <div className="px-3 py-1.5 rounded-full bg-primary-100 text-primary-800 text-sm w-fit">
                                        {data?.product?.category?.name}
                                    </div>
                                </div>
                            </div>

                            {/* Card Statistik */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div className="bg-white p-5 rounded-xl">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-3 rounded-xl bg-success-100 text-success-600">
                                            <BsJournalText size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-neutral-500 text-sm">
                                                Total Pendapatan
                                            </p>
                                            <p className="text-neutral-900 font-medium text-lg">
                                                {formatRupiah(
                                                    data?.summary
                                                        ?.total_pendapatan
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-xl">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-3 rounded-xl bg-error-100 text-error-600">
                                            <BsCart2 size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-neutral-500 text-sm">
                                                Total Stok Terjual
                                            </p>
                                            <p className="text-neutral-900 font-medium text-lg">
                                                {data?.summary?.total_terjual}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-xl">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-3 rounded-xl bg-info-100 text-info-600">
                                            <BsBoxSeam size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-neutral-500 text-sm">
                                                Sisa Stok
                                            </p>
                                            <p className="text-neutral-900 font-medium text-lg">
                                                {data?.summary?.stok_tersisa}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-medium">
                            Penjualan per Varian
                        </p>
                    </div>
                    <div className="max-w-full overflow-x-auto ">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="min-w-[25px] px-4 py-4 xl:pl-11 " />
                                    <th className="min-w-[280px] px-4 py-4 ">
                                        Variant
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Kategori
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Brand
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Kuantitas
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Terjual
                                    </th>
                                    <th className="px-4 py-4 ">Pendapatan</th>
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
                                                <p>{item.variant_name}</p>
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.category_name}
                                            </td>
                                            <td className="px-4 py-5">
                                                {item.brand_name}
                                            </td>
                                            <td className="px-4 py-5">
                                                {Number(item.kuantitas)}
                                            </td>
                                            <td className="px-4 py-5">
                                                {Number(item.terjual)}
                                            </td>
                                            <td className="px-4 py-5">
                                                {formatRupiah(
                                                    Number(item.pendapatan)
                                                )}
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
            </div>
        </DefaultLayout>
    );
}
