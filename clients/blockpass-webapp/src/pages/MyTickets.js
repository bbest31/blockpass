import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { capitalCase } from 'change-case';
import { useAccount } from 'wagmi';
// @mui
import { Typography, Grid, Tab, Tabs, Box } from '@mui/material';
// hook
import useSettings from '../hooks/useSettings';
import useTabs from '../hooks/useTabs';
// components
import Page from '../components/Page';
// sections
import GallerySkeleton from '../components/GallerySkeleton';
import TicketsGallery from '../sections/TicketsGallery';
// utils
import axiosInstance from '../utils/axios';

// ----------------------------------------------------------------------

export default function MyTickets() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const { address } = useAccount();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTab, onChangeTab } = useTabs('upcoming_events');

  const TABS = [
    {
      value: 'upcoming_events',
      component: isLoading ? (
        <GallerySkeleton items={6} h={350} w={350} />
      ) : (
        <TicketsGallery gallery={tickets.filter((ticket) => new Date(ticket.tier.eventEndDate) > Date.now())} />
      ),
    },
    {
      value: 'past_events',
      component: isLoading ? (
        <GallerySkeleton items={6} h={350} w={350} />
      ) : (
        <TicketsGallery gallery={tickets.filter((ticket) => new Date(ticket.tier.eventEndDate) <= Date.now())} />
      ),
    },
    {
      value: 'listed_for_sale',
      component: isLoading ? (
        <GallerySkeleton items={6} h={350} w={350} />
      ) : (
        <TicketsGallery gallery={tickets.filter((ticket) => ticket.isForSale === true)} />
      ),
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
    axiosInstance
      .get(`/attendees/${address}/tickets`, { withCredentials: true })
      .then((res) => {
        setTickets(res.data);
        console.log(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (!controller.signal.aborted) {
          enqueueSnackbar(`Unable to retrieve tickets.`, { variant: 'error' });
        }
        setIsLoading(false);
      });
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
