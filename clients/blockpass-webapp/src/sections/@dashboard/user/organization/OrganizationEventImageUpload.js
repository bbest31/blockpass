import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  eventItem: PropTypes.object,
  isEdit: PropTypes.bool,
};

export default function OrganizationEventImageUpload({ eventItem, isEdit }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { organization, getAccessToken } = useAuth();

  const [removedImages, setRemovedImages] = useState([]);

  const EventImageSchema = Yup.object().shape({
    images: Yup.array().min(1, 'Images is required'),
  });

  const defaultValues = useMemo(
    () => ({
      images: eventItem?.images || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventItem]
  );

  const methods = useForm({
    resolver: yupResolver(EventImageSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && eventItem) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, eventItem]);

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
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

  const handleRemoveAll = async () => {
    const imageData = new FormData();

    values.images.forEach((image) => {
      if (!(image instanceof File)) {
        imageData.append('removedImages', image);
      }
    });

    setValue('images', []);

    const token = await getAccessToken();
    const controller = new AbortController();

    axiosInstance
      .patch(`/organizations/${organization.id}/events/${eventItem._id}/images`, imageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      .then(() => {
        setRemovedImages([]);
        enqueueSnackbar('Images successfully removed!');
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          throw err;
        }
      });
  };

  const handleRemove = (file) => {
    if (values.images.length === 1) {
      enqueueSnackbar('At least 1 image is required', { variant: 'warning' });
      return;
    }

    if (!(file instanceof File)) {
      setRemovedImages((prevState) => [...prevState, file]);
    }

    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  const handleUpload = async () => {
    const imageData = new FormData();

    // only send newly uploaded images
    values.images.forEach((image) => {
      if (image instanceof File) imageData.append('images', image);
    });

    removedImages.forEach((image) => {
      imageData.append('removedImages', image);
    });

    if (imageData.getAll('images').length === 0 && imageData.getAll('removedImages').length === 0) {
      enqueueSnackbar('No changes to images detected', { variant: 'warning' });
      return;
    }

    const token = await getAccessToken();
    const controller = new AbortController();

    axiosInstance
      .patch(`/organizations/${organization.id}/events/${eventItem._id}/images`, imageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      .then(() => {
        setRemovedImages([]);
        enqueueSnackbar('Images successfully updated!');
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          throw err;
        }
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
