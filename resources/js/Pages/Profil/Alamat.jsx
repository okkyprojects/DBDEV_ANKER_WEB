import HomeLayout from "@/Layouts/HomeLayout";
import React, { useState } from "react";
import { FiUser, FiMapPin, FiLogOut } from "react-icons/fi";
import { Link, usePage } from "@inertiajs/react";
import ModalTambahAlamat from "@/Components/Modal/Profil/ModalTambahAlamat";
import { BsBuildingsFill, BsShopWindow } from "react-icons/bs";
import { GoLock } from "react-icons/go";
import { IoHome } from "react-icons/io5";

const Alamat = ({ data }) => {
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
                        {data?.addresses?.map((item) => (
                            <div
                                key={item.uuid}
                                className={`border p-5 rounded-xl relative ${
                                    item.is_main
                                        ? "border-primary-600 bg-primary-50"
                                        : ""
                                }`}
                            >
                                {item.is_main == 1 && (
                                    <div className="absolute top-4 right-4 bg-primary-200 text-primary-800 text-xs px-3 py-1 rounded-full">
                                        Utama
                                    </div>
                                )}

                                <div className="text-sm text-neutral-800">
                                    <div className="flex items-center gap-3">
                                        {item.category === "kantor" ? (
                                            <BsBuildingsFill
                                                size={20}
                                                className="text-primary-600"
                                            />
                                        ) : (
                                            <IoHome
                                                size={20}
                                                className="text-primary-600"
                                            />
                                        )}
                                        <p className="font-semibold capitalize">
                                            {item.category}
                                        </p>
                                    </div>

                                    <div className="text-neutral-500">
                                        <p className="py-3">
                                            {item.name}{" "}
                                            <span className="text-primary-600">
                                                •
                                            </span>{" "}
                                            {item.phone_number}
                                        </p>
                                        <p>
                                            {item.address}
                                            <br />
                                            {item.district
                                                ? item.district.nama + ", "
                                                : ""}
                                            {item.city ? item.city.nama : ""},{" "}
                                            {item.province
                                                ? item.province.nama
                                                : ""}{" "}
                                            [{item.postal_code}]
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                                            <button className="text-primary-600">
                                                Ubah alamat
                                            </button>

                                            {!item.is_main && (
                                                <>
                                                    <span className="text-neutral-300">
                                                        |
                                                    </span>
                                                    <button className="text-neutral-800">
                                                        Hapus
                                                    </button>
                                                    <span className="text-neutral-300">
                                                        |
                                                    </span>
                                                    <button className="text-primary-600">
                                                        Jadikan sebagai alamat
                                                        utama
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
