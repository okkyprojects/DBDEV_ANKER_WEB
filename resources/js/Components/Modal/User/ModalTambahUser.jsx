import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import { IoImageOutline } from "react-icons/io5";

const ModalTambahUser = ({ isOpen, onClose }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone_number: "",
        gender: "",
        dob: "",
        password: "",
        role: "user",
        img: null,
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            reset();
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("setting.user.store"), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
                toast.success("Berhasil menambah user!");
            },
            onError: () => {
                toast.error("Gagal menambah user.");
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setData("img", file);
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center  bg-black bg-opacity-20 transition-opacity duration-200 ease-in-out dark:bg-white dark:bg-opacity-10 ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0  flex items-center justify-center px-4 sm:px-0 ">
                <div
                    className={`relative mx-auto w-full max-w-2xl transform rounded-xl overflow-y-auto scrollbar-hidden max-h-[40rem] bg-white shadow-lg transition-transform duration-200 ease-in-out dark:bg-boxdark ${
                        isOpen
                            ? "translate-y-0 scale-100"
                            : "translate-y-10 scale-95"
                    }`}
                >
                    <div className="px-6 pb-4 text-sm">
                        <div className="mb-4 flex items-center justify-between sticky z-10 bg-white top-0 py-4">
                            <h3 className="text-black text-base font-semibold">
                                Tambah User
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <IoIosClose size={25} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="py-4 space-y-5"
                        >
                            {/* Nama */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Nama</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.name}
                                    placeholder="Masukkan nama"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <span className="text-xs text-red-500">
                                        {errors.name}
                                    </span>
                                )}
                            </div>
                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.email}
                                    placeholder="Masukkan email"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <span className="text-xs text-red-500">
                                        {errors.email}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.password}
                                    placeholder="Masukkan password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                {errors.password && (
                                    <span className="text-xs text-red-500">
                                        {errors.password}
                                    </span>
                                )}
                            </div>{" "}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Role</label>
                                <select
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none py-2 px-3"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && (
                                    <span className="text-xs text-red-500">
                                        {errors.role}
                                    </span>
                                )}
                            </div>
                            {/* Nomor Telepon */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Nomor Telepon</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={data.phone_number}
                                    placeholder="Masukkan nomor telepon"
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                />
                                {errors.phone_number && (
                                    <span className="text-xs text-red-500">
                                        {errors.phone_number}
                                    </span>
                                )}
                            </div>
                            {/* Gender */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Jenis Kelamin</label>
                                <select
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none py-2 px-3"
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                >
                                    <option value="">Pilih Gender</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                {errors.gender && (
                                    <span className="text-xs text-red-500">
                                        {errors.gender}
                                    </span>
                                )}
                            </div>
                            {/* Tanggal Lahir */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Tanggal Lahir</label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none py-2 px-3"
                                    value={data.dob}
                                    onChange={(e) =>
                                        setData("dob", e.target.value)
                                    }
                                />
                                {errors.dob && (
                                    <span className="text-xs text-red-500">
                                        {errors.dob}
                                    </span>
                                )}
                            </div>
                            {/* Foto */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Foto</label>
                                {data.img ? (
                                    <div className="relative group">
                                        <img
                                            src={URL.createObjectURL(data.img)}
                                            alt="Uploaded"
                                            className="h-64 w-full rounded-lg object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <label
                                                htmlFor="img"
                                                className="bg-primary-600 text-sm text-white px-4 py-2 rounded-md shadow hover:bg-primary-600/90 transition cursor-pointer"
                                            >
                                                Pilih Gambar Lain
                                            </label>
                                        </div>
                                        <input
                                            id="img"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
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
                                                Unggah Gambar
                                            </p>
                                            <p className="text-neutral-500 text-sm">
                                                Format: JPG, PNG (Maks. 5MB)
                                            </p>
                                        </div>
                                        <input
                                            id="img"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                )}
                                {errors.img && (
                                    <span className="text-xs text-red-500">
                                        {errors.img}
                                    </span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full justify-center rounded-xl bg-primary-600 text-white p-2 font-medium hover:bg-primary-600/90"
                            >
                                {processing ? "Menyimpan..." : "Simpan"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalTambahUser;
