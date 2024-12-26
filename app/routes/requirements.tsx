import { useState, useMemo } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, DocumentDownloadIcon } from '@heroicons/react/24/solid';
import '../styles/page.css';

interface Specification {
    id: string;
    text: string;
    details?: string;
    source?: string;
    verified: boolean;
}

interface Requirement {
    id: string;
    component: string;
    category: 'hardware' | 'software' | 'knowledge' | 'infrastructure' | 'safety' | 'compliance';
    subcategory: string;
    description: string;
    specifications: Specification[];
    estimatedCost?: {
        amount: number;
        currency: string;
        recurring?: boolean;
        interval?: 'monthly' | 'yearly';
    };
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'acquired' | 'pending' | 'researching' | 'testing' | 'approved' | 'rejected';
    dependencies?: string[];
    alternatives?: {
        id: string;
        name: string;
        pros: string[];
        cons: string[];
        cost?: number;
    }[];
    compliance?: {
        standard: string;
        requirements: string[];
        status: 'compliant' | 'in-progress' | 'non-compliant';
    }[];
    risks?: {
        id: string;
        description: string;
        severity: 'high' | 'medium' | 'low';
        mitigation: string;
    }[];
    documentation?: {
        type: string;
        url: string;
        version: string;
    }[];
    notes?: string;
    lastUpdated: string;
    updatedBy: string;
    vendor?: {
        name: string;
        contact: string;
        website: string;
        leadTime?: string;
    };
}

const requirements: Requirement[] = [
    {
        id: 'hw-001',
        component: 'NVIDIA Orin Nano',
        category: 'hardware',
        subcategory: 'Processing Unit',
        description: 'Advanced AI processing unit for autonomous drone operations',
        specifications: [
            { id: 'spec-1', text: '6-core ARM CPU', verified: true },
            { id: 'spec-2', text: 'Up to 1024 CUDA cores', verified: true },
            { id: 'spec-3', text: '8GB LPDDR5 memory', verified: true },
            { id: 'spec-4', text: '70 TOPS AI performance', verified: true },
            { id: 'spec-5', text: 'Power consumption: 5W-20W', verified: true },
            { id: 'spec-6', text: 'Operating temperature: -25°C to 80°C', verified: true }
        ],
        estimatedCost: {
            amount: 199,
            currency: 'USD',
            recurring: false
        },
        priority: 'critical',
        status: 'acquired',
        dependencies: ['hw-002', 'hw-003'],
        risks: [
            {
                id: 'risk-1',
                description: 'Thermal management in confined drone space',
                severity: 'high',
                mitigation: 'Custom cooling solution and thermal monitoring'
            }
        ],
        documentation: [
            {
                type: 'Technical Specifications',
                url: 'https://developer.nvidia.com/orin-nano',
                version: '1.0.0'
            }
        ],
        lastUpdated: '2024-03-14',
        updatedBy: 'Sam',
        vendor: {
            name: 'NVIDIA',
            contact: 'enterprise@nvidia.com',
            website: 'https://nvidia.com',
            leadTime: '2-3 weeks'
        }
    },
    // ... add more requirements with similar detail level
];

// Add sorting and filtering utilities
const sortOptions = {
    component: (a: Requirement, b: Requirement) => a.component.localeCompare(b.component),
    priority: (a: Requirement, b: Requirement) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
    },
    status: (a: Requirement, b: Requirement) => a.status.localeCompare(b.status),
    cost: (a: Requirement, b: Requirement) => (a.estimatedCost?.amount || 0) - (b.estimatedCost?.amount || 0)
};

