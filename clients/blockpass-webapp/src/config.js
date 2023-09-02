import { mainnet, polygonMumbai } from 'wagmi/chains';
// routes
import { PATH_APP } from './routes/paths';
import { NETWORKS } from './utils/networks';

import palette from './theme/palette';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.REACT_APP_HOST_API_KEY || '';

export const SERVER_API = process.env.REACT_APP_API_SERVER || '';

export const MARKETPLACE_CONTRACT = {
  address: process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS,
  feeNumerator: process.env.REACT_APP_MARKETPLACE_FEE_NUMERATOR,
};

export const MATIC_NETWORK = {
  network: process.env.NODE_ENV === 'production' ? NETWORKS.POLYGON_MAINNET : NETWORKS.POLYGON_TESTNET,
  chainId: process.env.NODE_ENV === 'production' ? 0x38 : 0x13881,
};

export const AUTH0_API = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
};

export const SERVER_API_KEY = process.env.REACT_APP_SERVER_API_KEY;

export const GMAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_APP.general.dashboard; // as '/dashboard'

export const MIXPANEL_API = {
  debug: process.env.NODE_ENV !== 'production',
};

export const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  MOBILE_HEIGHT: 64,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 92,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

// CONSTANTS

export const ENHANCEMENT_STYLE = {
  discount: {
    icon: 'ic:outline-discount',
    bgcolor: palette.light.error.dark,
  },
  access: {
    icon: 'solar:key-outline',
    bgcolor: palette.light.info.dark,
  },
  gift: {
    icon: 'mdi:gift-outline',
    bgcolor: palette.light.warning.main,
  },
  reward: { icon: 'ph:medal', bgcolor: palette.light.secondary.dark },
};

// SETTINGS
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const defaultSettings = {
  themeMode: 'light',
  themeDirection: 'ltr',
  themeContrast: 'default',
  themeLayout: 'horizontal',
  themeColorPresets: 'default',
  themeStretch: false,
};

export const chains = process.env.NODE_ENV === 'production' ? [mainnet] : [polygonMumbai];
