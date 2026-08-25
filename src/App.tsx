import { Route, Routes } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { DesignLabScreen } from './screens/DesignLabScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/how" element={<TutorialScreen />} />
      <Route path="/lab" element={<DesignLabScreen />} />
      <Route path="*" element={<HomeScreen />} />
    </Routes>
  );
}
