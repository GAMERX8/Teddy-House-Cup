export const teams = [
    {
        id: 1,
        name: 'Fantasmas FC',
        shortName: 'FNT',
        logo: '👻', // Replace with URL if available
        color: '#6e44ff',
        president: 'DjMaRiiO',
        record: '4-1-2'
    },
    {
        id: 2,
        name: 'Coloquios FC',
        shortName: 'CLQ',
        logo: '💀',
        color: '#ff4444',
        president: 'TheGrefg',
        record: '3-2-2'
    },
    {
        id: 3,
        name: 'Saiyans FC',
        shortName: 'SAI',
        logo: '🐉',
        color: '#ff9900',
        president: 'TheGrefg',
        record: '5-0-2'
    },
    {
        id: 4,
        name: 'Porcinos FC',
        shortName: 'POR',
        logo: '🐷',
        color: '#ff69b4',
        president: 'Ibai',
        record: '6-0-1'
    },
    {
        id: 5,
        name: 'Ultimate Móstoles',
        shortName: 'ULT',
        logo: '🦁',
        color: '#1a1a1a',
        president: 'DjMaRiiO',
        record: '2-5-0'
    },
    {
        id: 6,
        name: 'Rayo de Barcelona',
        shortName: 'RDB',
        logo: '⚡',
        color: '#ffd700',
        president: 'Spursito',
        record: '1-6-0'
    }
];

export const players = [
    { id: 1, name: 'Fran Hernández', teamId: 1, position: 'Medio', goals: 12, assists: 5, matches: 8, yellowCards: 1, redCards: 0, rating: 92, image: 'https://kingsleague.pro/wp-content/uploads/2024/01/FRAN-HERNANDEZ.png', uniqueCode: 'FRAN123' },
    { id: 2, name: 'Ubón', teamId: 2, position: 'Delantero', goals: 10, assists: 2, matches: 7, yellowCards: 0, redCards: 0, rating: 88, image: 'https://kingsleague.pro/wp-content/uploads/2024/01/UBON.png', uniqueCode: 'UBON456' },
    { id: 3, name: 'Verdú', teamId: 3, position: 'Delantero', goals: 9, assists: 7, matches: 8, yellowCards: 2, redCards: 0, rating: 89, image: 'https://kingsleague.pro/wp-content/uploads/2024/01/VERDU.png', uniqueCode: 'VERDU789' },
    { id: 4, name: 'Cichero', teamId: 4, position: 'Defensa', goals: 3, assists: 1, matches: 8, yellowCards: 3, redCards: 0, rating: 85, image: 'https://kingsleague.pro/wp-content/uploads/2024/01/CICHERO.png' },
    { id: 5, name: 'Espinosa', teamId: 4, position: 'Medio', goals: 5, assists: 8, matches: 8, yellowCards: 1, redCards: 0, rating: 90, image: 'https://kingsleague.pro/wp-content/uploads/2024/01/ESPINOSA.png' },
    { id: 6, name: 'Joan Inés', teamId: 1, position: 'Medio', goals: 4, assists: 4, matches: 6, yellowCards: 0, redCards: 0, rating: 84, image: 'https://kingsleague.pro/wp-content/uploads/2024/01/JOAN-INES.png' },
];

export const matches = [
    { id: 1, teamA: 1, teamB: 2, time: '16:00', status: 'Finished', scoreA: 3, scoreB: 4, date: '2024-05-12' },
    { id: 2, teamA: 3, teamB: 4, time: '17:00', status: 'Live', scoreA: 2, scoreB: 2, date: '2024-05-12' },
    { id: 3, teamA: 5, teamB: 6, time: '18:00', status: 'Upcoming', scoreA: 0, scoreB: 0, date: '2024-05-12' },
];

export const standings = [
    { rank: 1, teamId: 4, pts: 18, w: 6, l: 1, gf: 24, ga: 10, diff: 14 },
    { rank: 2, teamId: 3, pts: 15, w: 5, l: 2, gf: 20, ga: 12, diff: 8 },
    { rank: 3, teamId: 1, pts: 14, w: 4, l: 2, gf: 18, ga: 15, diff: 3 },
    { rank: 4, teamId: 2, pts: 11, w: 3, l: 2, gf: 15, ga: 16, diff: -1 },
    { rank: 5, teamId: 5, pts: 6, w: 2, l: 5, gf: 10, ga: 20, diff: -10 },
    { rank: 6, teamId: 6, pts: 3, w: 1, l: 6, gf: 8, ga: 22, diff: -14 },
];
