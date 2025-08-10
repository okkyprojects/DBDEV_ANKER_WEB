import { useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { IoIosWarning } from "react-icons/io";
import { toast } from "react-toastify";
import { router } from "@inertiajs/react";
import moment from "moment";

const ModalUpdatePesanan = ({ isOpen, onClose, item, aksi }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);
    const getAksiLabel = (aksi) => {
        switch (aksi) {
            case 2:
                return "diproses";
            case 3:
                return "pengiriman barang";
            case 4:
                return "selesai";
            case 5:
                return "dibatalkan";
            default:
                return "tidak diketahui";
        }
    };

    if (!isOpen) return null;
    const handleUpdateStatus = () => {
        const payload = { status: aksi };
        const now = moment().format("YYYY-MM-DD HH:mm:ss");

        if (aksi === 2) {
            payload.processing_at = now;
        } else if (aksi === 3) {
            payload.shipping_at = now;
        } else if (aksi === 4) {
            payload.completed_at = now;
        } else if (aksi === 5) {
            payload.failed_at = now;
        }

        router.post(route("pesanan.manajemen.update", item.uuid), payload, {
            onSuccess: () => {
                toast.success(
                    `Status pesanan berhasil diubah menjadi ${getAksiLabel(
                        aksi
                    )}!`
                );
                onClose();
            },
            onError: (errors) => {
                console.error("Gagal mengubah status:", errors);
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
                            <img src="/images/delete/delete.svg" alt="" />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-black">
                                    Konfirmasi Pesanan
                                </h3>
                                <p className="text-neutral-400 mt-1">
                                    Apakah Anda yakin ingin mengubah status
                                    pesanan {item?.transaction_code} menjadi{" "}
                                    {getAksiLabel(aksi)}?
                                </p>
                            </div>
                            <div className="mb-3 grid w-full grid-cols-2 gap-3 ">
                                <button
                                    className="w-full rounded-lg  bg-primary-50 py-2 text-neutral-900"
                                    onClick={onClose}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpdateStatus}
                                    className="w-full rounded-lg bg-primary-600 py-2 text-white hover:bg-opacity-90"
                                >
                                    Ya, simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalUpdatePesanan;
