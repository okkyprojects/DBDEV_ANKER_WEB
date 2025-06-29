import { Link } from "@inertiajs/react";
import moment from "moment";

export default function Footer() {
    const currentYear = moment().format("YYYY");

    return (
        <footer className="bg-white text-neutral-900">
            <div className="max-w-7xl mx-auto px-5 pt-10 pb-6 font-light">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="flex flex-col gap-5">
                        <Link href="/">
                            <img
                                src="/images/logo/primary.svg"
                                className="h-6 lg:h-8"
                                alt="Anker Logo"
                            />
                        </Link>
                        <p className="text-justify">
                            Your one-stop destination for amazing products at
                            unbeatable prices.
                        </p>
                    </div>
                    <div>
                        <p className="text-base font-medium mb-4">Halaman</p>
                        <div className="flex flex-col gap-3 text-sm">
                            <Link href="/#beranda">Beranda</Link>
                            <Link href="/about">Notifikasi</Link>
                            <Link href="/#paket">Keranjang</Link>
                            <Link href="/contact">Profil</Link>
                        </div>
                    </div>
                    <div>
                        <p className="text-base font-medium mb-4">Kategori</p>
                        <div className="flex flex-col gap-3 text-sm">
                            <Link href="/#beranda">Kategori 1</Link>
                            <Link href="/about">Kategori 2</Link>
                            <Link href="/#paket">Kategori 3</Link>
                            <Link href="/contact">Kategori 4</Link>
                        </div>
                    </div>

                    {/* Appstore */}
                    <div>
                        <div className="flex flex-col gap-3 text-sm">
                            <a href="/">
                                <img
                                    src="/images/appstore/appstore.svg"
                                    alt="App Store"
                                    className="max-h-12"
                                />
                            </a>
                            <a href="/">
                                <img
                                    src="/images/appstore/playstore.svg"
                                    alt="Play Store"
                                    className="max-h-12"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <p className="text-base font-light text-center">
                        © {currentYear}, Anker Indonesia. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
