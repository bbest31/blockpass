import { capitalCase } from 'change-case';
import { useMixpanel } from 'react-mixpanel-browser';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Tab, Box, Tabs } from '@mui/material';
// routes
import { PATH_APP } from '../../../../routes/paths';
// hooks
import useTabs from '../../../../hooks/useTabs';
// components
import Iconify from '../../../../components/Iconify';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import {
  OrganizationEventInsights,
  OrganizationEventGeneral,
  OrganizationEventImageUpload,
  OrganizationTicketTierDetail,
  OrganizationTicketTierList,
} from './index';
// utils
import { trackEvent } from '../../../../utils/mixpanelUtils';

// ----------------------------------------------------------------------

OrganizationEventDetails.propTypes = {
  eventItem: PropTypes.object,
};

export default function OrganizationEventDetails({ eventItem }) {
  const { currentTab, onChangeTab } = useTabs('insights');
  const [selectedTicketTier, setSelectedTicketTier] = useState(null);

  const mixpanel = useMixpanel();

  useEffect(() => {
    trackEvent(mixpanel, 'Navigate', { page: `Event Details ${eventItem._id}`, tab: 'insights' });
  }, [mixpanel, eventItem]);

  const onTicketTierSelectedHandler = (ticketTier) => {
    setSelectedTicketTier(ticketTier);
  };

  const EVENT_TABS = [
    {
      value: 'insights',
      icon: <Iconify icon={'ic:baseline-trending-up'} width={20} height={20} />,
      component: <OrganizationEventInsights eventItem={eventItem} />,
    },
    {
      value: 'basic_info',
      icon: <Iconify icon={'ic:baseline-info'} width={20} height={20} />,
      component: <OrganizationEventGeneral eventItem={eventItem} />,
    },
    {
      value: 'details',
      icon: <Iconify icon={'ic:baseline-photo'} width={20} height={20} />,
      component: <OrganizationEventImageUpload eventItem={eventItem} />,
    },
    {
      value: 'tickets',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: <OrganizationTicketTierList eventItem={eventItem} onClickHandler={onTicketTierSelectedHandler} />,
    },
  ];

  const handleChangeTab = (event, value) => {
    onChangeTab(event, value);
    trackEvent(mixpanel, 'Navigate', { page: `EventDetails ${eventItem._id}`, tab: value });
  };

  return selectedTicketTier ? (
    <OrganizationTicketTierDetail details={selectedTicketTier} event={{ id: eventItem._id, name: eventItem.name }} />
  ) : (
    <>
      <HeaderBreadcrumbs
        heading="Events"
        links={[
          { name: 'Dashboard', href: PATH_APP.general.dashboard },
          { name: 'Events', href: PATH_APP.general.events },
          { name: eventItem.name },
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
    </>
  );
}
