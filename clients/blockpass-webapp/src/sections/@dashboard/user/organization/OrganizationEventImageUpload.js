import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Stack, Typography } from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFUploadMultiFile } from '../../../../components/hook-form';
// utils
import axiosInstance from '../../../../utils/axios';

// ----------------------------------------------------------------------

OrganizationEventImageUpload.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function OrganizationEventImageUpload({ eventItem, isEdit, currentProduct }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { organization, getAccessToken } = useAuth();

  const EventImageSchema = Yup.object().shape({
    images: Yup.array().min(1, 'Images is required'),
  });

  const defaultValues = useMemo(
    () => ({
      images: currentProduct?.images || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(EventImageSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
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

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  const handleUpload = async () => {
    console.log('ON UPLOAD...');
    // console.log(values.images[0]);
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   // reset();
    //   enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    //   // navigate(PATH_DASHBOARD.eCommerce.list);
    // } catch (error) {
    //   console.error(error);
    // }
    const imageData = new FormData();

    values.images.forEach((image) => {
      imageData.append('images', image);
    });

    console.log(imageData.getAll('images'));

    const token = await getAccessToken();

    axiosInstance
      .patch(`/organizations/${organization.id}/events/${eventItem._id}/images`, imageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((imageUrls) => {
        enqueueSnackbar('Images successfully updated!');
      })
      .catch((err) => {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
        throw err;
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h5">Event Images</Typography>
          <RHFUploadMultiFile
            showPreview
            name="images"
            accept="image/*"
            maxSize={3145728}
            onDrop={handleDrop}
            onRemove={handleRemove}
            onRemoveAll={handleRemoveAll}
            onUpload={handleUpload}
          />
        </Stack>
      </Card>
    </FormProvider>
  );
}
