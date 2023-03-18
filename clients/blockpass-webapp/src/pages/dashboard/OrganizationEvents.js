import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
// routes
// import { PATH_APP } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userAbout } from '../../_mock';
// components
import Page from '../../components/Page';
// sections
import { OrganizationEventsView, OrganizationEventDetails } from '../../sections/@dashboard/user/organization';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));

const FILTER_OPTIONS = {
  upcoming: ['ascending', 'descending'],
  past: ['newest', 'oldest'],
};

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
