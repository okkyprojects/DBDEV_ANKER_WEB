import DefaultLayout from "@/Layouts/DefaultLayout";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { IoClose, IoImageOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

export default function Create() {
    const [thumbnail, setThumbnail] = useState();
    const handlethumbnail = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) setThumbnail(uploadedFile);
    };
    const [varians, setVarians] = useState([{ id: Date.now(), isOpen: true }]);

    const addVarian = () => {
        setVarians([...varians, { id: Date.now(), isOpen: true }]);
    };

    const removeVarian = (id) => {
        setVarians(varians.filter((v) => v.id !== id));
    };

    const toggleVarian = (id) => {
        setVarians((prev) =>
            prev.map((v) => (v.id === id ? { ...v, isOpen: !v.isOpen } : v))
        );
    };
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                {" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-5 rounded-xl">
                        <h2 className="text-lg">Informasi Produk</h2>
                        <div className="mt-5 space-y-5">
                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="namaProduk">Nama Produk</label>
                                <input
                                    id="namaProduk"
                                    type="text"
                                    placeholder="Masukkan nama produk"
                                    className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="kategoriProduk">Brand</label>
                                <select
                                    id="kategoriProduk"
                                    className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                >
                                    <option value="">Pilih Brand</option>
                                    <option value="makanan">Makanan</option>
                                    <option value="minuman">Minuman</option>
                                    <option value="alat-rumah-tangga">
                                        Alat Rumah Tangga
                                    </option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="kategoriProduk">
                                    Kategori Produk
                                </label>
                                <select
                                    id="kategoriProduk"
                                    className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                >
                                    <option value="">Pilih Kategori</option>
                                    <option value="makanan">Makanan</option>
                                    <option value="minuman">Minuman</option>
                                    <option value="alat-rumah-tangga">
                                        Alat Rumah Tangga
                                    </option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="deskripsiProduk">
                                    Deskripsi Produk
                                </label>
                                <textarea
                                    id="deskripsiProduk"
                                    placeholder="Masukkan deskripsi produk"
                                    rows={6}
                                    className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl">
                        <h2 className="text-lg">Foto Utama Produk</h2>
                        <div className="mt-5 space-y-5">
                            <div className="flex flex-col gap-2 text-sm">
                                <label htmlFor="thumbnail">
                                    Unggah foto utama produk anda
                                </label>
                                {thumbnail ? (
                                    <div className="relative group">
                                        <img
                                            src={
                                                typeof thumbnail === "string"
                                                    ? thumbnail
                                                    : URL.createObjectURL(
                                                          thumbnail
                                                      )
                                            }
                                            alt="Uploaded"
                                            className="h-64 w-full rounded-lg object-cover"
                                            width={300}
                                            height={300}
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <label
                                                htmlFor="thumbnail"
                                                className="bg-primary-600 text-sm text-white px-4 py-2 rounded-md shadow hover:bg-primary-600/90 transition cursor-pointer"
                                            >
                                                Pilih Gambar Lain
                                            </label>
                                        </div>
                                        <input
                                            id="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlethumbnail}
                                        />
                                    </div>
                                ) : (
                                    <label className="border-gray-300 bg-white flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
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
                                            id="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlethumbnail}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        <h2 className="text-lg">Varian Produk</h2>
                        <button
                            onClick={addVarian}
                            className="flex items-center gap-1 text-primary-600 text-sm"
                        >
                            <FiPlus size={17} />
                            Tambah Varian
                        </button>
                    </div>

                    <div className="mt-5 space-y-5">
                        {varians.map((varian, index) => (
                            <motion.div
                                key={varian.id}
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
                                        onClick={() => toggleVarian(varian.id)}
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
                                        onClick={() => removeVarian(varian.id)}
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
                                                            htmlFor={`namaVarian-${varian.id}`}
                                                        >
                                                            Nama Varian
                                                        </label>
                                                        <input
                                                            id={`namaVarian-${varian.id}`}
                                                            type="text"
                                                            placeholder="Masukkan nama varian"
                                                            className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Harga */}
                                                    <div className="flex flex-col gap-2 text-sm">
                                                        <label
                                                            htmlFor={`hargaVarian-${varian.id}`}
                                                        >
                                                            Harga
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 flex items-center px-3 bg-neutral-100 text-neutral-600 rounded-l-xl border-r border-neutral-300">
                                                                Rp
                                                            </div>
                                                            <input
                                                                id={`hargaVarian-${varian.id}`}
                                                                type="number"
                                                                placeholder="0"
                                                                min={0}
                                                                className="w-full pl-12 pr-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Stok */}
                                                    <div className="flex flex-col gap-2 text-sm">
                                                        <label
                                                            htmlFor={`stokVarian-${varian.id}`}
                                                        >
                                                            Stok
                                                        </label>
                                                        <input
                                                            id={`stokVarian-${varian.id}`}
                                                            type="number"
                                                            min={0}
                                                            placeholder="Masukkan stok varian"
                                                            className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Kolom kanan - Gambar */}
                                                <div className="flex flex-col gap-2 text-sm">
                                                    <label
                                                        htmlFor={`thumbnail-${varian.id}`}
                                                    >
                                                        Unggah foto utama produk
                                                        anda
                                                    </label>
                                                    <label className="border-gray-300 bg-white flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
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
                                                                Format: JPG, PNG
                                                                (Maks. 5MB)
                                                            </p>
                                                        </div>
                                                        <input
                                                            id={`thumbnail-${varian.id}`}
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
