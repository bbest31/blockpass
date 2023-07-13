import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Skeleton } from '@mui/material';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useAuth from '../../../../hooks/useAuth';
// _mock_
import { _analyticPost, _analyticOrderTimeline, _analyticTraffic } from '../../../../_mock';
// sections
import {
  AnalyticsTasks,
  AnalyticsNewsUpdate,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../general/analytics';

// ----------------------------------------------------------------------

export default function OrganizationEventInsights({ eventItem }) {
  const event = eventItem;
  const theme = useTheme();
  const { organization, getAccessToken } = useAuth();

  const { themeStretch } = useSettings();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getEventInsights(event._id);
  }, []);

  const getEventInsights = async () => {
    setIsLoading(true);
    const token = await getAccessToken();

    // for each ticket tier retrieve the analytics data
    event.ticketTiers.forEach((ticket) => {
      console.log(ticket);
    });
    // axiosInstance
    //   .get(`/organizations/${organization.id}/events/${event._id}/ticket-tiers`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //     signal: controller.signal,
    //   })
    //   .then((res) => {
    //     setTableData([...res.data.ticketTiers]);
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     if (!controller.signal.aborted) {
    //       enqueueSnackbar(`Unable to retrieve ticket tiers.`, { variant: 'error' });
    //     }
    //     setIsLoading(false);
    //   });
  };

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        {event.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Tickets Sold"
            total={isLoading ? 0 : 714000}
            icon={'ic:round-receipt'}
            loading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Revenue"
            total={1352831}
            color="success"
            icon={'fa6-solid:coins'}
            loading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Secondary Sale Volume"
            total={1723315}
            color="warning"
            icon={'ph:hand-coins-fill'}
            loading={isLoading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website Visits"
            subheader="(+43%) than last year"
            chartLabels={[
              '01/01/2003',
              '02/01/2003',
              '03/01/2003',
              '04/01/2003',
              '05/01/2003',
              '06/01/2003',
              '07/01/2003',
              '08/01/2003',
              '09/01/2003',
              '10/01/2003',
              '11/01/2003',
            ]}
            chartData={[
              {
                name: 'Team A',
                type: 'column',
                fill: 'solid',
                data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
              },
              {
                name: 'Team B',
                type: 'area',
                fill: 'gradient',
                data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
              },
              {
                name: 'Team C',
                type: 'line',
                fill: 'solid',
                data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
              },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current Visits"
            chartData={[
              { label: 'America', value: 4344 },
              { label: 'Asia', value: 5435 },
              { label: 'Europe', value: 1443 },
              { label: 'Africa', value: 4443 },
            ]}
            chartColors={[
              theme.palette.primary.main,
              theme.palette.chart.blue[0],
              theme.palette.chart.violet[0],
              theme.palette.chart.yellow[0],
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chartData={[
              { label: 'Italy', value: 400 },
              { label: 'Japan', value: 430 },
              { label: 'China', value: 448 },
              { label: 'Canada', value: 470 },
              { label: 'France', value: 540 },
              { label: 'Germany', value: 580 },
              { label: 'South Korea', value: 690 },
              { label: 'Netherlands', value: 1100 },
              { label: 'United States', value: 1200 },
              { label: 'United Kingdom', value: 1380 },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current Subject"
            chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
            chartData={[
              { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
              { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
              { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
            ]}
            chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AnalyticsNewsUpdate title="News Update" list={_analyticPost} />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite title="Traffic by Site" list={_analyticTraffic} />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AnalyticsTasks
            title="Tasks"
            list={[
              { id: '1', label: 'Create FireStone Logo' },
              { id: '2', label: 'Add SCSS and JS files if required' },
              { id: '3', label: 'Stakeholder Meeting' },
              { id: '4', label: 'Scoping & Estimations' },
              { id: '5', label: 'Sprint Showcase' },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
