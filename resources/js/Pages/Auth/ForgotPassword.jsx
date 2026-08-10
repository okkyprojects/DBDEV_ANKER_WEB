import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { FiMail } from "react-icons/fi";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        // <GuestLayout>
        //     <Head title="Forgot Password" />

        //     <div className="mb-4 text-sm text-gray-600">
        //         Forgot your password? No problem. Just let us know your email address and we will email you a password
        //         reset link that will allow you to choose a new one.
        //     </div>

        //     {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

        //     <form onSubmit={submit}>
        //         <TextInput
        //             id="email"
        //             type="email"
        //             name="email"
        //             value={data.email}
        //             className="mt-1 block w-full"
        //             isFocused={true}
        //             onChange={(e) => setData('email', e.target.value)}
        //         />

        //         <InputError message={errors.email} className="mt-2" />

        //         <div className="flex items-center justify-end mt-4">
        //             <PrimaryButton className="ml-4" disabled={processing}>
        //                 Email Password Reset Link
        //             </PrimaryButton>
        //         </div>
        //     </form>
        // </GuestLayout>

        <AuthLayout>
            <Head title="Lupa Password" />
            <div className="w-full max-w-md rounded-xl shadow-md shadow-neutral-200 p-6 md:p-8 bg-white">
                <Link href="/">
                    <img
                        src="/images/logo/primary.svg"
                        alt="Logo"
                        className="mx-auto mb-3"
                    />
                </Link>
                <h2 className="text-center text-lg font-semibold text-neutral-900 mb-2">
                    Atur Ulang Password
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

                    <button
                        type="submit"
                        className={`w-full rounded-xl py-3 text-sm font-semibold text-white ${
                            processing
                                ? "bg-slate-400 cursor-not-allowed"
                                : "bg-primary-600 hover:bg-primary-600/90"
                        }`}
                        disabled={processing}
                    >
                        Atur ulang password
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}
