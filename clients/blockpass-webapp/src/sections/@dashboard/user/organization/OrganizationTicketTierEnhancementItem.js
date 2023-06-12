// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Grid, Link, Typography } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

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

const icons = {
  access: "mingcute:time-fill",
  discount: "ic:baseline-discount",
  gift: "tabler:gift",
  reward: "material-symbols:rewarded-ads"
}

export default function OrganizationTickerTierEnhancementItem({ enhancement, onClickHandler }) {
  return (
    <Grid item xs={12} md={4}>
      <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
        <IconWrapperStyle>
          <Iconify icon={icons[enhancement.type.toLowerCase()]} width={36} height={36} />
        </IconWrapperStyle>
        <Typography variant="subtitle1" gutterBottom>
          <Link onClick={() => onClickHandler(enhancement)} sx={{ cursor: 'pointer', color: '#008DF9' }}>
            {enhancement.title}
          </Link>
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>{enhancement.shortDesc}</Typography>
      </Box>
    </Grid>
  );
}
