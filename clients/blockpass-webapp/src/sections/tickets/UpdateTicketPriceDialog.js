import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Grid, Dialog, Typography, Button, TextField } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
// utils
import { updateTicketResalePrice } from '../../utils/web3Client';

// ----------------------------------------------------------------------

UpdateTicketPriceDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  tier: PropTypes.string,
  from: PropTypes.string.isRequired,
  token: PropTypes.number.isRequired,
  event: PropTypes.string,
};

export default function UpdateTicketPriceDialog({ open, showHandler, tier, from, token, event }) {
  const [primarySalePrice] = useState(tier?.primarySalePrice);
  const [secondaryMarkup] = useState(tier?.secondaryMarkup);
  const [price, setPrice] = useState(null);
  const [err, setErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [transactionComplete, setTransactionComplete] = useState(false);

  const onCloseHandler = () => {
    showHandler();
  };

  const onPriceChangeHandler = (e) => {
    // ensure price is not above the max markup if before the event end
    const maxPrice = primarySalePrice * (1 + secondaryMarkup / 10000);
    if (e.target.value > maxPrice && new Date(event?.endDate) > new Date()) {
      setErr(true);
      setErrorMsg(`Ticket can't be sold for more than ${weiToFormattedEther(maxPrice)} ETH before the event end date.`);
    }
    setErr(false);
    setErrorMsg(null);
    setPrice(e.target.value);
  };

  const updatePriceOnClick = () => {
    if (price) {
      setErr(false);
      setErrorMsg(null);
      updateTicketResalePrice(tier?.marketplaceContract, from, tier?.contract, parseInt(token, 10), price)
        .on('confirmation', (res) => {
          console.log(res);
          setTransactionComplete(true);
        })
        .catch((err) => {
          setErr(true);
          setErrorMsg(err.message);
        });
    } else {
      setErr(true);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={showHandler} sx={{ textAlign: 'center' }}>
      {!transactionComplete ? (
        <Grid container spacing={2} sx={{ p: 2.5 }}>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Update price
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={err}
              type="number"
              label="Price"
              placeholder="0.00 ETH"
              onChange={onPriceChangeHandler}
              helperText={
                tier?.secondaryMarkup
                  ? `Pre-event max price: ${weiToFormattedEther(primarySalePrice * (1 + secondaryMarkup / 10000))} ETH`
                  : null
              }
              InputProps={{
                endAdornment: <Iconify icon="ic:baseline-shield" color="success.dark" />, // TODO: only show if scalping protected
              }}
            />
          </Grid>
          <Grid container item xs={12} justifyContent={'center'} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs="auto">
              <Button size="large" variant="outlined" color="inherit" onClick={onCloseHandler}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Button disabled={err} size="large" variant="contained" color="primary" onClick={updatePriceOnClick}>
                Update
              </Button>
            </Grid>
          </Grid>
          {errorMsg && (
            <Grid container item xs={12} justifyContent={'center'} spacing={2}>
              <Typography variant="body1" color={'red'}>
                {errorMsg}
              </Typography>
            </Grid>
          )}
        </Grid>
      ) : (
        <Grid container justifyContent={'center'} spacing={2} sx={{ p: 2.5 }}>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Price updated!
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Button size="large" variant="outlined" color="inherit" onClick={onCloseHandler}>
              Close
            </Button>
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
}
