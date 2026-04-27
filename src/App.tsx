import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Nav } from './components/layout/Nav';
import { TweaksPanel } from './components/layout/TweaksPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Landing } from './components/screens/Landing';
import { Onboarding } from './components/screens/Onboarding';
import { Results } from './components/screens/Results';
import { Detail } from './components/screens/Detail';
import { Compare } from './components/screens/Compare';
import { MapFull } from './components/screens/MapFull';
import { NotFound } from './components/screens/NotFound';
import './styles/index.css';

function AppShell() {
  return (
    <div className="shell">
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <header role="banner">
        <Nav />
      </header>
      <main id="main-content">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/perfil" element={<Onboarding />} />
            <Route path="/resultados" element={<Results />} />
            <Route path="/detalle/:slug" element={<Detail />} />
            <Route path="/comparar" element={<Compare />} />
            <Route path="/mapa" element={<MapFull />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <TweaksPanel />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}
