import { Link, Head, router } from "@inertiajs/react";
import HomeLayout from "@/Layouts/HomeLayout";
import { GoPencil } from "react-icons/go";
import { LuTrash } from "react-icons/lu";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { formatRupiah } from "@/Utils/utils";
import { useCart } from "@/Context/CartContext";
import { useEffect } from "react";

export default function Cart({ data }) {
    const { selectedVariants, toggleVariant } = useCart();
    const updateQuantity = (uuid, variant_uuid, newQty, isSelect = true) => {
        if (newQty < 1) return;

        router.post(
            route("cart.store"),
            {
                uuid: uuid,
                variant_uuid: variant_uuid,
                quantity: newQty,
                is_select: isSelect,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };
    return (
        <HomeLayout>
            <Head title="Welcome" />
            <section className="max-w-7xl mx-auto px-5 pt-10 pb-10">
                <h2 className="text-xl sm:text-2xl  font-medium text-neutral-900 mb-5">
                    Keranjang
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="col-span-full md:col-span-8 flex flex-col gap-5">
                        <div className="rounded-xl bg-white p-5">
                            <div className="text-sm font-medium">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="hidden peer"
                                    />
                                    <div className="w-5 h-5 rounded border-2 border-primary-600 peer-checked:bg-primary-600 peer-checked:border-primary-600 flex items-center justify-center transition-colors duration-200">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-3 h-3 text-white o peer-checked:opacity-100 transition-opacity duration-200"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <span className="ml-4 text-sm text-neutral-800">
                                        Pilih semua produk{" "}
                                        <span className="text-neutral-400">
                                            (10)
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-5">
                            <div className="flex flex-col gap-8">
                                {" "}
                                <div className="text-sm font-medium">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="hidden peer"
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-primary-600 peer-checked:bg-primary-600 peer-checked:border-primary-600 flex items-center justify-center transition-colors duration-200">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3 h-3 text-white o peer-checked:opacity-100 transition-opacity duration-200"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={3}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-4 flex items-center gap-2">
                                            <img
                                                src="/images/profile/profil.jpg"
                                                alt=""
                                                className="h-5 w-5 sm:h-7 sm:w-7 rounded-full"
                                            />
                                            <p className="text-sm font-medium">
                                                Nama Toko/Dealer
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                {data?.carts?.variants?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="text-sm font-medium"
                                    >
                                        <label className="flex flex-col sm:flex-row w-full cursor-pointer gap-4">
                                            <input
                                                type="checkbox"
                                                className="hidden peer"
                                                checked={
                                                    !!selectedVariants.find(
                                                        (v) =>
                                                            v.pivot.uuid ===
                                                            item.pivot.uuid
                                                    )
                                                }
                                                onChange={() =>
                                                    toggleVariant(item)
                                                }
                                            />
                                            <div className="w-5 h-5 rounded border-2 border-primary-600 peer-checked:bg-primary-600 peer-checked:border-primary-600 flex items-center justify-center transition-colors duration-200">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-3 h-3 text-white peer-checked:opacity-100 transition-opacity duration-200"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={3}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col sm:flex-row justify-between w-full gap-4 sm:gap-5">
                                                <div className="flex gap-4 w-full sm:w-auto">
                                                    <img
                                                        src={item?.img}
                                                        alt={item?.name}
                                                        className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-xl"
                                                    />
                                                    <div className="flex flex-col justify-center gap-4">
                                                        <div className="flex flex-col gap-1">
                                                            <p className="text-sm font-medium">
                                                                {
                                                                    item
                                                                        ?.product
                                                                        ?.name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-neutral-700">
                                                                Varian :{" "}
                                                                {item?.name}
                                                            </p>
                                                        </div>
                                                        <p className="text-base font-normal">
                                                            {formatRupiah(
                                                                item.price
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end sm:justify-between gap-4">
                                                    <div className="flex gap-2.5 text-neutral-500">
                                                        <GoPencil size={20} />
                                                        <LuTrash size={20} />
                                                    </div>
                                                    <div className="flex gap-4 items-center">
                                                        <button
                                                            className="rounded-full border border-neutral-200 p-2"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item?.pivot
                                                                        ?.uuid,
                                                                    item?.pivot
                                                                        ?.variant_uuid,
                                                                    item?.pivot
                                                                        ?.quantity -
                                                                        1,
                                                                    item?.pivot
                                                                        ?.is_select
                                                                )
                                                            }
                                                            disabled={
                                                                item?.pivot
                                                                    ?.quantity <=
                                                                1
                                                            }
                                                        >
                                                            <FaMinus />
                                                        </button>
                                                        <div className="py-1">
                                                            {
                                                                item?.pivot
                                                                    ?.quantity
                                                            }
                                                        </div>
                                                        <button
                                                            className="rounded-full border border-neutral-200 p-2"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item?.pivot
                                                                        ?.uuid,
                                                                    item?.pivot
                                                                        ?.variant_uuid,
                                                                    item?.pivot
                                                                        ?.quantity +
                                                                        1,
                                                                    item?.pivot
                                                                        ?.is_select
                                                                )
                                                            }
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-full md:col-span-4">
                        <div className="p-5 rounded-xl bg-white sticky top-32">
                            <p className="text-lg font-medium">
                                Ringkasan Pesanan
                            </p>
                            <div className="flex justify-between items-center my-5">
                                <p className="text-neutral-700 text-sm">
                                    Total
                                </p>
                                <p className="text-neutral-900 text-base font-semibold">
                                    Rp 450.000
                                </p>
                            </div>{" "}
                            <Link
                                href="/checkout"
                                className="flex items-center justify-center gap-3 w-full bg-primary-600 hover:bg-primary-700 transition-colors duration-200 py-2 px-4 rounded-xl text-neutral-50 shadow-md text-sm sm:text-base"
                            >
                                <p className="font-medium">Checkout</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </HomeLayout>
    );
}
