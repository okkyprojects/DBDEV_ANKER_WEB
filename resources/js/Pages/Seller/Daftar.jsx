import { animatedComponents, styles } from "@/Config/global";
import HomeLayout from "@/Layouts/HomeLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { IoImageOutline } from "react-icons/io5";
import Select from "react-select";

const Daftar = ({ auth }) => {
    const [step, setStep] = useState(1);
    const [ktp, setKtp] = useState();
    const handlektp = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) setKtp(uploadedFile);
    };
    const [selfie, setSelfie] = useState();
    const handleselfie = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) setSelfie(uploadedFile);
    };
    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);
    const { data, setData, post, processing, errors } = useForm({
        id_card_name: "",
        id_card_number: "",
        seller_name: "",
        seller_phone: "",
        province_id: "",
        city_id: "",
        note: "",
        id_card_img: null,
        img: null,
    });
    const [searchProvinsi, setSearchProvinsi] = useState("");
    const [searchKota, setSearchKota] = useState("");
    const [provinsi, setProvinsi] = useState([]);
    const [kota, setKota] = useState([]);
    const [provinsi_id, setProvinsi_Id] = useState("");
    const [kota_id, setKota_id] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("home.seller.store_seller"), {
            forceFormData: true,
            onSuccess: () => {
                setStep(1);
            },
        });
    };
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

    return (
        <HomeLayout>
            <Head title="Pendaftaran Seller" />
            <section className="max-w-4xl px-5 mx-auto py-10">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary-600 text-white px-6 py-5 rounded-t-2xl">
                        <h1 className="text-2xl font-semibold">
                            Pendaftaran Seller
                        </h1>
                        <p className="text-sm mt-2">
                            Isi form di bawah untuk mendaftar sebagai seller
                        </p>
                    </div>

                    {/* Step Navigation */}
                    <div className="flex items-center justify-between border-b px-6 pt-4 pb-2 text-sm font-medium text-gray-600">
                        {[
                            "Informasi Pribadi",
                            "Verifikasi Identitas",
                            "Informasi Toko",
                        ].map((label, index) => {
                            const isActive = step === index + 1;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className={`${
                                            isActive
                                                ? "bg-primary-600 text-white"
                                                : "border"
                                        } w-6 h-6 flex items-center justify-center rounded-full text-xs`}
                                    >
                                        {index + 1}
                                    </div>
                                    <span
                                        className={`${
                                            isActive ? "text-primary-600" : ""
                                        }`}
                                    >
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {" "}
                        {/* Step 1: Informasi Pribadi */}
                        {step === 1 && (
                            <div className="p-6 space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Kontak
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                        <div className="text-sm">
                                            <label className="text-gray-700">
                                                Email{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                disabled
                                                value={auth?.user?.email || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="email@example.com"
                                                className="mt-2 w-full border rounded-xl px-4 py-2 border-neutral-300 focus:border-primary-600 focus:outline-none"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-sm">
                                            <label className="text-gray-700">
                                                No. Telepon/HP{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="seller_phone"
                                                required
                                                value={data.seller_phone || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "seller_phone",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="+62888-8888-8888"
                                                className="mt-2 w-full border rounded-xl px-4 py-2 border-neutral-300 focus:border-primary-600 focus:outline-none"
                                            />
                                            {errors.seller_phone && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.seller_phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Informasi Pribadi
                                    </h2>
                                    <div className="space-y-4 mt-3">
                                        <div className="text-sm">
                                            <label className="text-gray-700">
                                                Nama Lengkap (Sesuai KTP)
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="id_card_name"
                                                value={data.id_card_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "id_card_name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan nama lengkap"
                                                required
                                                className="mt-2 w-full border rounded-xl px-4 py-2 border-neutral-300 focus:border-primary-600 focus:outline-none"
                                            />
                                            {errors.id_card_name && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.id_card_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-sm">
                                            <label className="text-gray-700">
                                                Nomor KTP/NIK{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="id_card_number"
                                                value={data.id_card_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "id_card_number",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan 16 digit NIK"
                                                required
                                                className="mt-2 w-full border rounded-xl px-4 py-2 border-neutral-300 focus:border-primary-600 focus:outline-none"
                                            />
                                            {errors.id_card_number && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.id_card_number}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-primary-600 hover:bg-primary-600/90 text-white px-6 py-2 rounded-xl transition"
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Step 2: Verifikasi Identitas */}
                        {step === 2 && (
                            <div className="p-6 space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Verifikasi Identitas
                                    </h2>
                                    <div className="flex flex-col gap-5 mt-3">
                                        {/* Foto KTP */}
                                        <div className="flex flex-col gap-2 text-sm">
                                            <label htmlFor="ktp">
                                                Foto KTP{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            {data.id_card_img ? (
                                                <div className="relative group">
                                                    <img
                                                        src={
                                                            typeof data.id_card_img ===
                                                            "string"
                                                                ? data.id_card_img
                                                                : URL.createObjectURL(
                                                                      data.id_card_img
                                                                  )
                                                        }
                                                        alt="Uploaded KTP"
                                                        className="h-64 w-full rounded-lg object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                        <label
                                                            htmlFor="ktp"
                                                            className="bg-primary-600 text-sm text-white px-4 py-2 rounded-md shadow hover:bg-primary-600/90 cursor-pointer"
                                                        >
                                                            Pilih Gambar Lain
                                                        </label>
                                                    </div>
                                                    <input
                                                        id="ktp"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            setData(
                                                                "id_card_img",
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <label className="border-gray-300 bg-white flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                                    <div className="flex flex-col items-center justify-center gap-1.5">
                                                        <IoImageOutline
                                                            size={37}
                                                            className="text-neutral-500"
                                                        />
                                                        <p className="text-primary-600 text-base">
                                                            Unggah Foto
                                                        </p>
                                                        <p className="text-neutral-500 text-sm">
                                                            Format: JPG, PNG
                                                            (Maks. 5MB)
                                                        </p>
                                                    </div>
                                                    <input
                                                        id="ktp"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            setData(
                                                                "id_card_img",
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        }
                                                    />
                                                </label>
                                            )}
                                            {errors.id_card_img && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.id_card_img}
                                                </p>
                                            )}
                                        </div>

                                        {/* Foto Selfie */}
                                        <div className="flex flex-col gap-2 text-sm">
                                            <label htmlFor="selfie">
                                                Foto Diri (Selfie) dengan KTP{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            {data.img ? (
                                                <div className="relative group">
                                                    <img
                                                        src={
                                                            typeof data.img ===
                                                            "string"
                                                                ? data.img
                                                                : URL.createObjectURL(
                                                                      data.img
                                                                  )
                                                        }
                                                        alt="Uploaded Selfie"
                                                        className="h-64 w-full rounded-lg object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                        <label
                                                            htmlFor="selfie"
                                                            className="bg-primary-600 text-sm text-white px-4 py-2 rounded-md shadow hover:bg-primary-600/90 cursor-pointer"
                                                        >
                                                            Pilih Gambar Lain
                                                        </label>
                                                    </div>
                                                    <input
                                                        id="selfie"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            setData(
                                                                "img",
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <label className="border-gray-300 bg-white flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                                    <div className="flex flex-col items-center justify-center gap-1.5">
                                                        <IoImageOutline
                                                            size={37}
                                                            className="text-neutral-500"
                                                        />
                                                        <p className="text-primary-600 text-base">
                                                            Unggah Foto
                                                        </p>
                                                        <p className="text-neutral-500 text-sm">
                                                            Format: JPG, PNG
                                                            (Maks. 5MB)
                                                        </p>
                                                    </div>
                                                    <input
                                                        id="selfie"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            setData(
                                                                "img",
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        }
                                                    />
                                                </label>
                                            )}
                                            {errors.img && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.img}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Navigasi */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="bg-neutral-100 hover:bg-neutral-200 text-primary-600 px-6 py-2 rounded-xl transition"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-primary-600 hover:bg-primary-600/90 text-white px-6 py-2 rounded-xl transition"
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Step 3: Informasi Toko */}
                        {step === 3 && (
                            <div className="p-6 space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Informasi Toko
                                    </h2>
                                    <div className="text-sm mt-3 space-y-5">
                                        <div>
                                            <label className="text-gray-700">
                                                Nama Toko{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="seller_name"
                                                required
                                                value={data.seller_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "seller_name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan nama toko"
                                                className="mt-2 w-full border rounded-xl px-4 py-2 border-neutral-300 focus:border-primary-600 focus:outline-none"
                                            />
                                            {errors.seller_name && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.seller_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-gray-700">
                                                    Provinsi{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <Select
                                                    name="provinsi"
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: "Pilih Provinsi",
                                                        },
                                                        ...provinsi.map(
                                                            (p) => ({
                                                                value: p.id,
                                                                label: p.nama,
                                                            })
                                                        ),
                                                    ]}
                                                    components={
                                                        animatedComponents
                                                    }
                                                    onInputChange={(
                                                        inputValue
                                                    ) => {
                                                        setSearchProvinsi(
                                                            inputValue
                                                        );
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
                                                    onChange={(
                                                        selectedOption
                                                    ) => {
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
                                                <label className="text-gray-700">
                                                    Kota{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
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
                                                    components={
                                                        animatedComponents
                                                    }
                                                    onInputChange={(
                                                        inputValue,
                                                        { action }
                                                    ) => {
                                                        if (
                                                            action ===
                                                            "input-change"
                                                        ) {
                                                            setSearchKota(
                                                                inputValue
                                                            );
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
                                                    onChange={(
                                                        selectedOption
                                                    ) => {
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
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="bg-neutral-100 hover:bg-neutral-200 text-primary-600 px-6 py-2 rounded-xl transition"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary-600 hover:bg-primary-600/90 text-white px-6 py-2 rounded-xl transition"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </HomeLayout>
    );
};

export default Daftar;
