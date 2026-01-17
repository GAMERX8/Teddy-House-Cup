import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import logo from '../assets/TH LOGO.png';

const CalendarPopup = ({ isOpen, onClose, match }) => {
    if (!isOpen) return null;

    const generateCalendarURLs = () => {
        if (!match) return {};

        const title = `Partido: ${match.teamA} vs ${match.teamB}`;
        const description = `Temporada: ${match.season || 'TH Cup'}. ¡No te pierdas el partido en vivo!`;
        const location = 'Tournament Stadium'; // Or actual location if available

        // Date parsing (safe local parsing)
        const [y, m, d] = match.date.split('-').map(Number);
        const [hh, mm] = (match.time || '20:00').split(':').map(Number);

        const startDate = new Date(y, m - 1, d, hh, mm);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // +2 hours

        const formatUTC = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');

        // Google Calendar URL
        const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatUTC(startDate)}/${formatUTC(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

        // Outlook Web URL
        const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

        // ICS File Data
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${formatUTC(startDate)}`,
            `DTEND:${formatUTC(endDate)}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description}`,
            `LOCATION:${location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');
        const icsUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

        return { googleUrl, outlookUrl, icsUrl };
    };

    const urls = generateCalendarURLs();

    const calendarOptions = [
        {
            name: 'Google',
            url: urls.googleUrl,
            icon: (
                <svg viewBox="0 0 48 48" width="45" height="45">
                    <rect x="4" y="4" width="40" height="40" rx="4" fill="#4285F4" />
                    <rect x="8" y="14" width="32" height="26" rx="2" fill="#FFFFFF" />
                    <text x="24" y="34" fill="#4285F4" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">31</text>
                    <rect x="12" y="8" width="6" height="4" rx="1" fill="#FFFFFF" />
                    <rect x="30" y="8" width="6" height="4" rx="1" fill="#FFFFFF" />
                </svg>
            )
        },
        {
            name: 'Outlook.com (Web)',
            url: urls.outlookUrl,
            icon: (
                <svg viewBox="0 0 24 24" width="45" height="45">
                    <path fill="#0078D4" d="M1 5.5v13L11.5 23V1L1 5.5z" />
                    <path fill="#2B88D8" d="M23 5.5v13L11.5 18.5v-13L23 5.5z" />
                    <path fill="#fff" d="M6 14.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm0-4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                </svg>
            )
        }
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            backdropFilter: 'blur(5px)'
        }} onClick={onClose}>
            <div style={{
                background: '#fff',
                width: '100%',
                maxWidth: '550px',
                borderRadius: '32px',
                position: 'relative',
                overflow: 'hidden',
                animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }} onClick={e => e.stopPropagation()}>

                {/* Header Actions */}
                <div style={{
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    zIndex: 10
                }}>
                    <button onClick={onClose} style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: 'none',
                        color: '#fff',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ArrowLeft size={20} />
                    </button>
                </div>
                <div style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    zIndex: 10
                }}>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: '#fff',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Top Black Section */}
                <div style={{
                    background: '#000',
                    padding: '60px 20px 40px',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: '#000',
                        border: '2px solid #fbbd08',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(251, 189, 8, 0.3)',
                        bottom: '-60px',
                        position: 'absolute'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8%'
                        }}>
                            <img
                                src={logo}
                                alt="TH Cup Logo"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ padding: '80px 40px 40px', textAlign: 'center' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2.2rem',
                        color: '#111',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        fontWeight: '900',
                        letterSpacing: '-1px'
                    }}>
                        ELIGE TU CALENDARIO
                    </h1>

                    <p style={{
                        color: '#555',
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                        marginBottom: '32px',
                        maxWidth: '450px',
                        margin: '0 auto 32px'
                    }}>
                        Acepto las <a href="#" style={{ color: '#0078D4', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1.5px solid #0078D4' }}>Condiciones de uso</a> y la <a href="#" style={{ color: '#0078D4', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1.5px solid #0078D4' }}>Política de privacidad</a>.
                    </p>

                    <div style={{ height: '1.5px', background: '#eee', width: '80%', margin: '0 auto 40px' }}></div>

                    {/* Grid of Options */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '40px',
                        maxWidth: '320px',
                        margin: '0 auto 48px'
                    }}>
                        {calendarOptions.map((opt, idx) => (
                            <a
                                key={idx}
                                href={opt.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={opt.download}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                                className="calendar-option"
                                onClick={onClose}
                            >
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    borderRadius: '24px',
                                    border: '1px solid #f0f0f0',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: '#fff',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.04)',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                }} className="icon-container">
                                    {opt.icon}
                                </div>
                                <span style={{
                                    color: '#000',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    lineHeight: '1.2'
                                }}>
                                    {opt.name}
                                </span>
                            </a>
                        ))}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Powered by</span>
                            <div style={{ display: 'flex', flexDirection: 'column', height: '14px', justifyContent: 'space-between' }}>

                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#0078D4', letterSpacing: '1px' }}>MEZZO Tuproxito</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .calendar-option:hover .icon-container {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                    border-color: #fbbd08;
                }
                .calendar-option:hover span {
                    color: #0078D4;
                }
            `}</style>
        </div>
    );
};

export default CalendarPopup;
