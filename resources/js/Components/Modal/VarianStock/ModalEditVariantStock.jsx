import { useEffect, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import Select from "react-select";
import { IoIosClose } from "react-icons/io";

import { animatedComponents, styles } from "@/Config/global";
import { toast } from "react-toastify";

const ModalEditVariantStock = ({ isOpen, onClose, item }) => {
    const [searchProduct, setSearchProduct] = useState("");
    const [searchVariant, setSearchVariant] = useState("");
    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]);

    const { data, setData, post, errors, processing, reset } = useForm({
        uuid: item?.uuid || "",
        product_uuid: item?.variant?.product?.uuid || "",
        variant_uuid: item?.variant?.uuid || "",
        quantity: item?.quantity || 0,
        note: item?.note,
    });

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        axios
            .get(
                `/api/products${
                    searchProduct ? `?search=${searchProduct}` : ""
                }`
            )
            .then((res) => {
                setProducts(res.data.data.data || []);
                setVariants([]);
            });
    }, [searchProduct]);

    useEffect(() => {
        if (!data.product_uuid) return;

        axios
            .get(
                `/api/variants?product_uuid=${data.product_uuid}&search=${searchVariant}`
            )
            .then((res) => {
               setVariants(res.data.data || []);
               if (
                   !item?.variant ||
                   data.product_uuid !== item?.variant?.product?.uuid
               ) {
                   setData("variant_uuid", "");
               }

            })
            .catch(() => setVariants([]));
    }, [data.product_uuid, searchVariant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("reporting.item.store"), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success("Berhasil mengubah data!");
                onClose();
                reset();
            },
            onError: () => {
                toast.error("Gagal megnubah data.");
            },
        });
    };

    const handleDelete = () => {
        if (confirm("Yakin ingin menghapus data?")) {
            router.delete(route("reporting.item.destroy", item?.uuid), {
                onSuccess: () => {
                    toast.success("Berhasil menghapus data!");
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal menghapus data.");
                },
            });
        }
    };
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-200 ease-in-out ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="relative w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5">
                        <h3 className="text-base font-semibold">
                            Tambah Stok Barang
                        </h3>
                        <button onClick={onClose}>
                            <IoIosClose size={28} />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="px-6 py-6 text-sm space-y-4"
                    >
                        {/* Product */}
                        <div className="flex flex-col gap-2">
                            <label>Produk</label>
                            <Select
                                options={[
                                    { value: "", label: "Pilih Produk" },
                                    ...products.map((p) => ({
                                        value: p.uuid,
                                        label: p.name,
                                    })),
                                ]}
                                components={animatedComponents}
                                onInputChange={(input) => {
                                    setSearchProduct(input);
                                    return input;
                                }}
                                placeholder="Pilih Produk"
                                value={
                                    data.product_uuid
                                        ? {
                                              value: data.product_uuid,
                                              label:
                                                  products.find(
                                                      (p) =>
                                                          p.uuid ===
                                                          data.product_uuid
                                                  )?.name || "Produk Terpilih",
                                          }
                                        : { value: "", label: "Pilih Produk" }
                                }
                                onChange={(option) =>
                                    setData("product_uuid", option?.value || "")
                                }
                                styles={styles}
                            />
                            {errors.product_uuid && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.product_uuid}
                                </p>
                            )}
                        </div>

                        {/* Variant */}
                        <div className="flex flex-col gap-2">
                            <label>Variant</label>
                            <Select
                                options={[
                                    { value: "", label: "Pilih Variant" },
                                    ...variants.map((v) => ({
                                        value: v.uuid,
                                        label: v.name,
                                    })),
                                ]}
                                components={animatedComponents}
                                onInputChange={(input) => {
                                    setSearchVariant(input);
                                    return input;
                                }}
                                placeholder="Pilih Variant"
                                value={
                                    data.variant_uuid
                                        ? {
                                              value: data.variant_uuid,
                                              label:
                                                  variants.find(
                                                      (v) =>
                                                          v.uuid ===
                                                          data.variant_uuid
                                                  )?.name || "Variant Terpilih",
                                          }
                                        : { value: "", label: "Pilih Variant" }
                                }
                                onChange={(option) =>
                                    setData("variant_uuid", option?.value || "")
                                }
                                styles={styles}
                            />
                            {errors.variant_uuid && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.variant_uuid}
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex flex-col gap-2">
                            <label>Jumlah Stok</label>
                            <input
                                type="number"
                                name="quantity"
                                min="0"
                                placeholder="Masukkan jumlah stok"
                                value={data.quantity}
                                onChange={handleChange}
                                className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                            />
                            {errors.quantity && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.quantity}
                                </p>
                            )}
                        </div>

                        {/* Note */}
                        <div className="flex flex-col gap-2">
                            <label>Catatan (Opsional)</label>
                            <textarea
                                name="note"
                                value={data.note}
                                placeholder="Masukkan catatan"
                                onChange={handleChange}
                                className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                            />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t mt-4">
                            {/* Hapus (kiri) */}
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="text-red-600 text-sm font-medium hover:underline"
                            >
                                Hapus
                            </button>

                            <div className="flex gap-3">
                                {/* Batal */}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-xl border text-sm px-4 py-2 text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                                >
                                    Batal
                                </button>

                                {/* Simpan */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-primary-600 text-white text-sm px-5 py-2 hover:bg-primary-700"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalEditVariantStock;
