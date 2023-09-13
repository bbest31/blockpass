import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAccount } from 'wagmi';
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
import TicketInteractionPanel from '../sections/tickets/TicketInteractionPanel';
import EnhancementItem from '../sections/EnhancementItem';
import EnhancementDialog from '../sections/EnhancementDialog';
import TransferDialog from '../sections/tickets/TransferDialog';
import CancelSaleDialog from '../sections/tickets/CancelSaleDialog';
import ListForSaleDialog from '../sections/tickets/ListForSaleDialog';
import UpdateTicketPriceDialog from '../sections/tickets/UpdateTicketPriceDialog';
// utils
import axiosInstance from '../utils/axios';
import { getMarketplaceContract } from '../utils/web3Client';
// config
import { SERVER_API_KEY, ZERO_ADDRESS } from '../config';

// ----------------------------------------------------------------------

export default function MyTicketDetail() {
  const { pathname } = useLocation();
  const segments = pathname.split('/');
  const ticketTierId = segments[2];
  const token = segments[4];

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [event, setEvent] = useState(null);
  const [ticketTier, setTicketTier] = useState(null);
  const [enhancements, setEnhancements] = useState(null);
  const [isForSale, setIsForSale] = useState(false);
  const [salePrice, setSalePrice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showEnhancementDialog, setShowEnhancementDialog] = useState(false);
  const [selectedEnhancement, setSelectedEnhancement] = useState({});

  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showCancelSaleDialog, setShowCancelSaleDialog] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [showUpdatePriceDialog, setShowUpdatePriceDialog] = useState(false);

  const { address } = useAccount();

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
          const marketplaceContract = getMarketplaceContract(res.data.marketplaceContract);

          // check to see if the ticket is for sale
          marketplaceContract
            ._secondaryMarket(res.data.contract, token)
            .call()
            .then((res) => {
              if (res.ticketContract !== ZERO_ADDRESS) {
                setIsForSale(true);
                setSalePrice(res.price);
              }
            })
            .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
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
          ? res.data.enhancements
              .filter((e) => e.active === true)
              .map((enhancement) => (
                <EnhancementItem
                  key={enhancement._id}
                  enhancement={enhancement}
                  showDialogHandler={onShowEnhancementDialog}
                  onClickHandler={() => enhancementOnClickHandler(enhancement)}
                />
              ))
          : null;
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

  const onShowEnhancementDialog = () => {
    setShowEnhancementDialog(!showEnhancementDialog);
  };

  const onShowTransferDialog = () => {
    setShowTransferDialog(!showTransferDialog);
  };

  const onShowCancelSaleDialog = () => {
    setShowCancelSaleDialog(!showCancelSaleDialog);
  };

  const onShowSellDialog = () => {
    setShowSellDialog(!showSellDialog);
  };

  const onShowUpdatePriceDialog = () => {
    setShowUpdatePriceDialog(!showUpdatePriceDialog);
  };

  const enhancementOnClickHandler = (enhancement) => {
    setSelectedEnhancement(enhancement);
    setShowEnhancementDialog(!showEnhancementDialog);
  };

  return (
    <Page title="BlockPass | Ticket">
      <EnhancementDialog
        open={showEnhancementDialog}
        showHandler={onShowEnhancementDialog}
        enhancement={selectedEnhancement}
      />
      <TransferDialog
        open={showTransferDialog}
        showHandler={onShowTransferDialog}
        contract={ticketTier?.contract}
        from={address}
        token={parseInt(token, 10)}
        event={event?.name}
        tierName={ticketTier?.displayName}
      />
      <CancelSaleDialog
        open={showCancelSaleDialog}
        showHandler={onShowCancelSaleDialog}
        from={address}
        tier={ticketTier}
        token={parseInt(token, 10)}
        onForSaleHandler={() => setIsForSale(false)}
      />
      <ListForSaleDialog
        open={showSellDialog}
        showHandler={onShowSellDialog}
        from={address}
        token={parseInt(token, 10)}
        event={event}
        tier={ticketTier}
        onForSaleHandler={() => setIsForSale(true)}
      />
      <UpdateTicketPriceDialog
        open={showUpdatePriceDialog}
        showHandler={onShowUpdatePriceDialog}
        from={address}
        token={parseInt(token, 10)}
        event={event}
        tier={ticketTier}
      />
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
                      transferTicketHandler={onShowTransferDialog}
                      sellTicketHandler={onShowSellDialog}
                      updateSalePriceHandler={onShowUpdatePriceDialog}
                      cancelSaleHandler={onShowCancelSaleDialog}
                      isForSale={isForSale}
                      price={salePrice}
                    />
                  )}
                </Grid>
                {/* Perks section */}
                {ticketTier?.enhancements?.length !== 0 && (
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
      </Container>
    </Page>
  );
}
