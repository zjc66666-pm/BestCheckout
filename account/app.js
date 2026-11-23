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
      '<div class="acct-user"><div class="hdr-menu-wrap" id="acct-user-wrap"><button type="button" class="hdr-user" id="acct-user" aria-label="Account">' + icon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>') + '</button></div></div>' +
      '</header>' +
      '<div class="acct-body"><nav class="acct-side" aria-label="Account">' +
      '<a class="nav-item" data-acct-nav="stores" href="#/stores">' + icon('<path d="M3 9.5 4.5 5h15L21 9.5"/><path d="M4 9.5h16V20H4z"/><path d="M9 20v-6h6v6"/>') + '<span>Stores</span></a>' +
      '<a class="nav-item" data-acct-nav="refer" href="#/refer">' + icon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>') + '<span>Refer</span></a>' +
      '</nav><main class="acct-main" id="account-main"></main></div>';
  }
  function arrow() {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
  }
  function storeFace(name, url) {
    return '<span class="acct-card-top"><span class="acct-mark" aria-hidden="true">' + icon('<path d="M3 9.5 4.5 5h15L21 9.5"/><path d="M4 9.5h16V20H4z"/><path d="M9 20v-6h6v6"/>') + '</span><span class="acct-card-copy"><strong class="i18n-skip">' + esc(name) + '</strong><small class="i18n-skip">' + esc(url) + '</small></span></span>';
  }
  function storesHtml(session) {
    var stores = window.STORES || [];
    var cards = '';
    stores.forEach(function (store) {
      var status = store.connectStatus || '';
      var show = Array.isArray(session.storeNames)
        ? session.storeNames.indexOf(store.name) !== -1
        : (session.hasStore || (status && shopHandle(store) === String(session.shop || '')));
      if (!show) return;
      var open = !status;
      var label = open ? 'Connected' : statusLabel(status);
      var href = open
        ? '../app/?store=' + encodeURIComponent(store.name) + '#/home'
        : '../?entry=connect-new-shopify-store&rev=20261121-acctback3#/connect-shopify?from=stores&status=' + encodeURIComponent(status) + '&shop=' + encodeURIComponent(shopHandle(store));
      var action = open ? '<em>Open a store' + arrow() + '</em>' : '';
      cards += '<a class="acct-card" href="' + href + '">' +
        storeFace(store.name, store.url) +
        '<span class="acct-status is-' + (open ? 'connected' : status) + '">' + esc(label) + (open ? '' : arrow()) + '</span>' +
        action + '</a>';
    });
    cards += '<a class="acct-card is-connect" href="../?entry=connect-new-shopify-store&rev=20261121-acctback3#/connect-shopify?from=stores"><span class="acct-plus" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span><strong>Connect a Shopify store</strong></a>';
    return '<div class="acct-lead"><h1>Stores</h1><p>Choose a store to open.</p></div><div class="acct-grid">' + cards + '</div>';
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
  function openChangePassword() {
    var host = document.getElementById('account-app');
    var existing = document.querySelector('.sh-modal-bd');
    if (existing) existing.remove();
    var bd = document.createElement('div');
    bd.className = 'sh-modal-bd';
    function field(label, id, placeholder) {
      return '<div class="sh-fld"><label class="sh-fld-label">' + label + '</label>' +
        '<input id="' + id + '" class="sh-fld-input" type="password" placeholder="' + placeholder + '" />' +
        '<div class="sh-fld-error" data-err="' + id + '"></div></div>';
    }
    bd.innerHTML = '<div class="sh-modal">' +
      '<div class="sh-modal-head"><span>Change password</span><button type="button" data-x aria-label="Close">' + icon('<path d="M18 6 6 18M6 6l12 12"/>') + '</button></div>' +
      '<div class="sh-modal-body">' +
        field('Current password', 'cp-cur', 'Enter current password') +
        field('New password', 'cp-new', 'Enter new password') +
        field('Confirm new password', 'cp-cf', 'Re-enter new password') +
      '</div>' +
      '<div class="sh-modal-foot"><button type="button" class="btn btn-default" data-cancel>Cancel</button><button type="button" class="btn btn-primary" data-done>Done</button></div>' +
    '</div>';
    host.appendChild(bd);
    if (window.I18N) window.I18N.apply(bd);
    function close() { bd.remove(); }
    bd.addEventListener('mousedown', function (event) { if (event.target === bd) close(); });
    bd.querySelector('[data-x]').onclick = close;
    bd.querySelector('[data-cancel]').onclick = close;
    function setErr(id, message) {
      var el = bd.querySelector('[data-err="' + id + '"]');
      var input = bd.querySelector('#' + id);
      if (el) el.textContent = message || '';
      if (input) input.classList.toggle('has-error', !!message);
    }
    bd.querySelector('[data-done]').onclick = function () {
      var current = bd.querySelector('#cp-cur').value;
      var next = bd.querySelector('#cp-new').value;
      var confirm = bd.querySelector('#cp-cf').value;
      var ok = true;
      setErr('cp-cur', '');
      setErr('cp-new', '');
      setErr('cp-cf', '');
      if (!current) { setErr('cp-cur', 'Please enter current password'); ok = false; }
      if (!next) { setErr('cp-new', 'Please enter new password'); ok = false; }
      else if (next.length < 8) { setErr('cp-new', '8 characters minimum'); ok = false; }
      if (confirm !== next) { setErr('cp-cf', 'Passwords do not match.'); ok = false; }
      if (!ok) return;
      close();
      var toast = document.createElement('div');
      toast.textContent = 'Change password successfully';
      toast.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#eafaf1;color:#1f8f4e;border:1px solid #cdeedb;padding:10px 16px;border-radius:8px;font-size:13.5px;font-weight:500;z-index:200;box-shadow:0 8px 24px rgba(20,40,28,.14)';
      host.appendChild(toast);
      if (window.I18N) window.I18N.apply(toast);
      setTimeout(function () { toast.remove(); }, 2000);
    };
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
    var userWrap = document.getElementById('acct-user-wrap');
    function signOut() {
      try { localStorage.removeItem(SESSION_KEY); } catch (error) { /* no-op */ }
      window.location.assign(new URL('../#/sign-in', window.location.href).href);
    }
    function closeUserMenu() {
      var open = userWrap.querySelector('.hdr-menu');
      if (open) open.remove();
    }
    document.getElementById('acct-user').onclick = function (event) {
      event.stopPropagation();
      if (userWrap.querySelector('.hdr-menu')) { closeUserMenu(); return; }
      var menu = document.createElement('div');
      menu.className = 'hdr-menu';
      menu.innerHTML = '<div class="hdr-menu-head">' + icon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>') + '<span class="i18n-skip">' + esc(session.email) + '</span></div>' +
        '<div class="hdr-menu-divider"></div>' +
        '<button type="button" class="hdr-menu-item" id="acct-changepw">' + icon('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>') + 'Change password</button>' +
        '<button type="button" class="hdr-menu-item" id="acct-signout">' + icon('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>') + 'Sign out</button>';
      menu.onclick = function (clickEvent) { clickEvent.stopPropagation(); };
      userWrap.appendChild(menu);
      if (window.I18N) window.I18N.apply(menu);
      menu.querySelector('#acct-changepw').onclick = function () { closeUserMenu(); openChangePassword(); };
      menu.querySelector('#acct-signout').onclick = signOut;
    };
    document.addEventListener('click', closeUserMenu);
    window.addEventListener('hashchange', show);
    if (!location.hash) location.hash = '#/stores';
    show();
    if (window.I18N) window.I18N.apply(document.body);
  }

  boot();
})();
