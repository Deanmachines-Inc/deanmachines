import { useState } from 'react';
import { Link } from '@remix-run/react';
import '../styles/signup.css'; // Ensure correct path

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'Signup failed');
            } else {
                console.log('Signup successful!');
                window.location.href = '/account'; // Redirect to account page
            }
        } catch (err: unknown) {
            setError('An unexpected error occurred');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthSignup = (provider: string) => {
        window.location.href = `/auth/${provider}`;
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h1 className="signup-title">Sign Up</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <button onClick={() => handleOAuthSignup('google')} className="oauth-button">
                    Sign up with Google
                </button>
                <button onClick={() => handleOAuthSignup('github')} className="oauth-button">
                    Sign up with GitHub
                </button>
                <p>
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
}