import React, { useState, useEffect } from 'react';
import { subscribeToSettings, subscribeToVotes, subscribeToPlayers } from '../services/dataService';
import { Clock, CheckCircle2 } from 'lucide-react';
import '../index.css';

const VotingTimer = () => {
    const [settings, setSettings] = useState({ mvpVoting: false });
    const [votes, setVotes] = useState([]);
    const [players, setPlayers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const unsubSettings = subscribeToSettings(setSettings);
        const unsubVotes = subscribeToVotes(setVotes);
        const unsubPlayers = subscribeToPlayers(setPlayers);
        return () => { unsubSettings(); unsubVotes(); unsubPlayers(); };
    }, []);

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!settings.mvpVoting || !settings.votingTimer?.endTime) {
                setTimeLeft(0);
                return;
            }
            const now = Date.now();
            const end = settings.votingTimer.endTime;
            const diff = end - now;
            setTimeLeft(Math.max(0, diff));
        };

        // Calculate immediately
        calculateTimeLeft();

        // Update every second
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [settings.mvpVoting, settings.votingTimer]);

    // Validation checks
    if (!settings.mvpVoting) return null;
    if (timeLeft <= 0) return null; // Time expired

    // Check completion
    const totalVotes = votes.length;
    const totalPlayers = players.length;

    // If we have accurate player count and votes match/exceed, hide timer (voting done)
    if (totalPlayers > 0 && totalVotes >= totalPlayers) return null;

    // Formatting time MM:SS
    // Formatting time
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    const pad = (n) => n.toString().padStart(2, '0');
    const formattedTime = days > 0
        ? `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
        : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    return (
        <div style={{
            position: 'fixed',
            top: '80px', // Below navbar
            left: 0,
            width: '100%',
            height: '40px',
            background: 'linear-gradient(90deg, #FFD700, #FFA500)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
            <div className="marquee-container" style={{
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                color: '#000',
                fontWeight: '900',
                fontSize: '1rem',
                fontFamily: 'var(--font-heading)',
                animation: 'marquee 15s linear infinite'
            }}>
                {/* Repeated content for smooth looping */}
                {[...Array(10)].map((_, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} fill="black" color="gold" />
                        <span>TIEMPO RESTANTE: {formattedTime}</span>
                        <span style={{ margin: '0 10px', opacity: 0.5 }}>|</span>
                        <span>VOTOS: {totalVotes}/{totalPlayers}</span>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(-20%); }
                    100% { transform: translateX(0); } /* Actually should go other way for "left to right" or "right to left"? User said "left to right". */
                }
                /* Wait, user asked for "left to right". Standard marquee is right-to-left. 
                   If "left to right", it starts off-screen left and moves right. */
            `}</style>
        </div>
    );
};

export default VotingTimer;
