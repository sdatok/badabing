import React from 'react';
import { useNavigate } from 'react-router-dom';
import birdsImage from './assets/birds.png';
import projectsImage from './assets/projects.jpeg';
import cvImage from './assets/cv.jpeg';
import aboutImage from './assets/about.jpeg';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="mt-20 text-center">
            <h1 className="title text-3xl md:text-4xl lg:text-5xl xl:text-6xl">SONAM DATOK</h1>
            <div className="quote-container mt-10 mb-5">
                <p className="quote">"I am still learning"</p>
                <p>- Michelangelo</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 p-5">
                {[{ name: 'PROJECTS', image: projectsImage, path: '/projects' },
                    { name: 'ABOUT', image: aboutImage, path: '/about' },
                    { name: 'CV', image: cvImage, path: '/cv' },
                    { name: 'BIRDS', image: birdsImage, path: '/birds' },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="landing-div group relative cursor-pointer"
                        onClick={() => handleNavigate(item.path)}
                    >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                        <div className="overlay absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 ease-in-out"></div>
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl transition-opacity duration-300 ease-in-out">
                    {item.name}
                </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
