import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Category, Product, Status, Employee } from '../types';
import { useToast } from './ToastContext';

interface DataContextType {
  categories: Category[];
  products: Product[];
  employees: Employee[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateCategory: (category: Category) => void;
  updateProduct: (product: Product) => void;
  updateEmployee: (employee: Employee) => void;
  deleteCategory: (categoryId: string) => void;
  deleteProduct: (productId: string) => void;
  deleteEmployee: (employeeId: string) => void;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  editingEmployee: Employee | null;
  setEditingEmployee: (employee: Employee | null) => void;
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
];

const initialEmployees: Employee[] = [
    { id: 'e1', name: 'John Doe', email: 'john.d@example.com', mobile: '123-456-7890', salary: 50000, password: 'password123', monthlyAttendance: 28, monthlyAdvance: 5000 },
    { id: 'e2', name: 'Jane Smith', email: 'jane.s@example.com', mobile: '098-765-4321', salary: 65000, password: 'password123', monthlyAttendance: 30, monthlyAdvance: 2000 },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
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
  
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = { ...employee, id: new Date().toISOString() };
    setEmployees(prev => [...prev, newEmployee]);
    addToast('Employee added successfully!', 'success');
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat)));
    addToast('Category updated successfully!', 'success');
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(prod => (prod.id === updatedProduct.id ? updatedProduct : prod)));
     addToast('Product updated successfully!', 'success');
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp)));
    addToast('Employee updated successfully!', 'success');
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
        setEditingEmployee
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