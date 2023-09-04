import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box } from '@mui/material';
// sections
import TicketsGalleryItem from './TicketsGalleryItem';
// ----------------------------------------------------------------------

TicketsGallery.propTypes = {
  gallery: PropTypes.array.isRequired,
};

export default function TicketsGallery({ gallery }) {
  const [sortOrder] = useState('asc');
  const sortedTickets = gallery.slice().sort((a, b) => {
    // Custom sorting logic based on sortOrder state
    const dateA = new Date(a.tier.eventEndDate);
    const dateB = new Date(b.tier.eventEndDate);

    if (sortOrder === 'asc') {
      return dateA - dateB;
    }
    return dateB - dateA;
  });

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
          ? sortedTickets.map((ticket) => (
              <TicketsGalleryItem
                key={`${ticket.token}-${ticket.tier._id}`}
                token={ticket.token}
                ticketTier={ticket.tier}
              />
            ))
          : `No tickets`}
      </Box>
    </Box>
  );
}
