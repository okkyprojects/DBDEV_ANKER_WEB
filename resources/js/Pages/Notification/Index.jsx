import DefaultLayout from "@/Layouts/DefaultLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";

export default function Index({ data }) {
    const { permissions } = usePage().props;
    const {
        data: form,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        title: "",
        body: "",
        target: "all",
        inactive_days: "30",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!confirm("Yakin ingin mengirim notifikasi?")) {
            return;
        }

        post(route("promosi.notification.store"), {
            preserveScroll: true,
            onSuccess: (page) => {
                const result = page.props.data?.result;
                toast.success(
                    `Notifikasi terkirim ke ${result?.success ?? 0} dari ${result?.total ?? 0} perangkat`
                );
                reset("title", "body");
            },
            onError: (errors) => {
                toast.error(
                    errors.firebase || "Gagal mengirim notifikasi."
                );
            },
        });
    };

    return (
        <DefaultLayout>
            <Head title="Notifikasi" />
            <div className="flex flex-col gap-5">
                <p className="text-base sm:text-2xl font-semibold">
                    Notifikasi
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-white rounded-xl py-3 px-5">
                        <p className="text-sm text-neutral-500">
                            Perangkat Terdaftar
                        </p>
                        <p className="text-xl font-semibold">
                            {data?.summary?.total_device ?? 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl py-3 px-5">
                        <p className="text-sm text-neutral-500">
                            User dengan Aplikasi
                        </p>
                        <p className="text-xl font-semibold">
                            {data?.summary?.total_user ?? 0}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5">
                    <p className="text-lg font-medium mb-4">
                        Kirim Notifikasi
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm">Judul</label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                value={form.title}
                                placeholder="Contoh: Promo Akhir Tahun!"
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                            />
                            {errors.title && (
                                <span className="text-xs text-red-500">
                                    {errors.title}
                                </span>
                            )}
                        </div>

                        {/* Body */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm">Pesan</label>
                            <textarea
                                rows={3}
                                required
                                className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                value={form.body}
                                placeholder="Isi notifikasi yang muncul di aplikasi"
                                onChange={(e) =>
                                    setData("body", e.target.value)
                                }
                            />
                            {errors.body && (
                                <span className="text-xs text-red-500">
                                    {errors.body}
                                </span>
                            )}
                        </div>

                        {/* Target */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm">Penerima</label>
                            <select
                                className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none py-2 px-3"
                                value={form.target}
                                onChange={(e) =>
                                    setData("target", e.target.value)
                                }
                            >
                                <option value="all">Semua User</option>
                                <option value="inactive">User Tidak Aktif</option>
                            </select>
                            {errors.target && (
                                <span className="text-xs text-red-500">
                                    {errors.target}
                                </span>
                            )}
                        </div>

                        {/* Inactive Days */}
                        {form.target === "inactive" && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">
                                    Tidak Ada Transaksi Selama (Hari)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    className="w-full rounded-xl text-sm border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300 py-2 px-3"
                                    value={form.inactive_days}
                                    onChange={(e) =>
                                        setData("inactive_days", e.target.value)
                                    }
                                />
                                {errors.inactive_days && (
                                    <span className="text-xs text-red-500">
                                        {errors.inactive_days}
                                    </span>
                                )}
                            </div>
                        )}

                        {errors.firebase && (
                            <span className="text-xs text-red-500">
                                {errors.firebase}
                            </span>
                        )}

                        {permissions.includes("notification-add") && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full justify-center rounded-xl bg-primary-600 text-white p-2 font-medium hover:bg-primary-600/90"
                            >
                                {processing ? "Mengirim..." : "Kirim"}
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </DefaultLayout>
    );
}
