import React from 'react';
import './Hero.css';
import coloquiosLogo from '../assets/Coloquios_FC.png';
import fantasmasLogo from '../assets/Fantasmas_FC.png';

const Hero = () => {
    return (
        <section className="hero">
            <div className="team-container coloquios">
                <img src={coloquiosLogo} alt="Coloquios FC" className="team-logo" />
                <h1 className="team-name">COLOQUIOS FC</h1>
            </div>

            <div className="vs-container">
                <span className="vs-text">VS</span>
            </div>

            <div className="team-container fantasmas">
                <img src={fantasmasLogo} alt="Fantasmas FC" className="team-logo" />
                <h1 className="team-name">FANTASMAS FC</h1>
            </div>
        </section>
    );
};

export default Hero;
