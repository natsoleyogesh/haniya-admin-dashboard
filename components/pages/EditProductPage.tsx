import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Status } from '../../types';

interface EditProductPageProps {
    setActivePage: (page: string) => void;
}

const EditProductPage: React.FC<EditProductPageProps> = ({ setActivePage }) => {
    const { categories, editingProduct, updateProduct, setEditingProduct } = useData();
    
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState<Status>(Status.Active);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editingProduct) {
            setName(editingProduct.name);
            setCategoryId(editingProduct.categoryId);
            setStatus(editingProduct.status);
        } else {
            setActivePage('manage-products');
        }
    }, [editingProduct, setActivePage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !categoryId || !editingProduct) {
            alert("Please fill out all fields.");
            return;
        }
        setIsSaving(true);
        try {
            await updateProduct({ ...editingProduct, name, categoryId, status });
            setEditingProduct(null);
            setActivePage('manage-products');
        } catch (error) {
            // Error is handled by context toast
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCancel = () => {
        setEditingProduct(null);
        setActivePage('manage-products');
    };

    if (!editingProduct) {
        return <div className="text-center p-4">Loading or no product selected...</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Edit Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                    <input
                        type="text"
                        id="productName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        required
                    />
                </div>
                 <div className="mb-4">
                    <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                        id="productCategory"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="productStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                        id="productStatus"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status)}
                        className="block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value={Status.Active}>Active</option>
                        <option value={Status.Inactive}>Inactive</option>
                    </select>
                </div>
                <div className="flex items-center justify-end space-x-4">
                    <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 focus:outline-none">
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        {isSaving ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductPage;