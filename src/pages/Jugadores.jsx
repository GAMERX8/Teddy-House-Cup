import React, { useEffect, useState } from 'react';
import { subscribeToPlayers, subscribeToTeams } from '../services/dataService';
import '../index.css';

const Jugadores = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        // Subscribe to both collections for real-time updates
        const unsubscribePlayers = subscribeToPlayers((data) => {
            setPlayers(data);
            // Only set loading to false if we have both (simplified logic: if players load, we show something)
        });

        const unsubscribeTeams = subscribeToTeams((data) => {
            setTeams(data);
            setLoading(false); // Assume if teams load, we can render
        });

        return () => {
            // Cleanup listeners on unmount
            if (unsubscribePlayers) unsubscribePlayers();
            if (unsubscribeTeams) unsubscribeTeams();
        };
    }, []);

    const getTeam = (idOrRef) => {
        if (!idOrRef) return null;
        // Handle both string IDs (Firestore) and number IDs (Mock)
        return teams.find(t => t.id == idOrRef) || teams.find(t => t.id === idOrRef);
    };

    if (loading) {
        return (
            <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="section-title">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="container page-container">
            <h1 className="section-title animate-fade-in">Jugadores</h1>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                    gap: '2rem',
                    marginTop: '2rem'
                }}
            >
                {players.map((player, index) => {
                    // Normalize Data
                    const teamId = player.equipo || player.teamId;
                    const team = getTeam(teamId);

                    const playerImage = player.imagenJugador || player.image;
                    const teamLogo = player.escudoEquipo || team?.logo;
                    const playerName = player.nombre || player.name || 'Unknown';
                    const playerPosition = player.posicion || player.position || 'Jugador';
                    const rating = player.ovr || player.rating || '-';

                    const matches = player.partidos || player.totalPartidos || player.matches || 0;
                    const goals = player.goles || player.totalGoles || player.goals || 0;
                    const assists = player.asistencias || player.totalAsistencias || player.assists || 0;
                    const yellowCards = player.amarillas || player.tarjasAmarillas || player.yellowCards || 0;
                    const mvp = player.mvp || 0; // Using mvp field
                    const goalsConceded = player.golesEncajados || 0; // Assuming field name

                    // Team Theme Logic
                    // Check both 'name' (Mock) and 'nombre' (Firestore Spanish convention)
                    // Also check the raw player.equipo field as a fallback if the ID lookup failed
                    const teamObjName = (team?.name || team?.nombre || '').toLowerCase();
                    const rawTeamRef = String(player.equipo || player.teamId || '').toLowerCase().trim();

                    // EXPLICIT ID MAPPING (Based on Debugging)
                    // The debug screenshot showed mixed case, but we .toLowerCase() the input.
                    // So these comparison strings MUST be lowercase.
                    const explicitFantasmasPart = '1m2n9q';
                    const explicitColoquiosPart = '71x3ry';

                    const isFantasmas = teamObjName.includes('fantasma') || rawTeamRef.includes('fantasma') || rawTeamRef.includes(explicitFantasmasPart);
                    const isColoquios = teamObjName.includes('coloquio') || rawTeamRef.includes('coloquio') || rawTeamRef.includes(explicitColoquiosPart);

                    // Default dark theme
                    let cardBg = '#0f0f0f';
                    let textColor = '#fff';
                    let statBoxBg = 'rgba(0,0,0,0.6)';

                    if (isFantasmas) {
                        cardBg = '#f0f0f0'; // White theme
                        textColor = '#111';
                        statBoxBg = 'rgba(255,255,255,0.8)';
                    }

                    const isGoalkeeper = playerPosition.toLowerCase().includes('portero') || playerPosition === 'POR';

                    return (
                        <div
                            key={player.id || index}
                            className="animate-fade-up"
                            onClick={() => setSelectedPlayer(player)}
                            style={{
                                animationDelay: `${index * 0.1}s`,
                                borderRadius: '16px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                border: isFantasmas ? '1px solid #ccc' : '1px solid rgba(255,255,255,0.05)',
                                minHeight: '280px',
                                display: 'flex',
                                cursor: 'pointer',
                                flexDirection: 'column',
                                backgroundColor: cardBg,
                                color: textColor,
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >

                            {/* Pattern Overlay */}
                            <div className="player-card-pattern" style={{
                                position: 'absolute', inset: 0, opacity: isFantasmas ? 0.05 : 0.4,
                                background: isFantasmas ? '#000' : 'inherit' // Invert pattern for white card
                            }}></div>

                            {/* Accent Border Top */}
                            <div style={{ padding: '4px', background: team?.color || '#333', position: 'relative', zIndex: 2 }}></div>

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>

                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', lineHeight: '1', margin: '0 0 0.5rem 0' }}>
                                            {playerName}
                                        </h3>
                                        <p style={{ color: isFantasmas ? '#666' : '#aaa', margin: 0, textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                            {playerPosition}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        {teamLogo && (
                                            <img src={teamLogo} alt="Team" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                        )}
                                        <div style={{
                                            background: '#fbbd08',
                                            color: '#000',
                                            borderRadius: '8px',
                                            padding: '0.5rem 0.8rem',
                                            textAlign: 'center',
                                            boxShadow: '0 4px 15px rgba(251, 189, 8, 0.3)'
                                        }}>
                                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '2px' }}>Media</div>
                                            <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', lineHeight: '1' }}>{rating}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Image */}
                                <div style={{ flex: 1, position: 'relative', minHeight: '150px' }}>
                                    <img
                                        src={playerImage}
                                        alt={playerName}
                                        style={{
                                            position: 'absolute',
                                            left: '-20px',
                                            bottom: '-20px',
                                            height: '110%',
                                            width: 'auto',
                                            objectFit: 'contain',
                                            zIndex: 1,
                                            filter: 'drop-shadow(5px 5px 15px rgba(0,0,0,0.5))'
                                        }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>

                                {/* Basic Stats Row (Matches, Goals, Assists/Conceded) */}
                                <div style={{
                                    marginTop: 'auto',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '0.25rem',
                                    zIndex: 2
                                }}>
                                    <div className="stat-box" style={{ background: statBoxBg, borderColor: isFantasmas ? '#ddd' : 'rgba(255,255,255,0.1)' }}>
                                        <div style={{ fontSize: '0.7rem', color: isFantasmas ? '#555' : '#888', marginBottom: '4px' }}>Partidos</div>
                                        <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>{matches}</div>
                                    </div>
                                    <div className="stat-box" style={{ background: statBoxBg, borderColor: isFantasmas ? '#ddd' : 'rgba(255,255,255,0.1)' }}>
                                        <div style={{ fontSize: '0.7rem', color: isFantasmas ? '#555' : '#888', marginBottom: '4px' }}>{isGoalkeeper ? 'Goles Enc.' : 'Goles'}</div>
                                        <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>{isGoalkeeper ? goalsConceded : goals}</div>
                                    </div>
                                    <div className="stat-box" style={{ background: statBoxBg, borderColor: isFantasmas ? '#ddd' : 'rgba(255,255,255,0.1)' }}>
                                        <div style={{ fontSize: '0.7rem', color: isFantasmas ? '#555' : '#888', marginBottom: '4px' }}>{isGoalkeeper ? 'Ratio' : 'Asist.'}</div>
                                        <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
                                            {isGoalkeeper
                                                ? (matches > 0 ? (goalsConceded / matches).toFixed(2) : '0.00')
                                                : assists
                                            }
                                        </div>
                                    </div>
                                    <div className="stat-box" style={{ background: statBoxBg, borderColor: isFantasmas ? '#ddd' : 'rgba(255,255,255,0.1)' }}>
                                        <div style={{ fontSize: '0.7rem', color: isFantasmas ? '#555' : '#888', marginBottom: '4px' }}>MVP</div>
                                        <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>{mvp}</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Details Modal */}
            {selectedPlayer && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem'
                }} onClick={() => setSelectedPlayer(null)}>
                    {(() => {
                        const team = getTeam(selectedPlayer.teamId || selectedPlayer.equipo);
                        const teamObjName = (team?.name || team?.nombre || '').toLowerCase();
                        const rawTeamRef = String(selectedPlayer.equipo || selectedPlayer.teamId || '').toLowerCase();

                        // EXPLICIT ID MAPPING (Modal)
                        const explicitFantasmasPart = '1m2n9qhneh';
                        const explicitColoquiosPart = '71x3ryghcr';

                        const isFantasmas = teamObjName.includes('fantasma') || rawTeamRef.includes('fantasma') || rawTeamRef.includes(explicitFantasmasPart);
                        const isColoquios = teamObjName.includes('coloquio') || rawTeamRef.includes('coloquio') || rawTeamRef.includes(explicitColoquiosPart);
                        // Unused for now but good for consistency
                        // const isColoquios = teamObjName.includes('coloquio') || rawTeamRef.includes('coloquio') || rawTeamRef === explicitColoquiosId;

                        const modalBg = isFantasmas ? '#f0f0f0' : '#1a1a1a';
                        const modalText = isFantasmas ? '#111' : '#fff';
                        const modalBorder = isFantasmas ? '1px solid #ccc' : '1px solid #333';
                        const subText = isFantasmas ? '#555' : '#aaa';
                        const itemBg = isFantasmas ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';

                        return (
                            <div style={{
                                background: modalBg, color: modalText, border: modalBorder, borderRadius: '24px',
                                width: '100%', maxWidth: '500px', overflow: 'hidden',
                                animation: 'scaleIn 0.3s ease', position: 'relative'
                            }} onClick={e => e.stopPropagation()}>

                                {/* Pattern Overlay for Modal */}
                                <div className="player-card-pattern" style={{
                                    position: 'absolute', inset: 0, opacity: isFantasmas ? 0.05 : 0.4,
                                    background: isFantasmas ? '#000' : 'inherit', pointerEvents: 'none'
                                }}></div>

                                {/* Modal Header */}
                                <div style={{
                                    padding: '2rem',
                                    background: isFantasmas ? 'linear-gradient(to right, #ddd, #eee)' : 'linear-gradient(to right, #000, #222)',
                                    display: 'flex', gap: '1.5rem', alignItems: 'center', position: 'relative', zIndex: 2
                                }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid gold' }}>
                                        <img src={selectedPlayer.imagenJugador || selectedPlayer.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '2rem' }}>{selectedPlayer.nombre || selectedPlayer.name}</h2>
                                        <p style={{ color: subText, margin: 0, fontWeight: 'bold' }}>{selectedPlayer.posicion || selectedPlayer.position}</p>
                                    </div>
                                    <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'gold' }}>{selectedPlayer.ovr || selectedPlayer.rating}</div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Media</div>
                                    </div>
                                </div>

                                {/* FIFA Stats Detail */}
                                <div style={{ padding: '2rem', position: 'relative', zIndex: 2 }}>
                                    <h3 style={{ borderBottom: `1px solid ${isFantasmas ? '#ddd' : '#333'}`, paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Atributos</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        {['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'].map(attr => (
                                            <div key={attr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: itemBg, padding: '0.8rem', borderRadius: '8px' }}>
                                                <span style={{ color: subText, fontWeight: 'bold' }}>{attr}</span>
                                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>{(selectedPlayer.stats || {})[attr.toLowerCase()] || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ padding: '1rem 2rem', borderTop: `1px solid ${isFantasmas ? '#ddd' : '#333'}`, textAlign: 'right', position: 'relative', zIndex: 2 }}>
                                    <button
                                        onClick={() => setSelectedPlayer(null)}
                                        style={{
                                            background: 'transparent',
                                            border: `1px solid ${isFantasmas ? '#999' : '#555'}`,
                                            color: modalText,
                                            padding: '0.5rem 1.5rem',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

export default Jugadores;
