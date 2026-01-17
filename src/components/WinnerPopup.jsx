import React, { useState, useEffect } from 'react';
import { subscribeToSettings, subscribeToTeams } from '../services/dataService';
import { Trophy, X, Star } from 'lucide-react';
import '../index.css';

// Import Assets
import fantasmasLogo from '../assets/Fantasmas_FC.png';
import coloquiosLogo from '../assets/Coloquios_FC.png';

const WinnerPopup = () => {
    const [visible, setVisible] = useState(false);
    const [settings, setSettings] = useState(null);
    const [teams, setTeams] = useState([]);
    const [hasSeen, setHasSeen] = useState(false);

    useEffect(() => {
        const unsubSettings = subscribeToSettings((data) => {
            setSettings(data);
        });
        const unsubTeams = subscribeToTeams(setTeams);

        return () => {
            unsubSettings();
            unsubTeams();
        };
    }, []);

    useEffect(() => {
        // Trigger visibility only when data is ready and enabled
        if (settings?.trophyWinner?.enabled && !hasSeen) {
            // Check if we have the team info
            if (settings.trophyWinner.teamId) {
                setVisible(true);
            }
        } else if (!settings?.trophyWinner?.enabled) {
            setVisible(false);
        }
    }, [settings, hasSeen]);

    const handleClose = () => {
        setVisible(false);
        setHasSeen(true); // Don't show again until refresh
    };

    if (!visible || !settings?.trophyWinner?.teamId) return null;

    const winnerTeamId = settings.trophyWinner.teamId;
    const winnerTeam = teams.find(t => String(t.id) === String(winnerTeamId));

    if (!winnerTeam) return null; // Wait for team data

    // Premium Gold colors
    const goldGradient = 'linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #FFD700 100%)';
    const darkBg = 'linear-gradient(145deg, #000000 0%, #1a1a1a 100%)';

    // Helper to get logo (custom or fallback to known emojis by name)
    const getTeamLogo = (team) => {
        if (team.logo) return team.logo;

        const name = (team.name || '').toLowerCase();

        // Use local assets for main teams
        if (name.includes('fantasma') || name.includes('1m2n9q')) return fantasmasLogo;
        if (name.includes('coloquio')) return coloquiosLogo;

        // Fallbacks for others
        if (name.includes('porcino')) return '🐷';
        if (name.includes('saiyan')) return '🐉';
        if (name.includes('mostoles') || name.includes('ultimate')) return '🦁';
        if (name.includes('rayo')) return '⚡';
        if (name.includes('kunisport')) return '⚽';
        if (name.includes('piomon')) return '🥧';
        if (name.includes('aniquiladores')) return '🥊';
        if (name.includes('jijantes')) return '🕺';
        if (name.includes('troncos')) return '🪵';

        return '🏆'; // Ultimate fallback if not mapped
    };

    const teamLogo = getTeamLogo(winnerTeam);

    // Check if it's an image (URL or local path with extension) vs an emoji
    const isImage = typeof teamLogo === 'string' && (teamLogo.includes('/') || teamLogo.includes('.'));
    const isEmoji = !isImage;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999, // Highest priority
            animation: 'fadeIn 0.5s ease'
        }} onClick={handleClose}>
            <div style={{
                position: 'relative',
                background: darkBg,
                width: '90%',
                maxWidth: '500px',
                borderRadius: '30px',
                border: '2px solid transparent',
                padding: '3rem 2rem',
                textAlign: 'center',
                boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
                overflow: 'hidden',
                animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }} onClick={e => e.stopPropagation()}>

                {/* Gold Border simulated */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '30px',
                    padding: '2px',
                    background: goldGradient,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none'
                }} />

                {/* Confetti / Shine effects could go here */}

                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        color: '#FFD700',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.5rem',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <Star fill="#FFD700" size={24} /> CAMPEONES <Star fill="#FFD700" size={24} />
                    </div>

                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '3.5rem',
                        background: goldGradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                        lineHeight: 1,
                        textTransform: 'uppercase'
                    }}>
                        {winnerTeam.name || "Equipo Ganador"}
                    </h2>
                </div>

                <div style={{
                    width: '200px',
                    height: '200px',
                    margin: '0 auto 2.5rem',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Glowing effect behind logo */}
                    <div style={{
                        position: 'absolute',
                        inset: '-20px',
                        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
                        animation: 'pulse 2s infinite'
                    }} />

                    {isEmoji ? (
                        <div style={{ fontSize: '150px', lineHeight: '200px', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))' }}>
                            {teamLogo}
                        </div>
                    ) : teamLogo !== '🏆' ? (
                        <img src={teamLogo} alt="Team Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))' }} />
                    ) : (
                        <Trophy size={150} color="#FFD700" strokeWidth={1} style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))' }} />
                    )}
                </div>

                <div style={{
                    color: '#ccc',
                    fontSize: '1.2rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                }}>
                    ¡Felicitaciones a <strong>{winnerTeam.name}</strong> por consagrarse como el ganador de la TH CUP!
                </div>

                <button
                    onClick={handleClose}
                    style={{
                        background: goldGradient,
                        border: 'none',
                        padding: '1rem 3rem',
                        borderRadius: '50px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#000',
                        cursor: 'pointer',
                        boxShadow: '0 5px 20px rgba(255, 215, 0, 0.3)',
                        transition: 'transform 0.2s',
                        textTransform: 'uppercase'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Celebrar
                </button>
            </div>
        </div>
    );
};

export default WinnerPopup;
