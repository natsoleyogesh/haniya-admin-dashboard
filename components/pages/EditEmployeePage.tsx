import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Status } from '../../types';

interface EditEmployeePageProps {
    setActivePage: (page: string) => void;
}

const EditEmployeePage: React.FC<EditEmployeePageProps> = ({ setActivePage }) => {
    const { editingEmployee, updateEmployee, setEditingEmployee } = useData();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [salary, setSalary] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<Status>(Status.Active);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editingEmployee) {
            setName(editingEmployee.name);
            setEmail(editingEmployee.email);
            setMobile(editingEmployee.mobile);
            setSalary(editingEmployee.salary.toString());
            setStatus(editingEmployee.status);
        } else {
            setActivePage('manage-employees');
        }
    }, [editingEmployee, setActivePage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEmployee) return;
        
        setIsSaving(true);
        try {
            await updateEmployee({
                ...editingEmployee,
                name,
                email,
                mobile,
                salary: parseFloat(salary),
                status,
                password: password || undefined,
            });
            setEditingEmployee(null);
            setActivePage('manage-employees');
        } catch (error) {
            // Error is handled in context
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCancel = () => {
        setEditingEmployee(null);
        setActivePage('manage-employees');
    };
    
    const commonInputStyles = "block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

    if (!editingEmployee) {
        return <div className="text-center p-4">Loading or no employee selected...</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Edit Employee</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee Name</label>
                    <input type="text" id="employeeName" value={name} onChange={(e) => setName(e.target.value)} className={commonInputStyles} required />
                </div>
                <div>
                    <label htmlFor="employeeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input type="email" id="employeeEmail" value={email} onChange={(e) => setEmail(e.target.value)} className={commonInputStyles} required />
                </div>
                <div>
                    <label htmlFor="employeeMobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                    <input type="tel" id="employeeMobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className={commonInputStyles} required />
                </div>
                <div>
                    <label htmlFor="employeeSalary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary</label>
                    <input type="number" id="employeeSalary" value={salary} onChange={(e) => setSalary(e.target.value)} className={commonInputStyles} required />
                </div>
                 <div>
                    <label htmlFor="employeePassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input 
                        type="password" 
                        id="employeePassword" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className={commonInputStyles}
                        placeholder="Leave blank to keep current password"
                     />
                </div>
                <div>
                    <label htmlFor="employeeStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                     <select
                        id="employeeStatus"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status)}
                        className="block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value={Status.Active}>Active</option>
                        <option value={Status.Inactive}>Inactive</option>
                    </select>
                </div>
                <div className="md:col-span-2 flex items-center justify-end space-x-4 mt-4">
                    <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 focus:outline-none">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        {isSaving ? 'Updating...' : 'Update Employee'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEmployeePage;