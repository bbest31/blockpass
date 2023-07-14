import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import PropTypes from 'prop-types';
import { Grid, Container, Typography, Skeleton, Card, CardContent } from '@mui/material';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useAuth from '../../../../hooks/useAuth';
// sections
import {
  InsightsEventTimeline,
  InsightsWidgetSummary,
  InsightsRevenueOverview,
  InsightsSalesBreakdown,
} from '../../general/analytics';
// utils
import axiosInstance from '../../../../utils/axios';

// ----------------------------------------------------------------------

OrganizationEventInsights.propTypes = {
  eventItem: PropTypes.object.isRequired,
};

export default function OrganizationEventInsights({ eventItem }) {
  const event = eventItem;
  const { organization, getAccessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettings();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [volumeData, setVolumeData] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    getEventInsights(event, controller);
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, [event]);

  useEffect(() => {
    const tierEvents = data.map((tier) => {
      const primaryVolData = [];
      const secondaryVolData = [];

      // gather all needed event data from the blockchain events for this ticket tier
      const chainEvents = tier.processedEvents.map(
        (evt) =>
          new Promise((resolve) => {
            const { price, isPrimary } = evt.returnValues;
            const y = Number(price);
            const ts = new Date(evt.blockTimestamp);
            const data = { x: ts.toLocaleDateString(), y };

            // add the data point to either the primary or secondary volume array
            if (isPrimary) {
              primaryVolData.push(data);
            } else {
              secondaryVolData.push(data);
            }
            resolve();
          })
      );
      // return all primary volume and secondary volume data points for a ticket-tier
      return Promise.all(chainEvents).then(() => ({ primary: primaryVolData, secondary: secondaryVolData }));
    });

    Promise.all(tierEvents).then((volData) => {
      // merge the data arrays together from each ticket-tier
      const mergedVolData = volData.reduce(
        (acc, datapoints) => {
          acc.primary = acc.primary.concat(datapoints.primary);
          acc.secondary = acc.secondary.concat(datapoints.secondary);
          return acc;
        },
        { primary: [], secondary: [] }
      );

      // Create a new array with the total volume by day
      const totalVolumeData = [mergedVolData].reduce((acc, event) => {
        const { primary, secondary } = event;

        // Process primary events
        primary.forEach((pEvent) => {
          const { x, y } = pEvent;
          if (acc[x]) {
            acc[x].y += y;
          } else {
            acc[x] = { x, y };
          }
        });

        // Process secondary events
        secondary.forEach((sEvent) => {
          const { x, y } = sEvent;
          if (acc[x]) {
            acc[x].y += y;
          } else {
            acc[x] = { x, y };
          }
        });

        return acc;
      }, {});

      // Convert the summedEventData object into an array
      const volume = {
        primary: mergedVolData.primary,
        secondary: mergedVolData.secondary,
        total: Object.values(totalVolumeData),
      };
      setVolumeData(volume);
    });
  }, [data]);

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
        .then((res) => ({ ...res.data, name: ticketTier.displayName }))
        .catch((err) => {
          console.error(err);
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

  /**
   * Constructs the timeline data needed for events insights timeline
   * @returns {Array<Object>}
   */
  const eventTimelineData = () => [
    {
      name: 'Primary Sale Volume',
      type: 'area',
      fill: 'gradient',
      data: volumeData?.primary || [],
    },
    {
      name: 'Secondary Sale Volume',
      type: 'area',
      fill: 'gradient',
      data: volumeData?.secondary || [],
    },
    {
      name: 'Total Volume',
      type: 'line',
      fill: 'solid',
      data: volumeData?.total || [],
    },
  ];

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
          {isLoading ? (
            <Card>
              <CardContent>
                <Typography variant="h6">Event Timeline</Typography>
                <Skeleton variant="rectangle" animation="pulse" height={400} />
                <Typography variant="body1">
                  <Skeleton variant="text" animation="pulse" />
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <InsightsEventTimeline title="Event Timeline" chartData={eventTimelineData()} />
          )}
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
            <InsightsSalesBreakdown
              title="Ticket Tier Sales Breakdown"
              chartData={data.map((tier) => ({ label: tier.name, value: tier.ticketsSold }))}
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
            <InsightsRevenueOverview
              title="Ticket Tier Revenue Overview"
              chartData={data.map((tier) => ({ label: tier.name, value: tier.revenue }))}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
