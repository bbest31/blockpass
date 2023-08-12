import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Typography, Grid, Button, Card, Box, Stack } from '@mui/material';
// components
import Iconify from '../components/Iconify';
// theme
import palette from '../theme/palette';
// utils
import { fDate } from '../utils/formatTime';

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

/**
 *
 * @param {string} type
 * @returns {object}
 */
const getEnhancementStyle = (type) => {
  let bgColor;
  let icon;
  let iconColor;

  switch (type) {
    case '':
      break;

    default:
      break;
  }
};

export default function EventPreviewTicket({ ticketTier, sx }) {
  const [contractData, setContractData] = useState(null);

  const hasEnhancements = ticketTier.enhancements.length > 0;
  return (
    <Card variant="outlined" sx={{ p: '24px', ...sx }}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={6} container>
            <Grid item xs={12}>
              <Typography variant="h4">{ticketTier.displayName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">{truncateString(ticketTier.description)}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={6} container direction="row" justifyContent="flex-end" alignItems="center" spacing={6}>
            <Grid item>
              {/* TODO: show primary sale price */}
              <Typography variant="h3">$200</Typography>
            </Grid>
            <Grid item>
              {/* TODO: show buy now button if active otherwise show Learn More */}
              <Button variant="text" size="large">
                Learn more
              </Button>
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
                  <Stack direction="row" spacing={1}>
                    {ticketTier.enhancements.map((perk) => {
                      const iconStyle = ENHANCEMENT_STYLE[perk.type];
                      return (
                        <Box
                          key={perk._id}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          width={48}
                          height={48}
                          borderRadius="50%"
                          bgcolor={iconStyle.bgcolor}
                          color="white"
                          component="span"
                        >
                          <Iconify icon={iconStyle.icon} color="white" sx={{ width: 28, height: 28 }} />
                        </Box>
                      );
                    })}
                  </Stack>
                </Grid>
              </>
            ) : (
              <div />
            )}
          </Grid>
          {/* Sale start or end text */}
          <Grid item>
            {/* TODO: show when the ticket tier is on sale, when it ends, or when it ended */}
            <Typography variant="body1">Sales starts on {fDate(new Date())}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
