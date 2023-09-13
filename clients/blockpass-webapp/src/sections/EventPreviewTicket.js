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
import { TIER_STATE, determineTierState } from '../utils/ticketTierUtils';
import axiosInstance from '../utils/axios';
// config
import { SERVER_API_KEY, ENHANCEMENT_STYLE } from '../config';

EventPreviewTicket.propTypes = {
  ticketTier: PropTypes.object.isRequired,
  sx: PropTypes.object,
  onSelected: PropTypes.func.isRequired,
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

export default function EventPreviewTicket({ ticketTier, sx, onSelected }) {
  const [contractData, setContractData] = useState(null);
  const [tierState, setTierState] = useState(TIER_STATE.closed);
  const [isLoading, setIsLoading] = useState(true);


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
    <Button variant="text" size="large" onClick={() => onSelected(contractData)}>
      Learn more
    </Button>
  );

  if (tierState === TIER_STATE.active) {
    ctaButton = (
      <Button
        variant="contained"
        color="secondary"
        size="large"
        sx={{ color: palette.light.text.primary, boxShadow: 0 }}
        onClick={() => onSelected(contractData)}
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
      case TIER_STATE.active:
        return `Sale ends on ${fDate(closeDate)}`;
      case TIER_STATE.pending:
        return `Sale starts on ${fDate(liveDate)}`;
      case TIER_STATE.closed:
        return `Sale ended on ${fDate(closeDate)}`;
      case TIER_STATE.soldOut:
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
              {isLoading ? (
                <Skeleton variant="rectangular" animation="wave" width="80px" height="80px" />
              ) : (
                <Box sx={{ height: '80px', width: '80px' }}>
                  <Image ratio="1/1" alt="token asset" src={contractData.tokenURI} objectFit="contain" />
                </Box>
              )}
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
                      const iconStyle = ENHANCEMENT_STYLE[perk.type.toLowerCase()];
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
