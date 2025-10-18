import { useEffect } from "react";
import { toast } from "react-toastify";
import { router, useForm } from "@inertiajs/react";
import moment from "moment";

const ModalBatalPesanan = ({ isOpen, onClose, item, aksi }) => {
    const { data, setData, post, processing, reset } = useForm({
        note_transaction: "",
    });

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    const getAksiLabel = (aksi) => {
        switch (aksi) {
            case 0:
                return "Belum Dibayar";
            case 1:
                return "Konfirmasi Pembayaran";
            case 2:
                return "Pesanan Diproses";
            case 3:
                return "Pesanan Dikirim";
            case 4:
                return "Pesanan Selesai";
            case 5:
                return "Dibatalkan";
            default:
                return "Tidak Diketahui";
        }
    };

    if (!isOpen) return null;

    const handleUpdateStatus = () => {
        const now = moment().format("YYYY-MM-DD HH:mm:ss");

        setData({
            ...data,
            status: aksi,
            ...(aksi === 1 && { paid_at: now }),
            ...(aksi === 2 && { processing_at: now }),
            ...(aksi === 3 && { shipping_at: now }),
            ...(aksi === 4 && { completed_at: now }),
            ...(aksi === 5 && { failed_at: now }),
        });

        post(route("pesanan.manajemen.update", item.uuid), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    `Status pesanan ${
                        item.transaction_code
                    } berhasil diubah menjadi ${getAksiLabel(aksi)}!`
                );
                reset();
                onClose();
            },
            onError: () => {
                toast.error("Gagal mengubah status pesanan.");
            },
        });
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            <div className="w-full max-w-md rounded-2xl bg-white shadow-lg transition-all duration-200">
                <div className="flex flex-col items-center px-6 py-6 text-center">
                    <img
                        src="/images/delete/delete.svg"
                        alt="Confirm"
                        className="mb-3 w-20"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                        Konfirmasi Pesanan
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Apakah Anda yakin ingin mengubah status pesanan{" "}
                        <span className="font-semibold text-gray-700">
                            {item?.transaction_code}
                        </span>{" "}
                        menjadi{" "}
                        <span className="font-semibold text-gray-700">
                            {getAksiLabel(aksi)}
                        </span>
                        ?
                    </p>

                    {aksi === 5 && (
                        <div className="mt-4 w-full text-left">
                            <label
                                htmlFor="note_transaction"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Keterangan Pembatalan Pesanan
                            </label>
                            <textarea
                                id="note_transaction"
                                placeholder="Masukkan keterangan pembatalan pesanan..."
                                rows={5}
                                className="px-3 py-2 rounded-xl w-full text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none resize-none"
                                value={data.note_transaction}
                                onChange={(e) =>
                                    setData("note_transaction", e.target.value)
                                }
                                required
                            ></textarea>
                        </div>
                    )}

                    <div className="mt-6 grid w-full grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="w-full rounded-lg border text-sm border-gray-300 bg-gray-100 py-2 text-gray-700 hover:bg-gray-200"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdateStatus}
                            disabled={processing}
                            className="w-full rounded-lg text-sm bg-primary-600 py-2 text-white hover:bg-primary-700 disabled:opacity-70"
                        >
                            {processing ? "Menyimpan..." : "Ya, simpan"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalBatalPesanan;
