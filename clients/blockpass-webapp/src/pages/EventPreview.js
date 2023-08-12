import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
// @mui
import { Typography, Grid, Button, Skeleton } from '@mui/material';
// hook
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import EventPreviewInfoItem from '../sections/EventPreviewInfoItem';
import EventPreviewHero from '../sections/EventPreviewHero';
// utils
import axiosInstance from '../utils/axios';
import { fDateWithTimeZone, fDateTimespanWithTimeZone, fDate } from '../utils/formatTime';
// config
import { SERVER_API_KEY, GMAPS_API_KEY } from '../config';

// ----------------------------------------------------------------------

export default function EventPreview() {
  const { enqueueSnackbar } = useSnackbar();
  const { eventId } = useParams();
  const { themeStretch } = useSettings();
  const [event, setEvent] = useState(null);
  const [eventOrganizer, setEventOrganizer] = useState(null);
  const [timeline, setTimeline] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getEventById(controller);
    getEventOrganizer(controller);
    return () => {
      controller.abort();
    };
  }, []);

  const getEventById = (controller) => {
    axiosInstance
      .get(`/events/${eventId}`, {
        headers: {
          'blockpass-api-key': SERVER_API_KEY,
        },
      })
      .then((res) => {
        setEvent(res.data);
        setTimeline(formatEventTimeline(res.data));
        console.log(res.data);
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

  const getEventOrganizer = (controller) => {
    axiosInstance
      .get(`/events/${eventId}/organizer`, {
        headers: {
          'blockpass-api-key': SERVER_API_KEY,
        },
      })
      .then((res) => {
        setEventOrganizer(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        if (!controller.signal.aborted) {
          enqueueSnackbar(`Unable to retrieve event organzier.`, { variant: 'warning' });
        }
      });
  };

  const formatEventTimeline = (evt) => {
    if (evt.endDate !== undefined) {
      if (areDatesOnSameDay(new Date(evt.startDate), new Date(evt.endDate))) {
        return fDateTimespanWithTimeZone(evt.startDate, evt.endDate);
      }
      return `${fDate(evt.startDate)}—${fDate(evt.endDate)}`;
    }
    return fDateWithTimeZone(evt.startDate);
  };

  function areDatesOnSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  return (
    // TODO: figure out how to remove gap between hero and navbar
    <Page title={event ? event.name : 'Event Preview'}>
      {/* Event Hero */}
      {isLoading ? (
        <Skeleton variant="rectangular" animation="wave" width="100%" height={500} />
      ) : (
        <EventPreviewHero event={event} organizer={eventOrganizer} />
      )}
      <Grid container spacing={4} sx={{ paddingX: 12, marginTop: 4 }}>
        {/* About section */}
        <Grid item container xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h3" component="h1">
              About
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" component="p">
              <strong>{event?.description}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="info"
              size="medium"
              href={event?.website}
              target="_blank"
              startIcon={<Iconify icon="ic:baseline-launch" />}
            >
              Visit website
            </Button>
          </Grid>
        </Grid>
        {/* Ticket tier list items */}
        {/* time and place */}
        <Grid item container xs={12} spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3" component="h1">
              Time and place
            </Typography>
          </Grid>
          <Grid item container xs={12} spacing={3}>
            <Grid item xs={12} md={6}>
              <EventPreviewInfoItem title="Date and time" subtext={timeline} icon="ic:baseline-calendar-today" />
            </Grid>
            <Grid item xs={12} md={6}>
              <EventPreviewInfoItem title="Location" subtext={event?.location} icon="ic:baseline-location-on" />
            </Grid>
          </Grid>
          <Grid item container justifyContent="center" xs={12}>
            <iframe
              title="location"
              width="60%"
              height="500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${GMAPS_API_KEY}${
                event?.location ? `&q=${encodeURIComponent(event?.location)}` : ''
              }`}
            />
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
}
