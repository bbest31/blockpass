import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Typography, Tabs, Container } from '@mui/material';
// routes
import { PATH_APP } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userAbout, _userGallery } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { ProfileCover } from '../../sections/@dashboard/user/profile';
import { OrganizationEventGallery, OrganizationEventToolbar } from '../../sections/@dashboard/user/organization';
// utils
import axiosInstance from '../../utils/axios';

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

export default function UserProfile() {
  useEffect(() => {
    getEvents();
  }, []);

  const { themeStretch } = useSettings();

  const { organization, getAccessToken } = useAuth();

  const { currentTab, onChangeTab } = useTabs('upcoming');

  const [filterOption, setFilterOption] = useState('ascending');

  const [findEvent, setFindEvent] = useState('');

  const [events, setEvents] = useState([]);

  const [filteredEvents, setFilteredEvents] = useState([]);

  const handleChangeTab = (event, value) => {
    const option = FILTER_OPTIONS[value][0];
    onChangeTab(event, value);
    setFilterOption(option);

    // Sort events based on default option in new tab
    filterMap[option]();
  };

  const handleFilterOption = (event) => {
    const option = event.target.value;
    setFilterOption(option);
    filterMap[option]();
  };

  const handleFindEvents = (value) => {
    setFindEvent(value);
    setFilteredEvents(events.filter(({ name }) => name.toLowerCase().includes(value)));
  };

  const getEvents = async () => {
    try {
      const token = await getAccessToken();

      axiosInstance
        .get(`/organization/${organization.id}/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          res.data.sort((event1, event2) => new Date(event1.startDate) - new Date(event2.startDate));
          setEvents(res.data);
          setFilteredEvents(res.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const sortAscending = () => {
    const sortedEvents = [...events].sort(
      (event1, event2) => new Date(event1.startDate) - new Date(event2.startDate)
    );
    setEvents(sortedEvents);
    searchEvents(sortedEvents);
  };

  const sortDescending = () => {
    const sortedEvents = [...events].sort(
      (event1, event2) => new Date(event2.startDate) - new Date(event1.startDate)
    );
    setEvents(sortedEvents);
    searchEvents(sortedEvents);
  };

  const searchEvents = (eventList) => {
    setFilteredEvents(eventList.filter(({ name }) => name.toLowerCase().includes(findEvent)));
  };

  const filterMap = {
    ascending: sortAscending,
    descending: sortDescending,
    newest: sortDescending,
    oldest: sortAscending,
  };

  const EVENT_TABS = [
    {
      value: 'upcoming',
      icon: <Iconify icon={'ic:round-calendar-today'} width={20} height={20} />,
      component: <OrganizationEventGallery title={'Upcoming Events'} gallery={filteredEvents} />,
    },
    {
      value: 'past',
      icon: <Iconify icon={'ic:round-inventory-2'} width={20} height={20} />,
      component: <OrganizationEventGallery title={'Past Events'} gallery={filteredEvents} />,
    },
  ];

  return (
    <Page title="Events">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Events"
          links={[{ name: 'Dashboard', href: PATH_APP.general.dashboard }, { name: 'Events' }]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover myProfile={_userAbout} />

          <TabsWrapperStyle>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={handleChangeTab}
            >
              {EVENT_TABS.map((tab) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalCase(tab.value)} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Upcoming events
          </Typography>

          <OrganizationEventToolbar
            filterName={findEvent}
            filterRole={filterOption}
            onFilterName={handleFindEvents}
            onFilterRole={handleFilterOption}
            optionsRole={FILTER_OPTIONS[currentTab]}
          />
        </Box>
        {EVENT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
