// NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-10 nav py-4 px-6">
            <ul className="space-x-2 flex md:space-x-20 justify-center">
                <li>
                    <Link to="/projects" className="text-white hover:text-gray-300 text-2xl md:text-2xl lg:text-4xl">PROJECTS</Link>
                </li>
                <li>
                    <Link to="/about" className="text-white hover:text-gray-300 text-2xl md:text-2xl lg:text-4xl">ABOUT</Link>
                </li>
                <li>
                    <Link to="/cv" className="text-white hover:text-gray-300 text-2xl md:text-2xl lg:text-4xl">CV</Link>
                </li>
                <li>
                    <Link to="/birds" className="text-white hover:text-gray-300 text-2xl md:text-2xl lg:text-4xl">BIRDS</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
