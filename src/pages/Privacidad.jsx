import React, { useEffect } from 'react';
import '../index.css';

const Privacidad = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container page-container">
            <h1 className="section-title animate-fade-in" style={{ fontSize: '3rem', textAlign: 'center' }}>Política de Privacidad</h1>
            
            <div className="glass-card animate-fade-up" style={{ padding: '2rem', marginTop: '2rem', animationDelay: '0.1s' }}>
                <p style={{ color: 'var(--color-text-dim)', marginBottom: '2rem' }}>
                    <strong>Última actualización:</strong> 2 de junio de 2026
                </p>
                
                <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Esta Política de Privacidad describe cómo la aplicación web <strong>TH Cards</strong> (en adelante, "la Aplicación") recopila, utiliza y protege la información de los usuarios que participan en el torneo de fútbol amateur <strong>TH Cup (Teddy House Cup)</strong>.
                </p>

                <h2 style={{ color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.8rem' }}>1. Información que recopilamos</h2>
                <p style={{ marginBottom: '1rem' }}>La Aplicación recopila información limitada estrictamente necesaria para el funcionamiento de las estadísticas del torneo:</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', lineHeight: '1.8' }}>
                    <li><strong>Datos de perfil del jugador:</strong> Nombre, posición de juego, estadísticas de rendimiento deportivo (ritmo, tiro, pase, regate, defensa y físico) y el equipo asignado en el torneo. Estos datos son proporcionados previamente de manera interna por los organizadores del torneo.</li>
                    <li><strong>Código de Acceso:</strong> Un código único asignado de forma privada a cada jugador para acceder a su perfil personal dentro de la aplicación.</li>
                    <li><strong>Tokens de Notificación:</strong> Si otorgas el permiso correspondiente, recopilamos el token de notificaciones push de tu dispositivo para enviarte alertas sobre partidos, resultados y novedades del torneo.</li>
                </ul>

                <div style={{
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderLeft: '4px solid gold',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    margin: '2rem 0',
                    color: '#fff'
                }}>
                    <strong style={{ color: 'gold', display: 'block', marginBottom: '0.5rem' }}>Nota Importante sobre Pagos:</strong> 
                    La Aplicación no procesa transacciones financieras, no recopila números de tarjetas de crédito/débito ni información de cuentas bancarias. La sección de estado de pagos es meramente de carácter informativo e indica si la cuota de participación física del torneo ha sido registrada offline por la administración.
                </div>

                <h2 style={{ color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.8rem' }}>2. Uso de la información</h2>
                <p style={{ marginBottom: '1rem' }}>Utilizamos los datos recopilados exclusivamente para los siguientes propósitos:</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', lineHeight: '1.8' }}>
                    <li>Visualización personalizada de tu carta de jugador y estadísticas del equipo.</li>
                    <li>Cálculo de rankings y participación en el sistema cerrado de votaciones MVP de cada jornada.</li>
                    <li>Envío de alertas de notificaciones push con resultados de partidos y eventos del torneo.</li>
                </ul>

                <h2 style={{ color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.8rem' }}>3. Compartición de datos</h2>
                <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
                    No vendemos, alquilamos ni compartimos tus datos personales con terceros para fines comerciales o publicitarios. Los datos de rendimiento deportivo y nombres son visibles únicamente para los demás participantes del torneo dentro de los rankings y plantillas de la aplicación.
                </p>

                <h2 style={{ color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.8rem' }}>4. Seguridad y almacenamiento</h2>
                <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
                    La información se almacena de forma segura en los servidores de Google Firebase. Implementamos medidas de seguridad técnicas para proteger tu información contra accesos no autorizados, pérdidas o alteraciones.
                </p>

                <h2 style={{ color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.8rem' }}>5. Tus derechos (Acceso y Eliminación)</h2>
                <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
                    Dado que los perfiles son creados administrativamente para el desarrollo del torneo deportivo, puedes solicitar la corrección de tus datos de jugador, la desactivación de tu acceso o la eliminación completa de tus datos de perfil en cualquier momento enviando una solicitud por correo electrónico a la administración del torneo (detallada en la sección de contacto).
                </p>

                <h2 style={{ color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.8rem' }}>6. Cambios en esta política</h2>
                <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
                    Podemos actualizar esta política ocasionalmente para reflejar cambios operativos o legales. Te recomendamos revisar esta página periódicamente.
                </p>

                <h2 style={{ color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.8rem' }}>7. Contacto</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    Si tienes preguntas o deseas solicitar la eliminación de tus datos, puedes ponerte en contacto con nosotros a través del correo de soporte del torneo:
                </p>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    📧 <strong>carlosmezbu@gmail.com</strong>
                </p>

            </div>
        </div>
    );
};

export default Privacidad;
