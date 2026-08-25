import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { DesignLabScreen } from './screens/DesignLabScreen';
import { BootSplash } from './components/layout/BootSplash';

export default function App() {
  const [boot, setBoot] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setBoot(false), 1500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>{boot && <BootSplash />}</AnimatePresence>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/how" element={<TutorialScreen />} />
        <Route path="/lab" element={<DesignLabScreen />} />
        <Route path="*" element={<HomeScreen />} />
      </Routes>
    </>
  );
}
