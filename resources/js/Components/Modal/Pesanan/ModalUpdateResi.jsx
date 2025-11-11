import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { router } from "@inertiajs/react";

const ModalUpdateResi = ({ isOpen, onClose, item }) => {
    const [noResi, setNoResi] = useState(item?.resi || "");

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleUpdateResi = () => {
        const payload = { resi: noResi };

        router.post(route("pesanan.manajemen.update", item.uuid), payload, {
            onSuccess: () => {
                toast.success("Nomor resi berhasil diperbarui!");
                onClose();
            },
            onError: (errors) => {
                console.error("Gagal memperbarui resi:", errors);
                toast.error("Terjadi kesalahan saat memperbarui resi!");
            },
        });
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-20 transition-opacity duration-200 ease-in-out ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-0">
                <div
                    className={`mx-auto w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                        isOpen
                            ? "translate-y-0 scale-100"
                            : "translate-y-10 scale-95"
                    }`}
                >
                    <div className="px-6 py-4 text-sm">
                        <div className="flex flex-col items-center justify-center gap-5">
                            <img src="/images/update/update.svg" alt="" />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-black">
                                    Update Nomor Resi
                                </h3>
                                <p className="text-neutral-400 mt-1">
                                    Masukkan nomor resi untuk pesanan{" "}
                                    <strong>{item?.transaction_code}</strong>.
                                </p>
                            </div>

                            <div className="w-full space-y-1">
                                <label className="text-sm font-medium text-neutral-700">
                                    Nomor Resi
                                </label>
                                <input
                                    type="text"
                                    value={noResi}
                                    onChange={(e) => setNoResi(e.target.value)}
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:outline-none focus:ring-0 py-2 px-3"
                                    placeholder="Masukkan nomor resi"
                                />
                            </div>

                            <div className="mb-3 grid w-full grid-cols-2 gap-3">
                                <button
                                    className="w-full rounded-lg bg-primary-50 py-2 text-neutral-900"
                                    onClick={onClose}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpdateResi}
                                    className="w-full rounded-lg bg-primary-600 py-2 text-white hover:bg-opacity-90"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalUpdateResi;
