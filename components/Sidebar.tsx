import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
    const { logout } = useAuth();
    
    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'manage-employees', label: 'Manage Employees' },
        { id: 'manage-categories', label: 'Manage Categories' },
        { id: 'manage-products', label: 'Manage Products' },
        { id: 'profile', label: 'Profile' }
    ];

    const baseItemClass = "flex items-center w-full px-4 py-3 text-sm font-medium text-left transition-colors duration-200 rounded-lg";
    const activeItemClass = "bg-indigo-600 text-white shadow-lg";
    const inactiveItemClass = "text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700";
    
    const handleNavigation = (page: string) => {
        setActivePage(page);
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 bg-black/60 z-20 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />
            
            <aside className={`fixed top-0 left-0 z-30 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 w-64 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
                <div className="flex-shrink-0 flex items-center justify-center h-16 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Haniya</h1>
                </div>
                <nav className="flex-grow p-4">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.id} className="mb-2">
                                <button
                                    onClick={() => handleNavigation(item.id)}
                                    className={`${baseItemClass} ${activePage === item.id ? activeItemClass : inactiveItemClass}`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex-shrink-0 p-4 mt-auto border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-left text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                    >
                        <LogoutIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;