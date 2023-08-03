import PropTypes from 'prop-types';
// @mui
import { Skeleton, Grid } from '@mui/material';

GallerySkeleton.propTypes = {
  items: PropTypes.number.isRequired,
  w: PropTypes.number,
  h: PropTypes.number,
};

export default function GallerySkeleton({ items, w, h }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: items }, (_, index) => (
        <Grid key={`item${index}`} item>
          <Skeleton variant="rectangular" animation="wave" width={w || 210} height={h || 210} />
        </Grid>
      ))}
    </Grid>
  );
}
