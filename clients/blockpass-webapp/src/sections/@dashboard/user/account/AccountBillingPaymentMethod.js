import PropTypes from 'prop-types';
// @mui
import { Box, Card, Stack, Paper, Button, Collapse, TextField, Typography, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { fWalletAddressShortDisplay } from '../../../../utils/formatWalletAddress';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import polygonSymbol from '../../../../assets/icons/polygon_symbol_purple.svg';
import ethereumSymbol from '../../../../assets/icons/ethereum_symbol.svg';
// ----------------------------------------------------------------------

AccountBillingPaymentMethod.propTypes = {
  wallets: PropTypes.array,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onCancel: PropTypes.func,
};

export default function AccountBillingPaymentMethod({ wallets, isOpen, onOpen, onCancel }) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="overline" sx={{ mb: 3, display: 'block', color: 'text.secondary' }}>
        Payment Method
      </Typography>

      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
        {wallets.map((wallet) => (
          <Paper
            key={wallet.id}
            sx={{
              p: 3,
              width: 1,
              position: 'relative',
              border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
            }}
          >
            <Image
              alt="icon"
              src={wallet.walletNetwork === 'matic_mainnet' ? polygonSymbol : ethereumSymbol}
              sx={{ mb: 1, maxWidth: 36 }}
            />
            <Typography variant="subtitle2">{fWalletAddressShortDisplay(wallet.walletAddress)}</Typography>
            <IconButton
              sx={{
                top: 8,
                right: 8,
                position: 'absolute',
              }}
            >
              <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
            </IconButton>
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
              <TextField fullWidth label="Wallet Address" disabled />
            </Stack>

            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
              <Button color="inherit" variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" onClick={onCancel}>
                Connect Wallet
              </LoadingButton>
            </Stack>
          </Stack>
        </Box>
      </Collapse>
    </Card>
  );
}
