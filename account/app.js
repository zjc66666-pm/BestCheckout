/* Account home. Stores and Refer belong to the signed-in account. */
(function () {
  'use strict';

  var SESSION_KEY = 'bestcheckout-prototype-session';
  var main;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function icon(path) {
    return '<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  }
  function readSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.isAuthenticated !== true || !parsed.email) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }
  function routeName() {
    var hash = (location.hash || '#/stores').replace(/^#\/?/, '');
    return hash.split(/[/?]/)[0] === 'refer' ? 'refer' : 'stores';
  }
  function shopHandle(store) {
    return String((store && store.url) || '').replace(/\.myshopify\.com$/i, '');
  }
  function statusLabel(status) {
    if (status === 'pending') return 'Preparing install link';
    if (status === 'install') return 'Ready to install';
    if (status === 'expired') return 'Install link expired';
    if (status === 'disabled') return 'Store disabled';
    return '';
  }
  function shell(session) {
    return '<header class="acct-header">' +
      '<a class="acct-brand" href="#/stores"><img class="brand-mark" src="../assets/brand-mark.svg?v=20260723brandmark1" alt="" aria-hidden="true"><span>BestCheckout</span></a>' +
      '<div class="acct-user"><span class="acct-email i18n-skip">' + esc(session.email) + '</span><button type="button" class="acct-signout" id="acct-signout">Sign out</button></div>' +
      '</header>' +
      '<div class="acct-body"><nav class="acct-side" aria-label="Account">' +
      '<a class="nav-item" data-acct-nav="stores" href="#/stores">' + icon('<path d="M3 9.5 4.5 5h15L21 9.5"/><path d="M4 9.5h16V20H4z"/><path d="M9 20v-6h6v6"/>') + '<span>Stores</span></a>' +
      '<a class="nav-item" data-acct-nav="refer" href="#/refer">' + icon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>') + '<span>Refer</span></a>' +
      '</nav><main class="acct-main" id="account-main"></main></div>';
  }
  function storesHtml(session) {
    var stores = window.STORES || [];
    var cards = '';
    var visible = 0;
    stores.forEach(function (store) {
      if (session.hasStore && !store.connectStatus) {
        visible += 1;
        cards += '<a class="acct-card" href="../app/?store=' + encodeURIComponent(store.name) + '#/home">' +
          '<strong class="i18n-skip">' + esc(store.name) + '</strong>' +
          '<small class="i18n-skip">' + esc(store.url) + '</small>' +
          '<em>Open a store</em></a>';
        return;
      }
      if (!session.hasStore && store.connectStatus && shopHandle(store) === String(session.shop || '')) {
        visible += 1;
        var href = '../?entry=connect-new-shopify-store#/connect-shopify?status=' + encodeURIComponent(store.connectStatus) + '&shop=' + encodeURIComponent(shopHandle(store));
        cards += '<a class="acct-card" href="' + href + '">' +
          '<strong class="i18n-skip">' + esc(store.name) + '</strong>' +
          '<small class="i18n-skip">' + esc(store.url) + '</small>' +
          '<em>' + esc(statusLabel(store.connectStatus)) + '</em></a>';
      }
    });
    var empty = visible ? '' : '<p class="acct-lead" style="padding-bottom:0">No store is connected yet. You can still share BestCheckout from Refer.</p>';
    cards += '<a class="acct-card is-connect" href="../?entry=connect-new-shopify-store#/connect-shopify"><strong>Connect a Shopify store</strong><small>Optional. A store is not required to share BestCheckout.</small></a>';
    return '<div class="acct-lead"><h1>Stores</h1><p>Choose a store to open, or connect Shopify when you are ready. Refer stays with this account.</p></div>' + empty + '<div class="acct-grid">' + cards + '</div>';
  }
  function show() {
    var name = routeName();
    document.querySelectorAll('[data-acct-nav]').forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-acct-nav') === name);
    });
    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    if (name === 'refer' && window.VIEWS && window.VIEWS.refer) {
      window.VIEWS.refer.render(main);
      return;
    }
    main.innerHTML = storesHtml(readSession());
    if (window.I18N) window.I18N.apply(main);
  }
  function boot() {
    var session = readSession();
    if (!session) {
      window.location.replace(new URL('../#/sign-in', window.location.href).href);
      return;
    }
    window.BESTCHECKOUT_ACCOUNT_EMAIL = String(session.email || '');
    var app = document.getElementById('account-app');
    app.innerHTML = shell(session);
    main = document.getElementById('account-main');
    document.getElementById('acct-signout').onclick = function () {
      try { localStorage.removeItem(SESSION_KEY); } catch (error) { /* no-op */ }
      window.location.assign(new URL('../#/sign-in', window.location.href).href);
    };
    window.addEventListener('hashchange', show);
    if (!location.hash) location.hash = '#/stores';
    show();
    if (window.I18N) window.I18N.apply(document.body);
  }

  boot();
})();
