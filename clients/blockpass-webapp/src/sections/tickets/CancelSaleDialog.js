import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Grid, Dialog, Typography, Button, TextField, Link } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
// utils
import { isValidEthAddress, transferToken } from '../../utils/web3Client';

import { ReactComponent as SuccessImg } from '../../assets/images/undraw_transfer_confirmed.svg';

// ----------------------------------------------------------------------

CancelSaleDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  onCancelSaleHandler: PropTypes.func.isRequired,
};

export default function CancelSaleDialog({ open, showHandler, onCancelSaleHandler }) {
  const onCloseHandler = () => {
    showHandler();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={showHandler} sx={{ textAlign: 'center' }}>
      <Grid container spacing={2} sx={{ p: 2.5 }}>
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ mb: 3 }}>
            Cancel Sale
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Are you sure you want to cancel the sale?</Typography>
        </Grid>
        <Grid container item xs={12} justifyContent={'center'} spacing={2} sx={{ mb: 2 }}>
          <Grid item xs="auto">
            <Button size="large" variant="outlined" color="inherit" onClick={onCloseHandler}>
              Close
            </Button>
          </Grid>
          <Grid item xs="auto">
            <Button size="large" variant="contained" color="warning" onClick={onCancelSaleHandler}>
              Cancel Sale
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}
