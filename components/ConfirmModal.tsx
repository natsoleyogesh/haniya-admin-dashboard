import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-out scale-95 opacity-0 animate-scale-up">
                <h3 id="modal-title" className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes scale-up {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-scale-up {
                    animation: scale-up 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;