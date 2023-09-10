import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Grid, Dialog, Typography, Button, TextField, Stack, Divider, Link } from '@mui/material';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
// utils
import { sellToken, getBlockExplorerTxn } from '../../utils/web3Client';
import { weiToFormattedEther } from '../../utils/formatNumber';
import { ReactComponent as SuccessImg } from '../../assets/images/undraw_transfer_confirmed.svg';

// ----------------------------------------------------------------------

ListForSaleDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  from: PropTypes.string.isRequired,
  token: PropTypes.number.isRequired,
  event: PropTypes.object,
  tier: PropTypes.object,
};

export default function ListForSaleDialog({ open, showHandler, from, token, event, tier }) {
  const [price, setPrice] = useState(null);
  const [err, setErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [transactionSent, setTransactionSent] = useState(false);
  const [txn, setTxn] = useState(null);

  const onCloseHandler = () => {
    showHandler();
  };

  const onPriceChangeHandler = (e) => {
    // ensure price is not above the max markup if before the event end
    const maxPrice = tier?.primarySalePrice * (1 + tier?.secondaryMarkup / 10000);
    if (e.target.value * 10e18 > maxPrice && new Date(event?.endDate) > new Date()) {
      setErr(true);
      setErrorMsg(`Max price is ${weiToFormattedEther(maxPrice)} ETH before the event end.`);
    } else {
      setErr(false);
      setErrorMsg(null);
      setPrice(e.target.value);
    }
  };

  const listTicketForSale = async () => {
    if (price) {
      console.log(price * 10e18);
      setErr(false);
      setErrorMsg(null);
      sellToken(tier?.marketplaceContract, from, tier?.contract, price * 10e18, parseInt(token, 10))
        .then((hash) => {
          setTxn(hash);
          setTransactionSent(true);
        })
        .catch((err) => {
          setErr(true);
          setErrorMsg(err.message);
        });
    } else {
      setErr(true);
    }
  };

  const errComponent = err ? (
    <Grid item xs={12} sx={{ mb: 1 }}>
      <Typography variant="body2" color={'red'}>
        {errorMsg}
      </Typography>
    </Grid>
  ) : (
    <Grid item xs={12} sx={{ mb: 1 }}>
      <div />
    </Grid>
  );

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={showHandler}>
      <Grid container sx={{ p: 2.5 }}>
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ mb: 3 }}>
            List for sale
          </Typography>
        </Grid>
        {!transactionSent ? (
          <Grid container item xs={6} spacing={3}>
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
                    ? `Pre-event max price: ${weiToFormattedEther(
                        tier?.primarySalePrice * (1 + tier?.secondaryMarkup / 10000)
                      )} ETH`
                    : null
                }
                InputProps={{
                  endAdornment: <Iconify icon="ic:baseline-shield" color="success.dark" />, // TODO: only show if scalping protected
                }}
              />
            </Grid>
            {errComponent}
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
              <Button
                disabled={err}
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                onClick={listTicketForSale}
              >
                List ticket
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container item xs={6} spacing={3} textAlign="center">
            <Grid item xs={12}>
              <SuccessImg width={240} height={240} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ mb: 3 }}>
                <strong>Listing initiated!</strong>
              </Typography>
            </Grid>
            <Grid container item xs={12} justifyContent={'center'} spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Button fullWidth size="large" variant="outlined" color="inherit" onClick={onCloseHandler}>
                  Close
                </Button>
              </Grid>
              <Grid item xs={6}>
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
        )}

        <Grid container item xs={6} textAlign="center">
          <Grid container item xs={12} justifyContent="center" sx={{ mb: 2 }}>
            <Image objectFit="contain" src={tier?.tokenURI} sx={{ borderRadius: 12, width: 250, height: 250 }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>{event?.name}</strong>
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
    </Dialog>
  );
}
