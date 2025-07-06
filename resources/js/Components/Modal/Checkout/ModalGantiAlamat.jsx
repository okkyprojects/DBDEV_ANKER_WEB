import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";
import { IoHome } from "react-icons/io5";

const ModalGantiAlamat = ({ isOpen, onClose, onApplyFilter }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState();
    const [dateValue, setDateValue] = useState({
        startDate: null,
        endDate: null,
    });
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
    const [showForm, setShowForm] = useState(false);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);
    const handleApplyFilter = () => {
        onApplyFilter({
            startDate: dateValue.startDate
                ? moment(dateValue.startDate).format("YYYY-MM-DD")
                : null,
            endDate: dateValue.endDate
                ? moment(dateValue.endDate).format("YYYY-MM-DD")
                : null,
            status,
        });
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-200 ease-in-out ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-0 ">
                <div
                    className={`relative mx-auto w-full max-w-xl transform rounded-xl overflow-y-auto scrollbar-hidden max-h-[40rem] bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                        isOpen
                            ? "translate-y-0 scale-100"
                            : "translate-y-10 scale-95"
                    }`}
                >
                    <div className="flex sticky z-10 bg-white top-0 items-center justify-between px-6 py-6 text-sm">
                        <h3 className="text-base font-semibold ">
                            {showForm ? "Tambah Alamat" : " Ganti Alamat"}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            <IoIosClose size={25} />
                        </button>
                    </div>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <div className="px-6 py-4 text-sm">
                            {showForm ? (
                                <>
                                    {" "}
                                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6  text-sm text-center">
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
                                            onClick={() =>
                                                step === 2 && setStep(2)
                                            }
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
                                        className="pt-3 pb-2 text-sm space-y-4"
                                    >
                                        {step === 1 ? (
                                            <>
                                                {/* Step 1: Lokasi */}
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="provinsi">
                                                        Provinsi
                                                    </label>
                                                    <select
                                                        name="provinsi"
                                                        required
                                                        value={form.provinsi}
                                                        onChange={handleChange}
                                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                                    >
                                                        <option value="">
                                                            Pilih provinsi
                                                        </option>
                                                        <option value="Jawa Timur">
                                                            Jawa Timur
                                                        </option>
                                                        <option value="Jawa Barat">
                                                            Jawa Barat
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="kota">
                                                        Kota
                                                    </label>
                                                    <select
                                                        name="kota"
                                                        required
                                                        value={form.kota}
                                                        onChange={handleChange}
                                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                                    >
                                                        <option value="">
                                                            Pilih kota
                                                        </option>
                                                        <option value="Malang">
                                                            Malang
                                                        </option>
                                                        <option value="Surabaya">
                                                            Surabaya
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="kecamatan">
                                                        Kecamatan
                                                    </label>
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
                                                        <option value="Klojen">
                                                            Klojen
                                                        </option>
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
                                                        <option value="Rumah">
                                                            Rumah
                                                        </option>
                                                        <option value="Kantor">
                                                            Kantor
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="kodePos">
                                                        Kode Pos
                                                    </label>
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
                                                    <label htmlFor="alamat">
                                                        Alamat
                                                    </label>
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
                                                        Jadikan sebagai alamat
                                                        utama
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
                                </>
                            ) : (
                                <div className="space-y-5">
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="flex gap-2 justify-center items-center px-5 py-2 rounded-lg border w-full border-primary-600 text-primary-600"
                                    >
                                        <span>+</span>Tambah Alamat
                                    </button>
                                    <div className="border border-neutral-300  p-5 rounded-xl relative">
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
                                                <p className="font-semibold ">
                                                    Rumah
                                                </p>
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
                                                    Kecamatan Mana, Kabupaten
                                                    Saja
                                                    <br />
                                                    Jawa Timur [Kode pos]
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border border-neutral-300  p-5 rounded-xl relative">
                                        <div className=" text-sm text-neutral-800">
                                            <div className="flex items-center gap-3">
                                                {" "}
                                                <IoHome
                                                    size={20}
                                                    className="text-primary-600"
                                                />
                                                <p className="font-semibold ">
                                                    Rumah
                                                </p>
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
                                                    Kecamatan Mana, Kabupaten
                                                    Saja
                                                    <br />
                                                    Jawa Timur [Kode pos]
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-3 flex w-full justify-center rounded-xl text-white bg-primary-600 p-2 font-medium text-gray hover:bg-primary-600/90"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalGantiAlamat;
