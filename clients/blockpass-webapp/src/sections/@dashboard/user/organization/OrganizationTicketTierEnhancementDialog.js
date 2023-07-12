import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Grid,
  Stack,
  Dialog,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import { fDateYearMonthDay } from '../../../../utils/formatTime';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const ENHANCEMENT_TYPES = ['Access', 'Discount', 'Gift', 'Reward'];
const singleColumn = { gridColumn: '1 / span 2' };

// ----------------------------------------------------------------------

OrganizationTicketTierEnhancementDialog.propTypes = {
  open: PropTypes.bool,
  showHandler: PropTypes.func,
  enhancement: PropTypes.object,
  createHandler: PropTypes.func,
  updateHandler: PropTypes.func,
  deleteHandler: PropTypes.func
};

export default function OrganizationTicketTierEnhancementDialog({
  open,
  showHandler,
  enhancement,
  createHandler,
  updateHandler,
  deleteHandler,
}) {
  const UpdateEnhancementSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    redemptionLimit: Yup.number().positive('Redemption Limit must be greater than 0').integer(),
    type: Yup.string().required('Enhancement Type is required'),
    expiry: Yup.string().required('Expiry Date is required'),
    shortDesc: Yup.string().required('Short Description is required'),
    longDesc: Yup.string().required('Long Description is required'),
    active: Yup.bool(),
  });

  const [title, setTitle] = useState('');
  const [redemptionLimit, setRedemptionLimit] = useState('');
  const [unlimitedRedemption, setUnlimitedRedemption] = useState(false);
  const [type, setType] = useState('');
  const [expiry, setExpiry] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [active, setActive] = useState(false);

  const [editable, setEditable] = useState(false);

  const methods = useForm({
    resolver: yupResolver(UpdateEnhancementSchema),
    defaultValues: {
      title,
      redemptionLimit,
      type,
      expiry,
      shortDesc,
      longDesc,
      active,
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const title = enhancement.title || '';
    setTitle(title);
    setValue('title', title);

    const redemptionLimit = enhancement.redemptionLimit || '';
    setRedemptionLimit(redemptionLimit);
    setValue('redemptionLimit', redemptionLimit);

    setUnlimitedRedemption(false);

    const type = enhancement.type || '';
    setType(type);
    setValue('type', type);

    const expiry = enhancement.expiry ? fDateYearMonthDay(enhancement.expiry) : '';
    setExpiry(expiry);
    setValue('expiry', expiry);

    const shortDesc = enhancement.shortDesc || '';
    setShortDesc(shortDesc);
    setValue('shortDesc', shortDesc);

    const longDesc = enhancement.longDesc || '';
    setLongDesc(longDesc);
    setValue('longDesc', longDesc);

    const active = enhancement.active || false;
    setActive(active);
    setValue('active', active);

    if (Object.keys(enhancement).length === 0) {
      setEditable(true);
    } else {
      setEditable(false);
    }
  }, [enhancement]);

  const onSubmit = async (data) => {
    onSaveHandler(data);
  };

  const onActiveChanged = (e) => {
    setValue('active', e.target.checked);
  };

  const unlimitedRedemptionCheckboxHandler = (e) => {
    setUnlimitedRedemption(e.target.checked);
    if (e.target.checked) {
      setValue('redemptionLimit', 10000000000);
    }
  };

  const onCloseHandler = () => {
    showHandler();
  };

  const onSaveHandler = (data) => {
    let dataChanged = false;
    const newData = {};

    if (data.title !== enhancement?.title) {
      dataChanged = true;
      newData.title = data.title;
    }

    if (data.redemptionLimit !== enhancement?.redemptionLimit) {
      dataChanged = true;
      newData.redemptionLimit = data.redemptionLimit;
    }

    if (data.type !== enhancement?.type) {
      dataChanged = true;
      newData.type = data.type;
    }

    if (enhancement.expiry === undefined || fDateYearMonthDay(data.expiry) !== fDateYearMonthDay(enhancement?.expiry)) {
      dataChanged = true;

      newData.expiry = new Date(`${data.expiry} 00:00:00`);
    }

    if (data.shortDesc !== enhancement?.shortDesc) {
      dataChanged = true;
      newData.shortDesc = data.shortDesc;
    }

    if (data.longDesc !== enhancement?.longDesc) {
      dataChanged = true;
      newData.longDesc = data.longDesc;
    }

    if (data.active !== enhancement?.active) {
      dataChanged = true;
      newData.active = data.active;
    }

    if (!dataChanged) return;

    if (Object.keys(enhancement).length === 0) {
      createHandler(newData);
    } else {
      updateHandler(newData);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={showHandler}>
      <Stack sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Ticket Enhancment
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid item>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="title" label="Title" sx={singleColumn} InputProps={{ readOnly: !editable }} />
              <RHFTextField
                name="redemptionLimit"
                label="Redemption Limit"
                sx={singleColumn}
                disabled={unlimitedRedemption}
                InputProps={{ readOnly: !editable }}
              />
              <Box sx={singleColumn}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Unlimited Redemption"
                  disabled={!editable}
                  // checked={displayEndDate}
                  onChange={unlimitedRedemptionCheckboxHandler}
                />
              </Box>

              <RHFTextField
                name="type"
                label="Enhancement Type"
                select
                defaultValue=""
                InputProps={{ readOnly: !editable }}
              >
                {ENHANCEMENT_TYPES.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFTextField>
              <RHFTextField
                name="expiry"
                label="Expiry Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <RHFTextField
                name="shortDesc"
                label="Short Description"
                sx={singleColumn}
                InputProps={{ readOnly: !editable }}
              />
              <RHFTextField
                name="longDesc"
                label="Long Description"
                sx={singleColumn}
                multiline
                rows={4}
                InputProps={{ readOnly: !editable }}
              />

              <Box sx={singleColumn}>
                <FormControlLabel
                  control={<Switch />}
                  name="active"
                  onChange={onActiveChanged}
                  label="Active"
                  labelPlacement="start"
                  sx={{ ml: 1 }}
                  disabled={!editable}
                />
              </Box>
            </Box>
            <Grid container justifyContent={'flex-end'} sx={{ mt: 2 }}>
              {Object.keys(enhancement).length !== 0 && (
                <Grid item xs={6}>
                  <Button variant="text" color="error" onClick={deleteHandler}>
                    Remove Ticket Enhancement
                  </Button>
                </Grid>
              )}
              <Grid item xs={6}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" color="inherit" onClick={onCloseHandler}>
                    Close
                  </Button>
                  {!editable ? (
                    <EditButton onClickHandler={() => setEditable(true)} />
                  ) : (
                    <SaveButton loading={isSubmitting} />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </FormProvider>
      </Stack>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

const EditButton = ({ onClickHandler }) => (
  <LoadingButton variant="contained" onClick={onClickHandler}>
    Edit Info
  </LoadingButton>
);

EditButton.propTypes = {
  onClickHandler: PropTypes.func
};

const SaveButton = ({ loading }) => (
  <LoadingButton type="submit" variant="contained" loading={loading}>
    Save Changes
  </LoadingButton>
);

SaveButton.propTypes = {
  loading: PropTypes.bool
};