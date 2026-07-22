/**
 * BestCheckout standalone portal domain constants.
 * Production should migrate this file to TypeScript without changing the model.
 */

export const APP_NAV = [
  { id: 'funnels', label: 'Checkout flows', icon: 'flow', productionPath: '/app/funnels' },
  { id: 'pages', label: 'Checkout pages', icon: 'pages', productionPath: '/app/pages' },
  { id: 'orders', label: 'Orders', icon: 'orders', productionPath: '/app/orders' },
  { id: 'performance', label: 'Performance', icon: 'analytics', productionPath: '/app/performance' },
  { id: 'activity', label: 'Activity', icon: 'activity', productionPath: '/app/activity' },
  { id: 'settings', label: 'Settings', icon: 'settings', productionPath: '/app/settings' },
];

export const PAGE_TYPE = {
  CHECKOUT: 'checkout',
  UPSELL: 'upsell',
  DOWNSELL: 'downsell',
  THANK_YOU: 'thank-you',
};

export const PAGE_TYPE_LABEL = {
  [PAGE_TYPE.CHECKOUT]: 'Checkout',
  [PAGE_TYPE.UPSELL]: 'Upsell',
  [PAGE_TYPE.DOWNSELL]: 'Downsell',
  [PAGE_TYPE.THANK_YOU]: 'Thank you',
};

export const FUNNEL_STATUS = {
  LIVE: 'Live',
  DRAFT: 'Draft',
  PAUSED: 'Paused',
};

export const FUNNEL_DEPLOYMENT_SCHEMA_VERSION = 'bestcheckout.funnel-deployment.v1';
export const TRACKING_CONTRACT_VERSION = 'bestcheckout.tracking.v1';

export const PROVIDER_STATUS = {
  CONNECTED: 'Connected',
  ACTION_REQUIRED: 'Action required',
  PLANNED: 'Planned',
};

export const CAPABILITY = {
  SUPPORTED: 'Supported',
  CONDITIONAL: 'Conditional',
  NOT_SUPPORTED: 'Not supported',
  NOT_EVALUATED: 'Not evaluated',
  PLANNED: 'Planned',
};

export const SETTINGS_TABS = [
  { id: 'store', label: 'Shopify store' },
  { id: 'domain', label: 'Domain' },
  { id: 'payments', label: 'Payments' },
  { id: 'emails', label: 'Checkout emails' },
  { id: 'tracking', label: 'Tracking' },
  { id: 'diagnostics', label: 'Diagnostics' },
];

export const ACTIVITY_FILTERS = [
  { id: 'all', label: 'All updates' },
  { id: 'payment', label: 'Payments' },
  { id: 'post-purchase', label: 'Buyer offers' },
  { id: 'sync', label: 'Store data' },
  { id: 'writeback', label: 'Shopify orders' },
  { id: 'tracking', label: 'Sales tracking' },
];

export const PERFORMANCE_TABS = [
  { id: 'funnel', label: 'Funnels' },
  { id: 'page', label: 'Pages' },
  { id: 'provider', label: 'Providers' },
  { id: 'channel', label: 'Channels' },
];

export const NODE_KIND = {
  ENTRY: 'entry',
  CHECKOUT: 'checkout',
  UPSELL: 'upsell',
  DOWNSELL: 'downsell',
  THANK_YOU: 'thank-you',
};
