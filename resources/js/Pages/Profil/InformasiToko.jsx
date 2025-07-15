import HomeLayout from "@/Layouts/HomeLayout";
import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FiUser, FiMapPin, FiLogOut, FiUpload, FiTrash2 } from "react-icons/fi";
import { PiNotePencilDuotone } from "react-icons/pi";
import ModalEditInformasiPibadi from "@/Components/Modal/Profil/ModalEditInformasiPribadi";
import { FaCheck } from "react-icons/fa6";
import { BsShopWindow } from "react-icons/bs";
import { GoLock } from "react-icons/go";

const InformasiToko = () => {
    const [showModalEdit, setShowModalEdit] = useState(false);
    const currentUrl = usePage().url;
    const { auth } = usePage().props;
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
                                    {auth?.user?.name}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    {auth?.user?.email}
                                </p>
                            </div>
                            <div className="mt-4 flex flex-col gap-2 text-sm text-left w-full">
                                <Link
                                    href="/profil/informasi-pribadi"
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2
                            ${
                                currentUrl === "/profil/informasi-pribadi"
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
                                    Informasi Toko
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowModalEdit(!showModalEdit);
                                    }}
                                    className="bg-primary-600 w-full sm:w-fit text-center justify-center hover:bg-primary-600/90
                            text-white px-4 py-1.5 text-sm rounded-xl flex items-center gap-2"
                                >
                                    <PiNotePencilDuotone size={19} />
                                    Edit Toko
                                </button>
                            </div>
                            <div className="grid grid-cols-1  gap-y-4 gap-x-10 text-sm text-neutral-700">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-neutral-500">
                                        Nama Toko
                                    </p>
                                    <p className="text-neutral-900">
                                        {auth?.user?.seller?.seller_name}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-neutral-500">
                                        Lokasi Toko
                                    </p>
                                    <p className="text-neutral-900">
                                        {auth?.user?.seller?.province?.nama},{" "}
                                        {auth?.user?.seller?.city?.nama}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-neutral-500">
                                        Deskripsi Toko
                                    </p>
                                    <p className="text-neutral-900">
                                        Lorem ipsum dolor sit amet consectetur.
                                        Sed ac nisl urna ullamcorper pulvinar
                                        cras. Diam sit elit iaculis in bibendum
                                        augue. Tristique lacus condimentum odio
                                        eu volutpat.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-neutral-500">
                                        Status
                                    </p>
                                    <div className="flex gap-1.5 items-center w-fit bg-success-600 text-neutral-50 px-5 py-1.5 rounded-xl">
                                        <FaCheck />
                                        Terverifikasi
                                    </div>
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

export default InformasiToko;
