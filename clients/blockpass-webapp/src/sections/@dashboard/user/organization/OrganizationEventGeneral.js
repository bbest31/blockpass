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
import axiosInstance from '../../../../utils/axios';
// components
import { FormProvider, RHFEditor, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const singleColumn = { gridColumn: '1 / span 2' };

export default function OrganizationEventGeneral({ eventItem }) {
  const { enqueueSnackbar } = useSnackbar();
  const { organization, getAccessToken } = useAuth();

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
  const [removeEndDate, setRemoveEndDate] = useState(false);

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
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    saveChanges(data);
    setFormDisabled(true);
  };

  const endDateSwitchHandler = () => {
    if (displayEndDate) {
      setEndDate('');
      setEndTime('');
      setValue('endDate', '');
      setValue('endTime', '');
      setRemoveEndDate(true);
    }
    setDisplayEndDate(!displayEndDate);
  };

  const saveChanges = async (data) => {
    try {
      let updateEvent = false;
      const newEventData = {};

      if (eventName !== data.eventName) {
        updateEvent = true;
        newEventData.eventName = data.eventName;
      }

      if (location !== data.location) {
        updateEvent = true;
        newEventData.location = data.location;
      }

      if (startDate !== data.startDate || startTime !== data.startTime) {
        updateEvent = true;
        newEventData.startDate = new Date(`${data.startDate} ${data.startTime}`);
      }

      if (endDate !== data.endDate || endTime !== data.endTime) {
        updateEvent = true;
        const newEndDate = new Date(`${data.endDate} ${data.endTime}`);

        if (Date.parse(newEndDate)) {
          newEventData.endDate = newEndDate;
        }
      }

      if (website !== data.website) {
        updateEvent = true;
        newEventData.website = data.website;
      }

      if (description !== data.description) {
        updateEvent = true;
        newEventData.description = data.description;
      }

      if (removeEndDate) {
        updateEvent = true;
        newEventData.removeEndDate = true;
      }

      if (updateEvent) {
        setEventName(data.eventName);
        const token = await getAccessToken();
        axiosInstance
          .patch(`/organizations/${organization.id}/events/${event._id}`, newEventData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            enqueueSnackbar('Event info updated!');
            updateEventState(data);
          })
          .catch((err) => {
            enqueueSnackbar('Something went wrong', { variant: 'error' });
            throw err;
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateEventState = (data) => {
    setEventName(data.eventName);
    setLocation(data.location);
    setStartDate(data.startDate);
    setStartTime(data.startTime);
    setEndDate(data.endDate);
    setEndTime(data.endTime);
    setWebsite(data.website);
    setDescription(data.description);
    setRemoveEndDate(false);
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
              <RHFTextField
                name="eventName"
                label="Event Name"
                sx={singleColumn}
                InputProps={{ readOnly: formDisabled }}
              />
              <Typography variant="h5" sx={singleColumn}>
                Location & Time
              </Typography>
              <RHFTextField
                name="location"
                label="Location"
                sx={singleColumn}
                InputProps={{ readOnly: formDisabled }}
              />
              <RHFTextField name="startDate" label="Start Date" type="date" InputProps={{ readOnly: formDisabled }} />
              <RHFTextField name="startTime" label="Start Time" type="time" InputProps={{ readOnly: formDisabled }} />
              {displayEndDate && (
                <>
                  <RHFTextField name="endDate" label="End Date" type="date" InputProps={{ readOnly: formDisabled }} />
                  <RHFTextField name="endTime" label="End Time" type="time" InputProps={{ readOnly: formDisabled }} />
                </>
              )}
              <Box>
                <FormControlLabel
                  control={<Switch />}
                  label="End Date"
                  labelPlacement="start"
                  disabled={formDisabled}
                  checked={displayEndDate}
                  onChange={endDateSwitchHandler}
                />
              </Box>
              <RHFTextField
                name="website"
                label="Website (optional)"
                sx={singleColumn}
                InputProps={{ readOnly: formDisabled }}
              />
              <Typography variant="h5" sx={singleColumn}>
                Description
              </Typography>
              <Box sx={singleColumn}>
                <RHFEditor name="description" label="Description" readOnly={formDisabled} />
              </Box>
            </Box>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {new Date(startDate) > Date.now() &&
                (formDisabled ? (
                  <EditButton onClickHandler={() => setFormDisabled(false)} />
                ) : (
                  <SaveButton loading={isSubmitting} />
                ))}
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
