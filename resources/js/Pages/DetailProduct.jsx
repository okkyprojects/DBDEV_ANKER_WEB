import { Link, Head } from "@inertiajs/react";
import HomeLayout from "@/Layouts/HomeLayout";
import ProductCard from "@/Components/Card/ProductCard";
import { useState } from "react";
import { FaCartShopping, FaLocationDot } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";
import { products } from "@/Dummy/dummy";

export default function DetailProduct() {
    const images = [
        "/images/dummy/product/product.jpeg",
        "/images/dummy/product/product2.svg",
        "/images/dummy/product/product3.jpg",
    ];

    const [activeImage, setActiveImage] = useState(images[0]);

    return (
        <HomeLayout>
            <Head title="Detail Produk" />
            <section className="max-w-7xl mx-auto px-5 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-4 sm:p-5 rounded-xl">
                        <img
                            src={activeImage}
                            alt="Gambar utama"
                            className="w-full h-60 sm:h-80 md:h-[28rem] object-cover object-center rounded-2xl mb-5 transition-all duration-300"
                        />

                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Thumbnail ${index}`}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover cursor-pointer border-2 transition-all duration-200 ${
                                        activeImage === img
                                            ? "border-primary-600"
                                            : "border-transparent hover:border-neutral-100"
                                    }`}
                                />
                            ))}
                        </div>

                        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 mt-8 mb-4">
                            Deskripsi Produk
                        </h2>
                        <p className="text-sm sm:text-base font-light text-justify">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Hic et sit itaque magni assumenda, doloremque
                            illo deleniti aut consequuntur eos ipsam, dolor
                            dolorum praesentium? Repellendus debitis aperiam
                            minima odio assumenda, quam inventore alias deleniti
                            ducimus, ea amet facere sit totam sint, ratione
                            similique iure. Minima et, obcaecati quae
                            voluptatem, voluptatum nobis delectus, quia
                            consectetur ducimus libero explicabo reprehenderit
                            quidem labore exercitationem ipsam repellendus nihil
                            dolore! Nobis laboriosam vero, impedit aspernatur
                            fugit natus recusandae nihil. Nulla ratione
                            veritatis suscipit, perferendis magni aliquid. Nemo
                            ducimus quidem, animi vitae, dolorem aspernatur
                            repellendus magnam eaque assumenda quae quaerat
                            reiciendis dicta tempore dolores inventore
                            blanditiis.
                        </p>

                        <div className="mt-5 flex items-center gap-3">
                            <img
                                src="/images/profile/profil.jpg"
                                alt=""
                                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                            />
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-medium">
                                    Nama Toko/Dealer
                                </p>
                                <p className="flex items-center gap-1 text-[10px] sm:text-xs font-light text-neutral-400">
                                    <FaLocationDot size={14} />
                                    Malang, Jawa Timur
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 sm:p-5 rounded-xl h-fit sticky top-32">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                                <div className="px-4 py-1.5 rounded-full bg-primary-100 text-primary-800">
                                    Kategori 1
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-primary-100 text-primary-800">
                                    Kategori 2
                                </div>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">
                                Nama Produk
                            </h2>

                            <div className="flex flex-col gap-1">
                                <p className="line-through text-lg sm:text-xl text-neutral-500">
                                    Rp 1.000.000
                                </p>
                                <p className="text-2xl sm:text-3xl text-primary-600 font-medium">
                                    Rp 750.000
                                </p>
                            </div>

                            <div className="flex gap-2 items-center text-sm">
                                <p>Stok :</p>
                                <div className="text-warning-500 flex items-center gap-1">
                                    <IoIosInformationCircle size={16} />
                                    <p>Tersisa 1 lagi</p>
                                </div>
                            </div>

                            <div className="flex gap-2 items-center text-sm">
                                <p>Varian :</p>
                                <p className="font-bold">Varian x</p>
                            </div>

                            <div className="flex flex-wrap gap-3 sm:gap-4">
                                {images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Thumbnail ${index}`}
                                        className="w-20 h-20 rounded-xl object-cover cursor-pointer border-2 border-transparent hover:border-neutral-100 transition-all duration-200"
                                    />
                                ))}
                            </div>

                            <button className="flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 transition-colors duration-200 py-3 px-4 rounded-xl text-neutral-50 shadow-md text-sm sm:text-base">
                                <FaCartShopping className="text-base sm:text-lg" />
                                <p className="font-medium">
                                    Tambah ke keranjang
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-5 pb-10">
                <h2 className="text-xl sm:text-2xl  font-medium text-neutral-900 mb-5">
                    Produk Lainnya
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {products.map((item, index) => (
                        <ProductCard key={index} item={item} />
                    ))}
                </div>
            </section>
        </HomeLayout>
    );
}
