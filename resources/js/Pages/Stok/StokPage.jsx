import { FiSearch } from "react-icons/fi";
import { GrFilter } from "react-icons/gr";
import { HiOutlinePrinter } from "react-icons/hi2";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { PiCubeLight } from "react-icons/pi";
import { FaChevronDown, FaPlus, FaTrash } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import ModalFilter from "@/Components/Modal/Stok/ManajemenStok/ModalFilter";
import PaginationDashboard from "@/Components/Pagination/PaginationDashboard";
import ModalDeleteProduk from "@/Components/Modal/Produk/ModalDeleteProduk";
import { HiOutlineUpload } from "react-icons/hi";
import ModalImport from "@/Components/Modal/Stok/ManajemenStok/ModalImport";
import { toast } from "react-toastify";

export default function StokPage({ data }) {
    const { permissions } = usePage().props;
    console.log(data);
    const [openVariants, setOpenVariants] = useState({});

    const debounceRef = useRef(null);
    const searchParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [produk, setProduk] = useState();
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [showModalImport, setShowModalImport] = useState(false);
    const dropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const toggleDropdown = (index) => {
        setDropdownOpen((prev) => (prev === index ? null : index));
    };
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const dataCard = [
        {
            title: "Produk Aktif",
            count: data?.summary?.produk_aktif,
            iconBg: "bg-green-100",
            iconColor: "text-green-500",
        },
        {
            title: "Produk Stok Menipis",
            count: data?.summary?.produk_stok_menipis,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-500",
        },
        {
            title: "Produk Stok Habis",
            count: data?.summary?.produk_stok_habis,
            iconBg: "bg-red-100",
            iconColor: "text-red-500",
        },
    ];
    const toggleVariant = (productUuid) => {
        setOpenVariants((prev) => ({
            ...prev,
            [productUuid]: !prev[productUuid],
        }));
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setDropdownOpen(null);
        }
    };
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

        debounceRef.current = setTimeout(() => {
            const currentParams = new URLSearchParams(window.location.search);
            const page = currentParams.get("page") || 1;

            router.get(
                route(route().current()),
                {
                    search,
                    page,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        }, 500);
    }, [search]);
    const handleSelect = (uuid) => {
        setSelected((prev) =>
            prev.includes(uuid)
                ? prev.filter((id) => id !== uuid)
                : [...prev, uuid]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelected([]);
        } else {
            setSelected(data?.products?.data?.map((item) => item?.uuid) || []);
        }
        setSelectAll(!selectAll);
    };

    const handleBulkDelete = () => {
        if (selected.length === 0) return;

        if (!confirm("Yakin hapus produk terpilih?")) return;

        router.delete(route("produk.product.bulk_destroy"), {
            data: { uuids: selected },
            preserveScroll: true,
            onSuccess: () => {
                setSelected([]);
                setSelectAll(false);
                toast.success("Berhasil menghapus data!");
            },
        });
    };
    // useEffect(() => {
    //     const init = {};
    //     data?.products?.data?.forEach((p) => {
    //         init[p.uuid] = true;
    //     });
    //     setOpenVariants(init);
    // }, [data]);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-base sm:text-2xl font-semibold">
                        Manajemen Stok
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
                            onClick={() => {
                                setShowModalFilter(!showModalFilter);
                            }}
                            className="p-2.5 rounded-xl border border-neutral-400 text-neutral-400 hover:bg-gray-100 transition"
                        >
                            <GrFilter size={20} />
                        </button>
                        {permissions.includes("product-add") && (
                            <button
                                onClick={() =>
                                    setShowModalImport(!showModalImport)
                                }
                                className="p-2.5 rounded-xl bg-info-600 hover:bg-info-600/90 transition text-white cursor-pointer"
                            >
                                <HiOutlineUpload size={20} />
                            </button>
                        )}
                        {permissions.includes("product-export") && (
                            <a
                                href={route("variant.export", {
                                    search: searchParams.get("search") || "",
                                    brand: searchParams.get("brand") || "",
                                    category:
                                        searchParams.get("category") || "",
                                })}
                                className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-600/90 transition text-white"
                            >
                                <HiOutlinePrinter size={20} />
                            </a>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {dataCard.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-5 flex items-center gap-4"
                        >
                            <div
                                className={`p-3 rounded-xl ${item?.iconBg} ${item?.iconColor}`}
                            >
                                <PiCubeLight size={24} />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm text-neutral-500">
                                    {item?.title}
                                </p>
                                <p className="text-xl font-medium">
                                    {item?.count}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TABEL PRODUK */}
                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-medium">Daftar Produk</p>
                        <div className="flex gap-2 items-center">
                            {selected.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="flex gap-1 items-center bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-full"
                                >
                                    <FaTrash />
                                    Hapus Terpilih ({selected.length})
                                </button>
                            )}{" "}
                            {permissions.includes("product-add") && (
                                <Link
                                    href="/produk/data-produk/create"
                                    className="flex gap-1 items-center bg-primary-600 hover:bg-primary-600/90 text-neutral-50 text-sm px-5 py-2 rounded-full"
                                >
                                    <FaPlus />
                                    Tambah Produk
                                </Link>
                            )}
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
                                            className="accent-primary-600 checked:text-white"
                                        />
                                    </th>
                                    <th className="min-w-[280px] px-4 py-4 ">
                                        Produk
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Kategori
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Brand
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Jumlah Varian
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4 ">
                                        Total Stok Saat ini
                                    </th>
                                    <th className="px-4 py-4 ">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.products?.data?.map((item, index) => (
                                    <>
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 text-sm text-neutral-700"
                                        >
                                            <td className="px-4 py-5">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(
                                                        item?.uuid
                                                    )}
                                                    onChange={() =>
                                                        handleSelect(item?.uuid)
                                                    }
                                                    className="accent-primary-600 checked:text-white"
                                                />
                                            </td>

                                            <td className="px-4 py-5">
                                                <p>{item?.name}</p>
                                                <p className="text-neutral-500 text-xs mt-0.5">
                                                    {item?.code}
                                                </p>
                                            </td>

                                            <td className="px-4 py-5">
                                                {item?.category?.name}
                                            </td>
                                            <td className="px-4 py-5 ">
                                                {item?.brand?.name}
                                            </td>

                                            <td className="px-4 py-5">
                                                <button
                                                    onClick={() =>
                                                        toggleVariant(item.uuid)
                                                    }
                                                    className="flex items-center gap-1 text-primary-600"
                                                >
                                                    {item?.variant_count} Varian
                                                    <FaChevronDown
                                                        className={`${
                                                            openVariants[
                                                                item.uuid
                                                            ]
                                                                ? "rotate-180"
                                                                : ""
                                                        } transition`}
                                                    />
                                                </button>
                                            </td>

                                            <td className="px-4 py-5">
                                                {item?.total_stock}
                                            </td>

                                            <td className="relative px-4 py-5">
                                                <button
                                                    onClick={() =>
                                                        toggleDropdown(index)
                                                    }
                                                    className="rounded-full border border-primary-600 text-primary-600 flex items-center gap-1.5 px-3 py-1 text-sm font-medium"
                                                >
                                                    Aksi{" "}
                                                    <FaChevronDown size={14} />
                                                </button>
                                            </td>
                                            {dropdownOpen === index && (
                                                <div
                                                    ref={dropdownRef}
                                                    className={`absolute right-10 z-10 mt-14 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out lg:right-18 ${
                                                        dropdownOpen === index
                                                            ? "opacity-100"
                                                            : "pointer-events-none opacity-0"
                                                    }`}
                                                >
                                                    <div className="py-1">
                                                        {" "}
                                                        {permissions.includes(
                                                            "product-update"
                                                        ) && (
                                                            <Link
                                                                href={route(
                                                                    "produk.product.edit",
                                                                    item?.uuid
                                                                )}
                                                                className="text-gray-700 flex w-full items-center justify-start px-4 py-2 text-sm hover:bg-slate-100 hover:bg-opacity-30"
                                                            >
                                                                Detail
                                                            </Link>
                                                        )}
                                                        {permissions.includes(
                                                            "product-delete"
                                                        ) && (
                                                            <button
                                                                onClick={() => {
                                                                    setProduk(
                                                                        item
                                                                    );
                                                                    setShowDeleteModal(
                                                                        true
                                                                    );
                                                                }}
                                                                className="text-gray-700 flex w-full items-center justify-start px-4 py-2 text-sm hover:bg-slate-100 hover:bg-opacity-30"
                                                            >
                                                                Hapus
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </tr>

                                        {openVariants[item.uuid] && (
                                            <tr className="bg-white">
                                                <td colSpan={7} className="p-0">
                                                    <table className="w-full table-auto border-t">
                                                        <tbody>
                                                            {item?.variants?.map(
                                                                (v, vi) => (
                                                                    <tr
                                                                        key={vi}
                                                                        className="text-sm border-b"
                                                                    >
                                                                        {/* 1. Checkbox column spacer */}
                                                                        <td className="px-4 py-4 w-[50px]"></td>

                                                                        {/* 2. Product Name + SKU */}
                                                                        <td className="px-4 py-4 min-w-[280px]">
                                                                            <p className="text-gray-600">
                                                                                {
                                                                                    v.name
                                                                                }
                                                                            </p>
                                                                            <p className="text-xs text-neutral-500">
                                                                                SKU:{" "}
                                                                                {
                                                                                    v.sku
                                                                                }
                                                                            </p>
                                                                        </td>

                                                                        {/* 3. Category spacer */}
                                                                        <td className="min-w-[200px] px-4 py-4"></td>

                                                                        {/* 4. Brand spacer */}
                                                                        <td className="min-w-[200px] px-4 py-4"></td>

                                                                        {/* 5. Harga */}
                                                                        <td className="min-w-[200px] px-4 py-4">
                                                                            <div className="flex flex-col leading-tight">
                                                                                <span
                                                                                    className={
                                                                                        v.discount_price
                                                                                            ? "text-neutral-400 line-through text-sm"
                                                                                            : " text-sm"
                                                                                    }
                                                                                >
                                                                                    Rp{" "}
                                                                                    {v.price?.toLocaleString(
                                                                                        "id-ID"
                                                                                    )}
                                                                                </span>

                                                                                {v.discount_price ? (
                                                                                    <span className=" text-gray-600">
                                                                                        Rp{" "}
                                                                                        {v.discount_price?.toLocaleString(
                                                                                            "id-ID"
                                                                                        )}
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="text-neutral-400">
                                                                                        -
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </td>

                                                                        {/* 6. Stock */}
                                                                        <td className="min-w-[200px] px-4 py-4 text-gray-500">
                                                                            {
                                                                                v.stock
                                                                            }
                                                                        </td>

                                                                        <td className="px-4 py-4 min-w-[100px]"></td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
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
                    {showDeleteModal && (
                        <div
                            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                                showDeleteModal
                                    ? "animate-fadeIn"
                                    : "animate-fadeOut"
                            }`}
                        >
                            <div className="bg-white p-6 rounded shadow-lg">
                                <ModalDeleteProduk
                                    isOpen={showDeleteModal}
                                    onClose={() => {
                                        setShowDeleteModal(!showDeleteModal);
                                    }}
                                    item={produk}
                                />
                            </div>
                        </div>
                    )}
                    <PaginationDashboard
                        links={data?.products?.links}
                        meta={data?.products}
                    />
                </div>
            </div>
        </DefaultLayout>
    );
}
