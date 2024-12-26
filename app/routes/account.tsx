import { useState } from 'react';
import { Link } from '@remix-run/react';
import '../styles/account.css'; // Ensure correct path

export default function Account() {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };

    const handleUserEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(event.target.value);
    };

    const handleUserPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserPassword(event.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, userEmail, userPassword }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'Update failed');
            } else {
                console.log('Account updated successfully!');
                // Optionally, redirect or update state as needed
            }
        } catch (err: unknown) {
            setError('An unexpected error occurred');
            console.error('Account update error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-container">
            <div className="account-form">
                <h1 className="account-title">My Account</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="userName">User Name</label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={handleUserNameChange}
                        required
                    />
                    <label htmlFor="userEmail">Email</label>
                    <input
                        type="email"
                        id="userEmail"
                        value={userEmail}
                        onChange={handleUserEmailChange}
                        required
                    />
                    <label htmlFor="userPassword">Password</label>
                    <input
                        type="password"
                        id="userPassword"
                        value={userPassword}
                        onChange={handleUserPasswordChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </form>
                <p>
                    <Link to="/">Back to Home</Link>
                </p>
            </div>
        </div>
    );
}