/* BestCheckout standalone admin navigation and demo store context. */

window.SITE = {
  brand: 'BestCheckout',
  store: 'Lavender Labs',
  role: 'Owner',
  email: 'hello@lavenderlabs.co',
};

window.STORES = [
  { name: 'Lavender Labs', url: 'lavender-labs.myshopify.com' },
  { name: 'Aura Living', url: 'aura-living.myshopify.com' },
  { name: 'Northline Goods', url: 'northline-goods.myshopify.com' },
];

window.NAV_MENU = [
  { id: 'home', label: 'Overview', icon: 'home', route: '#/home', desc: 'Setup, attention items, and checkout data for this store.' },
  { id: 'flows', label: 'Purchase flows', icon: 'apps', route: '#/flows', desc: 'Choose who sees each checkout, Upsell, and Downsell flow.' },
  { id: 'pages', label: 'Checkout pages', icon: 'page', route: '#/pages', desc: 'Customize Checkout, Upsell, Downsell, and Thank you pages.' },
  { id: 'orders', label: 'Orders', icon: 'inbox', route: '#/orders', desc: 'Orders created in BestCheckout and written back to Shopify.' },
  { id: 'activity', label: 'Activity log', icon: 'bell', route: '#/activity', desc: 'Important changes and service events for this Shopify store.' },
  {
    id: 'settings', label: 'Settings', icon: 'settings', route: '#/settings/base', desc: 'Manage the Shopify connection and checkout services.',
    children: [
      { id: 'settings-base', label: 'Shopify connection', route: '#/settings/base' },
      { id: 'settings-payments', label: 'Payment services', route: '#/settings/payments' },
      { id: 'settings-domains', label: 'Checkout domain', route: '#/settings/domains' },
      { id: 'settings-notifications', label: 'Email notifications', route: '#/settings/notifications' },
      { id: 'settings-roles', label: 'Roles', route: '#/settings/roles' },
      { id: 'settings-staff', label: 'Staff', route: '#/settings/staff' },
    ],
  },
];

window.NAV_CHANNELS = [];

window.NAV_SETTINGS = [
  { id: 'base', label: 'Shopify connection', icon: 'settings', route: '#/settings/base' },
  { id: 'payments', label: 'Payment services', icon: 'card', route: '#/settings/payments' },
  { id: 'domains', label: 'Checkout domain', icon: 'globe', route: '#/settings/domains' },
  { id: 'notifications', label: 'Email notifications', icon: 'bell', route: '#/settings/notifications' },
  {
    id: 'staffperms', label: 'Staff and permissions', icon: 'userPen', route: '#/settings/roles',
    children: [
      { id: 'roles', label: 'Roles', route: '#/settings/roles' },
      { id: 'staff', label: 'Staff', route: '#/settings/staff' },
    ],
  },
];

window.buildMenu = function () {
  return window.NAV_MENU;
};

window.ROUTE_MODULE = {
  home: 'home',
  flows: 'bestcheckout',
  pages: 'bestcheckout',
  orders: 'orders',
  activity: 'activity',
  payments: 'settings',
  domains: 'settings',
  notifications: 'settings',
  settings: 'settings',
  bestcheckout: 'bestcheckout',
  'online-store': 'online-store',
};

window.BESTSHOPIO_HELP_CENTER_URL = 'help/';

window.CHANGELOG = [
  {
    version: 'BestCheckout prototype',
    date: '2026-07',
    title: 'Standalone checkout growth workspace',
    modules: ['home', 'flows', 'pages', 'orders', 'activity', 'settings'],
    items: [
      'Public website and merchant admin now have separate entry paths.',
      'Checkout, Upsell, Downsell, and Thank you pages share one focused editor.',
      'Shopify connection, payments, checkout domain, notifications, and order writeback remain in one workspace.',
    ],
  },
];
