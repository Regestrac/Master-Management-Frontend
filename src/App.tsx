import { useRoutes } from 'react-router';
import { ToastContainer } from 'react-toastify';

import useCustomNavigation from 'hooks/useCustomNavigation';

import { ThemeProvider } from 'context/ThemeContext';

import routes from './routes/routes';

function App() {
  useCustomNavigation();

  const appRoutes = useRoutes(routes);

  return (
    <ThemeProvider>

      {appRoutes}

      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        draggable
        pauseOnHover
        theme='dark'
      />

    </ThemeProvider>
  );
}

export default App;
