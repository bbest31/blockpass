import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { Box, Tab, Card, Grid, Divider, Container } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// routes
import { PATH_APP } from '../../../../routes/paths';
// hooks
import useAuth from '../../../../hooks/useAuth';
import useSettings from '../../../../hooks/useSettings';
// components
import Page from '../../../../components/Page';
import Image from '../../../../components/Image';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import { OrganizationTicketTierSummary, OrganizationTicketTierOwnersList } from '.';
import axiosInstance from '../../../../utils/axios';
import { getWalletAddress, getSmartContract } from '../../../../utils/web3Client';

// ----------------------------------------------------------------------

export default function OrganizationTicketTierDetail({ details = null, event }) {
  const { organization, getAccessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const { ticketTierId = '', eventId = '' } = useParams();

  const [value, setValue] = useState('1');
  const [ticketTierDetails, setTicketTierDetails] = useState(details);
  const [ticketTierOwners, setTicketTierOwners] = useState([]);
  const [isClosed, setIsClosed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [walletAddress, setWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getTicketTierOwners(controller);
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    getWalletAddress(walletChangedHandler);
  }, []);

  useEffect(() => {
    if (ticketTierDetails.contract !== null || ticketTierDetails.contract !== '') {
      setContract(getSmartContract(ticketTierDetails.contract));
    }
  }, [ticketTierDetails]);

  useEffect(() => {
    setIsPaused(ticketTierDetails.paused);
    setIsClosed(new Date() > new Date(ticketTierDetails.closeDate));
  }, [ticketTierDetails]);

  const getTicketTierOwners = async (controller) => {
    const token = await getAccessToken();

    axiosInstance
      .get(`/organizations/${organization.id}/events/${event.id}/ticket-tiers/${ticketTierDetails._id}/owners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      .then((res) => {
        setTicketTierOwners([...res.data.result]);
        setIsLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          enqueueSnackbar(`Unable to retrieve owners.`, { variant: 'error' });
        }
      });
  };

  const walletChangedHandler = (walletAddress) => {
    setWalletAddress(walletAddress);
  };

  const pauseTicketSaleHandler = () => {
    contract
      .pauseTicketSale()
      .send({ from: walletAddress })
      .then((res) => {
        setTicketTierDetails((prevState) => ({ ...prevState, paused: true }));
        enqueueSnackbar('Ticket contract has been paused.', { variant: 'success' });
      })
      .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
  };

  const resumeTicketSaleHandler = () => {
    contract
      .resumeTicketSale()
      .send({ from: walletAddress })
      .then((res) => {
        console.log(res);
        setTicketTierDetails((prevState) => ({ ...prevState, paused: false }));
        enqueueSnackbar('Ticket contract has been resumed.', { variant: 'success' });
      })
      .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
  };

  const closeTicketSaleHandler = () => {
    const dateTimeCalled = new Date();
    contract
      .closeTicketSale()
      .send({ from: walletAddress })
      .then((res) => {
        setTicketTierDetails((prevState) => ({ ...prevState, closeDate: dateTimeCalled.toUTCString() }));
        enqueueSnackbar('Ticket contract has been closed.', { variant: 'success' });
      })
      .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
  };

  return (
    <Page title="Events">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Event Name"
          links={[
            { name: 'Dashboard', href: PATH_APP.general.dashboard },
            {
              name: 'Events',
              href: PATH_APP.general.events,
            },
            {
              name: event.name,
            },
            {
              name: ticketTierDetails.name,
            },
          ]}
        />

        {
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <Box sx={{ p: 1 }}>
                    <Box sx={{ zIndex: 0, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                      <Image
                        alt="large image"
                        src={ticketTierDetails.tokenURI}
                        ratio="1/1"
                        style={{ objectFit: 'contain' }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <OrganizationTicketTierSummary
                    ticketTierDetail={ticketTierDetails}
                    isLoading={isLoading}
                    pauseTicketSaleHandler={pauseTicketSaleHandler}
                    resumeTicketSaleHandler={resumeTicketSaleHandler}
                    closeTicketSaleHandler={closeTicketSaleHandler}
                    isPaused={isPaused}
                    isClosed={isClosed}
                  />
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ mt: 7 }}>
              <TabContext value={value}>
                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                  <TabList onChange={(e, value) => setValue(value)}>
                    <Tab disableRipple value="1" label="Description" />
                    <Tab disableRipple value="2" label="Owners" />
                  </TabList>
                </Box>

                <Divider />

                <TabPanel value="1">
                  <Box sx={{ p: 3 }}>{ticketTierDetails.description}</Box>
                </TabPanel>

                <TabPanel value="2">
                  <OrganizationTicketTierOwnersList ticketTierOwners={ticketTierOwners} isLoading={isLoading} />
                </TabPanel>
              </TabContext>
            </Card>
          </>
        }
      </Container>
    </Page>
  );
}
