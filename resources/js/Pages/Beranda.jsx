import { Link, Head } from "@inertiajs/react";

export default function Beranda({ auth, laravelVersion, phpVersion }) {
    return (
        <div className="font-dinnext bg-neutral-50">
            <Head title="Welcome" />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-medium text-neutral-900">
                    Belanja Berdasarkan Kategori
                </h2>
                <p className="text-lg text-neutral-700">
                    Lebih cepat, lebih mudah. Langsung temukan kelompok produk
                    yang Anda cari.
                </p>
            </div>
        </div>
    );
}
