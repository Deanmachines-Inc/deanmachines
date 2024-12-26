import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export default function Card({ title, children, className }: CardProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full md:w-2/3 lg:w-1/2 max-w-prose ${className || ''}`}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{title}</h2>
            {children}
        </div>
    );
}
