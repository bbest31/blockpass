// highlight
import './utils/highlight';

import 'react-18-image-lightbox/style.css';

// editor
import 'react-quill/dist/quill.snow.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MixpanelProvider } from 'react-mixpanel-browser';
import { createConfig, configureChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
// @mui
import { MIXPANEL_API, MIXPANEL_TOKEN, chains } from './config';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';

import { AuthProvider } from './contexts/Auth0Context';

//
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

const { publicClient, webSocketPublicClient } = configureChains([...chains], [publicProvider()]);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

createRoot(document.getElementById('root')).render(
  <MixpanelProvider config={{ ...MIXPANEL_API }} token={MIXPANEL_TOKEN}>
    <AuthProvider>
      <HelmetProvider>
        <SettingsProvider>
          <CollapseDrawerProvider>
            <WagmiConfig config={config}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </WagmiConfig>
          </CollapseDrawerProvider>
        </SettingsProvider>
      </HelmetProvider>
    </AuthProvider>
  </MixpanelProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
