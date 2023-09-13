import PropTypes from 'prop-types';
// @mui
import { Grid, Dialog, Typography, Button, Link, Stack, Divider } from '@mui/material';
// components
import Iconify from '../components/Iconify';
import { weiToFormattedEther } from '../utils/formatNumber';

import { ReactComponent as SuccessImg } from '../assets/images/undraw_transfer_confirmed.svg';

// ----------------------------------------------------------------------

PurchaseConfirmationDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  tier: PropTypes.object,
  txn: PropTypes.string.isRequired,
  quantity: PropTypes.number,
};

export default function PurchaseConfirmationDialog({ open, showHandler, txn, tier, quantity = 1 }) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={showHandler} sx={{ p: 2.5 }}>
      <Stack spacing={3} alignItems={'center'} sx={{ mb: 4 }}>
        <SuccessImg width={300} height={300} />

        <Typography variant="h3" sx={{ mb: 3 }}>
          Thank you!
        </Typography>

        <Typography variant="h4" sx={{ mb: 3 }}>
          Your order has been successfully placed.
        </Typography>

        <Typography variant="body1">Your ticket will appear alongside your wallets NFTs.</Typography>

        <Link
          target="_blank"
          rel="noopener"
          href={
            process.env.NODE_ENV === 'production'
              ? `https://etherscan.io/tx/${txn}`
              : `https://sepolia.etherscan.io/tx/${txn}`
          }
        >
          <Button size="large" variant="contained" color="primary" startIcon={<Iconify icon="ic:baseline-launch" />}>
            View Transaction
          </Button>
        </Link>
      </Stack>

      <Grid container spacing={3} sx={{ p: 2.5 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Order Details</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderStyle: 'solid' }} />
        </Grid>
        {Array.from({ length: quantity }).map((_, index) => (
          <Grid key={index} item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">{tier.displayName}</Typography>
              <Typography variant="body1">
                <strong>{weiToFormattedEther(quantity * parseInt(tier.primarySalePrice, 10))} ETH</strong>
              </Typography>
            </Stack>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Divider sx={{ borderStyle: 'solid' }} />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>Total</strong>
            </Typography>
            <Typography variant="body1">
              <strong>{weiToFormattedEther(quantity * parseInt(tier.primarySalePrice, 10))} ETH</strong>
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      <Grid container justifyContent={'end'} sx={{ p: 2.5 }}>
        <Grid item xs="auto">
          <Button size="medium" variant="outlined" color="inherit" onClick={showHandler}>
            Close
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}
