import { AppProvider, useApp } from './context/AppContext';
import { Nav } from './components/layout/Nav';
import { TweaksPanel } from './components/layout/TweaksPanel';
import { Landing } from './components/screens/Landing';
import { Onboarding } from './components/screens/Onboarding';
import { Results } from './components/screens/Results';
import { Detail } from './components/screens/Detail';
import { Compare } from './components/screens/Compare';
import { MapFull } from './components/screens/MapFull';
import './styles/index.css';

function AppShell() {
  const { screen } = useApp();

  return (
    <div className="shell">
      <Nav />
      {screen === 'landing'    && <Landing />}
      {screen === 'onboarding' && <Onboarding />}
      {screen === 'results'    && <Results />}
      {screen === 'detail'     && <Detail />}
      {screen === 'compare'    && <Compare />}
      {screen === 'map'        && <MapFull />}
      <TweaksPanel />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
