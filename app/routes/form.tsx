import { useState } from 'react';
import { Link } from '@remix-run/react';
import '../styles/form.css'; // Ensure correct path

export default function Form() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [softwareSkills, setSoftwareSkills] = useState('');
    const [hardwareSkills, setHardwareSkills] = useState('');
    const [aiKnowledge, setAiKnowledge] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form submission, e.g., sending data to an API
        // For this example, we'll just simulate submission and update the state
        setSubmitted(true);

        // Simulate sending data to an API
        const formData = {
            name,
            email,
            softwareSkills,
            hardwareSkills,
            aiKnowledge,
        };
        console.log('Form Data:', formData);
        // You can replace the above console.log with an actual API call
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h1 className="form-title">Sign Up for Updates</h1>
                {!submitted ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="softwareSkills" className="form-label">Software Skills</label>
                            <textarea
                                id="softwareSkills"
                                className="form-textarea"
                                rows={4}
                                value={softwareSkills}
                                onChange={(e) => setSoftwareSkills(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="hardwareSkills" className="form-label">Hardware Skills</label>
                            <textarea
                                id="hardwareSkills"
                                className="form-textarea"
                                rows={4}
                                value={hardwareSkills}
                                onChange={(e) => setHardwareSkills(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="aiKnowledge" className="form-label">AI/ML/CV Knowledge</label>
                            <textarea
                                id="aiKnowledge"
                                className="form-textarea"
                                rows={4}
                                value={aiKnowledge}
                                onChange={(e) => setAiKnowledge(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="form-button"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="form-alert" role="alert">
                        Thank you for signing up!
                    </div>
                )}
                <Link to="/" className="form-link">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
