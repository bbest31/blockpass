import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
// @mui
import { Typography, Grid } from '@mui/material';
// hook
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
// sections

// utils
import axiosInstance from '../utils/axios';
// config
import { SERVER_API_KEY } from '../config';

// ----------------------------------------------------------------------

export default function EventPreview() {
  const { enqueueSnackbar } = useSnackbar();
  const { eventId } = useParams();
  const { themeStretch } = useSettings();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getEventById(controller);
    return () => {
      controller.abort();
    };
  });

  const getEventById = (controller) => {
    axiosInstance
      .get(`/events/${eventId}`, {
        headers: {
          'blockpass-api-key': SERVER_API_KEY,
        },
      })
      .then((res) => {
        setEvent(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (!controller.signal.aborted) {
          enqueueSnackbar(`Unable to retrieve event.`, { variant: 'error' });
        }
        setIsLoading(false);
      });
  };

  return (
    <Page title={event ? event.name : 'Event Preview'}>
      <Grid container spacing={4} maxWidth={themeStretch ? false : 'xl'} sx={{ marginX: 12 }}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h1">
            Event Preview
          </Typography>
        </Grid>
      </Grid>
    </Page>
  );
}
