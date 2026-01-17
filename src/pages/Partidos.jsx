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
        // Season usually starts in July (6)
        return month < 6 ? `${year - 1}/${year.toString().slice(-2)}` : `${year}/${(year + 1).toString().slice(-2)}`;
    };

    useEffect(() => {
        const unsubscribeTeams = subscribeToTeams(setTeams);
        const unsubscribeMatches = subscribeToMatches((data) => {
            // Sort matches by date and time
            const sortedMatches = [...data].sort((a, b) => {
                const dateA = new Date(`${a.date || '2024-01-01'}T${a.time || '00:00'}`);
                const dateB = new Date(`${b.date || '2024-01-01'}T${b.time || '00:00'}`);
                return dateA - dateB;
            });
            setMatches(sortedMatches);

            // Set default selected season to the latest available one
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
                gap: '1rem'
            }}>
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
                        textTransform: 'none'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                        <line x1="12" y1="14" x2="12" y2="14.01"></line>
                    </svg>
                    Añadir al calendario
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

            {/* Ronda Tab */}
            <div style={{ marginBottom: '1.5rem' }}>
                <span style={{
                    border: '1px solid #fbbd08',
                    color: '#fbbd08',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    Temporada Regular
                </span>
            </div>

            {/* Matches Table */}
            <div className="glass-card animate-fade-up" style={{ padding: '0', overflowX: 'auto', background: 'rgba(255,255,255,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1.2rem', textAlign: 'left', color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Fecha</th>
                            <th style={{ padding: '1.2rem', textAlign: 'left', color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Horario</th>
                            <th style={{ padding: '1.2rem', textAlign: 'center', color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Partido</th>
                            <th style={{ padding: '1.2rem', textAlign: 'right', color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMatches.map((match) => {
                            const teamA = getTeam(match.teamA);
                            const teamB = getTeam(match.teamB);

                            // Format date avoiding timezone shift
                            let formattedDate = match.date;
                            if (match.date && match.date.includes('-')) {
                                const [year, month, day] = match.date.split('-');
                                const dateObj = new Date(year, month - 1, day);
                                formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
                            }

                            return (
                                <tr key={match.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
                                    <td style={{ padding: '1.5rem 1.2rem', color: '#fff', fontSize: '1rem' }}>
                                        {formattedDate}
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem', color: '#fff', fontSize: '1rem' }}>
                                        {match.time}
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                                            {/* Local */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end' }}>
                                                <span style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: '1.4rem',
                                                    color: '#fbbd08',
                                                    textAlign: 'right'
                                                }}>
                                                    {teamA?.name || match.teamA}
                                                </span>
                                                <span style={{ fontSize: '2rem' }}>{teamA?.logo || '⚽'}</span>
                                            </div>

                                            {/* Score */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                minWidth: '100px',
                                                justifyContent: 'center'
                                            }}>
                                                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff' }}>{match.scoreA ?? '-'}</span>
                                                <span style={{ color: '#444', fontWeight: 'bold' }}>vs</span>
                                                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff' }}>{match.scoreB ?? '-'}</span>
                                            </div>

                                            {/* Visitante */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-start' }}>
                                                <span style={{ fontSize: '2rem' }}>{teamB?.logo || '⚽'}</span>
                                                <span style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: '1.4rem',
                                                    color: '#fff',
                                                    textAlign: 'left'
                                                }}>
                                                    {teamB?.name || match.teamB}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1.2rem', textAlign: 'right', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                                        {match.status === 'Live' ? <span style={{ color: '#ff4444' }}>● En Vivo</span> :
                                            match.status === 'Finished' ? 'Finalizado' : 'Próximamente'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
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
