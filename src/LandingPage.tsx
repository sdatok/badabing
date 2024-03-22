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
            <h1 className="title text-5xl md:text-6xl lg:text-7xl xl:text-8xl">SONAM DATOK</h1>
            <div className="quote-container mt-10 mb-5">
                <p className="quote">"I am still learning"</p>
                <p className="">- Michelangelo</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-10 p-5">
                {[{ name: 'PROJECTS', image: projectsImage, path: '/projects' },
                    { name: 'ABOUT', image: aboutImage, path: '/about' },
                    { name: 'CV', image: cvImage, path: '/cv' },
                    { name: 'BIRDS', image: birdsImage, path: '/birds' },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="landing-div relative cursor-pointer"
                        onClick={() => handleNavigate(item.path)}
                    >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-black bg-opacity-50 md:bg-opacity-0
                                        flex items-center justify-center
                                        hover:bg-opacity-50 transition-opacity duration-300 ease-in-out">
                            <span className="text-white font-bold opacity-100 md:opacity-0
                                             hover:opacity-100 text-sm md:text-2xl lg:text-3xl xl:text-4xl">
                                {item.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
