import { useRoutes } from 'react-router';
import { ToastContainer } from 'react-toastify';

import useCustomNavigation from 'hooks/useCustomNavigation';

import routes from 'routes/routes';

import Modals from 'components/Modals';

function App() {
  useCustomNavigation();

  const appRoutes = useRoutes(routes);

  return (
    <>

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
