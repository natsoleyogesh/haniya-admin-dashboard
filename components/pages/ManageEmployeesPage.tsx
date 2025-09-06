import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Employee } from '../../types';
import Pagination from '../Pagination';
import ConfirmModal from '../ConfirmModal';

interface ManageEmployeesPageProps {
    setActivePage: (page: string) => void;
}

const ITEMS_PER_PAGE = 5;

const ManageEmployeesPage: React.FC<ManageEmployeesPageProps> = ({ setActivePage }) => {
    const { employees, setEditingEmployee, deleteEmployee } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setActivePage('edit-employee');
    };

    const openDeleteModal = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setEmployeeToDelete(null);
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (employeeToDelete) {
            deleteEmployee(employeeToDelete.id);
            if (currentEmployees.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }
        closeDeleteModal();
    };
    
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    }

    return (
        <div>
             <ConfirmModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Employee"
                message={`Are you sure you want to delete the employee "${employeeToDelete?.name}"? This action cannot be undone.`}
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Manage Employees</h1>
                <button 
                    onClick={() => setActivePage('add-employee')}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105">
                    Add New Employee
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">S.No.</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Mobile</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Salary</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Net Salary</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {currentEmployees.map((employee, index) => (
                                <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{employee.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{employee.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{employee.mobile}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{formatCurrency(employee.salary)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-200">{formatCurrency(employee.salary - employee.monthlyAdvance)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                        <button onClick={() => handleEdit(employee)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 font-medium transition-colors">
                                            Edit
                                        </button>
                                        <button onClick={() => openDeleteModal(employee)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 font-medium transition-colors">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {employees.length === 0 && <p className="p-6 text-center text-slate-500 dark:text-slate-400">No employees found.</p>}
                 {employees.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={employees.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={handlePageChange}
                    />
                 )}
            </div>
        </div>
    );
};

export default ManageEmployeesPage;
