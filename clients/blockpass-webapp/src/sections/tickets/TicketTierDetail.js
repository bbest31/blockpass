import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useAccount } from 'wagmi';
// @mui
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// routes
// components
import Image from '../../components/Image';
// sections
import TicketTierInteractionPanel from '../TicketTierInteractionPanel';
import EnhancementItem from '../EnhancementItem';
import EnhancementDialog from '../EnhancementDialog';
import PurchaseConfirmationDialog from '../PurchaseConfirmationDialog';
// utils
import { buyTicket, estimateMarketplaceFunctionGas } from '../../utils/web3Client';
import { determineTierState } from '../../utils/ticketTierUtils';

// ----------------------------------------------------------------------

TicketTierDetail.propTypes = {
  tier: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default function TicketTierDetail({ tier, onBack }) {
  const { enqueueSnackbar } = useSnackbar();
  const { address } = useAccount();

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [txn, setTxn] = useState(null);
  const [enhancements, setEnhancements] = useState(null);
  const [showEnhancementDialog, setShowEnhancementDialog] = useState(false);
  const [selectedEnhancement, setSelectedEnhancement] = useState(null);

  useEffect(() => {
    // get enhancements
    const enhancementsComponents = tier?.enhancements
      ? tier.enhancements
          .filter((e) => e.active === true)
          .map((enhancement) => (
            <EnhancementItem
              key={enhancement._id}
              enhancement={enhancement}
              onClickHandler={() => showEnhancementHandler(enhancement)}
            />
          ))
      : null;

    setEnhancements(enhancementsComponents);
    // eslint-disable-next-line
  }, [tier.enhancements]);

  const showEnhancementHandler = (e) => {
    setShowEnhancementDialog(!showEnhancementDialog);
    setSelectedEnhancement(e);
  };

  const showPurchaseConfirmationHandler = (txn) => {
    setShowConfirmationDialog(!showConfirmationDialog);
    setTxn(txn);
  };

  const buyTicketHandler = () => {
    if (address) {
      buyTicket(tier.marketplaceContract, address, tier.contract, tier.primarySalePrice)
        .then((hash) => {
          setTxn(hash);
          showPurchaseConfirmationHandler(hash);
        })
        .catch((err) => {
          // show snackbar error
          enqueueSnackbar(`Unable to complete purchase. ${err.message}`, { variant: 'error' });
        });
    } else {
      // user must connect wallet first
      enqueueSnackbar(`Please sign in first!`, { variant: 'info' });
    }
  };

  const estimateGas = () => {
    if (address) {
      estimateMarketplaceFunctionGas(
        tier.marketplaceContract,
        'buyTicket(address)',
        3000000000000,
        [tier.contract],
        tier.primarySalePrice,
        address
      )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          // show snackbar error
          enqueueSnackbar(`Unable to complete purchase. ${err.message}`, { variant: 'error' });
        });
    } else {
      // user must connect wallet first
      enqueueSnackbar(`Please sign in first!`, { variant: 'info' });
    }
  };

  return (
    <Card sx={{ p: 5 }}>
      {showEnhancementDialog && (
        <EnhancementDialog open showHandler={() => showEnhancementHandler(null)} enhancement={selectedEnhancement} />
      )}
      {showConfirmationDialog && (
        <PurchaseConfirmationDialog
          open
          showHandler={() => showPurchaseConfirmationHandler(null)}
          txn={txn}
          tier={tier}
        />
      )}
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={7}>
          <Box sx={{ p: 1 }}>
            <Box
              sx={{
                zIndex: 0,
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                height: 450,
                width: 450,
              }}
            >
              <Image alt="token uri" src={tier.tokenURI} ratio="1/1" style={{ objectFit: 'contain' }} />
            </Box>
          </Box>
        </Grid>
        {/* Interation Panel */}
        <Grid item xs={12} md={6} lg={5}>
          <TicketTierInteractionPanel
            ticketTier={tier}
            state={determineTierState(tier)}
            onBuyTicket={estimateGas}
            onBack={onBack}
          />
        </Grid>
        {/* Perks section */}
        {tier.enhancements?.length !== 0 && (
          <Grid item xs={12}>
            <Stack spacing={3}>
              <Typography variant="h4" gutterBottom>
                ✨ Ticket Perks
              </Typography>
              <Grid container sx={{ my: 8 }}>
                {enhancements}
              </Grid>
            </Stack>
          </Grid>
        )}

        {/* Ticket Description */}
        <Grid item xs={12}>
          <Stack spacing={3}>
            <Typography variant="h4" gutterBottom>
              Ticket Description
            </Typography>
            <Typography variant="body1" gutterBottom>
              {tier.description}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
