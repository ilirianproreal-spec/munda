import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import LightLabEntry from './screens/LightLabEntry';
import { TutorialScreen } from './screens/TutorialScreen';
import { DesignLabScreen } from './screens/DesignLabScreen';
import { BootSplash } from './components/layout/BootSplash';

export default function App() {
  const location = useLocation();
  const isGame = location.pathname.startsWith('/light-lab');
  const [boot, setBoot] = useState(isGame);

  useEffect(() => {
    if (!boot) return;
    const t = window.setTimeout(() => setBoot(false), 1500);
    return () => window.clearTimeout(t);
  }, [boot]);

  return (
    <>
      <AnimatePresence>{boot && <BootSplash />}</AnimatePresence>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/light-lab" element={<LightLabEntry />} />
        <Route path="/light-lab/how" element={<TutorialScreen />} />
        <Route path="/light-lab/lab" element={<DesignLabScreen />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}
