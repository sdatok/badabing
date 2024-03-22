import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import About from './About';
import Projects from './Projects';
import NavBar from './NavBar';
import Birds from "./Birds";
import Cv from "./Cv";


function App() {
    return (
        <Router>
            <NavBar/> {/* This ensures NavBar is present on all pages */}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/about" element={<About />} />
                <Route path="/cv" element={<Cv />} />
                <Route path="/birds" element={<Birds />} />
            </Routes>
        </Router>
    );
}

export default App;
