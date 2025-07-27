import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";

const ModalTambahBill = ({ isOpen, onClose }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        uuid: "",
        user_id: "",
        account_number: "",
        bank_name: "",
        account_holder_name: "",
        is_main: "0", 
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
            onSuccess: () => {
                onClose();
                reset();
                toast.success("Berhasil menambah data!");
            },
            onError: () => {
                toast.error("Gagal menambah data.");
            },
        });
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-200 ease-in-out dark:bg-white dark:bg-opacity-10 ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-0">
                <div
                    className={`relative mx-auto w-full max-w-2xl transform rounded-xl overflow-y-auto scrollbar-hidden max-h-[40rem] bg-white shadow-lg transition-transform duration-200 ease-in-out dark:bg-boxdark ${
                        isOpen
                            ? "translate-y-0 scale-100"
                            : "translate-y-10 scale-95"
                    }`}
                >
                    <div className="flex sticky z-10 bg-white top-0 items-center justify-between px-6 py-6 text-sm">
                        <h3 className="text-black text-base font-semibold">
                            Tambah Rekening
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            <IoIosClose size={25} />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="py-4 px-6 space-y-5"
                    >
                        {/* Account Number */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm">Nomor Rekening</label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                value={data.account_number}
                                placeholder="Masukkan nomor rekening"
                                onChange={(e) =>
                                    setData("account_number", e.target.value)
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

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full justify-center rounded-xl bg-primary-600 text-white p-2 font-medium hover:bg-primary-600/90"
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalTambahBill;
