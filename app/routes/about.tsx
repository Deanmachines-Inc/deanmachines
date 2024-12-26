import { Link } from "@remix-run/react";
import '../styles/tailwind.css'; // Ensure correct path

export default function AboutUs() {
    return (
        <div className="about-container mx-auto p-4 min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="about-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full md:w-2/3 lg:w-1/2 max-w-prose">
                <h1 className="about-title text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">About Dean Machines</h1>

                <p className="about-content text-lg text-gray-700 dark:text-gray-300">
                    Dean Machines is an FPV prototype web app focused on data analysis for drone systems. Our mission is to empower the FPV community with tools to unlock the full potential of their flight data. We believe that accessible and insightful data analysis can revolutionize how pilots understand and improve their performance.
                </p>

                <p className="about-content text-lg text-gray-700 dark:text-gray-300 mt-4">
                    Our platform leverages cutting-edge technologies including:
                    <ul className="about-list list-disc list-inside mt-2">
                        <li>Advanced data visualization libraries (e.g., Recharts)</li>
                        <li>Robust data processing algorithms</li>
                        <li>Intuitive user interfaces designed for FPV enthusiasts</li>
                    </ul>
                </p>

                <p className="about-content text-lg text-gray-700 dark:text-gray-300 mt-4">
                    We aim to make complex flight data easily digestible and actionable, providing pilots with the knowledge they need to enhance their skills and push the boundaries of FPV flight.
                </p>

                <p className="about-content text-lg text-gray-700 dark:text-gray-300 mt-4">
                    <strong>Our Team:</strong> Our team consists of experienced FPV pilots, software engineers, and data scientists who are passionate about advancing FPV technology. We are dedicated to continuous innovation and improvement.
                </p>

                <p className="about-content text-lg text-gray-700 dark:text-gray-300 mt-4">
                    <strong>Our Journey:</strong> Dean Machines started as a small project to analyze flight data and has grown into a comprehensive platform for FPV enthusiasts. We have collaborated with industry experts and received valuable feedback from the community to shape our platform.
                </p>

                <p className="about-content text-lg text-gray-700 dark:text-gray-300 mt-4">
                    <strong>Future Plans:</strong> We are constantly working on new features and improvements. Our future plans include:
                    <ul className="about-list list-disc list-inside mt-2">
                        <li>Integration with more sensors and devices</li>
                        <li>Enhanced machine learning models for predictive analysis</li>
                        <li>Mobile app development for on-the-go data analysis</li>
                        <li>Community-driven features and enhancements</li>
                    </ul>
                </p>

                <p className="about-content text-lg text-gray-700 dark:text-gray-300 mt-4">
                    <strong>Community Engagement:</strong> We believe in the power of community and collaboration. Join our forums, participate in discussions, and contribute to our open-source projects. Together, we can push the boundaries of FPV technology.
                </p>

                <p className="about-content text-lg text-gray-700 dark:text-gray-300 mt-4">
                    <strong>Educational Resources:</strong> We provide a wealth of educational resources to help you get the most out of your FPV experience. Explore our tutorials, guides, and webinars to learn more about data analysis, drone technology, and best practices.
                </p>

                <p className="about-content text-lg text-gray-700 dark:text-gray-300 mt-4">
                    <strong>Partnerships:</strong> We are proud to partner with leading organizations and experts in the FPV industry. Our collaborations help us stay at the forefront of technology and provide our users with the best tools and resources available.
                </p>

                <p className="about-content text-lg text-gray-700 dark:text-gray-300 mt-4">
                    <strong>Contact Us:</strong> We value your feedback and suggestions. Feel free to reach out to us through our contact page or join our community forums to share your thoughts and ideas.
                </p>

                <div className="about-footer mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Created by Sam. This project is open source and available under the MIT License. Contributions and feedback are welcome!
                    </p>
                </div>
            </div>
            <Link to="/" className="mt-8 inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300">
                Go Back Home
            </Link>
        </div>
    );
}

