import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardPage from './pages/DashboardPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import AddCategoryPage from './pages/AddCategoryPage';
import EditCategoryPage from './pages/EditCategoryPage';
import ManageProductsPage from './pages/ManageProductsPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import ManageEmployeesPage from './pages/ManageEmployeesPage';
import AddEmployeePage from './pages/AddEmployeePage';
import EditEmployeePage from './pages/EditEmployeePage';
import ProfilePage from './pages/ProfilePage';

const DashboardLayout: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on route change on mobile
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, [activePage]);

    const renderPage = () => {
        const props = { setActivePage };
        switch (activePage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'manage-categories':
                return <ManageCategoriesPage {...props} />;
            case 'add-category':
                return <AddCategoryPage {...props} />;
            case 'edit-category':
                return <EditCategoryPage {...props} />;
            case 'manage-products':
                return <ManageProductsPage {...props} />;
            case 'add-product':
                return <AddProductPage {...props} />;
            case 'edit-product':
                return <EditProductPage {...props} />;
            case 'manage-employees':
                return <ManageEmployeesPage {...props} />;
            case 'add-employee':
                return <AddEmployeePage {...props} />;
            case 'edit-employee':
                return <EditEmployeePage {...props} />;
            case 'profile':
                return <ProfilePage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                isOpen={isSidebarOpen} 
                setIsOpen={setSidebarOpen} 
            />
            <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-64">
                <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div key={activePage} className="animate-fade-in">
                        {renderPage()}
                    </div>
                </main>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;