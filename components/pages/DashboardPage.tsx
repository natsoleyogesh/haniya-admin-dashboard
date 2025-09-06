
import React from 'react';
import { useData } from '../../contexts/DataContext';

const DashboardPage: React.FC = () => {
    const { products, categories } = useData();

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Welcome to the Haniya Admin Panel!</p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Products</h2>
                    <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">{products.length}</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Categories</h2>
                    <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">{categories.length}</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Active Products</h2>
                    <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">{products.filter(p => p.status === 'Active').length}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
