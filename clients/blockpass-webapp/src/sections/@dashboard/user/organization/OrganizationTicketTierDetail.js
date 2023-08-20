import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { Box, Tab, Card, Grid, Divider, Container, Typography, Button, Stack } from '@mui/material';
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
import {
  OrganizationTicketTierSummary,
  OrganizationTicketTierOwnersList,
  OrganizationTicketTierEnhancementDialog,
  OrganizationTicketTierEnhancementItem,
} from '.';
import axiosInstance from '../../../../utils/axios';
import { getWalletAddress, getSmartContract } from '../../../../utils/web3Client';

// ----------------------------------------------------------------------

OrganizationTicketTierDetail.propTypes = {
  details: PropTypes.object,
  event: PropTypes.object,
};

export default function OrganizationTicketTierDetail({ details = null, event }) {
  const { organization, getAccessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [value, setValue] = useState('1');
  const [ticketTierDetails, setTicketTierDetails] = useState(details);
  const [ticketTierOwners, setTicketTierOwners] = useState([]);
  const [isClosed, setIsClosed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [selectedEnhancement, setSelectedEnhancement] = useState({});

  const [walletAddress, setWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);

  const [enhancements, setEnhancements] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getTicketTierOwners(controller);
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getEnhancements(controller);
    setIsUpdated(false);
    setSelectedEnhancement({});
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated]);

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

  const getEnhancements = async (controller) => {
    const token = await getAccessToken();

    axiosInstance
      .get(`/organizations/${organization.id}/events/${event.id}/ticket-tiers/${ticketTierDetails._id}/enhancements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      .then((res) => {
        setEnhancements([...res.data.enhancements]);
        setIsLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          enqueueSnackbar(`Unable to retrieve enhancements.`, { variant: 'error' });
        }
      });
  };

  const createEnhancement = async (data) => {
    const token = await getAccessToken();
    axiosInstance
      .post(
        `/organizations/${organization.id}/events/${event.id}/ticket-tiers/${ticketTierDetails._id}/enhancements`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        enqueueSnackbar('Enhancement successfully created!');
        setShowDialog(false);
        setIsUpdated(true);
      })
      .catch((err) => {
        enqueueSnackbar('Unable to create enhancement', { variant: 'error' });
        throw err;
      });
  };

  const updateEnhancement = async (data) => {
    const token = await getAccessToken();
    axiosInstance
      .patch(
        `/organizations/${organization.id}/events/${event.id}/ticket-tiers/${ticketTierDetails._id}/enhancements/${selectedEnhancement._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        enqueueSnackbar('Enhancement info updated!');
        setShowDialog(false);
        setIsUpdated(true);
      })
      .catch((err) => {
        enqueueSnackbar('Unable to update enhancement', { variant: 'error' });
        throw err;
      });
  };

  const deleteEnhancement = async () => {
    const token = await getAccessToken();
    axiosInstance
      .delete(
        `/organizations/${organization.id}/events/${event.id}/ticket-tiers/${ticketTierDetails._id}/enhancements/${selectedEnhancement._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        enqueueSnackbar('Enhancement successfully deleted!');
        setShowDialog(false);
        setIsUpdated(true);
      })
      .catch((err) => {
        enqueueSnackbar('Unable to delete enhancement', { variant: 'error' });
        throw err;
      });
  };

  const walletChangedHandler = (walletAddress) => {
    setWalletAddress(walletAddress);
  };

  const pauseTicketSaleHandler = () => {
    contract
      .pauseTicketSale()
      .send({ from: walletAddress })
      .then(() => {
        setTicketTierDetails((prevState) => ({ ...prevState, paused: true }));
        enqueueSnackbar('Ticket contract has been paused.', { variant: 'success' });
      })
      .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
  };

  const resumeTicketSaleHandler = () => {
    contract
      .resumeTicketSale()
      .send({ from: walletAddress })
      .then(() => {
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
      .then(() => {
        setTicketTierDetails((prevState) => ({ ...prevState, closeDate: dateTimeCalled.toUTCString() }));
        enqueueSnackbar('Ticket contract has been closed.', { variant: 'success' });
      })
      .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
  };

  const onShowDialogHandler = () => {
    setShowDialog(!showDialog);
  };

  const enhancementOnClickHandler = (enhancement) => {
    setSelectedEnhancement(enhancement);
    setShowDialog(!showDialog);
  };

  const addEnhancementButtonOnClick = () => {
    setShowDialog(true);
    setSelectedEnhancement({});
  };

  return (
    <Page title="Events">
      <OrganizationTicketTierEnhancementDialog
        open={showDialog}
        showHandler={onShowDialogHandler}
        createHandler={createEnhancement}
        updateHandler={updateEnhancement}
        deleteHandler={deleteEnhancement}
        enhancement={selectedEnhancement}
      />
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={ticketTierDetails.name}
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

            <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="space-between" sx={{ mt: 5 }}>
              <Typography variant="h4" gutterBottom>
                Enhancements
              </Typography>
              <Button size="large" color="info" variant="outlined" onClick={addEnhancementButtonOnClick}>
                Add Enhancement
              </Button>
            </Stack>
            {enhancements.length !== 0 && (
              <Grid container sx={{ my: 8 }}>
                {enhancements.map((enhancement) => (
                  <OrganizationTicketTierEnhancementItem
                    key={enhancement._id}
                    enhancement={enhancement}
                    showDialogHandler={onShowDialogHandler}
                    onClickHandler={enhancementOnClickHandler}
                  />
                ))}
              </Grid>
            )}

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
