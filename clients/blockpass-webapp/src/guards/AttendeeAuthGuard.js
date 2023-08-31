import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { PATH_PAGE } from '../routes/paths';
import axiosInstance from '../utils/axios';

// ----------------------------------------------------------------------

AttendeeAuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AttendeeAuthGuard({ children }) {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  useEffect(() => {
    axiosInstance(`/authenticate`, {
      withCredentials: true,
    }).catch(() => {
      navigate(PATH_PAGE.page403);
    });
    // eslint-disable-next-line
  }, []);

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
