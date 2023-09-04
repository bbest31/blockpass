import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Grid, Dialog, Typography, Button, TextField, Link } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
// utils
import { isValidEthAddress, transferToken } from '../../utils/web3Client';

import { ReactComponent as SuccessImg } from '../../assets/images/undraw_transfer_confirmed.svg';

// ----------------------------------------------------------------------

ListForSaleDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  contract: PropTypes.string,
  from: PropTypes.string.isRequired,
  token: PropTypes.number.isRequired,
  event: PropTypes.string,
  tierName: PropTypes.string,
};

export default function ListForSaleDialog({ open, showHandler, contract, from, token, event, tierName }) {
  const [to, setTo] = useState(null);
  const [err, setErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [listingComplete, setListingComplete] = useState(false);
  const [txn, setTxn] = useState(null);

  const navigate = useNavigate();

  const onCloseHandler = () => {
    if (listingComplete) navigate('/tickets');
    showHandler();
  };

  const transferOnClick = () => {
    if (isValidEthAddress(to)) {
      setErr(false);
      transferToken(contract, from, to, token)
        .on('transactionHash', (hash) => {
          setTxn(hash);
          setListingComplete(true);
          setErrorMsg(null);
        })
        .catch((err) => {
          setErrorMsg(err.message);
        });
    } else {
      setErr(true);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={showHandler}>
      {!listingComplete ? (
        <Grid container spacing={2} sx={{ p: 2.5 }}>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Transfer
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">{event}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {tierName} — #{token}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={err}
              label="Transfer destination"
              placeholder="e.g. 0x1ed3...or destination.eth"
              onChange={(e) => setTo(e.target.value)}
            />
          </Grid>
          <Grid container item xs={12} justifyContent={'center'} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs="auto">
              <Button size="large" variant="outlined" color="inherit" onClick={onCloseHandler}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Button size="large" variant="contained" color="primary" onClick={transferOnClick}>
                Transfer
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
        <Grid container spacing={2} sx={{ p: 2.5 }}>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              List for sale
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <SuccessImg width={200} height={200} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Transfer sent to: {to}</Typography>
          </Grid>
          <Grid container item xs={12} justifyContent={'center'} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs="auto">
              <Button size="large" variant="outlined" color="inherit" onClick={onCloseHandler}>
                Close
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Link target="_blank" href={`https://etherscan.io/tx/${txn}`}>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="ic:baseline-launch" />}
                  onClick={transferOnClick}
                >
                  View Transaction
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
}
