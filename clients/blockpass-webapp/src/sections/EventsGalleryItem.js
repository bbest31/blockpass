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
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
}));

EventsGalleryItem.propTypes = {
  event: PropTypes.object,
  onClickHandler: PropTypes.func,
};

export default function EventsGalleryItem({ event, onClickHandler }) {
  const { img, name, startDate, location } = event;
  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }} onClick={() => onClickHandler(event)}>
      <Image alt="gallery image" ratio="1/1" src={img} />

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
