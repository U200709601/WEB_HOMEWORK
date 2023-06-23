import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import MainLayout from './layouts/main';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Auth from './pages/Auth';
import NotFound from './pages/Page404';
import ProgrammableSms from './pages/app/ProgrammableSms';
import TwoFactorAuthentication from './pages/app/TwoFactorAuthentication';
import CampaignManagement from './pages/app/CampaignManagement';
import NumberMasking from './pages/app/NumberMasking';
import LogViewer from './pages/app/LogViewer';
import Profile from './pages/Profile';
import { useStore } from 'src/store/Store';
// ----------------------------------------------------------------------
import Accounts from './pages/admin/Accounts';
import SmsTariffs from './pages/admin/SmsTariffs';

export default function Router() {
  const [store, dispatch] = useStore();
  return useRoutes([
    {
      path: '/admin',
      element: store.token !== null ? <MainLayout /> : <Navigate to="/admin/login" />,
      children: [
        { path: "/admin", element: <Navigate to="/admin/profile" /> },
        { path: "/admin/profile", element: <Profile /> },
        { path: "/admin/engines", element: <Accounts /> },
        { path: "/admin/tariffs", element: <SmsTariffs /> },
      ]
    },
    {
      path: '/',
      element: store.token !== null ? <MainLayout /> : <Navigate to="/login" />,
      children: [
        { path: "/", element: <Navigate to="/campaign-management" /> },
        { path: "programmable-sms", element: <ProgrammableSms /> },
        { path: "two-factor-authentication", element: <TwoFactorAuthentication /> },
        { path: "campaign-management", element: <CampaignManagement /> },
        { path: "number-masking", element: <NumberMasking /> },
        { path: "log-viewer", element: <LogViewer /> },
        { path: "profile", element: <Profile /> },
      ]
    },
    {
      path: '/',
      element: store.token === null ? <LogoOnlyLayout /> : <Navigate to="/" />,
      children: [
        { path: 'login', element: <Auth type="login" /> },
        { path: 'admin/login', element: <Auth type="admin-login" /> },
        { path: 'register', element: <Auth type="register" /> },
        { path: '/', element: <Navigate to="/" /> },
      ]
    },
    { path: '*', element: <NotFound /> }
  ]);
}
