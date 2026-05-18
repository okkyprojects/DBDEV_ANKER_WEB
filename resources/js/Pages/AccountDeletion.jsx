import React from "react";
import { Head } from "@inertiajs/react";

export default function AccountDeletion() {
    return (
        <>
            <Head title="Penghapusan Akun - Anker" />

            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 md:p-10">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6">
                        Penghapusan Akun dan Data Pengguna
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Pengguna memiliki hak untuk mengajukan penghapusan akun
                        dan data pribadi yang tersimpan dalam aplikasi{" "}
                        <span className="font-semibold">Anker</span>.
                    </p>

                    {/* Cara */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">
                            Cara Mengajukan Penghapusan Akun
                        </h2>
                        <p className="text-gray-600 mb-3">
                            Untuk mengajukan permintaan penghapusan akun,
                            pengguna dapat menghubungi kami melalui:
                        </p>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p className="font-medium">
                                WhatsApp:{" "}
                                <a
                                    href="https://wa.me/6281336581930"
                                    className="text-green-600 underline"
                                >
                                    +62 813-3658-1930
                                </a>
                            </p>
                        </div>

                        <p className="text-gray-600 mb-2">
                            Dengan menyertakan informasi berikut:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-1">
                            <li>Nama lengkap</li>
                            <li>Email akun terdaftar</li>
                            <li>Alasan penghapusan (opsional)</li>
                        </ul>
                    </section>

                    {/* Proses */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">
                            Proses Penghapusan
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-1">
                            <li>
                                Permintaan akan diproses maksimal dalam 3 (tiga)
                                hari kerja sejak diterima
                            </li>
                            <li>
                                Pengguna akan menerima konfirmasi setelah proses
                                selesai
                            </li>
                        </ul>
                    </section>

                    {/* Data dihapus */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">
                            Data yang Akan Dihapus
                        </h2>
                        <p className="text-gray-600 mb-2">
                            Setelah permintaan diproses:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-1">
                            <li>
                                Data akun (nama, email, informasi profil) akan
                                dihapus secara permanen
                            </li>
                            <li>
                                Data autentikasi pengguna akan dihapus dari
                                sistem
                            </li>
                        </ul>
                    </section>

                    {/* Data disimpan */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">
                            Data yang Mungkin Tetap Disimpan
                        </h2>

                        <p className="text-gray-600 mb-2">
                            Beberapa data dapat tetap disimpan untuk jangka
                            waktu tertentu, termasuk:
                        </p>

                        <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
                            <li>Riwayat transaksi</li>
                            <li>Data keuangan atau pembayaran</li>
                        </ul>

                        <p className="text-gray-600 mb-2">
                            Penyimpanan ini dilakukan sesuai dengan:
                        </p>

                        <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
                            <li>Kewajiban hukum yang berlaku</li>
                            <li>Kebutuhan audit dan pelaporan</li>
                        </ul>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-gray-700">
                            Data tersebut akan disimpan maksimal selama{" "}
                            <span className="font-semibold">
                                5 (lima) tahun
                            </span>{" "}
                            atau sesuai regulasi yang berlaku, setelah itu akan
                            dihapus secara otomatis.
                        </div>
                    </section>

                    {/* Catatan */}
                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            Catatan Penting
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-1">
                            <li>
                                Setelah akun dihapus, pengguna tidak dapat
                                mengakses kembali akun tersebut
                            </li>
                            <li>
                                Proses ini bersifat permanen dan tidak dapat
                                dibatalkan
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );
}
