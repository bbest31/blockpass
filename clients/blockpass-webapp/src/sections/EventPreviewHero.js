import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Avatar, Box, Typography, Stack } from '@mui/material';
// components
import Image from '../components/Image';
// utils
import { fDate } from '../utils/formatTime';
// ----------------------------------------------------------------------

const OverlayStyle = styled('h1')(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 9,
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.72),
}));

const TitleStyle = styled('h1')(({ theme }) => ({
  ...theme.typography.h2,
  bottom: 1,
  zIndex: 10,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(10),
  },
}));

const FooterStyle = styled('div')(({ theme }) => ({
  bottom: 0,
  zIndex: 10,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  alignItems: 'flex-start',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('sm')]: {
    paddingRight: theme.spacing(3),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(10),
  },
}));

// ----------------------------------------------------------------------

EventPreviewHero.propTypes = {
  event: PropTypes.object.isRequired,
  organizer: PropTypes.object,
};

export default function EventPreviewHero({ event, organizer }) {
  const { name, startDate, location, images } = event;
  return (
    <Box sx={{ position: 'relative', maxHeight: '750px', overflow: 'hidden' }}>
      <FooterStyle>
        <Typography variant="h1" sx={{ color: 'common.white', mb: 2 }}>
          {name}
        </Typography>
        <Typography variant="h4" sx={{ color: 'common.white', mb: 2 }}>
          {fDate(startDate)}—{location}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {organizer && organizer.branding.logo_url && (
            <Avatar alt={organizer.display_name} src={organizer.branding.logo_url} sx={{ width: 48, height: 48 }} />
          )}
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5" sx={{ color: 'common.white' }}>
              {organizer.display_name}
            </Typography>
          </Box>
        </Box>
      </FooterStyle>

      <OverlayStyle />
      <Image alt="event cover" src={images[0]} ratio="16/9" />
    </Box>
  );
}
