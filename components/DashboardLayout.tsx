import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardPage from './pages/DashboardPage';
import ManageEmployeesPage from './pages/ManageEmployeesPage';
import AddEmployeePage from './pages/AddEmployeePage';
import EditEmployeePage from './pages/EditEmployeePage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import AddCategoryPage from './pages/AddCategoryPage';
import ManageProductsPage from './pages/ManageProductsPage';
import AddProductPage from './pages/AddProductPage';
import ProfilePage from './pages/ProfilePage';
import EditCategoryPage from './pages/EditCategoryPage';
import EditProductPage from './pages/EditProductPage';

const DashboardLayout: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard': return <DashboardPage />;
            case 'manage-employees': return <ManageEmployeesPage setActivePage={setActivePage}/>;
            case 'add-employee': return <AddEmployeePage setActivePage={setActivePage}/>;
            case 'edit-employee': return <EditEmployeePage setActivePage={setActivePage}/>;
            case 'manage-categories': return <ManageCategoriesPage setActivePage={setActivePage}/>;
            case 'add-category': return <AddCategoryPage setActivePage={setActivePage}/>;
            case 'edit-category': return <EditCategoryPage setActivePage={setActivePage}/>;
            case 'manage-products': return <ManageProductsPage setActivePage={setActivePage}/>;
            case 'add-product': return <AddProductPage setActivePage={setActivePage}/>;
            case 'edit-product': return <EditProductPage setActivePage={setActivePage}/>;
            case 'profile': return <ProfilePage />;
            default: return <DashboardPage />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Sidebar isSidebarOpen={isSidebarOpen} setActivePage={setActivePage} activePage={activePage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} setActivePage={setActivePage} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                    <div className="container mx-auto px-6 py-8 transition-opacity duration-300 ease-in-out">
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;