import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import { IoImageOutline } from "react-icons/io5";

const ModalTambahRole = ({ isOpen, onClose }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
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

        post(route("setting.role.store"), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
                toast.success("Berhasil menambah role!");
            },
            onError: () => {
                toast.error("Gagal menambah role.");
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setData("img", file);
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center  bg-black bg-opacity-20 transition-opacity duration-200 ease-in-out dark:bg-white dark:bg-opacity-10 ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0  flex items-center justify-center px-4 sm:px-0 ">
                <div
                    className={`relative mx-auto w-full max-w-2xl transform rounded-xl overflow-y-auto scrollbar-hidden max-h-[40rem] bg-white shadow-lg transition-transform duration-200 ease-in-out dark:bg-boxdark ${
                        isOpen
                            ? "translate-y-0 scale-100"
                            : "translate-y-10 scale-95"
                    }`}
                >
                    <div className="px-6 pb-4 text-sm">
                        <div className="mb-4 flex items-center justify-between sticky z-10 bg-white top-0 py-4">
                            <h3 className="text-black text-base font-semibold">
                                Tambah Role
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
                            className="py-4 space-y-5"
                        >
                            {/* Nama */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Nama</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.name}
                                    placeholder="Masukkan nama"
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
        </div>
    );
};

export default ModalTambahRole;
