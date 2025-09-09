import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Pagination from '../Pagination';

interface ViewEmployeeSalariesPageProps {
    setActivePage: (page: string) => void;
}

const ITEMS_PER_PAGE = 5;

const ViewEmployeeSalariesPage: React.FC<ViewEmployeeSalariesPageProps> = ({ setActivePage }) => {
    const { 
        employeeForSalary, 
        fetchEmployeeSalaries, 
        employeeSalaries, 
        isLoadingEmployeeSalaries,
        setEmployeeForSalary 
    } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    
    useEffect(() => {
        if (employeeForSalary) {
            fetchEmployeeSalaries(employeeForSalary.id);
        } else {
            // Redirect if page is accessed directly without an employee context
            setActivePage('manage-employees');
        }
    }, [employeeForSalary, fetchEmployeeSalaries, setActivePage]);

    const handleBack = () => {
        setEmployeeForSalary(null); // Clear the context
        setActivePage('manage-employees');
    };
    
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentSalaries = employeeSalaries.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(amount));
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    if (!employeeForSalary) {
        return <div className="text-center p-4">Redirecting...</div>;
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">
                    Salary History for <span className="text-indigo-500">{employeeForSalary.name}</span>
                </h1>
                <button 
                    onClick={handleBack}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 focus:outline-none">
                    &larr; Back to Employees
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">S.No.</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Advance</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Others</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Net Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {isLoadingEmployeeSalaries ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-slate-500 dark:text-slate-400">Loading salary records...</td>
                                </tr>
                            ) : currentSalaries.length > 0 ? (
                                currentSalaries.map((salary, index) => (
                                    <tr key={salary.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{indexOfFirstItem + index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{formatDate(salary.sal_date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{formatCurrency(salary.advance)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{formatCurrency(salary.others)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-600 dark:text-slate-200">{formatCurrency(salary.netamount)}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-slate-500 dark:text-slate-300 max-w-xs truncate">{salary.note}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-slate-500 dark:text-slate-400">No salary records found for this employee.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                 {!isLoadingEmployeeSalaries && employeeSalaries.length > ITEMS_PER_PAGE && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={employeeSalaries.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={handlePageChange}
                    />
                 )}
            </div>
        </div>
    );
};

export default ViewEmployeeSalariesPage;
