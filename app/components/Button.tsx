import React from 'react';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;