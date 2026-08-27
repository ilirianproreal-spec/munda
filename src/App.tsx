import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CompanyPage from './pages/CompanyPage';
import { DesignLabScreen } from './screens/DesignLabScreen';
import { PremiumLabScreen } from './screens/PremiumLabScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/company" element={<CompanyPage />} />
      <Route path="/light-lab" element={<Navigate to="/light-lab/premium" replace />} />
      <Route path="/light-lab/how" element={<Navigate to="/light-lab/lab" replace />} />
      <Route path="/light-lab/lab" element={<DesignLabScreen />} />
      <Route path="/light-lab/premium" element={<PremiumLabScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
