import { lazy, Suspense } from 'react';

import { RouteObject } from 'react-router-dom';

// Eagerly loaded components (critical for initial render)
import Home from 'components/Home/Home';
import RootLayout from 'components/Layout/RootLayout';
import SidebarOnlyLayout from 'components/Layout/SidebarOnlyLayout';
import RootLayoutWrapper from 'components/Layout/RootLayoutWrapper';
import AuthenticatedLayout from 'components/Layout/AuthenticatedLayout';
import NotFound from 'components/Shared/NotFound';
import LoadingSpinner from 'components/Shared/LoadingSpinner';

// Lazy loaded components for code splitting
const Authentication = lazy(() => import('components/Authentication'));
const Login = lazy(() => import('components/Authentication/login'));
const Signup = lazy(() => import('components/Authentication/Signup'));
const Dashboard = lazy(() => import('components/Dashboard/Dashboard'));
const Profile = lazy(() => import('components/Profile/Profile'));
const Settings = lazy(() => import('components/Settings/Settings'));
const TermsOfService = lazy(() => import('components/Resources/TermsOfService'));
const PrivacyPolicy = lazy(() => import('components/Resources/PrivacyPolicy'));
const Tasks = lazy(() => import('components/Tasks/Tasks'));
const TaskDetail = lazy(() => import('components/Tasks/Details/TaskDetails'));
const Goals = lazy(() => import('components/Goals/Goals'));
const WorkspaceHome = lazy(() => import('components/Workspace/WorkspaceHome'));
const WorkspaceDetail = lazy(() => import('components/Workspace/WorkspaceDetail'));
const CreateTaskForm = lazy(() => import('components/Tasks/CreateTaskForm'));
const Analytics = lazy(() => import('components/Analytics/Analytics'));
const Calendar = lazy(() => import('components/Calendar/Calendar'));
const BugReport = lazy(() => import('components/Resources/BugReport'));
const FeatureRequest = lazy(() => import('components/Resources/FeatureRequest'));
const Documentation = lazy(() => import('components/Resources/Documentation'));
const ChangeLog = lazy(() => import('components/Resources/ChangeLog'));
const Support = lazy(() => import('components/Resources/Support'));
const Community = lazy(() => import('components/Resources/Community'));

const routes: RouteObject[] = [
  {
    element: <RootLayoutWrapper />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/legal/terms',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TermsOfService />
          </Suspense>
        ),
      },
      {
        path: '/legal/privacy',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: '/documentation',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Documentation />
          </Suspense>
        ),
      },
      {
        path: '/changelog',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ChangeLog />
          </Suspense>
        ),
      },
      {
        path: '/auth',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Authentication />
          </Suspense>
        ),
        children: [
          {
            path: '/auth/login',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Login />
              </Suspense>
            ),
          },
          {
            path: '/auth/signup',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Signup />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            element: <RootLayout />,
            children: [
              {
                path: '/dashboard',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Dashboard />
                  </Suspense>
                ),
              },
              {
                path: '/tasks',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Tasks />
                  </Suspense>
                ),
              },
              {
                path: '/goals',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Goals />
                  </Suspense>
                ),
              },
              {
                path: '/workspace',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <WorkspaceHome />
                  </Suspense>
                ),
              },
              {
                path: '/workspace/:id',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <WorkspaceDetail />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <SidebarOnlyLayout />,
            children: [
              {
                path: '/analytics',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Analytics />
                  </Suspense>
                ),
              },
              {
                path: '/calendar',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Calendar />
                  </Suspense>
                ),
              },
              {
                path: '/profile',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Profile />
                  </Suspense>
                ),
              },
              {
                path: '/settings',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Settings />
                  </Suspense>
                ),
              },
              {
                path: '/support',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Support />
                  </Suspense>
                ),
              },
              {
                path: '/community',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Community />
                  </Suspense>
                ),
              },
              {
                path: '/feature-request',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <FeatureRequest />
                  </Suspense>
                ),
              },
              {
                path: '/bug-report',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <BugReport />
                  </Suspense>
                ),
              },
              {
                path: '/tasks/:id',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <TaskDetail />
                  </Suspense>
                ),
              },
              {
                path: '/goals/:id',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <TaskDetail />
                  </Suspense>
                ),
              },
              {
                path: '/task/create',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <CreateTaskForm />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: '/not-found',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;