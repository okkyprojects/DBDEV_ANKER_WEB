import { formatRupiah } from "@/Utils/utils";
import { Link } from "@inertiajs/react";
import { FaStar } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";

export default function ProductCard({ item }) {
    return (
        <Link
            href={route("home.product.show", { uuid: item.uuid })}
            className="bg-white rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition"
        >
            <img
                src={item.img}
                alt={item.name}
                className="w-full h-36 lg:h-56 object-cover object-center"
            />
            <div className="p-5 flex flex-col gap-1">
                <p className="text-sm sm:text-base font-medium text-neutral-800">
                    {item.name}
                </p>
                <p className="text-xs sm:text-sm font-light text-neutral-600">
                    {item.category.name}
                </p>

                <div className="flex items-center gap-1 my-1.5">
                    <div className="flex items-center gap-1 text-warning-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} />
                        ))}
                    </div>
                    <p className="text-neutral-500 text-sm">(80)</p>
                </div>

                <p className="text-lg sm:text-xl text-neutral-900 font-medium mb-1.5">
                    {formatRupiah(item.price)}
                </p>
                <p className="text-xs sm:text-sm font-light text-neutral-900">
                    Siapa
                </p>
                <p className="flex items-center gap-1 text-[10px] sm:text-xs text-neutral-400">
                    <FaLocationDot size={15} /> Kota Malang
                </p>
            </div>
        </Link>
    );
}
