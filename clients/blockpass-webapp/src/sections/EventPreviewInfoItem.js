import PropTypes from 'prop-types';
// @mui
import { Typography, Grid, Box } from '@mui/material';
// components
import Iconify from '../components/Iconify';
// theme
import palette from '../theme/palette';
// ----------------------------------------------------------------------

EventPreviewInfoItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtext: PropTypes.string,
  icon: PropTypes.string.isRequired,
};

export default function EventPreviewInfoItem({ title, subtext, icon }) {
  return (
    <Grid container>
      <Grid item xs={1} container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={48}
          height={48}
          borderRadius="50%"
          bgcolor={palette.light.info.lighter}
          color="white"
          component="span"
        >
          <Iconify icon={icon} color={palette.light.info.main} sx={{ width: 28, height: 28 }} />
        </Box>
      </Grid>
      <Grid item xs={11}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h1">
              {title}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" component="p">
            {subtext}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
