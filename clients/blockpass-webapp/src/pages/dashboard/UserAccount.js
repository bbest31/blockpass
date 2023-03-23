import { capitalCase } from 'change-case';
import { useMixpanel } from 'react-mixpanel-browser';
import { useEffect } from 'react';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
// routes
import { PATH_APP } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userWallets } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { AccountGeneral, AccountBilling, AccountChangePassword } from '../../sections/@dashboard/user/account';
import AccountOrganization from '../../sections/@dashboard/user/account/AccountOrganization';
// utils
import { trackEvent } from '../../utils/mixpanelUtils';

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();

  const { currentTab, onChangeTab } = useTabs('my_info');

  const { organization } = useAuth();

  const mixpanel = useMixpanel();

  useEffect(() => {
    trackEvent(mixpanel, 'Navigate', { page: 'UserAccount', tab: 'my_info' });
  }, []);

  const ACCOUNT_TABS = [
    {
      value: 'my_info',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral />,
    },
    {
      value: 'change_password',
      icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
    {
      value: 'wallet',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: <AccountBilling metadata={organization.metadata} />,
    },
    {
      value: 'organization',
      icon: <Iconify icon={'fa6-solid:user-group'} width={20} height={20} />,
      component: <AccountOrganization />,
    },
  ];

  const handleChangeTab = (event, value) => {
    onChangeTab(event, value);
    trackEvent(mixpanel, 'Navigate', { page: 'UserAccount', tab: value });
  };

  return (
    <Page title="Account">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account"
          links={[{ name: 'Dashboard', href: PATH_APP.general.dashboard }, { name: 'Account' }]}
        />

        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={handleChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
