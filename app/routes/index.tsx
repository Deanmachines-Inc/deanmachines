import { Link, MetaFunction } from "@remix-run/react";
import Layout from '~/routes/layout';

export const meta: MetaFunction = () => {
    return [
        { title: "Dean Machines" },
        { name: "description", content: "FPV Prototype Web App" },
    ];
};

export default function Index() {
    return (
        <Layout>
            <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                        Dean Machines
                    </h1>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        Welcome to Dean Machines, the FPV prototype web app focused on documenting the journey of building and advancing an autonomous AI drone using cutting-edge technologies.
                    </p>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Mission Statement
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Our mission is to empower the FPV community with tools to unlock the full potential of their flight data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Core Values
                            </h2>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                                <li>Innovation</li>
                                <li>Accessibility</li>
                                <li>Community</li>
                                <li>Excellence</li>
                            </ul>
                        </section>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link to="/data" 
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Data Visualization
                        </Link>
                        <Link to="/requirements"
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Requirements
                        </Link>
                        <Link to="/about"
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            About Us
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}