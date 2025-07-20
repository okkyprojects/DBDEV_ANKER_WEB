import React from "react";
import { router } from "@inertiajs/react";
import {
    FiChevronsLeft,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsRight,
} from "react-icons/fi";

const PaginationDashboard = ({ links, meta }) => {
    const goToPage = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true });
    };

    const activeLink = links.find((l) => l.active);
    const currentPage = activeLink ? parseInt(activeLink.label) : 1;

    const numberedLinks = links.filter((l) => !isNaN(l.label));
    const maxPagesToShow = 3;
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
    const firstPageUrl = meta?.current_page > 1 ? `${meta?.path}?page=1` : null;
    const lastPageUrl =
        meta?.current_page < meta?.last_page
            ? `${meta?.path}?page=${meta?.last_page}`
            : null;

    return (
        <div className="flex flex-col md:flex-row md:justify-between items-center mt-8 mb-10 gap-4 text-sm text-neutral-400">
            <p className="text-xs">
                Menampilkan {meta?.from} - {meta?.to} dari {meta?.total} item
            </p>

            <nav className="flex items-center gap-2">
                <button
                    onClick={() => goToPage(firstPageUrl)}
                    disabled={!firstPageUrl}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 disabled:opacity-50"
                >
                    <FiChevronsLeft />
                </button>
                <button
                    onClick={() => goToPage(previous?.url)}
                    disabled={!previous?.url}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 disabled:opacity-50"
                >
                    <FiChevronLeft />
                </button>

                {paginatedLinks.map((link, index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(link.url)}
                        className={`w-9 h-9 rounded-lg border text-sm ${
                            link.active
                                ? "bg-primary-100 text-primary-600 border-primary-300"
                                : "text-neutral-500 border-neutral-300 hover:bg-neutral-100"
                        }`}
                    >
                        {link.label}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(next?.url)}
                    disabled={!next?.url}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 disabled:opacity-50"
                >
                    <FiChevronRight />
                </button>
                <button
                    onClick={() => goToPage(lastPageUrl)}
                    disabled={!lastPageUrl}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 disabled:opacity-50"
                >
                    <FiChevronsRight />
                </button>
            </nav>
        </div>
    );
};

export default PaginationDashboard;
