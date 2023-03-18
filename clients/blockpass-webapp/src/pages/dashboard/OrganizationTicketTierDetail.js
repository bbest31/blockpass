import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Container, Typography, Stack } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProduct, addCart, onGotoStep } from '../../redux/slices/product';
// routes
import { PATH_APP } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Markdown from '../../components/Markdown';
import Image from '../../components/Image';
import { SkeletonProduct } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  ProductDetailsSummary,
  ProductDetailsReview,
  ProductDetailsCarousel,
} from '../../sections/@dashboard/e-commerce/product-details';
import { OrganizationTicketTierSummary } from '../../sections/@dashboard/user/organization';

// ----------------------------------------------------------------------

const ENHANCEMENT_DESCRIPTIONS = [
  {
    title: 'VIP Lounge',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: 'ic:round-verified',
  },
  {
    title: 'Early Access Into Venue',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: 'eva:clock-fill',
  },
  {
    title: 'Collectors NFT',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: 'bi:ticket-fill',
  },
];

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------

export default function EcommerceProductDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [value, setValue] = useState('1');
  const { name = '' } = useParams();
  const { product, error, checkout } = useSelector((state) => state.product);

  const event = {
    name: 'General Admission',
    reviews: [],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhHG_4e3VUd-VGc56wR1VxbvMzBZopJZTkuw&usqp=CAU'],
    id: 1,
    sizes: ['1', '2', '3'],
    price: 62.97,
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhHG_4e3VUd-VGc56wR1VxbvMzBZopJZTkuw&usqp=CAU',
    available: 1,
    priceSale: 10,
    totalRating: 20,
    totalReview: 45,
    inventoryType: 'active',
    status: 'sale',
  };

  useEffect(() => {
    dispatch(getProduct(name));
  }, [dispatch, name]);

  const handleAddCart = (product) => {
    dispatch(addCart(product));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  return (
    // TODO: use event name for page title
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
              name: 'Event Name',
            },
            { name: 'Event Tier' },
          ]}
        />

        {/* {product && ( */}
        {
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  {/* <ProductDetailsCarousel product={event} /> */}
                  <Box sx={{ p: 1 }}>
                    <Box sx={{ zIndex: 0, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                      <Image alt="large image" src={event.images[0]} ratio="1/1" sx={{ cursor: 'zoom-in' }} />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  {/* <ProductDetailsSummary
                    product={event}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                  /> */}
                  <OrganizationTicketTierSummary product={event} />
                </Grid>
              </Grid>
            </Card>

            <Stack>
              <Typography variant="h5" sx={{ mt: 6 }}>
                Enhancements
              </Typography>
            </Stack>

            <Grid container sx={{ mt: 3, mb: 6 }}>
              {ENHANCEMENT_DESCRIPTIONS.map((item) => (
                <Grid item xs={12} md={4} key={item.title}>
                  <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                    <IconWrapperStyle>
                      <Iconify icon={item.icon} width={36} height={36} />
                    </IconWrapperStyle>
                    <Typography variant="subtitle1" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Card>
              <TabContext value={value}>
                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                  <TabList onChange={(e, value) => setValue(value)}>
                    <Tab disableRipple value="1" label="Description" />
                    <Tab disableRipple value="2" label="Owners" />
                    <Tab disableRipple value="3" label="Previous Owners" />
                  </TabList>
                </Box>

                <Divider />

                <TabPanel value="1">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={event.description} />
                  </Box>
                </TabPanel>

                <TabPanel value="2">
                  <Box sx={{ p: 3 }}>Owners </Box>
                </TabPanel>

                <TabPanel value="3">
                  <Box sx={{ p: 3 }}>Previous owners</Box>
                </TabPanel>
              </TabContext>
            </Card>
          </>
        }

        {!event && <SkeletonProduct />}

        {/* {error && <Typography variant="h6">404 Product not found</Typography>} */}
      </Container>
    </Page>
  );
}
