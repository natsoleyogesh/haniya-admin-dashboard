import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const Header: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setDropdownOpen] = React.useState(false);

    return (
        <header className="sticky top-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-sm p-4 flex items-center justify-between z-10">
            <button onClick={toggleSidebar} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden">
                <MenuIcon className="w-6 h-6" />
            </button>
            {/* This div is a spacer to keep the right-side items aligned when the hamburger icon is hidden on large screens */}
            <div className="hidden lg:block w-6"></div>
            <div className="flex items-center space-x-4">
                <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                    {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                </button>
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)} onBlur={() => setTimeout(() => setDropdownOpen(false), 150)} className="flex items-center space-x-2">
                        <UserCircleIcon className="w-8 h-8 text-slate-500" />
                        <span className="hidden md:inline text-sm font-medium">Admin</span>
                    </button>
                    <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-20 transition-all duration-200 ease-out ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
