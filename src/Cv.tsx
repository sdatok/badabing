import React from 'react';
import resumePdfUrl from './assets/resume.pdf'; // Adjust this path

// Dummy data for the job positions - replace with real data
const positions = [
    {
        companyLogo: '/path/to/first-company-logo.png', // Adjust this path
        companyUrl: 'https://www.firstcompanywebsite.com',
        jobTitle: 'Senior Developer',
        description: 'Responsible for leading development teams and architecting robust solutions.'
    },
    {
        companyLogo: '/path/to/second-company-logo.png', // Adjust this path
        companyUrl: 'https://www.secondcompanywebsite.com',
        jobTitle: 'Project Manager',
        description: 'Oversaw project timelines, managed team communications, and ensured timely delivery.'
    }
];

const Cv = () => {
    // Placeholder for your professional email
    const professionalEmail = "datoksonam@gmail.com"; // Adjust this to your actual email

    return (
        <div className="mt-20 container mx-auto px-4 text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">Curriculum Vitae</h1>

            {/* Contact Section */}
            <div className="contact-section mb-10">
                <h2 className="text-3xl font-bold mb-4">Let's Connect!</h2>
                <p>If you're interested in working together, feel free to reach out to me:</p>
                <a href={`mailto:${professionalEmail}`} className="inline-block bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out mt-4">Contact Me</a>
            </div>

            {/* Job Positions Section */}
            <div className="job-positions mb-10">
                {positions.map((position, index) => (
                    <div key={index} className="flex items-start mb-8">
                        <a href={position.companyUrl} target="_blank" rel="noopener noreferrer" className="mr-4">
                            <img src={position.companyLogo} alt="Company Logo" className="w-20 h-20 object-cover rounded-full" />
                        </a>
                        <div>
                            <h3 className="text-xl md:text-2xl font-semibold">{position.jobTitle}</h3>
                            <p className="mt-2 text-gray-700">{position.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* PDF Resume Section */}
            <div className="pdf-resume">
                <h2 className="text-3xl font-bold mb-4">PDF Resume</h2>
                <p className="mb-4">View or download my full resume:</p>
                <a href={resumePdfUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-700 transition duration-300 ease-in-out">
                    Open PDF Resume
                </a>
            </div>
        </div>
    );
};

export default Cv;
