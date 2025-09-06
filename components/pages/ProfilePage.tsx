
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password.length < 6) {
             addToast('Password must be at least 6 characters long.', 'error');
             return;
        }

        if (password !== confirmPassword) {
            addToast('Passwords do not match.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await updateUser({
                email: email !== user?.email ? email : undefined,
                password: password ? password : undefined,
            });
            addToast('Profile updated successfully!', 'success');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            addToast('Failed to update profile. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const commonInputStyles = "block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">User Profile</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={commonInputStyles}
                        required
                    />
                </div>
                
                <hr className="my-6 border-slate-200 dark:border-slate-700" />
                
                <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Change Password</h2>
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={commonInputStyles}
                        placeholder="Leave blank to keep current password"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={commonInputStyles}
                        disabled={!password}
                        placeholder="Confirm your new password"
                    />
                </div>
                <div className="flex items-center justify-end">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;