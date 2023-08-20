import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Dialog,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Card,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { deployTicketTierContract } from '../../../../utils/web3Client';
import axiosInstance from '../../../../utils/axios';
// components
import { FormProvider, RHFTextField, RHFEditor } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const singleColumn = { gridColumn: '1 / span 2' };

// ----------------------------------------------------------------------

const UpdateEnhancementSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  symbol: Yup.string().required('Symbol is required'),
  liveDate: Yup.string().required('Live date is required'),
  tokenURI: Yup.string().required('Token image url is required'),
  description: Yup.string().required('Description is required'),
  primarySalePrice: Yup.number().required('Primary sale price is required'),
  maxSupply: Yup.number().required('Max supply is required'),
  maxMarkup: Yup.number(),
});

const DIALOG_STATE = {
  CREATE: 'create',
  DEPLOY: 'deploy',
};

OrganizationTicketTierDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func,
  eventId: PropTypes.string,
  eventInformation: PropTypes.object,
  addTicketTierRow: PropTypes.func,
};

export default function OrganizationTicketTierDialog({
  open,
  eventId,
  eventInformation,
  showHandler,
  addTicketTierRow,
}) {
  const { organization, getAccessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [dialogState, setDialogState] = useState(DIALOG_STATE.CREATE);

  const [title] = useState('');
  const [symbol] = useState('');
  const [liveDate] = useState('');
  const [tokenURI] = useState('');
  const [description] = useState('');
  const [primarySalePrice] = useState(0);
  const [maxSupply] = useState(0);
  const [maxMarkup] = useState(0);
  const [scalpingPrevention, setScalpingPrevention] = useState(true);

  const methods = useForm({
    resolver: yupResolver(UpdateEnhancementSchema),
    defaultValues: {
      title,
      symbol,
      liveDate,
      tokenURI,
      description,
      primarySalePrice,
      maxSupply,
      maxMarkup,
    },
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    setDialogState(DIALOG_STATE.DEPLOY);

    deployTicketTierContract(values, eventInformation)
      .then((contractAddress) => {
        createNewTicketTier(contractAddress, values.description, values.title);
      })
      .catch(() => {
        enqueueSnackbar(`Error creating and deploying ticket tier contract`, { variant: 'error' });
        setDialogState(DIALOG_STATE.CREATE);
      });
  };

  const createNewTicketTier = async (contract, description, displayName) => {
    const token = await getAccessToken();
    const controller = new AbortController();

    const data = {
      contract,
      description,
      displayName,
    };

    axiosInstance
      .post(`/organizations/${organization.id}/events/${eventId}/ticket-tiers`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      .then(() => {
        addTicketTierRow(values);
        enqueueSnackbar(`Ticket tier contract created and deployed`, { variant: 'success' });
        showHandler();
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          enqueueSnackbar(`Error creating and deploying ticket tier contract`, { variant: 'error' });
          setDialogState(DIALOG_STATE.CREATE);
        }
      });
  };

  const onCloseHandler = () => {
    reset();
    setScalpingPrevention(true);
    showHandler();
  };

  const scalpingPreventionHandler = () => {
    setScalpingPrevention((prevent) => !prevent);
    setValue('maxMarkup', 0);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onCloseHandler}>
      <Card sx={{ p: 3 }}>
        {dialogState === DIALOG_STATE.CREATE && (
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Typography variant="h5" sx={singleColumn}>
                Ticket Tier Info
              </Typography>
              <RHFTextField name="title" label="Ticket Tier Title" />
              <RHFTextField name="symbol" label="Symbol" />
              <RHFTextField name="liveDate" label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
              <RHFTextField name="tokenURI" label="Token Image URL" />

              <Typography variant="h5" sx={singleColumn}>
                Description
              </Typography>
              <Box sx={singleColumn}>
                <RHFEditor name="description" label="Description" />
              </Box>

              <Typography variant="h5" sx={singleColumn}>
                Price Info & Supply
              </Typography>
              <RHFTextField name="primarySalePrice" label="Primary Sale Price" />
              <RHFTextField name="maxSupply" label="Max Supply" />
              {scalpingPrevention && <RHFTextField name="maxMarkup" label="Max Markup %" />}

              <Box sx={singleColumn}>
                <FormControlLabel
                  control={<Switch />}
                  label="Pre-Event Scalping Prevention"
                  labelPlacement="start"
                  sx={{ ml: 0 }}
                  checked={scalpingPrevention}
                  onChange={scalpingPreventionHandler}
                />
              </Box>
            </Box>

            <Stack direction="row" flexWrap="wrap" spacing={3} justifyContent="flex-end">
              <Button sx={{ px: '22px', py: '11px' }} onClick={onCloseHandler}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ px: '22px', py: '11px' }}>
                Confirm
              </LoadingButton>
            </Stack>
          </FormProvider>
        )}
        {dialogState === DIALOG_STATE.DEPLOY && <DeployingDialog />}
      </Card>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

const DeployingDialog = () => (
  <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" minHeight="50vh">
    <CircularProgress color="success" sx={{ mb: 3 }} />
    <p>Creating and deploying ticket smart contract...</p>
  </Box>
);
