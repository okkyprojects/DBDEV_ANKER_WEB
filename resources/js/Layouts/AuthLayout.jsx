import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex font-dinnext text-neutral-900">
            <div className="hidden lg:flex w-1/2 relative">
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 5000 }}
                    pagination={{
                        clickable: true,
                        renderBullet: (index, className) => {
                            return `<span class="${className} ${
                                index === 0 ? "w-10" : "w-5"
                            } h-1 mx-1 rounded-full bg-red-600 inline-block transition-all"></span>`;
                        },
                    }}
                    modules={[Pagination, Autoplay]}
                    className="w-full h-full"
                >
                    <SwiperSlide>
                        <div
                            className="w-full h-full bg-cover bg-center relative"
                            style={{
                                backgroundImage: "url(/images/auth/1.webp)",
                            }}
                        >
                            <div className="absolute bottom-20 px-10">
                                <p className="text-white text-3xl font-medium">
                                    Temukan Suara Impianmu!
                                </p>
                                <p className="text-white text-sm mt-2">
                                    Jelajahi berbagai earphone, headset,
                                    speaker, dan perangkat audio canggih lainnya
                                    untuk pengalaman mendengarkan yang luar
                                    biasa.
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div
                            className="w-full h-full bg-cover bg-center relative"
                            style={{
                                backgroundImage: "url(/images/auth/2.webp)",
                            }}
                        >
                            <div className="absolute bottom-20 px-10">
                                <p className="text-white text-3xl font-medium">
                                    Pilihan Audio Terbaik Ada di Sini
                                </p>
                                <p className="text-white text-sm mt-2">
                                    Hadirkan kualitas suara jernih dan detail
                                    dari brand-brand ternama, siap memenuhi gaya
                                    dan kebutuhanmu.
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div
                            className="w-full h-full bg-cover bg-center relative"
                            style={{
                                backgroundImage: "url(/images/auth/3.webp)",
                            }}
                        >
                            <div className="absolute bottom-20 px-10">
                                <p className="text-neutral-50 text-3xl font-medium">
                                    Waktunya Upgrade Pengalaman Audiomu!
                                </p>
                                <p className="text-neutral-50 text-base mt-2">
                                    Nikmati penawaran eksklusif, rekomendasi
                                    khusus, dan kemudahan belanja perangkat
                                    audio terbaik hanya untukmu.
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* built-in pagination rendered by Swiper */}
                </Swiper>

                <style jsx global>{`
                    .swiper-pagination {
                        position: absolute;
                        bottom: 10px;
                        left: 0;
                        width: 100%;
                        text-align: left;
                        padding-left: 40px;
                    }
                    .swiper-pagination-bullet {
                        background-color: rgba(
                            255,
                            255,
                            255,
                            0.5
                        );
                        border-radius: 4px;
                        height: 4px;
                        opacity: 1;
                    }
                    .swiper-pagination-bullet-active {
                        background-color: rgba(
                            255,
                            255,
                            255,
                            1
                        );
                        width: 45px !important;
                        border-radius: 4px;
                        transition: width 0.3s ease, background-color 0.3s ease;
                    }
                `}</style>
            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center bg-white">
                {children}
            </div>
        </div>
    );
}
