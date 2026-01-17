import React from 'react';
import coloquiosLogo from '../assets/Coloquios_FC.png';
import fantasmasLogo from '../assets/Fantasmas_FC.png';

const TeamCard = ({ team, players = [], totalInDb, index }) => {
    const teamName = team.name || team.id || 'Unknown Team';
    const isFantasmas = teamName.toLowerCase().includes('fantasma');
    const isColoquios = teamName.toLowerCase().includes('coloquio');

    let borderColor = 'rgba(255,255,255,0.1)';
    let titleColor = '#fff';
    let teamLogo = isFantasmas ? fantasmasLogo : (isColoquios ? coloquiosLogo : (team.logo || null));

    if (isFantasmas) {
        borderColor = '#f0f0f0';
        titleColor = '#fff'; // White title for Fantasmas
    } else if (isColoquios) {
        borderColor = 'gold';
        titleColor = 'gold'; // Gold title for Coloquios
    }

    // Direct mapping requested by user
    const getPositionGroup = (pos) => {
        const p = (pos || '').toUpperCase().trim();

        // Portero
        if (p === 'POR' || p.includes('PORTERO')) return 'PORTERÍA';

        // Defensa: LD, LI, CAI, CAD, DFC
        if (['LD', 'LI', 'CAI', 'CAD', 'DFC', 'DF', 'DFC'].includes(p) || p.includes('DEFENSA')) return 'DEFENSA';

        // Mediocentro: MCD, CM, MCO, MD, MI
        if (['MCD', 'CM', 'MC', 'MCO', 'MD', 'MI', 'MOC', 'RM', 'LM'].includes(p) || p.includes('MEDIO') || p.includes('VOLANTE')) return 'MEDIOCENTRO';

        // Delanteros: SD, DEL, EI, ED
        if (['SD', 'DEL', 'EI', 'ED', 'DC', 'EXT', 'DC'].includes(p) || p.includes('DELANTERO') || p.includes('EXTREMO')) return 'DELANTERA';

        return 'OTRO';
    };

    const groupedPlayers = {
        'PORTERÍA': [],
        'DEFENSA': [],
        'MEDIOCENTRO': [],
        'DELANTERA': []
    };

    players.forEach(player => {
        const group = getPositionGroup(player.posicion || player.position);
        if (groupedPlayers[group]) {
            groupedPlayers[group].push(player);
        }
    });

    const renderPlayerRow = (player) => (
        <div key={player.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.6rem 1rem',
            margin: '0.2rem 0',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '4px',
            fontSize: '0.9rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                    color: '#666',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    width: '35px',
                    textTransform: 'uppercase'
                }}>
                    {player.posicion || player.position || 'JUG'}
                </span>
                <span style={{ color: '#eee', fontWeight: '500' }}>
                    {player.nombre || player.name}
                    {player.isCaptain && <span style={{ marginLeft: '8px', padding: '1px 4px', background: 'gold', color: '#000', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold' }}>C</span>}
                </span>
            </div>
            <span style={{ color: 'gold', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
                {player.ovr || player.rating || '-'}
            </span>
        </div>
    );

    return (
        <div
            className="animate-fade-up"
            style={{
                animationDelay: `${index * 0.1}s`,
                background: '#0a0a0c',
                border: `2px solid ${borderColor}`,
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: isColoquios ? '0 0 30px rgba(255, 215, 0, 0.1)' : '0 0 30px rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '600px'
            }}
        >
            {/* Header with Logo and Name */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                {teamLogo && (
                    <img src={teamLogo} alt={teamName} style={{ width: '90px', height: '90px', objectFit: 'contain', marginBottom: '1rem' }} />
                )}
                <h3 style={{
                    color: titleColor,
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.8rem',
                    textTransform: 'uppercase',
                    margin: 0,
                    letterSpacing: '2px',
                    textAlign: 'center'
                }}>
                    {teamName}
                </h3>
            </div>

            {/* List Sections */}
            <div style={{ flex: 1 }}>
                {['PORTERÍA', 'DEFENSA', 'MEDIOCENTRO', 'DELANTERA'].map(group => {
                    const groupPlayers = groupedPlayers[group];
                    if (!groupPlayers || groupPlayers.length === 0) return null;

                    return (
                        <div key={group} style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{
                                fontSize: '0.75rem',
                                color: '#444',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '0.5rem',
                                paddingLeft: '0.3rem',
                                borderLeft: `2px solid ${borderColor}`
                            }}>
                                {group}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {groupPlayers.sort((a, b) => (b.ovr || 0) - (a.ovr || 0)).map(renderPlayerRow)}
                            </div>
                        </div>
                    );
                })}

                {players.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#333', fontStyle: 'italic', fontSize: '0.9rem' }}>
                        Sin jugadores registrados
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamCard;
