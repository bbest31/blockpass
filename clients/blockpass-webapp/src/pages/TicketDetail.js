import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { Box, Card, Grid, Stack, Container, Typography, Skeleton } from '@mui/material';
// routes
import { PATH_APP } from '../routes/paths';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Image from '../components/Image';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
// sections
import TicketInteractionPanel from '../sections/TicketInteractionPanel';
import EnhancementItem from '../sections/EnhancementItem';
import EnhancementDialog from '../sections/EnhancementDialog';
// utils
import axiosInstance from '../utils/axios';
import { getWalletAddress, getSmartContract } from '../utils/web3Client';
// config
import { SERVER_API_KEY } from '../config';

// ----------------------------------------------------------------------

export default function TicketDetail() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const segments = pathname.split('/');
  const ticketTierId = segments[2];
  const token = segments[4];

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [event, setEvent] = useState(null);
  const [ticketTier, setTicketTier] = useState(null);
  const [enhancements, setEnhancements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedEnhancement, setSelectedEnhancement] = useState({});

  const [walletAddress, setWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    axiosInstance
      .get(`/ticket-tiers/${ticketTierId}`, {
        headers: {
          'blockpass-api-key': SERVER_API_KEY,
        },
      })
      .then((res) => {
        setTicketTier(res.data);
        if (res.data.contract !== null || res.data.contract !== '') {
          setContract(getSmartContract(res.data.contract));
          setMarketplaceContract(getSmartContract(res.data.marketplaceContract));
        }
        // get event information
        axiosInstance
          .get(`/events?ticketTierId=${ticketTierId}`, {
            headers: {
              'blockpass-api-key': SERVER_API_KEY,
            },
          })
          .then((res) => {
            setEvent(res.data[0]);
          })
          .catch((err) => {
            console.error(err);
            if (!controller.signal.aborted) {
              enqueueSnackbar(`Unable to retrieve event information.`, { variant: 'error' });
            }
            setIsLoading(false);
          });

        // get enhancements
        const enhancementsComponents = res.data.enhancements
          .filter((e) => e.active === true)
          .map((enhancement) => (
            <EnhancementItem
              key={enhancement._id}
              enhancement={enhancement}
              showDialogHandler={onShowDialogHandler}
              onClickHandler={() => enhancementOnClickHandler(enhancement)}
            />
          ));
        setEnhancements(enhancementsComponents);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (!controller.signal.aborted) {
          enqueueSnackbar(`Unable to retrieve ticket information.`, { variant: 'error' });
        }
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, []);

  const walletChangedHandler = (walletAddress) => {
    setWalletAddress(walletAddress);
  };

  const updateTicketSalePrice = (newPrice) => {
    marketplaceContract
      .updateTicketSalePrice(newPrice, ticketTier.contract, parseInt(token, 10))
      .send({ from: walletAddress })
      .then(() => {
        enqueueSnackbar('Ticket sale price has been updated.', { variant: 'success' });
        // TODO: re-render to show sale price.
      })
      .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
  };

  const cancelTicketResale = () => {
    marketplaceContract
      .cancelResale(ticketTier.contract, parseInt(token, 10))
      .send({ from: walletAddress })
      .then(() => {
        enqueueSnackbar('Ticket sale successfully cancelled.', { variant: 'success' });
        // TODO: update UI.
      })
      .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
  };

  /**
   * Lists the ticket for sale on the marketplace
   * @param {number} price - the resale price of the ticket.
   */
  const sellTicketSaleHandler = (price) => {
    marketplaceContract
      .resellTicket(ticketTier.contract, parseInt(token, 10), price)
      .send({ from: walletAddress })
      .then(() => {
        enqueueSnackbar('Ticket has been listed for sale.', { variant: 'success' });
        // TODO: set is for sale
      })
      .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
  };

  /**
   * Calls the safe transfer function
   * @param {string} to - the address to send the NFT to.
   */
  const transferTicketHandler = (to) => {
    contract
      .safeTransferFrom(walletAddress, to, parseInt(token, 10))
      .send({ from: walletAddress })
      .then(() => {
        navigate('/tickets');
        enqueueSnackbar('Ticket has been transfered.', { variant: 'success' });
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

  return (
    <Page title="BlockPass | Ticket">
      <EnhancementDialog open={showDialog} showHandler={onShowDialogHandler} enhancement={selectedEnhancement} />
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Grid container spacing={4} maxWidth={themeStretch ? false : 'xl'} sx={{ marginX: 12 }}>
          <Grid item xs={12}>
            <HeaderBreadcrumbs
              heading={'My Tickets'}
              links={[
                { name: 'My Tickets', href: PATH_APP.marketplace.tickets },
                {
                  name: event?.name || ticketTier?.name || '...',
                },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ p: 5 }}>
              <Grid container spacing={6}>
                <Grid item xs={12} md={6} lg={7}>
                  <Box sx={{ p: 1 }}>
                    <Box
                      sx={{
                        zIndex: 0,
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        height: 450,
                        width: 450,
                      }}
                    >
                      {isLoading ? (
                        <Skeleton height={450} width={450} variant="rounded" />
                      ) : (
                        <Image
                          alt="token uri"
                          src={ticketTier?.tokenURI}
                          ratio="1/1"
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  {isLoading ? (
                    <Stack spacing={3} sx={{ my: 3 }}>
                      <Skeleton variant="rounded" height={30} width={400} />
                      <Skeleton variant="rounded" height={30} width={400} />
                      <Skeleton variant="rounded" height={30} width={400} />
                      <Skeleton variant="rounded" height={30} width={400} />
                      <Skeleton variant="rounded" height={48} width={108} />
                    </Stack>
                  ) : (
                    <TicketInteractionPanel
                      ticketTier={ticketTier}
                      token={parseInt(token, 10)}
                      event={event}
                      transferTicketHandler={() => {
                        console.log('transfer ticket');
                      }}
                      sellTicketHandler={() => {
                        console.log('sell ticket');
                      }}
                      updateSalePriceHandler={() => {
                        console.log('update sale price');
                      }}
                      cancelSaleHandler={() => {
                        console.log('cancel sale');
                      }}
                      isForSale={false} // TODO: check marketplace contract
                    />
                  )}
                </Grid>
                {/* Perks section */}
                {ticketTier?.enhancements.length !== 0 && (
                  <Grid item xs={12}>
                    <Stack spacing={3}>
                      <Typography variant="h4" gutterBottom>
                        ✨ Ticket Perks
                      </Typography>
                      <Grid container sx={{ my: 8 }}>
                        {enhancements}
                      </Grid>
                    </Stack>
                  </Grid>
                )}

                {/* Ticket Description */}
                <Grid item xs={12}>
                  <Stack spacing={3}>
                    <Typography variant="h4" gutterBottom>
                      Ticket Description
                    </Typography>
                    {isLoading ? (
                      <div>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                      </div>
                    ) : (
                      <Typography variant="body1" gutterBottom>
                        {ticketTier.description}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
        {/* 
        
      */}
      </Container>
    </Page>
  );
}
