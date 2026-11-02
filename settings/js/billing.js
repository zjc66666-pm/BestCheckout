/* BestCheckout merchant billing. Read-only rates, current-month estimate,
   invoices, card on file, and usage. VIP rates are assigned in the SaaS console. */
(function () {
  'use strict';

  var STANDARD = book('standard', 'Standard', 15000, [
    [100000000, 5000], [300000000, 4000], [500000000, 3250], [null, 2500]
  ], true, 20, 25);
  var FOLAST = book('folast-vip', 'Folast VIP', 7500, [
    [100000000, 4000], [300000000, 3000], [500000000, 2500], [null, 2000]
  ], true, 25, 20);

  var accounts = {
    'Plover Studio': profile('Plover Studio', 'hello@ploverstudio.com', '', '', '', STANDARD, false, null, false, 0, 0, 0, 0, 0, 1800000, 60, 4, []),
    'Bramble Market': profile('Bramble Market', 'hello@bramblemarket.com', 'Visa', '2614', '09/28', STANDARD, false, 2500000, false, 0, 0, 0, 0, 0, 420000, 16, 1, []),
    'Lavender Labs': profile('Lavender Labs', 'avery@lavenderlabs.com', '', '', '', STANDARD, false, 2500000, true, 30, 124000000, 4580, 620, 31, 48620000, 2190, 210, []),
    'Aura Living': profile('Aura Living', 'hello@auraliving.co', '', '', '', STANDARD, false, 2500000, false, 0, 0, 0, 0, 0, 680000, 24, 2, []),
    'Northline Goods': profile('Northline Goods', 'ops@northlinegoods.co', 'Visa', '5454', '08/28', STANDARD, false, 2500000, true, 30, 18000000, 920, 70, 31, 9200000, 410, 28, []),
    'Folast Studio': profile('Folast Studio', 'mia@folast-studio.com', 'Visa', '1881', '03/27', FOLAST, true, null, false, 0, 0, 0, 0, 0, 240000000, 7000, 1400, []),
    'Hey June': profile('Hey June', 'june@heyjune.co', '', '', '', STANDARD, false, 2500000, true, 30, 33800000, 2100, 900, 7, 4200000, 180, 22, []),
    'Kiln Coffee': profile('Kiln Coffee', 'hello@kilncoffee.co', 'Mastercard', '8888', '11/27', STANDARD, false, 2500000, true, 30, 22000000, 1100, 90, 0, 3500000, 140, 18, []),
    'Marlow Supply': profile('Marlow Supply', 'owen@marlowsupply.com', '', '', '', STANDARD, false, 2500000, true, 30, 8600000, 410, 18, 4, 1200000, 40, 4, []),
    'Linden Goods': profile('Linden Goods', 'billing@lindengoods.co', 'Visa', '4141', '06/28', STANDARD, false, 2500000, true, 30, 9600000, 480, 30, 31, 5400000, 240, 16, []),
    'Maple Goods': profile('Maple Goods', 'hello@maplegoods.co', '', '', '', STANDARD, false, 2500000, true, 30, 4000000, 160, 8, 31, 800000, 30, 2, [])
  };
  accounts['Hey June'].invoices[0].status = 'Past due';
  accounts['Hey June'].invoices[0].paidAt = '';
  accounts['Hey June'].billingStatus = 'Past due';
  accounts['Hey June'].checkoutFallback = true;
  accounts['Hey June'].fallbackOn = 'Oct 8, 2026';
  accounts['Kiln Coffee'].invoices[0].status = 'Past due';
  accounts['Kiln Coffee'].invoices[0].paidAt = '';
  accounts['Kiln Coffee'].billingStatus = 'Past due';
  accounts['Kiln Coffee'].checkoutFallback = true;
  accounts['Kiln Coffee'].fallbackOn = 'Oct 9, 2026';
  accounts['Lavender Labs'].brand = 'Visa';
  accounts['Lavender Labs'].last4 = '4242';
  accounts['Lavender Labs'].exp = '12/27';
  accounts['Northline Goods'].failures = ['Oct 27, 2026'];
  accounts['Northline Goods'].billingStatus = 'Charge failed';
  accounts['Lavender Labs'].invoices.push(invoiceFor(
    'Lavender Labs',
    '2026-10',
    '2026.10',
    STANDARD,
    1000000,
    0,
    0,
    [
      { label: 'Added charge', reason: 'Manual surcharge', amountCents: 3000 },
      { label: 'Credit', reason: 'Courtesy credit', amountCents: -5000 }
    ],
    'Charge failed',
    '',
    31,
    31,
    2500000,
    0
  ));
  accounts['Lavender Labs'].failures = ['Oct 27, 2026'];
  accounts['Lavender Labs'].billingStatus = 'Charge failed';
  accounts['Northline Goods'].invoices.push(invoiceFor(
    'Northline Goods',
    '2026-10',
    '2026.10',
    STANDARD,
    4000000,
    0,
    0,
    [],
    'Charge failed',
    '',
    31,
    31,
    2500000,
    0
  ));
  accounts['Lavender Labs'].declinedCardKey = 'Visa:4242';
  accounts['Northline Goods'].declinedCardKey = 'Visa:5454';
  accounts['Kiln Coffee'].declinedCardKey = 'Mastercard:8888';
  accounts['Marlow Supply'].billingStatus = 'Charge failed';
  accounts['Marlow Supply'].invoices.push(invoiceFor(
    'Marlow Supply',
    '2026-10',
    '2026.10',
    STANDARD,
    1200000,
    40,
    4,
    [],
    'Charge failed',
    '',
    4,
    31,
    2500000,
    0
  ));
  var invoicePage = { store: '', no: 1, size: 20 };
  var invoiceLogs = [];
  seedInvoiceLogs();
  var EYE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  function billSvg(d) {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  var ICO = {
    card: billSvg('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>'),
    mail: billSvg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    gift: billSvg('<rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M12 8v13M3 12h18"/><path d="M12 8c0-2.2-1.3-4-3.2-4S6 6.2 6 8M12 8c0-2.2 1.3-4 3.2-4S18 6.2 18 8"/>'),
    book: billSvg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
    file: billSvg('<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/><path d="M8 13h8M8 17h6"/>'),
    bars: billSvg('<path d="M4 19V10M10 19V5M16 19v-7M20 19H3"/>'),
    coin: billSvg('<circle cx="12" cy="12" r="9"/><path d="M16 10s-1.2-1.5-4-1.5S8 10.7 8 11.9c0 3.1 8 1.6 8 4.6 0 1.3-1.4 2.5-4 2.5S8 16.6 8 16.6"/><path d="M12 6.5v1.5M12 16v1.5"/>'),
    back: billSvg('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),
    copy: billSvg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>')
  };
  function billIco(name, extra) {
    return '<span class="bill-ico' + (extra ? ' ' + extra : '') + '" aria-hidden="true">' + (ICO[name] || '') + '</span>';
  }
  function billHead(name, title, extra) {
    return '<div class="bill-card-head">' + billIco(name, extra) + '<div class="card-title">' + title + '</div></div>';
  }

  function book(id, name, fee, tiers, declineOn, threshold, feeThousandths) {
    return {
      id: id,
      name: name,
      monthlyFeeCents: fee,
      tiers: tiers.map(function (tier) { return { upToCents: tier[0], ppm: tier[1] }; }),
      decline: { enabled: declineOn, thresholdPercent: threshold, feeThousandths: feeThousandths }
    };
  }
  function profile(name, email, brand, last4, exp, priceBook, custom, allowanceCents, allowanceUsed, sepDays, sepVolume, sepApprovals, sepDeclines, octDays, octVolume, octApprovals, octDeclines, adjustments) {
    var october = { volumeCents: octVolume, approvals: octApprovals, declines: octDeclines, billableDays: octDays, daysInMonth: 31, overflowCents: allowanceCents == null || !allowanceUsed ? 0 : octVolume };
    var invoices = [];
    if (sepDays) {
      invoices.push(invoiceFor(name, '2026-09', '2026.09', priceBook, sepVolume, sepApprovals, sepDeclines, adjustments, 'Paid', 'Oct 2, 2026', sepDays, 30, allowanceCents, 0));
    }
    return {
      name: name,
      email: email,
      brand: brand,
      last4: last4,
      exp: exp,
      priceBook: priceBook,
      custom: custom,
      allowanceCents: allowanceCents,
      allowanceUsed: allowanceUsed,
      billingStatus: allowanceCents == null ? 'Free' : 'Current',
      october: october,
      invoices: invoices,
      checkoutFallback: false,
      fallbackOn: '',
      failures: []
    };
  }
  function lightProfile(name) {
    var handle = String(name || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '');
    return profile(name, 'billing@' + (handle || 'store') + '.test', '', '', '', STANDARD, false, 1000000, false, 0, 0, 0, 0, 0, 420000, 16, 1, []);
  }
  var PATCH_KEY = 'bc-billing-patches-v2';
  try { sessionStorage.removeItem('bc-billing-patches'); } catch (err) {}
  function loadPatches() {
    try { return JSON.parse(sessionStorage.getItem(PATCH_KEY) || '{}') || {}; } catch (err) { return {}; }
  }
  function savePatch(account) {
    var all = loadPatches();
    all[account.name] = {
      email: account.email,
      brand: account.brand,
      last4: account.last4,
      exp: account.exp,
      billingStatus: account.billingStatus,
      failures: account.failures || [],
      checkoutFallback: account.checkoutFallback,
      extraLogs: account.extraLogs || [],
      invoices: account.invoices.map(function (item) {
        return { id: item.id, status: item.status, paidAt: item.paidAt };
      })
    };
    try { sessionStorage.setItem(PATCH_KEY, JSON.stringify(all)); } catch (err) {}
  }
  function applyPatch(account) {
    var patch = loadPatches()[account.name];
    if (!patch) return account;
    account.email = patch.email || account.email;
    account.brand = patch.brand || account.brand;
    account.last4 = patch.last4 || account.last4;
    account.exp = patch.exp || account.exp;
    if (patch.checkoutFallback === false) account.checkoutFallback = false;
    if (patch.billingStatus) account.billingStatus = patch.billingStatus;
    if (patch.failures) account.failures = patch.failures;
    if (patch.extraLogs) account.extraLogs = patch.extraLogs;
    (patch.invoices || []).forEach(function (saved) {
      var item = account.invoices.filter(function (invoice) { return invoice.id === saved.id; })[0];
      if (!item) return;
      item.status = saved.status;
      item.paidAt = saved.paidAt;
    });
    return account;
  }
  function accountFor(name) {
    if (!accounts[name]) accounts[name] = lightProfile(name);
    return applyPatch(accounts[name]);
  }
  function invoiceFor(name, monthKey, month, priceBook, volumeCents, approvals, declines, adjustments, status, paidAt, billableDays, daysInMonth, allowanceCents, coveredCents) {
    var shopIds = {
      'Lavender Labs': '63352940',
      'Northline Goods': '49102855',
      'Folast Studio': '71830452',
      'Hey June': '80219673',
      'Kiln Coffee': '55601822',
      'Marlow Supply': '52840176',
      'Plover Studio': '64021837',
      'Bramble Market': '27563914',
      'Linden Goods': '35081627',
      'Maple Goods': '38472019'
    };
    var code = shopIds[name] || 'store';
    var lines = chargeLines(priceBook, volumeCents, approvals, declines, adjustments, billableDays, daysInMonth);
    return {
      id: 'inv-' + monthKey + '-' + code,
      number: monthKey.replace('-', '') + '-' + code,
      month: month,
      monthKey: monthKey,
      status: status,
      paidAt: paidAt,
      volumeCents: volumeCents,
      coveredCents: coveredCents || 0,
      allowanceCents: allowanceCents === undefined ? 2500000 : allowanceCents,
      billableDays: billableDays || 0,
      daysInMonth: daysInMonth || 0,
      monthlyFeeCents: priceBook ? priceBook.monthlyFeeCents : 0,
      approvals: approvals,
      declines: declines,
      lines: lines,
      totalCents: sum(lines)
    };
  }
  function seedInvoiceLogs() {
    invoiceLogs = [];
    function add(at, actor, action, invoice, moneyCents, reason) {
      if (!invoice) return;
      invoiceLogs.push({
        at: at,
        actor: actor,
        action: action,
        invoiceId: invoice.id,
        moneyText: moneyCents == null ? '' : (invoice.number + ' · ' + money(moneyCents)),
        reason: reason || ''
      });
    }
    function inv(name, monthKey) {
      var account = accounts[name];
      if (!account) return null;
      return account.invoices.filter(function (item) { return item.monthKey === monthKey; })[0] || null;
    }
    var lavSep = inv('Lavender Labs', '2026-09');
    var lavOct = inv('Lavender Labs', '2026-10');
    var norSep = inv('Northline Goods', '2026-09');
    var norOct = inv('Northline Goods', '2026-10');
    var heySep = inv('Hey June', '2026-09');
    var kilnSep = inv('Kiln Coffee', '2026-09');
    add('2026-10-02 08:14', 'BestCheckout', 'Recorded payment', lavSep, lavSep && lavSep.totalCents, '');
    add('2026-10-01 11:20', 'BestCheckout', 'Emailed the owner', lavSep, null, 'Card declined');
    add('2026-10-01 00:12', 'BestCheckout', 'Emailed the owner', lavSep, null, 'No card on file');
    add('2026-10-01 00:05', 'BestCheckout', 'Issued invoice', lavSep, lavSep && lavSep.totalCents, '');
    add('2026-10-28 16:05', 'ops.amy', 'Added credit', lavOct, -5000, 'Courtesy credit');
    add('2026-10-28 14:10', 'ops.amy', 'Added charge', lavOct, 3000, 'Manual surcharge');
    add('2026-10-27 09:06', 'BestCheckout', 'Emailed the owner', lavOct, null, 'Card declined');
    add('2026-10-27 09:04', 'BestCheckout', 'Issued invoice', lavOct, lavOct && lavOct.totalCents, '');
    add('2026-10-02 08:14', 'BestCheckout', 'Recorded payment', norSep, norSep && norSep.totalCents, '');
    add('2026-10-01 00:05', 'BestCheckout', 'Issued invoice', norSep, norSep && norSep.totalCents, '');
    add('2026-10-27 09:10', 'BestCheckout', 'Emailed the owner', norOct, null, 'Card declined');
    add('2026-10-27 09:08', 'BestCheckout', 'Issued invoice', norOct, norOct && norOct.totalCents, '');
    var marSep = inv('Marlow Supply', '2026-09');
    var marOct = inv('Marlow Supply', '2026-10');
    add('2026-10-01 00:12', 'BestCheckout', 'Emailed the owner', heySep, null, 'No card on file');
    add('2026-10-01 00:05', 'BestCheckout', 'Issued invoice', heySep, heySep && heySep.totalCents, '');
    add('2026-10-03 09:00', 'BestCheckout', 'Charge retry failed', heySep, null, 'Status unchanged');
    add('2026-10-08 00:05', 'BestCheckout', 'Stopped intercepting', heySep, null, 'Invoice past due');
    add('2026-10-01 09:04', 'BestCheckout', 'Emailed the owner', kilnSep, null, 'Card declined');
    add('2026-10-01 00:05', 'BestCheckout', 'Issued invoice', kilnSep, kilnSep && kilnSep.totalCents, '');
    add('2026-10-04 09:00', 'BestCheckout', 'Charge retry failed', kilnSep, null, 'Status unchanged');
    add('2026-10-09 00:05', 'BestCheckout', 'Stopped intercepting', kilnSep, null, 'Invoice past due');
    add('2026-10-02 08:16', 'BestCheckout', 'Recorded payment', marSep, marSep && marSep.totalCents, '');
    add('2026-10-01 00:05', 'BestCheckout', 'Issued invoice', marSep, marSep && marSep.totalCents, '');
    add('2026-10-29 09:00', 'BestCheckout', 'Charge retry failed', marOct, null, 'Status unchanged');
    add('2026-10-27 09:02', 'BestCheckout', 'Emailed the owner', marOct, null, 'No card on file');
    add('2026-10-27 09:00', 'BestCheckout', 'Issued invoice', marOct, marOct && marOct.totalCents, '');
  }

  function money(cents) {
    var sign = cents < 0 ? '-' : '';
    var abs = Math.abs(Number(cents) || 0);
    return sign + '$' + (abs / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function moneyWhole(cents) {
    return '$' + (Math.abs(Number(cents) || 0) / 100).toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  function rateLabel(ppm) {
    return (Number(ppm) / 10000).toFixed(4).replace(/0+$/, '').replace(/\.$/, '') + '%';
  }
  function feeLabel(thousandths) {
    var text = (Number(thousandths) / 1000).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    var bits = text.split('.');
    if (bits.length === 1) text += '.00';
    else if (bits[1].length < 2) text += '0';
    return '$' + text;
  }
  function pct(rate) { return (rate * 100).toFixed(1) + '%'; }
  function sum(lines) {
    return lines.reduce(function (total, line) { return total + line.amountCents; }, 0);
  }
  function rateForVolume(volumeCents, tiers) {
    var list = tiers || [];
    var matched = null;
    for (var i = 0; i < list.length; i++) {
      matched = list[i];
      if (list[i].upToCents == null || volumeCents <= list[i].upToCents) break;
    }
    return matched;
  }
  function rateVolume(volumeCents, tiers) {
    var volume = Math.max(0, volumeCents || 0);
    if (!volume) return [];
    var tier = rateForVolume(volume, tiers);
    if (!tier) return [];
    return [{ volumeCents: volume, ppm: tier.ppm, feeCents: Math.round(volume * tier.ppm / 1000000) }];
  }
  function declineFee(approvals, declines, rule) {
    var attempts = (approvals || 0) + (declines || 0);
    var rate = attempts ? declines / attempts : 0;
    if (!rule || !rule.enabled || !attempts) return { attempts: attempts, rate: rate, excess: 0, feeCents: 0 };
    var allowed = Math.floor(attempts * rule.thresholdPercent / 100);
    var excess = Math.max(0, declines - allowed);
    return { attempts: attempts, rate: rate, excess: excess, feeCents: Math.round(excess * rule.feeThousandths / 10) };
  }
  function licenseCents(monthlyFeeCents, billableDays, daysInMonth) {
    if (!billableDays || !daysInMonth) return 0;
    return Math.round(monthlyFeeCents * billableDays / daysInMonth);
  }
  function chargeLines(priceBook, overflowCents, approvals, declines, adjustments, billableDays, daysInMonth) {
    var lines = [];
    var license = licenseCents(priceBook.monthlyFeeCents, billableDays, daysInMonth);
    if (license) {
      lines.push({ kind: 'License', label: 'Monthly license', detail: billableDays + ' of ' + daysInMonth + ' days', amountCents: license });
    }
    if (overflowCents > 0) {
      rateVolume(overflowCents, priceBook.tiers).forEach(function (band) {
        if (!band.volumeCents) return;
        lines.push({ kind: 'Commission', label: 'Volume commission', detail: rateLabel(band.ppm) + ' · ' + money(band.volumeCents), amountCents: band.feeCents });
      });
    }
    (adjustments || []).forEach(function (item) {
      lines.push({ kind: 'Adjustment', label: item.label, detail: item.reason, amountCents: item.amountCents });
    });
    return lines;
  }
  function allowanceLeft(account) {
    if (account.allowanceCents == null) return null;
    if (account.allowanceUsed) return 0;
    return Math.max(0, account.allowanceCents - (account.october.volumeCents || 0));
  }
  function allowanceUsedCents(account) {
    if (account.allowanceCents == null) return 0;
    var left = allowanceLeft(account);
    return Math.max(0, account.allowanceCents - (left || 0));
  }
  function estimate(account) {
    var book = account.priceBook;
    var month = account.october;
    var lines = chargeLines(book, month.overflowCents, month.approvals, month.declines, [], month.billableDays, month.daysInMonth);
    var decline = month.billableDays ? declineFee(month.approvals, month.declines, book.decline) : { rate: 0, excess: 0, feeCents: 0 };
    if (!month.billableDays) {
      var attempts = (month.approvals || 0) + (month.declines || 0);
      decline.rate = attempts ? month.declines / attempts : 0;
    }
    return { lines: lines, totalCents: sum(lines), decline: decline, commissionCents: lines.filter(function (line) { return line.kind === 'Commission'; }).reduce(function (total, line) { return total + line.amountCents; }, 0) };
  }
  function nextRate(volumeCents, tiers) {
    for (var i = 0; i < tiers.length; i++) {
      var cap = tiers[i].upToCents;
      if (cap != null && volumeCents < cap && tiers[i + 1]) {
        return 'The next rate, ' + rateLabel(tiers[i + 1].ppm) + ', starts after ' + moneyWhole(cap) + '.';
      }
    }
    return 'This month is in the top rate, ' + rateLabel(tiers[tiers.length - 1].ppm) + '.';
  }
  function tierList(book, esc) {
    var html = '';
    var previous = 0;
    book.tiers.forEach(function (tier) {
      var range;
      if (tier.upToCents == null) {
        range = '<span>Volume</span> &gt; <span class="i18n-skip">' + esc(moneyWhole(previous)) + '</span>';
      } else if (previous > 0) {
        range = '<span class="i18n-skip">' + esc(moneyWhole(previous)) + '</span> &lt; <span>Volume</span> ≤ <span class="i18n-skip">' + esc(moneyWhole(tier.upToCents)) + '</span>';
      } else {
        range = '<span>Volume</span> ≤ <span class="i18n-skip">' + esc(moneyWhole(tier.upToCents)) + '</span>';
      }
      html += '<div class="bill-fee-row"><span>' + range + '</span><span class="bill-fee-rate"><span>Rate: </span><strong class="i18n-skip">' + esc(rateLabel(tier.ppm)) + '</strong></span></div>';
      if (tier.upToCents != null) previous = tier.upToCents;
    });
    return html;
  }
  function displayStatus(account, item) {
    if (!item) return '';
    if (item.status === 'Paid') return 'Paid';
    if (item.status === 'Past due') return 'Past due';
    if (item.status === 'Charge failed' || ((account.failures || []).length && item.totalCents > 0)) return 'Charge failed';
    return item.status || 'Unpaid';
  }
  function pill(status) {
    var tone = status === 'Paid' || status === 'Current' ? 'green' : (status === 'Past due' || status === 'Charge failed' ? 'red' : 'gray');
    return '<span class="pill pill-' + tone + '">' + status + '</span>';
  }
  var CSS = ''
    + '.bill-banner{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 16px;padding:12px 14px;border-radius:10px;background:#fff0ee;color:#8d2f24;font-size:13px;line-height:1.5}'
    + '.bill-banner-copy{min-width:0;flex:1}'
    + '.bill-banner strong{display:block;margin-bottom:2px}'
    + '.bill-banner .bill-actions{margin-top:0;flex-shrink:0}'
    + '.bill-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}'
    + '.bill-section{margin-bottom:16px}'
    + '.bill-top-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);gap:16px;margin-bottom:16px;align-items:stretch}'
    + '.bill-top-grid .panel{margin:0;height:100%;box-sizing:border-box;display:flex;flex-direction:column}'
    + '.bill-top-grid .card-pad,.bill-top-grid .bill-ab-card{flex:1;display:flex;flex-direction:column;padding:18px 20px;box-sizing:border-box}'
    + '.bill-top-grid .bill-actions{margin-top:auto;padding-top:16px}'
    + '.bill-top-grid .bill-tone{background:#f7f9fc;border-color:#e4e8f0}'
    + '@media (max-width:1100px){.bill-top-grid{grid-template-columns:1fr}}'
    + '.bill-email-value{color:var(--ink);font-size:16px;font-weight:650;line-height:1.35;word-break:break-all}'
    + '.bill-rates-panel{padding:0;overflow:hidden}'
    + '.bill-card-head{display:flex;align-items:center;gap:10px}'
    + '.bill-ico{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;background:#eef3ff;color:var(--brand);flex:none}'
    + '.bill-ico.is-free{background:#edf8f2;color:#16875b}'
    + '.bill-ico svg{display:block}'
    + '.bill-panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 16px;border-bottom:1px solid var(--hair);background:#f5f7fb}'
    + '.bill-panel-head .bill-ico{width:32px;height:32px;border-radius:8px}'
    + '.bill-panel-head .card-title{margin:0}'
    + '.bill-ab-meta{display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin-top:8px;color:var(--ink-muted);font-size:12.5px}'
    + '.bill-ab-note{margin:0}'
    + '.bill-license-line{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--hair)}'
    + '.bill-license-line span{color:var(--ink-muted);font-size:13px}'
    + '.bill-license-line strong{font-size:16px;font-weight:650;color:var(--ink)}'
    + '.bill-fee-tree{padding:2px 16px 12px}'
    + '.bill-fee-head{border-bottom:0;padding:12px 0 2px}'
    + '.bill-fee-list{margin:0;padding:0}'
    + '.bill-fee-row{position:relative;display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:7px 0 7px 20px;font-size:13px;line-height:1.4}'
    + '.bill-fee-row::before{content:"";position:absolute;left:6px;top:0;bottom:0;width:1px;background:#d5dae3}'
    + '.bill-fee-row::after{content:"";position:absolute;left:6px;top:50%;width:12px;height:1px;background:#d5dae3}'
    + '.bill-fee-row:last-child::before{bottom:50%}'
    + '.bill-fee-row span{color:var(--ink-muted)}'
    + '.bill-fee-row .bill-fee-rate{flex:0 0 auto;white-space:nowrap}'
    + '.bill-fee-row strong{color:var(--ink);font-size:13.5px;font-weight:650}'
    + '.bill-ab-card{padding:18px 20px}'
    + '.bill-ab-card .bill-card-head{margin-bottom:10px}'
    + '.bill-ab-card .card-title{margin:0}'
    + '.bill-ab{display:flex;align-items:baseline;flex-wrap:wrap;gap:8px;color:var(--ink);font-size:28px;font-weight:700;letter-spacing:-.02em;line-height:1.15}'
    + '.bill-ab-sep{color:var(--ink-muted);font-weight:500}'
    + '.bill-table-wrap{overflow-x:auto}'
    + '.bill-rates-panel .tbl{margin:0}'
    + '.bill-rates-panel .tbl thead th{background:#f5f7fb;padding:15px 16px;font-size:14px;font-weight:600;color:var(--ink)}'
    + '.bill-rates-panel .bill-tier-table thead th,.bill-invoice-panel .tbl thead th{background:#fafbfc;padding:12px 16px;font-size:13.5px;font-weight:600;color:var(--ink)}'
    + '.bill-rates-panel .tbl tbody tr{cursor:default}'
    + '.bill-rates-panel .tbl tbody tr:last-child td{border-bottom:0}'
    + '.bill-invoice-panel .tbl tbody tr[data-invoice-id]{cursor:pointer}'
    + '.bill-invoice-panel .tbl tbody tr[data-invoice-id]:hover td{background:#fafbfc}'
    + '.bill-invoice-eye{display:inline-grid;place-items:center;width:30px;height:30px;color:var(--ink-muted);border-radius:7px}'
    + '.bill-invoice-eye:hover{background:var(--panel);color:var(--ink)}'
    + '.bill-invoice-eye svg{display:block}'
    + '.bill-invoice-foot{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 16px;border-top:1px solid var(--hair)}'
    + '.bill-err{color:var(--err);font-size:12.5px;margin-top:4px;min-height:0}'
    + '.bill-err:empty{display:none}'
    + '.bill-invoice-page{max-width:960px}'
    + '.bill-kpi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}'
    + '.bill-kpi{min-width:0;padding:15px 16px 14px;border:1px solid #e4e8f0;border-radius:12px;background:#f7f9fc;box-shadow:0 1px 2px rgb(16 24 40 / 4%)}'
    + '.bill-kpi-top{display:flex;align-items:center;gap:8px}'
    + '.bill-kpi-top>span:last-child{color:var(--ink-muted);font-size:12px;font-weight:600}'
    + '.bill-kpi .bill-ico{width:28px;height:28px;border-radius:8px}'
    + '.bill-kpi strong{display:block;margin-top:12px;color:var(--ink);font-size:24px;line-height:1.1;font-variant-numeric:tabular-nums;letter-spacing:-.02em}'
    + '.bill-kpi small{display:block;margin-top:5px;color:var(--ink-muted);font-size:11.5px;line-height:1.4}'
    + '.bill-kpi.is-volume .bill-ico{background:#f1f3f7;color:#5c6578}'
    + '.bill-kpi.is-free .bill-ico{background:#edf8f2;color:#16875b}'
    + '.bill-kpi.is-bill .bill-ico{background:#fff6e8;color:#c9842a}'
    + '.bill-invoice-panel .tbl td{vertical-align:middle}'
    + '.bill-invoice-lines .tbl{margin:0}'
    + '.bill-invoice-lines .tbl thead th{background:#f5f7fb;padding:12px 16px;font-size:13.5px;font-weight:600;color:var(--ink)}'
    + '.bill-invoice-lines .tbl tbody tr:last-child td{border-bottom:0}'
    + '.bill-invoice-lines .tbl td{vertical-align:middle}'
    + '.bill-line-note{margin-top:2px;font-size:12px;line-height:1.45}'
    + '.bill-activity-panel{margin-top:16px;padding:0;overflow:hidden}'
    + '.bill-activity-head{padding:13px 16px;background:#f5f7fb;border-bottom:1px solid var(--hair)}'
    + '.bill-activity-head .card-title{margin:0}'
    + '.bill-activity-table{margin:0}'
    + '.bill-activity-table thead th{background:#fafbfc;padding:12px 16px;font-size:13.5px;font-weight:600;color:var(--ink)}'
    + '.bill-activity-table tbody tr:last-child td{border-bottom:0}'
    + '.bill-activity-table td{vertical-align:middle}'
    + '.bill-activity-table th:nth-child(1),.bill-activity-table td:nth-child(1){width:188px}'
    + '.bill-activity-table th:nth-child(2),.bill-activity-table td:nth-child(2){width:120px}'
    + '.bill-activity-table th:nth-child(3),.bill-activity-table td:nth-child(3){width:160px}'
    + '.bill-activity-note{white-space:normal}'
    + '@media (max-width:1100px){.bill-kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}'
    + '.modal .input.has-error,.modal .input.has-error:focus{border-color:var(--err);background:#fffafa;box-shadow:0 0 0 3px rgba(211,54,18,.12)}';

  function ensureFieldCss() {
    if (document.getElementById('bill-field-css')) return;
    var style = document.createElement('style');
    style.id = 'bill-field-css';
    style.textContent = '.modal .input.has-error,.modal .input.has-error:focus{border-color:var(--err)!important;background:#fffafa;box-shadow:0 0 0 3px rgba(211,54,18,.12)}.bill-card-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.bill-card-note{font-size:12.5px;line-height:1.5}.bill-verify-status{font-size:12.5px;line-height:1.5;margin-top:8px}.bill-verify-status:empty{display:none}.bill-verify-status.is-busy{color:var(--ink-muted)}.bill-verify-status.is-err{color:var(--err)}.modal [data-ok].is-busy{display:inline-flex;align-items:center;justify-content:center;min-width:118px;gap:6px}.bill-spin{display:inline-block;width:12px;height:12px;border:1.5px solid currentColor;border-right-color:transparent;border-radius:50%;animation:bill-spin .6s linear infinite}@keyframes bill-spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }
  function shell(inner) {
    ensureFieldCss();
    return '<style>' + CSS + '</style>' + inner;
  }
  function pageTitle(title, sub) {
    return '<div style="margin-bottom:16px"><div class="page-title">' + title + '</div>' +
      (sub ? '<div class="muted" style="font-size:13px;line-height:1.5;margin-top:4px;max-width:720px">' + sub + '</div>' : '') + '</div>';
  }
  function invoiceHead(titleHtml, actionsHtml) {
    return '<div class="flex items-center justify-between mb-4">' +
      '<div class="flex items-center gap-3">' +
        '<a class="back-btn" href="#/settings/billing" title="Back">' + ICO.back + '</a>' +
        '<div class="flex items-center gap-2" style="flex-wrap:wrap">' + titleHtml + '</div>' +
      '</div>' +
      '<div class="flex items-center gap-2">' + (actionsHtml || '') + '</div>' +
    '</div>';
  }
  function t(s) {
    return (window.I18N && window.I18N.t) ? window.I18N.t(s) : s;
  }
  function fillHtml(el, html) {
    if (!el) return;
    var tag = String(el.tagName || '').toLowerCase();
    var tmp;
    var source;
    if (tag === 'tbody' || tag === 'thead' || tag === 'table') {
      tmp = document.createElement('table');
      tmp.innerHTML = tag === 'table' ? html : '<tbody>' + html + '</tbody>';
      source = tag === 'table' ? tmp : (tmp.tBodies[0] || tmp);
    } else {
      tmp = document.createElement('div');
      tmp.innerHTML = html;
      source = tmp;
    }
    if (window.I18N && window.I18N.apply) window.I18N.apply(tmp);
    el.replaceChildren();
    while (source.firstChild) el.appendChild(source.firstChild);
  }

  function render(api) {
    var rest = String(api.rest || '').replace(/^billing\/?/, '');
    var parts = rest.split('/').filter(Boolean);
    var account = accountFor(api.storeName);
    if (parts[0] === 'invoices' && parts[1]) renderInvoice(api, account, parts[1]);
    else renderHome(api, account);
  }

  function unpaidInvoice(account) {
    return (account.invoices || []).filter(function (item) {
      return item.status !== 'Paid' && item.totalCents > 0;
    }).sort(function (a, b) {
      return String(b.monthKey || b.month || '').localeCompare(String(a.monthKey || a.month || ''));
    })[0];
  }
  function payNowHtml(account) {
    if (!unpaidInvoice(account)) return '';
    if (account.last4) return '<div class="bill-actions"><button class="btn btn-primary" id="billPay">Pay now</button></div>';
    return '<div class="bill-actions"><button class="btn btn-primary" id="billPayCard">Add card and pay</button></div>';
  }
  var CHARGE_FALLBACK_DAYS = 7;
  function fallbackBodyHtml() {
    return '<span>Invoices remain unpaid. Paying them turns interception back on.</span>';
  }
  function chargeWindowCopy(hasCard) {
    var n = CHARGE_FALLBACK_DAYS;
    var unit = n === 1 ? 'day' : 'days';
    var lead = hasCard ? 'Pay the invoice or replace the card within ' : 'Add a card and pay within ';
    return lead + n + ' ' + unit + ', or new checkouts fall back to Shopify Checkout.';
  }
  function renderHome(api, account) {
    var esc = api.esc;
    var past = account.billingStatus === 'Past due';
    var book = account.priceBook;
    var due = unpaidInvoice(account);
    var banner = '';
    if (past) {
      banner = '<div class="bill-banner"><div class="bill-banner-copy"><strong>New checkouts use Shopify Checkout</strong>' +
        fallbackBodyHtml() + '</div>' +
        payNowHtml(account) + '</div>';
    } else if (due && account.billingStatus === 'Charge failed') {
      banner = '<div class="bill-banner"><div class="bill-banner-copy">' +
        (account.last4
          ? '<strong>Card charge failed</strong><span>' + chargeWindowCopy(true) + '</span>'
          : '<strong>No card on file</strong><span>' + chargeWindowCopy(false) + '</span>') +
        '</div>' + payNowHtml(account) + '</div>';
    }
    var usedCents = account.allowanceCents == null
      ? ((account.october && account.october.volumeCents) || 0)
      : allowanceUsedCents(account);
    var usedHtml = '<span class="i18n-skip">' + esc(moneyWhole(usedCents)) + '</span>';
    var totalHtml = account.allowanceCents == null
      ? '<span>Unlimited</span>'
      : '<span class="i18n-skip">' + esc(moneyWhole(account.allowanceCents)) + '</span>';
    var allowance = '<div class="panel bill-ab-card bill-tone">' +
      billHead('gift', 'Free capture allowance', 'is-free') +
      '<div class="bill-ab">' + usedHtml + '<span class="bill-ab-sep">/</span>' + totalHtml + '</div>' +
      '<div class="bill-ab-meta"><span>Used / Total</span>' +
        (account.allowanceUsed ? '<span class="bill-ab-note">The free allowance is used up.</span>' : '') +
      '</div></div>';
    var rates = '<div class="panel bill-section bill-rates-panel">' +
      '<div class="bill-panel-head">' + billHead('book', 'Price book') + '</div>' +
      '<div class="bill-license-line"><span>Monthly license</span><strong class="i18n-skip">' + esc(money(book.monthlyFeeCents)) + '</strong></div>' +
      '<div class="bill-fee-tree">' +
        '<div class="bill-license-line bill-fee-head"><span>Processing fee</span></div>' +
        '<div class="bill-fee-list">' + tierList(book, esc) + '</div>' +
      '</div></div>';
    var cardBody = account.last4
      ? '<div style="margin-top:10px"><span class="i18n-skip">' + esc(account.brand + ' ···· ' + account.last4) + '</span> <span class="muted">·</span> <span>Expires</span> <span class="i18n-skip">' + esc(account.exp) + '</span></div>' +
        '<div class="muted" style="font-size:12.5px;margin-top:8px;line-height:1.5">When an invoice is issued, BestCheckout charges this card. Nothing is charged while the store is inside the free allowance.</div>' +
        '<div class="bill-actions"><button class="btn btn-default" id="billCard">' + (due ? 'Replace card and pay' : 'Replace card') + '</button></div>'
      : '<div class="muted" style="font-size:13px;margin-top:8px;line-height:1.5">No card on file. Add one so invoices can be charged from this card. Nothing is charged while the store is inside the free allowance.</div>' +
        '<div class="bill-actions"><button class="btn btn-primary" id="billCard">' + (due ? 'Add card and pay' : 'Add card') + '</button></div>';
    var pay = '<div class="panel bill-tone"><div class="card-pad">' + billHead('card', 'Payment method') +
      cardBody +
      '</div></div>';
    var email = '<div class="panel bill-ab-card bill-tone">' + billHead('mail', 'Billing email') +
      '<div class="bill-email-value i18n-skip">' + esc(account.email) + '</div>' +
      '<div class="bill-actions"><button class="btn btn-default" id="billEmail">Edit billing email</button></div>' +
      '</div>';
    var invoices = '<div class="panel bill-section bill-rates-panel bill-invoice-panel"><div class="bill-panel-head">' + billHead('file', 'Invoices') + '</div>' +
      '<div class="bill-table-wrap"><table class="tbl"><thead><tr><th>Invoice</th><th>Month</th><th>Invoice total</th><th>Status</th><th style="text-align:center">Action</th></tr></thead><tbody id="billInvoiceRows"></tbody></table></div>' +
      '<div class="bill-invoice-foot" id="billInvoiceFoot"><span class="muted" id="billInvoiceTotal">Total 0 records</span><div class="pg" id="billInvoicePager"></div></div></div>';
    api.paint(shell(pageTitle('Invoices') + banner + '<div class="bill-top-grid">' + pay + email + allowance + '</div>' + rates + invoices), false);
    var root = api.root;
    var payBtn = root.querySelector('#billPay');
    if (payBtn) payBtn.onclick = function () { payInvoice(api, account, due || account.invoices[0]); };
    var payCardBtn = root.querySelector('#billPayCard');
    if (payCardBtn) payCardBtn.onclick = function () { openCard(api, account, { payItem: due || account.invoices[0] }); };
    var cardBtn = root.querySelector('#billCard');
    if (cardBtn) cardBtn.onclick = function () { openCard(api, account, due ? { payItem: due } : {}); };
    var emailBtn = root.querySelector('#billEmail');
    if (emailBtn) emailBtn.onclick = function () { openEmail(api, account); };
    bindInvoicePager(root, account, esc);
  }

  function invoicePagerHtml(total) {
    var pages = Math.max(1, Math.ceil((total || 0) / invoicePage.size));
    if (invoicePage.no > pages) invoicePage.no = pages;
    if (invoicePage.no < 1) invoicePage.no = 1;
    var pageNo = invoicePage.no;
    var html = '<span class="pg-item' + (pageNo <= 1 ? ' disabled' : '') + '"' + (pageNo <= 1 ? '' : ' data-invoice-page="' + (pageNo - 1) + '"') + '>‹</span>';
    for (var p = 1; p <= pages; p++) html += '<span class="pg-item' + (p === pageNo ? ' active' : '') + '" data-invoice-page="' + p + '">' + p + '</span>';
    html += '<span class="pg-item' + (pageNo >= pages ? ' disabled' : '') + '"' + (pageNo >= pages ? '' : ' data-invoice-page="' + (pageNo + 1) + '"') + '>›</span>';
    html += '<select class="pg-size" id="billInvoicePageSize" aria-label="Page size"><option value="10"' + (invoicePage.size === 10 ? ' selected' : '') + '>10 / page</option><option value="20"' + (invoicePage.size === 20 ? ' selected' : '') + '>20 / page</option><option value="50"' + (invoicePage.size === 50 ? ' selected' : '') + '>50 / page</option><option value="100"' + (invoicePage.size === 100 ? ' selected' : '') + '>100 / page</option></select>';
    return html;
  }
  function bindInvoicePager(root, account, esc) {
    if (invoicePage.store !== account.name) {
      invoicePage.store = account.name;
      invoicePage.no = 1;
    }
    var items = account.invoices.slice().sort(function (a, b) {
      return String(b.monthKey || b.month).localeCompare(String(a.monthKey || a.month));
    });
    function draw() {
      var total = items.length;
      var pages = Math.max(1, Math.ceil(total / invoicePage.size));
      if (invoicePage.no > pages) invoicePage.no = pages;
      if (invoicePage.no < 1) invoicePage.no = 1;
      var start = (invoicePage.no - 1) * invoicePage.size;
      var slice = items.slice(start, start + invoicePage.size);
      var body = root.querySelector('#billInvoiceRows');
      fillHtml(body, slice.length
        ? slice.map(function (item) {
          return '<tr data-invoice-id="' + esc(item.id) + '"><td class="i18n-skip">' + esc(item.number) + '</td><td class="i18n-skip">' + esc(item.month) + '</td><td class="i18n-skip">' + esc(money(item.totalCents)) + '</td><td>' + pill(displayStatus(account, item)) + '</td><td style="text-align:center"><a class="bill-invoice-eye" href="#/settings/billing/invoices/' + esc(item.id) + '" title="View" aria-label="View">' + EYE + '</a></td></tr>';
        }).join('')
        : '<tr><td colspan="5" class="muted" style="text-align:center;padding:40px">No invoices yet.</td></tr>');
      root.querySelector('#billInvoiceTotal').textContent = t('Total ' + total + ' records');
      fillHtml(root.querySelector('#billInvoicePager'), invoicePagerHtml(total));
    }
    var bodyEl = root.querySelector('#billInvoiceRows');
    bodyEl.addEventListener('click', function (event) {
      if (event.target.closest('a,button')) return;
      var row = event.target.closest('tr[data-invoice-id]');
      if (!row) return;
      location.hash = '#/settings/billing/invoices/' + row.getAttribute('data-invoice-id');
    });
    var pager = root.querySelector('#billInvoicePager');
    pager.addEventListener('click', function (event) {
      var next = event.target.getAttribute('data-invoice-page');
      if (!next) return;
      invoicePage.no = Number(next) || 1;
      draw();
    });
    pager.addEventListener('change', function (event) {
      if (!event.target || event.target.id !== 'billInvoicePageSize') return;
      invoicePage.size = Number(event.target.value) || 20;
      invoicePage.no = 1;
      draw();
    });
    draw();
  }

  function invoiceKpi(label, value, detail, tone, icon) {
    return '<div class="bill-kpi is-' + tone + '"><div class="bill-kpi-top">' + billIco(icon) + '<span>' + label + '</span></div>' +
      '<strong class="i18n-skip">' + value + '</strong>' +
      (detail ? '<small>' + detail + '</small>' : '') + '</div>';
  }
  function invoiceInsideNote(item) {
    if ((item.coveredCents || 0) > 0) return '';
    if (item.allowanceCents == null) return 'Unlimited';
    return 'Free allowance already used';
  }
  function invoiceLineDetail(esc, item, line) {
    if (line.kind === 'License') {
      var days = (item.billableDays || 0) + ' / ' + (item.daysInMonth || 0) + ' days';
      var formula = money(item.monthlyFeeCents || 0) + ' × ' + days;
      var note = item.billableDays && item.billableDays < item.daysInMonth
        ? 'Charged only for days after the free allowance was used.'
        : 'Charged after the free allowance was used.';
      return '<div class="muted bill-line-note i18n-skip">' + esc(formula) + '</div><div class="muted bill-line-note">' + note + '</div>';
    }
    if (line.kind === 'Commission') {
      var rate = String(line.detail || '').split(' · ')[0];
      var formula = (rate ? rate + ' × ' : '') + money(item.volumeCents || 0);
      var covered = item.coveredCents || 0;
      var split = covered
        ? '<div class="muted bill-line-note i18n-skip">' + esc(money(covered + (item.volumeCents || 0)) + ' − ' + money(covered) + ' = ' + money(item.volumeCents || 0)) + '</div>'
        : '';
      return '<div class="muted bill-line-note i18n-skip">' + esc(formula) + '</div>' + split +
        '<div class="muted bill-line-note">Only volume outside the free allowance is charged.</div>';
    }
    if (line.detail && line.kind === 'Adjustment') {
      return '<div class="muted bill-line-note">' + esc(line.detail) + '</div>';
    }
    if (line.detail) {
      return '<div class="muted bill-line-note i18n-skip">' + esc(line.detail) + '</div>';
    }
    return '';
  }
  function activityNoteHtml(esc, row) {
    var bits = [];
    if (row.moneyText) bits.push('<span class="i18n-skip">' + esc(row.moneyText) + '</span>');
    if (row.reason) bits.push('<span>' + esc(row.reason) + '</span>');
    return bits.join(' ');
  }
  function activityRowHtml(esc, row) {
    return '<tr><td class="i18n-skip">' + esc(row.at) + '</td><td class="i18n-skip">' + esc(row.actor) + '</td><td>' + esc(row.action) + '</td><td class="bill-activity-note">' + activityNoteHtml(esc, row) + '</td></tr>';
  }
  function activityPagerHtml(page, total) {
    var pages = Math.max(1, Math.ceil((total || 0) / page.size));
    if (page.no > pages) page.no = pages;
    if (page.no < 1) page.no = 1;
    var html = '<span class="pg-item' + (page.no <= 1 ? ' disabled' : '') + '"' + (page.no <= 1 ? '' : ' data-activity-page="' + (page.no - 1) + '"') + '>‹</span>';
    for (var p = 1; p <= pages; p++) html += '<span class="pg-item' + (p === page.no ? ' active' : '') + '" data-activity-page="' + p + '">' + p + '</span>';
    html += '<span class="pg-item' + (page.no >= pages ? ' disabled' : '') + '"' + (page.no >= pages ? '' : ' data-activity-page="' + (page.no + 1) + '"') + '>›</span>';
    html += '<select class="pg-size" id="billActivityPageSize" aria-label="Page size"><option value="10"' + (page.size === 10 ? ' selected' : '') + '>10 / page</option><option value="20"' + (page.size === 20 ? ' selected' : '') + '>20 / page</option><option value="50"' + (page.size === 50 ? ' selected' : '') + '>50 / page</option><option value="100"' + (page.size === 100 ? ' selected' : '') + '>100 / page</option></select>';
    return html;
  }
  function bindActivityPager(root, esc, rows) {
    var page = { no: 1, size: 20 };
    function draw() {
      var total = rows.length;
      var pages = Math.max(1, Math.ceil(total / page.size) || 1);
      if (page.no > pages) page.no = pages;
      if (page.no < 1) page.no = 1;
      var start = (page.no - 1) * page.size;
      var slice = rows.slice(start, start + page.size);
      fillHtml(root.querySelector('#billActivityRows'), slice.length
        ? slice.map(function (row) { return activityRowHtml(esc, row); }).join('')
        : '<tr><td colspan="4" class="muted" style="text-align:center;padding:40px">No data</td></tr>');
      root.querySelector('#billActivityTotal').textContent = t('Total ' + total + ' records');
      fillHtml(root.querySelector('#billActivityPager'), activityPagerHtml(page, total));
    }
    var pager = root.querySelector('#billActivityPager');
    pager.addEventListener('click', function (event) {
      var next = event.target.getAttribute('data-activity-page');
      if (!next) return;
      page.no = Number(next) || 1;
      draw();
    });
    pager.addEventListener('change', function (event) {
      if (!event.target || event.target.id !== 'billActivityPageSize') return;
      page.size = Number(event.target.value) || 20;
      page.no = 1;
      draw();
    });
    draw();
  }
  function logsForInvoice(account, item) {
    var extra = (account.extraLogs || []).filter(function (row) { return row.invoiceId === item.id; });
    var rows = invoiceLogs.filter(function (row) { return row.invoiceId === item.id; }).concat(extra);
    var paid = rows.some(function (row) { return row.action === 'Recorded payment'; });
    if (item.status === 'Paid' && !paid) {
      rows = rows.concat([{
        at: item.paidAt === 'Oct 22, 2026' ? '2026-10-22 10:18' : '2026-10-02 08:14',
        actor: 'BestCheckout',
        action: 'Recorded payment',
        invoiceId: item.id,
        moneyText: item.number + ' · ' + money(item.totalCents),
        reason: ''
      }]);
    }
    return rows.sort(function (a, b) { return a.at < b.at ? 1 : (a.at > b.at ? -1 : 0); });
  }
  function renderInvoice(api, account, id) {
    var esc = api.esc;
    var item = account.invoices.filter(function (invoice) { return invoice.id === id; })[0];
    if (!item) {
      api.paint(shell('<div class="bill-invoice-page">' + invoiceHead('<span class="page-title">Invoice</span>') + '<div class="muted">This invoice was not found.</div></div>'), false);
      return;
    }
    var covered = item.coveredCents || 0;
    var billable = item.volumeCents || 0;
    var insideNote = invoiceInsideNote(item);
    var rows = item.lines.map(function (line) {
      return '<tr><td><div>' + esc(line.label) + '</div>' + invoiceLineDetail(esc, item, line) + '</td><td>' + esc(line.kind) + '</td><td class="i18n-skip">' + esc(money(line.amountCents)) + '</td></tr>';
    }).join('');
    var pay = item.status !== 'Paid' && item.totalCents > 0
      ? (account.last4
        ? '<button class="btn btn-primary" id="billPay">Pay now</button>'
        : '<button class="btn btn-primary" id="billPayCard">Add card and pay</button>')
      : '';
    api.paint(shell(
      '<div class="bill-invoice-page">' +
      invoiceHead(
        '<span class="page-title i18n-skip">' + esc(item.number) + '</span>' +
        '<button type="button" class="back-btn" id="billCopy" title="Copy" style="width:30px;height:30px;background:transparent">' + ICO.copy + '</button>' +
        pill(displayStatus(account, item)),
        pay
      ) +
      '<div class="bill-kpi-grid">' +
        invoiceKpi('Total', esc(money(item.totalCents)), '<span class="i18n-skip">' + esc(item.month) + '</span>', 'total', 'file') +
        invoiceKpi('Volume', esc(money(covered + billable)), '', 'volume', 'bars') +
        invoiceKpi('Volume inside allowance', esc(money(covered)), insideNote, 'free', 'gift') +
        invoiceKpi('Billable volume', esc(money(billable)), '', 'bill', 'coin') +
      '</div>' +
      '<div class="panel bill-invoice-lines">' +
      '<table class="tbl"><thead><tr><th>Description</th><th>Kind</th><th>Amount</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '</div>' +
      '<div class="panel bill-activity-panel"><div class="bill-activity-head"><div class="card-title">Activity</div></div>' +
      '<table class="tbl bill-activity-table"><thead><tr><th>Time</th><th>Operator</th><th>Action</th><th>Note</th></tr></thead><tbody id="billActivityRows"></tbody></table>' +
      '<div class="bill-invoice-foot"><span class="muted" id="billActivityTotal">Total 0 records</span><div class="pg" id="billActivityPager"></div></div>' +
      '</div></div>'
    ), false);
    bindActivityPager(api.root, esc, logsForInvoice(account, item));
    var copy = api.root.querySelector('#billCopy');
    if (copy) copy.onclick = function () {
      try { navigator.clipboard.writeText(item.number); } catch (err) {}
      api.toast(t('Copied'));
    };
    var button = api.root.querySelector('#billPay');
    if (button) button.onclick = function () { payInvoice(api, account, item); };
    var payCard = api.root.querySelector('#billPayCard');
    if (payCard) payCard.onclick = function () { openCard(api, account, { payItem: item }); };
  }

  function cardKey(account) {
    return account.last4 ? String(account.brand || '') + ':' + String(account.last4) : '';
  }
  function sameDeclinedCard(account) {
    return !!(account.declinedCardKey && account.declinedCardKey === cardKey(account));
  }
  function setPayBusy(m, busy) {
    m._billPaying = !!busy;
    var ok = m.querySelector('[data-ok]');
    if (ok) {
      ok.disabled = !!busy;
      ok.classList.toggle('is-busy', !!busy);
      if (busy) ok.innerHTML = '<span class="bill-spin" aria-hidden="true"></span><span>' + t('Charging…') + '</span>';
      else ok.textContent = t(m._billPayFailed ? 'Replace card and pay' : 'Pay now');
    }
    var status = m.querySelector('#billPayStatus');
    if (status) {
      status.className = 'bill-verify-status' + (busy ? ' is-busy' : '');
      status.textContent = busy ? t('Charging this card…') : '';
    }
  }
  function markInvoicePaid(api, account, item, close) {
    item.status = 'Paid';
    item.paidAt = 'Oct 30, 2026';
    account.billingStatus = 'Current';
    account.checkoutFallback = false;
    account.failures = [];
    account.extraLogs = account.extraLogs || [];
    account.extraLogs.unshift({
      at: '2026-10-30 10:50',
      actor: 'BestCheckout',
      action: 'Recorded payment',
      invoiceId: item.id,
      moneyText: item.number + ' · ' + money(item.totalCents),
      reason: ''
    });
    savePatch(account);
    if (close) close();
    api.toast('Payment received');
    render(api);
  }
  function payInvoice(api, account, item) {
    api.modal({
      title: 'Pay invoice',
      okText: 'Pay now',
      body: '<p style="font-size:14px;line-height:1.5;margin:0"><span>Pay the invoice of</span> <span class="i18n-skip">' + api.esc(money(item.totalCents)) + '</span> <span>with the card</span> <span class="i18n-skip">' + api.esc(account.brand + ' ···· ' + account.last4) + '</span>?</p>' +
        '<div class="bill-verify-status" id="billPayStatus"></div>',
      onOk: function (m, close) {
        if (m._billPaying) return;
        if (m._billPayFailed) {
          close();
          openCard(api, account, { payItem: item });
          return;
        }
        setPayBusy(m, true);
        window.setTimeout(function () {
          if (!m.isConnected) return;
          if (sameDeclinedCard(account)) {
            m._billPayFailed = true;
            setPayBusy(m, false);
            var status = m.querySelector('#billPayStatus');
            if (status) {
              status.className = 'bill-verify-status is-err';
              status.textContent = t('This card was declined. Replace the card and pay.');
            }
            account.extraLogs = account.extraLogs || [];
            account.extraLogs.unshift({
              at: '2026-10-30 10:48',
              actor: 'BestCheckout',
              action: 'Charge failed',
              invoiceId: item.id,
              moneyText: item.number + ' · ' + money(item.totalCents),
              reason: 'Card declined'
            });
            if ((account.failures || []).indexOf('Oct 30, 2026') < 0) {
              account.failures = (account.failures || []).concat(['Oct 30, 2026']);
            }
            savePatch(account);
            return;
          }
          markInvoicePaid(api, account, item, close);
        }, 1600);
      }
    });
  }
  function setCardBusy(m, busy) {
    m._billVerifying = !!busy;
    m.querySelectorAll('input').forEach(function (el) { el.disabled = !!busy; });
    var ok = m.querySelector('[data-ok]');
    var paying = !!m._billPayWithCard;
    if (ok) {
      ok.disabled = !!busy;
      ok.classList.toggle('is-busy', !!busy);
      if (busy) ok.innerHTML = '<span class="bill-spin" aria-hidden="true"></span><span>' + t(paying ? 'Charging…' : 'Verifying…') + '</span>';
      else ok.textContent = t(m._billPayOkText || 'Save card');
    }
    var status = m.querySelector('#billCardVerifyErr');
    if (status) {
      status.className = 'bill-verify-status' + (busy ? ' is-busy' : '');
      status.textContent = busy
        ? t(paying ? 'Charging this card…' : 'Charging $1 to verify this card…')
        : '';
    }
  }
  function openCard(api, account, opts) {
    opts = opts || {};
    var payItem = opts.payItem || null;
    var paying = !!payItem;
    var payOk = paying ? (account.last4 ? 'Replace card and pay' : 'Add card and pay') : 'Save card';
    var opened = api.modal({
      title: paying ? payOk : (account.last4 ? 'Replace card' : 'Add card'),
      okText: payOk,
      width: 480,
      body: field('Name on card', '<input class="input" id="billCardName" placeholder="Name on card" autocomplete="cc-name">') +
        field('Card number', '<input class="input" id="billCardNumber" inputmode="numeric" placeholder="Card number" autocomplete="cc-number">') +
        '<div class="bill-card-row">' +
          field('Expiry', '<input class="input" id="billCardExp" inputmode="numeric" maxlength="5" placeholder="MM/YY" autocomplete="cc-exp">') +
          field('Security code', '<input class="input" id="billCardCvc" inputmode="numeric" maxlength="4" placeholder="CVC" autocomplete="cc-csc">') +
        '</div>' +
        '<div class="muted bill-card-note">The full card number is not shown again. BestCheckout keeps the brand and last four digits.</div>' +
        (paying ? '' : '<div class="muted bill-card-note" style="margin-top:8px">We charge $1 to verify the card, then refund it. The card is saved only if the charge succeeds.</div>') +
        '<div class="bill-verify-status" id="billCardVerifyErr"></div>',
      onOk: function (m, close) {
        if (m._billVerifying) return;
        var name = value(m, '#billCardName');
        var number = value(m, '#billCardNumber').replace(/\s+/g, '');
        var exp = value(m, '#billCardExp');
        var cvc = value(m, '#billCardCvc');
        clearErrors(m);
        var ok = true;
        if (!name) { showError(m, '#billCardName', 'Enter the name on the card.'); ok = false; }
        if (!/^\d{12,19}$/.test(number)) { showError(m, '#billCardNumber', 'Enter a card number.'); ok = false; }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) { showError(m, '#billCardExp', 'Enter an expiry date as MM/YY.'); ok = false; }
        else if (!expiryCurrent(exp)) { showError(m, '#billCardExp', 'Enter a future expiry date.'); ok = false; }
        if (!/^\d{3,4}$/.test(cvc)) { showError(m, '#billCardCvc', 'Enter the security code.'); ok = false; }
        if (!ok) return;
        setCardBusy(m, true);
        window.setTimeout(function () {
          if (!m.isConnected) return;
          var brand = number.charAt(0) === '5' ? 'Mastercard' : 'Visa';
          var last4 = number.slice(-4);
          if (paying) {
            if (account.declinedCardKey && account.declinedCardKey === brand + ':' + last4) {
              setCardBusy(m, false);
              var payErr = m.querySelector('#billCardVerifyErr');
              if (payErr) {
                payErr.className = 'bill-verify-status is-err';
                payErr.textContent = t('This card was declined. Try another card.');
              }
              return;
            }
            account.brand = brand;
            account.last4 = last4;
            account.exp = exp;
            markInvoicePaid(api, account, payItem, close);
            return;
          }
          var draft = [name, number, exp, cvc].join('|');
          var failed = !m._billVerifyFailed || draft === m._billFailDraft;
          if (failed) {
            m._billVerifyFailed = true;
            m._billFailDraft = draft;
            setCardBusy(m, false);
            var err = m.querySelector('#billCardVerifyErr');
            if (err) {
              err.className = 'bill-verify-status is-err';
              err.textContent = t('Card verification failed. The $1 charge did not go through. Try another card.');
            }
            return;
          }
          account.brand = brand;
          account.last4 = last4;
          account.exp = exp;
          savePatch(account);
          close();
          api.toast('Card saved. The $1 charge will be refunded.');
          render(api);
        }, 1600);
      }
    });
    if (opened && opened.m) {
      opened.m._billPayWithCard = paying;
      opened.m._billPayOkText = payOk;
    }
    var expInput = document.getElementById('billCardExp');
    if (expInput) bindCardExpiry(expInput);
    bindClearErrors(document.getElementById('billCardName'));
  }
  function formatExpiry(raw) {
    var digits = String(raw || '').replace(/\D/g, '').slice(0, 4);
    if (digits.length === 1 && digits > '1') digits = '0' + digits;
    if (digits.length >= 2) {
      var month = Number(digits.slice(0, 2));
      if (month === 0) digits = '01' + digits.slice(2);
      else if (month > 12) digits = '12' + digits.slice(2);
    }
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }
  function expiryCurrent(exp) {
    var match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(exp);
    if (!match) return false;
    var month = Number(match[1]);
    var year = 2000 + Number(match[2]);
    var now = new Date();
    return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
  }
  function bindCardExpiry(input) {
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Backspace' && input.value.length === 3 && input.value.charAt(2) === '/') {
        input.value = input.value.charAt(0);
        event.preventDefault();
      }
    });
    input.addEventListener('input', function () {
      input.value = formatExpiry(input.value);
    });
  }
  function openEmail(api, account) {
    api.modal({
      title: 'Billing email',
      okText: 'Save email',
      width: 480,
      body: field('Billing email', '<input class="input" id="billEmailInput" value="' + api.esc(account.email) + '">'),
      onOk: function (m, close) {
        var email = value(m, '#billEmailInput');
        clearErrors(m);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showError(m, '#billEmailInput', 'Enter an email address.');
          return;
        }
        account.email = email;
        savePatch(account);
        close();
        api.toast('Billing email updated');
        render(api);
      }
    });
    bindClearErrors(document.getElementById('billEmailInput'));
  }
  function field(label, control) {
    return '<div style="margin-bottom:12px"><div class="muted" style="font-size:12.5px;font-weight:600;margin-bottom:6px">' + label + '</div>' + control + '</div>';
  }
  function value(m, sel) { return String((m.querySelector(sel) || {}).value || '').trim(); }
  function clearErrors(m) {
    m.querySelectorAll('.bill-err').forEach(function (node) { node.textContent = ''; });
    m.querySelectorAll('.has-error').forEach(function (node) { node.classList.remove('has-error'); });
  }
  function showError(m, sel, message) {
    var input = m.querySelector(sel);
    if (!input) return;
    input.classList.add('has-error');
    var err = input.parentNode.querySelector('.bill-err');
    if (!err) {
      err = document.createElement('div');
      err.className = 'bill-err';
      input.parentNode.appendChild(err);
    }
    err.textContent = message;
  }
  function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('has-error');
    var wrap = input.parentNode;
    if (!wrap) return;
    var err = wrap.querySelector('.bill-err');
    if (err) err.textContent = '';
  }
  function bindClearErrors(start) {
    var root = start && start.closest ? start.closest('.modal') : start;
    if (!root || root._billClearBound) return;
    root._billClearBound = true;
    root.addEventListener('input', function (event) {
      var input = event.target;
      if (!input || input.tagName !== 'INPUT') return;
      clearFieldError(input);
      var verify = root.querySelector('#billCardVerifyErr');
      if (verify) verify.textContent = '';
    });
  }

  function overviewPayAction(account) {
    if (!unpaidInvoice(account)) return 'Review invoice';
    return account.last4 ? 'Pay now' : 'Add card and pay';
  }
  function overviewTask(storeName) {
    var account = accountFor(storeName || '');
    var left = allowanceLeft(account);
    var due = unpaidInvoice(account);
    if (account.billingStatus === 'Past due') {
      return { title: 'New checkouts use Shopify Checkout', html: fallbackBodyHtml(), action: overviewPayAction(account), href: '#/settings/billing' };
    }
    if (due && account.billingStatus === 'Charge failed') {
      if (account.last4) {
        return { title: 'Card charge failed', lead: chargeWindowCopy(true), amount: '', tail: '', action: overviewPayAction(account), href: '#/settings/billing' };
      }
      return { title: 'No card on file', lead: chargeWindowCopy(false), amount: '', tail: '', action: overviewPayAction(account), href: '#/settings/billing' };
    }
    if (!account.last4) {
      if (account.allowanceCents == null) {
        return { title: 'Add a card for billing', lead: 'This store is not billed. You can still save a card for later.', amount: '', tail: '', action: 'Add card', href: '#/settings/billing' };
      }
      if (left) {
        return { title: 'Add a card for billing', lead: 'You can still capture', amount: money(left), tail: 'before billing starts. The card is saved now and charged only after that.', action: 'Add card', href: '#/settings/billing' };
      }
      return { title: 'Add a card for billing', lead: 'The free allowance is used up. Add a card so the invoice on the 1st can be paid automatically.', amount: '', tail: '', action: 'Add card', href: '#/settings/billing' };
    }
    return null;
  }

  window.BestCheckoutBilling = { render: render, overviewTask: overviewTask };

  var dict = {
    'Account billing': '账户账单',
    'Fees for this store. BestCheckout sets the rates. This page does not change them.': '这家店的费用。费率由 BestCheckout 设定，此页不能修改。',
    'September invoice is past due': '9 月账单已逾期',
    'New checkouts use Shopify Checkout': '新的结账已回到 Shopify Checkout',
    'September invoice is unpaid': '9 月账单未支付',
    'Pay within 7 days of the invoice, or new checkouts fall back to Shopify Checkout.': '账单开出后 7 天内未支付，新的结账会回到 Shopify Checkout。',
    'The September invoice was still unpaid 7 days after it was issued.': '9 月账单开出 7 天后仍未支付。',
    'Starting on': 'BestCheckout 已从',
    ', BestCheckout has not intercepted new checkouts.': '起停止拦截新的结账。',
    'Pay the invoice to turn interception back on.': '付清这张账单后恢复拦截。',
    'Invoices remain unpaid. Paying them turns interception back on.': '有账单未支付。付清后恢复拦截。',
    'Price book': '价目表',
    'Free capture left': '剩余免费收单额度',
    'Free capture allowance': '免费收单额度',
    'Used capture allowance': '已用收单额度',
    'Used / Total': '已用 / 总额',
    'Unlimited': '不限额',
    'This store is not billed.': '这家店不计费。',
    'Billing starts after this amount is captured.': '超过这个金额后开始计费。',
    'The free allowance is used up.': '免费额度已经用完。',
    'Captured payments. Refunds stay in this total.': '扣款成功的金额。退款仍留在这个总额里。',
    'Estimated license': '预计月费',
    'No license while the month stays inside the allowance.': '整月都在免费额度内时，不收月费。',
    'Issued on November 1.': '11 月 1 日开账。',
    'Only volume outside the free allowance.': '只计算免费额度以外的成交额。',
    'No card on file. Add one so invoices can be charged from this card. Nothing is charged while the store is inside the free allowance.': '还没有银行卡。加上之后，账单可以从这张卡扣款。免费额度内不会扣款。',
    'When an invoice is issued, BestCheckout charges this card. Nothing is charged while the store is inside the free allowance.': '开出账单后，从这张卡扣款。免费额度内不会扣款。',
    'Add card': '添加银行卡',
    'Add a card for billing': '添加账单银行卡',
    'You can still capture': '还可以免费收单',
    'before billing starts. The card is saved now and charged only after that.': '，超过后才开始计费。卡先保存，开始计费后才会扣。',
    'The free allowance is used up. Add a card so the invoice on the 1st can be paid automatically.': '免费额度已经用完。请添加银行卡，每月 1 日才能自动扣款。',
    'This store is not billed. You can still save a card for later.': '这家店不计费。也可以先保存一张卡。',
    'Restore BestCheckout checkout': '恢复 BestCheckout 结账',
    'New checkouts use Shopify Checkout until this invoice is paid.': '这张账单付清前，新的结账使用 Shopify Checkout。',
    'Review invoice': '查看账单',
    'Card saved': '银行卡已保存',
    'October is still open. On November 1, BestCheckout issues one invoice for volume outside the free allowance. Lines stay summarized. Estimated October total': '10 月尚未结束。11 月 1 日只为免费额度以外的成交额开一张账单，明细按汇总行。10 月预计合计',
    'Pay now': '立即支付',
    'Add card and pay': '添加银行卡并支付',
    'Replace card and pay': '更换银行卡支付',
    'This card was declined. Replace the card and pay.': '这张卡扣款失败。请更换银行卡支付。',
    'This card was declined. Try another card.': '这张卡扣款失败。请换一张卡。',
    'This charge pays the invoice of': '这次直接扣账单，金额',
    '. The card is saved if the charge succeeds.': '。扣成功后会保存这张卡。',
    'Charging…': '正在扣款…',
    'Charging this card…': '正在从这张卡扣款…',
    'This card was declined. Replace the card, then pay again.': '这张卡扣款失败。请更换银行卡后再支付。',
    'Card saved. Pay the invoice with this card.': '银行卡已保存。请用这张卡支付账单。',
    'Monthly license': '月费',
    'Processing fee': '交易手续费',
    'Charged for an active store': '店铺在该月为启用状态即收取',
    'October volume': '10 月成交额',
    'Estimated commission': '预计佣金',
    'Marginal rates for October': '按 10 月超额累进费率',
    'Decline rate': '拒付率',
    'No decline fee. The decline rate is under the threshold.': '没有拒付费。拒付率未超过门槛。',
    'Custom pricing': '单独定价',
    'Standard pricing': '标准价',
    'The month\'s volume picks one rate. That rate applies to the whole volume outside the free capture allowance. Customer payment services are billed separately by the provider.': '当月成交额落在哪一档，免费收单额度以外的成交额整段按这一档费率计。顾客在结账时使用的支付服务，由支付服务商另行收费。',
    'Up to': '不超过',
    'Above': '超过',
    ', up to': '，不超过',
    'Volume': '成交额',
    'Volume inside allowance': '额度内成交额',
    'Billable volume': '计费成交额',
    'Free allowance already used': '免费额度已用完',
    'Charged after the free allowance was used.': '免费额度用完后开始收取。',
    'Charged only for days after the free allowance was used.': '只收取免费额度用完之后的天数。',
    'Only volume outside the free allowance is charged.': '只对免费额度以外的成交额收费。',
    'Rate': '费率',
    'Rate:': '费率：',
    'Rate: ': '费率：',
    'Monthly volume up to': '月成交额不超过',
    'Then up to': '然后不超过',
    'Volume above': '超过',
    'Decline fee': '拒付费',
    'per declined payment above': '每笔拒付，超过',
    'Decline fee is off for this store.': '这家店不收拒付费。',
    'Payment method': '付款方式',
    'Expires': '到期',
    'Billing email': '账单邮箱',
    'The monthly license, volume commission, and decline fee are charged to this card.': '月费、成交佣金和拒付费从这张卡扣取。',
    'Replace card': '更换银行卡',
    'Edit billing email': '编辑账单邮箱',
    'Invoices': '账单',
    'October is still open. The invoice is issued on November 1. Estimated October total': '10 月尚未结束。账单于 11 月 1 日开出。10 月预计合计',
    'Invoice': '账单',
    'Month': '月份',
    'Total': '合计',
    'Status': '状态',
    'Action': '操作',
    'View': '查看',
    'Invoice total': '合计',
    'Past due': '逾期',
    'Charge failed': '扣款失败',
    'Current': '正常',
    'September 2026': '2026 年 9 月',
    'October 2026': '2026 年 10 月',
    'Description': '项目',
    'Kind': '类型',
    'License': '月费',
    'Commission': '佣金',
    'Adjustment': '调账',
    'Amount': '金额',
    'Volume commission': '成交佣金',
    'Launch credit': '开通抵扣',
    'One-time launch credit': '一次性开通抵扣',
    'Card charge failed': '银行卡扣款失败',
    'Card charges failed on': '扣款失败于',
    'The card was declined on': '银行卡在',
    'and the charge did not go through.': '扣款失败。',
    'The invoice is still unpaid.': '这张账单仍未支付。',
    'Pay the invoice or replace the card.': '请支付账单，或更换银行卡。',
    'Charge retry failed': '轮询扣款失败',
    'Status unchanged': '状态不变',
    'Stopped intercepting': '停止拦截',
    'Invoice past due': '账单已逾期',
    'The invoice is still unpaid. Pay the invoice or replace the card.': '这张账单仍未支付。请支付账单，或更换银行卡。',
    'Copied': '已复制',
    'Activity': '操作日志',
    'Time': '时间',
    'Operator': '操作人',
    'Remark': '备注',
    'Issued invoice': '开出账单',
    'Emailed the owner': '邮件通知店主',
    'Recorded payment': '登记收款',
    'Added credit': '添加抵扣',
    'Added charge': '补收',
    'Courtesy credit': '合作优惠抵扣',
    'Manual surcharge': '手工补收',
    'Card declined': '银行卡扣款失败',
    'No card on file': '未绑定银行卡',
    'No data': '暂无数据',
    'This invoice was not found.': '没有找到这张账单。',
    'No invoices yet.': '还没有账单。',
    'Page size': '每页条数',
    'Counted orders': '计入的订单',
    'October sample for this store. Captured BestCheckout payments count, including upsells and later refunds. Abandoned checkouts do not.': '这家店 10 月的样例。BestCheckout 上扣款成功的金额计入，含加购和之后的退款。弃单不计入。',
    'Order': '订单',
    'Result': '结果',
    'In volume': '计入成交额',
    'Note': '备注',
    'Captured': '扣款成功',
    'Refunded': '已退款',
    'Declined': '拒付',
    'Test': '测试',
    'Yes': '是',
    'No': '否',
    'Upsell included': '含加购',
    'Exchange rate locked on the capture day': '汇率按扣款当日锁定',
    'Refunds stay in the volume': '退款不从成交额中扣除',
    'Gateway decline': '支付网关拒付',
    'Test orders are excluded': '测试订单排除',
    'Pay invoice': '支付账单',
    'Pay the invoice of': '支付账单金额',
    'with the card': '使用银行卡',
    'declined payments above': '笔拒付，超过',
    'Replace card': '更换银行卡',
    'Save card': '保存银行卡',
    'Name on card': '持卡人姓名',
    'Card number': '卡号',
    'Expiry': '有效期',
    'Security code': '安全码',
    'CVC': 'CVC',
    'The full card number is not shown again. BestCheckout keeps the brand and last four digits.': '完整卡号不会再次显示。BestCheckout 只保留卡组织和后四位。',
    'We charge $1 to verify the card, then refund it. The card is saved only if the charge succeeds.': '保存时会先扣除 $1 验证银行卡，验证通过后退回。未通过则不会保存。',
    'Enter the name on the card.': '请输入持卡人姓名。',
    'Enter a card number.': '请输入卡号。',
    'Enter an expiry date as MM/YY.': '请按 MM/YY 输入有效期。',
    'Enter a future expiry date.': '请输入未过期的有效期。',
    'Enter the security code.': '请输入安全码。',
    'Verifying…': '正在验证…',
    'Charging $1 to verify this card…': '正在扣除 $1 验证银行卡…',
    'Card saved. The $1 charge will be refunded.': '银行卡已保存。扣除的 $1 将退回。',
    'Card verification failed. The $1 charge did not go through. Try another card.': '银行卡验证失败，未能扣除 $1。请换一张卡再试。',
    'Card updated': '银行卡已更新',
    'Save email': '保存邮箱',
    'Enter an email address.': '请输入邮箱。',
    'Billing email updated': '账单邮箱已更新',
    'Payment received': '已收到付款',
    'The next rate, 0.4%, starts after $1,000,000.': '下一档 0.4% 从 $1,000,000 之后开始。',
    'The next rate, 0.25%, starts after $3,000,000.': '下一档 0.25% 从 $3,000,000 之后开始。',
    'The next rate, 0.325%, starts after $1,000,000.': '下一档 0.325% 从 $1,000,000 之后开始。'
  };
  if (window.I18N && window.I18N.extend) window.I18N.extend(dict);
  if (window.I18N && window.I18N.addRules) window.I18N.addRules([
    { re: /^Pay the invoice or replace the card within (\d+) day(?:s)?, or new checkouts fall back to Shopify Checkout\.$/, zh: function (m) { return '请在 ' + m[1] + ' 天内支付账单或更换银行卡，否则新的结账会回到 Shopify Checkout。'; } },
    { re: /^Add a card and pay within (\d+) day(?:s)?, or new checkouts fall back to Shopify Checkout\.$/, zh: function (m) { return '请在 ' + m[1] + ' 天内添加银行卡并支付，否则新的结账会回到 Shopify Checkout。'; } }
  ], true);
})();
