import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { useForm, router, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import Select from "react-select";

const ModalEditPromo = ({
    isOpen,
    onClose,
    promo,
    products = [],
    variants = [],
}) => {
    const { permissions } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        uuid: promo?.uuid || "",
        name: promo?.name || "",
        description: promo?.description || "",
        type: promo?.type || "qty",
        product_uuid: promo?.product_uuid || "",
        min_purchase: promo?.min_purchase?.toString() || "",
        free_variant_uuid: promo?.free_variant_uuid || "",
        free_quantity: promo?.free_quantity?.toString() || "1",
        quota: promo?.quota?.toString() || "",
        start_at: promo?.start_at || "",
        end_at: promo?.end_at || "",
        is_active: promo?.is_active ? "1" : "0",
    });

    const productOptions = products.map((p) => ({
        value: p.uuid,
        label: p.code ? `${p.code} - ${p.name}` : p.name,
    }));
    const variantOptions = variants.map((v) => ({
        value: v.uuid,
        label: `${v.product?.name} - ${v.name} (${v.sku}) | Stok: ${v.stock}`,
    }));

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            reset();
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("promosi.promo.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Berhasil mengubah data!");
                onClose();
                reset();
            },
            onError: () => {
                toast.error("Gagal mengubah data.");
            },
        });
    };

    const handleDelete = () => {
        if (confirm("Yakin ingin menghapus data?")) {
            router.delete(route("promosi.promo.destroy", promo?.uuid), {
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
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-200 ease-in-out ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div
                    className={`mx-auto w-full max-w-2xl transform rounded-xl overflow-y-auto scrollbar-hidden max-h-[40rem] bg-white shadow-lg transition-all duration-200 ${
                        isOpen
                            ? "translate-y-0 scale-100"
                            : "translate-y-10 scale-95"
                    }`}
                >
                    <div className="px-6 py-4 text-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-black text-base font-semibold">
                                Edit Promo
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <IoIosClose size={25} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Nama Promo</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.name}
                                    placeholder="Contoh: Beli 40 Gratis 1"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <span className="text-xs text-red-500">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.description}
                                    placeholder="Dipakai juga sebagai isi notifikasi promo"
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                />
                                {errors.description && (
                                    <span className="text-xs text-red-500">
                                        {errors.description}
                                    </span>
                                )}
                            </div>

                            {/* Type */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Syarat Minimal</label>
                                <select
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none py-2 px-3"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                >
                                    <option value="qty">
                                        Minimal Jumlah (pcs)
                                    </option>
                                    <option value="value">
                                        Minimal Nominal Belanja (Rp)
                                    </option>
                                </select>
                                {errors.type && (
                                    <span className="text-xs text-red-500">
                                        {errors.type}
                                    </span>
                                )}
                            </div>

                            {/* Product */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">
                                    Barang yang Dibeli
                                </label>
                                <Select
                                    options={productOptions}
                                    placeholder="Pilih Produk"
                                    value={
                                        productOptions.find(
                                            (o) =>
                                                o.value === data.product_uuid
                                        ) || null
                                    }
                                    onChange={(selected) =>
                                        setData(
                                            "product_uuid",
                                            selected?.value || ""
                                        )
                                    }
                                />
                                {errors.product_uuid && (
                                    <span className="text-xs text-red-500">
                                        {errors.product_uuid}
                                    </span>
                                )}
                            </div>

                            {/* Min Purchase */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">
                                    {data.type === "value"
                                        ? "Minimal Belanja (Rp) per Kelipatan"
                                        : "Minimal Pembelian (pcs) per Kelipatan"}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.min_purchase}
                                    onChange={(e) =>
                                        setData("min_purchase", e.target.value)
                                    }
                                />
                                {errors.min_purchase && (
                                    <span className="text-xs text-red-500">
                                        {errors.min_purchase}
                                    </span>
                                )}
                            </div>

                            {/* Free Variant */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Barang Gratis</label>
                                <Select
                                    options={variantOptions}
                                    placeholder="Pilih Variant"
                                    value={
                                        variantOptions.find(
                                            (o) =>
                                                o.value ===
                                                data.free_variant_uuid
                                        ) || null
                                    }
                                    onChange={(selected) =>
                                        setData(
                                            "free_variant_uuid",
                                            selected?.value || ""
                                        )
                                    }
                                />
                                {errors.free_variant_uuid && (
                                    <span className="text-xs text-red-500">
                                        {errors.free_variant_uuid}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Free Quantity */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm">
                                        Gratis (pcs) per Kelipatan
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                        value={data.free_quantity}
                                        onChange={(e) =>
                                            setData(
                                                "free_quantity",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.free_quantity && (
                                        <span className="text-xs text-red-500">
                                            {errors.free_quantity}
                                        </span>
                                    )}
                                </div>

                                {/* Quota */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm">
                                        Kuota Maksimal (terpakai{" "}
                                        {promo?.used_quota ?? 0})
                                    </label>
                                    <input
                                        type="number"
                                        min={promo?.used_quota || 1}
                                        required
                                        className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                        value={data.quota}
                                        onChange={(e) =>
                                            setData("quota", e.target.value)
                                        }
                                    />
                                    {errors.quota && (
                                        <span className="text-xs text-red-500">
                                            {errors.quota}
                                        </span>
                                    )}
                                </div>

                                {/* Start At */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm">
                                        Mulai (Opsional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none py-2 px-3"
                                        value={data.start_at}
                                        onChange={(e) =>
                                            setData("start_at", e.target.value)
                                        }
                                    />
                                    {errors.start_at && (
                                        <span className="text-xs text-red-500">
                                            {errors.start_at}
                                        </span>
                                    )}
                                </div>

                                {/* End At */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm">
                                        Berakhir (Opsional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none py-2 px-3"
                                        value={data.end_at}
                                        onChange={(e) =>
                                            setData("end_at", e.target.value)
                                        }
                                    />
                                    {errors.end_at && (
                                        <span className="text-xs text-red-500">
                                            {errors.end_at}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Is Active */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Status</label>
                                <select
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none py-2 px-3"
                                    value={data.is_active}
                                    onChange={(e) =>
                                        setData("is_active", e.target.value)
                                    }
                                >
                                    <option value="1">Aktif</option>
                                    <option value="0">Nonaktif</option>
                                </select>
                                {errors.is_active && (
                                    <span className="text-xs text-red-500">
                                        {errors.is_active}
                                    </span>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center justify-between pt-4 border-t mt-4">
                                {/* Hapus (kiri) */}
                                {permissions.includes("promo-delete") && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="text-red-600 text-sm font-medium hover:underline"
                                    >
                                        Hapus
                                    </button>
                                )}

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
                                    {permissions.includes("promo-update") && (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-xl bg-primary-600 text-white text-sm px-5 py-2 hover:bg-primary-700"
                                        >
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalEditPromo;
