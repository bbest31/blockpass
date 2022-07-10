export function trackEvent(mixpanel, name, properties) {
  try {
    if (mixpanel.config.token) {
      mixpanel.track(name, properties);
    }
  } catch (err) {
    console.warn('Mixpanel token not present: ', err);
  }
}
