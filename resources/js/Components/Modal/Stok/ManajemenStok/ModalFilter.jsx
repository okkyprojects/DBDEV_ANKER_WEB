import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";

const ModalFilter = ({ isOpen, onClose, data, onApplyFilter }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [dateValue, setDateValue] = useState({
        startDate: null,
        endDate: null,
    });
    const handleDateChange = (newValue) => {
        setDateValue(newValue);
    };
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);
    const handleApplyFilter = () => {
        onApplyFilter({
            category: selectedCategory,
            brand: selectedBrand,
        });
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-scroll xl:overflow-y-hidden bg-black bg-opacity-20 shadow-default transition-opacity duration-200 ease-in-out ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-0">
                <div
                    className={`mx-auto w-full max-w-xl transform rounded-xl bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                        isOpen
                            ? "translate-y-0 scale-100"
                            : "translate-y-10 scale-95"
                    }`}
                >
                    <div className="px-6 py-4 text-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className=" text-black text-base font-semibold">
                                Filter
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <IoIosClose size={25} />
                            </button>
                        </div>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-screen bg-white">
                                <div className="flex flex-row gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-.1s]"></div>
                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-.3s]"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-4">
                                <form action="#">
                                    <div className=" space-y-5">
                                        <div className="flex flex-col gap-2 text-sm">
                                            <label htmlFor="kategoriProduk">
                                                Kategori
                                            </label>
                                            <select
                                                id="kategoriProduk"
                                                value={selectedCategory}
                                                onChange={(e) =>
                                                    setSelectedCategory(
                                                        e.target.value
                                                    )
                                                }
                                                className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                            >
                                                <option value="">
                                                    Pilih kategori
                                                </option>
                                                {data?.categories?.map(
                                                    (category) => (
                                                        <option
                                                            key={category.id}
                                                            value={
                                                                category.name
                                                            }
                                                        >
                                                            {category.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-2 text-sm">
                                            <label htmlFor="brandProduk">
                                                Brand
                                            </label>
                                            <select
                                                id="brandProduk"
                                                value={selectedBrand}
                                                onChange={(e) =>
                                                    setSelectedBrand(
                                                        e.target.value
                                                    )
                                                }
                                                className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                            >
                                                <option value="">
                                                    Pilih brand
                                                </option>
                                                {data?.brands?.map((brand) => (
                                                    <option
                                                        key={brand.id}
                                                        value={brand.name}
                                                    >
                                                        {brand.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleApplyFilter}
                                            className="mt-3 flex w-full justify-center rounded-xl text-white bg-primary-600 p-2 font-medium text-gray hover:bg-primary-600/90"
                                        >
                                            Terapkan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalFilter;
