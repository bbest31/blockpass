import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Grid, Dialog, Typography, Button, TextField, Stack, Divider } from '@mui/material';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
// utils
import { isValidEthAddress, transferToken } from '../../utils/web3Client';

import { ReactComponent as SuccessImg } from '../../assets/images/undraw_transfer_confirmed.svg';

// ----------------------------------------------------------------------

ListForSaleDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  from: PropTypes.string.isRequired,
  token: PropTypes.number.isRequired,
  event: PropTypes.object.isRequired,
  tier: PropTypes.object.isRequired,
};

export default function ListForSaleDialog({ open, showHandler, from, token, event, tier }) {
  const [price, setPrice] = useState(null);
  const [err, setErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [listingComplete, setListingComplete] = useState(false);

  const onCloseHandler = () => {
    showHandler();
  };

  const listTicketForSale = () => {
    setListingComplete(true);
    // if (isValidEthAddress(price)) {
    //   setErr(false);
    //   transferToken(contract, from, price, token)
    //     .on('transactionHash', (hash) => {
    //       setTxn(hash);
    //       setListingComplete(true);
    //       setErrorMsg(null);
    //     })
    //     .catch((err) => {
    //       setErrorMsg(err.message);
    //     });
    // } else {
    //   setErr(true);
    // }
  };

  /**
   * Lists the ticket for sale on the marketplace
   * @param {number} price - the resale price of the ticket.
   */
  // const sellTicketSaleHandler = (price) => {
  //   marketplaceContract
  //     .resellTicket(ticketTier.contract, parseInt(token, 10), price)
  //     .send({ from: address })
  //     .then(() => {
  //       enqueueSnackbar('Ticket has been listed for sale.', { variant: 'success' });
  //       setIsForSale(true);
  //     })
  //     .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
  // };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={showHandler}>
      {!listingComplete ? (
        <Grid container sx={{ p: 2.5 }}>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              List for sale
            </Typography>
          </Grid>
          <Grid container item xs={6} spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={err}
                type="number"
                label="Price"
                placeholder="0.00 ETH"
                onChange={(e) => setPrice(e.target.value)}
                helperText={true ? `Pre-event max price: 1.0 ETH` : null}
                InputProps={{
                  endAdornment: <Iconify icon="ic:baseline-shield" color="success.dark" />,
                }}
              />
            </Grid>
            {errorMsg && (
              <Grid item xs={12}>
                <Typography variant="body1" color={'red'}>
                  {errorMsg}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h5">Summary</Typography>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  Total price
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {price || '--'} ETH
                </Typography>
              </Stack>
              <Divider sx={{ borderStyle: 'solid' }} />
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  Potential earnings
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  {price || '--'} ETH
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth size="large" variant="outlined" color="inherit" onClick={onCloseHandler}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth size="large" variant="contained" color="primary" onClick={listTicketForSale}>
                List ticket
              </Button>
            </Grid>
          </Grid>
          <Grid container item xs={6} textAlign="center">
            {/* TODO Add ticket URI */}
            <Grid container item xs={12} justifyContent="center" sx={{ mb: 2 }}>
              <Image objectFit="contain" src={tier?.tokenURI} sx={{ borderRadius: 12, width: 250, height: 250 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>{event.name}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>
                  {tier?.displayName} — #{token}
                </strong>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ p: 2.5 }}>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              List for sale
            </Typography>
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
}
