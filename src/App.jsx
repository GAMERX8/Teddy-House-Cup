import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TeamGrid from './components/TeamGrid';
import MatchCenter from './components/MatchCenter';

// Import new pages
import Equipos from './pages/Equipos';
import Jugadores from './pages/Jugadores';
import Partidos from './pages/Partidos';
import Clasificacion from './pages/Clasificacion';
import Estadisticas from './pages/Estadisticas';
import Torneo from './pages/Torneo';
import Totm from './pages/Totm';
import Votar from './pages/Votar';

import WinnerPopup from './components/WinnerPopup';
import VotingTimer from './components/VotingTimer';

// Wrapper for the Home page content
const Home = () => (
  <>
    <Hero />
    <TeamGrid />
    <MatchCenter />
  </>
);



function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <VotingTimer />
        <WinnerPopup />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/jugadores" element={<Jugadores />} />
          <Route path="/partidos" element={<Partidos />} />
          <Route path="/clasificacion" element={<Clasificacion />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/torneo" element={<Torneo />} />
          <Route path="/totm" element={<Totm />} />
          <Route path="/votar" element={<Votar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
