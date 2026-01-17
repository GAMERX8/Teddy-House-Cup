import React, { useEffect, useState } from 'react';
import { subscribeToTeams, subscribeToPlayers } from '../services/dataService';
import './TeamGrid.css';
import coloquiosLogo from '../assets/Coloquios_FC.png';
import fantasmasLogo from '../assets/Fantasmas_FC.png';

import { useNavigate } from 'react-router-dom';

const TeamGrid = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeTeams = subscribeToTeams((data) => {
            setTeams(data);
            if (players.length > 0) setLoading(false);
        });
        const unsubscribePlayers = subscribeToPlayers((data) => {
            setPlayers(data);
            setLoading(false);
        });

        return () => {
            if (unsubscribeTeams) unsubscribeTeams();
            if (unsubscribePlayers) unsubscribePlayers();
        };
    }, []);

    // Helper to get top 5 players for a team
    const getTopPlayers = (teamId, teamName) => {
        const tName = String(teamName || '').toLowerCase();
        const isTeamFantasmas = tName.includes('fantasma');
        const isTeamColoquios = tName.includes('coloquio');

        // EXPLICIT ID MAPPING (Verified from Debugging)
        const explicitFantasmasPart = '1m2n9qhneh';
        const explicitColoquiosPart = '71x3ryghcr';

        // Filter players belonging to this team
        const teamPlayers = players.filter(p => {
            const pRef = String(p.equipo || p.teamId || '').toLowerCase().trim();

            // 1. Direct ID Match (if IDs match exactly)
            if (p.equipo === teamId || p.teamId === teamId) return true;

            // 2. Explicit Partial ID Match (Fixes case/whitespace issues)
            if (isTeamFantasmas && pRef.includes(explicitFantasmasPart)) return true;
            if (isTeamColoquios && pRef.includes(explicitColoquiosPart)) return true;

            // 3. Fallback Name Match (if reference contains name)
            if (isTeamFantasmas && pRef.includes('fantasma')) return true;
            if (isTeamColoquios && pRef.includes('coloquio')) return true;

            return false;
        });

        // Sort by Rating (OVR) Descending
        return teamPlayers.sort((a, b) => {
            const ratingA = parseInt(a.ovr || a.rating || 0);
            const ratingB = parseInt(b.ovr || b.rating || 0);
            return ratingB - ratingA;
        }).slice(0, 5); // Take Top 5
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando Equipos...</div>;

    return (
        <section className="team-grid-section">
            <h2 className="section-title">LOS EQUIPOS</h2>
            <div className="team-grid">
                {teams.map((team) => {
                    // Logic to handle missing visual assets in DB
                    const teamName = team.name || team.id || 'Unknown Team';
                    const isFantasmas = teamName.toLowerCase().includes('fantasma');
                    const isColoquios = teamName.toLowerCase().includes('coloquio');

                    let teamLogo = null;
                    if (isFantasmas) teamLogo = fantasmasLogo;
                    else if (isColoquios) teamLogo = coloquiosLogo;
                    else if (team.logo) teamLogo = team.logo;

                    const topPlayers = getTopPlayers(team.id, teamName);

                    return (
                        <div key={team.id} className="team-card">
                            <div className="card-header">
                                {/* Logo Rendering */}
                                {teamLogo ? (
                                    <img src={teamLogo} alt={teamName} className="card-logo" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
                                ) : (
                                    <div className="card-logo-placeholder">⚽</div>
                                )}
                                <h3 className="card-title">{teamName.toUpperCase()}</h3>
                            </div>

                            <div className="card-stats">
                                <div className="stat-item">
                                    <span className="stat-value text-primary">{team.Victorias || 0}</span>
                                    <span className="stat-label">VICTORIAS</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{team.Derrotas || 0}</span>
                                    <span className="stat-label">DERROTAS</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value text-primary">{team.Goles || 0}</span>
                                    <span className="stat-label">GOLES</span>
                                </div>
                            </div>

                            <div className="players-list">
                                <h4 className="players-title">ALINEACIÓN ESTELAR</h4>
                                {topPlayers.length > 0 ? (
                                    topPlayers.map((player) => (
                                        <div key={player.id} className="player-item">
                                            {/* Use arbitrary numbers or position if number missing */}
                                            <span className="player-number">#{player.numero || 99}</span>
                                            <span className="player-name">{player.nombre || player.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ color: '#666', fontStyle: 'italic', padding: '1rem' }}>
                                        Sin jugadores registrados
                                    </div>
                                )}
                            </div>

                            <div className="card-footer">
                                <button className="btn-primary" onClick={() => navigate('/equipos')}>VER PERFIL</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default TeamGrid;
