import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    FiSearch,
    FiShoppingCart,
    FiBell,
    FiArrowLeft,
    FiLogOut,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

export default function Navbar() {
    const { auth } = usePage().props;
    const [showDropdown, setShowDropdown] = useState(false);
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
                                    {auth?.user ? (
                                        <div className="relative">
                                            <div
                                                onClick={() =>
                                                    setShowDropdown(
                                                        (prev) => !prev
                                                    )
                                                }
                                                className="flex items-center space-x-2 cursor-pointer"
                                            >
                                                <FaUserCircle className="w-6 h-6 text-gray-700" />
                                                <span className="text-sm font-medium">
                                                    {auth.user.name}
                                                </span>
                                            </div>

                                            {showDropdown && (
                                                <div
                                                    className="z-50 absolute right-0 mt-2 w-64 bg-white divide-y divide-gray-100 rounded shadow-lg"
                                                    id="dropdown-user"
                                                >
                                                    <div className="px-4 py-4 flex items-center">
                                                        <img
                                                            className="w-10 h-10 mr-2 rounded-full"
                                                            src={
                                                                auth.user
                                                                    .fotoProfile
                                                                    ? auth.user
                                                                          .fotoProfile
                                                                    : "/images/profile/profile.png"
                                                            }
                                                            alt="user photo"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {auth.user.name}
                                                            </p>
                                                            <p className="text-xs text-gray-400 truncate">
                                                                {
                                                                    auth.user
                                                                        .email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="py-1">
                                                        <Link
                                                            href="/logout"
                                                            method="post"
                                                            as="button"
                                                            className="flex items-center px-4 py-3 text-sm text-danger hover:bg-gray-100 w-full text-start"
                                                        >
                                                            <IoLogOutOutline
                                                                className="mr-2"
                                                                size={22}
                                                            />
                                                            Logout
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href="/login"
                                                className="text-sm text-primary-600 hover:text-primary-600/90 font-medium"
                                            >
                                                Login
                                            </Link>
                                            <div className="w-px h-6 bg-gray-300 mx-1" />
                                            <Link
                                                href="/register"
                                                className="text-sm text-primary-600 hover:text-primary-600/90 font-medium"
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    )}
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
                                {auth?.user ? (
                                    <div className="relative">
                                        <div
                                            onClick={() =>
                                                setShowDropdown((prev) => !prev)
                                            }
                                            className="flex items-center space-x-2 cursor-pointer"
                                        >
                                            <FaUserCircle className="w-6 h-6 text-gray-700" />
                                            <span className="text-sm font-medium">
                                                {auth.user.name}
                                            </span>
                                        </div>

                                        {showDropdown && (
                                            <div
                                                className="z-50 absolute right-0 mt-2 w-64 bg-white divide-y divide-gray-100 rounded shadow-lg"
                                                id="dropdown-user"
                                            >
                                                <div className="px-4 py-4 flex items-center">
                                                    <img
                                                        className="w-10 h-10 mr-2 rounded-full"
                                                        src={
                                                            auth.user
                                                                .fotoProfile
                                                                ? auth.user
                                                                      .fotoProfile
                                                                : "/images/profile/profile.png"
                                                        }
                                                        alt="user photo"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {auth.user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate">
                                                            {auth.user.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="py-1">
                                                    <Link
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className="flex items-center px-4 py-3 text-sm text-danger hover:bg-gray-100 w-full text-start"
                                                    >
                                                        <IoLogOutOutline
                                                            className="mr-2"
                                                            size={22}
                                                        />
                                                        Logout
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="text-sm text-primary-600 hover:text-primary-600/90 font-medium"
                                        >
                                            Login
                                        </Link>
                                        <div className="w-px h-6 bg-gray-300 mx-1" />
                                        <Link
                                            href="/register"
                                            className="text-sm text-primary-600 hover:text-primary-600/90 font-medium"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
