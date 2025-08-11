import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { HiOutlineUpload } from "react-icons/hi";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

const ModalImport = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) return alert("Pilih file terlebih dahulu");

        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        router.post(route("produk.product.import"), formData, {
            onSuccess: () => {
                toast.success("Produk berhasil ditambahkan");
                setFile(null);
                onClose();
                setIsLoading(false);
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-200 ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <IoIosClose size={25} />
                </button>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Import Produk & Variant
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih File CSV/XLSX
                        </label>
                        <input
                            type="file"
                            accept=".csv,.xlsx"
                            onChange={handleFileChange}
                            className="w-full border rounded-xl px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:ring-0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Pastikan format sesuai template.{" "}
                            <a
                                href="/files/product.xlsx"
                                className="text-primary-600 hover:underline"
                                download
                            >
                                Unduh template
                            </a>
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex items-center justify-center gap-2 text-sm w-full py-2 rounded-xl transition text-white ${
                            isLoading
                                ? "bg-primary-400 cursor-not-allowed"
                                : "bg-primary-600 hover:bg-primary-600/90"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Mengunggah...
                            </>
                        ) : (
                            <>
                                <HiOutlineUpload size={18} />
                                Upload
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalImport;
