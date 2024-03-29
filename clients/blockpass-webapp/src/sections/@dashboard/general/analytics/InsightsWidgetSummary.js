// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography, Skeleton } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

InsightsWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  sx: PropTypes.object,
};

export default function InsightsWidgetSummary({
  title,
  total,
  icon,
  color = 'primary',
  loading,
  prefix,
  suffix,
  sx,
  ...other
}) {
  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <IconWrapperStyle
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
              theme.palette[color].dark,
              0.24
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </IconWrapperStyle>

      {
        <Typography variant="h3" align="center">
          {loading ? (
            <Skeleton
              width={60}
              animation="pulse"
              variant="text"
              sx={{ bgcolor: (theme) => theme.palette[color].light, margin: 'auto' }}
            />
          ) : (
            `${prefix || ''}${fShortenNumber(total)}${suffix || ''}`
          )}
        </Typography>
      }

      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </Card>
  );
}
