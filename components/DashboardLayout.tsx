import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardPage from './pages/DashboardPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import AddCategoryPage from './pages/AddCategoryPage';
import EditCategoryPage from './pages/EditCategoryPage';
import ManageProductsPage from './pages/ManageProductsPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import ProfilePage from './pages/ProfilePage';
import ManageEmployeesPage from './pages/ManageEmployeesPage';
import AddEmployeePage from './pages/AddEmployeePage';
import EditEmployeePage from './pages/EditEmployeePage';

const DashboardLayout: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'manage-categories':
                return <ManageCategoriesPage setActivePage={setActivePage} />;
            case 'add-category':
                return <AddCategoryPage setActivePage={setActivePage} />;
            case 'edit-category':
                return <EditCategoryPage setActivePage={setActivePage} />;
            case 'manage-products':
                return <ManageProductsPage setActivePage={setActivePage} />;
            case 'add-product':
                return <AddProductPage setActivePage={setActivePage} />;
            case 'edit-product':
                return <EditProductPage setActivePage={setActivePage} />;
            case 'manage-employees':
                return <ManageEmployeesPage setActivePage={setActivePage} />;
            case 'add-employee':
                return <AddEmployeePage setActivePage={setActivePage} />;
            case 'edit-employee':
                return <EditEmployeePage setActivePage={setActivePage} />;
            case 'profile':
                return <ProfilePage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    pageTitle={activePage.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
