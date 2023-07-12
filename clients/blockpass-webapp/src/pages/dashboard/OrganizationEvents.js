import { useState } from 'react';
// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import { OrganizationEventsView, OrganizationEventDetails } from '../../sections/@dashboard/user/organization';

// ----------------------------------------------------------------------

export default function OrganizationEvents() {
  const { themeStretch } = useSettings();

  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <Page title="Events">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {selectedEvent ? (
          <OrganizationEventDetails eventItem={selectedEvent} />
        ) : (
          <OrganizationEventsView eventItem={selectedEvent} onClickHandler={setSelectedEvent} />
        )}
      </Container>
    </Page>
  );
}
