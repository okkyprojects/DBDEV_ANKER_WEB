import { animatedComponents, styles } from "@/Config/global";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Select from "react-select";

const ModalTambahAlamat = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const { data, setData, post, errors, processing } = useForm({
        name: "",
        phone_number: "",
        province_id: "",
        city_id: "",
        district_id: "",
        category: "",
        postal_code: "",
        address: "",
        note: "",
        is_main: false,
    });

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);
    const handleNext = () => {
        setStep((prev) => prev + 1);
    };
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setData(name, type === "checkbox" ? checked : value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("profil.alamat.store"), {
            onSuccess: () => onClose(),
        });
    };
    const [searchProvinsi, setSearchProvinsi] = useState("");
    const [searchKota, setSearchKota] = useState("");
    const [searchKecamatan, setSearchKecamatan] = useState("");
    const [provinsi, setProvinsi] = useState([]);
    const [kota, setKota] = useState([]);
    const [kecamatan, setKecamatan] = useState([]);
    useEffect(() => {
        axios
            .get(
                searchProvinsi
                    ? `/api/provinces?search=${searchProvinsi}`
                    : `/api/provinces`
            )
            .then((res) => {
                setProvinsi(res.data.data.data);
                setKota([]);
            });
    }, [searchProvinsi]);
    useEffect(() => {
        const fetchKabupaten = async () => {
            if (!data.province_id) {
                setKota([]);
                setData("city_id", "");
                return;
            }

            try {
                const response = await axios.get(
                    `/api/cities?province_id=${data.province_id}&search=${searchKota}`
                );
                setKota(response.data.data.data);
                setData("city_id", "");
            } catch (error) {
                console.log("Error fetching kabupaten:", error);
                setKota([]);
            }
        };

        fetchKabupaten();
    }, [data.province_id, searchKota]);
    useEffect(() => {
        const fetchKecamatan = async () => {
            if (!data.city_id) {
                setKecamatan([]);
                setData("district_id", "");
                return;
            }

            try {
                const response = await axios.get(
                    `/api/districts?city_id=${data.city_id}&search=${searchKecamatan}`
                );
                setKecamatan(response.data.data.data);
                setData("district_id", "");
            } catch (error) {
                console.log("Error fetching kecamatan:", error);
                setKecamatan([]);
            }
        };

        fetchKecamatan();
    }, [data.city_id, searchKecamatan]);
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-200 ease-in-out ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="relative w-full max-w-xl rounded-xl bg-white shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 ">
                        <h3 className="text-base font-semibold">
                            Tambah Alamat Baru
                        </h3>
                        <button onClick={onClose}>
                            <IoIosClose size={28} />
                        </button>
                    </div>
                    <div className="flex scrollbar-hidden justify-center items-center gap-3 sm:gap-6 py-4 px-4 text-sm text-center overflow-x-auto">
                        <div
                            className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer"
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
                            <span className="text-neutral-700 mt-1">
                                Informasi Penerima
                            </span>
                        </div>
                        <div className="hidden sm:block w-8 border-t border-neutral-400" />
                        <div
                            className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer"
                            onClick={() => step >= 2 && setStep(2)}
                        >
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                    step === 2
                                        ? "bg-primary-600 text-white border border-primary-600"
                                        : "bg-primary-50 text-primary-600 border border-primary-600"
                                }`}
                            >
                                2
                            </div>
                            <span className="text-neutral-700 mt-1">
                                Tentukan Lokasi
                            </span>
                        </div>
                        <div className="hidden sm:block w-8 border-t border-neutral-400" />
                        <div
                            className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer"
                            onClick={() => step >= 3 && setStep(3)}
                        >
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                    step === 3
                                        ? "bg-primary-600 text-white border border-primary-600"
                                        : "bg-primary-50 text-primary-600 border border-primary-600"
                                }`}
                            >
                                3
                            </div>
                            <span className="text-neutral-700 mt-1">
                                Isi Detail Alamat
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
                                {/* Step 1: Informasi Penerima */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="namaPenerima">
                                        Nama Penerima
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        placeholder="Masukkan nama penerima"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />{" "}
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="noTelepon">
                                        No. Telepon
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        name="phone_number"
                                        value={data.phone_number}
                                        min={0}
                                        onChange={handleChange}
                                        placeholder="Masukkan no telepon"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />{" "}
                                    {errors.phone_number && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.phone_number}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full mt-4 bg-primary-600 hover:bg-primary-600/90 text-white py-2 rounded-xl font-medium"
                                >
                                    Selanjutnya
                                </button>
                            </>
                        ) : step === 2 ? (
                            <>
                                {/* Step 2: Lokasi */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="provinsi">Provinsi</label>
                                    <Select
                                        name="provinsi"
                                        options={[
                                            {
                                                value: "",
                                                label: "Pilih Provinsi",
                                            },
                                            ...provinsi.map((p) => ({
                                                value: p.id,
                                                label: p.nama,
                                            })),
                                        ]}
                                        components={animatedComponents}
                                        onInputChange={(inputValue) => {
                                            setSearchProvinsi(inputValue);
                                            return inputValue;
                                        }}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="Pilih Provinsi"
                                        value={
                                            data.province_id === ""
                                                ? {
                                                      value: "",
                                                      label: "Pilih Provinsi",
                                                  }
                                                : {
                                                      value: data.province_id,
                                                      label: provinsi.find(
                                                          (p) =>
                                                              p.id ===
                                                              data.province_id
                                                      )?.nama,
                                                  }
                                        }
                                        onChange={(selectedOption) => {
                                            setData(
                                                "province_id",
                                                selectedOption
                                                    ? selectedOption.value
                                                    : ""
                                            );
                                        }}
                                        styles={styles}
                                    />
                                    {errors.province_id && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.province_id}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="kota">Kota</label>
                                    <Select
                                        name="kabupaten"
                                        options={[
                                            {
                                                value: "",
                                                label: "Pilih Kabupaten/Kota",
                                            },
                                            ...kota.map((p) => ({
                                                value: p.id,
                                                label: p.nama,
                                            })),
                                        ]}
                                        components={animatedComponents}
                                        onInputChange={(
                                            inputValue,
                                            { action }
                                        ) => {
                                            if (action === "input-change") {
                                                setSearchKota(inputValue);
                                            }
                                            return inputValue;
                                        }}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="Pilih Kabupaten/Kota"
                                        value={
                                            data.city_id === ""
                                                ? {
                                                      value: "",
                                                      label: "Pilih Kabupaten/Kota",
                                                  }
                                                : {
                                                      value: data.city_id,
                                                      label: kota.find(
                                                          (p) =>
                                                              p.id ===
                                                              data.city_id
                                                      )?.nama,
                                                  }
                                        }
                                        onChange={(selectedOption) => {
                                            setData(
                                                "city_id",
                                                selectedOption
                                                    ? selectedOption.value
                                                    : ""
                                            );
                                        }}
                                        styles={styles}
                                    />
                                    {errors.city_id && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.city_id}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="kecamatan">Kecamatan</label>
                                    <Select
                                        name="kecamatan"
                                        options={[
                                            {
                                                value: "",
                                                label: "Pilih Kecamatan",
                                            },
                                            ...kecamatan.map((p) => ({
                                                value: p.id,
                                                label: p.nama,
                                            })),
                                        ]}
                                        components={animatedComponents}
                                        onInputChange={(
                                            inputValue,
                                            { action }
                                        ) => {
                                            if (action === "input-change") {
                                                setSearchKecamatan(inputValue);
                                            }
                                            return inputValue;
                                        }}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="Pilih Kecamatan"
                                        value={
                                            data.district_id === ""
                                                ? {
                                                      value: "",
                                                      label: "Pilih Kecamatan",
                                                  }
                                                : {
                                                      value: data.district_id,
                                                      label: kecamatan.find(
                                                          (p) =>
                                                              p.id ===
                                                              data.district_id
                                                      )?.nama,
                                                  }
                                        }
                                        onChange={(selectedOption) => {
                                            setData(
                                                "district_id",
                                                selectedOption
                                                    ? selectedOption.value
                                                    : ""
                                            );
                                        }}
                                        styles={styles}
                                    />
                                    {errors.district_id && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.district_id}
                                        </p>
                                    )}
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
                                {/* Step 3: Detail Alamat */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="jenisAlamat">
                                        Jenis Alamat
                                    </label>
                                    <select
                                        name="category"
                                        required
                                        value={data.category}
                                        onChange={handleChange}
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    >
                                        <option value="" disabled selected>
                                            Pilih jenis alamat
                                        </option>
                                        <option value="rumah">Rumah</option>
                                        <option value="kantor">Kantor</option>
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="kodePos">Kode Pos</label>
                                    <input
                                        type="text"
                                        name="postal_code"
                                        required
                                        value={data.postal_code}
                                        onChange={handleChange}
                                        placeholder="Masukkan kode pos"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                    {errors.postal_code && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.postal_code}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="alamat">Alamat</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={data.address}
                                        onChange={handleChange}
                                        placeholder="Masukkan alamat"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />{" "}
                                    {errors.address && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="catatan">
                                        Catatan (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        name="note"
                                        value={data.note}
                                        onChange={handleChange}
                                        placeholder="Contoh: rumah cat putih, pagar hitam"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />{" "}
                                    {errors.note && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.note}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="utama"
                                        type="checkbox"
                                        name="is_main"
                                        checked={data.is_main}
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
