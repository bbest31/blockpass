import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// sections
import EventsGalleryItem from './EventsGalleryItem';
// ----------------------------------------------------------------------

EventGallery.propTypes = {
  gallery: PropTypes.array.isRequired,
  onClickHandler: PropTypes.func,
};

export default function EventGallery({ gallery, onClickHandler }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {gallery.length !== 0
          ? gallery.map((event) => <EventsGalleryItem key={event._id} event={event} onClickHandler={onClickHandler} />)
          : `No events`}
      </Box>
    </Box>
  );
}
