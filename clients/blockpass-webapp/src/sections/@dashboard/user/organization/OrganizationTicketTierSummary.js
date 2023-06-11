import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Link, Stack, Button, Rating, Divider, IconButton, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import SocialsButton from '../../../../components/SocialsButton';
import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFSelect } from '../../../../components/hook-form';

import { fDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

OrganizationTicketTierSummary.propTypes = {
  ticketTierDetail: PropTypes.shape({
    tokenURI: PropTypes.string,
    name: PropTypes.string,
    supply: PropTypes.string,
    symbol: PropTypes.string,
    marketplaceContract: PropTypes.string,
    eventOrganizer: PropTypes.string,
    totalTicketsForSale: PropTypes.string,
    primarySalePrice: PropTypes.string,
    secondaryMarkup: PropTypes.string,
    liveDate: PropTypes.string,
    closeDate: PropTypes.string,
    eventEndDate: PropTypes.string,
    paused: PropTypes.bool,
    _id: PropTypes.string,
    contract: PropTypes.string,
    description: PropTypes.string,
    displayName: PropTypes.string,
    enhancements: PropTypes.arrayOf(PropTypes.string),
    updatedAt: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  pauseTicketSaleHandler: PropTypes.func,
  resumeTicketSaleHandler: PropTypes.func,
  closeTicketSaleHandler: PropTypes.func,
  isClosed: PropTypes.bool,
  isPaused: PropTypes.bool,
};

export default function OrganizationTicketTierSummary({
  ticketTierDetail,
  isLoading,
  pauseTicketSaleHandler,
  resumeTicketSaleHandler,
  closeTicketSaleHandler,
  isClosed,
  isPaused,
  ...other
}) {
  const theme = useTheme();

  const methods = useForm({});

  const contractMethods = {
    pause: pauseTicketSaleHandler,
    resume: resumeTicketSaleHandler,
    close: closeTicketSaleHandler,
  };

  const displayContractState = () => {
    let color = 'success';
    let state = 'active';

    if (isClosed) {
      color = 'error';
      state = 'closed';
    } else if (isPaused) {
      color = 'warning';
      state = 'paused';
    }

    return (
      <Label
        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
        color={color}
        sx={{ textTransform: 'uppercase' }}
      >
        {sentenceCase(state)}
      </Label>
    );
  };

  const displayPauseButton = () => {
    let buttonText = 'Pause';
    let onClickHandler = pauseTicketSaleHandler;
    let color = 'warning';

    if (isPaused) {
      buttonText = 'Resume';
      onClickHandler = resumeTicketSaleHandler;
      color = 'success';
    }

    return (
      <Button fullWidth size="large" color={color} variant="contained" onClick={onClickHandler}>
        {buttonText}
      </Button>
    );
  };

  return (
    <RootStyle {...other}>
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="h5">{ticketTierDetail.name}&nbsp;</Typography>
        {displayContractState()}
      </Stack>

      <Typography variant="h4" sx={{ mb: 3 }}>
        {ticketTierDetail.primarySalePrice} Wei
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          Contract
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          {ticketTierDetail.marketplaceContract.slice(0, 6)}...
          {ticketTierDetail.marketplaceContract.substr(ticketTierDetail.marketplaceContract.length - 4)}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          No. of owners
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          {ticketTierDetail.totalTicketsForSale}/{ticketTierDetail.supply}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          Sale Starts
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          {fDate(ticketTierDetail.liveDate)}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          Sale Ends
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          {fDate(ticketTierDetail.eventEndDate)}
        </Typography>
      </Stack>

      {!isClosed && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
            {displayPauseButton()}
            <Button fullWidth size="large" color="error" variant="contained" onClick={closeTicketSaleHandler}>
              Close
            </Button>
          </Stack>
        </>
      )}
    </RootStyle>
  );
}
