import { Head } from "@inertiajs/react";
import HomeLayout from "@/Layouts/HomeLayout";
import Countdown from "react-countdown";
import {
    FiCheckCircle,
    FiChevronUp,
    FiClock,
    FiCopy,
    FiUpload,
} from "react-icons/fi";
import { FaUniversity } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCircleCheck } from "react-icons/fa6";
import { IoImageOutline } from "react-icons/io5";

export default function Payment() {
    const orderId = "#ODR2104912045";
    const nominal = 450000;

    // 24 jam dari sekarang
    const deadline = Date.now() + 24 * 60 * 60 * 1000;
    const [showDetails, setShowDetails] = useState(true);
    const [proof, setProof] = useState(null);
    const handleproof = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) setProof(uploadedFile);
    };
    const renderer = ({ hours, minutes, seconds }) => (
        <div className="flex justify-center gap-3 lg:gap-6 xl:gap-8 text-2xl sm:text-3xl lg:text-4xl font-medium text-black mt-3">
            <div className="flex flex-col items-center">
                <span>{String(hours).padStart(2, "0")}</span>
                <span className="text-sm sm:text-base mt-1 text-neutral-400 font-normal">
                    Jam
                </span>
            </div>
            <span>:</span>
            <div className="flex flex-col items-center">
                <span>{String(minutes).padStart(2, "0")}</span>
                <span className="text-sm sm:text-base mt-1 text-neutral-400 font-normal">
                    Menit
                </span>
            </div>
            <span>:</span>
            <div className="flex flex-col items-center">
                <span>{String(seconds).padStart(2, "0")}</span>
                <span className="text-sm sm:text-base mt-1 text-neutral-400 font-normal">
                    Detik
                </span>
            </div>
        </div>
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(nominal.toString());
        alert(
            `Rp ${nominal.toLocaleString(
                "id-ID"
            )} berhasil disalin ke clipboard`
        );
    };
    const accountNumber = "12412440285124";
    const accountName = "Toko mber";

    const handleCopyAccount = () => {
        navigator.clipboard.writeText(accountNumber);
        alert(`Nomor rekening ${accountNumber} berhasil disalin`);
    };
    const products = [
        {
            id: 1,
            name: "Nama produk",
            variant: "Varian X",
            qty: 1,
            price: 450000,
        },
        {
            id: 2,
            name: "Nama produk",
            variant: "Varian X",
            qty: 1,
            price: 450000,
        },
    ];

    const subtotal = 900000;
    const shipping = 12500;
    const serviceFee = 1000;
    const total = subtotal + shipping + serviceFee;
    return (
        <HomeLayout>
            <Head title="Pembayaran" />
            <section className="max-w-7xl mx-auto px-5 pt-10 pb-10">
                <div className="flex flex-col gap-5">
                    {" "}
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm text-center">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-normal text-gray-800 mb-2.5">
                            Terima Kasih,{" "}
                            <span className="font-semibold">Joan Doe!</span>
                        </h2>
                        <p className="text-sm text-neutral-500 mb-6">
                            Pesanan Anda telah kami terima! Mohon selesaikan
                            pembayaran dalam waktu 1x24 jam.
                        </p>

                        <div className="text-sm">ID Pesanan Anda:</div>
                        <div className="text-primary text-base sm:text-lg font-semibold mt-2 mb-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(orderId);
                                    alert(
                                        `${orderId} berhasil disalin ke clipboard`
                                    );
                                }}
                                className="text-primary-600 text-lg sm:text-xl lg:text-2xl font-medium"
                            >
                                {orderId}
                            </button>
                        </div>

                        <div className="inline-flex items-center gap-1 bg-warning-100 text-warning-600 text-sm rounded-full px-4 py-1 mb-1">
                            <FiClock size={14} /> Menunggu pembayaran
                        </div>

                        <div className=" text-error-500 mt-5 ">
                            Sisa waktu pembayaran
                        </div>

                        <Countdown date={deadline} renderer={renderer} />
                    </div>
                    <div className="bg-white rounded-xl p-5">
                        <h3 className="text-lg sm:text-xl font-medium mb-6">
                            Instruksi Pembayaran
                        </h3>

                        {/* Nominal */}
                        <div className="bg-primary-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <div className="text-sm sm:text-base text-neutral-900 mb-1.5 font-normal">
                                    Nominal
                                </div>
                                <div className="text-2xl sm:text-3xl text-primary-600 font-medium">
                                    Rp {nominal.toLocaleString("id-ID")}
                                </div>
                                <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 font-normal">
                                    Silakan transfer sesuai nominal yang tertera
                                </p>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="mt-4 sm:mt-0 bg-sky-500 text-neutral-50 text-xs sm:text-sm px-4 py-2 rounded-xl hover:bg-sky-600 transition inline-flex items-center gap-2"
                            >
                                <FiCopy size={16} />
                                Salin
                            </button>
                        </div>

                        {/* Tujuan transfer */}
                        <div className="mt-6">
                            <h2 className="text-base sm:text-lg text-neutral-900 mb-2 font-medium">
                                Tujuan transfer
                            </h2>

                            <div className="border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center">
                                <div className="flex items-center gap-3">
                                    <div className="mt-0.5 text-primary-600">
                                        <FaUniversity size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm sm:text-base text-neutral-800 mb-0.5">
                                            BCA Virtual Account
                                        </div>
                                        <div className="text-xs sm:text-sm text-neutral-600 font-normal">
                                            Atas nama : {accountName}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:items-end sm:gap-1 mt-4 sm:mt-0">
                                    <div className="text-sm sm:text-base text-neutral-500 font-medium">
                                        Nomor Rekening :
                                        <span className="ml-1 text-neutral-900">
                                            {accountNumber}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleCopyAccount}
                                        className="mt-2 w-fit sm:mt-0 bg-sky-500 text-neutral-50 text-xs sm:text-sm px-4 py-2 rounded-xl hover:bg-sky-600 transition inline-flex items-center gap-2"
                                    >
                                        <FiCopy size={16} />
                                        Salin
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 space-y-6">
                        {/* Rincian Pesanan */}
                        <div>
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => setShowDetails(!showDetails)}
                            >
                                <h3 className="text-lg sm:text-xl font-medium">
                                    Lihat Rincian Pesanan
                                </h3>
                                <FiChevronUp
                                    className={`transition-transform duration-300 ${
                                        showDetails ? "rotate-0" : "rotate-180"
                                    }`}
                                    size={20}
                                />
                            </div>

                            <AnimatePresence>
                                {showDetails && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 space-y-4">
                                            {products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="flex justify-between items-start gap-4"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                                                        <div>
                                                            <div className="text-sm text-neutral-900 font-medium">
                                                                {product.name}
                                                            </div>
                                                            <div className="text-sm text-neutral-600">
                                                                {
                                                                    product.variant
                                                                }
                                                            </div>
                                                            <div className="text-sm text-neutral-600">
                                                                Jumlah:{" "}
                                                                {product.qty}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-neutral-900">
                                                        Rp{" "}
                                                        {product.price.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Jarak hr atas dan bawah dibuat konsisten */}
                            <hr className="my-3 border-t border-neutral-200" />

                            {/* Detail total */}
                            <div className="space-y-2 text-sm text-neutral-700">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>
                                        Rp {subtotal.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Biaya pengiriman</span>
                                    <span>
                                        Rp {shipping.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Biaya layanan</span>
                                    <span>
                                        Rp {serviceFee.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            <hr className="my-3 border-t border-neutral-200" />

                            <div className="flex justify-between font-semibold text-neutral-900">
                                <span>Total</span>
                                <span>Rp {total.toLocaleString("id-ID")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5">
                        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3">
                            Sudah Bayar? Konfirmasi di Sini
                        </h3>

                        {proof ? (
                            <div className="relative group">
                                <img
                                    src={
                                        typeof proof === "string"
                                            ? proof
                                            : URL.createObjectURL(proof)
                                    }
                                    alt="Uploaded"
                                    className="h-64 w-full rounded-lg object-cover"
                                    width={300}
                                    height={300}
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    <label
                                        htmlFor="proof"
                                        className="bg-primary-600 text-sm text-white px-4 py-2 rounded-md shadow hover:bg-primary-600/90 transition cursor-pointer"
                                    >
                                        Pilih Gambar Lain
                                    </label>
                                </div>
                                <input
                                    id="proof"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleproof}
                                />
                            </div>
                        ) : (
                            <label className="border-gray-300 bg-white flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                <div className="flex flex-col items-center justify-center gap-1.5">
                                    <IoImageOutline
                                        size={37}
                                        className="text-neutral-500"
                                    />
                                    <p className="text-primary-600 text-base">
                                        Unggah Bukti Pembayaran
                                    </p>
                                    <p className="text-neutral-500 text-sm">
                                        Format: JPG, PNG (Maks. 5MB)
                                    </p>
                                </div>
                                <input
                                    id="proof"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleproof}
                                />
                            </label>
                        )}

                        <button
                            type="button"
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-3 rounded-xl transition"
                            disabled={!proof}
                        >
                            <FaCircleCheck size={18} />
                            Konfirmasi Pembayaran
                        </button>
                    </div>
                </div>
            </section>
        </HomeLayout>
    );
}
