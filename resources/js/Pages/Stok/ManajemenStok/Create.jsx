import DefaultLayout from "@/Layouts/DefaultLayout";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { IoClose, IoImageOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { toast } from "react-toastify";

export default function Create({ data: initial_data }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        code: "",
        category_uuid: "",
        status: "",
        brand_uuid: "",
        seller_uuid: "",
        img: null,
        description: "",
        variants: [
            {
                name: "",
                sku: "",
                price: "",
                img: null,
                status: "1",
                isOpen: true,
                stock: true,
            },
        ],
    });
    const [thumbnail, setThumbnail] = useState();
    const handlethumbnail = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) setThumbnail(uploadedFile);
    };
    const [varians, setVarians] = useState([{ id: Date.now(), isOpen: true }]);

    const addVarian = () => {
        setData("variants", [
            ...data.variants,
            {
                name: "",
                price: "",
                discount_price: "",
                img: null,
                isOpen: true,
            },
        ]);
    };

    const removeVarian = (index) => {
        const updated = [...data.variants];
        updated.splice(index, 1);
        setData("variants", updated);
    };

    const toggleVarian = (index) => {
        const updated = [...data.variants];
        updated[index].isOpen = !updated[index].isOpen;
        setData("variants", updated);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setData("img", file);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.variants || data.variants.length === 0) {
            toast.error("Minimal harus ada 1 varian produk");
            return;
        }
        console.log(data);
        const formData = new FormData();

        for (const key in data) {
            if (key === "variants") {
                data.variants.forEach((variant, i) => {
                    for (const field in variant) {
                        if (variant[field] !== null && variant[field] !== "") {
                            formData.append(
                                `variants[${i}][${field}]`,
                                variant[field]
                            );
                        }
                    }
                });
            } else {
                formData.append(key, data[key]);
            }
        }

        post(route("produk.product.store"), {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <DefaultLayout>
            <Head title="Tambah Stok" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-5 rounded-xl">
                        <h2 className="text-lg">Informasi Produk</h2>
                        <div className="mt-5 space-y-5">
                            {/* Product Name */}
                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="name">Nama Produk</label>
                                <input
                                    id="name"
                                    required
                                    type="text"
                                    placeholder="Masukkan nama produk"
                                    className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                            </div>
                            {/* Product Code */}
                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="code">Kode Produk</label>
                                <input
                                    id="code"
                                    required
                                    type="text"
                                    placeholder="Masukkan kode produk"
                                    className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                />
                                {errors.code && (
                                    <span className="text-red-500 text-xs">
                                        {errors.code}
                                    </span>
                                )}
                            </div>
                            {/* Status */}
                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    required
                                    className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <option value="">Pilih Status</option>
                                    <option value={1}>Aktif</option>
                                    <option value={0}>Tidak Aktif</option>
                                </select>
                                {errors.status && (
                                    <span className="text-red-500 text-xs">
                                        {errors.status}
                                    </span>
                                )}
                            </div>
                            {/* Category */}
                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="category_uuid">
                                    Kategori Produk
                                </label>
                                <select
                                    id="category_uuid"
                                    required
                                    className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    value={data.category_uuid}
                                    onChange={(e) =>
                                        setData("category_uuid", e.target.value)
                                    }
                                >
                                    <option value="">Pilih Kategori</option>
                                    {initial_data.categories.map((category) => (
                                        <option
                                            key={category.uuid}
                                            value={category.uuid}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_uuid && (
                                    <span className="text-red-500 text-xs">
                                        {errors.category_uuid}
                                    </span>
                                )}
                            </div>
                            {/* Brand */}
                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="brand_uuid">Brand</label>
                                <select
                                    id="brand_uuid"
                                    required
                                    className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    value={data.brand_uuid}
                                    onChange={(e) =>
                                        setData("brand_uuid", e.target.value)
                                    }
                                >
                                    <option value="">Pilih Brand</option>
                                    {initial_data.brands.map((brand) => (
                                        <option
                                            key={brand.uuid}
                                            value={brand.uuid}
                                        >
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.brand_uuid && (
                                    <span className="text-red-500 text-xs">
                                        {errors.brand_uuid}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="description">
                                    Deskripsi Produk
                                </label>
                                <textarea
                                    id="description"
                                    required
                                    placeholder="Masukkan deskripsi produk"
                                    rows={6}
                                    className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none resize-none"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl">
                        <h2 className="text-lg">Foto Utama Produk</h2>
                        <div className="mt-5 space-y-5">
                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="img">
                                    Unggah foto utama produk anda (Ratio 1:1)
                                </label>
                                {data.img ? (
                                    <div className="relative group">
                                        <img
                                            src={
                                                typeof data.img === "string"
                                                    ? data.img
                                                    : URL.createObjectURL(
                                                          data.img
                                                      )
                                            }
                                            alt="Uploaded"
                                            className="aspect-square w-full rounded-lg object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <label
                                                htmlFor="img"
                                                className="bg-primary-600 text-sm text-white px-4 py-2 rounded-md shadow hover:bg-primary-600/90 transition cursor-pointer"
                                            >
                                                Pilih Gambar Lain
                                            </label>
                                        </div>
                                        <input
                                            id="img"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                ) : (
                                    <label className="border-gray-300 bg-white flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                        <div className="flex flex-col items-center justify-center gap-1.5">
                                            <IoImageOutline
                                                size={37}
                                                className="text-neutral-500"
                                            />
                                            <p className="text-primary-600 text-base">
                                                Unggah Foto Utama
                                            </p>
                                            <p className="text-neutral-500 text-sm">
                                                Format: JPG, PNG (Maks. 5MB)
                                            </p>
                                        </div>
                                        <input
                                            id="img"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                )}
                                {errors.img && (
                                    <span className="text-red-500 text-xs">
                                        {errors.img}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Variants Section */}
                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        <h2 className="text-lg">Varian Produk</h2>
                        <button
                            type="button"
                            onClick={addVarian}
                            className="flex items-center gap-1 text-primary-600 text-sm"
                        >
                            <FiPlus size={17} />
                            Tambah Varian
                        </button>
                    </div>

                    <div className="mt-5 space-y-5">
                        {data?.variants?.map((varian, index) => (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{
                                    opacity: 0,
                                    x: -100,
                                    transition: { duration: 0.3 },
                                }}
                                className="border rounded-xl p-5"
                            >
                                <div className="flex justify-between items-center flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleVarian(index)}
                                        className="flex gap-2.5 items-center"
                                    >
                                        <FaChevronUp
                                            className={`transform transition-transform ${
                                                varian.isOpen
                                                    ? "rotate-0"
                                                    : "rotate-180"
                                            }`}
                                        />
                                        <p>Varian {index + 1}</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeVarian(index)}
                                    >
                                        <IoClose />
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {varian.isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden mt-5"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                {/* Kolom kiri */}
                                                <div className="space-y-5">
                                                    {/* Nama Varian */}
                                                    <div className="flex flex-col gap-2 text-sm">
                                                        <label
                                                            htmlFor={`varianName-${index}`}
                                                        >
                                                            Nama Varian
                                                        </label>
                                                        <input
                                                            id={`varianName-${index}`}
                                                            type="text"
                                                            placeholder="Masukkan nama varian"
                                                            value={varian.name}
                                                            required
                                                            onChange={(e) => {
                                                                const updated =
                                                                    [
                                                                        ...data.variants,
                                                                    ];
                                                                updated[
                                                                    index
                                                                ].name =
                                                                    e.target.value;
                                                                setData(
                                                                    "variants",
                                                                    updated
                                                                );
                                                            }}
                                                            className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                                        />
                                                    </div>
                                                    {/* SKU Varian */}
                                                    <div className="flex flex-col gap-2 text-sm">
                                                        <label
                                                            htmlFor={`varianSKU-${index}`}
                                                        >
                                                            SKU Varian
                                                        </label>
                                                        <input
                                                            id={`varianSKU-${index}`}
                                                            type="text"
                                                            placeholder="Masukkan sku varian"
                                                            value={varian.sku}
                                                            required
                                                            onChange={(e) => {
                                                                const updated =
                                                                    [
                                                                        ...data.variants,
                                                                    ];
                                                                updated[
                                                                    index
                                                                ].sku =
                                                                    e.target.value;
                                                                setData(
                                                                    "variants",
                                                                    updated
                                                                );
                                                            }}
                                                            className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2 text-sm">
                                                        <span className="">
                                                            Stok
                                                        </span>{" "}
                                                        <input
                                                            id={`varianStok-${index}`}
                                                            type="number"
                                                            placeholder="0"
                                                            required
                                                            min={0}
                                                            value={varian.stock}
                                                            onChange={(e) => {
                                                                const updated =
                                                                    [
                                                                        ...data.variants,
                                                                    ];
                                                                updated[
                                                                    index
                                                                ].stock =
                                                                    e.target.value;
                                                                setData(
                                                                    "variants",
                                                                    updated
                                                                );
                                                            }}
                                                            className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2 text-sm">
                                                        <label
                                                            htmlFor={`varianPrice-${index}`}
                                                        >
                                                            Harga Asli
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 flex items-center px-3 bg-neutral-100 text-neutral-600 rounded-l-xl border-r border-neutral-300">
                                                                Rp
                                                            </div>
                                                            <input
                                                                id={`varianPrice-${index}`}
                                                                type="number"
                                                                placeholder="0"
                                                                min={0}
                                                                required
                                                                value={
                                                                    varian.price
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const updated =
                                                                        [
                                                                            ...data.variants,
                                                                        ];
                                                                    updated[
                                                                        index
                                                                    ].price =
                                                                        e.target.value;
                                                                    setData(
                                                                        "variants",
                                                                        updated
                                                                    );
                                                                }}
                                                                className="w-full pl-12 pr-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Kolom kanan - Gambar */}
                                                <div className="flex flex-col gap-2 text-sm">
                                                    <label
                                                        htmlFor={`varianImage-${index}`}
                                                    >
                                                        Unggah foto utama produk
                                                        anda (Ratio 1:1)
                                                    </label>
                                                    {varian.img ? (
                                                        <div className="relative group">
                                                            <img
                                                                src={
                                                                    typeof varian.img ===
                                                                    "string"
                                                                        ? varian.img
                                                                        : URL.createObjectURL(
                                                                              varian.img
                                                                          )
                                                                }
                                                                alt={`Preview Varian ${
                                                                    index + 1
                                                                }`}
                                                                className="aspect-square w-full rounded-lg object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                                <label
                                                                    htmlFor={`varianImage-${index}`}
                                                                    className="bg-primary-600 text-sm text-white px-4 py-2 rounded-md shadow hover:bg-primary-600/90 transition cursor-pointer"
                                                                >
                                                                    Pilih Gambar
                                                                    Lain
                                                                </label>
                                                            </div>
                                                            <input
                                                                id={`varianImage-${index}`}
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const updated =
                                                                        [
                                                                            ...data.variants,
                                                                        ];
                                                                    updated[
                                                                        index
                                                                    ].img =
                                                                        e.target.files[0];
                                                                    setData(
                                                                        "variants",
                                                                        updated
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <label className="border-gray-300 bg-white flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                                            <div className="flex flex-col items-center justify-center gap-1.5">
                                                                <IoImageOutline
                                                                    size={37}
                                                                    className="text-neutral-500"
                                                                />
                                                                <p className="text-primary-600 text-base">
                                                                    Unggah File
                                                                    Gambar
                                                                </p>
                                                                <p className="text-neutral-500 text-sm">
                                                                    Format: JPG,
                                                                    PNG (Maks.
                                                                    5MB)
                                                                </p>
                                                            </div>
                                                            <input
                                                                id={`varianImage-${index}`}
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const updated =
                                                                        [
                                                                            ...data.variants,
                                                                        ];
                                                                    updated[
                                                                        index
                                                                    ].img =
                                                                        e.target.files[0];
                                                                    setData(
                                                                        "variants",
                                                                        updated
                                                                    );
                                                                }}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-3 items-center text-sm">
                    <Link href="/produk/data-produk" className="px-5">
                        Batal
                    </Link>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-lg hover:bg-primary-600/90 text-white bg-primary-600"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </DefaultLayout>
    );
}
