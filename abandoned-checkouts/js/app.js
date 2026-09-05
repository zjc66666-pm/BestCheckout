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
    mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/>', 16),
  };

  const toast = (msg) => {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#242833;color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;z-index:90;box-shadow:var(--float-shadow)';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1900);
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

  const LST = { tab: 'open', kwType: 'checkout_sn', kw: '', kwApplied: '', page: 1, size: 20 };

  function matchesTab(row, tab) {
    if (!hasContact(row)) return false;
    if (tab === 'open') return row.abandon_status === 'abandoned';
    if (tab === 'recoverable') return isRecoverable(row);
    if (tab === 'recovered') return row.abandon_status === 'recovered';
    if (tab === 'expired') return row.abandon_status === 'expired';
    return true;
  }

  function filtered() {
    let rows = D.CHECKOUTS.filter((row) => matchesTab(row, LST.tab));
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

  function tabCount(key) {
    return D.CHECKOUTS.filter((row) => matchesTab(row, key)).length;
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
    const tabsHtml = D.TABS.map((t) =>
      '<div class="tab' + (t.key === LST.tab ? ' active' : '') + '" data-tab="' + t.key + '">' + esc(t.label) +
      '<span class="count-badge">' + tabCount(t.key) + '</span></div>').join('');
    const extraHead = D.product === 'bestcheckout' ? '<th>Purchase flow</th>' : '';
    const colSpan = D.product === 'bestcheckout' ? 10 : 9;

    root.innerHTML =
      '<div class="mb-4"><h1 class="page-title">Abandoned checkouts</h1>' +
        '<p class="muted" style="margin-top:6px;font-size:13px;max-width:720px">' + (D.product === 'bestcheckout'
          ? 'A Hosted Checkout becomes abandoned only after the buyer leaves an email or phone number, then stays unpaid for ' + D.settings.abandonThresholdMinutes + ' minutes. No-contact unpaid orders never appear here. They are not written to Shopify. Recovery emails need an email and marketing consent.'
          : 'A checkout becomes abandoned only after the buyer leaves an email or phone number, then stays unpaid for ' + D.settings.abandonThresholdMinutes + ' minutes. No-contact unpaid orders never appear here. Recovery emails need an email and marketing consent.') + '</p></div>' +
      '<div class="panel">' +
        '<div class="tabs" style="padding:0 8px" id="ac-tabs">' + tabsHtml + '</div>' +
        '<div class="card-pad" style="padding-bottom:8px">' +
          '<div class="flex items-center" style="min-width:428px;max-width:560px">' +
            '<select class="filter-select" id="ac-kw-type" style="width:160px;border-top-right-radius:0;border-bottom-right-radius:0">' + kwOpts + '</select>' +
            '<div style="position:relative;flex:1">' +
              '<input class="filter-input" id="ac-kw" placeholder="Search" value="' + esc(LST.kw) + '" style="width:100%;padding-right:36px;border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px" />' +
              '<span class="filter-ico">' + I.search + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="overflow-x:auto"><table class="tbl" style="min-width:1180px"><thead><tr>' +
          '<th>Checkout</th><th>Customer</th><th>Contact</th><th>Items</th><th>Total</th><th>Last step</th>' + extraHead +
          '<th>Abandoned</th><th>Recovery</th><th style="text-align:center">Action</th>' +
        '</tr></thead><tbody>' +
        (pageRows.length ? pageRows.map(rowHtml).join('') : '<tr><td colspan="' + colSpan + '" style="text-align:center;padding:40px" class="muted">No abandoned checkouts match these filters.</td></tr>') +
        '</tbody></table></div>' +
        '<div class="flex items-center justify-between card-pad"><span class="muted" style="font-size:13px">Total ' + rows.length + ' records</span></div>' +
      '</div>';
    wireList();
  }

  function rowHtml(row) {
    const extra = D.product === 'bestcheckout'
      ? '<td>' + esc(row.funnel_name || '--') + '<div class="muted" style="font-size:12px">' + esc(row.checkout_page || '') + '</div></td>'
      : '';
    return '<tr data-id="' + esc(row.id) + '">' +
      '<td style="font-weight:600;color:var(--brand)">' + esc(row.checkout_sn) + '<div class="muted" style="font-size:12px;font-weight:400">Order ' + esc(row.order_sn) + '</div></td>' +
      '<td>' + esc(row.customer.name || 'Guest') + '</td>' +
      '<td>' + contactCell(row) + '</td>' +
      '<td style="max-width:240px">' + esc(itemSummary(row)) + '</td>' +
      '<td style="font-weight:600">' + money(row.total) + '</td>' +
      '<td>' + esc(STEP[row.last_step] || row.last_step) + '</td>' + extra +
      '<td class="muted">' + esc(row.abandoned_at || '--') + '</td>' +
      '<td>' + pill(STATUS, row.abandon_status) + '<div class="muted" style="font-size:12px;margin-top:4px">' + esc(recoveryLabel(row)) + '</div></td>' +
      '<td style="text-align:center"><button class="back-btn" data-view="' + esc(row.id) + '" title="Detail" style="width:30px;height:30px">' + I.eye + '</button></td>' +
    '</tr>';
  }

  function wireList() {
    root.querySelectorAll('#ac-tabs .tab').forEach((t) => t.onclick = () => { LST.tab = t.getAttribute('data-tab'); LST.page = 1; renderList(); });
    const type = root.querySelector('#ac-kw-type');
    const input = root.querySelector('#ac-kw');
    if (type) type.onchange = () => { LST.kwType = type.value; };
    if (input) {
      input.oninput = () => { LST.kw = input.value; };
      const commit = () => { LST.kwApplied = (LST.kw || '').trim(); LST.page = 1; renderList(); };
      input.onkeydown = (e) => { if (e.key === 'Enter') commit(); };
      input.onblur = commit;
    }
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

  function renderDetail(id) {
    const row = byId(id);
    if (!row) {
      root.innerHTML = '<div class="view-wrap"><div class="placeholder">Abandoned checkout not found.</div><button class="btn btn-default mt-3" data-back>Back</button></div>';
      root.querySelector('[data-back]').onclick = () => { location.hash = '#/abandoned-checkouts'; };
      return;
    }
    const send = canSendEmail(row);
    const linkDisabled = !row.recovery_url || row.abandon_status === 'expired';
    const extraFacts = D.product === 'bestcheckout'
      ? '<div><dt>Purchase flow</dt><dd>' + esc(row.funnel_name || '--') + '</dd></div><div><dt>Checkout page</dt><dd>' + esc(row.checkout_page || '--') + '</dd></div>'
      : '';
    const items = row.items.map((item) =>
      '<div class="flex items-center justify-between" style="padding:10px 0;border-bottom:1px solid var(--hair)"><span>' + esc(item.title) + ' ×' + item.qty + '</span><strong>' + money(item.price) + '</strong></div>'
    ).join('');
    const timeline = row.timeline.map((ev) =>
      '<li style="display:flex;gap:12px;padding:8px 0"><time class="muted" style="width:150px;flex:none;font-size:12px">' + esc(ev.time) + '</time><span style="font-size:13px">' + esc(ev.text) + '</span></li>'
    ).join('');

    root.innerHTML =
      '<div class="mb-4 flex items-center gap-3"><button class="back-btn" data-back title="Back">' + I.arrowLeft + '</button>' +
        '<div><h1 class="page-title">Abandoned checkout ' + esc(row.checkout_sn) + '</h1>' +
        '<p class="muted" style="font-size:13px;margin-top:4px">Unpaid order ' + esc(row.order_sn) + ' · ' + esc(STEP[row.last_step] || row.last_step) + '</p></div>' +
        pill(STATUS, row.abandon_status) + '</div>' +
      '<div class="flex gap-4" style="align-items:flex-start;flex-wrap:wrap">' +
        '<div class="panel card-pad" style="flex:1;min-width:320px">' +
          '<div class="text-sm" style="font-weight:600;margin-bottom:12px">Checkout summary</div>' +
          items +
          '<div class="flex items-center justify-between" style="padding-top:12px"><span>Total</span><strong>' + money(row.total) + '</strong></div>' +
        '</div>' +
        '<aside class="panel card-pad" style="width:360px;max-width:100%">' +
          '<div class="text-sm" style="font-weight:600;margin-bottom:12px">Recovery</div>' +
          '<dl class="muted" style="font-size:13px;line-height:1.7;margin-bottom:14px">' +
            '<div><dt style="display:inline">Customer</dt> · <dd style="display:inline;color:var(--ink)">' + esc(row.customer.name || 'Guest') + '</dd></div>' +
            '<div><dt style="display:inline">Email</dt> · <dd style="display:inline;color:var(--ink)">' + esc(row.customer.email || 'None') + '</dd></div>' +
            '<div><dt style="display:inline">Phone</dt> · <dd style="display:inline;color:var(--ink)">' + esc(row.customer.phone || 'None') + '</dd></div>' +
            extraFacts +
            '<div><dt style="display:inline">Marketing</dt> · <dd style="display:inline;color:var(--ink)">' + esc(row.marketing_status) + '</dd></div>' +
            '<div><dt style="display:inline">Reminders sent</dt> · <dd style="display:inline;color:var(--ink)">' + row.recovery_email_count + '</dd></div>' +
          '</dl>' +
          '<div class="flex flex-col gap-2">' +
            '<button class="btn btn-primary" data-send ' + (send.ok ? '' : 'disabled') + '>' + I.mail + '<span style="margin-left:6px">Send recovery email</span></button>' +
            '<div class="muted" style="font-size:12.5px;line-height:1.5" data-send-hint>' + esc(send.reason || 'Sends one reminder with a signed recovery link. This is a marketing email.') + '</div>' +
            '<button class="btn btn-default" data-copy ' + (linkDisabled ? 'disabled' : '') + '>' + I.copy + '<span style="margin-left:6px">Copy recovery link</span></button>' +
            '<button class="btn btn-default" data-open ' + (linkDisabled ? 'disabled' : '') + '><span>Open recovery page</span></button>' +
            (linkDisabled ? '<div class="muted" style="font-size:12.5px">This recovery link is no longer valid.</div>' : '') +
          '</div>' +
        '</aside>' +
      '</div>' +
      '<div class="panel card-pad mt-4"><div class="text-sm" style="font-weight:600;margin-bottom:8px">Timeline</div><ol style="margin:0;padding:0;list-style:none">' + timeline + '</ol></div>';

    root.querySelector('[data-back]').onclick = () => { location.hash = '#/abandoned-checkouts'; };
    const sendBtn = root.querySelector('[data-send]');
    if (sendBtn && send.ok) {
      sendBtn.onclick = () => {
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending…';
        setTimeout(() => {
          row.recovery_email_count = 1;
          row.last_recovery_sent_at = 'Just now';
          row.timeline.push({ time: 'Just now', text: 'Abandoned checkout reminder sent to ' + row.customer.email + '.' });
          toast('Recovery email sent');
          renderDetail(row.id);
        }, 600);
      };
    }
    const recoveryHref = !linkDisabled ? new URL(row.recovery_url, location.href).href : '';
    const copyBtn = root.querySelector('[data-copy]');
    if (copyBtn && !linkDisabled) {
      copyBtn.onclick = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(recoveryHref).then(() => toast('Recovery link copied')).catch(() => toast('Could not copy recovery link'));
        } else {
          toast('Could not copy recovery link');
        }
      };
    }
    const openBtn = root.querySelector('[data-open]');
    if (openBtn && !linkDisabled) {
      openBtn.onclick = () => { window.open(recoveryHref, '_blank', 'noopener'); };
    }
  }

  function route(rest) {
    const id = (rest || '').split('/')[0];
    if (id) renderDetail(id);
    else renderList();
  }

  window.VIEWS = window.VIEWS || {};
  window.VIEWS['abandoned-checkouts'] = { render: function (el, rest) { root = el; route(rest || ''); } };
})();
