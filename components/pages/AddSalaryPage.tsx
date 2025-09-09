import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

interface AddSalaryPageProps {
    setActivePage: (page: string) => void;
}

const AddSalaryPage: React.FC<AddSalaryPageProps> = ({ setActivePage }) => {
    const { addEmployeeSalary, employeeForSalary, setEmployeeForSalary } = useData();
    
    const [salDate, setSalDate] = useState(new Date().toISOString().split('T')[0]);
    const [advance, setAdvance] = useState('');
    const [others, setOthers] = useState('');
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!employeeForSalary) {
            // If no employee is selected (e.g., page refresh), go back.
            setActivePage('manage-employees');
        }
    }, [employeeForSalary, setActivePage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeForSalary) return;
        setIsSaving(true);
        try {
            await addEmployeeSalary({
                employee_id: employeeForSalary.id,
                sal_date: salDate,
                advance: parseFloat(advance || '0'),
                others: parseFloat(others || '0'),
                note,
            });
            handleCancel();
        } catch (error) {
            // Error toast handled in context
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEmployeeForSalary(null);
        setActivePage('manage-employees');
    };

    const commonInputStyles = "block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

    if (!employeeForSalary) {
        return <div className="text-center p-4">Loading employee details...</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Add Salary for <span className="text-indigo-500">{employeeForSalary.name}</span></h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="sal_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Date</label>
                    <input type="date" id="sal_date" value={salDate} onChange={e => setSalDate(e.target.value)} className={commonInputStyles} required />
                </div>
                <div>
                    <label htmlFor="advance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Advance</label>
                    <input type="number" id="advance" value={advance} onChange={e => setAdvance(e.target.value)} placeholder="e.g. 5000" className={commonInputStyles} />
                </div>
                <div>
                    <label htmlFor="others" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Others (e.g. Bonus, Deduction)</label>
                    <input type="number" id="others" value={others} onChange={e => setOthers(e.target.value)} placeholder="e.g. 1000" className={commonInputStyles} />
                </div>
                 <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Note</label>
                    <textarea id="note" value={note} onChange={e => setNote(e.target.value)} rows={3} className={commonInputStyles} placeholder="Advance given for personal reason..."></textarea>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-2">
                     <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 focus:outline-none">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        {isSaving ? 'Saving...' : 'Save Salary'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSalaryPage;