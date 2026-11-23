/* Account Refer page. The signed-in account is a BestCheckout salesperson. */
(function () {
  'use strict';

  var root;
  var R = function () { return window.BestCheckoutRefer; };
  var listState = {
    partnerId: '',
    stores: { page: 1, size: 20 },
    downline: { page: 1, size: 20 },
    withdrawals: { page: 1, size: 20 }
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function toast(message) {
    document.querySelectorAll('.refer-message').forEach(function (node) { node.remove(); });
    var node = document.createElement('div');
    node.className = 'refer-message success';
    node.setAttribute('role', 'status');
    node.innerHTML = '<span class="refer-message-ico" aria-hidden="true">✓</span><span></span>';
    node.lastElementChild.textContent = message;
    document.body.appendChild(node);
    if (window.I18N) window.I18N.apply(node);
    setTimeout(function () { node.remove(); }, 2000);
  }
  function copyText(value, message) {
    function done() { toast(message); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done).catch(function () { fallback(); });
      return;
    }
    fallback();
    function fallback() {
      var input = document.createElement('textarea');
      input.value = value;
      document.body.appendChild(input);
      input.select();
      try { document.execCommand('copy'); } catch (err) {}
      input.remove();
      done();
    }
  }
  var EXTRA_URLS = {
    'Loom Studio': 'loom-studio.myshopify.com',
    'Birch Market': 'birch-market.myshopify.com',
    'Oak Goods': 'oak-goods.myshopify.com',
    'Moss Studio': 'moss-studio.myshopify.com',
    'Cedar Supply': 'cedar-supply.myshopify.com',
    'Gale Goods': 'gale-goods.myshopify.com',
    'Drift Market': 'drift-market.myshopify.com',
    'Elm Goods': 'elm-goods.myshopify.com',
    'Fern Studio': 'fern-studio.myshopify.com',
    'Ivy Living': 'ivy-living.myshopify.com',
    'Juniper Goods': 'juniper-goods.myshopify.com',
    'Piper Coffee': 'piper-coffee.myshopify.com',
    'Quill Goods': 'quill-goods.myshopify.com',
    'Piper Shelf': 'piper-shelf.myshopify.com'
  };
  function storeUrl(name) {
    if (EXTRA_URLS[name]) return EXTRA_URLS[name];
    var list = window.STORES || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === name && list[i].url) return list[i].url;
    }
    return '';
  }
  function storeCell(name, month) {
    var url = storeUrl(name);
    return '<strong class="i18n-skip">' + esc(name) + '</strong>' +
      (url ? '<div class="muted refer-url i18n-skip">' + esc(url) + '</div>' : '') +
      (month ? '<div class="muted">' + esc(month) + '</div>' : '');
  }
  function statusText(status) {
    if (status === 'Paid') return 'Paid';
    if (status === 'Past due') return 'Past due';
    if (status === 'Charge failed') return 'Charge failed';
    return 'Not billed';
  }
  function pageOf(rows, state) {
    var pages = Math.max(1, Math.ceil(rows.length / state.size));
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;
    var start = (state.page - 1) * state.size;
    return { rows: rows.slice(start, start + state.size), page: state.page, pages: pages, total: rows.length, size: state.size };
  }
  function pagerHtml(key, page, pages, size) {
    function item(label, target, opts) {
      opts = opts || {};
      var attrs = opts.disabled ? '' : ' data-refer-page="' + key + '" data-page="' + target + '"';
      return '<span class="pg-item' + (opts.active ? ' active' : '') + (opts.disabled ? ' disabled' : '') + '"' + attrs + '>' + label + '</span>';
    }
    var nums = '';
    for (var p = 1; p <= pages; p++) nums += item(String(p), p, { active: p === page });
    var sizes = [20, 50, 100].map(function (n) {
      return '<option value="' + n + '"' + (n === size ? ' selected' : '') + '>' + n + ' / page</option>';
    }).join('');
    return '<div class="pg">' + item('‹', page - 1, { disabled: page <= 1 }) + nums + item('›', page + 1, { disabled: page >= pages }) +
      '<select class="pg-size" data-refer-size="' + key + '">' + sizes + '</select></div>';
  }
  function pagerFoot(key, view) {
    return '<div class="refer-foot card-pad"><span class="muted" style="font-size:13px">Total ' + view.total + ' records</span>' + pagerHtml(key, view.page, view.pages, view.size) + '</div>';
  }
  function commissionText(store, model, partnerId) {
    if (store.status === 'Paid') {
      var direct = model.splits(store).filter(function (row) { return row.kind === 'Direct' && row.partnerId === partnerId; })[0];
      var marked = !!(direct && model.commissionWithdrawn(store.id, partnerId));
      return '<span class="i18n-skip">' + esc(model.money(direct ? direct.amount : 0)) + '</span>' + (marked ? ' <span class="refer-ok">Withdrawn</span>' : '');
    }
    if (store.status === 'Past due' || store.status === 'Charge failed') return '<span class="refer-wait">Waiting for payment</span>';
    return '<span class="muted">Billing has not started</span>';
  }

  function mark(path) {
    return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  }
  function kpi(label, path, body) {
    return '<div class="refer-kpi"><span class="refer-kpi-label"><span class="refer-kpi-ico">' + mark(path) + '</span>' + label + '</span>' + body + '</div>';
  }
  function sectionTitle(label, path) {
    return '<div class="card-title refer-title"><span class="refer-title-ico">' + mark(path) + '</span>' + label + '</div>';
  }
  function payoutText(account) {
    if (!account) return '';
    if (account.method === 'bank') {
      var tail = String(account.account || '').slice(-4);
      return 'Bank transfer · ' + account.bank + ' · ' + tail;
    }
    return 'PayPal · ' + (account.email || '');
  }
  function payoutLine(account) {
    if (!account) return '';
    if (account.method === 'bank') {
      var tail = String(account.account || '').slice(-4);
      return '<span>Bank transfer</span> · <span class="i18n-skip">' + esc(account.bank) + ' · ' + esc(tail) + '</span>';
    }
    return '<span>PayPal</span> · <span class="i18n-skip">' + esc(account.email) + '</span>';
  }
  function availableCard(model, cash) {
    return kpi('Available', '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M16 14h.01"/>', '<strong class="i18n-skip">' + esc(model.money(cash)) + '</strong><small>Withdraw once you reach $50.00</small>');
  }
  function payoutBar(payout, inFlight, canWithdraw) {
    if (!payout) return '<div class="refer-payout"><div class="refer-payout-actions"><button type="button" class="btn btn-primary" id="refer-bind">Add payout account</button></div></div>';
    var withdrawLabel = inFlight ? 'Withdrawal pending' : 'Withdraw';
    var actions = '<button type="button" class="btn btn-default" id="refer-change"' + (inFlight ? ' disabled' : '') + '>Change account</button><button type="button" class="btn btn-primary" id="refer-withdraw"' + (canWithdraw ? '' : ' disabled') + '>' + withdrawLabel + '</button>';
    return '<div class="refer-payout"><div class="refer-payout-account">' + payoutLine(payout) + '</div><div class="refer-payout-actions">' + actions + '</div></div>';
  }
  function render() {
    var model = R();
    var accountMode = !!window.BESTCHECKOUT_ACCOUNT_EMAIL;
    var storeName = (window.SITE && window.SITE.store) || 'Lavender Labs';
    var me = accountMode && model.forAccount
      ? model.forAccount(window.BESTCHECKOUT_ACCOUNT_EMAIL)
      : model.ownerOf(storeName);
    if (!me) {
      root.innerHTML = '<div class="view-wrap"><div class="refer-page"><h1 class="page-title">Refer</h1><p class="orders-page-subtitle">Refer is not set up for this store.</p></div></div>';
      if (window.I18N) window.I18N.apply(root);
      return;
    }
    var referred = model.stores.filter(function (store) { return store.referrerId === me.id; });
    var ownNote = '';
    if (!accountMode) {
      ownNote = '<p class="refer-note">This store is yours. Its software fees are not commissioned to you.</p>';
      var referrerOfThisStore = null;
      model.stores.forEach(function (store) {
        if (store.store === storeName && store.referrerId) referrerOfThisStore = model.partner(store.referrerId);
      });
      if (referrerOfThisStore && referrerOfThisStore.id !== me.id) {
        ownNote = '<p class="refer-note"><span>This store was referred by</span> <strong class="i18n-skip">' + esc(referrerOfThisStore.name) + '</strong><span>. Commission on its paid invoices goes to them.</span></p>';
      }
    }
    if (listState.partnerId !== me.id) {
      listState.partnerId = me.id;
      listState.stores.page = 1;
      listState.withdrawals.page = 1;
    }
    var storePage = pageOf(referred, listState.stores);
    var storeRows = storePage.rows.length ? storePage.rows.map(function (store) {
      var fees = store.status === 'Paid' ? '<span class="i18n-skip">' + esc(model.money(store.collected)) + '</span>' : '<span class="muted">—</span>';
      return '<tr><td>' + storeCell(store.store, store.month) + '</td><td>' + esc(statusText(store.status)) + '</td><td>' + fees + '</td><td>' + commissionText(store, model, me.id) + '</td></tr>';
    }).join('') : '<tr><td colspan="4" class="muted refer-empty">No referred stores yet. Share your link. You earn after a referred store pays a BestCheckout invoice.</td></tr>';
    var cash = model.available(me.id);
    var payouts = model.withdrawalsFor(me.id);
    var inFlight = payouts.some(function (item) { return item.status === 'Pending' || item.status === 'Processing'; });
    var payout = model.payoutAccount(me.id);
    var canWithdraw = cash >= 5000 && !inFlight && !!payout;

    root.innerHTML =
      '<div class="view-wrap"><div class="refer-page">' +
        '<style>' +
          '.refer-page{width:100%}' +
          '.refer-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:16px 0 12px}' +
          '.refer-list{overflow:hidden}' +
          '.refer-panel-head{display:flex;align-items:center;gap:10px;padding:13px 16px;border-bottom:1px solid var(--hair);background:#f5f7fb}' +
          '.refer-panel-head .card-title{margin:0}' +
          '.refer-panel-head .refer-title-ico{width:32px;height:32px;border-radius:8px;background:#eef3ff}' +
          '.refer-payout-min{margin-left:auto;color:var(--ink-muted);font-size:13px;font-weight:500;white-space:nowrap}' +
          '.refer-list .tbl thead th{background:#fafbfc;padding:12px 16px;font-size:13.5px;font-weight:600;color:var(--ink)}' +
          '.refer-list .tbl tbody tr:last-child td{border-bottom:0}' +
          '.refer-payout{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0;padding:14px 16px;background:#fff}' +
          '.refer-payout-account{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink-body);font-size:13px;font-weight:600}' +
          '.refer-payout-actions{display:flex;align-items:center;gap:8px;flex:none}' +
          '.refer-payout-actions .btn{height:32px;padding:0 12px}' +
          '.refer-payout-actions .btn:disabled{opacity:.45;cursor:not-allowed}' +
          '.refer-kpi{background:#fff;border:1px solid var(--hair);border-radius:12px;padding:14px 16px}' +
          '.refer-kpi-label{display:flex;align-items:center;gap:8px;color:var(--ink-muted);font-size:12.5px}' +
          '.refer-kpi-ico,.refer-title-ico{display:grid;place-items:center;flex:none;color:#356dff}' +
          '.refer-kpi-ico{width:28px;height:28px;border-radius:8px;background:#ebf0ff}' +
          '.refer-title{display:flex;align-items:center;gap:8px}' +
          '.refer-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid var(--hair)}' +
          '.refer-kpi strong{display:block;margin-top:6px;font-size:20px}' +
          '.refer-kpi small{display:block;margin-top:4px;color:var(--ink-muted);font-size:12px}' +
          '.refer-rate-label::after{content:"："}' +
          '.refer-link{display:flex;gap:8px;align-items:center;margin-top:8px}' +
          '.refer-link code{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:#f6f7fb;border:1px solid var(--hair);border-radius:8px;padding:8px 10px;font-size:13px}' +
          '.refer-by{margin-top:12px;color:var(--ink-body);font-size:13.5px}' +
          '.refer-pill{display:inline-block;margin-left:6px;padding:1px 8px;border-radius:999px;background:#f3f0ff;color:#5b3fd0;font-size:12px;font-weight:600}' +
          '.refer-note{margin:12px 0 0;color:var(--ink-muted);font-size:13px;line-height:1.5}' +
          '.refer-rank-lead{flex:1;min-width:0;margin:0;color:var(--ink-muted);font-size:13px;font-weight:500;line-height:1.5;text-align:right}' +
          '.refer-rank-foot{margin:0;padding:12px 16px 14px;border-top:1px solid var(--hair)}' +
          '.refer-current{background:#f7f5ff}' +
          '.refer-you{margin-left:6px;color:#5b3fd0;font-size:12px;font-weight:700}' +
          '.tbl tbody td.refer-empty{text-align:center;white-space:normal}' +
          '.refer-ok{color:#178a52;font-weight:600}' +
          '.refer-wait{color:#9a6700;font-weight:600}' +
          '.refer-send{color:#356dff;font-weight:600}' +
          '.refer-bad{color:#d33612;font-weight:600}' +
          '.refer-url{font-size:12px;margin-top:2px}' +
          '.refer-message{position:fixed;top:16px;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:8px;max-width:min(560px,calc(100vw - 48px));padding:9px 16px;background:#fff;color:rgba(0,0,0,.88);border-radius:8px;font-size:14px;line-height:1.45;z-index:300;box-shadow:0 6px 16px rgb(0 0 0 / 8%),0 3px 6px -4px rgb(0 0 0 / 12%),0 9px 28px 8px rgb(0 0 0 / 5%)}' +
          '.refer-message-ico{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:#52c41a;color:#fff;font-size:12px;font-weight:700;line-height:1;flex:none}' +
          '.refer-history{display:inline-flex;align-items:center;color:var(--brand);font-size:13px;font-weight:600}' +
          '.refer-field{margin-top:14px}' +
          '.refer-field label{display:block;margin-bottom:6px;font-size:13px;font-weight:600}' +
          '.refer-field .input{box-sizing:border-box}' +
          '.refer-field .refer-error{margin-top:6px;color:#d92d20;font-size:12.5px}' +
          '.refer-methods{display:flex;gap:8px}' +
          '.refer-methods label{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;height:36px;border:1px solid var(--ctl);border-radius:8px;background:#fff;font-size:13px;font-weight:600;cursor:pointer}' +
          '.refer-methods label:has(input:checked){border-color:var(--brand);background:#f4f7ff;color:var(--brand)}' +
          '.refer-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px}' +
          '.refer-modal-head .drawer-x{border:0;background:transparent;padding:4px;line-height:0}' +
          '@media (max-width:900px){.refer-kpis{grid-template-columns:1fr 1fr}.refer-payout{align-items:flex-start;flex-direction:column}.refer-panel-head:has(.refer-rank-lead){flex-wrap:wrap}.refer-rank-lead{flex-basis:100%;text-align:left}}' +
        '</style>' +
        '<div class="orders-page-head">' +
          '<h1 class="page-title">Refer</h1>' +
          '<p class="orders-page-subtitle">Share BestCheckout. You earn 30% of each paid software fee.</p>' +
        '</div>' +
        '<div class="refer-kpis">' +
          kpi('Commission rate', '<path d="M8 21h8"/><path d="M12 17v4"/><circle cx="12" cy="9" r="5"/>', '<strong class="i18n-skip">30%</strong><small>Of each paid software fee</small>') +
          availableCard(model, cash) +
          kpi('Total commission', '<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7"/><path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>', '<strong class="i18n-skip">' + esc(model.money(model.earned(me.id))) + '</strong><small>From stores you referred</small>') +
        '</div>' +
        '<div class="panel refer-list"><div class="refer-panel-head">' +
          sectionTitle('Your link', '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>') +
        '</div><div class="card-pad">' +
          '<div class="refer-link"><code class="i18n-skip" id="refer-link">' + esc(model.linkFor(me)) + '</code><button type="button" class="btn btn-default" id="refer-copy-link">Copy link</button></div>' +
          '<div class="refer-link"><code class="i18n-skip" id="refer-code">' + esc(me.code) + '</code><button type="button" class="btn btn-default" id="refer-copy-code">Copy code</button></div>' +
          '<p class="refer-note">The link cookie lasts 30 days. Credit uses Last Non-Direct Click. A referral code entered at signup takes priority.</p>' +
          ownNote +
        '</div></div>' +
        '<div class="panel refer-list" style="margin-top:16px" id="refer-stores"><div class="refer-panel-head">' + sectionTitle('Stores you referred', '<path d="M3 9.5 4.5 5h15L21 9.5"/><path d="M4 9.5h16V20H4z"/><path d="M9 20v-6h6v6"/>') + '</div>' +
          '<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Store</th><th>Billing</th><th>Paid software fees</th><th>Your commission</th></tr></thead><tbody>' + storeRows + '</tbody></table></div>' +
          pagerFoot('stores', storePage) +
        '</div>' +
        '<div class="panel refer-list" style="margin-top:16px"><div class="refer-panel-head">' + sectionTitle('Payout account', '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>') + '<span class="refer-payout-min">Withdraw once you reach $50.00</span></div>' +
          payoutBar(payout, inFlight, canWithdraw) +
        '</div>' +
        '<div class="panel refer-list refer-withdrawals" style="margin-top:16px" id="refer-withdrawals"><div class="refer-panel-head">' + sectionTitle('Withdrawals', '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M16 15h.01"/>') + '</div>' +
          '<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Date</th><th>Amount</th><th>Paid to</th><th>Status</th></tr></thead><tbody>' + withdrawalRows(model, payouts) + '</tbody></table></div>' +
          pagerFoot('withdrawals', pageOf(payouts, listState.withdrawals)) +
        '</div>' +
      '</div></div>';

    root.querySelector('#refer-copy-link').onclick = function () { copyText(model.linkFor(me), 'Link copied'); };
    root.querySelector('#refer-copy-code').onclick = function () { copyText(me.code, 'Code copied'); };
    var bindBtn = root.querySelector('#refer-bind');
    if (bindBtn) bindBtn.onclick = function () { openPayout(me, null); };
    var changeBtn = root.querySelector('#refer-change');
    if (changeBtn && !inFlight) changeBtn.onclick = function () { openPayout(me, payout); };
    var withdrawBtn = root.querySelector('#refer-withdraw');
    if (withdrawBtn && canWithdraw) withdrawBtn.onclick = function () { openWithdraw(me, cash, payout); };
    root.querySelectorAll('[data-refer-page]').forEach(function (el) {
      el.onclick = function () {
        var key = el.getAttribute('data-refer-page');
        if (!listState[key]) return;
        listState[key].page = Number(el.getAttribute('data-page')) || 1;
        render();
      };
    });
    root.querySelectorAll('[data-refer-size]').forEach(function (el) {
      el.onchange = function () {
        var key = el.getAttribute('data-refer-size');
        if (!listState[key]) return;
        listState[key].size = Number(el.value) || 20;
        listState[key].page = 1;
        render();
      };
    });
    if (window.I18N) window.I18N.apply(root);
  }

  function withdrawalStatus(status) {
    if (status === 'Pending') return '<span class="refer-wait">Pending</span>';
    if (status === 'Processing') return '<span class="refer-send">Processing</span>';
    if (status === 'Failed') return '<span class="refer-bad">Failed</span>';
    return '<span class="refer-ok">Withdrawn</span>';
  }
  function withdrawalRows(model, payouts) {
    var view = pageOf(payouts, listState.withdrawals);
    if (!view.rows.length) return '<tr><td colspan="4" class="muted refer-empty">No withdrawals yet.</td></tr>';
    return view.rows.map(function (item) {
      return '<tr><td>' + esc(item.at) + '</td><td class="i18n-skip">' + esc(model.money(item.amount)) + '</td><td>' + payoutLine(item.payout) + '</td><td>' + withdrawalStatus(item.status) + '</td></tr>';
    }).join('');
  }
  function openDialog(title, body, confirmLabel, onConfirm, width) {
    var bd = document.createElement('div');
    bd.className = 'modal-backdrop';
    bd.innerHTML =
      '<div class="modal" style="width:' + (width || 440) + 'px;max-width:calc(100vw - 24px)" role="dialog" aria-modal="true">' +
        '<div class="modal-head refer-modal-head"><span>' + title + '</span><button type="button" class="drawer-x" data-x aria-label="Close"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
        '<div class="modal-body">' + body + '</div>' +
        '<div class="modal-foot"><button type="button" class="btn btn-default" data-cancel>Cancel</button><button type="button" class="btn btn-primary" data-go>' + confirmLabel + '</button></div>' +
      '</div>';
    (document.getElementById('account-app') || document.body).appendChild(bd);
    if (window.I18N) window.I18N.apply(bd);
    function close() { bd.remove(); }
    bd.addEventListener('mousedown', function (event) { if (event.target === bd) close(); });
    bd.querySelector('[data-x]').onclick = close;
    bd.querySelector('[data-cancel]').onclick = close;
    bd.querySelector('[data-go]').onclick = function () { onConfirm(bd, close); };
    return bd;
  }
  function payoutField(id, label, control, error) {
    return '<div class="refer-field"><label for="' + id + '">' + label + '</label>' + control + '<div class="refer-error" id="' + id + '-error" hidden>' + error + '</div></div>';
  }
  function showPayoutError(bd, id, bad) {
    var error = bd.querySelector('#' + id + '-error');
    var field = bd.querySelector('#' + id);
    if (error) error.hidden = !bad;
    if (field) field.classList.toggle('has-error', !!bad);
    return bad;
  }
  function openPayout(me, current) {
    var model = R();
    current = current || {};
    var bd = openDialog('Payout account',
      payoutField('refer-paypal', 'PayPal email', '<input class="input" id="refer-paypal" type="email" value="' + esc(current.email || '') + '" placeholder="name@email.com">', 'Enter a PayPal email.') +
      '<p class="refer-note">This account receives every withdrawal.</p>',
      'Save',
      function (box, close) {
        var email = (box.querySelector('#refer-paypal').value || '').trim();
        if (showPayoutError(box, 'refer-paypal', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return;
        model.setPayoutAccount(me.id, { method: 'paypal', email: email });
        close();
        toast('Payout account saved');
        render();
      });
    bd.querySelectorAll('.refer-field .input').forEach(function (field) {
      function clear() { showPayoutError(bd, field.id, false); }
      field.addEventListener('input', clear);
      field.addEventListener('change', clear);
    });
  }
  function openWithdraw(me, amount, payout) {
    var model = R();
    openDialog('Withdraw',
      '<div class="refer-field"><label>Amount</label><input class="input i18n-skip" value="' + esc(model.money(amount)) + '" readonly></div>' +
      '<div class="refer-field"><label>Payout account</label><input class="input i18n-skip" value="' + esc(payoutText(payout)) + '" readonly></div>' +
      '<p class="refer-note">BestCheckout pays the saved payout account. It usually arrives in 3 business days.</p>',
      'Withdraw',
      function (bd, close) {
        if (!model.requestWithdrawal(me.id)) return;
        close();
        toast('Withdrawal requested');
        render();
      });
  }

  if (window.I18N && window.I18N.extend) window.I18N.extend({
    'Refer is not set up for this store.': '这家店还没有推荐身份。',
    'Share BestCheckout. You earn 30% of each paid software fee.': '分享 BestCheckout。你拿每笔已付软件费的 30%。',
    'Commission rate': '佣金比例',
    'Of each paid software fee': '每笔已付软件费',
    'From stores you referred': '来自你推荐的店',
    'The link cookie lasts 30 days. Credit uses Last Non-Direct Click. A referral code entered at signup takes priority.': '链接 Cookie 有效期 30 天，按最后一次非直接点击（Last Non-Direct Click）归因。注册时直接填写推荐码，优先关联。',
    'Rank': '等级',
    'Available': '可提现',
    'Direct commission rate': '直接佣金比例',
    'Paid out once it reaches $50.00': '满 $50.00 打出',
    'Withdraw once you reach $50.00': '满 $50.00 可提现',
    'Add payout account': '绑定打款账号',
    'Change account': '更换',
    'Payout account': '打款账号',
    'PayPal': 'PayPal',
    'Bank transfer': '银行转账',
    'PayPal email': 'PayPal 邮箱',
    'Enter a PayPal email.': '请填写 PayPal 邮箱。',
    'Account holder': '账户名',
    'Name on the account': '账户上的姓名',
    'Enter the account holder.': '请填写账户名。',
    'Country': '国家或地区',
    'Select a country': '请选择国家或地区',
    'Select a country.': '请选择国家或地区。',
    'Bank name': '银行名称',
    'Enter the bank name.': '请填写银行名称。',
    'Account number': '账号',
    'Enter the account number.': '请填写账号。',
    'SWIFT/BIC': 'SWIFT/BIC',
    'Enter an 8 or 11 character SWIFT/BIC.': '请填写 8 位或 11 位 SWIFT/BIC。',
    'United States': '美国',
    'United Kingdom': '英国',
    'Canada': '加拿大',
    'Australia': '澳大利亚',
    'Germany': '德国',
    'France': '法国',
    'Netherlands': '荷兰',
    'Singapore': '新加坡',
    'Hong Kong': '中国香港',
    'Japan': '日本',
    'Other': '其他',
    'This account receives every withdrawal.': '之后的提现都会打到这个账号。',
    'Payout account saved': '打款账号已绑定',
    'BestCheckout pays the saved payout account. It usually arrives in 3 business days.': 'BestCheckout 会打到已绑定的打款账号。一般 3 个工作日到账。',
    'Withdraw': '提现',
    'Withdrawal pending': '提现处理中',
    'Available balance must reach $50.00.': '可提现余额需要达到 $50.00。',
    'Withdrawals': '提现记录',
    'No withdrawals yet.': '还没有提现。',
    'Date': '日期',
    'Amount': '金额',
    'Paid to': '打到',
    'Status': '状态',
    'Pending': '待打款',
    'Processing': '打款中',
    'Failed': '提现失败',
    'Nov 12, 2026': '2026年11月12日',
    'Oct 21, 2026': '2026年10月21日',
    'Withdrawal requested': '已提交提现',
    'Close': '关闭',
    'Nov 17, 2026': '2026年11月17日',
    'Nov 3, 2026': '2026年11月3日',
    'Oct 6, 2026': '2026年10月6日',
    'Sep 8, 2026': '2026年9月8日',
    'Aug 11, 2026': '2026年8月11日',
    'Aug 4, 2026': '2026年8月4日',
    'Jul 14, 2026': '2026年7月14日',
    'Total commission': '累计佣金',
    'Direct commission and downline share': '直接佣金和下家分成',
    'Next rank': '下一等级',
    'In the last 12 months, paid software fees from stores you referred reach': '近 12 个月，你推荐店铺的已付软件费达到',
    'Top rank': '最高等级',
    'You are at the top rank.': '已是最高等级。',
    'Your link': '你的链接',
    'Copy link': '复制链接',
    'Copy code': '复制推荐码',
    'Link copied': '链接已复制',
    'Code copied': '推荐码已复制',
    'This store is yours. Its software fees are not commissioned to you.': '这是你自己的店。它的软件费不会发给你。',
    'Referred by': '你的推荐人',
    'You joined without a referrer.': '你没有推荐人。',
    'This store was referred by': '这家店的推荐人是',
    '. Commission on its paid invoices goes to them.': '。账单付清后，佣金发给推荐人。',
    'How ranks work': '等级怎么算',
    'Rank uses paid software fees from stores you personally referred in the last 12 months. Shares of downline commission do not raise your rank.': '等级只看近 12 个月你亲自推荐、且已付清的软件费。下家佣金分成不计入升级。',
    'Personal paid fees, last 12 months': '近 12 个月你推荐店铺的已付软件费',
    'Direct commission': '直接佣金',
    "Share of the next person's commission": '从下一层佣金中分走',
    'Join': '注册即是',
    'You': '当前',
    'Commission on a store you referred is paid forever. Downline commission is paid forever. The chain stops at 30% of each paid invoice, or when a share is under $1.00.': '你亲自推荐的店铺，佣金永久拿。下家佣金永远拿。整条链最多拿走每张已付账单的 30%，单笔不足 $1.00 即停止。',
    'Stores you referred': '你推荐的店铺',
    'Store': '店铺',
    'Billing': '账单',
    'Paid software fees': '已付软件费',
    'Your commission': '你的佣金',
    'Withdrawn': '已提现',
    'Paid': '已支付',
    'Past due': '逾期',
    'Charge failed': '扣款失败',
    'Not billed': '未计费',
    'July 2026': '2026 年 7 月',
    'August 2026': '2026 年 8 月',
    'September 2026': '2026 年 9 月',
    'October 2026': '2026 年 10 月',
    'Waiting for payment': '等账单付清',
    'Billing has not started': '账单尚未开始',
    'No referred stores yet. Share your link. You earn after a referred store pays a BestCheckout invoice.': '还没有推荐店铺。把链接发出去。对方的店付清 BestCheckout 账单后，你开始有佣金。',
    'Commission from people you refer': '你下家推荐的店铺',
    'Downline store': '下家店铺',
    'Their commission': '下家佣金',
    'Your share': '你分到的',
    'When someone you referred earns a commission, your share shows up here.': '你推荐的人赚到佣金后，你的分成会出现在这里。',
    'Seller': '销售',
    'Advanced': '进阶',
    'Leader': '主管',
    'Director': '总监',
    'Share BestCheckout and earn when stores you refer pay their software fees.': '分享 BestCheckout，你推荐的店铺付清软件费后你获得佣金。'
  });

  window.VIEWS = window.VIEWS || {};
  window.VIEWS.refer = {
    render: function (el) { root = el; render(); }
  };
})();
