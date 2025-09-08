import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Category, Product, Status, Employee } from '../types';
import { useToast } from './ToastContext';

interface DataContextType {
  categories: Category[];
  products: Product[];
  employees: Employee[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateCategory: (category: Category) => Promise<void>;
  updateProduct: (product: Product) => void;
  updateEmployee: (employee: Employee) => void;
  deleteCategory: (categoryId: string) => Promise<void>;
  deleteProduct: (productId: string) => void;
  deleteEmployee: (employeeId: string) => void;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  editingEmployee: Employee | null;
  setEditingEmployee: (employee: Employee | null) => void;
  isLoadingCategories: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProducts: Product[] = [
    { id: '101', name: 'Laptop Pro', categoryId: '1', status: Status.Active },
    { id: '102', name: 'Wireless Mouse', categoryId: '1', status: Status.Active },
    { id: '103', name: 'React for Beginners', categoryId: '2', status: Status.Active },
];

const initialEmployees: Employee[] = [
    { id: 'e1', name: 'John Doe', email: 'john.d@example.com', mobile: '123-456-7890', salary: 50000, password: 'password123', monthlyAttendance: 28, monthlyAdvance: 5000 },
    { id: 'e2', name: 'Jane Smith', email: 'jane.s@example.com', mobile: '098-765-4321', salary: 65000, password: 'password123', monthlyAttendance: 30, monthlyAdvance: 2000 },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { addToast } = useToast();
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

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

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


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
        setCategories(prev => prev.filter(cat => cat.id !== categoryId)); // Optimistic UI update
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
  };
  
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: new Date().toISOString() };
    setProducts(prev => [...prev, newProduct]);
    addToast('Product added successfully!', 'success');
  };
  
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = { ...employee, id: new Date().toISOString() };
    setEmployees(prev => [...prev, newEmployee]);
    addToast('Employee added successfully!', 'success');
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(prod => (prod.id === updatedProduct.id ? updatedProduct : prod)));
     addToast('Product updated successfully!', 'success');
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp)));
    addToast('Employee updated successfully!', 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== productId));
    addToast('Product deleted successfully!', 'success');
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