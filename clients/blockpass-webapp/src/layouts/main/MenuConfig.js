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
      icon: <Iconify icon={'mdi:ticket-outline'} {...ICON_SIZE} />,
      path: '/tickets',
    });
  }
  return menuConfig;
};

export default useMenuConfig;
