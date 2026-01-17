import React from 'react';
import '../index.css';

const Torneo = () => {
    return (
        <div className="container page-container">
            <h1 className="section-title animate-fade-in">Sobre el Torneo</h1>

            <div className="glass-card animate-fade-up" style={{ padding: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Formato TH Cup</h2>
                <p style={{ lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '2rem', color: '#ccc' }}>
                    La TH Cup es la competición entre dos equipos de la sociedad Teddy House.
                    Ambos equipos compiten por la gloria en un formato emocionante y divertido.
                </p>

                <h3 style={{ fontFamily: 'var(--font-heading)' }}>Reglas Principales</h3>
                <ul style={{ lineHeight: '1.8', marginLeft: '1.5rem', color: '#aaa' }}>
                    <li>Partidos de 90 minutos (dos partes de 45').</li>
                    <li>Equipos: Siempre varían, nadie pertenece a ningún equipo demasiado tiempo.</li>
                    <li>Capitanes: En caso pierda -2 GRL/si gana +2 GRL.</li>
                    <li>GRL: Ayuda para la formación, puede mejorar como perjudicar a un equipo.</li>
                    <li>Penales en caso de empate.</li>
                    <li>A final de año se premia al mejor jugador de las 2 ediciones jugadas, por votación de todos los jugadores de la copa.</li>
                </ul>
            </div>
        </div>
    );
};

export default Torneo;
