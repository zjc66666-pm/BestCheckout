const SESSION_KEY = 'bestcheckout-prototype-session';

export const PROTOTYPE_ACCOUNTS = [
  {
    email: 'workspace@bestcheckout.demo',
    password: '12345678',
    hasStore: true,
    label: 'Store connected',
  },
  {
    email: 'setup@bestcheckout.demo',
    password: '12345678',
    hasStore: false,
    label: 'No store yet',
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
  });
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
    return {
      authenticated: true,
      primaryHref: '#/connect-shopify',
      primaryLabel: 'Continue setup',
      footerHref: '#/connect-shopify',
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
