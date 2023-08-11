import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// @mui
import { Box, Button, Grid } from '@mui/material';
// sections
import EventsGalleryItem from './EventsGalleryItem';
// componetns
import Iconify from '../components/Iconify';
// ----------------------------------------------------------------------

EventGallery.propTypes = {
  gallery: PropTypes.array.isRequired,
};

export default function EventGallery({ gallery }) {
  const [sortOrder, setSortOrder] = useState('asc');
  const sortedEvents = gallery.slice().sort((a, b) => {
    // Custom sorting logic based on sortOrder state
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);

    if (sortOrder === 'asc') {
      return dateA - dateB;
    }
    return dateB - dateA;
  });

  const handleSortToggle = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12} sx={{ marginY: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <Button
            variant="text"
            color="inherit"
            sx={{ marginY: 1 }}
            onClick={handleSortToggle}
            endIcon={
              <Iconify
                icon={sortOrder === 'asc' ? 'ic:baseline-arrow-upward' : 'ic:baseline-arrow-downward'}
                height={20}
                width={20}
              />
            }
          >
            Sort By: Date
          </Button>
        </Grid>
      </Grid>
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
          ? sortedEvents.map((event) => (
              <Link key={event._id} to={`/event/${event._id}`}>
                <EventsGalleryItem event={event} />
              </Link>
            ))
          : `No events`}
      </Box>
    </Box>
  );
}
