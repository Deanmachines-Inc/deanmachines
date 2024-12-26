import { useState } from 'react';

interface Props {
    readonly onSubmit: (email: string) => void;
}

export default function SubscribeForm({ onSubmit }: Props) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        onSubmit(email);
        setEmail('');
    };

    return (
        <form onSubmit={handleSubmit} className="subscribe-form">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="subscribe-input"
            />
            <button type="submit" className="subscribe-button">Subscribe</button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}