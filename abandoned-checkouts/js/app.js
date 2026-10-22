/* BestCheckout Admin · Abandoned checkouts — list + detail.
   Hash route: #/abandoned-checkouts and #/abandoned-checkouts/{id} */
(function () {
  const D = window.DATA_ABANDONED_CHECKOUTS;
  let root;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => '$' + Number(n || 0).toFixed(2);
  const svg = (p, w) => '<svg viewBox="0 0 24 24" width="' + (w || 16) + '" height="' + (w || 16) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  const I = {
    eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
    copy: svg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>', 16),
    arrowLeft: svg('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>', 18),
    mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/>', 15),
    phone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>', 15),
    pencil: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>', 15),
    x: svg('<path d="M18 6 6 18M6 6l12 12"/>', 16),
    tag: svg('<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1.3"/>', 13),
    recurring: svg('<path d="M21 12a9 9 0 0 0-15.2-6.5L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 15.2 6.5L21 16"/><path d="M21 21v-5h-5"/>', 13),
  };
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  const toast = (msg, type) => {
    const level = type || (/failed|error|失败|could not/i.test(String(msg)) ? 'error' : 'success');
    const tone = level === 'error' ? '#ff4d4f' : level === 'warning' ? '#faad14' : '#52c41a';
    const glyph = level === 'error' ? '×' : level === 'warning' ? '!' : '✓';
    document.querySelectorAll('.ac-message').forEach((message) => message.remove());
    const t = document.createElement('div');
    t.className = 'ac-message ' + level;
    t.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:8px;max-width:min(560px,calc(100vw - 48px));padding:9px 16px;background:#fff;color:rgba(0,0,0,.88);border-radius:8px;font-size:14px;line-height:1.45;z-index:300;box-shadow:0 6px 16px rgb(0 0 0 / 8%),0 3px 6px -4px rgb(0 0 0 / 12%),0 9px 28px 8px rgb(0 0 0 / 5%)';
    t.innerHTML = '<span aria-hidden="true" style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:' + tone + ';color:#fff;font-size:12px;font-weight:700;line-height:1;flex:none">' + glyph + '</span><span></span>';
    t.lastElementChild.textContent = msg;
    document.body.appendChild(t);
    if (window.I18N) window.I18N.apply(t);
    setTimeout(() => t.remove(), 2000);
  };

  const STATUS = {
    abandoned: { text: 'Abandoned', cls: 'pill-orange' },
    recovered: { text: 'Recovered', cls: 'pill-blue' },
    expired: { text: 'Expired', cls: 'pill-gray' },
    in_progress: { text: 'In progress', cls: 'pill-gray' },
  };
  const STEP = {
    contact: 'Contact',
    shipping: 'Shipping',
    payment: 'Payment',
  };

  function pill(map, key) {
    const m = map[key] || { text: key, cls: 'pill-gray' };
    return '<span class="pill ' + m.cls + '"><span class="dot"></span>' + esc(m.text) + '</span>';
  }

  function hasContact(row) {
    return Boolean((row.customer.email || '').trim() || (row.customer.phone || '').trim());
  }

  function isRecoverable(row) {
    return row.abandon_status === 'abandoned' && Boolean((row.customer.email || '').trim());
  }

  function recoveryLabel(row) {
    if (row.abandon_status === 'recovered') return 'Recovered';
    if (row.abandon_status === 'expired') return 'Expired';
    if (!row.customer.email) return 'Phone only';
    if (row.marketing_status === 'unsubscribed') return 'Unsubscribed';
    if (row.marketing_status === 'not_subscribed') return 'No marketing consent';
    if (row.recovery_email_count > 0) return 'Reminder sent';
    return 'Ready to send';
  }

  const LST = { emailStatus: '', recoveryStatus: '', kwType: 'checkout_sn', kw: '', kwApplied: '', page: 1, size: 20 };

  function filtered() {
    let rows = D.CHECKOUTS.slice();
    if (LST.emailStatus) rows = rows.filter((row) => emailKey(row) === LST.emailStatus);
    if (LST.recoveryStatus) rows = rows.filter((row) => (row.abandon_status === 'recovered' ? 'recovered' : 'not_recovered') === LST.recoveryStatus);
    if (LST.kwApplied) {
      const q = LST.kwApplied.toLowerCase();
      rows = rows.filter((row) => {
        if (LST.kwType === 'checkout_sn') return (row.checkout_sn + ' ' + row.order_sn).toLowerCase().includes(q);
        if (LST.kwType === 'email') return (row.customer.email || '').toLowerCase().includes(q);
        if (LST.kwType === 'phone') return (row.customer.phone || '').toLowerCase().includes(q);
        if (LST.kwType === 'customer') return (row.customer.name || '').toLowerCase().includes(q);
        if (LST.kwType === 'product') return row.items.some((item) => item.title.toLowerCase().includes(q));
        return JSON.stringify(row).toLowerCase().includes(q);
      });
    }
    return rows;
  }

  function byId(id) {
    return D.CHECKOUTS.find((row) => String(row.id) === String(id) || String(row.order_id) === String(id));
  }

  function itemSummary(row) {
    if (!row.items.length) return '--';
    const first = row.items[0].title;
    return row.items.length > 1 ? first + ' +' + (row.items.length - 1) : first;
  }

  function contactCell(row) {
    if (row.customer.email) return esc(row.customer.email);
    if (row.customer.phone) return esc(row.customer.phone);
    return '<span class="muted">No contact</span>';
  }

  function canSendEmail(row) {
    if (row.abandon_status !== 'abandoned') return { ok: false, reason: 'This checkout is no longer open.' };
    if (!row.customer.email) return { ok: false, reason: 'This abandoned checkout has a phone number only. Copy the recovery link instead.' };
    if (row.marketing_status === 'unsubscribed') return { ok: false, reason: 'This customer unsubscribed from marketing emails.' };
    if (row.marketing_status !== 'subscribed') return { ok: false, reason: 'This customer has not agreed to marketing emails.' };
    if (row.recovery_email_count > 0) return { ok: false, reason: 'A recovery email was already sent for this checkout.' };
    return { ok: true, reason: '' };
  }

  function renderList() {
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / LST.size));
    if (LST.page > pages) LST.page = pages;
    const pageRows = rows.slice((LST.page - 1) * LST.size, LST.page * LST.size);
    const kwOpts = D.KEYWORD_OPTIONS.map((o) => '<option value="' + o.value + '"' + (o.value === LST.kwType ? ' selected' : '') + '>' + esc(o.label) + '</option>').join('');
    const emailOpts = [
      { value: '', label: 'Email status' },
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'sent', label: 'Sent' },
      { value: 'not_sent', label: 'Not sent' },
    ].map((o) => '<option value="' + o.value + '"' + (o.value === LST.emailStatus ? ' selected' : '') + '>' + esc(o.label) + '</option>').join('');
    const recoveryOpts = [
      { value: '', label: 'Recovery status' },
      { value: 'not_recovered', label: 'Not recovered' },
      { value: 'recovered', label: 'Recovered' },
    ].map((o) => '<option value="' + o.value + '"' + (o.value === LST.recoveryStatus ? ' selected' : '') + '>' + esc(o.label) + '</option>').join('');
    const colSpan = 8;
    const emailLabel = { scheduled: 'Scheduled', sent: 'Sent', not_sent: 'Not sent' };
    const recoveryLabelText = { not_recovered: 'Not recovered', recovered: 'Recovered' };
    const tags = [];
    if (LST.kwApplied) {
      const lbl = (D.KEYWORD_OPTIONS.find((o) => o.value === LST.kwType) || {}).label || '';
      tags.push('<span class="field-pill" data-clear="kw"><span>' + esc(lbl) + '</span>: <span class="i18n-skip">' + esc(LST.kwApplied) + '</span> <span class="x">&times;</span></span>');
    }
    if (LST.emailStatus) {
      tags.push('<span class="field-pill" data-clear="email"><span>Email status</span>: <span>' + esc(emailLabel[LST.emailStatus] || LST.emailStatus) + '</span> <span class="x">&times;</span></span>');
    }
    if (LST.recoveryStatus) {
      tags.push('<span class="field-pill" data-clear="recovery"><span>Recovery status</span>: <span>' + esc(recoveryLabelText[LST.recoveryStatus] || LST.recoveryStatus) + '</span> <span class="x">&times;</span></span>');
    }

    root.innerHTML =
      '<div class="mb-4"><h1 class="page-title">Abandoned checkouts</h1>' +
        '<p class="orders-page-subtitle" style="margin-top:6px;white-space:nowrap">' + (D.product === 'bestcheckout'
          ? 'Abandoned after an email is left and the checkout stays unpaid for ' + D.settings.abandonThresholdMinutes + ' minutes. Not written to Shopify.'
          : 'Abandoned after an email is left and the checkout stays unpaid for ' + D.settings.abandonThresholdMinutes + ' minutes.') + '</p></div>' +
      '<div class="panel">' +
        '<div class="card-pad">' +
          '<div class="filter-bar">' +
            '<div class="flex items-center" style="min-width:428px;max-width:560px">' +
              '<select class="filter-select" id="ac-kw-type" style="width:160px;border-top-right-radius:0;border-bottom-right-radius:0">' + kwOpts + '</select>' +
              '<div style="position:relative;flex:1">' +
                '<input class="filter-input" id="kw-input" placeholder="Search" value="' + esc(LST.kw) + '" style="width:100%;padding-left:12px;padding-right:52px;border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px" />' +
                '<span class="kw-clear" data-kw-clear title="Clear">&times;</span>' +
                '<span class="filter-ico">' + I.search + '</span>' +
              '</div>' +
            '</div>' +
            '<select class="filter-select" id="ac-email-status" style="width:160px" aria-label="Email status">' + emailOpts + '</select>' +
            '<select class="filter-select" id="ac-recovery-status" style="width:180px" aria-label="Recovery status">' + recoveryOpts + '</select>' +
          '</div>' +
          (tags.length ? '<div class="flex gap-2 mt-3" style="flex-wrap:wrap" id="filter-tags">' + tags.join('') + '</div>' : '') +
        '</div>' +
        '<div style="overflow-x:auto"><table class="tbl" style="min-width:1080px"><thead><tr>' +
          '<th>Checkout</th><th>Created</th><th>Customer name</th><th>Email status</th><th>Region</th><th>Recovery status</th><th>Total price</th><th style="text-align:center">Action</th>' +
        '</tr></thead><tbody>' +
        (pageRows.length ? pageRows.map(rowHtml).join('') : '<tr><td colspan="' + colSpan + '" style="text-align:center;padding:40px" class="muted">No abandoned checkouts match these filters.</td></tr>') +
        '</tbody></table></div>' +
        '<div class="flex items-center justify-between card-pad"><span class="muted" style="font-size:13px">Total ' + rows.length + ' records</span>' + pagerHtml(LST.page, pages) + '</div>' +
      '</div>';
    wireList();
  }

  function emailKey(row) {
    if (row.recovery_email_count > 0) return 'sent';
    if (row.recovery_email_scheduled_at) return 'scheduled';
    return 'not_sent';
  }

  function emailStatus(row) {
    const key = emailKey(row);
    if (key === 'sent') return { text: 'Sent', cls: 'pill-green' };
    if (key === 'scheduled') return { text: 'Scheduled', cls: 'pill-yellow' };
    return { text: 'Not sent', cls: 'pill-orange' };
  }

  function recoveryStatus(row) {
    if (row.abandon_status === 'recovered') return { text: 'Recovered', cls: 'pill-green' };
    return { text: 'Not recovered', cls: 'pill-orange' };
  }

  function paidOrders(row) {
    return Array.isArray(row.paid_orders) ? row.paid_orders : [];
  }

  function recoveryCell(row) {
    const count = paidOrders(row).length;
    const extra = count > 1 ? '<span class="muted" style="font-size:12px;margin-left:8px">' + count + ' orders</span>' : '';
    return '<span style="display:inline-flex;align-items:center">' + statusPill(recoveryStatus(row)) + extra + '</span>';
  }

  function statusPill(status) {
    return '<span class="pill ' + status.cls + '"><span class="dot"></span>' + esc(status.text) + '</span>';
  }

  function rowHtml(row) {
    return '<tr data-id="' + esc(row.id) + '">' +
      '<td style="font-weight:600;color:var(--brand)">' + esc(row.checkout_sn) + '</td>' +
      '<td class="muted">' + esc(row.create_time || '--') + '</td>' +
      '<td>' + esc(row.customer.name || 'Guest') + '</td>' +
      '<td>' + statusPill(emailStatus(row)) + '</td>' +
      '<td>' + esc(row.region || '--') + '</td>' +
      '<td>' + recoveryCell(row) + '</td>' +
      '<td style="font-weight:600">' + money(row.total) + '</td>' +
      '<td style="text-align:center"><button class="back-btn" data-view="' + esc(row.id) + '" title="Detail" style="width:30px;height:30px">' + I.eye + '</button></td>' +
    '</tr>';
  }

  function pagerHtml(page, pages) {
    const item = (label, p, opts) => {
      opts = opts || {};
      const cls = 'pg-item' + (opts.active ? ' active' : '') + (opts.disabled ? ' disabled' : '');
      return '<span class="' + cls + '"' + (opts.disabled ? '' : ' data-page="' + p + '"') + '>' + label + '</span>';
    };
    let nums = '';
    for (let p = 1; p <= pages; p++) nums += item(String(p), p, { active: p === page });
    return '<div class="pg">' +
      item('‹', page - 1, { disabled: page <= 1 }) + nums + item('›', page + 1, { disabled: page >= pages }) +
      '<select class="pg-size" id="pg-size">' +
        ['20', '50', '100'].map((s) => '<option value="' + s + '"' + (Number(s) === LST.size ? ' selected' : '') + '>' + s + ' / page</option>').join('') +
      '</select>' +
    '</div>';
  }

  function wireList() {
    const emailStatus = root.querySelector('#ac-email-status');
    const recoveryStatus = root.querySelector('#ac-recovery-status');
    if (emailStatus) emailStatus.onchange = () => { LST.emailStatus = emailStatus.value; LST.page = 1; renderList(); };
    if (recoveryStatus) recoveryStatus.onchange = () => { LST.recoveryStatus = recoveryStatus.value; LST.page = 1; renderList(); };
    const type = root.querySelector('#ac-kw-type');
    const input = root.querySelector('#kw-input');
    if (type) type.onchange = () => { LST.kwType = type.value; };
    if (input) {
      input.oninput = () => { LST.kw = input.value; };
      const commit = () => { LST.kwApplied = (LST.kw || '').trim(); LST.page = 1; renderList(); };
      input.onkeydown = (e) => { if (e.key === 'Enter') commit(); };
      input.onblur = commit;
    }
    const kwClear = root.querySelector('[data-kw-clear]');
    if (kwClear) kwClear.onclick = () => { LST.kw = ''; LST.kwApplied = ''; LST.page = 1; renderList(); };
    root.querySelectorAll('#filter-tags [data-clear]').forEach((tg) => tg.onclick = () => {
      const k = tg.getAttribute('data-clear');
      if (k === 'kw') { LST.kw = ''; LST.kwApplied = ''; }
      if (k === 'email') LST.emailStatus = '';
      if (k === 'recovery') LST.recoveryStatus = '';
      LST.page = 1;
      renderList();
    });
    const ps = root.querySelector('#pg-size');
    if (ps) ps.onchange = () => { LST.size = Number(ps.value); LST.page = 1; renderList(); };
    root.querySelectorAll('.pg-item[data-page]').forEach((el) => el.onclick = () => { LST.page = Number(el.getAttribute('data-page')); renderList(); });
    root.querySelectorAll('#ac-tbody tr[data-id], table.tbl tbody tr[data-id]').forEach((tr) => {
      tr.onclick = (e) => {
        if (e.target.closest('[data-view]')) return;
        location.hash = '#/abandoned-checkouts/' + tr.getAttribute('data-id');
      };
    });
    root.querySelectorAll('[data-view]').forEach((b) => b.onclick = (e) => {
      e.stopPropagation();
      location.hash = '#/abandoned-checkouts/' + b.getAttribute('data-view');
    });
  }

  function publicRecoveryUrl(row) {
    const raw = String(row.recovery_url || '');
    const token = (raw.split('token=')[1] || '').split('&')[0] || row.id;
    const number = String(row.checkout_sn || row.id).replace(/^#/, '');
    return 'https://pay.bestcheckout.shop/checkout/' + number + '/recover?key=' + token;
  }

  function letterThumb(item) {
    if (item.image) return item.image;
    const letter = String(item.title || '?').trim().charAt(0).toUpperCase() || '?';
    const palettes = [['#f3ece1', '#7a5c3a'], ['#eef4ff', '#1d4ed8'], ['#eef0f4', '#525a6b'], ['#eff8f3', '#18794e'], ['#eee8f7', '#6442a6']];
    const pair = palettes[letter.charCodeAt(0) % palettes.length];
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="44" height="44" rx="6" fill="' + pair[0] + '"/>' +
      '<text x="22" y="27" font-family="Inter,Arial" font-size="13" font-weight="600" fill="' + pair[1] + '" text-anchor="middle">' + letter + '</text></svg>');
  }

  function linePaid(item) {
    if (item.product_price != null) return Number(item.product_price);
    return Number(item.price || 0);
  }
  function lineCompare(item) {
    if (item.line_total != null) return Number(item.line_total);
    if (item.compare_price != null) return Number(item.compare_price);
    return linePaid(item);
  }
  function discountType(item, discount) {
    const type = String(discount.type || '').toLowerCase();
    if (type === 'subscription' || type === 'product' || type === 'bundle') return type;
    const name = String(discount.name || '');
    if (/^bundle discount\b/i.test(name)) return 'bundle';
    if (/^(subscription discount|delivery every\b)/i.test(name)) return 'subscription';
    if (/^product discount\b/i.test(name)) return 'product';
    return item.subLine ? 'subscription' : 'product';
  }
  function subscriptionDiscountLabel(discount) {
    const label = String((discount && discount.name) || '').trim();
    return /^delivery every\b/i.test(label) ? 'Subscription discount' : (label || 'Subscription discount');
  }
  function subscriptionMeta(item) {
    const sub = item.subscription;
    if (!item.subLine || !sub) return '';
    const delivery = sub.deliveryLabel ? String(sub.deliveryLabel).replace(/\s*\([^)]*\)\s*$/, '') : 'Delivery schedule';
    const contract = sub.id
      ? '<span aria-hidden="true" class="muted">&middot;</span><a href="#/subscriptions/contracts/' + encodeURIComponent(sub.id) + '" style="color:var(--brand);font-weight:500;text-decoration:none">' + esc(sub.id) + '</a>'
      : '';
    return '<div style="grid-column:1 / -1;display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding-top:2px;font-size:12px;color:var(--ink-body);line-height:1.45">' +
      '<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:var(--brand-50);color:var(--brand);flex:none">' + I.recurring + '</span>' +
      '<span style="font-weight:600;color:var(--ink)">Subscription</span><span aria-hidden="true" class="muted">&middot;</span>' +
      '<span>' + esc(delivery) + '</span>' + contract +
    '</div>';
  }

  function catalogBadge(item) {
    const status = item.catalog_status;
    if (status !== 'unlisted' && status !== 'deleted') return '';
    const label = status === 'unlisted' ? 'Unlisted' : 'Deleted';
    return '<span style="display:inline-flex;align-items:center;font-size:11px;font-weight:600;color:#8a5a00;background:#fff4de;border-radius:3px;padding:2px 6px;flex:none">' + label + '</span>';
  }

  function checkoutItemRow(item) {
    const discounts = item.discounts || [];
    const paid = linePaid(item);
    const compare = lineCompare(item);
    const productDiscounts = discounts.filter((d) => discountType(item, d) === 'product');
    const subscriptionDiscounts = item.subLine ? discounts.filter((d) => discountType(item, d) === 'subscription') : [];
    const variant = String(item.variant || item.sku || '').trim().replace(/\s*,\s*/g, ' / ');
    const disc = productDiscounts.map((d) =>
      '<div class="flex items-center gap-1 mt-1" style="font-size:12px;color:#8B8B8B">' + I.tag +
      '<span>' + esc(d.name) + ' (-' + money(d.amount) + ')</span></div>').join('');
    const subDiscounts = subscriptionDiscounts.length
      ? '<div style="grid-column:1 / -1;display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding-bottom:2px">' + subscriptionDiscounts.map((d) =>
        '<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-muted);line-height:1.45"><span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:none">' + I.tag + '</span><span>' + esc(subscriptionDiscountLabel(d)) + ' (-' + money(d.amount) + ')</span></span>').join('') + '</div>'
      : '';
    return '<div style="display:grid;grid-template-columns:minmax(0,1fr) 44px 104px;gap:14px;align-items:flex-start;padding:14px 0">' +
      '<div class="flex items-center gap-3" style="min-width:0">' +
        '<img src="' + letterThumb(item) + '" alt="" style="width:40px;height:40px;border-radius:6px;flex:none" />' +
        '<div style="min-width:0">' +
          '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-weight:500;font-size:13.5px;color:var(--ink);line-height:1.35">' + esc(item.title) + catalogBadge(item) + '</div>' +
          (variant ? '<div class="muted" style="font-size:12px">' + esc(variant) + '</div>' : '') +
          disc +
        '</div>' +
      '</div>' +
      '<div class="muted" style="font-size:13px;text-align:right;white-space:nowrap;padding-top:2px">x ' + (item.qty || 1) + '</div>' +
      '<div style="display:flex;flex-direction:column;align-items:flex-end;text-align:right;font-variant-numeric:tabular-nums;font-size:13px;font-weight:500;color:var(--ink-body);line-height:1.35;white-space:nowrap">' +
        '<div>' + money(paid) + '</div>' +
        (discounts.length && compare > paid + 0.001 ? '<div class="muted" style="text-decoration:line-through">' + money(compare) + '</div>' : '') +
      '</div>' +
      subscriptionMeta(item) + subDiscounts +
    '</div>';
  }

  function checkoutItemsHtml(items) {
    const blocks = [];
    let i = 0;
    while (i < items.length) {
      if (items[i].bundle) {
        const name = items[i].bundle;
        const group = [];
        while (i < items.length && items[i].bundle === name) { group.push(items[i]); i++; }
        blocks.push(checkoutBundleHtml(name, group));
      } else {
        blocks.push('<div style="border:1px solid var(--hair);border-radius:10px;padding:0 16px">' + checkoutItemRow(items[i]) + '</div>');
        i++;
      }
    }
    return blocks.join('<div style="height:12px"></div>');
  }

  function checkoutBundleHtml(name, group) {
    const paid = group.reduce((sum, item) => sum + linePaid(item), 0);
    const compare = group.reduce((sum, item) => sum + lineCompare(item), 0);
    const subItem = group.find((item) => item.subLine && item.subscription);
    const meta = (group.find((item) => item.bundleMeta) || {}).bundleMeta || {};
    const discountLines = [];
    if (meta.bundleDiscount) discountLines.push(meta.bundleDiscount);
    if (meta.subscriptionLabel) discountLines.push(meta.subscriptionLabel);
    const displayDiscount = (txt) => {
      const text = String(txt || '');
      if (/^Delivery every /i.test(text)) {
        const amount = text.match(/\([^)]*\)\s*$/);
        return 'Subscription discount' + (amount ? ' ' + amount[0] : '');
      }
      return text;
    };
    const seen = {};
    const discountHtml = discountLines.filter((txt) => {
      if (seen[txt]) return false;
      seen[txt] = true;
      return true;
    }).map((txt) =>
      '<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-muted);line-height:1.45"><span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:none">' + I.tag + '</span><span>' + esc(displayDiscount(txt)) + '</span></span>').join('');
    const sub = subItem && subItem.subscription;
    const delivery = sub && sub.deliveryLabel ? String(sub.deliveryLabel).replace(/\s*\([^)]*\)\s*$/, '') : '';
    const contract = sub && sub.id
      ? '<span aria-hidden="true" class="muted">&middot;</span><a href="#/subscriptions/contracts/' + encodeURIComponent(sub.id) + '" style="color:var(--brand);font-weight:500;text-decoration:none">' + esc(sub.id) + '</a>'
      : '';
    const subHtml = sub
      ? '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:0 14px 10px;font-size:12px;color:var(--ink-body);line-height:1.45">' +
        '<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:var(--brand-50);color:var(--brand);flex:none">' + I.recurring + '</span>' +
        '<span style="font-weight:600;color:var(--ink)">Subscription</span><span aria-hidden="true" class="muted">&middot;</span>' +
        '<span>' + esc(delivery || 'Delivery schedule') + '</span>' + contract +
      '</div>' : '';
    const rows = group.map((item, index) =>
      '<div style="display:grid;grid-template-columns:minmax(0,1fr) 44px;gap:12px;align-items:start;padding:12px 14px' + (index ? ';border-top:1px solid var(--hair)' : '') + '">' +
        '<div class="flex items-start gap-3" style="min-width:0">' +
          '<img src="' + letterThumb(item) + '" alt="" style="width:40px;height:40px;border-radius:6px;flex:none" />' +
          '<div style="min-width:0"><div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;line-height:1.35">' +
            (item.gift
              ? '<span style="display:inline-flex;align-items:center;font-size:10.5px;font-weight:600;color:#16794a;background:#e8f7ee;border-radius:3px;padding:3px 6px">Free</span>'
              : '<span style="display:inline-flex;align-items:center;font-size:10.5px;font-weight:600;color:#9a6400;background:#fff4de;border-radius:3px;padding:3px 6px">Included</span>') +
            '<span style="font-weight:500;font-size:13px;color:var(--ink)">' + esc(item.title) + '</span>' + catalogBadge(item) + '</div>' +
            '<div class="muted" style="font-size:12px;margin-top:3px">' + esc(String(item.variant || item.sku || '').replace(/\s*,\s*/g, ' / ')) + '</div></div>' +
        '</div>' +
        '<div class="muted" style="font-size:13px;text-align:right;padding-top:4px;white-space:nowrap">x ' + (item.qty || 1) + '</div>' +
      '</div>').join('');
    return '<div style="border:1px solid var(--hair);border-radius:8px;overflow:hidden;background:#fff">' +
      '<div style="display:grid;grid-template-columns:minmax(0,1fr) 104px;gap:14px;align-items:start;padding:14px">' +
        '<div style="display:flex;align-items:center;gap:9px;min-width:0"><span style="display:inline-flex;align-items:center;font-size:11px;font-weight:600;color:#9a6400;background:#fff4de;border-radius:3px;padding:4px 7px;flex:none">Bundle</span><span style="font-weight:500;font-size:13.5px;color:var(--ink)">' + esc(name) + '</span></div>' +
        '<div style="display:flex;align-items:center;justify-content:flex-end;gap:6px;white-space:nowrap">' +
          (compare > paid + 0.001 ? '<span class="muted" style="font-size:12px;text-decoration:line-through">' + money(compare) + '</span>' : '') +
          '<span style="font-weight:600;font-size:13.5px;color:var(--ink)">' + money(paid) + '</span>' +
        '</div>' +
      '</div>' +
      subHtml +
      (discountHtml ? '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:0 14px 10px">' + discountHtml + '</div>' : '') +
      '<div style="border-top:1px solid var(--hair)">' + rows + '</div>' +
    '</div>';
  }

  function checkoutAmountHtml(row, amounts) {
    const line = (label, value, opts) => {
      opts = opts || {};
      return '<div class="flex items-center justify-between" style="padding:7px 0;' + (opts.border ? 'border-top:1px solid var(--hair);margin-top:2px;padding-top:12px;' : '') + '">' +
        '<div style="' + (opts.sub ? 'font-size:12px;color:#8B8B8B;display:flex;align-items:center;gap:6px' : 'font-size:13.5px;color:var(--ink-body)') + (opts.bold ? ';font-weight:700;color:var(--ink)' : '') + '">' +
          (opts.sub ? '<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:none">' + I.tag + '</span><span>' + label + '</span>' : label) +
        '</div>' +
        '<div style="' + (opts.sub ? 'font-size:12px;color:#8B8B8B' : 'font-size:13.5px;font-weight:500;color:var(--ink)') + (opts.bold ? ';font-weight:700' : '') + '">' + value + '</div>' +
      '</div>';
    };
    const countLabel = amounts.count + ' items';
    let body = line('Subtotal <span class="muted" style="margin-left:6px">· ' + countLabel + '</span>', money(amounts.subtotal));
    if (amounts.orderDiscounts.length) {
      body += line('Order Discount', '');
      amounts.orderDiscounts.forEach((discount) => { body += line(esc(discount.name), '-' + money(discount.amount), { sub: true }); });
    }
    const shipDiscountTotal = amounts.shipDiscountTotal;
    if (amounts.shipDiscounts.length && amounts.shipping > 0) {
      const remaining = Math.max(0, amounts.shipping - shipDiscountTotal);
      body += line('Shipping', '<span class="muted" style="text-decoration:line-through;margin-right:6px">' + money(amounts.shipping) + '</span><span>' + (remaining === 0 ? 'FREE' : money(remaining)) + '</span>');
      amounts.shipDiscounts.forEach((discount) => { body += line(esc(discount.name || 'Shipping Discount'), '-' + money(discount.amount), { sub: true }); });
    } else {
      body += line('Shipping', amounts.shipping > 0 ? money(amounts.shipping) : 'FREE');
    }
    body += line('Total', money(amounts.total), { border: true, bold: true });
    if (Number(row.total_savings || 0) > 0) body += line('TOTAL SAVINGS ' + money(row.total_savings), '', { sub: true });
    body += line('To be paid by customer', money(amounts.total));
    return '<div class="panel card-pad mb-4"><div class="card-title" style="margin-bottom:4px">Amount</div>' + body + '</div>';
  }

  function checkoutAmounts(row) {
    const items = row.items || [];
    const subtotal = row.subtotal != null ? Number(row.subtotal) : items.reduce((sum, item) => sum + (item.product_price != null ? Number(item.product_price) : Number(item.price || 0) * Number(item.qty || 1)), 0);
    const orderDiscounts = row.order_discounts || (Number(row.discount_amount || 0) > 0 ? [{ name: row.discount_code || 'Discount', amount: row.discount_amount }] : []);
    const discount = orderDiscounts.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const shipping = Number(row.shipping_amount != null ? row.shipping_amount : (row.shipping_fee || 0));
    const shipDiscounts = row.shipping_discounts || [];
    const shipDiscountTotal = shipDiscounts.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const count = row.total_num != null ? Number(row.total_num) : items.reduce((sum, item) => sum + Number(item.qty || 1), 0);
    const total = row.total != null ? Number(row.total) : Math.max(0, subtotal - discount + Math.max(0, shipping - shipDiscountTotal));
    return { subtotal, discount, orderDiscounts, shipping, shipDiscounts, shipDiscountTotal, count, total };
  }

  function descRow(label, val) {
    return '<div style="display:flex;padding:6px 0"><div class="muted" style="width:120px;flex:none;font-size:13px">' + label + '</div>' +
      '<div class="subtle" style="font-size:13px;min-width:0;word-break:break-word">' + (val || '--') + '</div></div>';
  }

  function addressParts(row) {
    const ship = row.shipping_address || {};
    const customer = row.customer || {};
    const name = String(ship.name || customer.name || '').trim();
    const bits = name.split(/\s+/).filter(Boolean);
    const line2 = String(ship.line2 || '').trim();
    const us = line2.match(/^(.*)\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
    const uk = line2.match(/^(.*)\s+([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})$/i);
    return {
      first: ship.first_name || bits[0] || '',
      last: ship.last_name || bits.slice(1).join(' '),
      address: ship.line1 || ship.detail || '',
      apartment: ship.detail2 || (us || uk ? '' : line2),
      city: ship.city || (us ? us[1] : uk ? uk[1] : ''),
      state: ship.province || (us ? us[2] : ''),
      zip: ship.post_code || (us ? us[3] : uk ? uk[2].toUpperCase() : ''),
      country: ship.country || row.region || '',
      phone: String(customer.phone || ship.phone || '').trim(),
      email: String(customer.email || ship.email || '').trim(),
    };
  }

  function shippingAddressCard(row) {
    const ship = row.shipping_address;
    if (!ship || !String(ship.line1 || ship.detail || '').trim()) {
      return '<div class="panel card-pad mb-4"><div class="card-title" style="margin-bottom:4px">Shipping address</div><div class="muted" style="font-size:13px">No shipping address</div></div>';
    }
    const a = addressParts(row);
    const grid =
      '<div class="grid grid-cols-2" style="gap:0 16px">' +
        descRow('First name', esc(a.first)) + descRow('Last name', esc(a.last)) +
        descRow('Address', esc(a.address)) + descRow('Apartment', esc(a.apartment)) +
        descRow('City', esc(a.city)) + descRow('State', esc(a.state)) +
        descRow('ZIP code', esc(a.zip)) + descRow('Country', esc(a.country)) +
        descRow('Phone', esc(a.phone)) + descRow('Email', esc(a.email)) +
      '</div>';
    return '<div class="panel card-pad mb-4"><div class="card-title" style="margin-bottom:4px">Shipping address</div>' + grid + '</div>';
  }

  const CUSTOMER_IDS = {
    'casey@example.com': '91055',
    'nora@example.com': '91057',
    'evan@example.com': '91058',
    'priya@example.com': '91059',
    'sam@example.com': '91060',
    'harper@example.com': '91063',
    'maya@example.com': '91061',
    'riley@example.com': '91062',
    'avery@example.com': '91039',
    'jordan@example.com': '91022',
  };

  function customerCard(row) {
    const customer = row.customer || {};
    const name = String(customer.name || '').trim() || 'Guest';
    const email = String(customer.email || '').trim();
    const phone = String(customer.phone || '').trim();
    const customerId = customer.uid || CUSTOMER_IDS[email.toLowerCase()] || '';
    const contactRows = [
      email ? '<div class="flex items-center gap-2" style="min-width:0;color:var(--ink-muted)">' + I.mail + '<span class="subtle" style="font-size:13px;line-height:1.45;overflow-wrap:anywhere">' + esc(email) + '</span></div>' : '',
      phone ? '<div class="flex items-center gap-2" style="min-width:0;color:var(--ink-muted)">' + I.phone + '<span class="subtle" style="font-size:13px;line-height:1.45">' + esc(phone) + '</span></div>' : '',
    ].filter(Boolean).join('');
    return '<div class="panel card-pad mb-4">' +
      '<div class="card-title" style="margin-bottom:10px">Customer</div>' +
      '<div style="min-width:0">' +
        '<div style="font-size:14px;font-weight:600;color:var(--ink);line-height:1.4">' + esc(name) + '</div>' +
        (contactRows ? '<div style="display:flex;flex-direction:column;gap:7px;margin-top:10px">' + contactRows + '</div>' : '') +
      '</div>' +
      (customerId ? '<div class="flex items-center justify-between gap-3" style="margin-top:14px;padding-top:10px;border-top:1px solid var(--hair);font-size:13px"><span class="muted">Customer ID</span><span class="subtle" style="font-variant-numeric:tabular-nums">' + esc(customerId) + '</span></div>' : '') +
    '</div>';
  }

  function detailBanner(kind, title, body) {
    const bg = kind === 'ok' ? '#e8f7f0' : '#e6f0ff';
    const border = kind === 'ok' ? '#cce6dd' : '#cfe1ff';
    const color = kind === 'ok' ? '#146c43' : '#1e3a8a';
    return '<div style="background:' + bg + ';border:1px solid ' + border + ';color:' + color + ';border-radius:8px;padding:12px 14px;margin-bottom:12px;font-size:13px;line-height:1.5">' +
      '<div style="font-weight:650">' + title + '</div>' +
      (body ? '<div style="margin-top:4px">' + body + '</div>' : '') +
    '</div>';
  }

  function stampNow() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function renderDetail(id) {
    const row = byId(id);
    if (!row) {
      root.innerHTML = '<div class="view-wrap"><div class="placeholder">Abandoned checkout not found.</div><button class="btn btn-default mt-3" data-back>Back</button></div>';
      root.querySelector('[data-back]').onclick = () => { location.hash = '#/abandoned-checkouts'; };
      return;
    }
    const recovered = row.abandon_status === 'recovered';
    const sent = emailKey(row) === 'sent';
    const scheduled = emailKey(row) === 'scheduled';
    const canceled = row.recovery_email_canceled || null;
    const recoveryHref = row.recovery_url ? new URL(row.recovery_url, location.href).href : '';
    const amounts = checkoutAmounts(row);
    const items = checkoutItemsHtml(row.items || []);
    const amountsHtml = checkoutAmountHtml(row, amounts);
    const timeline = (row.timeline || []).map((ev, i, arr) =>
      '<div class="cl-item">' +
        '<div class="cl-rail"><div class="cl-dot"></div>' + (i < arr.length - 1 ? '<div class="cl-line"></div>' : '') + '</div>' +
        '<div class="cl-body" style="padding-bottom:' + (i < arr.length - 1 ? '14px' : '0') + '">' +
          '<div class="flex items-center justify-between gap-3">' +
            '<span class="subtle" style="font-size:13px">' + esc(ev.text || ev.label || '--') +
              (ev.actor ? '<span class="i18n-skip"> · ' + esc(ev.actor) + '</span>' : '') +
            '</span>' +
            '<span class="muted" style="font-size:12px;white-space:nowrap">' + esc(ev.time || '--') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>'
    ).join('');
    const banners = [];
    if (recovered && paidOrders(row).length > 1) {
      const lines = paidOrders(row).map((order) =>
        '<div style="margin-top:6px"><a href="#/orders/' + esc(order.order_id) + '" data-order style="color:inherit;font-weight:650;text-decoration:underline">' + esc(order.order_sn) + '</a>' +
        '<span> · ' + esc(order.customer) + ' · ' + esc(order.paid_at) + ' · ' + money(order.total) + '</span></div>'
      ).join('');
      banners.push(detailBanner('ok', 'Abandoned checkout recovered', lines));
    } else if (recovered && row.order_id) {
      banners.push(detailBanner('ok', 'Abandoned checkout recovered', '<a href="#/orders/' + esc(row.order_id) + '" data-order style="color:inherit;font-weight:650;text-decoration:underline">You can view the order</a>'));
    }
    if (sent && recoveryHref) {
      banners.push(detailBanner('ok', 'Cart recovery email sent',
        '<div>A reminder email was sent to the customer at ' + esc(row.last_recovery_sent_at || '') + '.</div>' +
        '<div style="margin-top:6px;word-break:break-all"><a href="' + esc(recoveryHref) + '" target="_blank" rel="noreferrer" style="color:inherit;text-decoration:underline">' + esc(publicRecoveryUrl(row)) + '</a></div>'));
    } else if (scheduled) {
      banners.push(detailBanner('info', 'Cart recovery email scheduled',
        '<div>A reminder email will be sent to the customer at ' + esc(row.recovery_email_scheduled_at || '') + '.</div>' +
        (recoveryHref ? '<div style="margin-top:6px;word-break:break-all"><a href="' + esc(recoveryHref) + '" target="_blank" rel="noreferrer" style="color:inherit;text-decoration:underline">' + esc(publicRecoveryUrl(row)) + '</a></div>' : '') +
        '<button class="btn btn-default" data-cancel-email style="margin-top:10px">Cancel email</button>'));
    } else if (canceled) {
      banners.push(detailBanner('info', 'Cart recovery email canceled',
        esc(canceled.by) + ' canceled this email on ' + esc(canceled.at) + '. It will not be sent.'));
    } else if (row.not_sent_reason === 'email_off') {
      banners.push(detailBanner('info', 'Cart recovery email not sent',
        'The abandoned checkout email is turned off.'));
    } else if (row.not_sent_reason === 'unavailable') {
      banners.push(detailBanner('info', 'Cart recovery email not sent',
        'The items in this checkout are no longer available.'));
    } else if (row.not_sent_reason === 'send_failed') {
      banners.push(detailBanner('info', 'Cart recovery email not sent',
        'Recovery email failed to send.'));
    } else if (row.not_sent_reason === 'newer_scheduled') {
      banners.push(detailBanner('info', 'Cart recovery email not sent',
        'A newer abandoned checkout for this email is already scheduled.'));
    } else if (recovered) {
      banners.push(detailBanner('info', 'Cart recovery email not sent',
        '<div>A checkout was completed before the email was sent.</div>'));
    }
    root.innerHTML =
      '<div class="detail-wrap">' +
        '<div class="flex items-center justify-between mb-4" style="gap:12px">' +
          '<div class="flex items-center gap-3" style="min-width:0">' +
            '<button class="back-btn" data-back title="Back">' + I.arrowLeft + '</button>' +
            '<div style="min-width:0">' +
              '<div class="flex items-center gap-2" style="flex-wrap:wrap">' +
                '<span class="page-title">' + esc(row.checkout_sn) + '</span>' +
                statusPill(recoveryStatus(row)) + statusPill(emailStatus(row)) +
              '</div>' +
              '<p class="muted" style="font-size:13px;margin-top:4px">' + esc([row.region, row.create_time].filter(Boolean).join(', ')) + '</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        banners.join('') +
        '<div class="detail-cols">' +
          '<div class="detail-main">' +
            '<div class="panel card-pad mb-4">' +
              '<div class="flex items-center justify-between mb-3">' +
                '<div class="card-title">Checkout details</div>' +
              '</div>' +
              items +
            '</div>' +
            amountsHtml +
            shippingAddressCard(row) +
            '<div class="panel card-pad mb-4">' +
              '<div class="card-title mb-3">Timeline</div>' +
              (timeline || '<div class="muted" style="font-size:13px">No data</div>') +
            '</div>' +
          '</div>' +
          '<div class="detail-rail">' +
            '<div class="panel card-pad mb-4">' +
              '<div class="flex items-center justify-between mb-3">' +
                '<div class="card-title">Notes</div>' +
                '<button class="back-btn" data-edit-note title="Edit" style="width:28px;height:28px;background:transparent">' + I.pencil + '</button>' +
              '</div>' +
              '<div class="subtle" style="font-size:13px;white-space:pre-wrap">' + (row.note ? esc(row.note) : '<span class="muted">No notes</span>') + '</div>' +
            '</div>' +
            customerCard(row) +
          '</div>' +
        '</div>' +
      '</div>';

    root.querySelector('[data-back]').onclick = () => { location.hash = '#/abandoned-checkouts'; };
    const cancelEmail = root.querySelector('[data-cancel-email]');
    if (cancelEmail) cancelEmail.onclick = () => {
      const at = stampNow();
      row.recovery_email_scheduled_at = null;
      row.recovery_email_canceled = { at: at, by: 'Mia Chen' };
      row.timeline = [{ time: at, text: 'Recovery email canceled', actor: 'Mia Chen' }].concat(row.timeline || []);
      toast('Recovery email canceled');
      renderDetail(row.id);
    };
    const editNote = root.querySelector('[data-edit-note]');
    if (editNote) editNote.onclick = () => openEditNoteModal(row);
    if (window.I18N) window.I18N.apply(root);
  }

  function modal(opts) {
    const backdrop = h('<div class="modal-backdrop"></div>');
    const box = h('<div class="modal"></div>');
    if (opts.width) box.style.width = opts.width + 'px';
    box.style.maxWidth = 'calc(100vw - 32px)';
    box.innerHTML =
      '<div class="modal-head flex items-center justify-between"><span>' + opts.title + '</span>' +
        '<span class="drawer-x" data-x>' + I.x + '</span></div>' +
      '<div class="modal-body">' + opts.body + '</div>' +
      '<div class="modal-foot"><button class="btn btn-default" data-cancel>Cancel</button>' +
        '<button class="btn btn-primary" data-ok>' + (opts.okText || 'Save') + '</button></div>';
    backdrop.appendChild(box);
    document.body.appendChild(backdrop);
    const close = () => backdrop.remove();
    box.querySelector('[data-x]').onclick = close;
    box.querySelector('[data-cancel]').onclick = close;
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
    box.querySelector('[data-ok]').onclick = () => opts.onOk(box, close);
    if (window.I18N) window.I18N.apply(backdrop);
    return { m: box, close };
  }

  function openEditNoteModal(row) {
    const MAX = 5000;
    const body =
      '<div><textarea class="input" id="n-note" placeholder="Enter note" maxlength="' + MAX + '" style="height:auto;min-height:112px;padding:8px 12px;resize:vertical">' + esc(row.note || '') + '</textarea></div>' +
      '<div class="flex items-center justify-between" style="margin-top:6px">' +
        '<span id="n-err" style="color:var(--err);font-size:12px"></span>' +
        '<span class="muted" id="n-count" style="font-size:12px">' + String(row.note || '').length + '/' + MAX + '</span>' +
      '</div>';
    const ctrl = modal({
      title: 'Edit note', width: 620, okText: 'Save',
      body,
      onOk: (box, close) => {
        const note = box.querySelector('#n-note');
        const value = note.value;
        if (!value.trim()) {
          note.classList.add('has-error');
          box.querySelector('#n-err').textContent = "Can't be blank";
          return;
        }
        row.note = value;
        row.timeline = [{
          time: stampNow(),
          text: 'Note updated',
          actor: 'Mia Chen'
        }].concat(row.timeline || []);
        close();
        toast('Updated');
        renderDetail(row.id);
      },
    });
    const ta = ctrl.m.querySelector('#n-note');
    const cnt = ctrl.m.querySelector('#n-count');
    ta.oninput = () => {
      cnt.textContent = ta.value.length + '/' + MAX;
      ta.classList.remove('has-error');
      ctrl.m.querySelector('#n-err').textContent = '';
    };
  }

  function route(rest) {
    const id = (rest || '').split('/')[0];
    if (id) renderDetail(id);
    else renderList();
  }

  window.VIEWS = window.VIEWS || {};
  window.VIEWS['abandoned-checkouts'] = { render: function (el, rest) { root = el; route(rest || ''); } };
})();
