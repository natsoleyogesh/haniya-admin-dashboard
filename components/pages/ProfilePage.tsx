import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">Profile</h1>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Email Address</label>
                    <p className="mt-1 text-lg text-slate-900 dark:text-white">{user?.email}</p>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h2 className="text-lg font-medium text-slate-800 dark:text-white">Change Password</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This feature is not yet implemented. In a real application, you would be able to update your password here.</p>
                    <form className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-slate-700 dark:text-gray-300">Current Password</label>
                            <input type="password" id="current-password" disabled className="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-gray-300">New Password</label>
                            <input type="password" id="new-password" disabled className="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm cursor-not-allowed" />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled className="px-4 py-2 text-sm font-medium text-white bg-indigo-400 dark:bg-indigo-500 rounded-md cursor-not-allowed">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
