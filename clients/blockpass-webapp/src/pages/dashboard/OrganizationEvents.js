import { capitalCase } from 'change-case';
import { useState } from 'react';
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
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  Profile,
  ProfileCover,
  ProfileFriends,
  ProfileGallery,
  ProfileFollowers,
} from '../../sections/@dashboard/user/profile';

import { OrganizationEventGallery, OrganizationEventToolbar } from '../../sections/@dashboard/user/organization';

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
  const { themeStretch } = useSettings();

  const { user } = useAuth();

  const { currentTab, onChangeTab } = useTabs('upcoming');

  const [filterDate, setFilterDate] = useState('ascending');

  const [findEvent, setFindEvent] = useState('');

  const handleChangeTab = (event, value) => {
    onChangeTab(event, value);
    setFilterDate(FILTER_OPTIONS[value][0])
  }

  const handleFilterDate = (event) => {
    setFilterDate(event.target.value);
  };

  const handleFindEvents = (value) => {
    setFindEvent(value);
  };

  const EVENT_TABS = [
    {
      value: 'upcoming',
      icon: <Iconify icon={'ic:round-calendar-today'} width={20} height={20} />,
      component: <OrganizationEventGallery title={'Upcoming Events'} gallery={_userGallery} />,
    },
    {
      value: 'past',
      icon: <Iconify icon={'ic:round-inventory-2'} width={20} height={20} />,
      component: <OrganizationEventGallery title={'Past Events'} gallery={_userGallery} />,
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
            filterRole={filterDate}
            onFilterName={handleFindEvents}
            onFilterRole={handleFilterDate}
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
