import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Link, Stack, Button, Rating, Divider, IconButton, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import SocialsButton from '../../../../components/SocialsButton';
import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFSelect } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

ProductDetailsSummary.propTypes = {
  cart: PropTypes.array,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.shape({
    available: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    cover: PropTypes.string,
    id: PropTypes.string,
    inventoryType: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    priceSale: PropTypes.number,
    sizes: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    totalRating: PropTypes.number,
    totalReview: PropTypes.number,
  }),
};

export default function ProductDetailsSummary({ cart, product, onAddCart, onGotoStep, ...other }) {
  const theme = useTheme();

  const navigate = useNavigate();

  const {
    id,
    name,
    sizes,
    price,
    cover,
    status,
    colors,
    available,
    priceSale,
    totalRating,
    totalReview,
    inventoryType,
  } = product;

  // const alreadyProduct = cart.map((item) => item.id).includes(id);

  // const isMaxQuantity = cart.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  // const defaultValues = {
  //   id,
  //   name,
  //   cover,
  //   available,
  //   price,
  //   color: colors[0],
  //   size: sizes[4],
  //   quantity: available < 1 ? 0 : 1,
  // };

  const methods = useForm({
    // defaultValues,
  });

  // const { watch, control, setValue, handleSubmit } = methods;

  // const values = watch();

  // const onSubmit = async (data) => {
  //   try {
  //     if (!alreadyProduct) {
  //       onAddCart({
  //         ...data,
  //         subtotal: data.price * data.quantity,
  //       });
  //     }
  //     onGotoStep(0);
  //     navigate(PATH_DASHBOARD.eCommerce.checkout);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <RootStyle {...other}>
      {/* <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}> */}
      <FormProvider methods={methods}>
        <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="h5">
            {name}&nbsp;
          </Typography>
          
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            // color={inventoryType === 'in_stock' ? 'success' : 'error'}
            color="success"
            sx={{ textTransform: 'uppercase' }}
          >
            {sentenceCase(inventoryType || '')}
          </Label>
        </Stack>

        <Typography variant="h4" sx={{ mb: 3 }}>
          &nbsp;{fCurrency(price)}
        </Typography>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Contract
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            0x2953...4963
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            No. of owners
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            450/500
          </Typography>

          {/* <RHFSelect
            name="size"
            size="small"
            fullWidth={false}
            FormHelperTextProps={{
              sx: { textAlign: 'right', margin: 0, mt: 1 },
            }}
            helperText={
              <Link underline="always" color="text.secondary">
                Size Chart
              </Link>
            }
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </RHFSelect> */}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
          {/* <Button
            fullWidth
            disabled={isMaxQuantity}
            size="large"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
            onClick={handleAddCart}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add to Cart
          </Button> */}

          <Button fullWidth size="large" color="warning" variant="contained">
            Pause
          </Button>

          <Button fullWidth size="large" color="error" variant="contained">
            Close
          </Button>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}
