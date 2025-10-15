import { Outlet } from 'react-router-dom';

import ValidateUser from 'components/Navbar/ValidateUser';

const AuthenticatedLayout = () => {
  return (
    <>
      <ValidateUser />
      <Outlet />
    </>
  );
};

export default AuthenticatedLayout;