import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import HomeLayout from "@/Layouts/HomeLayout";
import ProductCard from "@/Components/Card/ProductCard";
import Pagination from "@/Components/Pagination/Pagination";

export default function Product({ products, categories, brands }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sortBy, setSortBy] = useState("");

    const fetchFiltered = (
        category = selectedCategories,
        brand = selectedBrands,
        sort = sortBy
    ) => {
        const query = {};

        if (category.length > 0) query.category = category;
        if (brand.length > 0) query.brand = brand;
        if (sort) query.sort_by = sort;

        router.get(route("home.product"), query, {
            preserveState: true,
            replace: true,
        });
    };
      

    const handleCategoryChange = (name) => {
        const updated = selectedCategories.includes(name)
            ? selectedCategories.filter((item) => item !== name)
            : [...selectedCategories, name];
        setSelectedCategories(updated);
        fetchFiltered(updated, selectedBrands, sortBy);
    };

    const handleBrandChange = (name) => {
        const updated = selectedBrands.includes(name)
            ? selectedBrands.filter((item) => item !== name)
            : [...selectedBrands, name];
        setSelectedBrands(updated);
        fetchFiltered(selectedCategories, updated, sortBy);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        fetchFiltered(selectedCategories, selectedBrands, value);
    };

    return (
        <HomeLayout>
            <Head title="Produk" />
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
                                {categories?.map((item, index) => (
                                    <label
                                        key={index}
                                        className="inline-flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden peer"
                                            checked={selectedCategories.includes(
                                                item.name
                                            )}
                                            onChange={() =>
                                                handleCategoryChange(item.name)
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
                                        <span className="ml-2 text-sm text-neutral-800">
                                            {item.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm sm:text-base font-semibold mb-3">
                                Brand
                            </p>
                            <div className="flex flex-col gap-2.5">
                                {brands?.map((item, index) => (
                                    <label
                                        key={index}
                                        className="inline-flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden peer"
                                            checked={selectedBrands.includes(
                                                item.name
                                            )}
                                            onChange={() =>
                                                handleBrandChange(item.name)
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
                            <select
                                className="text-sm sm:text-base border border-neutral-200 rounded-xl px-3 py-2 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                value={sortBy}
                                onChange={handleSortChange}
                            >
                                <option value="">Terbaru</option>
                                <option value="lowest_price">
                                    Harga Terendah
                                </option>
                                <option value="highest_price">
                                    Harga Tertinggi
                                </option>
                            </select>
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-700 mb-4">
                            Menampilkan {products?.from}–{products?.to} dari{" "}
                            {products?.total} produk
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            {products?.data?.map((item, index) => (
                                <ProductCard key={index} item={item} />
                            ))}
                        </div>

                        <Pagination links={products?.links} />
                    </div>
                </div>
            </section>
        </HomeLayout>
    );
}
