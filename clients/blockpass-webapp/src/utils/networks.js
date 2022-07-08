import polygonMainnetIcon from '../assets/icons/polygon_symbol_purple.svg';
import polygonTestnetIcon from '../assets/icons/polygon_black_symbol.svg';
import ethereumMainnetIcon from '../assets/icons/ethereum_symbol.svg';

export const NETWORKS = {
  POLYGON_MAINNET: 'matic_mainnet',
  POLYGON_TESTNET: 'matic_testnet',
  ETHEREUM_MAINNET: 'eth_mainnet',
};

export function getNetworkIcon(network) {
  switch (network) {
    case NETWORKS.POLYGON_MAINNET:
      return polygonMainnetIcon;
    case NETWORKS.POLYGON_TESTNET:
      return polygonTestnetIcon;
    default:
      return ethereumMainnetIcon;
  }
};
