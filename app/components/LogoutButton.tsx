import { useActionData } from '@remix-run/react';
import { useState, useEffect } from 'react';

type ActionData = {
    success?: boolean;
};

export default function LogoutButton() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const actionData = useActionData<ActionData>();

    useEffect(() => {
        if (actionData?.success) {
            setTimeout(() => {
                window.location.href = '/'; // Redirect to home after logout
            }, 1000); // Adjust delay as needed
        }
    }, [actionData]);

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoggingOut(true);
        try {
            const response = await fetch('/api/logout', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
            // Handle logout error appropriately, e.g., display an error message
        }
    };

    return (
        <>
            {isLoggingOut ? (
                <p>Logging out...</p>
            ) : (
                <button onClick={handleLogout}>Logout</button>
            )}
        </>
    );
}