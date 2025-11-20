import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { useForm, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import { IoImageOutline } from "react-icons/io5";

const ModalEditBrand = ({ isOpen, onClose, brand }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        uuid: brand?.uuid || "",
        name: brand?.name || "",
        status: brand?.status?.toString() || "1",
        img: null,
    });

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

        post(route("master.brand.store"), {
            preserveScroll: true,
            forceFormData: true,
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
            router.delete(route("master.brand.destroy", brand?.uuid), {
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setData("img", file);
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-200 ease-in-out ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div
                    className={`mx-auto w-full max-w-xl transform rounded-xl bg-white shadow-lg transition-all duration-200 ${
                        isOpen
                            ? "translate-y-0 scale-100"
                            : "translate-y-10 scale-95"
                    }`}
                >
                    <div className="px-6 py-4 text-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-black text-base font-semibold">
                                Edit Brand
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <IoIosClose size={25} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nama */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Nama Brand</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:outline-none focus:ring-0 py-2 px-3"
                                    value={data.name}
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

                            {/* Gambar */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">
                                    Gambar (Ratio 1:1)
                                </label>
                                {data.img ? (
                                    <div className="relative group aspect-square w-full max-w-sm">
                                        <img
                                            src={URL.createObjectURL(data.img)}
                                            alt="Uploaded"
                                            className="h-full w-full rounded-lg object-cover"
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
                                    <label className="border-gray-300 bg-white flex aspect-square w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                        <div className="flex flex-col items-center justify-center gap-1.5">
                                            <IoImageOutline
                                                size={37}
                                                className="text-neutral-500"
                                            />
                                            <p className="text-primary-600 text-base">
                                                Unggah Gambar
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
                                    <span className="text-xs text-red-500">
                                        {errors.img}
                                    </span>
                                )}
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Status</label>
                                <select
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:outline-none focus:ring-0 py-2 px-3"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <option value="1">Aktif</option>
                                    <option value="0">Tidak Aktif</option>
                                </select>
                                {errors.status && (
                                    <span className="text-xs text-red-500">
                                        {errors.status}
                                    </span>
                                )}
                            </div>

                            {/* Action buttons */}
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
        </div>
    );
};

export default ModalEditBrand;
