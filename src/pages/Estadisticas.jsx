import React, { useState, useEffect } from 'react';
import { subscribeToPlayers, subscribeToTeams } from '../services/dataService';
import StatLeaderboard from '../components/StatLeaderboard';
import '../index.css';

const Estadisticas = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let playersLoaded = false;
        let teamsLoaded = false;

        const unsubscribeTeams = subscribeToTeams((teamData) => {
            setTeams(teamData);
            teamsLoaded = true;
            if (playersLoaded) setLoading(false);
        });

        const unsubscribePlayers = subscribeToPlayers((playerData) => {
            setPlayers(playerData);
            playersLoaded = true;
            if (teamsLoaded) setLoading(false);
        });

        return () => {
            if (unsubscribeTeams) unsubscribeTeams();
            if (unsubscribePlayers) unsubscribePlayers();
        };
    }, []);

    // Helper to get team name for a player
    const getTeamName = (player) => {
        const pRef = String(player.equipo || player.teamId || player.team || '').toLowerCase().trim();
        if (!pRef) return 'Jugador Libre';

        // 1. Buscamos en el array de equipos por ID (exacto o contenido)
        let team = teams.find(t => {
            const tid = String(t.id).toLowerCase().trim();
            return tid === pRef || pRef.includes(tid) || tid.includes(pRef);
        });

        // 2. Si no se encuentra, usamos lógica de palabras clave (como en Equipos.jsx)
        if (!team) {
            const isFantasmas = pRef.includes('fantasma') || pRef.includes('1m2n9q');
            const isColoquios = pRef.includes('coloquio') || pRef.includes('71x3ry');

            if (isFantasmas) {
                team = teams.find(t => {
                    const tn = (t.name || t.nombre || '').toLowerCase();
                    return tn.includes('fantasma') || t.id.toLowerCase().includes('fantasma') || t.id.toLowerCase().includes('1m2n9q');
                });
                if (!team) return 'Fantasmas FC'; // Fallback manual
            } else if (isColoquios) {
                team = teams.find(t => {
                    const tn = (t.name || t.nombre || '').toLowerCase();
                    return tn.includes('coloquio') || t.id.toLowerCase().includes('coloquio') || t.id.toLowerCase().includes('71x3ry');
                });
                if (!team) return 'Coloquios FC'; // Fallback manual
            }
        }

        return team ? (team.name || team.nombre || team.id) : 'Jugador Libre';
    };

    // Prepare data
    const enrichedPlayers = players.map(p => ({
        ...p,
        nombre: p.nombre || p.name || 'Desconocido',
        goles: parseInt(p.goles || 0),
        asistencias: parseInt(p.asistencias || 0),
        equipoNombre: getTeamName(p)
    }));

    const topScorers = [...enrichedPlayers]
        .sort((a, b) => b.goles - a.goles)
        .slice(0, 10);

    const topAssistants = [...enrichedPlayers]
        .sort((a, b) => b.asistencias - a.asistencias)
        .slice(0, 10);

    if (loading) {
        return (
            <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="section-title">Cargando estadísticas...</div>
            </div>
        );
    }

    return (
        <div className="container page-container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="section-title animate-fade-in" style={{ marginBottom: '0.5rem' }}>Estadísticas</h1>
                <div style={{
                    width: '60px',
                    height: '4px',
                    background: 'var(--accent-color)',
                    margin: '0 auto',
                    borderRadius: '2px',
                    boxShadow: '0 0 15px var(--accent-color)'
                }} className="animate-glow" />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem',
                marginTop: '1rem'
            }}>
                <StatLeaderboard
                    title="Máximos Goleadores"
                    players={topScorers}
                    statKey="goles"
                    accentColor="#ff6b00"
                />
                <StatLeaderboard
                    title="Máximos Asistentes"
                    players={topAssistants}
                    statKey="asistencias"
                    accentColor="#fff"
                />
            </div>
        </div>
    );
};

export default Estadisticas;
