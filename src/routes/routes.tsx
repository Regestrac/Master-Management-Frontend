import { RouteObject } from 'react-router-dom';

import Authentication from 'components/Authentication';
import Login from 'components/Authentication/login';
import Signup from 'components/Authentication/Signup';
import Dashboard from 'components/Dashboard/Dashboard';
import Home from 'components/Home/Home';
import RootLayout from 'components/Layout/RootLayout';
import Profile from 'components/Profile/Profile';
import Settings from 'components/Settings/Settings';
import NotFound from 'components/Shared/NotFound';
import StyleGuide from 'components/StyleGuide';
import Tasks from 'components/Tasks/Tasks';
import TaskDetail from 'components/Tasks/TaskDetail';
import TaskManagementAppDesign from 'components/Tasks/TaskManagementAppDesign';
import Goals from 'components/Goals/Goals';
import CreateTaskForm from 'components/Tasks/CreateTaskForm';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth',
    element: <Authentication />,
    children: [
      {
        path: '/auth/login',
        element: <Login />,
      },
      {
        path: '/auth/signup',
        element: <Signup />,
      },
    ],
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/tasks',
        element: <Tasks />,
      },
      {
        path: '/goals',
        element: <Goals />,
      },
      {
        path: '/analytics',
      },
      {
        path: '/calendar',
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '/tasks/:id',
    element: <TaskDetail />,
  },
  {
    path: 'task/create',
    element: <CreateTaskForm />,
  },
  {
    path: '/not-found',
    element: <NotFound />,
  },
  {
    path: '/style-guide',
    element: <StyleGuide />,
  },
  {
    path: '/app-design',
    element: <TaskManagementAppDesign />,
  },
];

export default routes;