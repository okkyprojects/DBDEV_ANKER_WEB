import { Link, Head } from "@inertiajs/react";
import HomeLayout from "@/Layouts/HomeLayout";
import { FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import { banks } from "@/Dummy/dummy";
import Select from "react-select";
import { styles } from "@/Config/global";

export default function Checkout() {
    const [selectedBank, setSelectedBank] = useState("bca");
    return (
        <HomeLayout>
            <Head title="Welcome" />
            <section className="max-w-7xl mx-auto px-5 pt-10 pb-10">
                <h2 className="text-xl sm:text-2xl  font-medium text-neutral-900 mb-5">
                    Checkout
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="col-span-full md:col-span-8 flex flex-col gap-5">
                        <div className="rounded-xl bg-white p-5">
                            <h2 className="text-lg sm:text-xl font-medium mb-6">
                                Informasi Kontak
                            </h2>
                            <div className="space-y-5">
                                <div className="flex flex-col gap-2 text-sm">
                                    <label htmlFor="">Nama Penerima</label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan Nama"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 text-sm">
                                    <label htmlFor="">Nomor HP</label>
                                    <input
                                        type="tel"
                                        placeholder="Masukkan Nomor HP"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-5">
                            <h2 className="text-lg sm:text-xl font-medium mb-6">
                                Alamat Penerima
                            </h2>
                            <div className="space-y-5">
                                <div className="flex flex-col gap-2 text-sm">
                                    <label htmlFor="">Alamat</label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan alamat penerima"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 text-sm">
                                    <label htmlFor="">Nomor HP</label>
                                    <input
                                        type="tel"
                                        placeholder="Masukkan Nomor HP"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
                                    <div className="flex flex-col gap-2 text-sm">
                                        <label htmlFor="">Provinsi</label>
                                        <select className="px-3 py-2 rounded-xl border border-neutral-400 text-sm text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none">
                                            <option value="">
                                                Pilih Provinsi
                                            </option>
                                            <option value="Jawa Timur">
                                                Jawa Timur
                                            </option>
                                            <option value="Jawa Barat">
                                                Jawa Barat
                                            </option>
                                            <option value="DKI Jakarta">
                                                DKI Jakarta
                                            </option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2 text-sm">
                                        <label htmlFor="">Kota</label>
                                        <select className="px-3 py-2 rounded-xl border border-neutral-400 text-sm text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none">
                                            <option value="">Pilih Kota</option>
                                            <option value="Malang">
                                                Malang
                                            </option>
                                            <option value="Bandung">
                                                Bandung
                                            </option>
                                            <option value="Jakarta Selatan">
                                                Jakarta Selatan
                                            </option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2 text-sm">
                                        <label htmlFor="">Kode Pos</label>
                                        <input
                                            type="text"
                                            placeholder="Masukkan Kode Pos"
                                            className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>{" "}
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
                                {[1, 2].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center gap-4"
                                    >
                                        <div className="w-14 h-14 bg-neutral-200 rounded-lg flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral-900">
                                                Nama produk
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                Varian X
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                Jumlah : 1
                                            </p>
                                        </div>
                                        <p className="text-sm text-neutral-900 font-medium whitespace-nowrap flex items-center h-full">
                                            Rp 450.000
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
                </div>
            </section>
        </HomeLayout>
    );
}
