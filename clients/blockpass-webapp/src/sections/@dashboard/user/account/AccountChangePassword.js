import { useState } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import axiosInstance from '../../../../utils/axios';
// components
import { FormProvider } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const [isEmailSent, setIsEmailSent] = useState(false);

  const methods = useForm({});
  const { user, getAccessToken } = useAuth();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      const token = await getAccessToken();

      // TODO: eventually grab user connections using https://auth0.com/docs/api/management/v2/#!/Users/get_users_by_id
      const data = {
        email: user.email,
        connection: 'Username-Password-Authentication',
      };
      axiosInstance
        .post(`/users/${user.id}/change-password`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          enqueueSnackbar('Email sent!');
          setIsEmailSent(true);
        })
        .catch((err) => {
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          throw err;
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-start">
          <h2>Reset Password</h2>
          <p>You will receive an email with a link to set a new password for your account.</p>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {isEmailSent ? 'Resend Email' : 'Send Email'}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
