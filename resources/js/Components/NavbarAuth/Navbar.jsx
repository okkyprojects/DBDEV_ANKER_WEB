import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoLogInOutline, IoLogOutOutline } from "react-icons/io5";
import Sidebar from "../Sidebar/Sidebar";
// import ModalLogout from "../Modal/Auth/ModalLogout";

const Navbar = () => {
    const { props } = usePage();
    const authUser = props.auth?.user;
    const isAuthenticated = !!authUser;

    const [userData, setUserData] = useState(authUser || {});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsDropdownOpen(false);
    };

    const handleOutsideClick = (event) => {
        const dropdown = document.getElementById("dropdown-user");
        const avatarButton = document.getElementById("avatar-button");
        if (
            isDropdownOpen &&
            dropdown &&
            !dropdown.contains(event.target) &&
            !avatarButton.contains(event.target)
        ) {
            setIsDropdownOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("menuItems");
        localStorage.removeItem("membership");
        localStorage.removeItem("affiliate");
        window.location.href = "/logout"; // Pastikan route ini POST/GET logout Laravel Breeze
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [isDropdownOpen]);

    return (
        <>
            <nav className="fixed top-0 w-full z-20 bg-white shadow shadow-gray-200 px-5 md:px-12 lg:px-0">
                <div
                    className={`py-5 ${
                        authUser?.roles?.[0]?.name !== "customer"
                            ? "lg:px-5"
                            : "lg:px-24"
                    } lg:px-24`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                type="button"
                                className="inline-flex items-center text-sm text-gray-500 rounded-lg sm:hidden"
                                onClick={toggleSidebar}
                            >
                                <RxHamburgerMenu size={21} />
                            </button>
                            <Link to="/" className="flex ms-2 md:me-24">
                                <img
                                    src="/images/logo/logo.png"
                                    alt=""
                                    className="w-28"
                                />
                            </Link>
                        </div>

                        <div className="flex items-center">
                            <div className="flex items-center ms-3 gap-x-4">
                                <div className="relative">
                                    <button
                                        type="button"
                                        id="avatar-button"
                                        className="flex text-sm bg-gray-800 rounded-full focus:ring-[0.1px] focus:ring-gray-300"
                                        aria-expanded={isDropdownOpen}
                                        onClick={toggleDropdown}
                                    >
                                        <span className="sr-only">
                                            Open user menu
                                        </span>
                                        <img
                                            className="w-10 h-10 rounded-full"
                                            src={
                                                userData?.fotoProfile
                                                    ? userData?.fotoProfile
                                                    : "/images/profile/profile.png"
                                            }
                                            alt="user photo"
                                        />
                                    </button>

                                    {isDropdownOpen && (
                                        <div
                                            className="z-50 absolute right-0 mt-2 w-64 bg-white divide-y divide-gray-100 rounded shadow-lg"
                                            id="dropdown-user"
                                        >
                                            {isAuthenticated && (
                                                <div className="px-4 py-4 flex items-center">
                                                    <img
                                                        className="w-10 h-10 mr-2 rounded-full"
                                                        src={
                                                            userData?.fotoProfile
                                                                ? userData?.fotoProfile
                                                                : "/images/profile/profile.png"
                                                        }
                                                        alt="user photo"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {userData?.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate">
                                                            {userData?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="py-1">
                                                {isAuthenticated ? (
                                                    <button
                                                        onClick={toggleModal}
                                                        className="flex items-center px-4 py-3 text-sm text-danger hover:bg-gray-100 w-full text-start"
                                                    >
                                                        <IoLogOutOutline
                                                            className="mr-2"
                                                            size={22}
                                                        />{" "}
                                                        Logout
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to="/login"
                                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full text-start"
                                                    >
                                                        <IoLogInOutline
                                                            className="mr-2"
                                                            size={22}
                                                        />{" "}
                                                        Login
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

            {/* {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <ModalLogout
                            isOpen={isModalOpen}
                            toggleModal={toggleModal}
                            handleLogout={handleLogout}
                        />
                    </div>
                </div>
            )} */}
        </>
    );
};

export default Navbar;
