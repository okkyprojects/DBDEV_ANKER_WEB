import HomeLayout from "@/Layouts/HomeLayout";
import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FiUser, FiMapPin, FiLogOut, FiUpload, FiTrash2 } from "react-icons/fi";
import { PiNotePencilDuotone } from "react-icons/pi";
import ModalEditInformasiPibadi from "@/Components/Modal/Profil/ModalEditInformasiPribadi";
import { GoLock } from "react-icons/go";
import { BsShopWindow } from "react-icons/bs";

const InformasiPribadi = ({ auth }) => {
    const [showModalEdit, setShowModalEdit] = useState(false);
    const currentUrl = usePage().url;
    return (
        <HomeLayout>
            <section className="max-w-7xl mx-auto px-5 py-10 space-y-5">
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
                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-xl p-5">
                            <div className="flex flex-col sm:flex-row gap-3 mb-5 justify-between items-center">
                                <h3 className="text-lg sm:text-xl font-medium">
                                    Informasi Pribadi
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowModalEdit(!showModalEdit);
                                    }}
                                    className="bg-primary-600  w-full sm:w-fit text-center justify-center hover:bg-primary-600/90 text-white px-4 py-1.5 text-sm rounded-xl flex items-center gap-2"
                                >
                                    <PiNotePencilDuotone size={19} />
                                    Edit Profil
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10 text-sm text-neutral-700">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-neutral-500">
                                        Nama Lengkap
                                    </p>
                                    <p
                                        className={`${
                                            !auth?.user?.name
                                                ? "text-gray-400 italic"
                                                : "text-neutral-900"
                                        }`}
                                    >
                                        {auth?.user?.name || "Data Belum Diset"}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-neutral-500">
                                        Email
                                    </p>
                                    <p
                                        className={`${
                                            !auth?.user?.email
                                                ? "text-gray-400 italic"
                                                : "text-neutral-900"
                                        }`}
                                    >
                                        {auth?.user?.email ||
                                            "Data Belum Diset"}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-neutral-500">
                                        No. Telepon/HP
                                    </p>
                                    <p
                                        className={`${
                                            !auth?.user?.phone_number
                                                ? "text-gray-400 italic"
                                                : "text-neutral-900"
                                        }`}
                                    >
                                        {auth?.user?.phone_number ||
                                            "Data Belum Diset"}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-neutral-500">
                                        Jenis Kelamin
                                    </p>
                                    <p
                                        className={`${
                                            !auth?.user?.gender
                                                ? "text-gray-400 italic"
                                                : "text-neutral-900"
                                        }`}
                                    >
                                        {auth?.user?.gender === "L"
                                            ? "Laki-laki"
                                            : auth?.user?.gender === "P"
                                            ? "Perempuan"
                                            : "Data Belum Diset"}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-neutral-500">
                                        Tanggal Lahir
                                    </p>
                                    <p
                                        className={`${
                                            !auth?.user?.dob
                                                ? "text-gray-400 italic"
                                                : "text-neutral-900"
                                        }`}
                                    >
                                        {auth?.user?.dob
                                            ? new Date(
                                                  auth?.user?.dob
                                              ).toLocaleDateString()
                                            : "Data Belum Diset"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg sm:text-xl font-medium mb-5">
                                Foto Profil
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                <div className="w-24 h-24 bg-neutral-200 rounded-full overflow-hidden">
                                    <img
                                        src={
                                            auth?.user?.img
                                                ? `${window.location.origin}/${auth.user.img}`
                                                : "/images/profile/profil.jpg"
                                        }
                                        alt="Foto Profil"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    {" "}
                                    <div className="space-x-2">
                                        <button className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-4 py-2 rounded-xl font-normal inline-flex items-center gap-2">
                                            <FiUpload />
                                            Unggah foto
                                        </button>
                                        <button className="border text-sm px-4 py-2 rounded-xl font-normal text-neutral-700 hover:bg-neutral-100 inline-flex items-center gap-2">
                                            <FiTrash2 />
                                            Hapus foto
                                        </button>
                                    </div>
                                    <p className="text-xs text-neutral-500 font-light mt-4">
                                        Ukuran maksimal 10 MB <br />
                                        Tipe file yang didukung: .JPG, .JPEG,
                                        .PNG, .SVG, .WEBP
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showModalEdit && (
                        <div
                            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                                showModalEdit
                                    ? "animate-fadeIn"
                                    : "animate-fadeOut"
                            }`}
                        >
                            <div className="bg-white p-6 rounded shadow-lg">
                                <ModalEditInformasiPibadi
                                    isOpen={showModalEdit}
                                    onClose={() => {
                                        setShowModalEdit(!showModalEdit);
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

export default InformasiPribadi;
