import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Button, Divider, Typography, Grid, Link } from '@mui/material';
// components
import Label from '../components/Label';
// utils
import { weiToFormattedEther } from '../utils/formatNumber';
import { fDate } from '../utils/formatTime';
import { TIER_STATE } from '../utils/ticketTierUtils';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

TicketTierInteractionPanel.propTypes = {
  ticketTier: PropTypes.shape({
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
    enhancements: PropTypes.arrayOf(PropTypes.object),
    updatedAt: PropTypes.string,
  }).isRequired,
  state: PropTypes.oneOf(['active', 'paused', 'soldOut', 'pending', 'closed']),
  onBuyTicket: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default function TicketTierInteractionPanel({ ticketTier, state, onBuyTicket, onBack, ...other }) {
  let label;
  let buttons;
  let context;
  switch (state) {
    case TIER_STATE.soldOut:
      // set UI elements for a sold out scenario
      label = (
        <Label color="error" variant="ghost">
          Sold Out
        </Label>
      );
      context = (
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Tickets left
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            0/{ticketTier.supply}
          </Typography>
        </Stack>
      );
      buttons = (
        <Grid container direction="row" spacing={2} sx={{ mt: 2, mb: 3 }} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={onBack}>
              Back
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button fullWidth size="large" color="primary" variant="contained">
              Search Marketplace
            </Button>
          </Grid>
        </Grid>
      );
      break;
    case TIER_STATE.closed:
      // set UI elements for a tier where the sale has closed
      label = (
        <Label color="error" variant="ghost">
          Sale Ended
        </Label>
      );

      context = (
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Sale ended
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            {fDate(ticketTier.closeDate)}
          </Typography>
        </Stack>
      );

      buttons = (
        <Grid container direction="row" spacing={2} sx={{ mt: 2, mb: 3 }} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={onBack}>
              Back
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button fullWidth size="large" color="primary" variant="contained">
              Search Marketplace
            </Button>
          </Grid>
        </Grid>
      );
      break;
    case TIER_STATE.pending:
      // show ui elements for pending state

      context = (
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Available
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            {fDate(ticketTier.liveDate)}
          </Typography>
        </Stack>
      );

      buttons = (
        <Grid container direction="row" spacing={2} sx={{ mt: 2, mb: 3 }} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={onBack}>
              Back
            </Button>
          </Grid>
        </Grid>
      );
      break;
    default:
      // set UI for active tier
      context = (
        <div>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              Tickets left
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
              {ticketTier.totalTicketsForSale}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              Sale ends
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
              {fDate(ticketTier.closeDate)}
            </Typography>
          </Stack>
        </div>
      );

      buttons = (
        <Grid container direction="row" spacing={2} sx={{ mt: 2, mb: 3 }} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={onBack}>
              Back
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button fullWidth size="large" color="secondary" variant="contained" onClick={onBuyTicket}>
              BUY NOW
            </Button>
          </Grid>
        </Grid>
      );
      break;
  }
  return (
    <RootStyle {...other}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        {ticketTier.displayName}&nbsp;
        {label}
      </Typography>

      <Typography variant="h4" sx={{ mb: 3 }}>
        {weiToFormattedEther(ticketTier.primarySalePrice)} ETH
      </Typography>

      <Divider sx={{ borderStyle: 'solid' }} />

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          Contract
        </Typography>
        <Link
          variant="subtitle1"
          color="info.dark"
          target="_blank"
          href={`https://etherscan.io/address/${ticketTier.contract}`}
          sx={{ mt: 0.5 }}
        >
          {ticketTier?.contract ? ticketTier.contract.slice(0, 6) : null}...
          {ticketTier?.contract ? ticketTier.contract.substr(ticketTier.contract.length - 4) : null}
        </Link>
      </Stack>

      {context}

      <Divider sx={{ borderStyle: 'solid' }} />
      {buttons}
    </RootStyle>
  );
}
