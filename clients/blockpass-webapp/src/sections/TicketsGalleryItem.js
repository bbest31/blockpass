import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Card, Typography, CardContent, Avatar, AvatarGroup, IconButton } from '@mui/material';
// utils
import cssStyles from '../utils/cssStyles';
// components
import Image from '../components/Image';
import Iconify from '../components/Iconify';
// config
import { ENHANCEMENT_STYLE } from '../config';

const CaptionStyle = styled(CardContent)(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
}));

TicketsGalleryItem.propTypes = {
  token: PropTypes.number.isRequired,
  ticketTier: PropTypes.object.isRequired,
};

export default function TicketsGalleryItem({ token, ticketTier }) {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/tickets/${ticketTier._id}/token/${token}`);
  };

  /**
   * TODO: Expand menu options for ticket item
   */
  const handleMenuButtonOnClick = () => {};

  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }} onClick={handleOnClick}>
      <Image alt="token uri" ratio="1/1" src={ticketTier.tokenURI || null} />
      <CaptionStyle>
        <Grid container direction="row" rowSpacing={1}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">{ticketTier.name}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              {ticketTier.displayName} — #{token}
            </Typography>
          </Grid>
          <Grid container item xs={12} alignItems={'center'} justifyContent={'space-between'}>
            <Grid item xs="auto">
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
            <Grid item xs="auto">
              <IconButton aria-label="more" onClick={handleMenuButtonOnClick}>
                <Iconify icon="mdi:dots-horizontal" color="white" sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </CaptionStyle>
    </Card>
  );
}
