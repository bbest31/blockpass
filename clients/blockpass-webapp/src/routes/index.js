import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import AttendeeAuthGuard from '../guards/AttendeeAuthGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen isDashboard />}>
    <Component {...props} />
  </Suspense>
);

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
      ],
    },

    // Marketplace Routes
    {
      path: '/',
      element: <MainLayout />,
      children: [{ element: <Home />, index: true }],
    },
    {
      path: '/event/:eventId',
      element: <MainLayout />,
      children: [{ element: <EventPreview />, index: true }],
    },
    {
      path: '/tickets',
      element: <MainLayout />,
      children: [
        {
          element: (
            <AttendeeAuthGuard>
              <MyTickets />
            </AttendeeAuthGuard>
          ),
          index: true,
        },
      ],
    },
    {
      path: '/tickets/:ticketTierId/token/:token',
      element: <MainLayout />,
      children: [
        {
          element: (
            <AttendeeAuthGuard>
              <MyTicketDetail />
            </AttendeeAuthGuard>
          ),
          index: true,
        },
      ],
    },
    // Event Organizer Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'dashboard', element: <div>Dashboard</div> },
        { path: 'events', element: <Events /> },
        { path: 'account', element: <UserAccount /> },
        { path: 'token-gating', element: <TokenGating /> },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// MARKETPLACE
const Home = Loadable(lazy(() => import('../pages/Home')));
const EventPreview = Loadable(lazy(() => import('../pages/EventPreview')));
const MyTickets = Loadable(lazy(() => import('../pages/MyTickets')));
const MyTicketDetail = Loadable(lazy(() => import('../pages/MyTicketDetail')));

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));

// USER
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));

// EVENTS
const Events = Loadable(lazy(() => import('../pages/dashboard/OrganizationEvents')));

// SUPPORT
const TokenGating = Loadable(lazy(() => import('../pages/dashboard/TokenGating')));

// MAIN
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));
