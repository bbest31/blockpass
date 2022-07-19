import { capitalCase } from 'change-case';
import PropTypes from 'prop-types';
// import { useMixpanel } from 'react-mixpanel-browser';
// import { useEffect } from 'react';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
// routes
import { PATH_APP } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userWallets } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { OrganizationEventGeneral } from '../../sections/@dashboard/user/organization';

// ----------------------------------------------------------------------

OrganizationEventDetails.propTypes = {
  eventItem: PropTypes.object,
};

export default function OrganizationEventDetails({ eventItem }) {
  const { themeStretch } = useSettings();

  const { currentTab, onChangeTab } = useTabs('basic_info');

  const EVENT_TABS = [
    {
      value: 'basic_info',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <OrganizationEventGeneral />,
    },
  ];

  const handleChangeTab = (event, value) => {
    onChangeTab(event, value);
  };

  return (
    <Page title="Events">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Events"
          links={[
            { name: 'Dashboard', href: PATH_APP.general.dashboard },
            { name: 'Events', href: PATH_APP.general.events },
            { name: 'Event Name' },
          ]}
        />

        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={handleChangeTab}
        >
          {EVENT_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {EVENT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
