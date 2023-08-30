import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { Typography, Grid } from '@mui/material';
// hook
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
// sections
import GallerySkeleton from '../components/GallerySkeleton';
import EventsGallery from '../sections/EventsGallery';
// utils
import axiosInstance from '../utils/axios';
// config
import { SERVER_API_KEY } from '../config';

// ----------------------------------------------------------------------

export default function MyTickets() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const { account, setAccount } = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getTickets(controller);
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, []);

  const getTickets = (controller) => {
    // axiosInstance
    //   .get(`/attendees/${account}/tickets`)
    //   .then((res) => {
    //     setTickets(res.data);
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     if (!controller.signal.aborted) {
    //       enqueueSnackbar(`Unable to retrieve tickets.`, { variant: 'error' });
    //     }
    //     setIsLoading(false);
    //   });
  };

  return (
    <Page title="BlockPass | My Tickets">
      <Grid container spacing={4} maxWidth={themeStretch ? false : 'xl'} sx={{ marginX: 12 }}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h1">
            My Tickets
          </Typography>
        </Grid>
        <Grid item xs={12}>
          Tickets
          {/* {isLoading ? <GallerySkeleton items={6} /> : <EventsGallery gallery={tickets} />} */}
        </Grid>
      </Grid>
    </Page>
  );
}
