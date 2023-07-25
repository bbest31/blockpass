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
// utils
import axiosInstance from '../utils/axios';
// config
import { SERVER_API_KEY } from '../config';

// ----------------------------------------------------------------------

export default function Home() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getEvents(controller);
    return () => {
      controller.abort();
    };
  });

  const getEvents = (controller) => {
    axiosInstance
      .get('/events', {
        headers: {
          'blockpass-api-key': SERVER_API_KEY,
        },
      })
      .then((res) => {
        setEvents(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (!controller.signal.aborted) {
          enqueueSnackbar(`Unable to retrieve events.`, { variant: 'error' });
        }
        setIsLoading(false);
      });
  };

  return (
    <Page title="BlockPass">
      <Grid container spacing={4} maxWidth={themeStretch ? false : 'xl'} sx={{ marginX: 12 }}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h1">
            Browse Events
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {/* TODO: Events section */}
          {isLoading ? <GallerySkeleton items={10} /> : events.toString()}
        </Grid>
      </Grid>
    </Page>
  );
}
