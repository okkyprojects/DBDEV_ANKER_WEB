import Footer from "@/Components/Footer/Footer";
import { Link, Head } from "@inertiajs/react";
import { FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Beranda({ auth, laravelVersion, phpVersion }) {
    const categories = [
        { name: "Kategori 1", icon: "/images/icons/category.svg" },
        { name: "Kategori 2", icon: "/images/icons/category.svg" },
        { name: "Kategori 3", icon: "/images/icons/category.svg" },
        { name: "Kategori 4", icon: "/images/icons/category.svg" },
        { name: "Kategori 5", icon: "/images/icons/category.svg" },
    ];
    const products = [
        {
            name: "Laptop ASUS VivoBook",
            category: "Elektronik",
            img: "/images/dummy/product/product.jpeg",
            price: 800000,
            seller: "Toko Elektronik Jaya",
            location: "Jakarta Selatan, DKI Jakarta",
            rating: 5,
        },
        {
            name: "Kursi Gaming Rexus",
            category: "Furniture",
            img: "/images/dummy/product/product.jpeg",
            price: 1250000,
            seller: "Raja Furniture",
            location: "Surabaya, Jawa Timur",
            rating: 4,
        },
        {
            name: "Headphone Sony WH-1000XM4",
            category: "Aksesoris",
            img: "/images/dummy/product/product.jpeg",
            price: 2990000,
            seller: "GadgetHub",
            location: "Bandung, Jawa Barat",
            rating: 5,
        },
        {
            name: "Sepeda Gunung Polygon",
            category: "Olahraga",
            img: "/images/dummy/product/product.jpeg",
            price: 3400000,
            seller: "Toko Sepeda Sehat",
            location: "Yogyakarta",
            rating: 4,
        },
    ];

    return (
        <div className="font-dinnext bg-neutral-50">
            <Head title="Welcome" />

            <div className="max-w-7xl mx-auto px-5 pt-10">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000 }}
                    loop={true}
                    className="rounded-2xl overflow-hidden"
                >
                    <SwiperSlide>
                        <img src="/images/dummy/banner/hero.svg" alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/dummy/banner/hero.svg" alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/dummy/banner/hero.svg" alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/dummy/banner/hero.svg" alt="" />
                    </SwiperSlide>
                </Swiper>
            </div>
            <section className="max-w-7xl mx-auto px-5 py-10">
                <h2 className="text-xl sm:text-2xl  font-medium text-neutral-900 mb-1">
                    Belanja Berdasarkan Kategori
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 mb-5">
                    Lebih cepat, lebih mudah. Langsung temukan kelompok produk
                    yang Anda cari.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
                        >
                            <img
                                src={category.icon}
                                alt={category.name}
                                className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
                            />
                            <p className="text-sm sm:text-base  text-neutral-800">
                                {category.name}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-5 py-10">
                <h2 className="text-xl sm:text-2xl  font-medium text-neutral-900 mb-1">
                    Brand Pilihan Kami
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 mb-5">
                    Temukan koleksi eksklusif dari brand-brand favorit pilihan.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
                        >
                            <img
                                src={item.icon}
                                alt={item.name}
                                className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
                            />
                            <p className="text-sm sm:text-base  text-neutral-800">
                                {item.name}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-5 py-10">
                <h2 className="text-xl sm:text-2xl  font-medium text-neutral-900 mb-1">
                    Rekomendasi Spesial Untukmu
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 mb-5">
                    Kami pilihkan produk terbaik berdasarkan tren dan minat
                    pelanggan seperti Anda.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {products.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition"
                        >
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-36 lg:h-56 object-cover object-center"
                            />
                            <div className="p-5 flex flex-col gap-1">
                                <p className="text-sm sm:text-base font-medium  text-neutral-800">
                                    {item.name}
                                </p>
                                <p className="text-xs sm:text-sm font-light text-neutral-600">
                                    {item.category}
                                </p>
                                <div className="flex items-center gap-1 my-1.5">
                                    <div className="flex items-center gap-1 text-warning-400">
                                        {Array.from({
                                            length: Math.floor(item.rating),
                                        }).map((_, i) => (
                                            <FaStar key={i} />
                                        ))}
                                    </div>
                                    <p className="text-neutral-500 text-sm">
                                        (80)
                                    </p>
                                </div>

                                <p className="text-lg sm:text-xl text-neutral-900 font-medium mb-1.5">
                                    Rp {item.price.toLocaleString("id-ID")}
                                </p>
                                <p className="text-xs sm:text-sm font-light text-neutral-900">
                                    {item.seller}
                                </p>
                                <p className="flex items-center gap-1 text-[10px] sm:text-xs text-neutral-500">
                                    <FaLocationDot size={15} /> {item.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="block mx-auto text-primary-600 font-medium rounded-xl border border-primary-600 px-8 py-2.5 mt-5 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:shadow-lg">
                    Tampilkan produk lainnya
                </button>
            </section>
            <Footer />
        </div>
    );
}
