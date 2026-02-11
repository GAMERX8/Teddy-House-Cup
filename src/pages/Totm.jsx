import React, { useState, useEffect } from 'react';
import { subscribeToPlayers, subscribeToTOTM, subscribeToMatches } from '../services/dataService';
import '../index.css';

const formations = {
    '4-3-3': ['PO', 'DF', 'DF', 'DF', 'DF', 'MC', 'MC', 'MC', 'DL', 'DL', 'DL'],
    '4-4-2': ['PO', 'DF', 'DF', 'DF', 'DF', 'MC', 'MC', 'MC', 'MC', 'DL', 'DL'],
    '3-5-2': ['PO', 'DF', 'DF', 'DF', 'MC', 'MC', 'MC', 'MC', 'MC', 'DL', 'DL'],
    '5-3-2': ['PO', 'DF', 'DF', 'DF', 'DF', 'DF', 'MC', 'MC', 'MC', 'DL', 'DL'],
    '3-4-3': ['PO', 'DF', 'DF', 'DF', 'MC', 'MC', 'MC', 'MC', 'DL', 'DL', 'DL'],
    '4-2-3-1': ['PO', 'DF', 'DF', 'DF', 'DF', 'MC', 'MC', 'MC', 'MC', 'MC', 'DL'],
    '4-3-1-2': ['PO', 'DF', 'DF', 'DF', 'DF', 'MC', 'MC', 'MC', 'MC', 'DL', 'DL'],
    '4-5-1': ['PO', 'DF', 'DF', 'DF', 'DF', 'MC', 'MC', 'MC', 'MC', 'MC', 'DL'],
    '4-1-2-1-2': ['PO', 'DF', 'DF', 'DF', 'DF', 'MC', 'MC', 'MC', 'MC', 'DL', 'DL'],
    '5-2-1-2': ['PO', 'DF', 'DF', 'DF', 'DF', 'DF', 'MC', 'MC', 'MC', 'DL', 'DL'],
};

import totmBackground from '../assets/Inform.png';

const TOTMCard = ({ player, onClick }) => {
    if (!player) return null;

    return (
        <div className="player-wrapper">
            <div className="totm-card animate-card-pop" onClick={() => onClick(player)}>
                {/* Card Background Image */}
                <img src={totmBackground} className="totm-card-bg-img" alt="card background" />

                {/* Player Content Layer */}
                <div className="totm-content">
                    <div className="totm-rating">{player.ovr || 99}</div>
                    <div className="totm-position">{player.posicion || 'MC'}</div>

                    <div className="totm-image-container">
                        <img src={player.imagenJugador} alt={player.nombre} className="totm-player-img" />
                    </div>

                    <div className="totm-info">
                        <div className="totm-name">{player.nombre}</div>
                        <div className="totm-meta">
                            <div className="totm-flag">
                                <img src={player.bandera} alt="flag" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                            <div className="totm-team">
                                <img src={player.escudoEquipo} alt="team" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Position Bubble Below Card */}
            <div className="card-position-bubble">
                {player.posicion || 'MC'}
            </div>
        </div>
    );
};

const PlayerStatsSidebar = ({ player, onClose }) => {
    if (!player) return null;

    // Use stats object from Firebase or fallback to 0
    const pStats = player.stats || {};

    const stats = [
        { label: 'OVR', value: player.ovr || 99 },
        { label: 'RIT', value: pStats.pac || 0 },
        { label: 'TIR', value: pStats.sho || 0 },
        { label: 'PAS', value: pStats.pas || 0 },
        { label: 'REG', value: pStats.dri || 0 },
        { label: 'DEF', value: pStats.def || 0 },
        { label: 'FIS', value: pStats.phy || 0 },
    ];

    return (
        <div key={player.id} className="player-stats-sidebar">
            <div className="sidebar-header">
                <div className="sidebar-image-ring">
                    <img
                        src={player.imagenJugador}
                        alt={player.nombre}
                        loading="eager"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div className="sidebar-position">{player.posicion}</div>
                <div className="sidebar-name">{player.nombre}</div>
            </div>

            <div className="sidebar-stats">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-row">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeamRatingPanel = ({ players, totmData, matches }) => {
    // Calculate average OVR from all selected players
    const calculateTeamRating = () => {
        const selectedPlayers = Object.values(totmData.players || {})
            .map(playerId => players.find(p => String(p.id) === String(playerId)))
            .filter(p => p && p.ovr);

        if (selectedPlayers.length === 0) return 0;

        const totalOVR = selectedPlayers.reduce((sum, player) => sum + (player.ovr || 0), 0);
        return Math.round(totalOVR / selectedPlayers.length);
    };

    // Calculate stars based on average OVR
    // Each full star = 20 OVR, half star = 10 OVR
    const calculateStars = (avgOVR) => {
        if (avgOVR >= 99) return 5;

        // Calculate stars: divide by 20 to get full stars, then check for half star
        const fullStars = Math.floor(avgOVR / 20);
        const remainder = avgOVR % 20;

        // If remainder >= 10, add half star
        const halfStar = remainder >= 10 ? 0.5 : 0;

        return Math.min(fullStars + halfStar, 5); // Cap at 5 stars
    };

    const renderStars = (starCount) => {
        const stars = [];
        const fullStars = Math.floor(starCount);
        const hasHalfStar = starCount % 1 !== 0;

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="star-icon full">★</span>);
        }

        // Half star
        if (hasHalfStar) {
            stars.push(<span key="half" className="star-icon half">★</span>);
        }

        // Empty stars
        const emptyStars = 5 - Math.ceil(starCount);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star-icon empty">☆</span>);
        }

        return stars;
    };

    const avgRating = calculateTeamRating();
    const starRating = calculateStars(avgRating);
    const playerCount = Object.values(totmData.players || {}).filter(id => id).length;
    const totmNumber = matches.length; // TOTM number based on match count

    return (
        <div className="team-rating-panel animate-fade-in">
            <div className="rating-header">
                <div className="totm-badge">TOTM {totmNumber}</div>
                <div className="star-display">
                    {renderStars(starRating)}
                </div>
            </div>
            <div className="rating-stats">
                <div className="stat-item">
                    <span className="stat-value-large">{avgRating}</span>
                    <span className="stat-label">Rating</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value-large">{playerCount}/11</span>
                    <span className="stat-label">Total Chemistry</span>
                </div>
            </div>
        </div>
    );
};

