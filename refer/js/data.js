/* BestCheckout software-fee referral network.
   Keep the amounts and the split rules aligned with
   BestShopio SAAS/js/pages/partners.js.
   Commission base is a Paid invoice: monthly license plus volume commission.
   Direct commission is paid for 24 months from that store's first Paid invoice.
   Downline commission does not stop.
   A partner does not earn on their own store. */
(function () {
  'use strict';

  var RANKS = [
    { name: 'Seller', direct: 15, passup: 20, at: 0 },
    { name: 'Advanced', direct: 20, passup: 20, at: 500000 },
    { name: 'Leader', direct: 22, passup: 20, at: 2000000 },
    { name: 'Director', direct: 25, passup: 20, at: 8000000 }
  ];

  var partners = [
    { id: 'ana', name: 'Ana Ruiz', email: 'ana.ruiz@northwind.test', code: 'ANA', parentId: '' },
    { id: 'ben', name: 'Ben Ortiz', email: 'ben.ortiz@northwind.test', code: 'BEN', parentId: 'ana' },
    { id: 'chen', name: 'Chen Park', email: 'chen.park@northwind.test', code: 'CHEN', parentId: 'ben' },
    { id: 'dana', name: 'Dana Hale', email: 'avery@lavenderlabs.com', code: 'DANA', parentId: 'chen' },
    { id: 'noah', name: 'Noah Linden', email: 'billing@lindengoods.co', code: 'NOAH', parentId: 'dana' },
    { id: 'riley', name: 'Riley Cho', email: 'hello@maplegoods.co', code: 'RILEY', parentId: 'dana' },
    { id: 'nina', name: 'Nina Alvarez', email: 'ops@northlinegoods.co', code: 'NINA', parentId: 'dana' },
    { id: 'june', name: 'June Hale', email: 'june@heyjune.co', code: 'JUNE', parentId: 'dana' },
    { id: 'sam', name: 'Sam Ortega', email: 'hello@bramblemarket.com', code: 'SAM', parentId: 'dana' },
    { id: 'quinn', name: 'Quinn Adeyemi', email: 'hello@auraliving.co', code: 'QUINN', parentId: 'dana' },
    { id: 'mia', name: 'Mia Folast', email: 'mia@folast-studio.com', code: 'MIA', parentId: 'dana' },
    { id: 'owen', name: 'Owen Brooks', email: 'owen@marlowsupply.com', code: 'OWEN', parentId: 'noah' },
    { id: 'leo', name: 'Leo Kim', email: 'hello@kilncoffee.co', code: 'LEO', parentId: 'noah' },
    { id: 'pat', name: 'Pat Plover', email: 'hello@ploverstudio.com', code: 'PAT', parentId: 'riley' },
    { id: 'loom', name: 'Loom Cho', email: 'hello@loom-studio.com', code: 'LOOM', parentId: 'riley' },
    { id: 'birch', name: 'Birch Alvarez', email: 'hello@birch-market.com', code: 'BIRCH', parentId: 'nina' },
    { id: 'oak', name: 'Oak Ortega', email: 'hello@oak-goods.com', code: 'OAK', parentId: 'sam' },
    { id: 'moss', name: 'Moss Adeyemi', email: 'hello@moss-studio.com', code: 'MOSS', parentId: 'quinn' },
    { id: 'north', name: 'Northstar Owner', email: 'hello@northstar.myshopify.com', code: 'NORTH', parentId: '' },
    { id: 'atelier', name: 'Atelier Owner', email: 'hello@atelier.myshopify.com', code: 'ATELIER', parentId: '' },
    { id: 'harbor', name: 'Harbor Owner', email: 'hello@harbor.myshopify.com', code: 'HARBOR', parentId: '' },
    { id: 'river', name: 'River Owner', email: 'hello@river-remedy.myshopify.com', code: 'RIVER', parentId: '' },
    { id: 'seller', name: 'Seller Demo', email: 'seller@bestcheckout.demo', code: 'MIX', parentId: '' },
    { id: 'ava', name: 'Ava Advanced', email: 'advanced@bestcheckout.demo', code: 'AVA', parentId: '' },
    { id: 'drew', name: 'Drew Director', email: 'director@bestcheckout.demo', code: 'DREW', parentId: '' },
    { id: 'pip', name: 'Pip Brooks', email: 'pip@bestcheckout.demo', code: 'PIP', parentId: 'drew' }
  ];

  var owners = {
    'Lavender Labs': 'dana',
    'Linden Goods': 'noah',
    'Maple Goods': 'riley',
    'Northline Goods': 'nina',
    'Hey June': 'june',
    'Bramble Market': 'sam',
    'Aura Living': 'quinn',
    'Folast Studio': 'mia',
    'Marlow Supply': 'owen',
    'Kiln Coffee': 'leo',
    'Plover Studio': 'pat',
    'Loom Studio': 'loom',
    'Birch Market': 'birch',
    'Oak Goods': 'oak',
    'Moss Studio': 'moss',
    'Northstar': 'north',
    'Atelier': 'atelier',
    'Harbor': 'harbor',
    'River Remedy': 'river',
    'Cedar Supply': 'seller',
    'Gale Goods': 'seller',
    'Drift Market': 'seller',
    'Elm Goods': 'seller',
    'Fern Studio': 'seller',
    'Ivy Living': 'ava',
    'Juniper Goods': 'drew',
    'Piper Shelf': 'pip',
    'Quill Goods': 'harbor'
  };

  /* September totals follow the merchant billing prototype:
     volume commission at 0.50% of that month's captured volume, plus the monthly license. */
  var stores = [
    { id: 'linden-2026-09', store: 'Linden Goods', month: 'September 2026', status: 'Paid', collected: 63000, referrerId: 'dana' },
    { id: 'maple-2026-09', store: 'Maple Goods', month: 'September 2026', status: 'Paid', collected: 42500, referrerId: 'dana' },
    { id: 'northline-2026-09', store: 'Northline Goods', month: 'September 2026', status: 'Paid', collected: 105000, referrerId: 'dana' },
    { id: 'marlow-2026-09', store: 'Marlow Supply', month: 'September 2026', status: 'Paid', collected: 58000, referrerId: 'noah' },
    { id: 'northline-2026-10', store: 'Northline Goods', month: 'October 2026', status: 'Charge failed', collected: 0, referrerId: 'dana' },
    { id: 'marlow-2026-10', store: 'Marlow Supply', month: 'October 2026', status: 'Charge failed', collected: 0, referrerId: 'noah' },
    { id: 'heyjune-2026-09', store: 'Hey June', month: 'September 2026', status: 'Past due', collected: 0, referrerId: 'dana' },
    { id: 'kiln-2026-09', store: 'Kiln Coffee', month: 'September 2026', status: 'Past due', collected: 0, referrerId: 'noah' },
    { id: 'bramble', store: 'Bramble Market', month: '', status: 'Not billed', collected: 0, referrerId: 'dana' },
    { id: 'aura', store: 'Aura Living', month: '', status: 'Not billed', collected: 0, referrerId: 'dana' },
    { id: 'folast', store: 'Folast Studio', month: '', status: 'Not billed', collected: 0, referrerId: 'dana' },
    { id: 'plover', store: 'Plover Studio', month: '', status: 'Not billed', collected: 0, referrerId: 'riley' },
    { id: 'loom-2026-09', store: 'Loom Studio', month: 'September 2026', status: 'Paid', collected: 12000, referrerId: 'riley' },
    { id: 'birch-2026-09', store: 'Birch Market', month: 'September 2026', status: 'Paid', collected: 46000, referrerId: 'nina' },
    { id: 'oak-2026-08', store: 'Oak Goods', month: 'August 2026', status: 'Paid', collected: 22000, referrerId: 'sam' },
    { id: 'moss-2026-09', store: 'Moss Studio', month: 'September 2026', status: 'Paid', collected: 38000, referrerId: 'quinn' },
    { id: 'cedar-2026-09', store: 'Cedar Supply', month: 'September 2026', status: 'Paid', collected: 8000, referrerId: 'seller' },
    { id: 'gale-2026-07', store: 'Gale Goods', month: 'July 2026', status: 'Paid', collected: 10000, referrerId: 'seller' },
    { id: 'drift-2026-10', store: 'Drift Market', month: 'October 2026', status: 'Past due', collected: 0, referrerId: 'seller' },
    { id: 'elm-2026-08', store: 'Elm Goods', month: 'August 2026', status: 'Charge failed', collected: 0, referrerId: 'seller' },
    { id: 'fern', store: 'Fern Studio', month: '', status: 'Not billed', collected: 0, referrerId: 'seller' },
    { id: 'ivy-2026-11', store: 'Ivy Living', month: 'November 2026', status: 'Paid', collected: 600000, referrerId: 'ava' },
    { id: 'juniper-2026-11', store: 'Juniper Goods', month: 'November 2026', status: 'Paid', collected: 8000000, referrerId: 'drew' },
    { id: 'piper-2026-09', store: 'Piper Coffee', month: 'September 2026', status: 'Paid', collected: 20000, referrerId: 'pip' },
    { id: 'quill-2026-09', store: 'Quill Goods', month: 'September 2026', status: 'Paid', collected: 20000, referrerId: 'chen' }
  ];

  function partner(id) {
    for (var i = 0; i < partners.length; i++) if (partners[i].id === id) return partners[i];
    return null;
  }
  function ownerOf(storeName) {
    return partner(owners[storeName] || '');
  }
  var ACCOUNT_PARTNER = {
    'hello@lavenderlabs.co': 'dana',
    'avery@lavenderlabs.com': 'dana',
    'downline@bestcheckout.demo': 'chen',
    'seller@bestcheckout.demo': 'seller',
    'advanced@bestcheckout.demo': 'ava',
    'director@bestcheckout.demo': 'drew'
  };
  var OWN_CODE_KEY = 'bc-own-referral-codes';
  function readOwnCodes() {
    try {
      var raw = window.localStorage.getItem(OWN_CODE_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) { return {}; }
  }
  function rememberOwnCode(email, code) {
    var all = readOwnCodes();
    all[email] = code;
    try { window.localStorage.setItem(OWN_CODE_KEY, JSON.stringify(all)); } catch (err) { /* keep the in-memory code */ }
  }
  function randomReferralCode(taken) {
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var code = '';
    var guard = 0;
    do {
      code = '';
      for (var i = 0; i < 6; i++) code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      guard += 1;
    } while (taken[code] && guard < 40);
    return code;
  }
  function assignReferralCode(email) {
    var taken = {};
    partners.forEach(function (person) {
      if (String(person.email || '').toLowerCase() !== email) taken[person.code] = true;
    });
    var saved = readOwnCodes();
    Object.keys(saved).forEach(function (item) {
      if (item !== email && /^[A-Z]{6}$/.test(saved[item])) taken[saved[item]] = true;
    });
    var current = saved[email] || '';
    var code = /^[A-Z]{6}$/.test(current) && !taken[current] ? current : randomReferralCode(taken);
    rememberOwnCode(email, code);
    return code;
  }
  function forAccount(email) {
    var key = String(email || '').trim().toLowerCase();
    if (ACCOUNT_PARTNER[key]) return partner(ACCOUNT_PARTNER[key]);
    var found = null;
    partners.forEach(function (person) {
      if (!found && String(person.email || '').toLowerCase() === key) found = person;
    });
    if (found) return found;
    var unique = assignReferralCode(key);
    var person = { id: 'acct-' + key.replace(/[^a-z0-9]/g, '').slice(0, 24), name: key, email: key, code: unique, parentId: '' };
    partners.push(person);
    return person;
  }
  function storeOf(id) {
    var found = '';
    Object.keys(owners).forEach(function (storeName) {
      if (!found && owners[storeName] === id) found = storeName;
    });
    return found;
  }
  function personal(id) {
    var end = invoiceMonth('November 2026');
    var start = end - 11;
    var total = 0;
    stores.forEach(function (store) {
      if (store.referrerId !== id || store.status !== 'Paid') return;
      var index = invoiceMonth(store.month);
      if (index == null || index < start || index > end) return;
      total += store.collected;
    });
    return total;
  }
  function rankOf(id) {
    var cents = personal(id);
    var current = RANKS[0];
    var next = null;
    RANKS.forEach(function (rank) {
      if (cents >= rank.at) current = rank;
      if (!next && rank.at > cents) next = rank;
    });
    return { current: current, next: next, personal: cents };
  }
  var MONTH_INDEX = { January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6, August: 7, September: 8, October: 9, November: 10, December: 11 };
  function invoiceMonth(label) {
    var parts = String(label || '').split(' ');
    var month = MONTH_INDEX[parts[0]];
    var year = Number(parts[1]);
    if (month == null || !year) return null;
    return year * 12 + month;
  }
  function splits(store) {
    if (!store || store.status !== 'Paid') return [];
    var person = partner(store.referrerId);
    if (!person) return [];
    var amount = Math.round(store.collected * 30 / 100);
    if (amount < 1) return [];
    return [{
      partnerId: person.id,
      storeId: store.id,
      store: store.store,
      month: store.month,
      kind: 'Direct',
      rate: 30,
      amount: amount
    }];
  }
  function earned(id) {
    var total = 0;
    stores.forEach(function (store) {
      splits(store).forEach(function (row) {
        if (row.partnerId === id) total += row.amount;
      });
    });
    return total;
  }
  function money(cents) {
    var sign = cents < 0 ? '-' : '';
    var parts = (Math.abs(cents) / 100).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + '$' + parts.join('.');
  }
  function linkFor(person) {
    return 'https://bestcheckout.com/?ref=' + person.code;
  }

  var withdrawals = [
    { id: 'wd-9', partnerId: 'dana', amount: 5000, payout: { method: 'paypal', email: 'hello@lavenderlabs.co', bank: '', account: '' }, status: 'Pending', at: 'Nov 17, 2026' },
    { id: 'wd-8', partnerId: 'dana', amount: 5000, payout: { method: 'paypal', email: 'hello@lavenderlabs.co', bank: '', account: '' }, status: 'Processing', at: 'Nov 12, 2026' },
    { id: 'wd-5', partnerId: 'dana', amount: 8640, payout: { method: 'paypal', email: 'hello@lavenderlabs.co', bank: '', account: '' }, status: 'Withdrawn', at: 'Nov 3, 2026' },
    { id: 'wd-7', partnerId: 'dana', amount: 8000, payout: { method: 'paypal', email: 'hello@lavenderlabs.co', bank: '', account: '' }, status: 'Failed', at: 'Oct 21, 2026' },
    { id: 'wd-2', partnerId: 'dana', amount: 6400, payout: { method: 'paypal', email: 'hello@lavenderlabs.co', bank: '', account: '' }, status: 'Withdrawn', at: 'Aug 11, 2026' },
    { id: 'wd-6', partnerId: 'seller', amount: 3000, payout: { method: 'paypal', email: 'seller@bestcheckout.demo', bank: '', account: '' }, status: 'Withdrawn', at: 'Aug 4, 2026' },
    { id: 'wd-10', partnerId: 'chen', amount: 6000, payout: { method: 'paypal', email: 'downline@bestcheckout.demo', bank: '', account: '' }, status: 'Failed', at: 'Oct 21, 2026' }
  ];
  var payoutAccounts = {
    dana: { method: 'paypal', email: 'hello@lavenderlabs.co', holder: '', country: '', bank: '', account: '', swift: '' },
    seller: { method: 'paypal', email: 'seller@bestcheckout.demo', holder: '', country: '', bank: '', account: '', swift: '' },
    ava: { method: 'paypal', email: 'advanced@bestcheckout.demo', holder: '', country: '', bank: '', account: '', swift: '' },
    chen: { method: 'paypal', email: 'downline@bestcheckout.demo', holder: '', country: '', bank: '', account: '', swift: '' }
  };
  function payoutAccount(id) {
    return payoutAccounts[id] || null;
  }
  function setPayoutAccount(id, account) {
    account = account || {};
    payoutAccounts[id] = {
      method: 'paypal',
      email: String(account.email || '').trim(),
      holder: String(account.holder || '').trim(),
      country: String(account.country || '').trim(),
      bank: String(account.bank || '').trim(),
      account: String(account.account || '').replace(/\s+/g, ''),
      swift: String(account.swift || '').trim().toUpperCase()
    };
    return payoutAccounts[id];
  }
  function reserved(id) {
    var total = 0;
    withdrawals.forEach(function (item) {
      if (item.partnerId !== id) return;
      if (item.status === 'Failed') return;
      total += item.amount;
    });
    return total;
  }
  function available(id) {
    return Math.max(0, earned(id) - reserved(id));
  }
  function withdrawalsFor(id) {
    return withdrawals.filter(function (item) { return item.partnerId === id; });
  }
  var settledCommissions = { 'gale-2026-07|seller': true };
  function commissionWithdrawn(storeId, partnerId) {
    return !!settledCommissions[storeId + '|' + partnerId];
  }
  function markCommissionWithdrawn(storeId, partnerId) {
    settledCommissions[storeId + '|' + partnerId] = true;
  }
  function requestWithdrawal(id) {
    var account = payoutAccounts[id];
    var amount = available(id);
    var waiting = withdrawals.some(function (item) { return item.partnerId === id && (item.status === 'Pending' || item.status === 'Processing'); });
    if (!account || amount < 5000 || waiting) return null;
    var item = {
      id: 'wd-' + (withdrawals.length + 1),
      partnerId: id,
      amount: amount,
      payout: {
        method: 'paypal',
        email: account.email,
        bank: account.bank,
        account: account.account
      },
      status: 'Pending',
      at: 'Nov 17, 2026'
    };
    withdrawals.unshift(item);
    return item;
  }

  window.BestCheckoutRefer = {
    RANKS: RANKS,
    partners: partners,
    stores: stores,
    partner: partner,
    ownerOf: ownerOf,
    forAccount: forAccount,
    storeOf: storeOf,
    personal: personal,
    rankOf: rankOf,
    splits: splits,
    earned: earned,
    money: money,
    linkFor: linkFor,
    available: available,
    withdrawalsFor: withdrawalsFor,
    commissionWithdrawn: commissionWithdrawn,
    markCommissionWithdrawn: markCommissionWithdrawn,
    requestWithdrawal: requestWithdrawal,
    payoutAccount: payoutAccount,
    setPayoutAccount: setPayoutAccount
  };
})();
