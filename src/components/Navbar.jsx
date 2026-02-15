import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { subscribeToSettings, subscribeToPlayers, subscribeToTeams } from '../services/dataService';
import { Trophy, X, Calendar, Clock, Award } from 'lucide-react';
import './Navbar.css';
import apkFile from '../assets/TH Cards.apk';
import mvpCard from '../assets/MVP.png';
import thLogo from '../assets/TH LOGO.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [settings, setSettings] = useState({ mvpVoting: false });
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribeSettings = subscribeToSettings(setSettings);
    const unsubscribePlayers = subscribeToPlayers(setPlayers);
    const unsubscribeTeams = subscribeToTeams(setTeams);
    return () => {
      unsubscribeSettings();
      unsubscribePlayers();
      unsubscribeTeams();
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          TH <span>CUP</span>
        </Link>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <li><NavLink to="/equipos" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Equipos</NavLink></li>
          <li><NavLink to="/jugadores" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Jugadores</NavLink></li>
          <li><NavLink to="/partidos" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Partidos</NavLink></li>
          <li><NavLink to="/clasificacion" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Clasificación</NavLink></li>
          <li><NavLink to="/estadisticas" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Estadísticas</NavLink></li>
          <li><NavLink to="/torneo" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Torneo</NavLink></li>
          <li><NavLink to="/totm" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>TOTM</NavLink></li>

          <li className="navbar-mobile-actions">
            {settings.mvpVoting && (
              <button
                className="btn-action btn-mvp"
                onClick={() => {
                  navigate('/votar');
                  setIsOpen(false);
                }}
                style={{
                  background: 'linear-gradient(45deg, #ffd700, #ffa500)',
                  color: '#000',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '0.5rem'
                }}
              >
                <Trophy size={16} style={{ marginRight: '6px' }} />
                Votar MVP
              </button>
            )}

            <button className="btn-action btn-twitch" onClick={() => { setShowLiveModal(true); setIsOpen(false); }} style={{ width: '100%', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
              Directo
            </button>
            <button className="btn-action btn-tickets" onClick={() => { setShowAppModal(true); setIsOpen(false); }} style={{ width: '100%', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                <path d="M4 4v16h16V4H4zm14 14H6V6h12v12z" />
                <path d="M14.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              </svg>
              App Oficial
            </button>
          </li>
        </ul>

        <div className="navbar-actions">
          {settings.mvpVoting && (
            <button
              className="btn-action btn-mvp"
              onClick={() => {
                console.log("Navigating to /votar");
                navigate('/votar');
              }}
              style={{
                background: 'linear-gradient(45deg, #ffd700, #ffa500)',
                color: '#000',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Trophy size={16} style={{ marginRight: '6px' }} />
              <span className="btn-label">Votar MVP</span>
            </button>
          )}

          {!settings.mvpVoting && settings.winner && (
            <div
              className="btn-action btn-mvp-winner"
              onClick={() => setShowWinnerModal(true)}
              style={{
                background: 'rgba(251, 189, 8, 0.1)',
                border: '1px solid #fbbd08',
                color: '#fbbd08',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Trophy size={16} style={{ marginRight: '8px' }} />
              <span className="btn-label">MVP: {settings.winner.name || 'GANADOR'}</span>
            </div>
          )}
          <button className="btn-action btn-twitch" onClick={() => setShowLiveModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
            </svg>
            <span className="btn-label">Directo</span>
          </button>
          <button className="btn-action btn-tickets" onClick={() => setShowAppModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4v16h16V4H4zm14 14H6V6h12v12z" />
              <path d="M14.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            </svg>
            <span className="btn-label">App Oficial</span>
          </button>
        </div>
      </div>

      {/* Live Broadcast Modal */}
      {showLiveModal && (
        <div className="modal-overlay" onClick={() => setShowLiveModal(false)}>
          <div className="modal-panel twitch-modal" onClick={e => e.stopPropagation()}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(169, 112, 255, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              color: '#a970ff'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              color: '#fff',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Próximamente
            </h2>

            <p style={{
              color: '#aaa',
              lineHeight: '1.6',
              fontSize: '1.1rem',
              marginBottom: '2rem'
            }}>
              En estos momentos estamos trabajando duro para llegar a transmitir en vivo nuestros partidos. <br /><br />
              <span style={{ color: '#a970ff', fontWeight: 'bold' }}>¡Sé paciente, la emoción llegará muy pronto a tus pantallas!</span>
            </p>

            <button
              onClick={() => setShowLiveModal(false)}
              style={{
                background: '#a970ff',
                color: '#fff',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s, background 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = '#b78bff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#a970ff';
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Official App Modal */}
      {showAppModal && (
        <div className="modal-overlay" onClick={() => setShowAppModal(false)}>
          <div className="modal-panel app-modal" onClick={e => e.stopPropagation()}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(251, 189, 8, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              color: '#fbbd08'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4v16h16V4H4zm14 14H6V6h12v12z" />
                <path d="M14.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              </svg>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              color: '#fff',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              DESCARGA LA APP
            </h2>

            <p style={{
              color: '#aaa',
              lineHeight: '1.6',
              fontSize: '1.1rem',
              marginBottom: '2.5rem'
            }}>
              Lleva toda la emoción del torneo en tu bolsillo. Disponible para todas las plataformas.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a
                href={apkFile}
                download="TH_Cards.apk"
                style={{
                  background: '#fbbd08',
                  color: '#000',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'transform 0.2s, background 0.2s',
                  textTransform: 'uppercase',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.341c-.551 0-1 .449-1 1s.449 1 1 1 1-.449 1-1-.449-1-1-1zm-11.045 0c-.551 0-1 .449-1 1s.449 1 1 1 1-.449 1-1-.449-1-1-1zM21 16c0 1.654-1.346 3-3 3h-1.12l-1.01 2.27c-.201.451-.65.73-1.14.73s-.939-.279-1.14-.73l-1.01-2.27h-1.16l-1.01 2.27c-.201.451-.65.73-1.14.73s-.939-.279-1.14-.73L8.121 19H7c-1.654 0-3-1.346-3-3v-6c0-1.654 1.346-3 3-3h.465C7.818 5.86 8.571 5 9.5 5h5c.929 0 1.682.86 2.035 2H17c1.654 0 3 1.346 3 3v6zm-1-6c0-1.103-.897-2-2-2h-8c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-6zM12 2C9.239 2 7 4.239 7 7v1h10V7c0-2.761-2.239-5-5-5z" />
                </svg>
                Android (APK)
              </a>

              <button
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'transform 0.2s, background 0.2s',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79s-2 .77-3.27.82c-1.31.05-2.1-1.04-3.1-2.48-2.14-3.08-3.32-8.52-1.07-12.28a6.3 6.3 0 015.34-3.11c1.4-.04 2.13.79 3.25.79.87.01 2.12-.94 3.66-.78a6.1 6.1 0 014.65 2.5 5.92 5.92 0 00-3.14 5.41c.01 4.24 3.75 5.61 3.77 5.61-.03.11-.59 2.03-1.95 4.03l-.04.03zM15.35 1.5c-2.03.17-3.9 1.63-4.59 3.32-.21.52-.39 1.11-.47 1.72-.08.6-.01 1.28.2 2.05h.44c1.94-.05 3.9-1.57 4.47-3.32.74-2.15-.05-4-1.28-4c-.31 0-.6.05-.85.15l-.42.1h.5z" />
                </svg>
                iOS (Mantenimiento)
              </button>
            </div>

            <button
              onClick={() => setShowAppModal(false)}
              style={{
                background: '#ff4444',
                color: '#fff',
                border: 'none',
                marginTop: '2rem',
                padding: '10px 25px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                transition: 'background 0.2s, transform 0.2s',
                letterSpacing: '1px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#ff6666';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#ff4444';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Winner Modal (MVP Card Style) */}
      {showWinnerModal && settings.winner && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setShowWinnerModal(false)}
        >
          {(() => {
            const winnerId = settings.winner?.id;
            const player = players.find(p => String(p.id) === String(winnerId));

            if (!player) return (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
                <Trophy size={48} color="#fbbd08" style={{ marginBottom: '1rem' }} />
                <h2>MVP: {settings.winner.name}</h2>
                <p>Cargando detalles...</p>
              </div>
            );

            const playerImage = player.imagenJugador || player.image;
            const playerName = player.nombre || player.name || 'Unknown';
            const playerPosition = player.posicion || player.position || 'Jugador';
            const rating = player.ovr || player.rating || '-';

            // Robust Team Lookup
            const teamRef = String(player?.equipo || player?.teamId || '').trim();
            const tid = teamRef.toLowerCase();
            const team = teams.find(t =>
              String(t.id).trim() === teamRef ||
              String(t.id).toLowerCase().includes(tid) ||
              String(t.name || '').toLowerCase() === tid ||
              String(t.nombre || '').toLowerCase() === tid
            );
            const teamLogo = team?.logo || player.escudoEquipo;

            const stats = [
              { label: 'PAC', value: (player.stats || {}).pac || player.pac || '??' },
              { label: 'SHO', value: (player.stats || {}).sho || player.sho || '??' },
              { label: 'PAS', value: (player.stats || {}).pas || player.pas || '??' },
              { label: 'DRI', value: (player.stats || {}).dri || player.dri || '??' },
              { label: 'DEF', value: (player.stats || {}).def || player.def || '??' },
              { label: 'PHY', value: (player.stats || {}).phy || player.phy || '??' }
            ];

            // Flag logic from database or common names
            const getFlag = (p) => {
              if (p.bandera) return p.bandera;
              if (p.flag) return p.flag;
              if (p.nacionalidad) return p.nacionalidad;

              const name = (p.nombre || p.name || '').toLowerCase();
              if (name.includes('griezmann')) return 'https://flagcdn.com/w80/fr.png';
              if (name.includes('messi')) return 'https://flagcdn.com/w80/ar.png';
              if (name.includes('ronaldo')) return 'https://flagcdn.com/w80/pt.png';
              return 'https://flagcdn.com/w80/es.png';
            };

            return (
              <div className="mvp-winner-modal-content">
                <h2 className="mvp-congrats-title">
                  ¡Felicidades <span style={{ color: '#fbbd08' }}>{playerName}</span>!<br />
                  <span className="mvp-sub-title">Eres el MVP del año</span>
                </h2>

                <div
                  className="mvp-card-container"
                  style={{
                    backgroundImage: `url(${mvpCard})`
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Metallic Shine Effect */}
                  <div
                    className="card-shine"
                    style={{
                      WebkitMaskImage: `url(${mvpCard})`,
                      maskImage: `url(${mvpCard})`
                    }}
                  />

                  {/* Close Button */}
                  <button
                    onClick={() => setShowWinnerModal(false)}
                    style={{
                      position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                      background: 'rgba(0,0,0,0.3)', border: 'none', color: '#f9f4e4',
                      width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <X size={24} />
                  </button>

                  {/* Rating */}
                  <div className="playercard-rating">{rating}</div>

                  {/* Position */}
                  <div className="playercard-position">{playerPosition}</div>

                  {/* Player Image */}
                  <img src={playerImage} className="playercard-image" alt={playerName} />

                  {/* Player Name */}
                  <div className="playercard-name">{playerName}</div>

                  {/* Attributes Row */}
                  {stats.map((stat, idx) => (
                    <div key={stat.label} className={`playercard-attr playercard-attr${idx + 1}`}>
                      <span className="attr-val">{stat.value}</span>
                      <span className="attr-label">{stat.label}</span>
                    </div>
                  ))}

                  {/* Bottom Logos Row */}
                  <div className="playercard-bottom-logos">
                    <img src={getFlag(player)} className="playercard-flag" alt="Nationality" />
                    <img src={thLogo} className="playercard-league" alt="League" />
                    {teamLogo && <img src={teamLogo} className="playercard-team-logo" alt="Team" />}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </nav>
  );
};

export default Navbar;
