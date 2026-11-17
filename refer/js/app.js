/* Merchant Refer page. The signed-in store owner is a BestCheckout salesperson. */
(function () {
  'use strict';

  var root;
  var R = function () { return window.BestCheckoutRefer; };
  var listState = {
    partnerId: '',
    stores: { page: 1, size: 20 },
    downline: { page: 1, size: 20 }
  };;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function toast(message) {
    var node = document.createElement('div');
    node.className = 'refer-toast';
    node.textContent = message;
    document.body.appendChild(node);
    if (window.I18N) window.I18N.apply(node);
    setTimeout(function () { node.remove(); }, 1800);
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
  function storeUrl(name) {
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
    return '<div class="flex items-center justify-between card-pad"><span class="muted" style="font-size:13px">Total ' + view.total + ' records</span>' + pagerHtml(key, view.page, view.pages, view.size) + '</div>';
  }
  function commissionText(store, model) {
    if (store.status === 'Paid') {
      var direct = model.splits(store).filter(function (row) { return row.kind === 'Direct'; })[0];
      return '<span class="i18n-skip">' + esc(model.money(direct ? direct.amount : 0)) + '</span> <span class="refer-ok">Available</span>';
    }
    if (store.status === 'Past due' || store.status === 'Charge failed') return '<span class="refer-wait">Waiting for payment</span>';
    return '<span class="muted">Billing has not started</span>';
  }

  function render() {
    var model = R();
    var storeName = (window.SITE && window.SITE.store) || 'Lavender Labs';
    var me = model.ownerOf(storeName);
    if (!me) {
      root.innerHTML = '<div class="view-wrap"><div class="refer-page"><h1 class="page-title">Refer</h1><p class="orders-page-subtitle">Refer is not set up for this store.</p></div></div>';
      if (window.I18N) window.I18N.apply(root);
      return;
    }
    var standing = model.rankOf(me.id);
    var parent = model.partner(me.parentId);
    var referred = model.stores.filter(function (store) { return store.referrerId === me.id; });
    var downline = [];
    model.stores.forEach(function (store) {
      model.splits(store).forEach(function (row) {
        if (row.partnerId === me.id && row.kind === 'Downline') downline.push(row);
      });
    });
    var referredBy = parent
      ? '<div class="refer-by"><span>Referred by</span> <strong class="i18n-skip">' + esc(parent.name) + '</strong> <span class="refer-pill">' + esc(model.rankOf(parent.id).current.name) + '</span></div>'
      : '<div class="refer-by"><span>You joined without a referrer.</span></div>';
    var ownNote = '<p class="refer-note">This store is yours. Its software fees are not commissioned to you.</p>';
    var referrerOfThisStore = null;
    model.stores.forEach(function (store) {
      if (store.store === storeName && store.referrerId) referrerOfThisStore = model.partner(store.referrerId);
    });
    if (referrerOfThisStore && referrerOfThisStore.id !== me.id) {
      ownNote = '<p class="refer-note"><span>This store was referred by</span> <strong class="i18n-skip">' + esc(referrerOfThisStore.name) + '</strong><span>. Commission on its paid invoices goes to them.</span></p>';
    }
    var nextRank = standing.next
      ? '<strong>' + esc(standing.next.name) + '</strong><small><span>Starts at</span> <b class="i18n-skip">' + esc(model.money(standing.next.at)) + '</b></small>'
      : '<strong>Top rank</strong><small>You are at the top rank.</small>';
    var rankRows = model.RANKS.map(function (rank) {
      var you = rank.name === standing.current.name;
      return '<tr' + (you ? ' class="refer-current"' : '') + '><td>' + esc(rank.name) + (you ? ' <span class="refer-you">You</span>' : '') + '</td><td>' + (rank.at ? '<span class="i18n-skip">' + esc(model.money(rank.at)) + '</span>' : 'Join') + '</td><td class="i18n-skip">' + rank.direct + '%</td><td class="i18n-skip">' + rank.passup + '%</td></tr>';
    }).join('');
    if (listState.partnerId !== me.id) {
      listState.partnerId = me.id;
      listState.stores.page = 1;
      listState.downline.page = 1;
    }
    var storePage = pageOf(referred, listState.stores);
    var downPage = pageOf(downline, listState.downline);
    var storeRows = storePage.rows.length ? storePage.rows.map(function (store) {
      var fees = store.status === 'Paid' ? '<span class="i18n-skip">' + esc(model.money(store.collected)) + '</span>' : '<span class="muted">—</span>';
      return '<tr><td>' + storeCell(store.store, store.month) + '</td><td>' + esc(statusText(store.status)) + '</td><td>' + fees + '</td><td>' + commissionText(store, model) + '</td></tr>';
    }).join('') : '<tr><td colspan="4" class="muted refer-empty">No referred stores yet. Share your link. You earn after a referred store pays a BestCheckout invoice.</td></tr>';
    var cash = model.available(me.id);
    var payouts = model.withdrawalsFor(me.id);
    var pending = payouts.some(function (item) { return item.status === 'Pending'; });
    var canWithdraw = cash >= 5000 && !pending;
    var withdrawHint = pending
      ? 'BestCheckout is sending this withdrawal to PayPal.'
      : (cash >= 5000 ? 'The full available balance is paid to your PayPal account.' : 'Available balance must reach $50.00.');
    var payoutRows = payouts.length ? payouts.map(function (item) {
      return '<tr><td>' + esc(item.at) + '</td><td class="i18n-skip">' + esc(model.money(item.amount)) + '</td><td class="i18n-skip">' + esc(item.paypal) + '</td><td>' + (item.status === 'Pending' ? '<span class="refer-wait">Pending</span>' : '<span class="refer-ok">Paid</span>') + '</td></tr>';
    }).join('') : '<tr><td colspan="4" class="muted refer-empty">No withdrawals yet.</td></tr>';
    var downRows = downPage.rows.length ? downPage.rows.map(function (row) {
      return '<tr><td>' + storeCell(model.storeOf(row.fromId)) + '</td><td>' + storeCell(row.store, row.month) + '</td><td class="i18n-skip">' + esc(model.money(row.baseAmount)) + '</td><td><span class="i18n-skip">' + esc(model.money(row.amount)) + '</span> <span class="muted">' + row.rate + '%</span></td></tr>';
    }).join('') : '<tr><td colspan="4" class="muted refer-empty">When someone you referred earns a commission, your share shows up here.</td></tr>';

    root.innerHTML =
      '<div class="view-wrap"><div class="refer-page">' +
        '<style>' +
          '.refer-page{max-width:1120px}' +
          '.refer-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:16px 0}' +
          '.refer-kpi{background:#fff;border:1px solid var(--hair);border-radius:12px;padding:14px 16px}' +
          '.refer-kpi>span{display:block;color:var(--ink-muted);font-size:12.5px}' +
          '.refer-kpi strong{display:block;margin-top:6px;font-size:20px}' +
          '.refer-kpi small{display:block;margin-top:4px;color:var(--ink-muted);font-size:12px}' +
          '.refer-link{display:flex;gap:8px;align-items:center;margin-top:8px}' +
          '.refer-link code{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:#f6f7fb;border:1px solid var(--hair);border-radius:8px;padding:8px 10px;font-size:13px}' +
          '.refer-by{margin-top:12px;color:var(--ink-body);font-size:13.5px}' +
          '.refer-pill{display:inline-block;margin-left:6px;padding:1px 8px;border-radius:999px;background:#f3f0ff;color:#5b3fd0;font-size:12px;font-weight:600}' +
          '.refer-note{margin:12px 0 0;color:var(--ink-muted);font-size:13px;line-height:1.5}' +
          '.refer-current{background:#f7f5ff}' +
          '.refer-you{margin-left:6px;color:#5b3fd0;font-size:12px;font-weight:700}' +
          '.refer-ok{color:#178a52;font-weight:600}' +
          '.refer-wait{color:#9a6700;font-weight:600}' +
          '.refer-url{font-size:12px;margin-top:2px}' +
          '.refer-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#242833;color:#fff;padding:10px 16px;border-radius:8px;font-size:13px;z-index:80}' +
          '.refer-balance{display:flex;align-items:center;justify-content:space-between;gap:16px}' +
          '.refer-balance .btn{flex:none}' +
          '.refer-balance .btn:disabled{opacity:.45;cursor:not-allowed}' +
          '.refer-field{margin-top:14px}' +
          '.refer-field label{display:block;margin-bottom:6px;font-size:13px;font-weight:600}' +
          '.refer-field .refer-error{margin-top:6px;color:#d92d20;font-size:12.5px}' +
          '@media (max-width:900px){.refer-kpis{grid-template-columns:1fr 1fr}.refer-balance{align-items:flex-start;flex-direction:column}}' +
        '</style>' +
        '<div class="orders-page-head">' +
          '<h1 class="page-title">Refer</h1>' +
          '<p class="orders-page-subtitle">Share BestCheckout. You earn at least 25% of each paid software fee for as long as that store keeps paying. Your rank raises the rate, and you also earn a share of the commission those people earn.</p>' +
        '</div>' +
        '<div class="refer-kpis">' +
          '<div class="refer-kpi"><span>Rank</span><strong>' + esc(standing.current.name) + '</strong><small><span class="i18n-skip">' + standing.current.direct + '%</span> <span>of paid software fees</span></small></div>' +
          '<div class="refer-kpi"><span>Available</span><strong class="i18n-skip">' + esc(model.money(cash)) + '</strong><small>Minimum $50.00</small></div>' +
          '<div class="refer-kpi"><span>Personal paid fees</span><strong class="i18n-skip">' + esc(model.money(standing.personal)) + '</strong><small>Last 90 days, stores you referred</small></div>' +
          '<div class="refer-kpi"><span>Next rank</span>' + nextRank + '</div>' +
        '</div>' +
        '<div class="panel"><div class="card-pad refer-balance">' +
          '<div><div class="card-title">Withdraw</div><p class="refer-note" style="margin-top:4px">' + withdrawHint + '</p></div>' +
          '<button type="button" class="btn btn-primary" id="refer-withdraw"' + (canWithdraw ? '' : ' disabled') + '>' + (pending ? 'Withdrawal pending' : 'Withdraw') + '</button>' +
        '</div></div>' +
        '<div class="panel" style="margin-top:16px"><div class="card-pad" style="padding-bottom:0"><div class="card-title">Withdrawals</div></div>' +
          '<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Date</th><th>Amount</th><th>PayPal</th><th>Status</th></tr></thead><tbody>' + payoutRows + '</tbody></table></div>' +
        '</div>' +
        '<div class="panel" style="margin-top:16px"><div class="card-pad">' +
          '<div class="card-title">Your link</div>' +
          '<div class="refer-link"><code class="i18n-skip" id="refer-link">' + esc(model.linkFor(me)) + '</code><button type="button" class="btn btn-default" id="refer-copy-link">Copy link</button></div>' +
          '<div class="refer-link"><code class="i18n-skip" id="refer-code">' + esc(me.code) + '</code><button type="button" class="btn btn-default" id="refer-copy-code">Copy code</button></div>' +
          referredBy + ownNote +
        '</div></div>' +
        '<div class="panel" style="margin-top:16px"><div class="card-pad" style="padding-bottom:0"><div class="card-title">How ranks work</div><p class="refer-note" style="margin-top:6px">Rank uses paid software fees from stores you personally referred in the last 90 days. Shares of downline commission do not raise your rank.</p></div>' +
          '<table class="tbl"><thead><tr><th>Rank</th><th>Personal paid fees, last 90 days</th><th>Direct commission</th><th>Share of the next person\'s commission</th></tr></thead><tbody>' + rankRows + '</tbody></table>' +
          '<p class="refer-note" style="padding:0 16px 14px">Commission continues on every paid invoice. It does not stop after 12 months. The chain stops at 40% of each paid invoice, or when a share is under $1.00.</p>' +
        '</div>' +
        '<div class="panel" style="margin-top:16px" id="refer-stores"><div class="card-pad" style="padding-bottom:0"><div class="card-title">Stores you referred</div></div>' +
          '<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Store</th><th>Billing</th><th>Paid software fees</th><th>Your commission</th></tr></thead><tbody>' + storeRows + '</tbody></table></div>' +
          pagerFoot('stores', storePage) +
        '</div>' +
        '<div class="panel" style="margin-top:16px" id="refer-downline"><div class="card-pad" style="padding-bottom:0"><div class="card-title">Commission from people you refer</div></div>' +
          '<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Downline store</th><th>Store</th><th>Their commission</th><th>Your share</th></tr></thead><tbody>' + downRows + '</tbody></table></div>' +
          pagerFoot('downline', downPage) +
        '</div>' +
      '</div></div>';

    root.querySelector('#refer-copy-link').onclick = function () { copyText(model.linkFor(me), 'Link copied'); };
    root.querySelector('#refer-copy-code').onclick = function () { copyText(me.code, 'Code copied'); };
    var withdrawBtn = root.querySelector('#refer-withdraw');
    if (withdrawBtn && canWithdraw) withdrawBtn.onclick = function () { openWithdraw(me, cash); };
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

  function openWithdraw(me, amount) {
    var model = R();
    var bd = document.createElement('div');
    bd.className = 'modal-backdrop';
    bd.innerHTML =
      '<div class="modal" style="width:440px;max-width:calc(100vw - 24px)" role="dialog" aria-modal="true">' +
        '<div class="modal-head flex items-center justify-between"><span>Withdraw</span><button type="button" class="btn btn-default" data-x style="height:28px;padding:0 8px">Close</button></div>' +
        '<div class="modal-body">' +
          '<div class="refer-field"><label>Amount</label><input class="input i18n-skip" value="' + esc(model.money(amount)) + '" readonly></div>' +
          '<div class="refer-field"><label for="refer-paypal">PayPal email</label><input class="input" id="refer-paypal" type="email" value="' + esc(me.email) + '" placeholder="name@email.com"><div class="refer-error" id="refer-paypal-error" hidden>Enter a PayPal email.</div></div>' +
          '<p class="refer-note">BestCheckout pays this PayPal account. This prototype does not send money.</p>' +
        '</div>' +
        '<div class="modal-foot"><button type="button" class="btn btn-default" data-cancel>Cancel</button><button type="button" class="btn btn-primary" id="refer-withdraw-go">Withdraw</button></div>' +
      '</div>';
    document.body.appendChild(bd);
    if (window.I18N) window.I18N.apply(bd);
    function close() { bd.remove(); }
    bd.addEventListener('mousedown', function (event) { if (event.target === bd) close(); });
    bd.querySelector('[data-x]').onclick = close;
    bd.querySelector('[data-cancel]').onclick = close;
    bd.querySelector('#refer-withdraw-go').onclick = function () {
      var email = (bd.querySelector('#refer-paypal').value || '').trim();
      var error = bd.querySelector('#refer-paypal-error');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error.hidden = false;
        return;
      }
      error.hidden = true;
      if (!model.requestWithdrawal(me.id, email)) return;
      close();
      toast('Withdrawal requested');
      render();
    };
  }

  if (window.I18N && window.I18N.extend) window.I18N.extend({
    'Refer is not set up for this store.': '这家店还没有推荐身份。',
    'Share BestCheckout. You earn at least 25% of each paid software fee for as long as that store keeps paying. Your rank raises the rate, and you also earn a share of the commission those people earn.': '分享 BestCheckout。店铺持续付费，你就持续拿每笔已付软件费的至少 25%。等级会提高比例，你还能从这些人赚到的佣金里再分一笔。',
    'Rank': '等级',
    'Available': '可打款',
    'of paid software fees': '取已付软件费',
    'Paid out once it reaches $50.00': '满 $50.00 打出',
    'Minimum $50.00': '满 $50.00 可提现',
    'Withdraw': '提现',
    'Withdrawal pending': '提现处理中',
    'The full available balance is paid to your PayPal account.': '可提现余额会全部打到你的 PayPal。',
    'Available balance must reach $50.00.': '可提现余额需要达到 $50.00。',
    'BestCheckout is sending this withdrawal to PayPal.': 'BestCheckout 正在把这笔提现打到 PayPal。',
    'Withdrawals': '提现记录',
    'No withdrawals yet.': '还没有提现。',
    'Date': '日期',
    'Amount': '金额',
    'Status': '状态',
    'Pending': '待打款',
    'PayPal email': 'PayPal 邮箱',
    'Enter a PayPal email.': '请填写 PayPal 邮箱。',
    'BestCheckout pays this PayPal account. This prototype does not send money.': 'BestCheckout 会打到这个 PayPal。这个原型不会真正打款。',
    'Withdrawal requested': '已提交提现',
    'Close': '关闭',
    'Nov 17, 2026': '2026年11月17日',
    'Personal paid fees': '本人名下已付软件费',
    'Last 90 days, stores you referred': '近 90 天，你推荐的店铺',
    'Next rank': '下一等级',
    'Starts at': '达到',
    'Top rank': '最高等级',
    'You are at the top rank.': '已是最高等级。',
    'Your link': '你的链接',
    'Copy link': '复制链接',
    'Copy code': '复制推荐码',
    'Link copied': '链接已复制',
    'Code copied': '推荐码已复制',
    'Referred by': '你的推荐人',
    'You joined without a referrer.': '你没有推荐人。',
    'This store is yours. Its software fees are not commissioned to you.': '这是你自己的店。它的软件费不会发给你。',
    'This store was referred by': '这家店的推荐人是',
    '. Commission on its paid invoices goes to them.': '。账单付清后，佣金发给推荐人。',
    'How ranks work': '等级怎么算',
    'Rank uses paid software fees from stores you personally referred in the last 90 days. Shares of downline commission do not raise your rank.': '等级只看近 90 天你亲自推荐、且已付清的软件费。下家佣金分成不计入升级。',
    'Personal paid fees, last 90 days': '近 90 天本人名下已付软件费',
    'Direct commission': '直接佣金',
    "Share of the next person's commission": '从下一层佣金中分走',
    'Join': '注册即是',
    'You': '当前',
    'Commission continues on every paid invoice. It does not stop after 12 months. The chain stops at 40% of each paid invoice, or when a share is under $1.00.': '每张已付账单都发佣金，不会在 12 个月后停止。整条链最多拿走每张已付账单的 40%，单笔不足 $1.00 即停止。',
    'Stores you referred': '你推荐的店铺',
    'Store': '店铺',
    'Billing': '账单',
    'Paid software fees': '已付软件费',
    'Your commission': '你的佣金',
    'Paid': '已支付',
    'Past due': '逾期',
    'Charge failed': '扣款失败',
    'Not billed': '未计费',
    'September 2026': '2026 年 9 月',
    'October 2026': '2026 年 10 月',
    'Waiting for payment': '等账单付清',
    'Billing has not started': '账单尚未开始',
    'No referred stores yet. Share your link. You earn after a referred store pays a BestCheckout invoice.': '还没有推荐店铺。把链接发出去。对方的店付清 BestCheckout 账单后，你开始有佣金。',
    'Commission from people you refer': '从下家佣金中分到的',
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
