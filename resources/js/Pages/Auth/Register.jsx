import { useEffect, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FiLock, FiMail, FiUser } from "react-icons/fi";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [agree, setAgree] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"));
    };

    return (
        // <GuestLayout>
        //     <Head title="Register" />

        //     <form onSubmit={submit}>
        //         <div>
        //             <InputLabel htmlFor="name" value="Name" />

        //             <TextInput
        //                 id="name"
        //                 name="name"
        //                 value={data.name}
        //                 className="mt-1 block w-full"
        //                 autoComplete="name"
        //                 isFocused={true}
        //                 onChange={(e) => setData('name', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.name} className="mt-2" />
        //         </div>

        //         <div className="mt-4">
        //             <InputLabel htmlFor="email" value="Email" />

        //             <TextInput
        //                 id="email"
        //                 type="email"
        //                 name="email"
        //                 value={data.email}
        //                 className="mt-1 block w-full"
        //                 autoComplete="username"
        //                 onChange={(e) => setData('email', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.email} className="mt-2" />
        //         </div>

        //         <div className="mt-4">
        //             <InputLabel htmlFor="password" value="Password" />

        //             <TextInput
        //                 id="password"
        //                 type="password"
        //                 name="password"
        //                 value={data.password}
        //                 className="mt-1 block w-full"
        //                 autoComplete="new-password"
        //                 onChange={(e) => setData('password', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.password} className="mt-2" />
        //         </div>

        //         <div className="mt-4">
        //             <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

        //             <TextInput
        //                 id="password_confirmation"
        //                 type="password"
        //                 name="password_confirmation"
        //                 value={data.password_confirmation}
        //                 className="mt-1 block w-full"
        //                 autoComplete="new-password"
        //                 onChange={(e) => setData('password_confirmation', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.password_confirmation} className="mt-2" />
        //         </div>

        //         <div className="flex items-center justify-end mt-4">
        //             <Link
        //                 href={route('login')}
        //                 className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        //             >
        //                 Already registered?
        //             </Link>

        //             <PrimaryButton className="ml-4" disabled={processing}>
        //                 Register
        //             </PrimaryButton>
        //         </div>
        //     </form>
        // </GuestLayout>
        <AuthLayout>
            <Head title="Register" />

            <div className="w-full max-w-md rounded-xl shadow-md shadow-neutral-200 p-6 md:p-8">
                <Link href="/">
                    <img
                        src="/images/logo/logo.jpg"
                        alt="Logo"
                        className="mx-auto mb-3 w-24"
                    />
                </Link>
                <h2 className="text-center text-lg font-semibold text-neutral-900 mb-1">
                    Selamat Datang
                </h2>
                <p className="text-center text-sm text-neutral-600 mb-6">
                    Buat akun untuk mengakses seluruh fitur anker!
                </p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block mb-1.5 text-sm text-neutral-900">
                            Nama Lengkap
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                <FiUser size={18} />
                            </span>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Nama lengkap"
                                className="w-full px-10 py-3 text-sm rounded-xl border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-400"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-error-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1.5 text-sm text-neutral-900">
                            Email
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                <FiMail size={18} />
                            </span>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="email@example.com"
                                className="w-full px-10 py-3 text-sm rounded-xl border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-400"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-error-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1.5 text-sm text-neutral-900">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                <FiLock size={18} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder="Password"
                                className="w-full px-10 py-3 text-sm rounded-xl border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-400"
                            />
                            <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FaEye size={18} />
                                ) : (
                                    <FaEyeSlash size={18} />
                                )}
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-error-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1.5 text-sm text-neutral-900">
                            Konfirmasi Password
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                <FiLock size={18} />
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                placeholder="Konfirmasi password"
                                className="w-full px-10 py-3 text-sm rounded-xl border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-400"
                            />
                            <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <FaEye size={18} />
                                ) : (
                                    <FaEyeSlash size={18} />
                                )}
                            </span>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-error-500 text-xs mt-1">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2.5 text-sm mt-2">
                        <input
                            type="checkbox"
                            className="accent-primary-600 "
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />
                        <span className="text-neutral-600">
                            Saya menyetujui syarat & ketentuan yang berlaku
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={processing || !agree}
                        className={`w-full rounded-xl py-3 text-sm font-semibold text-white ${
                            processing || !agree
                                ? "bg-slate-400 cursor-not-allowed"
                                : "bg-primary-600 hover:bg-primary-600/90"
                        }`}
                    >
                        Daftar
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-600 mt-6">
                    Sudah memiliki akun?{" "}
                    <Link
                        href={route("login")}
                        className="text-primary-600 font-medium hover:underline"
                    >
                        Masuk
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
