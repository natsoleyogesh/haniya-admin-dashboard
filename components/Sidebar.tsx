import React from 'react';

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
    
    // Updated nav items, removing customers
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
        // Close sidebar on navigation in mobile view
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 bg-black/60 z-20 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />
            
            <aside className={`fixed top-0 left-0 z-30 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 w-64 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-center h-16 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Haniya</h1>
                </div>
                <nav className="p-4">
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
            </aside>
        </>
    );
};

export default Sidebar;
