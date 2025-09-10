import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Category, Product, Status, Employee, EmployeeSalary, EmployeeSalaryRecord } from '../types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface DataContextType {
  categories: Category[];
  products: Product[];
  employees: Employee[];
  employeeSalaries: EmployeeSalaryRecord[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'> & { password: string }) => Promise<void>;
  addEmployeeSalary: (salaryData: EmployeeSalary) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  deleteEmployee: (employeeId: string) => Promise<void>;
  fetchEmployeeSalaries: (employeeId: string) => Promise<void>;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  editingEmployee: Employee | null;
  setEditingEmployee: (employee: Employee | null) => void;
  employeeForSalary: Employee | null;
  setEmployeeForSalary: (employee: Employee | null) => void;
  isLoadingCategories: boolean;
  isLoadingProducts: boolean;
  isLoadingEmployees: boolean;
  isLoadingEmployeeSalaries: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeSalaries, setEmployeeSalaries] = useState<EmployeeSalaryRecord[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeForSalary, setEmployeeForSalary] = useState<Employee | null>(null);
  const { addToast } = useToast();
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isLoadingEmployeeSalaries, setIsLoadingEmployeeSalaries] = useState(true);

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
  
  const fetchEmployees = useCallback(async () => {
    setIsLoadingEmployees(true);
    const token = getAuthToken();
    if (!token) {
      addToast('Authentication session expired. Please log in again.', 'error');
      setIsLoadingEmployees(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch employees. Server responded with an error.');
      
      const data = await response.json();
      if (data.status === true) {
        const mappedEmployees: Employee[] = data.data.map((emp: any) => ({
          id: emp.id.toString(),
          name: emp.name,
          email: emp.email,
          mobile: emp.mobile,
          salary: parseFloat(emp.salary),
          status: emp.status === 'Active' ? Status.Active : Status.Inactive,
        }));
        setEmployees(mappedEmployees);
      } else {
        throw new Error(data.message || 'An unknown error occurred while fetching employees.');
      }
    } catch (error: any) {
      addToast(error.message, 'error');
    } finally {
      setIsLoadingEmployees(false);
    }
  }, [addToast]);

  const fetchEmployeeSalaries = async (employeeId: string) => {
    setIsLoadingEmployeeSalaries(true);
    const token = getAuthToken();
     if (!token) {
      addToast('Authentication session expired. Please log in again.', 'error');
      setIsLoadingEmployeeSalaries(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/employees/employee/${employeeId}/salaries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch employee salaries.');
      const data = await response.json();
      if (data.status === true) {
        setEmployeeSalaries(data.data);
      } else {
         setEmployeeSalaries([]);
         throw new Error(data.message || 'Could not fetch salaries.');
      }
    } catch (error: any) {
      setEmployeeSalaries([]);
      addToast(error.message, 'error');
    } finally {
      setIsLoadingEmployeeSalaries(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchProducts();
      fetchEmployees();
    } else {
      // Clear data on logout
      setCategories([]);
      setProducts([]);
      setEmployees([]);
      setEmployeeSalaries([]);
    }
  }, [isAuthenticated, fetchCategories, fetchProducts, fetchEmployees]);


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
  
  const addEmployee = async (employee: Omit<Employee, 'id'> & { password: string }) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('mobile', employee.mobile);
    formData.append('salary', employee.salary.toString());
    formData.append('password', employee.password);
    formData.append('status', employee.status);

    try {
        const response = await fetch(`${API_BASE_URL}/employees`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        if (data.status !== true) throw new Error(data.message || 'Failed to add employee');
        
        addToast('Employee added successfully!', 'success');
        await fetchEmployees();
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
  };

  const addEmployeeSalary = async (salaryData: EmployeeSalary) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('employee_id', salaryData.employee_id);
    formData.append('sal_date', salaryData.sal_date);
    formData.append('advance', salaryData.advance.toString());
    formData.append('others', salaryData.others.toString());
    formData.append('note', salaryData.note);

    try {
        const response = await fetch(`${API_BASE_URL}/employees/salaries`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        if (data.status !== true) throw new Error(data.message || 'Failed to add salary record');
        
        addToast('Salary record added successfully!', 'success');
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
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

  const updateEmployee = async (updatedEmployee: Employee) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('name', updatedEmployee.name);
    formData.append('email', updatedEmployee.email);
    formData.append('mobile', updatedEmployee.mobile);
    formData.append('salary', updatedEmployee.salary.toString());
    formData.append('status', updatedEmployee.status);
    if (updatedEmployee.password) {
        formData.append('password', updatedEmployee.password);
    }
    formData.append('_method', 'PATCH');

    try {
        const response = await fetch(`${API_BASE_URL}/employees/${updatedEmployee.id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        if (data.status !== true) throw new Error(data.message || 'Failed to update employee');
        
        addToast('Employee updated successfully!', 'success');
        await fetchEmployees();
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
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
  
  const deleteEmployee = async (employeeId: string) => {
    const token = getAuthToken();
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.status !== true) throw new Error(data.message || 'Failed to delete employee');

        addToast('Employee deleted successfully!', 'success');
        await fetchEmployees();
    } catch (error: any) {
        addToast(error.message, 'error');
        throw error;
    }
  };

  return (
    <DataContext.Provider value={{ 
        categories, 
        products, 
        employees,
        employeeSalaries,
        addCategory, 
        addProduct, 
        addEmployee,
        addEmployeeSalary,
        updateCategory, 
        updateProduct,
        updateEmployee,
        deleteCategory,
        deleteProduct,
        deleteEmployee,
        fetchEmployeeSalaries,
        editingCategory,
        setEditingCategory,
        editingProduct,
        setEditingProduct,
        editingEmployee,
        setEditingEmployee,
        employeeForSalary,
        setEmployeeForSalary,
        isLoadingCategories,
        isLoadingProducts,
        isLoadingEmployees,
        isLoadingEmployeeSalaries,
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