import DefaultLayout from "@/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";

export default function PermissionIndex({ data }) {
    const { permissions } = usePage().props;
    const [checkedPermissions, setCheckedPermissions] = useState([]);

    useEffect(() => {
        setCheckedPermissions(data?.permissions || []);
    }, [data]);

    const togglePermission = (perm) => {
        setCheckedPermissions((prev) =>
            prev.includes(perm)
                ? prev.filter((p) => p !== perm)
                : [...prev, perm]
        );
    };
    const toggleRow = (resource) => {
        const perms = [
            `${resource}-index`,
            `${resource}-add`,
            `${resource}-update`,
            `${resource}-delete`,
            `${resource}-export`,
        ];

        const alreadyAll = perms.every((p) => checkedPermissions.includes(p));

        setCheckedPermissions(
            (prev) =>
                alreadyAll
                    ? prev.filter((p) => !perms.includes(p))
                    : [...prev, ...perms.filter((p) => !prev.includes(p))]
        );
    };
    const toggleAll = () => {
        const allPermissions = [
            "product",
            "bill",
            "category",
            "user",
            "role",
            "transaction",
            "term",
            "brand",
        ].flatMap((r) => [
            `${r}-index`,
            `${r}-add`,
            `${r}-update`,
            `${r}-delete`,
            `${r}-export`,
        ]);

        const alreadyAll = allPermissions.every((p) =>
            checkedPermissions.includes(p)
        );

        setCheckedPermissions(alreadyAll ? [] : allPermissions);
    };

    const handleSave = () => {
        router.post(
            route("setting.permission.store"),
            {
                role_id: data.role.id,
                permissions: checkedPermissions,
            },
            {
                onSuccess: () => toast.success("Berhasil mengubah data!"),
                onError: () => toast.error("Gagal mengubah data."),
            }
        );
    };

    return (
        <DefaultLayout>
            <Head title="Permission" />
            <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-base sm:text-2xl font-semibold">
                        Permission {data?.role?.name}
                    </p>

                    {permissions.includes("role-update") && (
                        <button
                            onClick={handleSave}
                            className="flex gap-1 items-center bg-primary-600 hover:bg-primary-600/90 text-neutral-50 text-sm px-5 py-2 rounded-full"
                        >
                            Simpan
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl p-5">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="px-4 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 accent-primary-600 cursor-pointer"
                                            checked={
                                                checkedPermissions.length ===
                                                [
                                                    "product",
                                                    "bill",
                                                    "category",
                                                    "user",
                                                    "role",
                                                    "transaction",
                                                    "term",
                                                    "brand",
                                                ].flatMap((r) => [
                                                    `${r}-index`,
                                                    `${r}-add`,
                                                    `${r}-update`,
                                                    `${r}-delete`,
                                                    `${r}-export`,
                                                ]).length
                                            }
                                            onChange={() => toggleAll()}
                                        />
                                    </th>
                                    <th className="px-4 py-4">Permission</th>
                                    <th className="px-4 py-4 text-center">
                                        Read
                                    </th>
                                    <th className="px-4 py-4 text-center">
                                        Create
                                    </th>
                                    <th className="px-4 py-4 text-center">
                                        Update
                                    </th>
                                    <th className="px-4 py-4 text-center">
                                        Delete
                                    </th>
                                    <th className="px-4 py-4 text-center">
                                        Export
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    "product",
                                    "bill",
                                    "category",
                                    "user",
                                    "role",
                                    "transaction",
                                    "term",
                                    "brand",
                                ].map((resource, index) => {
                                    const perms = {
                                        read: `${resource}-index`,
                                        create: `${resource}-add`,
                                        update: `${resource}-update`,
                                        delete: `${resource}-delete`,
                                        export: `${resource}-export`,
                                    };

                                    const isRowChecked = Object.values(
                                        perms
                                    ).every((p) =>
                                        checkedPermissions.includes(p)
                                    );

                                    return (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 text-sm text-neutral-700"
                                        >
                                            {/* 🔥 CHECKBOX UTAMA */}
                                            <td className="px-4 py-5 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 accent-primary-600 cursor-pointer"
                                                    checked={isRowChecked}
                                                    onChange={() =>
                                                        toggleRow(resource)
                                                    }
                                                />
                                            </td>

                                            {/* NAMA PERMISSION */}
                                            <td className="px-4 py-5 font-medium">
                                                {resource
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    resource.slice(1)}
                                            </td>

                                            {/* READ / CREATE / UPDATE / DELETE / EXPORT */}
                                            {Object.values(perms).map(
                                                (perm) => (
                                                    <td
                                                        key={perm}
                                                        className="px-4 py-5 text-center"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={checkedPermissions.includes(
                                                                perm
                                                            )}
                                                            onChange={() =>
                                                                togglePermission(
                                                                    perm
                                                                )
                                                            }
                                                            className="w-4 h-4 accent-primary-600 cursor-pointer"
                                                        />
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
