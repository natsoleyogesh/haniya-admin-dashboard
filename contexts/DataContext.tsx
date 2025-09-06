import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Category, Product, Status } from '../types';

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
];

const initialProducts: Product[] = [
    { id: '101', name: 'Laptop Pro', categoryId: '1', status: Status.Active },
    { id: '102', name: 'Wireless Mouse', categoryId: '1', status: Status.Active },
    { id: '103', name: 'React for Beginners', categoryId: '2', status: Status.Active },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: new Date().toISOString() };
    setCategories(prev => [...prev, newCategory]);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: new Date().toISOString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat)));
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(prod => (prod.id === updatedProduct.id ? updatedProduct : prod)));
  };

  const deleteCategory = (categoryId: string) => {
    const hasProducts = products.some(product => product.categoryId === categoryId);
    if (hasProducts) {
        alert('Cannot delete this category. It is currently associated with one or more products.');
        return;
    }
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== productId));
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