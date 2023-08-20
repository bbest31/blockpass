import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Typography, Stack, Button, Container, FormControlLabel, Switch } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import { FormProvider, RHFEditor, RHFTextField, RHFUploadMultiFile } from '../../../../components/hook-form';
// utils
import axiosInstance from '../../../../utils/axios';

// ----------------------------------------------------------------------
const singleColumn = { gridColumn: '1 / span 2' };

OrganizationCreateEventInfo.propTypes = { handleNext: PropTypes.func, onEventCreated: PropTypes.func };

// ----------------------------------------------------------------------
const UpdateEventSchema = Yup.object().shape({
  eventName: Yup.string().required('Event name is required'),
  location: Yup.string().required('Location is required'),
  startDate: Yup.string().required('Start date is required'),
  startTime: Yup.string().required('Start time is required'),
  endDate: Yup.string(),
  endTime: Yup.string(),
  website: Yup.string().required('Website is required'),
  description: Yup.string().required('Description is required'),
  images: Yup.array().min(1, 'Images is required'),
});

export default function OrganizationCreateEventInfo({ handleNext, onEventCreated }) {
  const { organization, getAccessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [eventName] = useState('');
  const [location] = useState('');
  const [startDate] = useState('');
  const [startTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [website] = useState('');
  const [description] = useState('');
  const [displayEndDate, setDisplayEndDate] = useState(endDate !== '');
  const [images] = useState([]);

  const methods = useForm({
    resolver: yupResolver(UpdateEventSchema),
    defaultValues: {
      eventName,
      location,
      startDate,
      startTime,
      endDate,
      endTime,
      website,
      description,
      images,
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const endDateSwitchHandler = () => {
    if (displayEndDate) {
      setEndDate('');
      setEndTime('');
      setValue('endDate', '');
      setValue('endTime', '');
    }
    setDisplayEndDate(!displayEndDate);
  };

  const onSubmit = async () => {
    const eventFormData = createFormData();
    handleUpload(eventFormData);
  };

  const createFormData = () => {
    const formData = new FormData();

    formData.append('name', values.eventName);
    formData.append('location', values.location);
    formData.append('startDate', new Date(`${values.startDate} ${values.startTime}`));
    formData.append('website', values.website);
    formData.append('description', values.description);

    if (values.endDate && values.endTime) formData.append('endDate', new Date(`${values.endDate} ${values.endTime}`));

    values.images.forEach((image) => {
      if (image instanceof File) formData.append('images', image);
    });

    return formData;
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const images = values.images || [];

      setValue('images', [
        ...images,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [setValue, values.images]
  );

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  const handleUpload = async (formData) => {
    const token = await getAccessToken();
    const controller = new AbortController();

    axiosInstance
      .post(`/organizations/${organization.id}/events`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      .then((response) => {
        enqueueSnackbar('Event successfully created!');
        onEventCreated(response.data._id, values);
        handleNext();
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          throw err;
        }
      });
  };

  return (
    <>
      <Container sx={{ mb: '24px' }}>
        <Typography variant="h4" sx={{ mb: '10px' }}>
          {'Event Info'}
        </Typography>
        <p>
          Provide the essential information about your event. This information will be shown to attendees to tell them
          about your event and tell them why they should attend.
        </p>
      </Container>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid my={5}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Typography variant="h5" sx={singleColumn}>
                  Basic Info
                </Typography>
                <RHFTextField name="eventName" label="Event Name" sx={singleColumn} />
                <Typography variant="h5" sx={singleColumn}>
                  Location & Time
                </Typography>
                <RHFTextField name="location" label="Location" sx={singleColumn} />
                <RHFTextField name="startDate" label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
                <RHFTextField name="startTime" label="Start Time" type="time" InputLabelProps={{ shrink: true }} />
                {displayEndDate && (
                  <>
                    <RHFTextField name="endDate" label="End Date" type="date" InputLabelProps={{ shrink: true }} />
                    <RHFTextField name="endTime" label="End Time" type="time" InputLabelProps={{ shrink: true }} />
                  </>
                )}
                <Box>
                  <FormControlLabel
                    control={<Switch />}
                    label="End Date"
                    labelPlacement="start"
                    checked={displayEndDate}
                    onChange={endDateSwitchHandler}
                  />
                </Box>
                <RHFTextField name="website" label="Website (optional)" sx={singleColumn} />
                <Typography variant="h5" sx={singleColumn}>
                  Description
                </Typography>
                <Box sx={singleColumn}>
                  <RHFEditor name="description" label="Description" />
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ px: 3, pt: 3 }}>
          <Typography variant="h5" sx={{ ...singleColumn, pb: '24px' }}>
            Event Images
          </Typography>
          <RHFUploadMultiFile
            showPreview
            name="images"
            accept="image/*"
            maxSize={3145728}
            onDrop={handleDrop}
            uploadButton={false}
            removeAllButton={false}
            onRemove={handleRemove}
            sx={{}}
          />
        </Card>

        <Stack direction="row" flexWrap="wrap" spacing={3} justifyContent="flex-end" my={5}>
          <Button sx={{ px: '22px', py: '11px' }} onClick={() => window.location.reload()}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ px: '22px', py: '11px' }}>
            Save & Continue
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
}
