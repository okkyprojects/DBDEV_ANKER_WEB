import Footer from "@/Components/Footer/Footer";
import { Link, Head } from "@inertiajs/react";
import "swiper/css";
import "swiper/css/pagination";
import Navbar from "@/Components/Navbar/Navbar";
import HomeLayout from "@/Layouts/HomeLayout";
import ProductCard from "@/Components/Card/ProductCard";
import { useState } from "react";
import { categories, products } from "@/Dummy/dummy";

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
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 accent-green-600"
                                            checked={selected.includes(
                                                item.name
                                            )}
                                            onChange={() =>
                                                handleChange(item.name)
                                            }
                                        />
                                        <p className="text-sm sm:text-base text-neutral-800">
                                            {item.name}
                                        </p>
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
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 accent-green-600"
                                            checked={selected.includes(
                                                item.name
                                            )}
                                            onChange={() =>
                                                handleChange(item.name)
                                            }
                                        />
                                        <p className="text-sm sm:text-base text-neutral-800">
                                            {item.name}
                                        </p>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PRODUK LIST */}
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
            </section>
        </HomeLayout>
    );
}
