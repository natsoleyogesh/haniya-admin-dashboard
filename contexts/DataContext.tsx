import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Category, Product, Status, Employee } from '../types';
import { useToast } from './ToastContext';

interface DataContextType {
  categories: Category[];
  products: Product[];
  employees: Employee[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateCategory: (category: Category) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  updateEmployee: (employee: Employee) => void;
  deleteCategory: (categoryId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  deleteEmployee: (employeeId: string) => void;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  editingEmployee: Employee | null;
  setEditingEmployee: (employee: Employee | null) => void;
  isLoadingCategories: boolean;
  isLoadingProducts: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialEmployees: Employee[] = [
    { id: 'e1', name: 'John Doe', email: 'john.d@example.com', mobile: '123-456-7890', salary: 50000, password: 'password123', monthlyAttendance: 28, monthlyAdvance: 5000 },
    { id: 'e2', name: 'Jane Smith', email: 'jane.s@example.com', mobile: '098-765-4321', salary: 65000, password: 'password123', monthlyAttendance: 30, monthlyAdvance: 2000 },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { addToast } = useToast();
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const API_BASE_URL = 'https://haniya.natsol.in/api/admin';
  const getAuthToken = () => localStorage.getItem('authToken');

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    const token = getAuthToken();
    if (!token) {
      addToast('Authentication session expired. Please log in again.', 'error');
      setIsLoadingCategories(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch categories. Server responded with an error.');
      
      const data = await response.json();
      if (data.status === true) {
        const mappedCategories: Category[] = data.data.map((cat: any) => ({
          id: cat.id.toString(),
          name: cat.name,
          status: cat.status === 1 ? Status.Active : Status.Inactive,
        }));
        setCategories(mappedCategories);
      } else {
        throw new Error(data.message || 'An unknown error occurred while fetching categories.');
      }
    } catch (error: any) {
      addToast(error.message, 'error');
    } finally {
      setIsLoadingCategories(false);
    }
  }, [addToast]);

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    const token = getAuthToken();
    if (!token) {
      addToast('Authentication session expired. Please log in again.', 'error');
      setIsLoadingProducts(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch products. Server responded with an error.');
      
      const data = await response.json();
      if (data.status === true) {
        const mappedProducts: Product[] = data.data.map((prod: any) => ({
          id: prod.id.toString(),
          name: prod.name,
          categoryId: prod.cat_id.toString(),
          status: prod.status === 'Active' ? Status.Active : Status.Inactive,
        }));
        setProducts(mappedProducts);
      } else {
        throw new Error(data.message || 'An unknown error occurred while fetching products.');
      }
    } catch (error: any) {
      addToast(error.message, 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);


  const addCategory = async (category: Omit<Category, 'id'>) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('status', category.status === Status.Active ? '1' : '0');

    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        if (data.status !== true) throw new Error(data.message || 'Failed to add category');
        
        addToast('Category added successfully!', 'success');
        await fetchCategories(); // Refetch to get the latest list with new ID
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
  };

  const updateCategory = async (updatedCategory: Category) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('name', updatedCategory.name);
    formData.append('status', updatedCategory.status === Status.Active ? '1' : '0');
    formData.append('_method', 'PUT');

    try {
        const response = await fetch(`${API_BASE_URL}/categories/${updatedCategory.id}`, {
            method: 'POST', // Using POST for FormData with _method=PUT
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        if (data.status !== true) throw new Error(data.message || 'Failed to update category');
        
        addToast('Category updated successfully!', 'success');
        await fetchCategories(); // Refetch to ensure data consistency
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    const hasProducts = products.some(product => product.categoryId === categoryId);
    if (hasProducts) {
        addToast('Cannot delete category: It has associated products.', 'error');
        return;
    }
    
    const token = getAuthToken();
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.status !== true) throw new Error(data.message || 'Failed to delete category');

        addToast('Category deleted successfully!', 'success');
        await fetchCategories();
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
  };
  
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('cat_id', product.categoryId);
    formData.append('status', product.status === Status.Active ? 'Active' : 'DeActive');

    try {
        const response = await fetch(`${API_BASE_URL}/items`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        if (data.status !== true) throw new Error(data.message || 'Failed to add product');
        
        addToast('Product added successfully!', 'success');
        await fetchProducts();
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
  };
  
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = { ...employee, id: new Date().toISOString() };
    setEmployees(prev => [...prev, newEmployee]);
    addToast('Employee added successfully!', 'success');
  };

  const updateProduct = async (updatedProduct: Product) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('name', updatedProduct.name);
    formData.append('cat_id', updatedProduct.categoryId);
    formData.append('status', updatedProduct.status === Status.Active ? 'Active' : 'DeActive');
    formData.append('_method', 'PUT');

    try {
        const response = await fetch(`${API_BASE_URL}/items/${updatedProduct.id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        if (data.status !== true) throw new Error(data.message || 'Failed to update product');
        
        addToast('Product updated successfully!', 'success');
        await fetchProducts();
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp)));
    addToast('Employee updated successfully!', 'success');
  };

  const deleteProduct = async (productId: string) => {
    const token = getAuthToken();
    try {
        const response = await fetch(`${API_BASE_URL}/items/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.status !== true) throw new Error(data.message || 'Failed to delete product');

        addToast('Product deleted successfully!', 'success');
        await fetchProducts();
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
  };
  
  const deleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    addToast('Employee deleted successfully!', 'success');
  };

  return (
    <DataContext.Provider value={{ 
        categories, 
        products, 
        employees,
        addCategory, 
        addProduct, 
        addEmployee,
        updateCategory, 
        updateProduct,
        updateEmployee,
        deleteCategory,
        deleteProduct,
        deleteEmployee,
        editingCategory,
        setEditingCategory,
        editingProduct,
        setEditingProduct,
        editingEmployee,
        setEditingEmployee,
        isLoadingCategories,
        isLoadingProducts,
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