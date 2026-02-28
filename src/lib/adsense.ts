export const ADSENSE_CLIENT = import.meta.env.PUBLIC_ADSENSE_CLIENT || '';

// Keep the AdSense script enabled for verification/review if desired.
export const ADSENSE_ENABLED = import.meta.env.PUBLIC_ADS_ENABLED === 'true';

// Control whether we actually render visible ad slots.
// Default OFF so the site doesn't show empty ad boxes during review.
export const ADS_RENDER = import.meta.env.PUBLIC_ADS_RENDER === 'true';

export const ADSENSE_MODE: 'non-personalized' | 'default' =
  (import.meta.env.PUBLIC_ADSENSE_MODE as any) === 'default' ? 'default' : 'non-personalized';

export const getAdsenseScriptSrc = () => {
  if (!ADSENSE_CLIENT) return '';
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
    ADSENSE_CLIENT,
  )}`;
};
