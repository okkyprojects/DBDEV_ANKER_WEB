import DefaultLayout from "@/Layouts/DefaultLayout";
import { useState, useEffect, useRef } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Index({ data }) {
    const { permissions } = usePage().props;
    const initialContent = data?.term?.content || "";
    const [content, setContent] = useState(initialContent);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        setContent(data?.term?.content || "");
    }, [data]);

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        setErrors({});
        setSaving(true);

        router.post(
            route(route().current()),
            { content },
            {
                preserveState: true,
                onSuccess: () => {
                    setSaving(false);
                },
                onError: (err) => {
                    setErrors(err);
                    setSaving(false);
                },
            }
        );
    };

    return (
        <DefaultLayout>
            <Head title="Syarat & Ketentuan" />
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Syarat Dan Ketentuan
                    </h1>
                    {permissions.includes("term-add") && (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className={`px-4 py-2 rounded-full text-white ${
                                saving
                                    ? "bg-primary-600/60"
                                    : "bg-primary-600 hover:bg-primary-600/90"
                            }`}
                        >
                            {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        theme="snow"
                        placeholder="Tulis syarat dan ketentuan di sini..."
                        className="rounded-2xl"
                    />
                    {errors?.content && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.content}
                        </p>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
}
