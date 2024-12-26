import { useState, useRef } from 'react';
import { Link, Form, useActionData } from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';
import '../styles/tailwind.css'; // Ensure correct path

type ActionData = {
    success?: boolean;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
    // Handle form submission without unused variables
    if (!request) {
        throw new Error('Request is null or undefined');
    }

    try {
        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || !email || !message) {
            throw new Error('One or more fields are missing');
        }

        // Here's where you would integrate with your backend/email service
        // Example using fetch to a serverless function or backend endpoint:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ name, email, message }),
        // });

        // if (!response.ok) {
        //     throw new Error('Error sending email');
        // }

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};

export default function Contact() {
    const actionData = useActionData<ActionData>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(''); // 'sending', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const nameInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setStatus('sending');
        setErrorMessage('');

        try {
            // Basic validation. Enhance as needed
            if (!name || !email || !message) {
                setStatus('error');
                setErrorMessage('All fields are required.');

                if (!name && nameInputRef.current) {
                    nameInputRef.current.focus();
                }

                return;
            }

            // Here's where you would integrate with your backend/email service
            // Example using fetch to a serverless function or backend endpoint:
            const response = await fetch('/api/contact', {  // Replace '/api/contact' with your actual endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (response.ok) {
                setStatus('success');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setStatus('error');

                // Attempt to parse error message from the response
                try {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Failed to send message. Please try again later.');
                } catch (error) {
                    // Fallback if JSON parsing fails
                    setErrorMessage('Failed to send message. Please try again later.');
                }
            }
        } catch (error: unknown) {
            setStatus('error');
            setErrorMessage('Failed to send message. Please try again later.'); // Generic error message; refine as needed
            console.error('Error submitting form:', error); // Log for debugging
        }
    };

    return (
        <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full md:w-2/3 lg:w-1/2">
                <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">Contact Us</h1>

                {status === 'success' ? (
                    <div className="text-green-600 mb-4" role="alert">Your message has been sent successfully!</div>
                ) : (
                    <Form method="post" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Name</label>
                            <input
                                type="text" id="name" name="name"
                                ref={nameInputRef}
                                className="border border-gray-400 dark:border-gray-600 p-2 w-full rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                aria-invalid={status === 'error' && !name ? 'true' : 'false'}
                            />
                            {status === 'error' && !name && <p className="text-red-500 text-sm mt-1">Name is required.</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email</label>
                            <input
                                type="email" id="email" name="email"
                                className="border border-gray-400 dark:border-gray-600 p-2 w-full rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-invalid={status === 'error' && !email ? 'true' : 'false'}
                            />
                            {status === 'error' && !email && <p className="text-red-500 text-sm mt-1">Email is required.</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Message</label>
                            <textarea
                                id="message" name="message"
                                className="border border-gray-400 dark:border-gray-600 p-2 w-full rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                aria-invalid={status === 'error' && !message ? 'true' : 'false'}
                            />
                            {status === 'error' && !message && <p className="text-red-500 text-sm mt-1">Message is required.</p>}
                        </div>
                        {status === 'error' && errorMessage && (
                            <div className="text-red-500 mb-4" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <div className="flex justify-center"> {/* Center the button */}
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                            >
                                {status === 'sending' ? 'Sending...' : 'Submit'}
                            </button>
                        </div>
                    </Form>
                )}

                {actionData?.success && <p>Thank you for your message!</p>}

                <Link to="/" className="mt-8 block text-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}