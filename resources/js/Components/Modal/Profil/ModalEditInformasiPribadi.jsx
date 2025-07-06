import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";

const ModalEditInformasiPibadi = ({ isOpen, onClose, onApplyFilter }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState();
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
            startDate: dateValue.startDate
                ? moment(dateValue.startDate).format("YYYY-MM-DD")
                : null,
            endDate: dateValue.endDate
                ? moment(dateValue.endDate).format("YYYY-MM-DD")
                : null,
            status,
        });
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-200 ease-in-out ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-0 ">
                <div
                    className={`relative mx-auto w-full max-w-xl transform rounded-xl overflow-y-auto scrollbar-hidden max-h-[40rem] bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                        isOpen
                            ? "translate-y-0 scale-100"
                            : "translate-y-10 scale-95"
                    }`}
                >
                    <div className="flex sticky z-10 bg-white top-0 items-center justify-between px-6 py-6 text-sm">
                        <h3 className="text-base font-semibold ">
                            Edit Informasi Pribadi
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            <IoIosClose size={25} />
                        </button>
                    </div>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <div className="px-6 py-4 text-sm">
                            <div className="flex flex-col gap-6">
                                {/* Nama Lengkap */}
                                <div className="flex flex-col gap-2 text-sm">
                                    <label
                                        htmlFor="nama"
                                        className="font-medium text-neutral-700"
                                    >
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="nama"
                                        name="nama"
                                        type="text"
                                        required
                                        placeholder="Masukkan nama lengkap"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-2 text-sm">
                                    <label
                                        htmlFor="email"
                                        className="font-medium text-neutral-700"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Masukkan email aktif"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                </div>

                                {/* No Telepon */}
                                <div className="flex flex-col gap-2 text-sm">
                                    <label
                                        htmlFor="telepon"
                                        className="font-medium text-neutral-700"
                                    >
                                        No Telepon
                                    </label>
                                    <input
                                        id="telepon"
                                        name="telepon"
                                        type="tel"
                                        required
                                        placeholder="Contoh: +628123456789"
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    />
                                </div>

                                {/* Jenis Kelamin */}
                                <div className="flex flex-col gap-2 text-sm">
                                    <label
                                        htmlFor="jenisKelamin"
                                        className="font-medium text-neutral-700"
                                    >
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        id="jenisKelamin"
                                        name="jenisKelamin"
                                        required
                                        className="px-3 py-2 rounded-xl text-sm border border-neutral-400 text-neutral-700 focus:border-primary-600 focus:ring-0 focus:outline-none"
                                    >
                                        <option value="">
                                            Pilih Jenis Kelamin
                                        </option>
                                        <option value="Laki-laki">
                                            Laki-laki
                                        </option>
                                        <option value="Perempuan">
                                            Perempuan
                                        </option>
                                    </select>
                                </div>

                                {/* Tanggal Lahir */}
                                <div className="w-full flex flex-col gap-2">
                                    <label
                                        htmlFor="tanggal-lahir"
                                        className="text-sm font-medium text-neutral-700"
                                    >
                                        Tanggal Lahir
                                    </label>
                                    <Datepicker
                                        id="tanggal-lahir"
                                        value={dateValue}
                                        onChange={handleDateChange}
                                        useRange={false}
                                        asSingle={true}
                                        theme="light"
                                        inputClassName="w-full z-50 rounded-xl text-sm text-neutral-700 border border-neutral-400 p-2 focus:border-primary-600 hover:cursor-pointer focus:outline-none focus:ring-[0.1px] focus:ring-primary-600 bg-white"
                                        primaryColor="sky"
                                        popoverDirection="top"
                                        placeholder="DD/MM/YYYY"
                                        displayFormat="DD/MM/YYYY"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalEditInformasiPibadi;
