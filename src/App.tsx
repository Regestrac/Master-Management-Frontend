import { useRoutes } from 'react-router';
import { ToastContainer } from 'react-toastify';

import useCustomNavigation from 'hooks/useCustomNavigation';

import Modals from 'components/Modals';
import PerformanceOptimizer from 'components/Performance/PerformanceOptimizer';

import routes from 'src/routes/routes';

function App() {
  useCustomNavigation();

  const appRoutes = useRoutes(routes);

  return (
    <>
      <PerformanceOptimizer />

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

      <Modals />

    </>
  );
}

export default App;
