import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { useForm, router, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import { IoImageOutline } from "react-icons/io5";

const ModalEditRole = ({ isOpen, onClose, user }) => {
    const { permissions } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        id: user?.id || "",
        name: user?.name || "",
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
            forceFormData: true,
            onSuccess: () => {
                toast.success("Berhasil mengubah role!");
                onClose();
                reset();
            },
            onError: () => {
                toast.error("Gagal mengubah role.");
            },
        });
    };

    const handleDelete = () => {
        if (confirm("Yakin ingin menghapus role?")) {
            router.delete(route("setting.role.destroy", user?.id), {
                onSuccess: () => {
                    toast.success("Berhasil menghapus role!");
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal menghapus role.");
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
                                Edit User
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
                                <label className="text-sm">Nama</label>
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

                            {/* Action buttons */}
                            <div className="flex items-center justify-between pt-4 border-t mt-4">
                                {permissions.includes("role-delete") && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="text-red-600 text-sm font-medium hover:underline"
                                    >
                                        Hapus
                                    </button>
                                )}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-xl border text-sm px-4 py-2 text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                                    >
                                        Batal
                                    </button>
                                    {permissions.includes("role-update") && (
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

export default ModalEditRole;
