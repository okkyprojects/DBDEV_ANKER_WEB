import React from "react";
import { router } from "@inertiajs/react";

const Pagination = ({ currentPage, totalPages }) => {
    const goToPage = (page) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("page", page);
        router.get(
            `${window.location.pathname}?${searchParams.toString()}`,
            {},
            { preserveScroll: true }
        );
    };

    const parsedCurrent = parseInt(currentPage);
    const parsedTotal = parseInt(totalPages);
    const maxPagesToShow = 3;

    let startPage = Math.max(1, parsedCurrent - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > parsedTotal) {
        endPage = parsedTotal;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return (
        <nav className="mb-10 mt-8 flex justify-center">
            <ul className="flex flex-wrap gap-3">
                <li>
                    <button
                        onClick={() => goToPage(parsedCurrent - 1)}
                        disabled={parsedCurrent === 1}
                        className="px-4 h-10 disabled:cursor-not-allowed"
                    >
                        Sebelumnya
                    </button>
                </li>

                {Array.from(
                    { length: endPage - startPage + 1 },
                    (_, index) => startPage + index
                ).map((page) => (
                    <li key={page}>
                        <button
                            onClick={() => goToPage(page)}
                            className={`px-4 h-10 rounded-xl border ${
                                page === parsedCurrent
                                    ? "bg-primary-100 text-primary-600  border-primary-100"
                                    : "bg-white text-neutral-400 border-neutral-400 hover:bg-gray-100"
                            }`}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                <li>
                    <button
                        onClick={() => goToPage(parsedCurrent + 1)}
                        disabled={parsedCurrent === parsedTotal}
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
