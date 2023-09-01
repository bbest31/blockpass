import PropTypes from 'prop-types';
// @mui
import { Skeleton, Grid } from '@mui/material';

GallerySkeleton.propTypes = {
  items: PropTypes.number.isRequired,
  variant: PropTypes.string,
  w: PropTypes.number,
  h: PropTypes.number,
};

export default function GallerySkeleton({ items, w, h, variant }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: items }, (_, index) => (
        <Grid key={`item${index}`} item>
          <Skeleton variant={variant || 'rounded'} animation="wave" width={w || 210} height={h || 210} />
        </Grid>
      ))}
    </Grid>
  );
}
