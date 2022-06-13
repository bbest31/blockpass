import * as Yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import axiosInstance from '../../../../utils/axios';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountOrganization() {
  const { enqueueSnackbar } = useSnackbar();

  const { organization, getAccessToken, refreshOrg } = useAuth();

  const UpdateOrganizationSchema = Yup.object().shape({
    orgName: Yup.string().required('Organization Display Name is required'),
  });

  const [orgDisplayName, setOrgDisplayName] = useState(organization?.display_name ? organization.display_name : '');

  const methods = useForm({
    resolver: yupResolver(UpdateOrganizationSchema),
    defaultValues: {
      display_name: orgDisplayName,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
    try {
      if (orgDisplayName !== data.display_name) {
        const token = await getAccessToken();
        axiosInstance
          .patch(`/organizations/${organization.id}`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            enqueueSnackbar('Update success!');
            setOrgDisplayName(data.display_name);
            refreshOrg();
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
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              <RHFTextField name="display_name" label="Organization Display Name" />
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
