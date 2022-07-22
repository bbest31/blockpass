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
import { fDateYearMonthDay, fTimeHourMinute } from '../../../../utils/formatTime';
// import axiosInstance from '../../../../utils/axios';
// _mock
// import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFEditor, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const singleColumn = { gridColumn: '1 / span 2' };

export default function OrganizationEventGeneral({ eventItem }) {
  // const { enqueueSnackbar } = useSnackbar();

  // const { user, getAccessToken, refreshUser } = useAuth();
  const event = { ...eventItem };

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

  const [eventName, setEventName] = useState(event?.name ? event.name : '');
  const [location, setLocation] = useState(event?.location ? event.location : '');
  const [startDate, setStartDate] = useState(event?.startDate ? fDateYearMonthDay(event.startDate) : '');
  const [startTime, setStartTime] = useState(event?.startDate ? fTimeHourMinute(event.startDate) : '');
  const [endDate, setEndDate] = useState(event?.endDate ? fDateYearMonthDay(event.endDate) : '');
  const [endTime, setEndTime] = useState(event?.endDate ? fTimeHourMinute(event.endDate) : '');
  const [website, setWebsite] = useState(event?.website ? event.website : '');
  const [description, setDescription] = useState(event?.description ? event.description : '');
  const [formDisabled, setFormDisabled] = useState(true);
  const [displayEndDate, setDisplayEndDate] = useState(endDate !== '');

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
    saveChanges(data);
    setFormDisabled(true);
  };

  const endDateSwitchHandler = () => {
    setDisplayEndDate(!displayEndDate);
  };

  const saveChanges = (data) => {
    try {
      let updateEvent = false;
      const newUserData = {};

      if (eventName !== data.eventName) {
        updateEvent = true;
        newUserData.eventName = data.eventName;
      }

      if (location !== data.location) {
        updateEvent = true;
        newUserData.location = data.location;
      }

      if (startDate !== data.startDate) {
        updateEvent = true;
        newUserData.startDate = data.startDate;
      }

      if (startTime !== data.startTime) {
        updateEvent = true;
        newUserData.startTime = data.startTime;
      }

      if (endDate !== data.endDate) {
        updateEvent = true;
        newUserData.endDate = data.endDate;
      }

      if (endTime !== data.endTime) {
        updateEvent = true;
        newUserData.endTime = data.endTime;
      }

      if (website !== data.website) {
        updateEvent = true;
        newUserData.website = data.website;
      }

      if (description !== data.description) {
        updateEvent = true;
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
              <RHFTextField name="eventName" label="Event Name" sx={singleColumn} disabled={formDisabled} />
              <Typography variant="h5" sx={singleColumn}>
                Location & Time
              </Typography>
              <RHFTextField name="location" label="Location" sx={singleColumn} disabled={formDisabled} />
              <RHFTextField name="startDate" label="Start Date" type="date" disabled={formDisabled} />
              <RHFTextField name="startTime" label="Start Time" type="time" disabled={formDisabled} />
              {displayEndDate && (
                <>
                  <RHFTextField name="endDate" label="End Date" type="date" disabled={formDisabled} />
                  <RHFTextField name="endTime" label="End Time" type="time" disabled={formDisabled} />
                </>
              )}
              <Box>
                <FormControlLabel
                  // value="start"
                  control={<Switch />}
                  label="End Date"
                  labelPlacement="start"
                  disabled={formDisabled}
                  checked={displayEndDate}
                  onChange={endDateSwitchHandler}
                />
              </Box>
              <RHFTextField name="website" label="Website (optional)" sx={singleColumn} disabled={formDisabled} />
              <Typography variant="h5" sx={singleColumn}>
                Description
              </Typography>
              <Box sx={singleColumn}>
                <RHFEditor name="description" label="Description" readOnly={formDisabled} />
              </Box>
            </Box>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {formDisabled ? (
                <EditButton onClickHandler={() => setFormDisabled(false)} />
              ) : (
                <SaveButton loading={isSubmitting} />
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

// ----------------------------------------------------------------------

const EditButton = ({ onClickHandler }) => {
  return (
    <LoadingButton variant="contained" onClick={onClickHandler}>
      Edit Info
    </LoadingButton>
  );
};

const SaveButton = ({ loading }) => {
  return (
    <LoadingButton type="submit" variant="contained" loading={loading}>
      Save Changes
    </LoadingButton>
  );
};
