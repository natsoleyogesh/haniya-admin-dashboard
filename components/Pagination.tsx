import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

    if (totalPages <= 1) {
        return null;
    }

    const goToPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-700 dark:text-slate-400">
                Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalItems}</span> results
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                    Previous
                </button>
                <span className="text-sm text-slate-700 dark:text-slate-400">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;