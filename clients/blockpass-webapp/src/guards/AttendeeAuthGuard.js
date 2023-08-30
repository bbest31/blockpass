import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { PATH_PAGE } from '../routes/paths';

// ----------------------------------------------------------------------

AttendeeAuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AttendeeAuthGuard({ children }) {
  const { isConnected } = useAccount();

  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isConnected) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Navigate to={PATH_PAGE.page403} />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
