import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Category, Product, Status } from '../types';
import { useToast } from './ToastContext';

interface DataContextType {
  categories: Category[];
  products: Product[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateCategory: (category: Category) => void;
  updateProduct: (product: Product) => void;
  deleteCategory: (categoryId: string) => void;
  deleteProduct: (productId: string) => void;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialCategories: Category[] = [
    { id: '1', name: 'Electronics', status: Status.Active },
    { id: '2', name: 'Books', status: Status.Active },
    { id: '3', name: 'Clothing', status: Status.Inactive },
    { id: '4', name: 'Home & Kitchen', status: Status.Active },
    { id: '5', name: 'Toys & Games', status: Status.Active },
    { id: '6', name: 'Sports & Outdoors', status: Status.Inactive },
];

const initialProducts: Product[] = [
    { id: '101', name: 'Laptop Pro', categoryId: '1', status: Status.Active },
    { id: '102', name: 'Wireless Mouse', categoryId: '1', status: Status.Active },
    { id: '103', name: 'React for Beginners', categoryId: '2', status: Status.Active },
    { id: '104', name: 'Smart Coffee Maker', categoryId: '4', status: Status.Active },
    { id: '105', name: 'LED Desk Lamp', categoryId: '4', status: Status.Inactive },
    { id: '106', name: 'Building Blocks Set', categoryId: '5', status: Status.Active },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { addToast } = useToast();

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: new Date().toISOString() };
    setCategories(prev => [...prev, newCategory]);
    addToast('Category added successfully!', 'success');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: new Date().toISOString() };
    setProducts(prev => [...prev, newProduct]);
    addToast('Product added successfully!', 'success');
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat)));
    addToast('Category updated successfully!', 'success');
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(prod => (prod.id === updatedProduct.id ? updatedProduct : prod)));
     addToast('Product updated successfully!', 'success');
  };

  const deleteCategory = (categoryId: string) => {
    const hasProducts = products.some(product => product.categoryId === categoryId);
    if (hasProducts) {
        addToast('Cannot delete category: It has associated products.', 'error');
        return;
    }
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    addToast('Category deleted successfully!', 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== productId));
    addToast('Product deleted successfully!', 'success');
  };

  return (
    <DataContext.Provider value={{ 
        categories, 
        products, 
        addCategory, 
        addProduct, 
        updateCategory, 
        updateProduct,
        deleteCategory,
        deleteProduct,
        editingCategory,
        setEditingCategory,
        editingProduct,
        setEditingProduct
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};