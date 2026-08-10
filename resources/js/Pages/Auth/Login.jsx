import { useEffect, useState } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FiLock, FiMail } from "react-icons/fi";
import AuthLayout from "@/Layouts/AuthLayout";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        // <GuestLayout>
        //     <Head title="Log in" />

        //     {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

        //     <form onSubmit={submit}>
        //         <div>
        //             <InputLabel htmlFor="email" value="Email" />

        //             <TextInput
        //                 id="email"
        //                 type="email"
        //                 name="email"
        //                 value={data.email}
        //                 className="mt-1 block w-full"
        //                 autoComplete="username"
        //                 isFocused={true}
        //                 onChange={(e) => setData('email', e.target.value)}
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
        //                 autoComplete="current-password"
        //                 onChange={(e) => setData('password', e.target.value)}
        //             />

        //             <InputError message={errors.password} className="mt-2" />
        //         </div>

        //         <div className="block mt-4">
        //             <label className="flex items-center">
        //                 <Checkbox
        //                     name="remember"
        //                     checked={data.remember}
        //                     onChange={(e) => setData('remember', e.target.checked)}
        //                 />
        //                 <span className="ml-2 text-sm text-gray-600">Remember me</span>
        //             </label>
        //         </div>

        //         <div className="flex items-center justify-end mt-4">
        //             {canResetPassword && (
        //                 <Link
        //                     href={route('password.request')}
        //                     className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        //                 >
        //                     Forgot your password?
        //                 </Link>
        //             )}

        //             <PrimaryButton className="ml-4" disabled={processing}>
        //                 Log in
        //             </PrimaryButton>
        //         </div>
        //     </form>
        // </GuestLayout>
        <AuthLayout>
            <Head title="Login" />
            <div className="w-full max-w-md rounded-xl shadow-md shadow-neutral-200 p-6 md:p-8">
                <Link href="/">
                    <img
                        src="/images/logo/primary.svg"
                        alt="Logo"
                        className="mx-auto mb-3"
                    />
                </Link>
                <h2 className="text-center text-lg font-semibold text-neutral-900 mb-2">
                    Selamat Datang Kembali
                </h2>
                <p className="text-center text-sm text-neutral-600 mb-6">
                    Masuk, untuk dapat melanjutkan
                </p>

                {status && (
                    <div className="mb-4 text-sm text-green-600">{status}</div>
                )}

                <form onSubmit={submit} className="space-y-4">
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
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2.5 text-neutral-600">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="accent-primary-600 checked:text-white"
                            />
                            <span>Ingat saya</span>
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-primary-600 hover:underline"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`w-full rounded-xl py-3 text-sm font-semibold text-white ${
                            processing
                                ? "bg-slate-400 cursor-not-allowed"
                                : "bg-primary-600 hover:bg-primary-600/90"
                        }`}
                        disabled={processing}
                    >
                        Masuk
                    </button>
                </form>
                <p className="text-center text-sm text-neutral-600 mt-6">
                    Tidak memiliki akun?{" "}
                    <Link
                        href={route("register")}
                        className="text-primary-600 font-medium hover:underline"
                    >
                        Buat akun
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
