import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DisclaimerBanner from './components/ui/DisclaimerBanner';
import CookieBanner from './components/ui/CookieBanner';
import ChatWidget from './components/chat/ChatWidget';
import HomePage from './pages/HomePage';
import FranchiseOptimizerPage from './pages/FranchiseOptimizerPage';
import VergleichPage from './pages/VergleichPage';
import FamiliePage from './pages/FamiliePage';
import GrenzgaengerPage from './pages/GrenzgaengerPage';
import BenefitCheckPage from './pages/BenefitCheckPage';
import FAQPage from './pages/FAQPage';
import ImpressumPage from './pages/ImpressumPage';
import DatenschutzPage from './pages/DatenschutzPage';
import DisclaimerPage from './pages/DisclaimerPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEmails from './pages/admin/AdminEmails';
import AdminData from './pages/admin/AdminData';
import AdminLogs from './pages/admin/AdminLogs';

function RequireAdmin({ children }) {
  const loggedIn = typeof localStorage !== 'undefined' && localStorage.getItem('admin_logged_in');
  if (!loggedIn) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <DisclaimerBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/franchise" element={<FranchiseOptimizerPage />} />
        <Route path="/vergleich" element={<VergleichPage />} />
        <Route path="/familie" element={<FamiliePage />} />
        <Route path="/grenzgaenger" element={<GrenzgaengerPage />} />
        <Route path="/leistungs-check" element={<BenefitCheckPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/datenschutz" element={<DatenschutzPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="emails" element={<AdminEmails />} />
          <Route path="data" element={<AdminData />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieBanner />
      <ChatWidget />
    </BrowserRouter>
  );
}
