import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigation, Link } from "@remix-run/react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';


/**
 * Represents the structure of chart data points
 */
interface ChartData {
    name: string;
    uv: number;
    pv: number;
    amt: number;
}

/**
 * Fetches data from the API with proper typing
 */
const fetchDataFromAPI = async (): Promise<ChartData[]> => {
    // Replace with actual API call
    return [
        { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
    ];
};

/**
 * Validates uploaded data matches ChartData structure
 */
const isValidChartData = (data: unknown): data is ChartData[] => {
    if (!Array.isArray(data)) {
        return false;
    }
    return data.every(item => 
        typeof item === 'object' &&
        item !== null &&
        'name' in item &&
        'uv' in item &&
        'pv' in item &&
        'amt' in item &&
        typeof item.name === 'string' &&
        typeof item.uv === 'number' &&
        typeof item.pv === 'number' &&
        typeof item.amt === 'number'
    );
};

export const loader: LoaderFunction = async () => {
    try {
        const data = await fetchDataFromAPI();
        return json({ data, error: null });
    } catch (error) {
        return json({ data: [], error: 'Failed to fetch data' });
    }
};

export default function DataVisualization() {
    const { data, error } = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>('line');
    const [sampleData, setSampleData] = useState<ChartData[]>(data);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const isLoading = navigation.state === 'loading';

    const handleChartChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedChart(event.target.value as 'line' | 'bar' | 'area');
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setUploadError(null);

        if (!file) {
            return;
        }

        try {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const content = e.target?.result;
                    if (typeof content !== 'string') {
                        throw new Error('Invalid file content');
                    }

                    const parsedData = JSON.parse(content);
                    
                    if (!isValidChartData(parsedData)) {
                        throw new Error('Invalid data format');
                    }

                    setSampleData(parsedData);
                } catch (err) {
                    setUploadError(err instanceof Error ? err.message : 'Failed to parse file');
                }
            };

            reader.onerror = () => {
                setUploadError('Failed to read file');
            };

            reader.readAsText(file);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Failed to process file');
        }
    };

    const renderChart = () => {
        switch (selectedChart) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={sampleData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={sampleData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="pv" fill="#8884d8" />
                            <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={sampleData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="pv" stroke="#8884d8" fill="#8884d8" />
                            <Area type="monotone" dataKey="uv" stroke="#82ca9d" fill="#82ca9d" />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            default:
                return <p>Chart type not yet implemented.</p>;
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="p-4">
            <div className="data-container">
                <h1 className="data-title">Data Visualization</h1>
                {/* Chart Type Selection */}
                <div className="data-controls">
                    <label htmlFor="chartType" className="mr-2 text-gray-700 dark:text-gray-200">Chart Type:</label>
                    <select
                        id="chartType"
                        value={selectedChart}
                        onChange={handleChartChange}
                        className="data-select"
                    >
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="area">Area Chart</option>
                    </select>
                </div>
                <div className="data-controls">
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="data-upload"
                    />
                </div>
                <div className="data-chart">
                    {renderChart()}
                </div>
                {/* Go Back Home */}
                <div className="data-link">
                    <Link
                        to="/"
                        className="button"
                    >
                        Go Back Home
                    </Link>
                </div>
                {uploadError && (
                    <div className="text-red-500 mt-2">{uploadError}</div>
                )}
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    return (
        <div className="text-red-500 p-4">
            An unexpected error occurred. Please try again later.
        </div>
    );
}