import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Grid, Link, Typography } from '@mui/material';
// components
import Iconify from '../components/Iconify';
// config
import { ENHANCEMENT_STYLE } from '../config';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

EnhancementItem.propTypes = {
  enhancement: PropTypes.object,
  onClickHandler: PropTypes.func,
};

export default function EnhancementItem({ enhancement, onClickHandler }) {
  const type = ENHANCEMENT_STYLE[enhancement.type.toLowerCase()];
  return (
    <Grid item xs={12} md={4}>
      <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
        <IconWrapperStyle sx={{ backgroundColor: type.bgcolor }}>
          <Iconify icon={type.icon} width={36} height={36} sx={{ color: 'white' }} />
        </IconWrapperStyle>
        <Typography variant="subtitle1" gutterBottom>
          <Link onClick={() => onClickHandler(enhancement)} sx={{ cursor: 'pointer', color: 'info.main' }}>
            {enhancement.title}
          </Link>
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>{enhancement.shortDesc}</Typography>
      </Box>
    </Grid>
  );
}
