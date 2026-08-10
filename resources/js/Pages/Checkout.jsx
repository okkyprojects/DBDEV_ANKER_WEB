import { Link, Head, router } from "@inertiajs/react";
import { useCart } from "@/Context/CartContext";
import HomeLayout from "@/Layouts/HomeLayout";
import { FiChevronDown } from "react-icons/fi";
import { useEffect, useState } from "react";
import { banks } from "@/Dummy/dummy";
import Select from "react-select";
import { styles } from "@/Config/global";
import { IoHome } from "react-icons/io5";
import ModalGantiAlamat from "@/Components/Modal/Checkout/ModalGantiAlamat";
import ModalTambahAlamat from "@/Components/Modal/Profil/ModalTambahAlamat";
import { formatRupiah } from "@/Utils/utils";

export default function Checkout() {
    const [showModalGantiAlamat, setShowModalGantiAlamat] = useState(false);
    const [showModalTambahAlamat, setShowModalTambahAlamat] = useState(false);
    const [selectedBank, setSelectedBank] = useState("bca");
    const { selectedVariants } = useCart();

    if (selectedVariants.length === 0) {
        router.visit("/cart");
    }
    return (
        <HomeLayout>
            <Head title="Checkout" />
            <section className="max-w-7xl mx-auto px-5 pt-10 pb-10">
                <h2 className="text-xl sm:text-2xl  font-medium text-neutral-900 mb-5">
                    Checkout
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="col-span-full md:col-span-8 flex flex-col gap-5">
                        <div className="rounded-xl bg-white p-5">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg sm:text-xl font-medium ">
                                    Alamat Penerima
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModalGantiAlamat(true);
                                    }}
                                    className="rounded-xl px-4 py-1.5 text-sm border text-neutral-500"
                                >
                                    Ganti Alamat
                                </button>
                            </div>
                            {/* <button
                                onClick={() => setShowModalTambahAlamat(true)}
                                className="flex gap-2 justify-center items-center px-5 py-2 rounded-lg border w-full border-primary-600 text-primary-600"
                            >
                                <span>+</span>Tambah Alamat
                            </button> */}
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-5">
                            <h2 className="text-lg sm:text-xl font-medium mb-6">
                                Pengiriman{" "}
                            </h2>
                            <div className="space-y-5">
                                <div className="border border-neutral-400 rounded-xl p-5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-neutral-700 font-medium text-base">
                                                Reguler
                                            </p>
                                            <p className="text-primary-600 font-semibold text-base">
                                                Rp 25.000
                                            </p>
                                            <p className="text-neutral-400 font-normal text-sm">
                                                Estimasi tiba besok - 3 Juli
                                            </p>
                                        </div>
                                        <button>
                                            <FiChevronDown
                                                size={20}
                                                className="text-neutral-700"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-5">
                            <h2 className="text-lg sm:text-xl font-medium mb-6">
                                Metode Pembayaran
                            </h2>
                            <Select
                                id="bank"
                                name="bank"
                                options={banks.map((bank) => ({
                                    value: bank.id,
                                    label: bank.name,
                                }))}
                                value={banks
                                    .map((bank) => ({
                                        value: bank.id,
                                        label: bank.name,
                                    }))
                                    .find(
                                        (option) =>
                                            option.value === selectedBank
                                    )}
                                onChange={(option) =>
                                    setSelectedBank(option.value)
                                }
                                styles={styles}
                                classNamePrefix="react-select"
                                isSearchable={true}
                                placeholder="Pilih Bank"
                            />
                        </div>
                    </div>
                    <div className="col-span-full md:col-span-4">
                        <div className="p-5 rounded-xl bg-white sticky top-32 w-full max-w-md mx-auto">
                            <p className="text-lg font-semibold mb-5">
                                Ringkasan Pesanan
                            </p>
                            <div className="space-y-5">
                                <div className="flex items-center gap-2.5">
                                    {" "}
                                    <div className="w-8 h-8 bg-neutral-200 rounded-full flex-shrink-0"></div>
                                    <p className="text-sm font-medium text-neutral-900">
                                        Nama Toko
                                    </p>
                                </div>
                                {selectedVariants?.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center gap-4"
                                    >
                                        <img
                                            src={item?.img}
                                            alt={item?.name}
                                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral-900">
                                                {item?.product?.name || "-"}
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                Varian: {item?.name}
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                Jumlah:{" "}
                                                {item?.pivot?.quantity || 1}
                                            </p>
                                        </div>
                                        <p className="text-sm text-neutral-900 font-medium whitespace-nowrap flex items-center h-full">
                                            {formatRupiah(item?.price)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <hr className="my-5 border-t border-neutral-200" />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-neutral-700">
                                    <p>Subtotal</p>
                                    <p>Rp 900.000</p>
                                </div>
                                <div className="flex justify-between text-neutral-700">
                                    <p>Biaya pengiriman</p>
                                    <p>Rp 12.500</p>
                                </div>
                                <div className="flex justify-between text-neutral-700">
                                    <p>Biaya layanan</p>
                                    <p>Rp 1.000</p>
                                </div>
                            </div>

                            <hr className="my-5 border-t border-neutral-200" />
                            <div className="flex justify-between items-center text-base font-semibold">
                                <p>Total</p>
                                <p>Rp 913.500</p>
                            </div>
                            <button className="mt-5 w-full bg-[#00AEEF] hover:bg-[#0095cc] transition-colors duration-200 text-white font-medium py-2 rounded-xl text-sm sm:text-base shadow-md">
                                Checkout
                            </button>
                        </div>
                    </div>
                    {showModalGantiAlamat && (
                        <div
                            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                                showModalGantiAlamat
                                    ? "animate-fadeIn"
                                    : "animate-fadeOut"
                            }`}
                        >
                            <div className="bg-white p-6 rounded shadow-lg">
                                <ModalGantiAlamat
                                    isOpen={showModalGantiAlamat}
                                    onClose={() => {
                                        setShowModalGantiAlamat(
                                            !showModalGantiAlamat
                                        );
                                    }}
                                    onApplyFilter={() => {}}
                                />
                            </div>
                        </div>
                    )}
                    {showModalTambahAlamat && (
                        <div
                            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                                showModalTambahAlamat
                                    ? "animate-fadeIn"
                                    : "animate-fadeOut"
                            }`}
                        >
                            <div className="bg-white p-6 rounded shadow-lg">
                                <ModalTambahAlamat
                                    isOpen={showModalTambahAlamat}
                                    onClose={() => {
                                        setShowModalTambahAlamat(
                                            !showModalTambahAlamat
                                        );
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
}
