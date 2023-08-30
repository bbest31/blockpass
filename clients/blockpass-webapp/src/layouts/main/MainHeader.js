import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
// utils
import cssStyles from '../../utils/cssStyles';
// config
import { HEADER } from '../../config';
// components
import Logo from '../../components/Logo';

import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import useMenuConfig from './MenuConfig';
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('md')]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT,
  },
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export default function MainHeader() {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);

  const theme = useTheme();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'md');

  const isHome = pathname === '/';

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [isAuthenticated, setIsAuthenticated] = useState(isConnected);

  const navConfig = useMenuConfig(isAuthenticated);

  const handleAuth = async () => {
    try {
      // disconnects the web3 provider if it's already active
      if (isConnected) {
        await disconnectAsync();
      }
      // enabling the web3 provider metamask
      const { account } = await connectAsync({
        connector: new InjectedConnector(),
      });

      const userData = { address: account, chain: 1 }; // TODO: get EIP-155 chain id
      // making a post request to our 'request-message' endpoint
      const { data } = await axiosInstance.post('/request-message', userData, {
        headers: {
          'content-type': 'application/json',
        },
      });
      const { message } = data;
      // signing the received message via metamask
      const signature = await signMessageAsync({ message });

      await axiosInstance.post(
        '/verify',
        {
          message,
          signature,
        },
        { withCredentials: true } // set cookie from Express server
      );

      setIsAuthenticated(true);
    } catch (err) {
      // user did not sign message
      console.error(err);
    }
  };

  const logout = async () => {
    await axiosInstance.get('/logout', { withCredentials: true });
    setIsAuthenticated(false);
  };

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...cssStyles(theme).bgBlur(),
            height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
          }),
        }}
      >
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Logo />

          {/* TODO: Add search bar */}

          <Box sx={{ flexGrow: 1 }} />

          {isDesktop && <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}

          {isAuthenticated ? (
            <Button variant="text" sx={{ color: theme.palette.text.secondary }} onClick={() => logout()}>
              Sign Out
            </Button>
          ) : (
            <Button variant="contained" onClick={() => handleAuth()}>
              Sign In
            </Button>
          )}

          {!isDesktop && <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}
        </Container>
      </ToolbarStyle>

      <ToolbarShadowStyle />
    </AppBar>
  );
}