const Totm = () => {
    const [players, setPlayers] = useState([]);
    const [totmData, setTotmData] = useState({ formation: '4-3-3', players: {} });
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        const unsubPlayers = subscribeToPlayers(setPlayers);
        const unsubTOTM = subscribeToTOTM((data) => {
            setTotmData(data || { formation: '4-3-3', players: {} });
            setLoading(false);
        });
        const unsubMatches = subscribeToMatches(setMatches);
        return () => {
            unsubPlayers();
            unsubTOTM();
            unsubMatches();
        };
    }, []);

    const getPlayerById = (id) => players.find(p => String(p.id) === String(id));

    const renderField = () => {
        const currentFormation = totmData.formation || '4-3-3';
        const currentPositions = formations[currentFormation] || formations['4-3-3'];

        const getPositionStyle = (index, total) => {
            let top = '80%';
            let left = '50%';

            if (index === 0) {
                top = '101%'; // GK right on the bottom line
            } else if (currentFormation === '4-3-3') {
                // DEF (1,2,3,4)
                if (index >= 1 && index <= 4) {
                    const curve = (index === 1 || index === 4) ? '75%' : '83%';
                    top = curve;
                    left = `${10 + (index - 1) * (80 / 3)}%`;
                }
                // MID (5,6,7)
                if (index >= 5 && index <= 7) {
                    const curve = (index === 6) ? '55%' : '48%';
                    top = curve;
                    left = `${25 + (index - 5) * 25}%`;
                }
                // FWD (8,9,10)
                if (index >= 8 && index <= 10) {
                    const curve = (index === 9) ? '20%' : '28%';
                    top = curve;
                    left = `${15 + (index - 8) * 35}%`;
                }
            } else if (currentFormation === '4-4-2') {
                // DEF (1,2,3,4)
                if (index >= 1 && index <= 4) {
                    const curve = (index === 1 || index === 4) ? '75%' : '83%';
                    top = curve;
                    left = `${12 + (index - 1) * (76 / 3)}%`;
                }
                // MID (5,6,7,8)
                if (index >= 5 && index <= 8) {
                    const curve = (index === 5 || index === 8) ? '48%' : '56%';
                    top = curve;
                    left = `${8 + (index - 5) * (84 / 3)}%`;
                }
                // FWD (9,10)
                if (index >= 9 && index <= 10) {
                    top = '25%';
                    left = `${32 + (index - 9) * 36}%`;
                }
            } else if (currentFormation === '3-5-2') {
                // DEF (1,2,3)
                if (index >= 1 && index <= 3) {
                    const curve = (index === 2) ? '83%' : '76%';
                    top = curve;
                    left = `${22 + (index - 1) * 28}%`;
                }
                // MID (4,5,6,7,8)
                if (index >= 4 && index <= 8) {
                    const curve = (index === 4 || index === 8) ? '45%' : (index === 6 ? '62%' : '54%');
                    top = curve;
                    left = `${10 + (index - 4) * 20}%`;
                }
                // FWD (9,10)
                if (index >= 9 && index <= 10) {
                    top = '25%';
                    left = `${32 + (index - 9) * 36}%`;
                }
            } else if (currentFormation === '5-3-2') {
                if (index >= 1 && index <= 5) {
                    const curve = (index === 1 || index === 5) ? '72%' : (index === 3 ? '83%' : '78%');
                    top = curve;
                    left = `${8 + (index - 1) * (84 / 4)}%`;
                }
                if (index >= 6 && index <= 8) {
                    const curve = (index === 7) ? '55%' : '48%';
                    top = curve;
                    left = `${25 + (index - 6) * 25}%`;
                }
                if (index >= 9 && index <= 10) {
                    top = '25%';
                    left = `${32 + (index - 9) * 36}%`;
                }
            } else if (currentFormation === '3-4-3') {
                if (index >= 1 && index <= 3) {
                    const curve = (index === 2) ? '83%' : '76%';
                    top = curve;
                    left = `${22 + (index - 1) * 28}%`;
                }
                if (index >= 4 && index <= 7) {
                    const curve = (index === 4 || index === 7) ? '48%' : '56%';
                    top = curve;
                    left = `${8 + (index - 4) * (84 / 3)}%`;
                }
                if (index >= 8 && index <= 10) {
                    const curve = (index === 9) ? '20%' : '28%';
                    top = curve;
                    left = `${15 + (index - 8) * 35}%`;
                }
            } else if (currentFormation === '4-2-3-1') {
                if (index >= 1 && index <= 4) {
                    const curve = (index === 1 || index === 4) ? '75%' : '83%';
                    top = curve;
                    left = `${12 + (index - 1) * (76 / 3)}%`;
                }
                if (index >= 5 && index <= 6) {
                    top = '60%';
                    left = `${35 + (index - 5) * 30}%`;
                }
                if (index >= 7 && index <= 9) {
                    const curve = (index === 8) ? '35%' : '42%';
                    top = curve;
                    left = `${15 + (index - 7) * 35}%`;
                }
                if (index === 10) {
                    top = '15%';
                    left = '50%';
                }
            } else if (currentFormation === '4-3-1-2') {
                if (index >= 1 && index <= 4) {
                    const curve = (index === 1 || index === 4) ? '75%' : '83%';
                    top = curve;
                    left = `${12 + (index - 1) * (76 / 3)}%`;
                }
                if (index >= 5 && index <= 7) {
                    const curve = (index === 6) ? '62%' : '54%';
                    top = curve;
                    left = `${25 + (index - 5) * 25}%`;
                }
                if (index === 8) {
                    top = '35%';
                    left = '50%';
                }
                if (index >= 9 && index <= 10) {
                    top = '15%';
                    left = `${32 + (index - 9) * 36}%`;
                }
            } else if (currentFormation === '4-5-1') {
                if (index >= 1 && index <= 4) {
                    const curve = (index === 1 || index === 4) ? '75%' : '83%';
                    top = curve;
                    left = `${12 + (index - 1) * (76 / 3)}%`;
                }
                if (index >= 5 && index <= 9) {
                    const curve = (index === 5 || index === 9) ? '42%' : (index === 7 ? '58%' : '50%');
                    top = curve;
                    left = `${10 + (index - 4) * 20}%`;
                }
                if (index === 10) {
                    top = '15%';
                    left = '50%';
                }
            } else if (currentFormation === '4-1-2-1-2') {
                if (index >= 1 && index <= 4) {
                    const curve = (index === 1 || index === 4) ? '75%' : '83%';
                    top = curve;
                    left = `${12 + (index - 1) * (76 / 3)}%`;
                }
                if (index === 5) { // CDM
                    top = '65%';
                    left = '50%';
                }
                if (index >= 6 && index <= 7) { // LM / RM
                    top = '48%';
                    left = `${10 + (index - 6) * 80}%`;
                }
                if (index === 8) { // CAM
                    top = '32%';
                    left = '50%';
                }
                if (index >= 9 && index <= 10) {
                    top = '15%';
                    left = `${32 + (index - 9) * 36}%`;
                }
            } else if (currentFormation === '5-2-1-2') {
                if (index >= 1 && index <= 5) {
                    const curve = (index === 1 || index === 5) ? '72%' : (index === 3 ? '83%' : '78%');
                    top = curve;
                    left = `${8 + (index - 1) * (84 / 4)}%`;
                }
                if (index >= 6 && index <= 7) {
                    top = '50%';
                    left = `${32 + (index - 6) * 36}%`;
                }
                if (index === 8) {
                    top = '32%';
                    left = '50%';
                }
                if (index >= 9 && index <= 10) {
                    top = '15%';
                    left = `${32 + (index - 9) * 36}%`;
                }
            }

            return { top, left };
        };

        return (
            <div className="pitch-perspective-container animate-fade-up">
                <div className="pitch">
                    <div className="pitch-grass"></div>
                    <div className="pitch-line half-way-line"></div>
                    <div className="pitch-circle center-circle"></div>
                    <div className="center-dot"></div>
                    <div className="pitch-box penalty-box-top"></div>
                    <div className="pitch-box penalty-box-bottom"></div>
                    <div className="pitch-box goal-box-top"></div>
                    <div className="pitch-box goal-box-bottom"></div>
                    <div className="corner corner-tl"></div>
                    <div className="corner corner-tr"></div>
                    <div className="corner corner-bl"></div>
                    <div className="corner corner-br"></div>

                    <div className="players-layer">
                        {currentPositions.map((posLabel, index) => {
                            const playerId = totmData.players[index];
                            const player = playerId ? getPlayerById(playerId) : null;
                            const style = getPositionStyle(index, currentPositions.length);

                            // Dynamic z-index based on vertical position (higher top % = closer = higher z-index)
                            const zIndex = Math.round(parseFloat(style.top));

                            return (
                                <div
                                    key={index}
                                    className="player-marker"
                                    style={{
                                        top: style.top,
                                        left: style.left,
                                        zIndex: zIndex,
                                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    {player ? (
                                        <TOTMCard player={player} onClick={setSelectedPlayer} />
                                    ) : (
                                        <div className="empty-slot"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container page-container totm-page" style={{ paddingBottom: '2rem', position: 'relative' }}>
            <h1 className="section-title animate-fade-in" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                Equipo del Torneo (TOTM)
            </h1>
            <p style={{ textAlign: 'center', color: '#aaaaaa', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                El mejor 11 de la copa.
            </p>

            {/* Team Rating Panel - Below subtitle */}
            <div className="team-rating-container">
                <TeamRatingPanel players={players} totmData={totmData} matches={matches} />
            </div>

            <div className="totm-field-wrapper">
                {loading ? <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando alineación...</div> : renderField()}
            </div>

            {/* Player Stats Modal Popup */}
            {selectedPlayer && (
                <div className="player-stats-modal-overlay" onClick={() => setSelectedPlayer(null)}>
                    <div className="player-stats-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedPlayer(null)}>
                            ✕
                        </button>
                        <PlayerStatsSidebar player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
                    </div>
                </div>
            )}

            <style>{`
                /* Layout Containers */
                .team-rating-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1rem;
                }

                .totm-field-wrapper {
                    display: flex;
                    justify-content: center;
                    position: relative;
                }

                /* Modal Overlay */
                .player-stats-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 8000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                    transition: background 0.3s ease, backdrop-filter 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Modal Content */
                .player-stats-modal {
                    position: relative;
                    background: linear-gradient(145deg, #090909 0%, #151515 50%, #050505 100%);
                    border: 1px solid rgba(252, 227, 135, 0.2); /* Changed from cyan */
                    border-radius: 28px;
                    padding: 0;
                    max-width: 320px;
                    width: 92%;
                    max-height: 85vh;
                    overflow: hidden;
                    box-shadow: 
                        0 30px 100px rgba(0, 0, 0, 0.95),
                        inset 0 1px 1px rgba(255, 255, 255, 0.05);
                    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    pointer-events: auto;
                }

                .player-stats-modal::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 200px;
                    background: radial-gradient(ellipse at top, rgba(252, 227, 135, 0.15) 0%, transparent 70%); /* Changed from cyan */
                    pointer-events: none;
                    z-index: 0;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* Close Button */
                .modal-close-btn {
                    position: absolute;
                    top: 1.25rem;
                    right: 1.25rem;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    z-index: 100;
                    font-weight: 300;
                }

                .modal-close-btn:hover {
                    background: rgba(255, 50, 50, 0.2);
                    border-color: rgba(255, 100, 100, 0.5);
                    transform: rotate(90deg) scale(1.1);
                    box-shadow: 0 0 20px rgba(255, 50, 50, 0.3);
                }

                /* Player Stats Sidebar */
                .player-stats-sidebar {
                    width: 100%;
                    background: transparent;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0;
                    position: relative;
                    z-index: 1;
                    padding: 1.5rem 1.2rem 1.2rem;
                }

                .sidebar-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.6rem; /* Reduced from 1rem */
                    padding-bottom: 1rem;
                    border-bottom: 1px solid rgba(252, 227, 135, 0.1); /* Changed from cyan */
                    margin-bottom: 1rem;
                }

                .sidebar-image-ring {
                    width: 100px; /* Reduced from 140px */
                    height: 100px; /* Reduced from 140px */
                    border-radius: 50%;
                    overflow: hidden;
                    background: linear-gradient(135deg, rgba(252, 227, 135, 0.2), rgba(252, 227, 135, 0.1)); /* Changed from cyan */
                    padding: 3px;
                    box-shadow: 
                        0 0 30px rgba(252, 227, 135, 0.3), /* Changed from cyan */
                        inset 0 0 20px rgba(252, 227, 135, 0.1); /* Changed from cyan */
                    position: relative;
                    animation: pulseGlow 3s ease-in-out infinite;
                }

                @keyframes pulseGlow {
                    0%, 100% {
                        box-shadow: 
                            0 0 30px rgba(252, 227, 135, 0.3),
                            inset 0 0 20px rgba(252, 227, 135, 0.1);
                    }
                    50% {
                        box-shadow: 
                            0 0 40px rgba(252, 227, 135, 0.5),
                            inset 0 0 30px rgba(252, 227, 135, 0.2);
                    }
                }

                .sidebar-image-ring::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: 50%;
                    background: conic-gradient(
                        from 0deg,
                        transparent 0deg,
                        rgba(252, 227, 135, 0.4) 90deg, /* Changed from cyan */
                        transparent 180deg,
                        rgba(252, 227, 135, 0.4) 270deg, /* Changed from cyan */
                        transparent 360deg
                    );
                    animation: rotate 4s linear infinite;
                    z-index: -1;
                }

                @keyframes rotate {
                    to { transform: rotate(360deg); }
                }

                .sidebar-image-ring img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                    position: relative;
                    z-index: 1;
                }

                .sidebar-position {
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
                    color: #D4AF37;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-weight: 900;
                    font-family: var(--font-heading);
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                    text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
                }

                .sidebar-name {
                    font-family: var(--font-heading);
                    font-size: 1.6rem; /* Reduced from 2.2rem */
                    color: #fce387; /* Changed from cyan to match card OVR */
                    text-align: center;
                    text-shadow: 
                        0 0 15px rgba(253, 227, 135, 0.4),
                        0 2px 4px rgba(0, 0, 0, 0.8);
                    letter-spacing: 1px;
                    line-height: 1.2;
                }

                .sidebar-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px; /* Reduced gap */
                    width: 100%;
                    padding: 0 10px;
                }

                .sidebar-stats > .stat-row:first-child {
                    grid-column: span 2;
                    background: linear-gradient(135deg, rgba(252, 227, 135, 0.12), rgba(252, 227, 135, 0.04));
                    border: 1px solid rgba(252, 227, 135, 0.25);
                    padding: 12px 10px; /* Reduced padding */
                    box-shadow: 0 0 15px rgba(252, 227, 135, 0.08);
                }

                .stat-row {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 8px 4px; /* Reduced padding further */
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(8px);
                }

                .stat-row:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(252, 227, 135, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
                }

                .stat-value {
                    font-weight: 900;
                    font-size: 1.4rem; /* Reduced font size */
                    color: #fff;
                    font-family: var(--font-heading);
                    text-shadow: 0 2px 8px rgba(252, 227, 135, 0.3);
                    line-height: 1;
                    margin-bottom: 2px;
                    text-align: center;
                    width: 100%;
                }

                .stat-label {
                    color: #999;
                    font-size: 0.7rem; /* Reduced font size */
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                    text-align: center;
                    width: 100%;
                }

                /* Mobile sidebar adjustment */
                @media (max-width: 1000px) {
                    .player-stats-sidebar {
                        width: 100%;
                        padding: 2rem 1.5rem;
                    }
                }

                /* Team Rating Panel Styles */
                .team-rating-panel {
                    width: auto;
                    max-width: 250px;
                    background: transparent;
                    padding: 10px;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    font-size: 0.85rem;
                }

                .rating-header {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                }

                .totm-name {
                    font-family: "CruyffSansMedium", "Open Sans", sans-serif;
                    font-size: 0.6rem; /* Very refined size */
                    font-weight: 700;
                    color: #fff;
                    text-transform: uppercase;
                    margin: 0;
                    letter-spacing: 0.5px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                }

                .totm-badge {
                    font-family: 'Bebas Neue', var(--font-heading), sans-serif;
                    font-size: 1.5rem;
                    font-weight: 900;
                    color: #22c55e;
                    text-shadow: 0 0 15px rgba(34, 197, 94, 0.8);
                    letter-spacing: 2px;
                    line-height: 1;
                }

                .star-display {
                    display: flex;
                    gap: 2px;
                    font-size: 1.2rem;
                }

                .star-icon {
                    display: inline-block;
                    transition: transform 0.2s ease;
                }

                .star-icon.full {
                    color: #ffd700;
                    text-shadow: 0 0 10px rgba(255, 215, 0, 0.9);
                }

                .star-icon.half {
                    background: linear-gradient(90deg, #ffd700 50%, #666 50%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .star-icon.empty {
                    color: #666;
                }

                .rating-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 2px;
                }

                .stat-item .stat-label {
                    font-size: 0.75rem;
                    color: #999;
                    text-transform: capitalize;
                    letter-spacing: 0.5px;
                    font-weight: 500;
                    white-space: nowrap;
                }

                .stat-value-large {
                    font-size: 1.2rem;
                    font-weight: 900;
                    color: #fff;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.7);
                    line-height: 1;
                }

                /* TOTM Card Styles */
                .player-wrapper {
                    position: absolute;
                    transform: translate(-50%, -100%); /* Bottom of wrapper at marker point */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    transform-style: preserve-3d;
                    z-index: 100;
                    overflow: visible;
                }

                .totm-card {
                    width: 130px; /* Reduced further to ensure visibility */
                    height: 180px;
                    position: relative;
                    transform: rotateX(-25deg) translateZ(1px); 
                    transform-origin: bottom center;
                    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                    cursor: pointer;
                    transform-style: preserve-3d;
                    background: transparent;
                    filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.5));
                }
                
                .totm-card:hover {
                    transform: rotateX(-25deg) scale(1.1) translateZ(50px);
                    z-index: 1000;
                    filter: drop-shadow(0 0 25px rgba(252, 227, 135, 0.6));
                }

                .card-position-bubble {
                    margin-top: 5px;
                    background: rgba(40, 100, 160, 0.95);
                    color: #fff;
                    padding: 4px 14px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 900;
                    font-family: var(--font-heading);
                    border: 1.5px solid rgba(255, 255, 255, 0.4);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                    transform: rotateX(-25deg);
                    z-index: 5;
                    pointer-events: none;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                    min-width: 50px;
                    text-align: center;
                }

                /* Shine effect removed as it causes clipping in 3D */
                
                .totm-card-bg-img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: fill; 
                    z-index: 1;
                    /* Base shadow removed from here, moving to card container for better 3D */
                }

                /* Adding the shine back but pinned to a specific layer to avoid clipping */
                .totm-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        105deg, 
                        transparent 30%, 
                        rgba(255, 255, 255, 0.05) 45%, 
                        rgba(255, 255, 255, 0.15) 50%, 
                        rgba(255, 255, 255, 0.05) 55%, 
                        transparent 70%
                    );
                    background-size: 200% 200%;
                    background-position: 150% 150%;
                    transition: background-position 0.6s ease;
                    z-index: 15;
                    pointer-events: none;
                    /* Mask to card shape */
                    mask-image: url(${totmBackground});
                    -webkit-mask-image: url(${totmBackground});
                    mask-size: 100% 100%;
                    -webkit-mask-size: 100% 100%;
                }

                .totm-card:hover::after {
                    background-position: -50% -50%;
                    transition: background-position 1.2s ease; /* Slower shine move */
                }

                .totm-content {
                    position: absolute;
                    inset: 0;
                    z-index: 5;
                    display: flex;
                    flex-direction: column;
                }

                .totm-rating {
                    position: absolute;
                    top: 18%;
                    left: 11.6%;
                    width: 19.8%;
                    text-align: center;
                    font-family: "CruyffSansMedium", "Open Sans", sans-serif;
                    font-size: 1.4rem; /* Reduced from 1.8rem */
                    font-weight: 900;
                    color: #fce387;
                    text-shadow: 0 2px 2px rgba(0,0,0,0.8);
                    z-index: 6;
                }
                
                .totm-position {
                    position: absolute;
                    top: 31%; /* Adjusted to be closer to rating */
                    left: 11.6%;
                    width: 19.8%;
                    text-align: center;
                    font-family: "CruyffSansMedium", "Open Sans", sans-serif;
                    transform: none;
                    font-size: 0.55rem; /* Reduced further for clarity */
                    font-weight: 800;
                    color: #fce387;
                    text-shadow: 0 1px 1px rgba(0,0,0,0.8);
                    z-index: 6;
                }

                .totm-image-container {
                    position: absolute;
                    top: 15%;
                    left: 20%; 
                    right: 15%;
                    height: 55%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2;
                }

                .totm-player-img {
                    height: 100%;
                    width: auto;
                    object-fit: contain;
                    filter: drop-shadow(0 5px 5px rgba(0,0,0,0.5));
                }

                .totm-info {
                    position: absolute;
                    bottom: 15%;
                    left: 15%;
                    right: 15%;
                    text-align: center;
                    z-index: 10;
                }



                .totm-meta {
                    display: flex;
                    justify-content: center;
                    gap: 8px; /* Reduced gap */
                    align-items: center;
                    margin-top: 3px;
                }

                .totm-flag img, .totm-team img {
                    width: 18px; /* Reduced size */
                    height: 18px;
                    object-fit: contain;
                }

                /* Layout Classes */
                .pitch-perspective-container {
                    perspective: 2000px;
                    width: 100%;
                    max-width: 1000px;
                    margin: -40px auto 0;
                    height: 950px; /* Increased to allow more vertical space */
                    display: flex;
                    justify-content: center;
                    padding-top: 0;
                    overflow: visible; 
                }

                .pitch {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(180deg, #1a4a2c 0%, #257043 50%, #2e8b57 100%);
                    transform: rotateX(25deg) translateY(-20px);
                    transform-style: preserve-3d;
                    box-shadow: 
                        0 80px 100px rgba(0,0,0,0.8),
                        0 20px 40px rgba(0,0,0,0.4);
                    border: 5px solid rgba(255,255,255,0.7);
                    border-radius: 12px;
                    overflow: visible; /* CRITICAL: Ensure no clipping */
                }

                /* Grass Pattern */
                .pitch-grass {
                    position: absolute;
                    inset: 0;
                    background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 50px, transparent 50px, transparent 100px);
                    pointer-events: none;
                }

                .pitch-line, .pitch-circle, .pitch-box, .corner {
                    z-index: 1;
                    box-shadow: 0 0 10px rgba(255,255,255,0.2);
                    position: absolute;
                    border-color: rgba(255,255,255,0.5);
                }
                
                .pitch-line { background: rgba(255,255,255,0.5); }
                .pitch-box, .pitch-circle, .corner { border-style: solid; border-width: 2px; }

                .half-way-line { top: 50%; left: 0; right: 0; height: 2px; transform: translateY(-50%); }
                .center-circle { top: 50%; left: 50%; width: 120px; height: 120px; border-radius: 50%; transform: translate(-50%, -50%); }
                .center-dot { position: absolute; top: 50%; left: 50%; width: 6px; height: 6px; background: #fff; border-radius: 50%; transform: translate(-50%, -50%); z-index: 1; }
                
                .penalty-box-top { top: 0; left: 50%; width: 60%; height: 16%; transform: translateX(-50%); border-top: none; }
                .penalty-box-bottom { bottom: 0; left: 50%; width: 60%; height: 16%; transform: translateX(-50%); border-bottom: none; }
                .goal-box-top { top: 0; left: 50%; width: 25%; height: 6%; transform: translateX(-50%); border-top: none; }
                .goal-box-bottom { bottom: 0; left: 50%; width: 25%; height: 6%; transform: translateX(-50%); border-bottom: none; }

                .corner { width: 20px; height: 20px; border-radius: 50%; }
                .corner-tl { top: -10px; left: -10px; }
                .corner-tr { top: -10px; right: -10px; }
                .corner-bl { bottom: -10px; left: -10px; }
                .corner-br { bottom: -10px; right: -10px; }

                .players-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 10;
                    transform-style: preserve-3d;
                    overflow: visible; /* Ensure cards are not clipped */
                }
                
                .player-marker {
                    position: absolute;
                    transform-style: preserve-3d;
                    z-index: 100;
                }

                .empty-slot {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.05);
                    border: 2px dashed rgba(255,255,255,0.2);
                    border-radius: 50%;
                    transform: translate(-50%, -50%) rotateX(-25deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Tablet Responsive */
                @media (max-width: 1024px) {
                    .team-rating-container {
                        margin-bottom: 1.5rem;
                    }

                    .team-rating-panel {
                        max-width: 100%;
                        align-items: center;
                    }

                    .rating-header {
                        align-items: center;
                    }

                    .pitch-perspective-container {
                        height: 700px;
                        max-width: 95%;
                    }

                    .totm-card {
                        transform: rotateX(-25deg) scale(0.75);
                    }

                    .totm-card:hover {
                        transform: rotateX(-20deg) scale(0.85) rotateY(10deg);
                    }
                }

                /* Desktop Styles (Sidebars) */
                @media (min-width: 1025px) {
                    .totm-page {
                        max-width: 100%;
                        margin: 0;
                        position: relative;
                        padding-top: 100px; /* Increased to avoid Navbar overlap */
                    }

                    .team-rating-container {
                        position: absolute;
                        left: 10px;
                        top: 120px;
                        width: 160px;
                        z-index: 10;
                        justify-content: flex-start;
                    }

                    .team-rating-panel {
                        padding: 0;
                        gap: 2px;
                    }

                    .totm-badge { font-size: 0.9rem; }
                    .star-display { font-size: 0.8rem; }
                    .stat-value-large { font-size: 1.1rem; }
                    .stat-item .stat-label { font-size: 0.6rem; }

                    .player-stats-modal-overlay {
                        background: transparent;
                        backdrop-filter: none;
                        pointer-events: none;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        overflow: visible;
                    }

                    .player-stats-modal {
                        position: fixed;
                        top: 55%;
                        right: 15px;
                        transform: translateY(-50%) !important;
                        width: 150px;
                        background: transparent;
                        border: none;
                        box-shadow: none;
                        overflow: visible;
                        pointer-events: auto;
                    }

                    .player-stats-sidebar {
                        padding: 0;
                        align-items: center;
                    }

                    .sidebar-header {
                        align-items: center;
                        border: none;
                        margin-bottom: 0.5rem;
                        padding-bottom: 0;
                        width: 100%;
                        gap: 3px;
                    }

                    .sidebar-image-ring {
                        width: 60px;
                        height: 60px;
                        margin-bottom: 5px;
                        box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
                    }

                    .sidebar-position {
                        font-size: 0.6rem;
                        padding: 2px 8px;
                        margin-bottom: 2px;
                    }

                    .sidebar-name {
                        font-size: 1.1rem;
                        color: #fce387;
                        text-shadow: 0 0 5px rgba(252, 227, 135, 0.4);
                    }

                    .sidebar-stats {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        padding: 0;
                        align-items: center;
                        width: 100%;
                    }

                    .stat-row {
                        flex-direction: row;
                        justify-content: flex-start;
                        gap: 8px;
                        background: transparent;
                        border: none;
                        backdrop-filter: none;
                        padding: 0;
                        box-shadow: none;
                        width: 90px;
                        transform: none !important;
                    }

                    .stat-value {
                        font-size: 1rem;
                        width: auto;
                        text-align: right;
                        min-width: 25px;
                        margin: 0;
                    }

                    .stat-label {
                        font-size: 0.75rem;
                        width: auto;
                        text-align: left;
                        color: #ccc;
                        letter-spacing: 0.5px;
                        margin: 0;
                    }

                    .modal-close-btn {
                        display: none;
                    }
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .page-container {
                        padding-top: 80px;
                    }

                    .section-title {
                        font-size: 2.5rem;
                        margin-bottom: 0.5rem;
                    }

                    .team-rating-container {
                        margin-bottom: 1rem;
                    }

                    .team-rating-panel {
                        width: 100%;
                        max-width: 100%;
                        padding: 1rem;
                        align-items: center;
                    }

                    .rating-header {
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        gap: 1rem;
                    }

                    .totm-badge {
                        font-size: 1.3rem;
                    }

                    .star-display {
                        font-size: 1.3rem;
                    }

                    .rating-stats {
                        flex-direction: row;
                        justify-content: center;
                        gap: 2rem;
                    }

                    .stat-item {
                        align-items: center;
                    }

                    .stat-value-large {
                        font-size: 1.8rem;
                    }

                    .pitch-perspective-container {
                        height: 550px;
                        margin: 0 auto;
                        max-width: 92%;
                    }

                    .pitch {
                        transform: rotateX(15deg);
                    }

                    .totm-card {
                        width: 140px;
                        height: 195px;
                        transform: rotateX(-15deg) scale(0.6);
                    }

                    .totm-card:hover {
                        transform: rotateX(-15deg) scale(0.75) rotateY(5deg);
                    }

                    .totm-rating {
                        font-size: 1.4rem;
                    }

                    .totm-position {
                        font-size: 0.75rem;
                    }

                    .totm-name {
                        font-size: 1.1rem;
                    }

                    .totm-flag img, .totm-team img {
                        width: 18px;
                        height: 18px;
                    }

                    /* Modal adjustments for mobile */
                    .player-stats-modal {
                        width: 92%;
                        max-width: 400px;
                        max-height: 90vh;
                        padding: 0;
                        border-radius: 20px;
                    }

                    .player-stats-sidebar {
                        width: 100%;
                        padding: 1.5rem 1.2rem 1.2rem;
                    }

                    .sidebar-header {
                        gap: 0.8rem;
                        padding-bottom: 1rem;
                        margin-bottom: 1rem;
                    }

                    .sidebar-image-ring {
                        width: 110px;
                        height: 110px;
                    }

                    .sidebar-position {
                        padding: 5px 14px;
                        font-size: 0.8rem;
                    }

                    .sidebar-name {
                        font-size: 1.8rem;
                    }

                    .sidebar-stats {
                        gap: 10px;
                    }

                    .stat-row {
                        padding: 12px 10px;
                    }

                    .stat-value {
                        font-size: 1.6rem;
                        margin-bottom: 3px;
                    }

                    .stat-label {
                        font-size: 0.75rem;
                    }

                    .modal-close-btn {
                        width: 36px;
                        height: 36px;
                        top: 1rem;
                        right: 1rem;
                    }
                }

                /* Small Mobile */
                @media (max-width: 480px) {
                    .section-title {
                        font-size: 2rem;
                    }

                    .team-rating-panel {
                        padding: 0.75rem;
                    }

                    .rating-header {
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .totm-badge {
                        font-size: 1.1rem;
                    }

                    .star-display {
                        font-size: 1.1rem;
                    }

                    .rating-stats {
                        gap: 1rem;
                    }

                    .stat-value-large {
                        font-size: 1.4rem;
                    }

                    .pitch-perspective-container {
                        height: 450px;
                        max-width: 90%;
                    }

                    .totm-card {
                        width: 120px;
                        height: 167px;
                        transform: rotateX(-15deg) scale(0.55);
                    }

                    .totm-card:hover {
                        transform: rotateX(-15deg) scale(0.65) rotateY(5deg);
                    }

                    .totm-rating {
                        font-size: 1.2rem;
                    }

                    .totm-position {
                        font-size: 0.65rem;
                    }

                    .totm-name {
                        font-size: 0.95rem;
                    }

                    /* Modal for small mobile */
                    .player-stats-modal {
                        width: 95%;
                        max-width: 360px;
                        max-height: 88vh;
                    }

                    .player-stats-sidebar {
                        padding: 1.2rem 1rem 1rem;
                    }

                    .sidebar-header {
                        gap: 0.6rem;
                        padding-bottom: 0.8rem;
                        margin-bottom: 0.8rem;
                    }

                    .sidebar-image-ring {
                        width: 90px;
                        height: 90px;
                    }

                    .sidebar-position {
                        padding: 4px 12px;
                        font-size: 0.75rem;
                    }

                    .sidebar-name {
                        font-size: 1.5rem;
                    }

                    .sidebar-stats {
                        gap: 8px;
                    }

                    .stat-row {
                        padding: 10px 8px;
                    }

                    .stat-value {
                        font-size: 1.4rem;
                    }

                    .stat-label {
                        font-size: 0.7rem;
                    }

                    .modal-close-btn {
                        width: 32px;
                        height: 32px;
                        font-size: 1.3rem;
                    }
                }

                /* Extra small devices */
                @media (max-width: 360px) {
                    .player-stats-modal {
                        width: 96%;
                        max-height: 90vh;
                    }

                    .sidebar-image-ring {
                        width: 80px;
                        height: 80px;
                    }

                    .sidebar-name {
                        font-size: 1.3rem;
                    }

                    .stat-value {
                        font-size: 1.2rem;
                    }

                    .stat-label {
                        font-size: 0.65rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Totm;
