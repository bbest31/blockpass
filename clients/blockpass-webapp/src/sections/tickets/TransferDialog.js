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

TransferDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  contract: PropTypes.string,
  from: PropTypes.string.isRequired,
  token: PropTypes.number.isRequired,
  event: PropTypes.string,
  tierName: PropTypes.string,
};

export default function TransferDialog({ open, showHandler, contract, from, token, event, tierName }) {
  const [to, setTo] = useState(null);
  const [err, setErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [transactionSent, setTransactionSent] = useState(false);
  const [txn, setTxn] = useState(null);

  const navigate = useNavigate();

  const onCloseHandler = () => {
    if (transactionSent) navigate('/tickets');
    showHandler();
  };

  const transferOnClick = async () => {
    if (isValidEthAddress(to)) {
      try {
        transferToken(contract, from, to, token)
          .then((hash) => {
            setTxn(hash);
            setTransactionSent(true);
            setErrorMsg(null);
            setErr(false);
          })
          .catch((err) => {
            setErr(true);
            setErrorMsg(err.message);
          });
      } catch (err) {
        setErr(true);
        setErrorMsg(err.message);
      }
    } else {
      setErr(true);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={showHandler} sx={{ textAlign: 'center' }}>
      {!transactionSent ? (
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
          {err && (
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
            <SuccessImg width={300} height={300} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Transfer initiated!
            </Typography>
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
    </Dialog>
  );
}
