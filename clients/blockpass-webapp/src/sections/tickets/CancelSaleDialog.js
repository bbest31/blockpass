import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Grid, Dialog, Typography, Button, Link } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import { cancelResale, estimateMarketplaceFunctionGas } from '../../utils/web3Client';

// ----------------------------------------------------------------------

CancelSaleDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  from: PropTypes.string.isRequired,
  tier: PropTypes.object,
  token: PropTypes.number.isRequired,
};

export default function CancelSaleDialog({ open, showHandler, from, tier, token }) {
  const [transactionSent, setTransactionSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [txn, setTxn] = useState(null);
  const onCloseHandler = () => {
    showHandler();
  };

  const cancelTicketResale = async () => {
    cancelResale(tier?.marketplaceContract, from, tier?.contract, token)
      .then((hash) => {
        setTxn(hash);
        setTransactionSent(true);
        setErrorMsg(null);
      })
      .catch((err) => {
        setErrorMsg(err);
        setTransactionSent(false);
      });
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={showHandler} sx={{ textAlign: 'center' }}>
      <Grid container spacing={2} sx={{ p: 2.5 }}>
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Delist Token
          </Typography>
        </Grid>
        {errorMsg && (
          <Grid item xs={12}>
            <Typography variant="body2" color="danger.main" sx={{ mb: 1 }}>
              {errorMsg}
            </Typography>
          </Grid>
        )}
        {transactionSent ? (
          <Grid container item xs={12} justifyContent={'center'} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                Sale cancelled successfully
              </Typography>
            </Grid>
            <Grid container item xs={12} justifyContent={'center'} spacing={2} sx={{ mb: 2 }}>
              <Grid item xs="auto">
                <Button size="large" variant="outlined" color="inherit" onClick={onCloseHandler}>
                  Close
                </Button>
              </Grid>
              <Grid item xs="auto">
                <Link
                  target="_blank"
                  href={
                    process.env.NODE_ENV === 'production'
                      ? `https://etherscan.io/tx/${txn}`
                      : `https://sepolia.etherscan.io/tx/${txn}`
                  }
                >
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="ic:baseline-launch" />}
                  >
                    View Transaction
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container item xs spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">Are you sure you want to cancel the sale?</Typography>
            </Grid>
            <Grid container item xs={12} justifyContent={'center'} spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Button fullWidth size="large" variant="outlined" color="inherit" onClick={onCloseHandler}>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth size="large" variant="contained" color="warning" onClick={cancelTicketResale}>
                  Delist
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Dialog>
  );
}
