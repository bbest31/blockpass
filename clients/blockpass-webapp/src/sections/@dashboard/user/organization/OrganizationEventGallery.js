import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, IconButton, Typography, CardContent, InputAdornment } from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
import cssStyles from '../../../../utils/cssStyles';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

OrganizationEventGallery.propTypes = {
  gallery: PropTypes.array.isRequired,
  title: PropTypes.string,
};

export default function OrganizationEventGallery({ gallery }) {
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
          {gallery.map((image) => (
            <GalleryItem key={image._id} image={image} />
          ))}
        </Box>
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------

GalleryItem.propTypes = {
  image: PropTypes.object,
  onOpenLightbox: PropTypes.func,
};

function GalleryItem({ image }) {
  const { img, name, startDate } = image;
  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <Image alt="gallery image" ratio="1/1" src={img} />

      <CaptionStyle>
        <div>
          <Typography variant="subtitle1">{name}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            {fDateTime(startDate)}
          </Typography>
        </div>
        <IconButton color="inherit">
          <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
        </IconButton>
      </CaptionStyle>
    </Card>
  );
}
