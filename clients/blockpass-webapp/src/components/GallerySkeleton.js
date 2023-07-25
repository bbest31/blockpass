import PropTypes from 'prop-types';
// @mui
import { Skeleton, Grid } from '@mui/material';

GallerySkeleton.propTypes = {
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
  w: PropTypes.number,
  h: PropTypes.number,
};

export default function GallerySkeleton({ items, w, h }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: items }, (_, index) => (
        <Grid item>
          <Skeleton key={index} variant="rectangular" animation="wave" width={w || 210} height={h || 210} />
        </Grid>
      ))}
    </Grid>
  );
}
