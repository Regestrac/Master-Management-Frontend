import { Outlet } from 'react-router-dom';

import ValidateUser from 'components/Navbar/ValidateUser';

const RootLayoutWrapper = () => {
  return (
    <>
      <Outlet />
      <ValidateUser />
    </>
  );
};

export default RootLayoutWrapper;