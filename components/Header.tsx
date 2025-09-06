import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    setActivePage: (page: string) => void;
}

// Icon Components
const MenuIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
);

const SunIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const UserIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;


const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, setActivePage }) => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isProfileMenuOpen, setProfileMenuOpen] = React.useState(false);

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none lg:hidden">
                    <MenuIcon />
                </button>
            </div>

            <div className="flex items-center space-x-4">
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>

                <div className="relative">
                    <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="relative z-10 block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none">
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-600">
                            <UserIcon/>
                        </div>
                    </button>

                    {isProfileMenuOpen && (
                         <div
                            onClick={() => setProfileMenuOpen(false)}
                            className="fixed inset-0 z-10 w-full h-full"
                        ></div>
                    )}

                    {isProfileMenuOpen && (
                        <div className="absolute right-0 z-20 w-48 py-2 mt-2 bg-white rounded-md shadow-xl dark:bg-gray-800">
                            <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('profile'); setProfileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600">
                                Profile
                            </a>
                            <a href="#" onClick={(e) => { e.preventDefault(); logout(); setProfileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600">
                                Log out
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
