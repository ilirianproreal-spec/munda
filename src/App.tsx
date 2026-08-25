import { Route, Routes } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { LabScreen } from './screens/LabScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/lab" element={<LabScreen />} />
      <Route path="*" element={<HomeScreen />} />
    </Routes>
  );
}
