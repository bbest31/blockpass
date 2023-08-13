import { useState } from 'react';
// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import { OrganizationEventsView, OrganizationEventDetails, OrganizationCreateEvent } from '../../sections/@dashboard/user/organization';

// ----------------------------------------------------------------------

export default function OrganizationEvents() {
  const { themeStretch } = useSettings();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [createEvent, setCreateEvent] = useState(false);

  const createEventHandler = () => setCreateEvent(true);

  const renderComponent = () => {
    if (selectedEvent)
      return (<OrganizationEventDetails eventItem={selectedEvent} />)
    
    if (createEvent)
      return <OrganizationCreateEvent />

    return (<OrganizationEventsView eventItem={selectedEvent} onClickHandler={setSelectedEvent} createEventHandler={createEventHandler} />)
  }

  return (
    <Page title="Events">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {renderComponent()}
      </Container>
    </Page>
  );
}
