import React from 'react';
import { useToastState } from '../contexts/ToastContext';

// Icons for different toast types
const SuccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


const toastConfig = {
    success: { icon: <SuccessIcon />, bg: 'bg-green-500' },
    error: { icon: <ErrorIcon />, bg: 'bg-red-500' },
    info: { icon: <InfoIcon />, bg: 'bg-blue-500' },
};

const ToastContainer: React.FC = () => {
    const toasts = useToastState();

    return (
        <div className="fixed top-5 right-5 z-50 space-y-3 w-full max-w-xs">
            {toasts.map(toast => {
                const config = toastConfig[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={`relative flex items-center p-4 rounded-lg shadow-lg text-white ${config.bg} animate-fade-in-right`}
                    >
                        <div className="flex-shrink-0">{config.icon}</div>
                        <div className="ml-3 text-sm font-medium">{toast.message}</div>
                    </div>
                );
            })}
             <style>{`
                @keyframes fade-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-fade-in-right {
                    animation: fade-in-right 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ToastContainer;