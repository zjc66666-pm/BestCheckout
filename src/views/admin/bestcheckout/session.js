const SESSION_KEY = 'bestcheckout-prototype-session';

export const PROTOTYPE_ACCOUNTS = [
  {
    email: 'setup@bestcheckout.demo',
    password: '12345678',
    hasStore: false,
    label: 'No store yet',
  },
  {
    email: 'pending@bestcheckout.demo',
    password: '12345678',
    hasStore: false,
    connectStatus: 'pending',
    shop: 'northstar',
    label: 'Preparing install link',
  },
  {
    email: 'install@bestcheckout.demo',
    password: '12345678',
    hasStore: false,
    connectStatus: 'install',
    shop: 'atelier',
    label: 'Ready to install',
  },
  {
    email: 'expired@bestcheckout.demo',
    password: '12345678',
    hasStore: false,
    connectStatus: 'expired',
    shop: 'harbor',
    label: 'Install link expired',
  },
  {
    email: 'workspace@bestcheckout.demo',
    password: '12345678',
    hasStore: true,
    label: 'Store connected',
  },
  {
    email: 'hello@lavenderlabs.co',
    password: 'demo-password',
    hasStore: true,
    label: 'Lavender Labs',
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
  });
}

export function connectSetupRoute(state) {
  const ui = state && state.ui ? state.ui : {};
  const status = String(ui.connectStatus || '');
  const shop = String(ui.connectShop || ui.shop || 'your-store');
  if (status === 'pending' || status === 'install' || status === 'expired') {
    return 'connect-shopify?status=' + status + '&shop=' + encodeURIComponent(shop);
  }
  return 'connect-shopify';
}

export function marketingCtas(session) {
  if (session && session.isAuthenticated) {
    if (session.hasConnectedStore) {
      return {
        authenticated: true,
        primaryHref: 'app/#/home',
        primaryLabel: 'Open workspace',
        footerHref: 'app/#/home',
        footerLabel: 'Open workspace',
      };
    }
    const setup = connectSetupRoute({ ui: session });
    const setupHash = '#/' + setup;
    return {
      authenticated: true,
      primaryHref: setupHash,
      primaryLabel: 'Continue setup',
      footerHref: setupHash,
      footerLabel: 'Continue setup',
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
