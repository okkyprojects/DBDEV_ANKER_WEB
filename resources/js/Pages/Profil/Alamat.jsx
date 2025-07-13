import HomeLayout from "@/Layouts/HomeLayout";
import React, { useState } from "react";
import { FiUser, FiMapPin, FiLogOut } from "react-icons/fi";
import { Link, usePage } from "@inertiajs/react";
import { IoHome } from "react-icons/io5";
import ModalTambahAlamat from "@/Components/Modal/Profil/ModalTambahAlamat";
import { BsShopWindow } from "react-icons/bs";
import { GoLock } from "react-icons/go";

const Alamat = () => {
    const [showModalTambah, setShowModalTambah] = useState(false);
    const currentUrl = usePage().url;

    return (
        <HomeLayout>
            <section className="max-w-7xl mx-auto px-5 py-10 space-y-6">
                <h2 className="text-2xl font-semibold text-neutral-900">
                    Profil
                </h2>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="bg-white w-full lg:w-1/4 rounded-xl p-5 text-center h-fit">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-24 h-24 bg-neutral-200 rounded-full" />
                            <div className="flex flex-col gap-1">
                                <p className="text-lg md:text-xl text-neutral-900">
                                    Joan Doe
                                </p>
                                <p className="text-sm text-neutral-500">
                                    email@example.com
                                </p>
                            </div>
                            <div className="mt-4 flex flex-col gap-2 text-sm text-left w-full">
                                <Link
                                    href="/profil/informasi-pribadi"
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                        currentUrl ===
                                        "/profil/informasi-pribadi"
                                            ? "bg-blue-50 text-primary-600 font-medium"
                                            : "text-neutral-700 hover:text-primary-600"
                                    }`}
                                >
                                    <FiUser size={18} />
                                    Informasi Pribadi
                                </Link>
                                <Link
                                    href="/profil/informasi-toko"
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                        currentUrl === "/profil/informasi-toko"
                                            ? "bg-blue-50 text-primary-600 font-medium"
                                            : "text-neutral-700 hover:text-primary-600"
                                    }`}
                                >
                                    <BsShopWindow size={18} />
                                    Informasi Toko
                                </Link>
                                <Link
                                    href="/profil/ubah-kata-sandi"
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                        currentUrl === "/profil/ubah-kata-sandi"
                                            ? "bg-blue-50 text-primary-600 font-medium"
                                            : "text-neutral-700 hover:text-primary-600"
                                    }`}
                                >
                                    <GoLock size={18} />
                                    Ubah Kata Sandi
                                </Link>
                                <Link
                                    href="/profil/alamat"
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                        currentUrl === "/profil/alamat"
                                            ? "bg-blue-50 text-primary-600 font-medium"
                                            : "text-neutral-700 hover:text-primary-600"
                                    }`}
                                >
                                    <FiMapPin size={18} />
                                    Daftar Alamat
                                </Link>
                                <button className="text-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
                                    <FiLogOut size={18} />
                                    Log out
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-5 bg-white p-5 rounded-xl">
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <h3 className="text-lg sm:text-xl font-medium">
                                Daftar Alamat
                            </h3>
                            <button
                                onClick={() => setShowModalTambah(true)}
                                className="bg-primary-600  w-full sm:w-fit text-center justify-center hover:bg-primary-600/90 text-white px-4 py-1 text-sm rounded-xl flex items-center gap-2"
                            >
                                <span className="text-lg">+</span> Tambah alamat
                                baru
                            </button>
                        </div>
                        <div className="border border-primary-600 bg-primary-50 p-5 rounded-xl relative">
                            <div className="absolute top-4 right-4 bg-primary-200 text-primary-800 text-xs px-3 py-1 rounded-full">
                                Utama
                            </div>
                            <div className=" text-sm text-neutral-800">
                                <div className="flex items-center gap-3">
                                    {" "}
                                    <IoHome
                                        size={20}
                                        className="text-primary-600"
                                    />
                                    <p className="font-semibold ">Rumah</p>
                                </div>
                                <div className="text-neutral-500">
                                    <p className="py-3">
                                        Joan Doe{" "}
                                        <span className="text-primary-600">
                                            •
                                        </span>{" "}
                                        +62888-8888-8888
                                    </p>
                                    <p>
                                        JL. Kemana saja No 99
                                        <br />
                                        Kecamatan Mana, Kabupaten Saja
                                        <br />
                                        Jawa Timur [Kode pos]
                                    </p>
                                    <div className="mt-3">
                                        <button className="text-sm text-primary-600">
                                            Ubah alamat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border p-5 rounded-xl text-sm text-neutral-800">
                            <div className="flex items-center gap-3">
                                {" "}
                                <IoHome
                                    size={20}
                                    className="text-primary-600"
                                />
                                <p className="font-semibold ">Rumah</p>
                            </div>
                            <div className="text-neutral-500">
                                <p className="py-3">
                                    Joan Doe{" "}
                                    <span className="text-primary-600">•</span>{" "}
                                    +62888-8888-8888
                                </p>
                                <p>
                                    JL. Kemana saja No 99
                                    <br />
                                    Kecamatan Mana, Kabupaten Saja
                                    <br />
                                    Jawa Timur [Kode pos]
                                </p>
                                <div className="mt-3 flex flex-wrap text-neutral-300 gap-3 text-sm">
                                    <button className="text-primary-600">
                                        Ubah alamat
                                    </button>
                                    |
                                    <button className="text-neutral-800">
                                        Hapus
                                    </button>
                                    |
                                    <button className="text-primary-600">
                                        Jadikan sebagai alamat utama
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showModalTambah && (
                        <div
                            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                                showModalTambah
                                    ? "animate-fadeIn"
                                    : "animate-fadeOut"
                            }`}
                        >
                            <div className="bg-white p-6 rounded shadow-lg">
                                <ModalTambahAlamat
                                    isOpen={showModalTambah}
                                    onClose={() => {
                                        setShowModalTambah(!showModalTambah);
                                    }}
                                    onApplyFilter={() => {}}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </HomeLayout>
    );
};

export default Alamat;
