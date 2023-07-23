import { capitalCase } from 'change-case';
import { useMixpanel } from 'react-mixpanel-browser';
import { useEffect } from 'react';
// @mui
import { Container, Box, Card, Typography } from '@mui/material';
// routes
import { PATH_APP } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userWallets } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Markdown from '../../components/Markdown';
// sections
import BlogPostHero from '../../sections/@dashboard/general/support/BlogPostHero';
// utils
import { trackEvent } from '../../utils/mixpanelUtils';

import cover from '../../assets/images/token_gate_cover.png';

// ----------------------------------------------------------------------

export default function TokenGating() {
  const { themeStretch } = useSettings();

  const mixpanel = useMixpanel();

  const post = {
    title: 'Token Gating: tools for exclusive access to content, communities, or spaces.',
    author: 'BlockPass',
    cover,
    description: `Token gating with NFTs (non-fungible tokens) refers to the use of smart contracts to control access to certain features or services based on the ownership of a specific NFT.  For example, a game developer may create an NFT that serves as a "key" to unlock certain levels or in-game items. In order to access these features, a player would need to purchase or otherwise acquire the NFT. This creates a way for the developer to monetize their game by selling access to exclusive content or experiences. Token gating can also be used in other contexts, such as granting access to online communities or exclusive content on a website.`,
    body: `The world of blockchain technology and non-fungible tokens (NFTs) has opened up a whole new realm of possibilities for creators and businesses. One of the most exciting and innovative uses of NFTs is token gating. Token gating is the process of using smart contracts to control access to certain features or services based on the ownership of a specific NFT.  
    <br/>One of the key benefits of token gating with NFTs is the ability to monetize online communities and exclusive content. For example, a creator can use NFTs to grant access to an exclusive online community or forum. Only those who own the NFT would be able to participate in the community and view its content. This can be a great way for creators to monetize their work and build a dedicated fanbase.  
    <br/>Another benefit of token gating is the ability to monetize online content. For example, a website or platform can use NFTs to unlock exclusive articles, videos, or other content. Only those who own the NFT would be able to view the content, creating a new revenue stream for the platform. This can also be used to reward loyal readers or fans with exclusive content that they would not be able to find elsewhere.  
    <br/>Finally, token gating with NFTs can also be used to control access to physical spaces. For example, a nightclub or concert venue could use NFTs to grant access to VIP areas or exclusive events. Only those who own the NFT would be able to enter the VIP area or attend the event, creating a new way for venues to monetize their space and attract high-paying customers.

<br/>**We have curated some of the best tools available to create your own token gated experiences for your event attendees:**
* [Mintgate](https://mintgate.io/) **(Online content)**
* [Swordy Bot](https://swordybot.com/) **(Discord channels)**
* [Guild.xyz](https://guild.xyz/) **(Discord server)**

<br/>In conclusion, token gating with NFTs is a powerful tool that can be used to monetize online communities, online content, and physical spaces. It can help creators and businesses to build a dedicated fanbase and create a new revenue stream. As the world of blockchain and NFTs continues to evolve, we can expect to see more and more uses for token gating in the future.
    `,
  };

  useEffect(() => {
    trackEvent(mixpanel, 'Navigate', { page: 'TokenGating' });
  }, []);

  return (
    <Page title="Token Gating Guide">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Token Gating"
          links={[{ name: 'Dashboard', href: PATH_APP.general.dashboard }, { name: 'Token Gating' }]}
        />
        <Card>
          <BlogPostHero post={post} />
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h6" sx={{ mb: 5 }}>
              {post.description}
            </Typography>

            <Markdown children={post.body} />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
