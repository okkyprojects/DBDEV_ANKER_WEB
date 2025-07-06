import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    FiSearch,
    FiShoppingCart,
    FiBell,
    FiArrowLeft,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    return (
        <nav className="bg-white text-neutral-900 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-5">
                <div className="py-5">
                    {/* MOBILE SEARCH BAR FULL WIDTH */}
                    <div className="md:hidden">
                        {showMobileSearch ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowMobileSearch(false)}
                                >
                                    <FiArrowLeft className="w-5 h-5 text-neutral-700" />
                                </button>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Cari produk"
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300"
                                        autoFocus
                                    />
                                    <FiSearch className="absolute left-3 top-2.5 text-neutral-300" />
                                </div>
                            </div>
                        ) : (
                            // Navbar untuk mobile
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <Link href="/">
                                        <img
                                            src="/images/logo/primary.svg"
                                            alt="Logo"
                                            className="h-5"
                                        />
                                    </Link>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() =>
                                            setShowMobileSearch(true)
                                        }
                                    >
                                        <FiSearch className="w-5 h-5 text-neutral-700" />
                                    </button>
                                    <Link href="/cart">
                                        <FiShoppingCart className="w-5 h-5 cursor-pointer" />
                                    </Link>
                                    <FiBell className="w-5 h-5 cursor-pointer" />
                                    <FaUserCircle className="w-6 h-6 text-gray-700" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DESKTOP NAVBAR */}
                    <div className="hidden md:flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <Link href="/">
                                <img
                                    src="/images/logo/primary.svg"
                                    alt="Logo"
                                    className="h-5"
                                />
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 mx-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari produk"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-300 focus:border-primary-600 focus:ring-0 focus:outline-none placeholder:text-neutral-300"
                                />
                                <FiSearch className="absolute left-3 top-2.5 text-neutral-300" />
                            </div>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-4">
                            <Link href="/cart">
                                <FiShoppingCart className="w-5 h-5 cursor-pointer" />
                            </Link>
                            <FiBell className="w-5 h-5 cursor-pointer" />
                            <div className="w-px h-6 bg-gray-300 mx-1" />
                            <div className="flex items-center space-x-2">
                                <FaUserCircle className="w-6 h-6 text-gray-700" />
                                <span className="text-sm font-medium">
                                    Joan Doe
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