export default function Requirements() {
    const [categoryFilter, setCategoryFilter] = useState<Requirement['category'] | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<Requirement['priority'] | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<Requirement['status'] | 'all'>('all');
    const [sortBy, setSortBy] = useState<keyof typeof sortOptions>('priority');
    const [searchQuery, setSearchQuery] = useState('');

    // Memoize filtered and sorted requirements
    const filteredRequirements = useMemo(() => {
        return requirements
            .filter(req => {
                const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;
                const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter;
                const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
                const matchesSearch = searchQuery === '' ||
                    req.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    req.description.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesPriority && matchesStatus && matchesSearch;
            })
            .sort(sortOptions[sortBy]);
    }, [categoryFilter, priorityFilter, statusFilter, sortBy, searchQuery]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-primary">Project Requirements</h1>

            <div className="flex gap-4 mb-6">
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as Requirement['category'] | 'all')}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
                >
                    <option value="all">All Categories</option>
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="knowledge">Knowledge</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="safety">Safety</option>
                    <option value="compliance">Compliance</option>
                </select>

                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as Requirement['priority'] | 'all')}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
                >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as Requirement['status'] | 'all')}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
                >
                    <option value="all">All Statuses</option>
                    <option value="acquired">Acquired</option>
                    <option value="pending">Pending</option>
                    <option value="researching">Researching</option>
                    <option value="testing">Testing</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as keyof typeof sortOptions)}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
                >
                    <option value="priority">Sort by Priority</option>
                    <option value="component">Sort by Component</option>
                    <option value="status">Sort by Status</option>
                    <option value="cost">Sort by Cost</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Component</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {filteredRequirements.map((req) => (
                            <tr key={req.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{req.component}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{req.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${req.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                    ${req.priority === 'high' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                    ${req.priority === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                    ${req.priority === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                  `}>
                                        {req.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${req.status === 'acquired' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                    ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                    ${req.status === 'researching' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                    ${req.status === 'testing' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                    ${req.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                    ${req.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                  `}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                    <Disclosure>
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button className="flex items-center text-primary hover:text-primary-dark">
                                                    View Details
                                                    <ChevronUpIcon className={`${open ? 'transform rotate-180' : ''} w-5 h-5 ml-2`} />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="mt-2">
                                                    <div className="text-sm">
                                                        <p className="font-medium">Description:</p>
                                                        <p>{req.description}</p>
                                                        {req.specifications.length > 0 && (
                                                            <>
                                                                <p className="font-medium mt-2">Specifications:</p>
                                                                <ul className="list-disc list-inside">
                                                                    {req.specifications.map((spec) => (
                                                                        <li key={spec.id}>{spec.text}</li>
                                                                    ))}
                                                                </ul>
                                                            </>
                                                        )}
                                                        {req.estimatedCost && (
                                                            <p className="mt-2">
                                                                <span className="font-medium">Estimated Cost:</span> {req.estimatedCost.amount} {req.estimatedCost.currency}
                                                                {req.estimatedCost.recurring && ` (${req.estimatedCost.interval})`}
                                                            </p>
                                                        )}
                                                        {req.alternatives && (
                                                            <p className="mt-2">
                                                                <span className="font-medium">Alternatives:</span> {req.alternatives.map(alt => alt.name).join(', ')}
                                                            </p>
                                                        )}
                                                        {req.notes && (
                                                            <p className="mt-2">
                                                                <span className="font-medium">Notes:</span> {req.notes}
                                                            </p>
                                                        )}
                                                        {req.risks && (
                                                            <>
                                                                <p className="font-medium mt-2">Risks:</p>
                                                                <ul className="list-disc list-inside">
                                                                    {req.risks.map((risk) => (
                                                                        <li key={risk.id}>{risk.description} (Severity: {risk.severity})</li>
                                                                    ))}
                                                                </ul>
                                                            </>
                                                        )}
                                                        {req.documentation && (
                                                            <>
                                                                <p className="font-medium mt-2">Documentation:</p>
                                                                <ul className="list-disc list-inside">
                                                                    {req.documentation.map((doc) => (
                                                                        <li key={doc.type}>
                                                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">
                                                                                {doc.type} (Version: {doc.version})
                                                                            </a>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </>
                                                        )}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}