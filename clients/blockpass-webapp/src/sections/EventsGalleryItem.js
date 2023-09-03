import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../utils/formatTime';
import cssStyles from '../utils/cssStyles';
// components
import Image from '../components/Image';

const CaptionStyle = styled(CardContent)(({ theme }) => ({
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.common.white,
}));

EventsGalleryItem.propTypes = {
  event: PropTypes.object,
};

export default function EventsGalleryItem({ event }) {
  const { images, name, startDate, location } = event;
  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <Image alt="gallery image" ratio="1/1" src={images.length > 0 ? images[0] : null} />

      <CaptionStyle>
        <div>
          <Typography variant="subtitle1">{name}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            {fDate(startDate)} — {location}
          </Typography>
        </div>
      </CaptionStyle>
    </Card>
  );
}
