export const ADSENSE_CLIENT = import.meta.env.PUBLIC_ADSENSE_CLIENT || '';
export const ADSENSE_ENABLED = import.meta.env.PUBLIC_ADS_ENABLED === 'true';

export const ADSENSE_MODE: 'non-personalized' | 'default' =
  (import.meta.env.PUBLIC_ADSENSE_MODE as any) === 'default' ? 'default' : 'non-personalized';

export const getAdsenseScriptSrc = () => {
  if (!ADSENSE_CLIENT) return '';
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
    ADSENSE_CLIENT,
  )}`;
};
