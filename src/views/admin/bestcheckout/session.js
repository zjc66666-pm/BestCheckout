const SESSION_KEY = 'bestcheckout-prototype-session';

export const PROTOTYPE_ACCOUNTS = [
  {
    email: 'empty@bestcheckout.demo',
    password: '12345678',
    hasStore: false,
    storeNames: [],
    label: 'Empty refer',
  },
  {
    email: 'seller@bestcheckout.demo',
    password: '12345678',
    hasStore: true,
    storeNames: ['Wren Supply', 'Plover Studio'],
    label: 'Seller · billing mix',
  },
  {
    email: 'downline@bestcheckout.demo',
    password: '12345678',
    hasStore: true,
    storeNames: ['Northstar', 'Atelier', 'Harbor', 'River Remedy'],
    label: 'Seller · payout failed',
  },
  {
    email: 'hello@lavenderlabs.co',
    password: 'demo-password',
    hasStore: true,
    label: 'Seller · withdrawal states',
  },
  {
    email: 'advanced@bestcheckout.demo',
    password: '12345678',
    hasStore: true,
    storeNames: ['Lavender Labs', 'Aura Living', 'Northline Goods'],
    label: 'Ready to withdraw',
  },
  {
    email: 'director@bestcheckout.demo',
    password: '12345678',
    hasStore: true,
    storeNames: ['Hey June', 'Kiln Coffee', 'Marlow Supply'],
    label: 'No payout account',
  },
];

export function findPrototypeAccount(email, password) {
  const normalized = String(email || '').trim().toLowerCase();
  return PROTOTYPE_ACCOUNTS.find(function (account) {
    return account.email === normalized && account.password === String(password || '');
  }) || null;
}

export function loadPrototypeSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.isAuthenticated !== true) return null;
    return {
      email: String(parsed.email || ''),
      hasStore: Boolean(parsed.hasStore),
      connectStatus: String(parsed.connectStatus || ''),
      shop: String(parsed.shop || ''),
      storeNames: Array.isArray(parsed.storeNames) ? parsed.storeNames.map(String) : null,
    };
  } catch (error) {
    return null;
  }
}

export function savePrototypeSession(session) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({
      isAuthenticated: true,
      email: String(session && session.email || ''),
      hasStore: Boolean(session && session.hasStore),
      connectStatus: String(session && session.connectStatus || ''),
      shop: String(session && session.shop || ''),
      storeNames: Array.isArray(session && session.storeNames) ? session.storeNames.map(String) : null,
    }));
  } catch (error) { /* no-op */ }
}

export function clearPrototypeSession() {
  try { window.localStorage.removeItem(SESSION_KEY); } catch (error) { /* no-op */ }
}

export function applyPrototypeSession(state) {
  const session = loadPrototypeSession();
  if (!session) return state;
  state.ui.isAuthenticated = true;
  state.ui.sessionEmail = session.email;
  state.ui.hasConnectedStore = session.hasStore;
  state.ui.connectStatus = session.connectStatus || '';
  state.ui.connectShop = session.shop || '';
  state.ui.storeNames = session.storeNames;
  return state;
}

export function persistPrototypeSession(state) {
  if (!state.ui.isAuthenticated) {
    clearPrototypeSession();
    return;
  }
  savePrototypeSession({
    email: state.ui.sessionEmail,
    hasStore: state.ui.hasConnectedStore,
    connectStatus: state.ui.connectStatus,
    shop: state.ui.connectShop,
    storeNames: state.ui.storeNames,
  });
}

export function connectSetupRoute(state) {
  const ui = state && state.ui ? state.ui : {};
  const status = String(ui.connectStatus || '');
  const shop = String(ui.connectShop || ui.shop || 'your-store');
  if (status === 'pending' || status === 'install' || status === 'expired' || status === 'disabled') {
    return 'connect-shopify?status=' + status + '&shop=' + encodeURIComponent(shop);
  }
  return 'connect-shopify';
}

export function marketingCtas(session) {
  if (session && session.isAuthenticated) {
    return {
      authenticated: true,
      primaryHref: 'account/#/stores',
      primaryLabel: 'Open workspace',
      footerHref: 'account/#/stores',
      footerLabel: 'Open workspace',
    };
  }
  return {
    authenticated: false,
    primaryHref: '#/sign-up?next=connect-shopify',
    primaryLabel: 'Start free',
    footerHref: '#/sign-in',
    footerLabel: 'Sign in',
  };
}
