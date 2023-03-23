import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Grid, Stack } from '@mui/material';
//
import AccountBillingPaymentMethod from './AccountBillingPaymentMethod';
// import AccountBillingInvoiceHistory from './AccountBillingInvoiceHistory';

// ----------------------------------------------------------------------

AccountBilling.propTypes = {
  metadata: PropTypes.object,
};

export default function AccountBilling({ metadata }) {
  const [open, setOpen] = useState(false);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          {/* <Card sx={{ p: 3 }}>
            <Typography variant="overline" sx={{ mb: 3, display: 'block', color: 'text.secondary' }}>
              Your Plan
            </Typography>
            <Typography variant="h4">Premium</Typography>
            <Box
              sx={{
                mt: { xs: 2, sm: 0 },
                position: { sm: 'absolute' },
                top: { sm: 24 },
                right: { sm: 24 },
              }}
            >
              <Button size="small" color="inherit" variant="outlined" sx={{ mr: 1 }}>
                Cancel plan
              </Button>
              <Button size="small" variant="outlined">
                Upgrade plan
              </Button>
            </Box>
          </Card> */}

          <AccountBillingPaymentMethod
            metadata={metadata}
            isOpen={open}
            onOpen={() => setOpen(!open)}
            onCancel={() => setOpen(false)}
          />
        </Stack>
      </Grid>

      {/* <Grid item xs={12} md={4}>
        <AccountBillingInvoiceHistory invoices={payouts} />
      </Grid> */}
    </Grid>
  );
}
