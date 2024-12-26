import { Link } from "@remix-run/react";
import '../styles/tailwind.css'; // Ensure correct path

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-200 py-4">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <p>© 2023 Dean Machines. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                        <Link to="/terms" className="hover:underline">Terms of Service</Link>
                        <Link to="/contact" className="hover:underline">Contact Us</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
