import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Product, Status } from '../../types';
import Pagination from '../Pagination';
import ConfirmModal from '../ConfirmModal';

interface ManageProductsPageProps {
    setActivePage: (page: string) => void;
}

const ITEMS_PER_PAGE = 5;

const ManageProductsPage: React.FC<ManageProductsPageProps> = ({ setActivePage }) => {
    const { products, categories, setEditingProduct, deleteProduct, isLoadingProducts } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const getCategoryName = (categoryId: string) => {
        return categories.find(c => c.id === categoryId)?.name || 'N/A';
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setActivePage('edit-product');
    };

    const openDeleteModal = (product: Product) => {
        setProductToDelete(product);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setProductToDelete(null);
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            deleteProduct(productToDelete.id);
            if (currentProducts.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }
        closeDeleteModal();
    };
    
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
             <ConfirmModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete the product "${productToDelete?.name}"? This action cannot be undone.`}
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Manage Products</h1>
                <button 
                    onClick={() => setActivePage('add-product')}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105">
                    Add New Product
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">S.No.</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {isLoadingProducts ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-500 dark:text-slate-400">Loading products...</td>
                                </tr>
                            ) : currentProducts.length > 0 ? (
                                currentProducts.map((product, index) => (
                                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{indexOfFirstItem + index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{getCategoryName(product.categoryId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                product.status === Status.Active 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                            <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 font-medium transition-colors">
                                                Edit
                                            </button>
                                            <button onClick={() => openDeleteModal(product)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 font-medium transition-colors">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-500 dark:text-slate-400">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                 {!isLoadingProducts && products.length > ITEMS_PER_PAGE && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={products.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={handlePageChange}
                    />
                 )}
            </div>
        </div>
    );
};

export default ManageProductsPage;