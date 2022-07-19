import * as Yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, Switch, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
// import axiosInstance from '../../../../utils/axios';
// _mock
// import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFEditor, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const singleColumn = { gridColumn: '1 / span 2' };

export default function OrganizationEventGeneral() {
  // const { enqueueSnackbar } = useSnackbar();

  // const { user, getAccessToken, refreshUser } = useAuth();
  const event = {};

  const UpdateEventSchema = Yup.object().shape({
    eventName: Yup.string().required('Event name is required'),
    location: Yup.string().required('Location is required'),
    startDate: Yup.string().required('Start date is required'),
    startTime: Yup.string().required('Start time is required'),
    endDate: Yup.string(),
    endTime: Yup.string(),
    website: Yup.string(),
    description: Yup.string(),
  });

  // const [name, setName] = useState(user?.name ? user.name : '');
  // const [email, setEmail] = useState(user?.email ? user.email : '');

  const [eventName, setEventName] = useState(event?.eventName ? event.eventName : '');
  const [location, setLocation] = useState(event?.location ? event.location : '');
  const [startDate, setStartDate] = useState(event?.startDate ? event.startDate : '');
  const [startTime, setStartTime] = useState(event?.startTime ? event.startTime : '');
  const [endDate, setEndDate] = useState(event?.endDate ? event.endDate : '');
  const [endTime, setEndTime] = useState(event?.endTime ? event.endTime : '');
  const [website, setWebsite] = useState(event?.website ? event.website : '');
  const [description, setDescription] = useState(event?.description ? event.description : '');
  const [formEditable, setFormEditable] = useState(false);

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
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      let updateUser = false;
      const newUserData = {};

      if (eventName !== data.eventName) {
        updateUser = true;
        newUserData.eventName = data.eventName;
      }

      if (location !== data.location) {
        updateUser = true;
        newUserData.location = data.location;
      }

      if (startDate !== data.startDate) {
        updateUser = true;
        newUserData.startDate = data.startDate;
      }

      if (startTime !== data.startTime) {
        updateUser = true;
        newUserData.startTime = data.startTime;
      }

      if (endDate !== data.endDate) {
        updateUser = true;
        newUserData.endDate = data.endDate;
      }

      if (endTime !== data.endTime) {
        updateUser = true;
        newUserData.endTime = data.endTime;
      }

      if (website !== data.website) {
        updateUser = true;
        newUserData.website = data.website;
      }

      if (description !== data.description) {
        updateUser = true;
        newUserData.description = data.description;
      }

      console.table(newUserData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
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
              <RHFTextField name="eventName" label="Event Name" sx={singleColumn} disabled={formEditable} />
              <Typography variant="h5" sx={singleColumn}>
                Location & Time
              </Typography>
              <RHFTextField name="location" label="Location" sx={singleColumn} disabled={formEditable} />
              <RHFTextField name="startDate" label="Start Date" disabled={formEditable} />
              <RHFTextField name="startTime" label="Start Time" disabled={formEditable} />
              <RHFTextField name="endDate" label="End Date" disabled={formEditable} />
              <RHFTextField name="endTime" label="End Time" disabled={formEditable} />
              <Box>
                <FormControlLabel
                  // value="start"
                  control={<Switch />}
                  label="End Date"
                  labelPlacement="start"
                />
              </Box>
              <RHFTextField name="website" label="Website (optional)" sx={singleColumn} disabled={formEditable} />
              <Typography variant="h5" sx={singleColumn}>
                Description
              </Typography>
              <Box sx={singleColumn}>
                <RHFEditor name="description" label="Description" />
              </Box>
            </Box>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {formEditable ? 'Save Changes' : 'Edit Info'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
