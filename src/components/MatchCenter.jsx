import React from 'react';
import './MatchCenter.css';

const matches = [
    { id: 1, day: 'EDI 1', time: 'Final', teamA: 'FFC', scoreA: 10, teamB: 'CFC', scoreB: 7, type: 'past' },
    { id: 2, day: 'EDI 2', time: 'Final', teamA: 'CFC', scoreA: 14, teamB: 'FFC', scoreB: 7, type: 'past' }, // Penaltis implied
    { id: 3, day: 'EDI 3', time: 'Final', teamA: 'FFC', scoreA: 7, teamB: 'CFC', scoreB: 8, type: 'past' },
];

const MatchCenter = () => {
    return (
        <section className="match-center">
            <h2 className="section-title">CALENDARIO</h2>

            <div className="match-list">
                {matches.map((match) => (
                    <div key={match.id} className={`match-card ${match.type}`}>
                        <div className="match-date-col">
                            <span className="match-day">{match.day}</span>
                            <span className="match-time">{match.time}</span>
                        </div>

                        <div className="match-result">
                            <span className="team-short">{match.teamA}</span>
                            <span className={`score ${match.scoreA > match.scoreB ? 'winner' : ''}`}>{match.scoreA}</span>
                            <span>-</span>
                            <span className={`score ${match.scoreB > match.scoreA ? 'winner' : ''}`}>{match.scoreB}</span>
                            <span className="team-short">{match.teamB}</span>
                        </div>

                        <div className="match-status-col">
                            <span className="status-badge">
                                {match.type === 'upcoming' ? 'EN VIVO SOON' : 'FINALIZADO'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MatchCenter;
