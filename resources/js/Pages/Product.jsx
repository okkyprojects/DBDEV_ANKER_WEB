import Footer from "@/Components/Footer/Footer";
import { Link, Head } from "@inertiajs/react";
import "swiper/css";
import "swiper/css/pagination";
import Navbar from "@/Components/Navbar/Navbar";
import HomeLayout from "@/Layouts/HomeLayout";
import ProductCard from "@/Components/Card/ProductCard";
import { useState } from "react";
import { categories, products } from "@/Dummy/dummy";
import Pagination from "@/Components/Pagination/Pagination";

export default function Product() {
    const [selected, setSelected] = useState([]);

    const handleChange = (name) => {
        setSelected((prev) =>
            prev.includes(name)
                ? prev.filter((item) => item !== name)
                : [...prev, name]
        );
    };

    return (
        <HomeLayout>
            <Head title="Welcome" />
            <section className="max-w-7xl mx-auto px-5 p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="bg-white h-fit rounded-xl p-5 lg:col-span-3 w-full">
                        <p className="text-base sm:text-lg font-medium mb-2">
                            Filter
                        </p>

                        <div className="mt-4">
                            <p className="text-sm sm:text-base font-semibold mb-3">
                                Kategori
                            </p>
                            <div className="flex flex-col gap-2.5">
                                {categories.map((item, index) => (
                                    <label
                                        key={index}
                                        className="inline-flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden peer"
                                            checked={selected.includes(
                                                item.name
                                            )}
                                            onChange={() =>
                                                handleChange(item.name)
                                            }
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-primary-600 peer-checked:bg-primary-600 peer-checked:border-primary-600 flex items-center justify-center transition-colors duration-200">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3 h-3 text-white  peer-checked:opacity-100 transition-opacity duration-200"
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
                                        <span className="ml-2 text-sm text-neutral-800">
                                            {item.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Brand */}
                        <div className="mt-6">
                            <p className="text-sm sm:text-base font-semibold mb-3">
                                Brand
                            </p>
                            <div className="flex flex-col gap-2.5">
                                {categories.map((item, index) => (
                                    <label
                                        key={index}
                                        className="inline-flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden peer"
                                            checked={selected.includes(
                                                item.name
                                            )}
                                            onChange={() =>
                                                handleChange(item.name)
                                            }
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-primary-600 peer-checked:bg-primary-600 peer-checked:border-primary-600 flex items-center justify-center transition-colors duration-200">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3 h-3 text-white  peer-checked:opacity-100 transition-opacity duration-200"
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
                                        <span className="ml-2 text-sm text-neutral-800">
                                            {item.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-9 w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                            <p className="text-xl sm:text-2xl lg:text-3xl font-medium">
                                Produk
                            </p>
                            <select className="text-sm sm:text-base border border-neutral-200 rounded-xl px-3 py-2 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none">
                                <option value="terbaru">Terbaru</option>
                                <option value="harga-terendah">
                                    Harga Terendah
                                </option>
                                <option value="harga-tertinggi">
                                    Harga Tertinggi
                                </option>
                                <option value="terpopuler">Terpopuler</option>
                            </select>
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-700 mb-4">
                            Menampilkan 1–12 dari 36 produk
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            {products.map((item, index) => (
                                <ProductCard key={index} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
                <Pagination currentPage={1} totalPages={10} />
            </section>
        </HomeLayout>
    );
}
