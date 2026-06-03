import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            marginTop: '4rem',
            padding: '2rem 1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-dim)',
            fontSize: '0.9rem'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/privacidad" style={{ color: 'var(--color-text-dim)', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'}
                          onMouseOut={(e) => e.target.style.color = 'var(--color-text-dim)'}>
                        Política de Privacidad
                    </Link>
                </div>
                
                <div>
                    &copy; {new Date().getFullYear()} TH Cup. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
