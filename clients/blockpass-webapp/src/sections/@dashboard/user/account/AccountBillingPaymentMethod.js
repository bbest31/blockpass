import PropTypes from 'prop-types';
import { useMoralis } from 'react-moralis';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
// @mui
import {
  Box,
  Card,
  Stack,
  Paper,
  Button,
  Collapse,
  TextField,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { fWalletAddressShortDisplay } from '../../../../utils/formatWalletAddress';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import axiosInstance from '../../../../utils/axios';
import { getNetworkIcon } from '../../../../utils/networks';
// config
import { MATIC_NETWORK } from '../../../../config';
// ----------------------------------------------------------------------

AccountBillingPaymentMethod.propTypes = {
  metadata: PropTypes.object,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onCancel: PropTypes.func,
};

export default function AccountBillingPaymentMethod({ metadata, isOpen, onOpen, onCancel }) {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();
  const { enqueueSnackbar } = useSnackbar();
  const [wallets, setWallets] = useState(metadata);
  const { organization, getAccessToken, refreshOrg } = useAuth();
  const [anchorElement, setAnchorElement] = useState(null);
  const [openMenu, setOpenMenuActions] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(isAuthenticated);

  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
    setOpenMenuActions(true);
  };

  const handleClose = () => {
    setOpenMenuActions(false);
  };

  const connectWallet = async () => {
    if (!isWalletConnected) {
      await authenticate({ signingMessage: 'Connect to BlockPass' })
        .then((user) => {
          if (user) {
            setIsWalletConnected(true);
            enqueueSnackbar('Wallet connected!');
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    }
  };

  const disconnectWallet = () => {
    logout();
    setIsWalletConnected(false);
  };

  const saveWallet = async () => {
    const newWallet = user.get('ethAddress');
    if (isDuplicateWallet(MATIC_NETWORK, newWallet)) {
      // wallet is already saved so do nothing.
      enqueueSnackbar('Wallet already saved', { variant: 'info' });
      return;
    }

    // build new metadata object for org
    const temp = { ...wallets };
    temp[MATIC_NETWORK] = newWallet;

    try {
      const token = await getAccessToken();

      axiosInstance
        .patch(
          `/organizations/${organization.id}`,
          { metadata: temp },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          enqueueSnackbar('Wallet saved!');
          refreshOrg();
          setWallets(temp);
          onCancel();
        });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const removeWallet = async () => {
    // build new metadata object for org

    // use the anchor element to identify which wallet to remove
    const network = String(anchorElement.id).split('-')[0];
    const temp = { ...wallets };
    delete temp[network];

    try {
      const token = await getAccessToken();
      axiosInstance
        .patch(
          `/organizations/${organization.id}`,
          { metadata: temp },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          enqueueSnackbar('Wallet removed successfully!');
          refreshOrg();
          setWallets(temp);
          onCancel();
        });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const walletsArray = Object.entries(wallets);

  const isDuplicateWallet = (network, address) => {
    const walletsArray = Object.entries(wallets);
    for (let index = 0; index < walletsArray.length; index += 1) {
      if (walletsArray[index].includes(network) && walletsArray[index].includes(address)) {
        return true;
      }
    }
    return false;
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="overline" sx={{ mb: 3, display: 'block', color: 'text.secondary' }}>
        Wallet Addresses
      </Typography>

      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
        {walletsArray.map(([network, address], index) => (
          <Paper
            key={index}
            sx={{
              p: 3,
              width: 1,
              position: 'relative',
              border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
            }}
          >
            <Image alt="icon" src={getNetworkIcon(network)} sx={{ mb: 1, maxWidth: 36 }} />
            <Typography variant="subtitle2">{fWalletAddressShortDisplay(address)}</Typography>
            {walletsArray.length > 1 ? (
              <div>
                <IconButton
                  id={`${network}-menu-btn`}
                  sx={{
                    top: 8,
                    right: 8,
                    position: 'absolute',
                  }}
                  onClick={handleClick}
                >
                  <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
                </IconButton>
                <Menu open={openMenu} onClose={handleClose} anchorEl={anchorElement}>
                  <MenuItem sx={{ color: 'error.main' }} onClick={removeWallet}>
                    Remove
                  </MenuItem>
                </Menu>
              </div>
            ) : null}
          </Paper>
        ))}
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Button size="small" startIcon={<Iconify icon={'eva:plus-fill'} />} onClick={onOpen}>
          Add new wallet
        </Button>
      </Box>

      <Collapse in={isOpen}>
        <Box
          sx={{
            padding: 3,
            marginTop: 3,
            borderRadius: 1,
            bgcolor: 'background.neutral',
          }}
        >
          <Stack spacing={3}>
            <Typography variant="subtitle1">Add new wallet (Polygon only)</Typography>

            {/*  */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                placeholder='Wallet Address'
                InputProps={{ readOnly: true }}
                value={isWalletConnected ? user.get('ethAddress') : ''}
                // InputProps={{
                //   endAdornment: (
                //     <InputAdornment position="end">
                //       <IconButton edge="end" disabled>
                //         <Icon>
                //           <img src="../../../../assets/icons/polygon_black_symbol.svg" alt="polygon testnet" />
                //         </Icon>
                //       </IconButton>
                //     </InputAdornment>
                //   ),
                // }}
              />
            </Stack>
            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
              <Button color="inherit" variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
              {!isWalletConnected ? (
                <LoadingButton type="submit" variant="contained" onClick={connectWallet}>
                  Connect Wallet
                </LoadingButton>
              ) : (
                <div>
                  <LoadingButton type="submit" variant="contained" onClick={saveWallet}>
                    Save Wallet
                  </LoadingButton>
                  <LoadingButton variant="string" onClick={disconnectWallet}>
                    Disconnect Wallet
                  </LoadingButton>
                </div>
              )}
            </Stack>
          </Stack>
        </Box>
      </Collapse>
    </Card>
  );
}
