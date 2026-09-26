import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";

const ModalFilterStockHistory = ({ isOpen, onClose, data, onApplyFilter }) => {
    const [sku, setSku] = useState("");
    const [product, setProduct] = useState("");
    const [userId, setUserId] = useState("");
    const [dateValue, setDateValue] = useState({
        startDate: null,
        endDate: null,
    });

    const handleDateChange = (newValue) => {
        setDateValue(newValue);
    };

    const handleApplyFilter = () => {
        onApplyFilter({
            startDate: dateValue.startDate
                ? moment(dateValue.startDate).format("YYYY-MM-DD")
                : null,
            endDate: dateValue.endDate
                ? moment(dateValue.endDate).format("YYYY-MM-DD")
                : null,
            sku,
            product,
            user_id: userId,
        });
        onClose();
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

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
                            <h3 className="text-base font-semibold text-black">
                                Filter
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <IoIosClose size={25} />
                            </button>
                        </div>

                        <div className="py-4">
                            <form action="#">
                                <div className="space-y-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm">
                                            Pilih Tanggal
                                        </label>
                                        <Datepicker
                                            value={dateValue}
                                            onChange={handleDateChange}
                                            useRange={true}
                                            theme="light"
                                            showShortcuts={true}
                                            inputClassName="w-full z-50 rounded-xl text-sm text-neutral-700 border border-neutral-200 p-2 focus:border-primary-600 hover:cursor-pointer focus:outline-none focus:ring-[0.1px] focus:ring-primary-600 bg-white"
                                            primaryColor="sky"
                                            popoverDirection="down"
                                            placeholder="DD/MM/YYYY - DD/MM/YYYY"
                                            displayFormat="DD/MM/YYYY"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 text-sm">
                                        <label htmlFor="skuFilter">SKU</label>
                                        <input
                                            id="skuFilter"
                                            type="text"
                                            placeholder="Cari SKU"
                                            value={sku}
                                            onChange={(e) =>
                                                setSku(e.target.value)
                                            }
                                            className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 text-sm">
                                        <label htmlFor="productFilter">
                                            Nama Produk
                                        </label>
                                        <input
                                            id="productFilter"
                                            type="text"
                                            placeholder="Cari nama produk"
                                            value={product}
                                            onChange={(e) =>
                                                setProduct(e.target.value)
                                            }
                                            className="px-3 py-2 rounded-xl text-sm border border-neutral-400 placeholder:text-neutral-400 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 text-sm">
                                        <label htmlFor="userFilter">
                                            User
                                        </label>
                                        <select
                                            id="userFilter"
                                            value={userId}
                                            onChange={(e) =>
                                                setUserId(e.target.value)
                                            }
                                            className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                        >
                                            <option value="">
                                                Semua user
                                            </option>
                                            {data?.users?.map((user) => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleApplyFilter}
                                        className="mt-3 flex w-full justify-center rounded-xl text-white bg-primary-600 p-2 font-medium hover:bg-primary-600/90"
                                    >
                                        Terapkan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalFilterStockHistory;
