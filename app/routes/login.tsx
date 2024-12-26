import { useState } from 'react';
import { Link, useNavigation } from '@remix-run/react';
import '../styles/index.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'Login failed');
            } else {
                console.log('Login successful!');
                window.location.href = '/account'; // Redirect to account page
            }
        } catch (err: unknown) {
            setError('An unexpected error occurred');
            console.error('Login error:', err)
        }
    };
    const handleOAuthLogin = (provider: string) => {
        window.location.href = `/auth/${provider}`;
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="login-title">Login</h1>
                {error && <p className="error">{error}</p>}
                <form method="post" onSubmit={handleSubmit}>
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
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <button onClick={() => handleOAuthLogin('google')} className="oauth-button">
                    Log in with Google
                </button>
                <button onClick={() => handleOAuthLogin('github')} className="oauth-button">
                    Log in with GitHub
                </button>
                <p>
                    Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
}