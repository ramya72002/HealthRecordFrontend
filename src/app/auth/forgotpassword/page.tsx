'use client'
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./forgotpassword.scss";
const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Basic validation
        if (!newPassword || !confirmNewPassword) {
            setError('Both fields are required.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            const response = await axios.post('https://health-project-backend-url.vercel.app/reset-password', {
                token,
                "new_password":newPassword,
            });

            if (response.status === 200) {
                toast.success('Password reset successfully!');
                router.push('/auth/login');
            }
        } catch (error) {
            toast.error('Failed to reset password.');
        }
    };

    return (
        <div className="loginWrapper">
            <div className="loginForm">
                <h2>Reset Your Password</h2>
                <p>Enter your new password below</p>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="confirmNewPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="errorMessage">{error}</p>}
                    <div className="formFooter">
                        <button type="submit" className="submitButton">
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
