// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const useMenuConfig = (isAuthenticated) => {
  const menuConfig = [];
  if (isAuthenticated) {
    menuConfig.push({
      title: 'My Tickets',
      icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
      path: '/tickets',
    });
  } else {
    menuConfig.push({
      title: 'Sign In',
      icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
      path: '/sign-in',
    });
  }

  return menuConfig;
};

export default useMenuConfig;
