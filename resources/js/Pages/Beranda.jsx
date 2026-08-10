import Footer from "@/Components/Footer/Footer";
import { Link, Head } from "@inertiajs/react";
import { FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay,FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Navbar from "@/Components/Navbar/Navbar";
import HomeLayout from "@/Layouts/HomeLayout";
import CategoryCard from "@/Components/Card/CategoryCard";
import BrandCard from "@/Components/Card/BrandCard";
import ProductCard from "@/Components/Card/ProductCard";
import { categories, products } from "@/Dummy/dummy";

export default function Beranda({data}) {
    return (
        <HomeLayout>
            <Head title="Beranda" />
            <section className="max-w-7xl mx-auto px-5 pt-10">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000 }}
                    loop={true}
                    className="rounded-2xl overflow-hidden"
                >
                    <SwiperSlide>
                        <img
                            src="/images/dummy/banner/hero.svg"
                            alt=""
                            className="w-full"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            src="/images/dummy/banner/hero.svg"
                            alt=""
                            className="w-full"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            src="/images/dummy/banner/hero.svg"
                            alt=""
                            className="w-full"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            src="/images/dummy/banner/hero.svg"
                            alt=""
                            className="w-full"
                        />
                    </SwiperSlide>
                </Swiper>
            </section>
            <section className="max-w-7xl mx-auto px-5 py-10">
                <h2 className="text-xl sm:text-2xl font-medium text-neutral-900 mb-1">
                    Belanja Berdasarkan Kategori
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 mb-5">
                    Lebih cepat, lebih mudah. Langsung temukan kelompok produk
                    yang Anda cari.
                </p>
                <Swiper
                    slidesPerView="auto"
                    spaceBetween={16}
                    freeMode={true}
                    modules={[FreeMode]}
                    className="overflow-hidden"
                >
                    {data?.categories?.map((item, index) => (
                        <SwiperSlide
                            key={index}
                            className="!w-[140px] sm:!w-[180px] lg:!w-[200px]"
                        >
                            <CategoryCard item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
            <section className="max-w-7xl mx-auto px-5 py-10">
                <h2 className="text-xl sm:text-2xl  font-medium text-neutral-900 mb-1">
                    Brand Pilihan Kami
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 mb-5">
                    Temukan koleksi eksklusif dari brand-brand favorit pilihan.
                </p>

                <Swiper
                    slidesPerView="auto"
                    spaceBetween={16}
                    freeMode={true}
                    modules={[FreeMode]}
                    className="overflow-hidden"
                >
                    {data?.brands?.map((item, index) => (
                        <SwiperSlide
                            key={index}
                            className="!w-[140px] sm:!w-[180px] lg:!w-[200px]"
                        >
                            <CategoryCard item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
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
                        <ProductCard key={index} item={item} />
                    ))}
                </div>
                <Link
                    href="/product"
                    className="block w-fit mx-auto text-primary-600 font-medium rounded-xl border border-primary-600 px-8 py-2.5 mt-5 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:shadow-lg"
                >
                    Tampilkan produk lainnya
                </Link>
            </section>
            <style jsx global>{`
                .swiper-pagination {
                    position: absolute;
                    bottom: 10px;
                    left: 0;
                    right: 0;
                    width: 100%;
                    text-align: center; 
                    padding: 0; 
                }
                .swiper-pagination-bullet {
                    background-color: rgba(255, 255, 255, 0.5);
                    border-radius: 4px;
                    height: 4px;
                    opacity: 1;
                }
                .swiper-pagination-bullet-active {
                    background-color: rgba(255, 255, 255, 1);
                    width: 45px !important;
                    border-radius: 4px;
                    transition: width 0.3s ease, background-color 0.3s ease;
                }
            `}</style>
        </HomeLayout>
    );
}
