import React, { useState, useEffect } from 'react';
import { subscribeToPlayers } from '../services/dataService';
import '../index.css';

const Clasificacion = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToPlayers((data) => {
            // Sort by copasGanadas (descending), then matches (ascending)
            const sortedPlayers = [...data].sort((a, b) => {
                const copasA = parseInt(a.copasGanadas || 0);
                const copasB = parseInt(b.copasGanadas || 0);
                if (copasB !== copasA) return copasB - copasA;

                const matchesA = parseInt(a.partidos || a.matches || 0);
                const matchesB = parseInt(b.partidos || b.matches || 0);
                return matchesA - matchesB;
            });
            setPlayers(sortedPlayers);
            setLoading(false);
        });

        return () => unsubscribe && unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="section-title">Cargando clasificación...</div>
            </div>
        );
    }

    return (
        <div className="container page-container">
            <h1 className="section-title animate-fade-in">Muro de Campeones</h1>

            <div
                className="glass-card animate-fade-up"
                style={{ marginTop: '2rem', padding: '1.5rem', overflowX: 'auto', background: 'rgba(0,0,0,0.4)' }}
            >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '1.2rem', textAlign: 'center', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Pos</th>
                            <th style={{ padding: '1.2rem', textAlign: 'left', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Jugador</th>
                            <th style={{ padding: '1.2rem', textAlign: 'center', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Partidos</th>
                            <th style={{ padding: '1.2rem', textAlign: 'center', color: '#fbbd08', textTransform: 'uppercase', fontSize: '0.8rem' }}>Copas Ganadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player, index) => {
                            const copasCount = parseInt(player.copasGanadas || 0);
                            const matches = parseInt(player.partidos || player.matches || 0);

                            return (
                                <tr key={player.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                                        <span style={{
                                            fontWeight: '900',
                                            fontSize: '1.1rem',
                                            color: index === 0 ? '#fbbd08' : (index === 1 ? '#c0c0c0' : (index === 2 ? '#cd7f32' : '#555'))
                                        }}>
                                            #{index + 1}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem', textAlign: 'left' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {player.foto && (
                                                <img
                                                    src={player.foto}
                                                    alt={player.nombre}
                                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                                                />
                                            )}
                                            <div>
                                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', letterSpacing: '0.5px' }}>
                                                    {(player.nombre || player.name || 'Unknown').toUpperCase()}
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>
                                                    {player.posicion || player.position || 'Jugador'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#aaa' }}>
                                        {matches}
                                    </td>
                                    <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                            {copasCount > 0 ? (
                                                Array.from({ length: copasCount }).map((_, i) => (
                                                    <span key={i} title="Copa Ganada" style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 5px rgba(251, 189, 8, 0.5))' }}>🏆</span>
                                                ))
                                            ) : (
                                                <span style={{ color: '#333', fontSize: '1.5rem' }}>-</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {players.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#444', fontStyle: 'italic' }}>
                        No hay datos de jugadores registrados.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clasificacion;
