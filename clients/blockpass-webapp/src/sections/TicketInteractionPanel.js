import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Button, Divider, Typography, Grid, Link } from '@mui/material';
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

TicketInteractionPanel.propTypes = {
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
  token: PropTypes.number.isRequired,
  event: PropTypes.object,
  transferTicketHandler: PropTypes.func.isRequired,
  sellTicketHandler: PropTypes.func.isRequired,
  updateSalePriceHandler: PropTypes.func.isRequired,
  cancelSaleHandler: PropTypes.func.isRequired,
  isForSale: PropTypes.bool,
};

export default function TicketInteractionPanel({
  ticketTier,
  token,
  event,
  transferTicketHandler,
  sellTicketHandler,
  updateSalePriceHandler,
  cancelSaleHandler,
  isForSale,
  ...other
}) {
  const navigate = useNavigate();

  return (
    <RootStyle {...other}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        {event?.name || ticketTier.name}&nbsp;
      </Typography>

      <Typography variant="h4" sx={{ mb: 3 }}>
        {ticketTier.displayName}
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
          {ticketTier.contract.slice(0, 6)}...
          {ticketTier.contract.substr(ticketTier.contract.length - 4)}
        </Link>
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          Token ID
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
          {token}
        </Typography>
      </Stack>

      <Divider sx={{ borderStyle: 'solid' }} />
      {isForSale ? (
        <Grid container direction="row" spacing={2} sx={{ mt: 2, mb: 3 }} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Button fullWidth size="large" color="inherit" variant="contained" onClick={updateSalePriceHandler}>
              Update Price
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button fullWidth size="large" color="inherit" variant="contained" onClick={cancelSaleHandler}>
              Cancel Sale
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Grid container direction="row" spacing={2} sx={{ mt: 2, mb: 3 }} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={transferTicketHandler}>
              Transfer
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={sellTicketHandler}>
              Sell
            </Button>
          </Grid>
        </Grid>
      )}

      {event && (
        <Grid container justifyContent="center">
          <Grid item>
            <Button
              variant="text"
              sx={{
                '&:hover': {
                  background: 'none', // Remove any background change on hover
                  boxShadow: 'none', // Remove any shadow on hover
                },
              }}
              onClick={() => navigate(`/event/${event._id}`)}
            >
              Event Details
            </Button>
          </Grid>
        </Grid>
      )}
    </RootStyle>
  );
}
