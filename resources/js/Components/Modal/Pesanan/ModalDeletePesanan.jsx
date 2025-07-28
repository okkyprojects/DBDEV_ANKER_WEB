import { useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { IoIosWarning } from "react-icons/io";
import { toast } from "react-toastify";
import { router } from "@inertiajs/react";

const ModalDeletePesanan = ({ isOpen, onClose, item }) => {
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
    if (!isOpen) return null;
    const handleDelete = () => {
        router.delete(route("pesanan.manajemen.destroy", item.uuid), {
            onSuccess: () => {
                toast.success("Berhasil menghapus data!");
                onClose();
            },
            onError: (errors) => {
                console.error("Gagal menghapus:", errors);
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
                                <h3 className=" text-lg font-semibold  text-black ">
                                    Konfirmasi Penghapusan
                                </h3>
                                <p className="text-neutral-400 mt-1">
                                    Apakah Anda yakin ingin menghapus pesanan{" "}
                                    {item?.transaction_code} ?
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
                                    onClick={handleDelete}
                                    className="w-full rounded-lg bg-error-600 py-2 text-white hover:bg-opacity-90"
                                >
                                    Ya, hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDeletePesanan;
