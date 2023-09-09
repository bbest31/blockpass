import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Grid, Dialog, Typography, Button } from '@mui/material';

import { cancelResale } from '../../utils/web3Client';
import { ReactComponent as SuccessImg } from '../../assets/images/undraw_confirmed.svg';

// ----------------------------------------------------------------------

CancelSaleDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  from: PropTypes.func.isRequired,
  tier: PropTypes.object.isRequired,
  token: PropTypes.number.isRequired,
};

export default function CancelSaleDialog({ open, showHandler, from, tier, token }) {
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const onCloseHandler = () => {
    showHandler();
  };

  const cancelTicketResale = () => {
    cancelResale(tier?.marketplaceContract, from, tier?.contract, token)
      .on('confirmation', (res) => {
        console.log(res);
        setIsSuccessful(true);
        setErrorMsg(null);
      })
      .catch((err) => {
        setErrorMsg(err);
        setIsSuccessful(false);
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
        {isSuccessful ? (
          <Grid container item xs={12} justifyContent={'center'} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                Sale cancelled successfully
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth size="large" variant="outlined" color="inherit" onClick={onCloseHandler}>
                Close
              </Button>
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
