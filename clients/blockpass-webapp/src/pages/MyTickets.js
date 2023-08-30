import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { capitalCase } from 'change-case';
// @mui
import { Typography, Grid, Tab, Tabs, Box } from '@mui/material';
// hook
import useSettings from '../hooks/useSettings';
import useTabs from '../hooks/useTabs';
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
  const { currentTab, onChangeTab } = useTabs('upcoming_events');

  const TABS = [
    {
      value: 'upcoming_events',
      component: <h1>Upcoming Events</h1>,
    },
    {
      value: 'past_events',
      component: <h1>Past Events</h1>,
    },
    {
      value: 'listed_for_sale',
      component: <h1>Listed For Sale</h1>,
    },
  ];

  const handleChangeTab = (event, value) => {
    onChangeTab(event, value);
  };

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
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={currentTab}
            onChange={handleChangeTab}
          >
            {TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} value={tab.value} />
            ))}
          </Tabs>

          <Box sx={{ mb: 5 }} />

          {TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Grid>
      </Grid>
    </Page>
  );
}
