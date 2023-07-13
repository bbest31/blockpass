import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Skeleton, Card, CardContent } from '@mui/material';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useAuth from '../../../../hooks/useAuth';
// _mock_
import { _analyticPost, _analyticOrderTimeline, _analyticTraffic } from '../../../../_mock';
// sections
import {
  InsightsWebsiteVisits,
  InsightsWidgetSummary,
  InsightsConversionRates,
  InsightsPieChart,
} from '../../general/analytics';
// utils
import axiosInstance from '../../../../utils/axios';

// ----------------------------------------------------------------------

export default function OrganizationEventInsights({ eventItem }) {
  const event = eventItem;
  const theme = useTheme();
  const { organization, getAccessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettings();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getEventInsights(event, controller);
    return () => {
      controller.abort();
    };
  }, []);

  const getEventInsights = async (event, controller) => {
    setIsLoading(true);
    const token = await getAccessToken();

    // for each ticket tier retrieve the analytics data
    const dataPromises = event.ticketTiers.map((ticketTier) =>
      axiosInstance
        .get(`/organizations/${organization.id}/events/${event._id}/ticket-tiers/${ticketTier._id}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })
        .then((res) => {
          return { ...res.data, name: ticketTier.displayName };
        })
        .catch((err) => {
          if (!controller.signal.aborted) {
            enqueueSnackbar(`Unable to retrieve all event data.`, { variant: 'error' });
          }
          setIsLoading(false);
        })
    );

    Promise.all(dataPromises).then((data) => {
      setData(data);
      setIsLoading(false);
    });
  };

  /**
   * Calculates the total tickets sold for an event across ticket tiers.
   * @returns {number}
   */
  const getTotalTicketsSold = () => {
    let ticketsSold = 0;

    data.forEach((tier) => {
      ticketsSold += tier.ticketsSold;
    });
    return ticketsSold;
  };

  /**
   * Calculates the total revenue for an event across ticket tiers.
   * @returns {number}
   */
  const getTotalRevenue = () => {
    let revenue = 0;
    data.forEach((tier) => {
      revenue += tier.revenue;
    });
    return revenue;
  };

  /**
   * Calculates the total secondary sale volume for an event across ticket tiers.
   * @returns {number}
   */
  const getTotalSecondaryVol = () => {
    let vol = 0;
    data.forEach((tier) => {
      vol += tier.secondaryVolume;
    });
    return vol;
  };

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        {event.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <InsightsWidgetSummary
            title="Tickets Sold"
            total={isLoading ? 0 : getTotalTicketsSold()}
            icon={'ic:round-receipt'}
            loading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <InsightsWidgetSummary
            title="Total Revenue"
            total={isLoading ? 0 : getTotalRevenue()}
            color="success"
            prefix={'$'}
            icon={'fa6-solid:coins'}
            loading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <InsightsWidgetSummary
            title="Secondary Sale Volume"
            total={isLoading ? 0 : getTotalSecondaryVol()}
            color="warning"
            prefix={'$'}
            icon={'ph:hand-coins-fill'}
            loading={isLoading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <InsightsWebsiteVisits
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
          {isLoading ? (
            <Card>
              <CardContent>
                <Typography variant="h6">Ticket Tier Sales Breakdown</Typography>
                <Skeleton variant="circular" height={280} width={280} sx={{ marginBottom: 12 }} animation="pulse" />
                <Typography variant="body1">
                  <Skeleton variant="text" animation="pulse" />
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <InsightsPieChart
              title="Ticket Tier Sales Breakdown"
              chartData={data.map((tier) => {
                return { label: tier.name, value: tier.ticketsSold };
              })}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          {isLoading ? (
            <Card>
              <CardContent>
                <Typography variant="h6">Ticket Tier Revenue Overview</Typography>
                <Typography variant="body1">
                  <Skeleton variant="text" animation="pulse" />
                </Typography>
                <Skeleton variant="rectangle" animation="pulse" height={280} />
                <Typography variant="body1">
                  <Skeleton variant="text" animation="pulse" />
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <InsightsConversionRates
              title="Ticket Tier Revenue Overview"
              chartData={data.map((tier) => {
                return { label: tier.name, value: tier.revenue };
              })}
            />
          )}
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          {/* TODO: Skeleton */}
          {/* <InsightsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} /> */}
        </Grid>
      </Grid>
    </Container>
  );
}
