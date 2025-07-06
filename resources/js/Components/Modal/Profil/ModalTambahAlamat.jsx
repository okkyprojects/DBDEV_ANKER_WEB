import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

const ModalTambahAlamat = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        provinsi: "",
        kota: "",
        kecamatan: "",
        jenisAlamat: "",
        kodePos: "",
        alamat: "",
        catatan: "",
        utama: false,
    });

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleNext = () => {
        if (form.provinsi && form.kota && form.kecamatan) {
            setStep(2);
        } else {
            alert("Semua lokasi wajib dipilih!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.jenisAlamat || !form.kodePos || !form.alamat) {
            alert("Semua data wajib diisi!");
            return;
        }

        console.log("DATA DIKIRIM:", form);
        onClose();
        setStep(1);
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-200 ease-in-out ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="relative w-full max-w-lg rounded-xl bg-white shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 ">
                        <h3 className="text-base font-semibold">
                            Tambah Alamat Baru
                        </h3>
                        <button onClick={onClose}>
                            <IoIosClose size={28} />
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 py-4  text-sm text-center">
                        <div
                            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 cursor-pointer"
                            onClick={() => setStep(1)}
                        >
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                    step === 1
                                        ? "bg-primary-600 text-white border border-primary-600"
                                        : "bg-primary-50 text-primary-600 border border-primary-600"
                                }`}
                            >
                                1
                            </div>
                            <span className="text-neutral-700">
                                Tentukan lokasi anda
                            </span>
                        </div>
                        <div className="hidden sm:block w-8 border-t border-neutral-400" />
                        <div
                            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 cursor-pointer"
                            onClick={() => step === 2 && setStep(2)}
                        >
                            <div
                                className={`w-7 h-7 rounded-full  flex items-center justify-center ${
                                    step === 2
                                        ? "bg-primary-600 text-white border border-primary-600"
                                        : "bg-primary-50 text-primary-600 border border-primary-600"
                                }`}
                            >
                                2
                            </div>
                            <span className="text-neutral-700">
                                Isi detail alamat anda
                            </span>
                        </div>
                    </div>

                    {/* Step Content */}
                    <form
                        onSubmit={handleSubmit}
                        className="px-6 py-6 text-sm space-y-4"
                    >
                        {step === 1 ? (
                            <>
                                {/* Step 1: Lokasi */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="provinsi">Provinsi</label>
                                    <select
                                        name="provinsi"
                                        required
                                        value={form.provinsi}
                                        onChange={handleChange}
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    >
                                        <option value="">Pilih provinsi</option>
                                        <option value="Jawa Timur">
                                            Jawa Timur
                                        </option>
                                        <option value="Jawa Barat">
                                            Jawa Barat
                                        </option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="kota">Kota</label>
                                    <select
                                        name="kota"
                                        required
                                        value={form.kota}
                                        onChange={handleChange}
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    >
                                        <option value="">Pilih kota</option>
                                        <option value="Malang">Malang</option>
                                        <option value="Surabaya">
                                            Surabaya
                                        </option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="kecamatan">Kecamatan</label>
                                    <select
                                        name="kecamatan"
                                        required
                                        value={form.kecamatan}
                                        onChange={handleChange}
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    >
                                        <option value="">
                                            Pilih kecamatan
                                        </option>
                                        <option value="Lowokwaru">
                                            Lowokwaru
                                        </option>
                                        <option value="Klojen">Klojen</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full mt-4 bg-primary-600 hover:bg-primary-600/90 text-white py-2 rounded-xl font-medium"
                                >
                                    Selanjutnya
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="jenisAlamat">
                                        Jenis Alamat
                                    </label>
                                    <select
                                        name="jenisAlamat"
                                        required
                                        value={form.jenisAlamat}
                                        onChange={handleChange}
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    >
                                        <option value="">
                                            Pilih jenis alamat
                                        </option>
                                        <option value="Rumah">Rumah</option>
                                        <option value="Kantor">Kantor</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="kodePos">Kode Pos</label>
                                    <input
                                        type="text"
                                        name="kodePos"
                                        required
                                        value={form.kodePos}
                                        onChange={handleChange}
                                        placeholder="Masukkan kode pos"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="alamat">Alamat</label>
                                    <input
                                        type="text"
                                        name="alamat"
                                        required
                                        value={form.alamat}
                                        onChange={handleChange}
                                        placeholder="Masukkan alamat"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="catatan">
                                        Catatan (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        name="catatan"
                                        value={form.catatan}
                                        onChange={handleChange}
                                        placeholder="Contoh: rumah cat putih, pagar hitam"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="utama"
                                        type="checkbox"
                                        name="utama"
                                        checked={form.utama}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-primary-600"
                                    />
                                    <label htmlFor="utama">
                                        Jadikan sebagai alamat utama
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full mt-4 bg-primary-600 hover:bg-primary-600/90 text-white py-2 rounded-xl font-medium"
                                >
                                    Simpan
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalTambahAlamat;
