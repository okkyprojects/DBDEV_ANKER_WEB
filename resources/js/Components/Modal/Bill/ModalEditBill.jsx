import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { useForm, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import { IoImageOutline } from "react-icons/io5";

const ModalEditBill = ({ isOpen, onClose, bill }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        uuid: bill?.uuid || "",
        account_number: bill?.account_number || "",
        bank_name: bill?.bank_name || "",
        account_holder_name: bill?.account_holder_name || "",
        is_main: bill?.is_main?.toString() || "0",
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

        post(route("master.bill.store"), {
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
            router.delete(route("master.bill.destroy", bill?.uuid), {
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
                                Edit Rekening
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <IoIosClose size={25} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Account Number */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">
                                    Nomor Rekening
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.account_number}
                                    placeholder="Masukkan nomor rekening"
                                    onChange={(e) =>
                                        setData(
                                            "account_number",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.account_number && (
                                    <span className="text-xs text-red-500">
                                        {errors.account_number}
                                    </span>
                                )}
                            </div>

                            {/* Bank Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Nama Bank</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.bank_name}
                                    placeholder="Masukkan nama bank"
                                    onChange={(e) =>
                                        setData("bank_name", e.target.value)
                                    }
                                />
                                {errors.bank_name && (
                                    <span className="text-xs text-red-500">
                                        {errors.bank_name}
                                    </span>
                                )}
                            </div>

                            {/* Account Holder Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">
                                    Nama Pemilik Rekening
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.account_holder_name}
                                    placeholder="Masukkan nama pemilik rekening"
                                    onChange={(e) =>
                                        setData(
                                            "account_holder_name",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.account_holder_name && (
                                    <span className="text-xs text-red-500">
                                        {errors.account_holder_name}
                                    </span>
                                )}
                            </div>

                            {/* Is Main */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Status</label>
                                <select
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none py-2 px-3"
                                    value={data.is_main}
                                    onChange={(e) =>
                                        setData("is_main", e.target.value)
                                    }
                                >
                                    <option value="0">Biasa</option>
                                    <option value="1">Utama</option>
                                </select>
                                {errors.is_main && (
                                    <span className="text-xs text-red-500">
                                        {errors.is_main}
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

export default ModalEditBill;
