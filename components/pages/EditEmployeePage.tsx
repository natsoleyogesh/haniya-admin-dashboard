import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

interface EditEmployeePageProps {
    setActivePage: (page: string) => void;
}

const EditEmployeePage: React.FC<EditEmployeePageProps> = ({ setActivePage }) => {
    const { editingEmployee, updateEmployee, setEditingEmployee } = useData();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [salary, setSalary] = useState('');
    const [monthlyAttendance, setMonthlyAttendance] = useState('');
    const [monthlyAdvance, setMonthlyAdvance] = useState('');

    useEffect(() => {
        if (editingEmployee) {
            setName(editingEmployee.name);
            setEmail(editingEmployee.email);
            setMobile(editingEmployee.mobile);
            setSalary(editingEmployee.salary.toString());
            setMonthlyAttendance(editingEmployee.monthlyAttendance.toString());
            setMonthlyAdvance(editingEmployee.monthlyAdvance.toString());
        } else {
            setActivePage('manage-employees');
        }
    }, [editingEmployee, setActivePage]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEmployee) return;
        
        updateEmployee({
            ...editingEmployee,
            name,
            email,
            mobile,
            salary: parseFloat(salary),
            monthlyAttendance: parseInt(monthlyAttendance),
            monthlyAdvance: parseFloat(monthlyAdvance)
        });
        setEditingEmployee(null);
        setActivePage('manage-employees');
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
                    <label htmlFor="employeeAttendance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Attendance (days)</label>
                    <input type="number" id="employeeAttendance" value={monthlyAttendance} onChange={(e) => setMonthlyAttendance(e.target.value)} className={commonInputStyles} required />
                </div>
                <div>
                    <label htmlFor="employeeAdvance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Advance</label>
                    <input type="number" id="employeeAdvance" value={monthlyAdvance} onChange={(e) => setMonthlyAdvance(e.target.value)} className={commonInputStyles} required />
                </div>
                <div className="md:col-span-2 flex items-center justify-end space-x-4 mt-4">
                    <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 focus:outline-none">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Update Employee
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEmployeePage;