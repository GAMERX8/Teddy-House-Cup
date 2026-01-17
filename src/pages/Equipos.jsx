import React, { useEffect, useState } from 'react';
import { subscribeToTeams, subscribeToPlayers } from '../services/dataService';
import TeamCard from '../components/TeamCard';
import '../index.css';

const Equipos = () => {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Standardize player data for consistency
    const standardizePlayer = (p) => {
        return {
            ...p,
            nombre: p.nombre || p.name || 'Desconocido',
            posicion: (p.posicion || p.position || 'JUG').toUpperCase().trim(),
            ovr: p.ovr || p.rating || p.media || '0',
            equipoRef: String(p.equipo || p.teamId || p.team || '').toLowerCase().trim()
        };
    };

    useEffect(() => {
        let teamsLoaded = false;
        let playersLoaded = false;

        const unsubscribeTeams = subscribeToTeams((teamData) => {
            setTeams(teamData);
            teamsLoaded = true;
            if (playersLoaded) setLoading(false);
        });

        const unsubscribePlayers = subscribeToPlayers((playerData) => {
            setPlayers(playerData.map(standardizePlayer));
            playersLoaded = true;
            if (teamsLoaded) setLoading(false);
        });

        return () => {
            if (unsubscribeTeams) unsubscribeTeams();
            if (unsubscribePlayers) unsubscribePlayers();
        };
    }, []);

    // Helper to get players for a specific team
    const getTeamPlayers = (teamId, teamName) => {
        const tid = String(teamId || '').toLowerCase().trim();
        const tName = String(teamName || '').toLowerCase();

        const isTeamFantasmas = tName.includes('fantasma') || tid.includes('fantasma');
        const isTeamColoquios = tName.includes('coloquio') || tid.includes('coloquio');

        const explicitFantasmasPart = '1m2n9q';
        const explicitColoquiosPart = '71x3ry';

        const filtered = players.filter(p => {
            const pRef = p.equipoRef;

            // 1. Exact or partial ID matches
            const matchId = (pRef === tid || pRef.includes(tid) || tid.includes(pRef));
            if (matchId) return true;

            // 2. Hardcoded partial ID matches from Firestore
            if (isTeamFantasmas && pRef.includes(explicitFantasmasPart)) return true;
            if (isTeamColoquios && pRef.includes(explicitColoquiosPart)) return true;

            // 3. Name based match in the reference
            if (isTeamFantasmas && pRef.includes('fantasma')) return true;
            if (isTeamColoquios && pRef.includes('coloquio')) return true;

            return false;
        });

        return filtered;
    };

    if (loading) {
        return (
            <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="section-title">Cargando datos...</div>
            </div>
        );
    }

    return (
        <div className="container page-container">
            <h1 className="section-title animate-fade-in">Plantillas</h1>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                    marginTop: '2rem'
                }}
            >
                {teams.map((team, index) => {
                    const effectiveName = team.name || team.nombre || team.id || '';
                    const teamPlayers = getTeamPlayers(team.id, effectiveName);
                    return <TeamCard key={team.id} team={team} players={teamPlayers} index={index} />;
                })}
            </div>
        </div>
    );
};

export default Equipos;
