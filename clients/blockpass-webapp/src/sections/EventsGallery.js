import PropTypes from 'prop-types';
// @mui
import { Box, Card } from '@mui/material';
// sections
import EventsGalleryItem from './EventsGalleryItem';
// ----------------------------------------------------------------------

OrganizationEventGallery.propTypes = {
  gallery: PropTypes.array.isRequired,
  tab: PropTypes.string,
  onClickHandler: PropTypes.func,
};

export default function OrganizationEventGallery({ gallery, tab, onClickHandler }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Card sx={{ p: 3 }}>
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
            ? gallery.map((event) => (
                <OrganizationGalleryItem key={event._id} event={event} onClickHandler={onClickHandler} />
              ))
            : `No ${tab} events`}
        </Box>
      </Card>
    </Box>
  );
}
