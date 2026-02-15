import React, { useState, useEffect } from 'react';
import { subscribeToMatches, subscribeToTeams } from '../services/dataService';
import CalendarPopup from '../components/CalendarPopup';
import '../index.css';

const Partidos = () => {
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [showCalendarPopup, setShowCalendarPopup] = useState(false);
    const [selectedMatchForCalendar, setSelectedMatchForCalendar] = useState(null);

    const getSeasonFromDate = (dateStr) => {
        if (!dateStr) return 'Desconocida';
        const parts = dateStr.split('-');
        const date = parts.length === 3
            ? new Date(parts[0], parts[1] - 1, parts[2])
            : new Date(dateStr);

        if (isNaN(date)) return 'Desconocida';
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-indexed
        return month < 6 ? `${year - 1}/${year.toString().slice(-2)}` : `${year}/${(year + 1).toString().slice(-2)}`;
    };

    useEffect(() => {
        const unsubscribeTeams = subscribeToTeams(setTeams);
        const unsubscribeMatches = subscribeToMatches((data) => {
            const sortedMatches = [...data].sort((a, b) => {
                const dateA = new Date(`${a.date || '2024-01-01'}T${a.time || '00:00'}`);
                const dateB = new Date(`${b.date || '2024-01-01'}T${b.time || '00:00'}`);
                return dateA - dateB;
            });
            setMatches(sortedMatches);

            if (sortedMatches.length > 0) {
                const seasons = Array.from(new Set(sortedMatches.map(m => getSeasonFromDate(m.date))));
                seasons.sort().reverse();
                setSelectedSeason(seasons[0]);
            }

            setLoading(false);
        });

        return () => {
            unsubscribeTeams && unsubscribeTeams();
            unsubscribeMatches && unsubscribeMatches();
        };
    }, []);

    const getTeam = (id) => teams.find(t => t.id === id || t.name === id);

    const availableSeasons = Array.from(new Set(matches.map(m => getSeasonFromDate(m.date)))).sort().reverse();
    const filteredMatches = matches.filter(m => getSeasonFromDate(m.date) === selectedSeason);

    if (loading) {
        return (
            <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="section-title">Cargando calendario...</div>
            </div>
        );
    }

    return (
        <div className="container page-container">
            {/* Header / Actions Barra */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1.5rem'
            }}>
                <h1 className="section-title" style={{ margin: 0 }}>CALENDARIO</h1>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        onClick={() => {
                            const nextMatch = filteredMatches.find(m => m.status === 'Upcoming') || filteredMatches[0];
                            setSelectedMatchForCalendar(nextMatch);
                            setShowCalendarPopup(true);
                        }}
                        style={{
                            background: '#fbbd08',
                            color: '#000',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.9rem',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Exportar
                    </button>

                    <div style={{ display: 'flex', gap: '2px' }}>
                        <div style={{
                            background: '#fbbd08',
                            color: '#000',
                            padding: '10px 20px',
                            borderRadius: '8px 0 0 8px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }}>
                            TH Cup
                        </div>
                        <select
                            value={selectedSeason}
                            onChange={(e) => setSelectedSeason(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                padding: '10px 20px',
                                borderRadius: '0 8px 8px 0',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                border: 'none',
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none',
                                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%223%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20/%3E%3C/svg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px center',
                                paddingRight: '35px'
                            }}
                        >
                            {availableSeasons.map(season => (
                                <option key={season} value={season} style={{ background: '#111' }}>{season}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Ronda Tab */}
            <div style={{ marginBottom: '2rem' }}>
                <span style={{
                    border: '1px solid #fbbd08',
                    color: '#fbbd08',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    Temporada Regular
                </span>
            </div>

            {/* Responsive Matches List */}
            <div className="matches-grid" style={{ display: 'grid', gap: '1rem' }}>
                {filteredMatches.map((match) => {
                    const teamA = getTeam(match.teamA);
                    const teamB = getTeam(match.teamB);

                    let formattedDate = match.date;
                    if (match.date && match.date.includes('-')) {
                        const [year, month, day] = match.date.split('-');
                        const dateObj = new Date(year, month - 1, day);
                        formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                    }

                    return (
                        <div key={match.id} className="glass-card animate-fade-up" style={{
                            padding: '1.25rem',
                            display: 'grid',
                            gridTemplateColumns: '80px 1fr 120px',
                            alignItems: 'center',
                            gap: '1rem',
                            borderLeft: match.status === 'Live' ? '4px solid #ff4444' : '4px solid rgba(255,255,255,0.1)'
                        }}>
                            {/* Date Column */}
                            <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '1rem' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{formattedDate}</div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>{match.time}</div>
                            </div>

                            {/* Versus Column */}
                            <div className="match-versus" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                    <span className="team-name" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: match.scoreA > match.scoreB ? '#fbbd08' : '#fff', textAlign: 'right' }}>
                                        {teamA?.name || match.teamA}
                                    </span>
                                    <span style={{ fontSize: '1.5rem' }}>{teamA?.logo || '⚽'}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: '4px' }}>
                                    <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff' }}>{match.scoreA ?? '-'}</span>
                                    <span style={{ color: '#444', fontWeight: 'bold', fontSize: '0.8rem' }}>VS</span>
                                    <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff' }}>{match.scoreB ?? '-'}</span>
                                </div>

                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{teamB?.logo || '⚽'}</span>
                                    <span className="team-name" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: match.scoreB > match.scoreA ? '#fbbd08' : '#fff' }}>
                                        {teamB?.name || match.teamB}
                                    </span>
                                </div>
                            </div>

                            {/* Status Column */}
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    background: match.status === 'Live' ? 'rgba(255,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                                    color: match.status === 'Live' ? '#ff4444' : '#666',
                                    border: match.status === 'Live' ? '1px solid #ff4444' : '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    {match.status === 'Live' ? '● En Vivo' : match.status === 'Finished' ? 'Finalizado' : 'Próximamente'}
                                </span>
                            </div>

                            {/* Mobile Styles (Internal via style tag for simplicity in this move) */}
                            <style>{`
                                @media (max-width: 768px) {
                                    .matches-grid > div {
                                        grid-template-columns: 1fr !important;
                                        text-align: center !important;
                                        gap: 1rem !important;
                                    }
                                    .matches-grid > div > div {
                                        border: none !important;
                                        padding: 0 !important;
                                        justify-content: center !important;
                                        text-align: center !important;
                                    }
                                    .team-name {
                                        font-size: 1.1rem !important;
                                    }
                                    .match-versus {
                                        flex-direction: row !important;
                                        width: 100%;
                                    }
                                }
                                @media (max-width: 480px) {
                                    .match-versus {
                                        flex-direction: column !important;
                                        gap: 0.5rem !important;
                                    }
                                    .match-versus > div {
                                        justify-content: center !important;
                                        width: 100%;
                                    }
                                }
                            `}</style>
                        </div>
                    );
                })}
                {filteredMatches.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#444' }}>
                        No hay partidos programados para esta temporada.
                    </div>
                )}
            </div>

            <CalendarPopup
                isOpen={showCalendarPopup}
                onClose={() => setShowCalendarPopup(false)}
                match={selectedMatchForCalendar}
            />
        </div>
    );
};

export default Partidos;
