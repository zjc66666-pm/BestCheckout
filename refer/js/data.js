/* BestCheckout software-fee referral network.
   Keep the amounts and the split rules aligned with
   BestShopio SAAS/js/pages/partners.js.
   Commission base is a Paid invoice: monthly license plus volume commission.
   A partner does not earn on their own store. */
(function () {
  'use strict';

  var RANKS = [
    { name: 'Seller', direct: 25, passup: 10, at: 0 },
    { name: 'Advanced', direct: 30, passup: 15, at: 30000 },
    { name: 'Leader', direct: 35, passup: 20, at: 150000 },
    { name: 'Director', direct: 35, passup: 25, at: 600000 }
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
    { id: 'north', name: 'Northstar Owner', email: 'hello@northstar.myshopify.com', code: 'NORTH', parentId: '' },
    { id: 'atelier', name: 'Atelier Owner', email: 'hello@atelier.myshopify.com', code: 'ATELIER', parentId: '' },
    { id: 'harbor', name: 'Harbor Owner', email: 'hello@harbor.myshopify.com', code: 'HARBOR', parentId: '' },
    { id: 'river', name: 'River Owner', email: 'hello@river-remedy.myshopify.com', code: 'RIVER', parentId: '' }
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
    'Northstar': 'north',
    'Atelier': 'atelier',
    'Harbor': 'harbor',
    'River Remedy': 'river'
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
    { id: 'plover', store: 'Plover Studio', month: '', status: 'Not billed', collected: 0, referrerId: 'riley' }
  ];

  function partner(id) {
    for (var i = 0; i < partners.length; i++) if (partners[i].id === id) return partners[i];
    return null;
  }
  function ownerOf(storeName) {
    return partner(owners[storeName] || '');
  }
  function storeOf(id) {
    var found = '';
    Object.keys(owners).forEach(function (storeName) {
      if (!found && owners[storeName] === id) found = storeName;
    });
    return found;
  }
  function personal(id) {
    var total = 0;
    stores.forEach(function (store) {
      if (store.referrerId === id && store.status === 'Paid') total += store.collected;
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
  function splits(store) {
    if (!store || store.status !== 'Paid') return [];
    var person = partner(store.referrerId);
    if (!person) return [];
    var rank = rankOf(person.id).current;
    var amount = Math.round(store.collected * rank.direct / 100);
    var rate = rank.direct;
    var kind = 'Direct';
    var cap = Math.floor(store.collected * 40 / 100);
    var total = 0;
    var out = [];
    var hops = 0;
    while (person && hops < 12) {
      if (amount < 100) break;
      if (total + amount > cap) amount = cap - total;
      if (amount < 100) break;
      out.push({
        partnerId: person.id,
        storeId: store.id,
        store: store.store,
        month: store.month,
        kind: kind,
        rate: rate,
        amount: amount
      });
      total += amount;
      var parent = partner(person.parentId);
      if (!parent) break;
      var childAmount = amount;
      var childId = person.id;
      rate = rankOf(parent.id).current.passup;
      amount = Math.round(childAmount * rate / 100);
      person = parent;
      kind = 'Downline';
      hops += 1;
      if (amount >= 100 && out.length) out[out.length - 1].childOfNext = childId;
      out[out.length - 1].nextBase = childAmount;
    }
    out.forEach(function (row, index) {
      if (index === 0) return;
      row.fromId = out[index - 1].partnerId;
      row.baseAmount = out[index - 1].amount;
    });
    return out;
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

  var withdrawals = [];
  function reserved(id) {
    var total = 0;
    withdrawals.forEach(function (item) {
      if (item.partnerId === id) total += item.amount;
    });
    return total;
  }
  function available(id) {
    return Math.max(0, earned(id) - reserved(id));
  }
  function withdrawalsFor(id) {
    return withdrawals.filter(function (item) { return item.partnerId === id; });
  }
  function requestWithdrawal(id, paypal) {
    var amount = available(id);
    var waiting = withdrawals.some(function (item) { return item.partnerId === id && item.status === 'Pending'; });
    if (amount < 5000 || waiting) return null;
    var item = {
      id: 'wd-' + (withdrawals.length + 1),
      partnerId: id,
      amount: amount,
      paypal: paypal,
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
    storeOf: storeOf,
    personal: personal,
    rankOf: rankOf,
    splits: splits,
    earned: earned,
    money: money,
    linkFor: linkFor,
    available: available,
    withdrawalsFor: withdrawalsFor,
    requestWithdrawal: requestWithdrawal
  };
})();
