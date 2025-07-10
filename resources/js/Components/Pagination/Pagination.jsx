import React from "react";
import { router } from "@inertiajs/react";

const Pagination = ({ links }) => {
    const goToPage = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true });
    };

    // Ambil current page dari link yang active
    const activeLink = links.find((l) => l.active);
    const currentPage = activeLink ? parseInt(activeLink.label) : 1;

    // Ambil angka-angka aja (exclude prev/next)
    const numberedLinks = links.filter((link) => !isNaN(link.label));

    const maxPagesToShow = 3;
    const parsedTotal = numberedLinks.length;
    let startIndex =
        numberedLinks.findIndex((l) => parseInt(l.label) === currentPage) -
        Math.floor(maxPagesToShow / 2);

    if (startIndex < 0) startIndex = 0;
    let paginatedLinks = numberedLinks.slice(
        startIndex,
        startIndex + maxPagesToShow
    );

    if (
        paginatedLinks.length < maxPagesToShow &&
        numberedLinks.length >= maxPagesToShow
    ) {
        paginatedLinks = numberedLinks.slice(-maxPagesToShow);
    }

    const previous = links.find((l) => l.label.toLowerCase().includes("prev"));
    const next = links.find((l) => l.label.toLowerCase().includes("next"));

    return (
        <nav className="mb-10 mt-8 flex justify-center">
            <ul className="flex flex-wrap gap-3">
                <li>
                    <button
                        onClick={() => goToPage(previous?.url)}
                        disabled={!previous?.url}
                        className="px-4 h-10 disabled:cursor-not-allowed"
                    >
                        Sebelumnya
                    </button>
                </li>

                {paginatedLinks.map((link, index) => (
                    <li key={index}>
                        <button
                            onClick={() => goToPage(link.url)}
                            className={`px-4 h-10 rounded-xl border ${
                                link.active
                                    ? "bg-primary-100 text-primary-600 border-primary-100"
                                    : "bg-white text-neutral-400 border-neutral-400 hover:bg-gray-100"
                            }`}
                        >
                            {link.label}
                        </button>
                    </li>
                ))}

                <li>
                    <button
                        onClick={() => goToPage(next?.url)}
                        disabled={!next?.url}
                        className="px-4 h-10 disabled:cursor-not-allowed"
                    >
                        Berikutnya
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
