import PropTypes from 'prop-types';
// @mui
import { Box, Card } from '@mui/material';
// sections
import OrganizationGalleryItem from './OrganizationGalleryItem';
// ----------------------------------------------------------------------

OrganizationEventGallery.propTypes = {
  gallery: PropTypes.array.isRequired,
  tab: PropTypes.string,
};

export default function OrganizationEventGallery({ gallery, tab }) {
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
          {gallery.length !== 0 ? gallery.map((event) => (
            <OrganizationGalleryItem key={event._id} event={event} />
          )) : `No ${tab} events`}
        </Box>
      </Card>
    </Box>
  );
}
