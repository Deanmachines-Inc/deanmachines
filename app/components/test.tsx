import { useState } from 'react';

export function TestComponent() {
    const [count, setCount] = useState(0);
    
    // Trigger error for testing
    if (count > 5) {
        throw new Error("Test error boundary");
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Test Component</h1>
            <button 
                onClick={() => setCount(c => c + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Count: {count}
            </button>
        </div>
    );
}