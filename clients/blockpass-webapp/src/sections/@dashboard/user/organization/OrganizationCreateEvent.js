import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Button, Step, Stepper, Typography, Container, StepLabel, StepConnector } from '@mui/material';
// routes
import { PATH_APP } from '../../../../routes/paths';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { OrganizationCreateEventInfo, OrganizationCreateEventTicketTier } from '.';

// ----------------------------------------------------------------------

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const STEPS = ['Event Info', 'Ticket Tier(s)', 'Enhancements'];

// ----------------------------------------------------------------------

export default function OrganizationCreateEvent() {
  const [activeStep, setActiveStep] = useState(0);
  const [eventId, setEventId] = useState('');
  const [eventInformation, setEventInformation] = useState({});

  const handleNext = () =>
    activeStep === 0 || activeStep === 1 ? setActiveStep((currentStep) => currentStep + 1) : window.location.reload();

  const onEventCreated = (id, data) => {
    setEventId(id);
    setEventInformation(data);
  };

  return (
    <>
      <HeaderBreadcrumbs
        heading="Events"
        links={[{ name: 'Dashboard', href: PATH_APP.general.dashboard }, { name: 'Events' }, { name: 'Create Event' }]}
      />

      <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />} sx={{ paddingBottom: '36px' }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  typography: 'subtitle2',
                  color: 'text.disabled',
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Container sx={{ mt: '40px', py: '24px' }}>
        {activeStep === 0 && <OrganizationCreateEventInfo handleNext={handleNext} onEventCreated={onEventCreated} />}
        {activeStep === 1 && (
          <OrganizationCreateEventTicketTier
            eventId={eventId}
            eventInformation={eventInformation}
            handleNext={handleNext}
          />
        )}
        {activeStep === 2 && <OrganizationCreateEventEnhancement handleNext={handleNext} />}
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

OrganizationCreateEventEnhancement.propTypes = {
  handleNext: PropTypes.func,
};

const OrganizationCreateEventEnhancement = ({ handleNext }) => (
  <>
    <Typography variant="h4">{'Ticket Enhancements'}</Typography>
    <p>
      Showcase exclusive perks and rewards associated with ownership of a particular ticket tier. These highlight the
      many things you can offer as added value beyond the normal utility of the ticket.
    </p>
    <br />
    <p>Go to your ticket tier details page via the Event screen to manage ticket enhancements!</p>

    <Stack direction="row" flexWrap="wrap" spacing={3} justifyContent="flex-end" my={5}>
      <Button type="submit" variant="contained" onClick={handleNext} sx={{ px: '22px', py: '11px' }}>
        Finish
      </Button>
    </Stack>
  </>
);
