import { Link } from 'react-router-dom';
import React from "react";

const Projects = () => {
    return (
        <div className="mt-20 container mx-auto flex flex-col md:flex-row items-start">
            <h1 className="title text-3xl md:text-4xl lg:text-5xl xl:text-6xl flex-none mb-4 md:mb-0">SONAM DATOK</h1>
            <div className="md:ml-10 flex-grow">
                <h2 className="font-extrabold text-2xl md:text-4xl font-medium text-gray-800 dark:text-gray-100">PROJECTS</h2>
                <ul className="space-y-4 mt-6">
                    <li>
                        <Link to="/project/1" className="text-blue-600 hover:underline">TMUsic</Link>
                    </li>
                    <li>
                        <Link to="/project/2" className="text-blue-600 hover:underline">ONELIGO</Link>
                    </li>
                    <li>
                        <Link to="/project/3" className="text-blue-600 hover:underline">E-BIKE EVERYWHERE</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Projects;
