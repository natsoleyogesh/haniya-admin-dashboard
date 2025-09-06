import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Category, Status } from '../../types';
import Pagination from '../Pagination';
import ConfirmModal from '../ConfirmModal';

interface ManageCategoriesPageProps {
    setActivePage: (page: string) => void;
}

const ITEMS_PER_PAGE = 5;

const ManageCategoriesPage: React.FC<ManageCategoriesPageProps> = ({ setActivePage }) => {
    const { categories, setEditingCategory, deleteCategory } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = useMemo(() => {
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setActivePage('edit-category');
    };

    const openDeleteModal = (category: Category) => {
        setCategoryToDelete(category);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setCategoryToDelete(null);
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            deleteCategory(categoryToDelete.id);
            // Reset to first page if the last item on a page is deleted
            if (currentCategories.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }
        closeDeleteModal();
    };
    
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Category"
                message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
            />
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Manage Categories</h1>
                 <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset page on new search
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <button 
                        onClick={() => setActivePage('add-category')}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        Add New Category
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {currentCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            category.status === Status.Active 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                            {category.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                        <button onClick={() => handleEdit(category)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors">
                                            Edit
                                        </button>
                                        <button onClick={() => openDeleteModal(category)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {filteredCategories.length === 0 && <p className="p-6 text-center text-gray-500 dark:text-gray-400">No categories found.</p>}
                 {filteredCategories.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredCategories.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={handlePageChange}
                    />
                 )}
            </div>
        </div>
    );
};

export default ManageCategoriesPage;