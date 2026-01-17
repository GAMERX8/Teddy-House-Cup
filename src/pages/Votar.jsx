import React, { useState, useEffect } from 'react';
import { subscribeToPlayers, subscribeToTeams, castVote, checkIfVoted, getVoteResults, subscribeToSettings } from '../services/dataService';
import { Trophy, AlertCircle, CheckCircle2, ArrowRight, User, Loader2 } from 'lucide-react';
import '../index.css';

const Votar = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [voted, setVoted] = useState(false);
    const [voting, setVoting] = useState(false);
    const [voteResults, setVoteResults] = useState([]);
    const [settings, setSettings] = useState({ mvpVoting: false });

    useEffect(() => {
        console.log("Votar page mounted");
        const unsubPlayers = subscribeToPlayers((data) => {
            console.log("Players updated:", data.length);
            setPlayers(data);
        });
        const unsubTeams = subscribeToTeams((data) => {
            console.log("Teams updated:", data.length);
            setTeams(data);
            setLoading(false); // Teams is the last heavy fetch
        });
        const unsubSettings = subscribeToSettings((data) => {
            setSettings(data);
        });

        const initSession = async () => {
            const savedUser = localStorage.getItem('mvp_voter');
            if (savedUser) {
                try {
                    const parsed = JSON.parse(savedUser);
                    setUser(parsed);

                    // Verify actual status in Firestore
                    const hasVoted = await checkIfVoted(String(parsed.id));
                    setVoted(hasVoted);
                    if (hasVoted) {
                        localStorage.setItem('mvp_voted', 'true');
                        // Fetch vote results if already voted
                        const results = await getVoteResults();
                        setVoteResults(results);
                    } else {
                        localStorage.removeItem('mvp_voted');
                    }
                } catch (e) {
                    console.error("Error parsing saved user", e);
                    localStorage.removeItem('mvp_voter');
                }
            }
        };

        initSession();

        return () => {
            unsubPlayers();
            unsubTeams();
            unsubSettings();
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const normalizedCode = code.trim().toUpperCase();

        if (!normalizedCode) {
            setError('Por favor, ingresa tu código para continuar.');
            return;
        }

        const foundPlayer = players.find(p =>
            (p.codigo || '').toUpperCase() === normalizedCode ||
            (p.uniqueCode || '').toUpperCase() === normalizedCode
        );

        if (foundPlayer) {
            setUser(foundPlayer);
            localStorage.setItem('mvp_voter', JSON.stringify(foundPlayer));

            // Immediately check vote status after login
            const hasVoted = await checkIfVoted(String(foundPlayer.id));
            setVoted(hasVoted);
            if (hasVoted) localStorage.setItem('mvp_voted', 'true');
        } else {
            setError('Código no válido. Por favor, verifica el código de tu carta.');
        }
    };

    const handleVote = async (playerId) => {
        if (!user || voting) return;

        // Extra safety check: Block if voting is disabled locally
        if (!settings.mvpVoting) {
            alert("La votación se ha cerrado.");
            window.location.reload();
            return;
        }

        setVoting(true);
        try {
            await castVote(String(user.id), String(playerId));
            setVoted(true);
            localStorage.setItem('mvp_voted', 'true');

            // Fetch vote results
            const results = await getVoteResults();
            setVoteResults(results);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Failed to cast vote", error);
            alert("Error al registrar tu voto. Por favor intenta de nuevo.");
        } finally {
            setVoting(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('mvp_voter');
        localStorage.removeItem('mvp_voted');
        setVoted(false);
    };

    if (loading) return <div className="container page-container">Cargando...</div>;

    // ACCESS CONTROL: Block access if voting is disabled
    if (!settings.mvpVoting) {
        return (
            <div className="container page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div className="glass-card" style={{
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'center',
                    padding: '3rem 2rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255, 68, 68, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        color: '#ff4444'
                    }}>
                        <AlertCircle size={40} />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>VOTACIÓN CERRADA</h2>
                    <p style={{ color: '#aaa', fontSize: '1rem', lineHeight: '1.5' }}>
                        Las votaciones para el MVP de la jornada no están activas en este momento.
                    </p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '1rem' }}>
                        Por favor, espera a que el administrador habilite la votación.
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div className="glass-card animate-fade-up" style={{
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'center',
                    padding: '3rem 2rem',
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.1)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative Top Line */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />

                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(0,0,0,0))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        color: '#FFD700',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)'
                    }}>
                        <Trophy size={40} />
                    </div>

                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2.5rem',
                        marginBottom: '0.5rem',
                        lineHeight: '1',
                        background: 'linear-gradient(180deg, #fff, #bbb)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        VOTACIÓN MVP
                    </h2>

                    <p style={{ color: '#888', marginBottom: '2.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Ingresa el código único de tu jugador para acceder al panel de votación oficial.
                    </p>

                    <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Escribe tu código aqui..."
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#FFD700';
                                    e.target.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <User size={20} style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#FFD700',
                                opacity: 0.7
                            }} />
                        </div>

                        {error && (
                            <div className="animate-pulse" style={{
                                color: '#ff6b6b',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                justifyContent: 'center',
                                background: 'rgba(255, 107, 107, 0.1)',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 107, 107, 0.2)'
                            }}>
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.2rem',
                                marginTop: '0.5rem',
                                background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#000',
                                fontFamily: 'var(--font-heading)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
                            }}
                        >
                            INGRESAR <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (voted) {
        const top5 = voteResults.slice(0, 5);
        const top5Players = top5.map(result => {
            const player = players.find(p => String(p.id) === String(result.playerId));
            return { ...result, player };
        }).filter(item => item.player);

        return (
            <div className="container page-container" style={{
                paddingTop: '6rem',
                paddingBottom: '2rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                {/* Wrapper for consistent centering */}
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>

                    {/* Success Header */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(46, 204, 113, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            color: '#2ecc71'
                        }}>
                            <CheckCircle2 size={36} />
                        </div>
                        <h1 className="section-title" style={{ marginBottom: '0.25rem', fontSize: '2rem' }}>¡VOTO REGISTRADO!</h1>
                        <p style={{ color: '#aaa', fontSize: '0.95rem' }}>Gracias por participar, <strong>{user.nombre || user.name}</strong></p>
                    </div>

                    {/* Top 5 Leaderboard */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.4rem',
                            textAlign: 'center',
                            marginBottom: '1.25rem',
                            color: '#D4AF37',
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            <Trophy size={20} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
                            Top 5 Votaciones
                        </h2>

                        <div style={{ display: 'grid', gap: '1rem', width: '100%', maxWidth: '800px' }}>
                            {top5Players.map((item, index) => {
                                const rank = index + 1;
                                let rankColor = '#fff';
                                let rankBg = 'rgba(255,255,255,0.05)';
                                let borderColor = 'rgba(255,255,255,0.1)';

                                if (rank === 1) {
                                    rankColor = '#D4AF37';
                                    rankBg = 'rgba(212, 175, 55, 0.1)';
                                    borderColor = '#D4AF37';
                                } else if (rank === 2) {
                                    rankColor = '#C0C0C0';
                                    rankBg = 'rgba(192, 192, 192, 0.1)';
                                    borderColor = '#C0C0C0';
                                } else if (rank === 3) {
                                    rankColor = '#CD7F32';
                                    rankBg = 'rgba(205, 127, 50, 0.1)';
                                    borderColor = '#CD7F32';
                                }

                                return (
                                    <div key={item.playerId} className="glass-card animate-fade-up" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: rankBg,
                                        border: `2px solid ${borderColor}`,
                                        borderRadius: '16px',
                                        animationDelay: `${index * 0.1}s`,
                                        boxShadow: rank <= 3 ? `0 0 30px ${borderColor}40` : 'none'
                                    }}>
                                        {/* Rank Badge */}
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${rankColor}, ${rankColor}80)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '1.6rem',
                                            color: rank <= 3 ? '#000' : '#fff',
                                            fontWeight: '900',
                                            flexShrink: 0,
                                            boxShadow: `0 4px 20px ${rankColor}40`
                                        }}>
                                            {rank}
                                        </div>

                                        {/* Player Image */}
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: `2px solid ${rankColor}`,
                                            flexShrink: 0
                                        }}>
                                            <img
                                                src={item.player.imagenJugador || item.player.image}
                                                alt={item.player.nombre || item.player.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>

                                        {/* Player Info */}
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: '1.2rem',
                                                margin: 0,
                                                color: rankColor
                                            }}>
                                                {item.player.nombre || item.player.name}
                                            </h3>
                                            <p style={{
                                                color: '#888',
                                                margin: '2px 0 0 0',
                                                fontSize: '0.8rem',
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold'
                                            }}>
                                                {item.player.posicion || item.player.position}
                                            </p>
                                        </div>

                                        {/* Vote Count */}
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: '2rem',
                                                color: rankColor,
                                                lineHeight: 1,
                                                fontWeight: '900'
                                            }}>
                                                {item.voteCount}
                                            </div>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                color: '#666',
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                marginTop: '4px'
                                            }}>
                                                {item.voteCount === 1 ? 'Voto' : 'Votos'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Logout Button */}
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button
                                className="btn-primary"
                                onClick={handleLogout}
                                style={{
                                    padding: '1rem 3rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '900',
                                    background: 'linear-gradient(135deg, #ff4444, #cc0000)',
                                    border: 'none',
                                    boxShadow: '0 4px 20px rgba(255, 68, 68, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 6px 30px rgba(255, 68, 68, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 68, 68, 0.3)';
                                }}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container page-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>ELEGIR MVP</h1>
                    <p style={{ color: '#aaa' }}>Hola, <strong>{user.nombre || user.name}</strong>. Selecciona al mejor jugador de la jornada.</p>
                </div>
                <button className="btn-secondary" onClick={handleLogout} style={{ fontSize: '0.8rem' }}>Salir</button>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem'
            }}>
                {players.filter(p => String(p.id) !== String(user.id)).map(player => (
                    <div key={player.id} className="match-card animate-fade-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
                        <div style={{ width: '100px', height: '100px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                            <img src={player.imagenJugador || player.image} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>{player.nombre || player.name}</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{player.posicion || player.position}</p>
                        </div>
                        <button
                            className="btn-primary"
                            style={{
                                marginTop: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: voting ? 0.7 : 1,
                                cursor: voting ? 'not-allowed' : 'pointer'
                            }}
                            onClick={() => handleVote(player.id)}
                            disabled={voting}
                        >
                            {voting ? <Loader2 className="animate-spin" size={18} /> : 'VOTAR JUGADOR'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Votar;
