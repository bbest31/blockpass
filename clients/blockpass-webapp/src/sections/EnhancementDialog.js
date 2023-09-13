import PropTypes from 'prop-types';
// @mui
import { Grid, Dialog, Typography, Button } from '@mui/material';
// utils
import { fDate } from '../utils/formatTime';

// ----------------------------------------------------------------------

EnhancementDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  enhancement: PropTypes.object.isRequired,
};

export default function EnhancementDialog({ open, showHandler, enhancement }) {
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={showHandler}>
      <Grid container sx={{ p: 2.5 }}>
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ mb: 3 }}>
            {enhancement.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            {enhancement.shortDesc}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            {enhancement.longDesc}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
            Expires: {open ? fDate(enhancement.expiry) : null}
          </Typography>
        </Grid>
        <Grid container item xs={12} justifyContent={'flex-end'}>
          <Grid item xs="auto">
            <Button size="medium" variant="outline" color="inherit" onClick={showHandler}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}
