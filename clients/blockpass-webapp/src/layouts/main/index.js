import { Outlet } from 'react-router-dom';
// @mui
import { Box, Container, Typography, Stack } from '@mui/material';
// components
import Logo from '../../components/Logo';
//
import MainHeader from './MainHeader';

// ----------------------------------------------------------------------

export default function MainLayout() {
  return (
    <Stack spacing={16} sx={{ minHeight: 1 }}>
      <MainHeader />

      <Outlet />

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          py: 5,
          textAlign: 'center',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Container>
          <Logo sx={{ mb: 1, mx: 'auto' }} />

          <Typography variant="caption" component="p">
            © All rights reserved
          </Typography>
        </Container>
      </Box>
    </Stack>
  );
}
