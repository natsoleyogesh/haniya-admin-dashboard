import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Employee } from '../../types';

interface AddSalaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
}

const AddSalaryModal: React.FC<AddSalaryModalProps> = ({ isOpen, onClose, employee }) => {
    const { addEmployeeSalary } = useData();
    const [salDate, setSalDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [advance, setAdvance] = useState('');
    const [others, setOthers] = useState('');
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen || !employee) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await addEmployeeSalary({
                employee_id: employee.id,
                sal_date: salDate,
                advance: parseFloat(advance || '0'),
                others: parseFloat(others || '0'),
                note,
            });
            onClose(); // Close modal on success
            // Reset form
            setSalDate(new Date().toISOString().split('T')[0]);
            setAdvance('');
            setOthers('');
            setNote('');
        } catch (error) {
            // Error toast handled in context
        } finally {
            setIsSaving(false);
        }
    };
    
    const commonInputStyles = "block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 ease-out scale-95 opacity-0 animate-scale-up">
                <h3 id="modal-title" className="text-xl font-semibold text-slate-900 dark:text-white">Add Salary for {employee.name}</h3>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="sal_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Date</label>
                        <input type="date" id="sal_date" value={salDate} onChange={e => setSalDate(e.target.value)} className={commonInputStyles} required />
                    </div>
                    <div>
                        <label htmlFor="advance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Advance</label>
                        <input type="number" id="advance" value={advance} onChange={e => setAdvance(e.target.value)} placeholder="e.g. 5000" className={commonInputStyles} />
                    </div>
                    <div>
                        <label htmlFor="others" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Others</label>
                        <input type="number" id="others" value={others} onChange={e => setOthers(e.target.value)} placeholder="e.g. 1000" className={commonInputStyles} />
                    </div>
                     <div>
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Note</label>
                        <textarea id="note" value={note} onChange={e => setNote(e.target.value)} rows={3} className={commonInputStyles} placeholder="Advance given..."></textarea>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
             <style>{`
                @keyframes scale-up {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-scale-up {
                    animation: scale-up 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AddSalaryModal;
