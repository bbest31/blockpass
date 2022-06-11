import * as Yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
// import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
// import { fData } from '../../../../utils/formatNumber';
import axiosInstance from '../../../../utils/axios';
// _mock
// import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, getAccessToken, refreshUser } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const [name, setName] = useState(user?.name ? user.name : '');
  const [email, setEmail] = useState(user?.email ? user.email : '');

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: {
      name,
      email,
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

      if (email !== data.email) {
        updateUser = true;
        newUserData.email = data.email;
      }

      if (name !== data.name) {
        updateUser = true;
        newUserData.name = data.name;
      }

      const token = await getAccessToken();

      if (updateUser) {
        axiosInstance
          .patch(`/users/${user.id}`, newUserData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            enqueueSnackbar('Update success!');
            setEmail(data.email);
            setName(data.name);
            refreshUser();
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
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="email" label="Email Address" />
            </Box>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
