import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
    isSidebarOpen: boolean;
    setActivePage: (page: string) => void;
    activePage: string;
}

// Icon Components
const DashboardIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const EmployeesIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const CategoriesIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;
const ProductsIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>;
const LogoutIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;
const ChevronDownIcon = ({ isOpen }: {isOpen: boolean}) => <svg className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;

const employeePages = ['manage-employees', 'add-employee', 'edit-employee'];
const categoryPages = ['manage-categories', 'add-category', 'edit-category'];
const productPages = ['manage-products', 'add-product', 'edit-product'];

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setActivePage, activePage }) => {
    const { logout } = useAuth();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        employees: employeePages.includes(activePage),
        categories: categoryPages.includes(activePage),
        products: productPages.includes(activePage),
    });

    const toggleMenu = (menu: string) => {
        setOpenMenus(prev => ({...prev, [menu]: !prev[menu]}));
    };

    const isMenuActive = (pages: string[]) => pages.includes(activePage);

    return (
        <div className={`flex-shrink-0 relative flex flex-col bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
            <div className="flex items-center justify-center h-20 border-b-2 border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Haniya</h1>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                <a href="#" onClick={() => setActivePage('dashboard')} className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors ${activePage === 'dashboard' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                    <DashboardIcon />
                    <span className="mx-4 font-medium">Dashboard</span>
                </a>
                
                <div className={`rounded-md ${isMenuActive(employeePages) ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}>
                    <button onClick={() => toggleMenu('employees')} className="flex items-center justify-between w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <div className="flex items-center">
                            <EmployeesIcon />
                            <span className="mx-4 font-medium">Employee Master</span>
                        </div>
                        <ChevronDownIcon isOpen={openMenus.employees} />
                    </button>
                    {openMenus.employees && (
                        <div className="pl-8 mt-1 space-y-1 pb-2">
                            <a href="#" onClick={() => setActivePage('manage-employees')} className={`block px-4 py-2 text-sm rounded-md ${activePage === 'manage-employees' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-gray-400'} hover:text-indigo-600 dark:hover:text-indigo-400`}>Manage Employees</a>
                            <a href="#" onClick={() => setActivePage('add-employee')} className={`block px-4 py-2 text-sm rounded-md ${activePage === 'add-employee' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-gray-400'} hover:text-indigo-600 dark:hover:text-indigo-400`}>Create Employee</a>
                        </div>
                    )}
                </div>

                <div className={`rounded-md ${isMenuActive(categoryPages) ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}>
                    <button onClick={() => toggleMenu('categories')} className="flex items-center justify-between w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <div className="flex items-center">
                            <CategoriesIcon />
                            <span className="mx-4 font-medium">Categories</span>
                        </div>
                        <ChevronDownIcon isOpen={openMenus.categories} />
                    </button>
                    {openMenus.categories && (
                        <div className="pl-8 mt-1 space-y-1 pb-2">
                            <a href="#" onClick={() => setActivePage('manage-categories')} className={`block px-4 py-2 text-sm rounded-md ${activePage === 'manage-categories' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-gray-400'} hover:text-indigo-600 dark:hover:text-indigo-400`}>Manage Categories</a>
                            <a href="#" onClick={() => setActivePage('add-category')} className={`block px-4 py-2 text-sm rounded-md ${activePage === 'add-category' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-gray-400'} hover:text-indigo-600 dark:hover:text-indigo-400`}>Add Category</a>
                        </div>
                    )}
                </div>
                
                 <div className={`rounded-md ${isMenuActive(productPages) ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}>
                    <button onClick={() => toggleMenu('products')} className="flex items-center justify-between w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <div className="flex items-center">
                            <ProductsIcon />
                            <span className="mx-4 font-medium">Products</span>
                        </div>
                        <ChevronDownIcon isOpen={openMenus.products} />
                    </button>
                    {openMenus.products && (
                        <div className="pl-8 mt-1 space-y-1 pb-2">
                            <a href="#" onClick={() => setActivePage('manage-products')} className={`block px-4 py-2 text-sm rounded-md ${activePage === 'manage-products' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-gray-400'} hover:text-indigo-600 dark:hover:text-indigo-400`}>Manage Products</a>
                            <a href="#" onClick={() => setActivePage('add-product')} className={`block px-4 py-2 text-sm rounded-md ${activePage === 'add-product' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-gray-400'} hover:text-indigo-600 dark:hover:text-indigo-400`}>Add Product</a>
                        </div>
                    )}
                </div>

            </nav>
            <div className="px-4 pb-4">
                <button onClick={logout} className="flex items-center justify-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors">
                    <LogoutIcon />
                    <span className="mx-4 font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;