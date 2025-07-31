import { useState, useEffect, useRef } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PiGearSixLight,
    PiStackLight,
    PiUserLight,
    PiCirclesFourLight,
    PiKeyLight,
} from "react-icons/pi";
import { PiBuildingApartmentLight } from "react-icons/pi";
import styles from "./Sidebar.module.css";
import { PiUsersLight } from "react-icons/pi";
import { usePage } from "@inertiajs/react";
const sidebarMenu = {
    MAIN: [
        {
            id: 1,
            icon: <PiCirclesFourLight size={21} className="mr-4" />,
            text: "Dashboard",
            url: "/dashboard",
        },
    ],
    PRODUK: [
        {
            id: 2,
            icon: <PiCirclesFourLight size={21} className="mr-4" />,
            text: "Data Produk",
            url: "/produk/data-produk",
        },
    ],
    REPORTING: [
        {
            id: 3,
            icon: <PiCirclesFourLight size={21} className="mr-4" />,
            text: "Penjualan",
            url: "/reporting/penjualan",
        },
        {
            id: 4,
            icon: <PiCirclesFourLight size={21} className="mr-4" />,
            text: "Barang Masuk",
            url: "/reporting/item",
        },
    ],
    PESANAN: [
        {
            id: 5,
            icon: <PiCirclesFourLight size={21} className="mr-4" />,
            text: "Manajemen Pesanan",
            url: "/pesanan/manajemen-pesanan",
        },
    ],
    MASTER: [
        {
            id: 6,
            icon: <PiCirclesFourLight size={21} className="mr-4" />,
            text: "Kategori",
            url: "/master/category",
        },
        {
            id: 7,
            icon: <PiCirclesFourLight size={21} className="mr-4" />,
            text: "Brand",
            url: "/master/brand",
        },
        {
            id: 8,
            icon: <PiCirclesFourLight size={21} className="mr-4" />,
            text: "Banner",
            url: "/master/banner",
        },
        {
            id: 9,
            icon: <PiCirclesFourLight size={21} className="mr-4" />,
            text: "Rekening",
            url: "/master/bill",
        },
    ],
};

const Sidebar = ({ isOpen, onToggle }) => {
    const [menuItems, setMenuItems] = useState({});
    const [activeSubMenuIndexes, setActiveSubMenuIndexes] = useState([]);
    const activeItemRef = useRef(null);
    const activeSubMenuItemRef = useRef(null);
    const location = usePage().url;
    const pathname = location;
    useEffect(() => {
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        } else if (activeSubMenuItemRef.current) {
            activeSubMenuItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [pathname]);

    const toggleSubMenu = (id) => {
        setActiveSubMenuIndexes((prevIndexes) =>
            prevIndexes.includes(id)
                ? prevIndexes.filter((i) => i !== id)
                : [...prevIndexes, id]
        );
    };

    return (
        <>
            {isOpen && (
                <div
                    className={`fixed inset-0 bg-black bg-opacity-20 transition-opacity duration-300 z-30 xl:hidden ${
                        isOpen
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                    }`}
                    onClick={onToggle}
                />
            )}
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform pb-16 ${
                    isOpen ? "" : "-translate-x-full"
                } bg-white sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <img
                    src="/images/logo/primary.svg"
                    alt=""
                    className="w-28 py-5 pl-5"
                />
                <button
                    onClick={onToggle}
                    className="absolute top-4 right-4 md:hidden p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <div
                    className={`h-full px-3 pb-4 overflow-y-auto bg-white ${styles.hideScrollbar}`}
                >
                    <ul className="space-y-4 text-xs tracking-wider">
                        {Object.keys(sidebarMenu).map((category) => (
                            <li key={category} className="relative">
                                <h2 className="text-gray-500 uppercase mt-4 mb-3 px-2">
                                    {category}
                                </h2>
                                {sidebarMenu[category].map((menuItem) => (
                                    <div key={menuItem.id} className="relative">
                                        <Link
                                            href={menuItem.url || ""}
                                            ref={
                                                pathname.startsWith(
                                                    menuItem.url
                                                ) ||
                                                (menuItem.submenu &&
                                                    menuItem.submenu.some(
                                                        (subItem) =>
                                                            pathname.startsWith(
                                                                subItem.url
                                                            )
                                                    ))
                                                    ? activeItemRef
                                                    : null
                                            }
                                            className={`flex items-center px-2 py-3 text-gray-600 font-light text-sm rounded-sm group ${
                                                pathname.startsWith(
                                                    menuItem.url
                                                )
                                                    ? "bg-primary-600/5 border-r-[2.5px] border-primary-600"
                                                    : "hover:bg-gray-50"
                                            }`}
                                            onClick={() =>
                                                menuItem.submenu &&
                                                toggleSubMenu(menuItem.id)
                                            }
                                        >
                                            {menuItem.icon}
                                            <span className="flex-1 tracking-wide capitalize">
                                                {menuItem.text}
                                            </span>
                                            {menuItem.submenu && (
                                                <IoChevronDownSharp
                                                    size={12}
                                                    className={`ml-auto transition duration-300 ${
                                                        activeSubMenuIndexes.includes(
                                                            menuItem.id
                                                        )
                                                            ? "transform -rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            )}
                                        </Link>
                                        <AnimatePresence>
                                            {menuItem.submenu &&
                                                activeSubMenuIndexes.includes(
                                                    menuItem.id
                                                ) && (
                                                    <motion.ul
                                                        initial={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            height: "auto",
                                                            opacity: 1,
                                                        }}
                                                        exit={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                        className="pl-5 overflow-hidden"
                                                    >
                                                        {menuItem.submenu.map(
                                                            (subMenuItem) => (
                                                                <li
                                                                    key={
                                                                        subMenuItem.id
                                                                    }
                                                                    className="relative"
                                                                >
                                                                    <Link
                                                                        href={
                                                                            subMenuItem.url ||
                                                                            ""
                                                                        }
                                                                        ref={
                                                                            pathname.startsWith(
                                                                                subMenuItem.url
                                                                            )
                                                                                ? activeSubMenuItemRef
                                                                                : null
                                                                        }
                                                                        className={`flex items-center px-2 py-3 font-light tracking-wide text-sm text-gray-600 transition duration-300 rounded-sm group ${
                                                                            pathname.startsWith(
                                                                                subMenuItem.url
                                                                            )
                                                                                ? "bg-primary-600/5 border-r-[2.5px] border-primary-600"
                                                                                : "hover:bg-gray-50"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            subMenuItem.icon
                                                                        }
                                                                        <span className="flex-1 capitalize">
                                                                            {
                                                                                subMenuItem.text
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                    </motion.ul>
                                                )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
