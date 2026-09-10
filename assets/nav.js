/* BestCheckout standalone admin navigation and demo store context. */

window.SITE = {
  brand: 'BestCheckout',
  store: 'Lavender Labs',
  role: 'Owner',
  email: 'hello@lavenderlabs.co',
};

window.STORES = [
  { name: 'Lavender Labs', url: 'lavender-labs.myshopify.com', homeState: 'unconfigured' },
  { name: 'Aura Living', url: 'aura-living.myshopify.com', homeState: 'ready' },
  { name: 'Northline Goods', url: 'northline-goods.myshopify.com', homeState: 'live' },
  { name: 'Kiln Coffee', url: 'kiln-coffee.myshopify.com', homeState: 'live', homeDataKey: 'kiln' },
  { name: 'Northstar', url: 'northstar.myshopify.com', connectStatus: 'pending' },
  { name: 'Atelier', url: 'atelier.myshopify.com', connectStatus: 'install' },
  { name: 'Harbor', url: 'harbor.myshopify.com', connectStatus: 'expired' },
  { name: 'River Remedy', url: 'river-remedy.myshopify.com', connectStatus: 'disabled' },
];

// Store A has a complete Shopify grant. Store B is the “too few scopes at
// app creation” case used on Overview and Shopify connection.
window.shopifyPermissionsHealthy = function (storeName) {
  var stores = window.STORES || [];
  var name = storeName || (window.SITE && window.SITE.store) || '';
  return !(stores[1] && name === stores[1].name);
};

window.NAV_MENU = [
  { id: 'home', label: 'Overview', icon: 'home', route: '#/home', desc: 'Setup, attention items, and checkout data for this store.' },
  { id: 'flows', label: 'Purchase flows', icon: 'apps', route: '#/flows', desc: 'Choose who sees each checkout, Upsell, and Downsell flow.' },
  { id: 'pages', label: 'Checkout pages', icon: 'page', route: '#/pages', desc: 'Customize Checkout, Upsell, Downsell, and Thank you pages.' },
  { id: 'bundles', label: 'Bundles', icon: 'box', route: '#/bundles', desc: 'Quantity-break offers used when BestCheckout prices the order.' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'refresh', route: '#/subscriptions', desc: 'Subscriptions and contracts created after BestCheckout payment.',
    children: [
      { id: 'subscriptions-contracts', label: 'Contracts', route: '#/subscriptions/contracts' },
    ],
  },
  { id: 'orders', label: 'Orders', icon: 'inbox', route: '#/orders', desc: 'Paid BestCheckout orders written back to Shopify.', children: [
    { id: 'abandoned-checkouts', label: 'Abandoned checkouts', route: '#/abandoned-checkouts', desc: 'Recover unpaid Hosted Checkout orders that never reached Shopify.' },
  ] },
  {
    id: 'settings', label: 'Settings', icon: 'settings', route: '#/settings/base', desc: 'Manage the Shopify connection and checkout services.',
    children: [
      { id: 'settings-base', label: 'Shopify connection', route: '#/settings/base' },
      { id: 'settings-domains', label: 'Checkout domain', route: '#/settings/domains' },
      { id: 'settings-payments', label: 'Payment services', route: '#/settings/payments' },
      { id: 'settings-advertising-analytics', label: 'Ad data', route: '#/settings/advertising-analytics' },
      { id: 'settings-notifications', label: 'Email notifications', route: '#/settings/notifications' },
      { id: 'settings-roles', label: 'Roles', route: '#/settings/roles' },
      { id: 'settings-staff', label: 'Staff', route: '#/settings/staff' },
    ],
  },
];

window.NAV_CHANNELS = [];

window.NAV_SETTINGS = [
  { id: 'base', label: 'Shopify connection', icon: 'settings', route: '#/settings/base' },
  { id: 'domains', label: 'Checkout domain', icon: 'globe', route: '#/settings/domains' },
  { id: 'payments', label: 'Payment services', icon: 'card', route: '#/settings/payments' },
  { id: 'advertising-analytics', label: 'Ad data', icon: 'analytics', route: '#/settings/advertising-analytics' },
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
  bundles: 'bundles',
  subscriptions: 'settings',
  orders: 'orders',
  'abandoned-checkouts': 'abandoned-checkouts',
  payments: 'settings',
  domains: 'settings',
  notifications: 'settings',
  settings: 'settings',
  account: 'settings',
  bestcheckout: 'bestcheckout',
  'online-store': 'online-store',
};

window.BESTSHOPIO_HELP_CENTER_URL = 'help/';

window.CHANGELOG = [
  {
    version: 'BestCheckout prototype',
    date: '2026-07',
    title: 'Standalone checkout growth workspace',
    modules: ['home', 'flows', 'pages', 'bundles', 'orders', 'settings'],
    items: [
      'Public website and merchant admin now have separate entry paths.',
      'Checkout, Upsell, Downsell, and Thank you pages share one focused editor.',
      'Bundles are created in BestCheckout for checkout pricing. Subscriptions can be synced from Shopify or created here for checkout only.',
      'Shopify connection, payments, checkout domain, notifications, and order writeback remain in one workspace.',
    ],
  },
];
