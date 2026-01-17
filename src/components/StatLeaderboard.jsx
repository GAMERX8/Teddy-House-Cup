import React from 'react';

const StatLeaderboard = ({ title, players, statKey, accentColor = '#ff6b00' }) => {
    return (
        <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{
                fontSize: '1.2rem',
                color: accentColor,
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '1px'
            }}>
                {title}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {players.map((player, index) => (
                    <div
                        key={player.id}
                        className="animate-fade-in"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s ease',
                            cursor: 'default',
                            animationDelay: `${index * 0.05}s`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        {/* Rank */}
                        <span style={{
                            fontSize: '1.2rem',
                            fontWeight: '900',
                            color: '#fff',
                            width: '25px',
                            marginRight: '1rem',
                            fontFamily: 'var(--font-heading)',
                            textAlign: 'center'
                        }}>
                            {index + 1}
                        </span>

                        {/* Player Image Wrapper */}
                        <div style={{
                            position: 'relative',
                            marginRight: '1.2rem',
                            flexShrink: 0
                        }}>
                            <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                border: `2px solid ${accentColor}`,
                                overflow: 'hidden',
                                background: '#111',
                                boxShadow: index < 3 ? `0 0 10px ${accentColor}44` : 'none'
                            }}>
                                <img
                                    src={player.imagenJugador || player.image || 'https://via.placeholder.com/150'}
                                    alt={player.nombre}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>

                        {/* Name and Team */}
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: '1rem',
                                letterSpacing: '0.5px'
                            }}>
                                {player.nombre}
                            </div>
                            <div style={{
                                color: '#777',
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginTop: '2px'
                            }}>
                                {player.equipoNombre}
                            </div>
                        </div>

                        {/* Stat Value */}
                        <span style={{
                            fontSize: '1.8rem',
                            fontWeight: '900',
                            color: accentColor,
                            fontFamily: 'var(--font-heading)',
                            marginLeft: '1rem',
                            textShadow: index < 3 ? `0 0 15px ${accentColor}66` : 'none'
                        }}>
                            {player[statKey]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatLeaderboard;
