import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Typography, Grid, Button, Card, Box, Stack, Skeleton, Avatar, AvatarGroup } from '@mui/material';
// components
import Iconify from '../components/Iconify';
import Image from '../components/Image';
// theme
import palette from '../theme/palette';
// utils
import { fDate } from '../utils/formatTime';
import axiosInstance from '../utils/axios';
// config
import { SERVER_API_KEY } from '../config';

EventPreviewTicket.propTypes = {
  ticketTier: PropTypes.object.isRequired,
  sx: PropTypes.object,
};

/**
 * Returns a truncated string ended with an ellipses if the string is longer than 50 chars.
 * @param {string} str
 * @returns {string}
 */
const truncateString = (str) => {
  if (str.length > 50) {
    return `${str.substring(0, 47)}...`;
  }
  return str;
};

const ENHANCEMENT_STYLE = {
  Discount: {
    icon: 'ic:outline-discount',
    bgcolor: palette.light.error.dark,
  },
  Access: {
    icon: 'solar:key-outline',
    bgcolor: palette.light.info.dark,
  },
  Gift: {
    icon: 'mdi:gift-outline',
    bgcolor: palette.light.warning.main,
  },
  Reward: { icon: 'ph:medal', bgcolor: palette.light.secondary.dark },
};

const TierState = {
  active: 'active',
  pending: 'pending',
  paused: 'paused',
  closed: 'closed',
  soldOut: 'soldOut',
};

export default function EventPreviewTicket({ ticketTier, sx }) {
  const [contractData, setContractData] = useState(null);
  const [tierState, setTierState] = useState('closed');
  const [isLoading, setIsLoading] = useState(true);

  const determineTierState = (data) => {
    if (data) {
      const closeDate = new Date(data.closeDate);
      const liveDate = new Date(data.liveDate);
      if (parseInt(data.totalticketsForSale, 10) === 0) return TierState.soldOut;
      if (closeDate <= new Date()) return TierState.closed;
      if (data.paused) return TierState.paused;
      if (liveDate > new Date()) return TierState.pending;
      return TierState.active;
    }
    return TierState.closed;
  };

  useEffect(() => {
    const controller = new AbortController();
    axiosInstance
      .get(`/ticket-tiers/${ticketTier._id}`, {
        headers: {
          'blockpass-api-key': SERVER_API_KEY,
        },
      })
      .then((res) => {
        setContractData(res.data);
        setTierState(determineTierState(res.data));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (!controller.signal.aborted) {
          // show error information
          console.error('Unable to retrieve all ticket information');
        }
        setIsLoading(false);
      });
  }, [ticketTier._id]);

  const hasEnhancements = ticketTier.enhancements.length > 0;

  let ctaButton = (
    <Button variant="text" size="large">
      Learn more
    </Button>
  );

  if (tierState === TierState.active) {
    ctaButton = (
      <Button
        variant="contained"
        color="secondary"
        size="large"
        sx={{ color: palette.light.text.primary, boxShadow: 0 }}
      >
        BUY NOW
      </Button>
    );
  }

  /**
   * Returns the appropriate subtext to set based on the ticket tier state.
   * @param {object} data
   * @returns {string}
   */
  const getStateInfoText = (data) => {
    const liveDate = new Date(data.liveDate);
    const closeDate = new Date(data.closeDate);
    switch (tierState) {
      case TierState.active:
        return `Sale ends on ${fDate(closeDate)}`;
      case TierState.pending:
        return `Sale starts on ${fDate(liveDate)}`;
      case TierState.closed:
        return `Sale ended on ${fDate(closeDate)}`;
      case TierState.soldOut:
        return `Sold out`;
      default:
        return `Currently unavailable`;
    }
  };

  return (
    <Card variant="outlined" sx={{ p: '24px', ...sx }}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={6} spacing={3} container direction={'row'} justifyContent={'flex-start'} alignItems="center">
            <Grid item xs="auto">
              <Box sx={{ height: '80px', width: '80px' }}>
                <Image ratio="1/1" alt="token asset" src={contractData.tokenURI} objectFit="contain" />
              </Box>
            </Grid>
            <Grid item xs="auto">
              <Stack>
                <Typography variant="h4">{ticketTier.displayName}</Typography>
                <Typography variant="body2">{truncateString(ticketTier.description)}</Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={6} container direction="row" justifyContent="flex-end" alignItems="center" spacing={6}>
            <Grid item xs="auto">
              {isLoading ? (
                <Skeleton variant="text" animation="wave" width={150} height={40} />
              ) : (
                <Typography variant="h3">{contractData?.primarySalePrice}</Typography>
              )}
            </Grid>
            <Grid item xs="auto">
              {isLoading ? <Skeleton variant="text" animation="wave" width={116} height={48} /> : ctaButton}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <hr />
        </Grid>
        <Grid item xs={12} container direction={'row'} justifyContent="space-between" alignItems="center">
          {/* Perks Display */}
          <Grid
            item
            xs={6}
            container
            direction="row"
            alignItems="center"
            justifyContent={hasEnhancements ? 'flex-start' : 'flex-end'}
            spacing={3}
          >
            {hasEnhancements ? (
              <>
                <Grid item>
                  <Typography variant="h4">✨Perks Available</Typography>{' '}
                </Grid>
                <Grid item>
                  <AvatarGroup>
                    {ticketTier.enhancements.map((perk) => {
                      const iconStyle = ENHANCEMENT_STYLE[perk.type];
                      return (
                        <Avatar key={perk._id} sx={{ bgcolor: iconStyle.bgcolor }}>
                          <Iconify icon={iconStyle.icon} color="white" sx={{ width: 24, height: 24 }} />
                        </Avatar>
                      );
                    })}
                  </AvatarGroup>
                </Grid>
              </>
            ) : (
              <div />
            )}
          </Grid>
          {/* Sale start or end text */}
          <Grid item>
            {isLoading ? (
              <Skeleton variant="rectangular" animation="wave" width={100} height={16} />
            ) : (
              <Typography variant="body1">{getStateInfoText(contractData)}</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
