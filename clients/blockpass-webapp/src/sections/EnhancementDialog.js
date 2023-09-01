import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Grid, Avatar, Dialog, Typography, Button } from '@mui/material';
// components
import Iconify from '../components/Iconify';
// utils
import { fDate } from '../utils/formatTime';
// config
import { ENHANCEMENT_STYLE } from '../config';

// ----------------------------------------------------------------------

EnhancementDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func.isRequired,
  enhancement: PropTypes.object.isRequired,
};

export default function EnhancementDialog({ open, showHandler, enhancement }) {
  const [iconStyle] = useState(open ? ENHANCEMENT_STYLE[enhancement.type.toLowerCase()] : {});
  const onCloseHandler = () => {
    showHandler();
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={showHandler}>
      <Grid container sx={{ p: 2.5 }}>
        <Grid container direction={'row'} item xs={12} spacing={2}>
          <Grid item xs={'auto'}>
            <Avatar sx={{ bgcolor: iconStyle?.bgcolor }}>
              <Iconify icon={iconStyle?.icon} color="white" sx={{ width: 24, height: 24 }} />
            </Avatar>
          </Grid>
          <Grid item xs={'auto'}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              {enhancement.title}
            </Typography>
          </Grid>
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
            <Button size="medium" variant="outline" color="inherit" onClick={onCloseHandler}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}
