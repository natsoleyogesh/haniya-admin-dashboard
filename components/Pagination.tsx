import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);


const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pages = [];
        const pageNeighbours = 1; // Pages around current page

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - pageNeighbours && i <= currentPage + pageNeighbours)) {
                pages.push(i);
            }
        }
        
        const paginatedPages: (number | string)[] = [];
        let lastPage = 0;
        for (const page of pages) {
            if (lastPage) {
                if (page - lastPage === 2) {
                    paginatedPages.push(lastPage + 1);
                } else if (page - lastPage > 2) {
                    paginatedPages.push('...');
                }
            }
            paginatedPages.push(page);
            lastPage = page;
        }
        return paginatedPages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 gap-4">
            <div className="text-sm text-slate-700 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-white">{startIndex}</span> to <span className="font-semibold text-slate-900 dark:text-white">{endIndex}</span> of <span className="font-semibold text-slate-900 dark:text-white">{totalItems}</span> results
            </div>
            <nav className="flex items-center space-x-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center h-9 w-9 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous Page"
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>

                {pageNumbers.map((page, index) =>
                    typeof page === 'string' ? (
                        <span key={`ellipsis-${index}`} className="flex items-center justify-center h-9 w-9 rounded-md text-slate-500 dark:text-slate-400">
                            {page}
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium transition-colors ${
                                currentPage === page
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                             aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center h-9 w-9 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next Page"
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </nav>
        </div>
    );
};

export default Pagination;