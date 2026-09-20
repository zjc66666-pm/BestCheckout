/* BestShopio Admin · Settings prototype — SPA sub-module of the shared shell.
   When the route is #/settings/* the shell (../assets/shell.js) renders the
   settings sidebar (7 items) + a "Settings" bar, then mounts this module via
   window.VIEWS.settings.render(rootEl, rest). This file renders ONLY the content
   of the active settings sub-page into #root (NO internal left sub-nav). `rest`
   (the part after #/settings/) selects the sub-page.
   Mirrors reference/bestvoy-admin web-antd settings/** views & copy exactly.
   SECURITY: secret fields render masked placeholders only — never plaintext. */
(function () {
  const D = window.DATA_SETTINGS;
  let root; // set by the SPA shell router via VIEWS.settings.render(el, rest)
  let shopifyConnectionSetupOpen = new URLSearchParams(window.location.search).get('connect') === 'shopify';

  function setShopifyConnectionSetupRoute(open) {
    const destination = new URL(window.location.href);
    if (open) destination.searchParams.set('connect', 'shopify');
    else destination.searchParams.delete('connect');
    window.history.replaceState(null, '', destination.pathname + destination.search + destination.hash);
    shopifyConnectionSetupOpen = open;
  }

  // tiny html -> element helper (same pattern as orders prototype)
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---- inline icons (match shell.js .nav-ico style) ----
  const svg = (p, w) => '<svg viewBox="0 0 24 24" width="' + (w || 18) + '" height="' + (w || 18) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  const I = {
    truck:  svg('<path d="M10 17h4V5H2v12h2"/><path d="M14 9h4l4 4v4h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="17.5" cy="17.5" r="1.5"/>'),
    chevR:  svg('<path d="m9 18 6-6-6-6"/>', 16),
    chevL:  svg('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>', 18),
    chevD:  svg('<path d="m6 9 6 6 6-6"/>', 16),
    plus:   svg('<path d="M12 5v14M5 12h14"/>', 16),
    image:  svg('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.35-4.35a2 2 0 0 0-2.83 0L5 19"/>', 18),
    x:      svg('<path d="M18 6 6 18M6 6l12 12"/>', 16),
    globe:  svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14.5 14.5 0 0 0 0 18 14.5 14.5 0 0 0 0-18"/>', 16),
    check:  svg('<path d="M20 6 9 17l-5-5"/>', 14),
    tagSm:  svg('<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1.3"/>', 18),
    grid:   svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>', 18),
    pencil: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>', 16),
    trash:  svg('<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>', 16),
    dots:   svg('<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>', 16),
    grip:   svg('<circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/>', 16),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>', 16),
    info:   svg('<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>', 16),
    analytics: svg('<path d="M4 19V10M10 19V5M16 19v-7M22 19H2"/>', 18),
    facebook:  svg('<path d="M14.5 4.5h-2.2A3.3 3.3 0 0 0 9 7.8V10H6v4h3v6h4v-6h3l.8-4H13V8.2c0-.8.3-1.2 1.3-1.2h2.5V3.2c-.7-.1-1.5-.2-2.3-.2Z"/>', 18),
    google:    svg('<path d="M20.5 12.2c0 4.7-3.2 8-8.3 8A8.2 8.2 0 1 1 12 3.8c2.1 0 3.8.8 5.1 2L15 7.8A4.8 4.8 0 1 0 16 13h-3.8V10h8.1c.1.5.2 1.1.2 2.2Z"/>', 18),
    external: svg('<path d="M14 5h5v5"/><path d="M10 14 19 5"/><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>', 14),
    alert: svg('<path d="M10.3 4.2 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>', 16),
    refresh: svg('<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v5h-5"/>', 16),
    eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>', 16),
  };

  // Backend returns required[] and existing[]. This prototype keeps the same
  // contract: compare the two lists and do not group scopes on the merchant UI.
  const SHOPIFY_SCOPES_DOCS = 'https://shopify.dev/docs/api/usage/access-scopes';
  const SHOPIFY_REQUIRED_SCOPES = [
    'read_customers', 'read_discounts', 'read_inventory', 'write_order_edits', 'read_order_edits',
    'read_orders', 'write_orders', 'read_products', 'read_purchase_options', 'read_reports', 'read_script_tags',
    'write_script_tags', 'read_shipping', 'write_draft_orders', 'read_draft_orders', 'read_legal_policies'
  ];

  function currentShopifyStore() {
    const stores = window.STORES || [];
    const name = (window.SITE && window.SITE.store) || (stores[0] && stores[0].name) || 'Lavender Labs';
    return stores.filter((store) => store.name === name)[0] || stores[0] || { name: name, url: 'lavender-labs.myshopify.com' };
  }

  function shopifyStoreHandle(store) {
    return String((store && store.url) || '').replace(/\.myshopify\.com$/i, '') || 'lavender-labs';
  }

  // Store A (first connected store) has a complete grant. Store B is the
  // common “created the app with too few scopes” case used in this prototype.
  function shopifyGrantedScopeIds(store) {
    const healthy = typeof window.shopifyPermissionsHealthy === 'function'
      ? window.shopifyPermissionsHealthy(store && store.name)
      : !(window.STORES && window.STORES[1] && store && store.name === window.STORES[1].name);
    if (!healthy) return ['read_products', 'read_inventory', 'read_discounts'];
    return SHOPIFY_REQUIRED_SCOPES.slice();
  }

  function shopifyAdminUrl(store) {
    return 'https://admin.shopify.com/store/' + encodeURIComponent(shopifyStoreHandle(store));
  }

  function subscriptionState() {
    if (!D.subscriptions) D.subscriptions = { lastSyncedLabel: 'just now', sellingPlans: [], contracts: [] };
    if (!D.subscriptions.contracts) D.subscriptions.contracts = [];
    return D.subscriptions;
  }

  function merchantPlans() {
    return (subscriptionState().sellingPlans || []).filter((p) => p && p.origin === 'bestcheckout');
  }
  function intervalLabel(interval) {
    if (!interval) return '—';
    const unit = interval.every === 1 ? interval.unit : interval.unit + 's';
    return 'Every ' + interval.every + ' ' + unit;
  }
  function checkoutCadenceLabel(interval) {
    const every = Number(interval && interval.every);
    const raw = String((interval && interval.unit) || '').toLowerCase();
    if (!every || !raw) return 'Delivery every 1 month';
    const unit = every === 1 ? raw.replace(/s$/, '') : (/s$/.test(raw) ? raw : raw + 's');
    return 'Delivery every ' + every + ' ' + unit;
  }

  function discountLabel(discount) {
    if (!discount) return '—';
    if (discount.type === 'percent') return discount.value + '% off';
    return '$' + Number(discount.value).toFixed(2) + ' off';
  }
  function intervalDiscountText(p) {
    return intervalLabel(p && p.interval) + ' · ' + discountLabel(p && p.discount);
  }
  function intervalDiscountLines(p) {
    const terms = intervalDiscountText(p);
    const bun = activeBundleFor(p && p.product, p && p.productId);
    const tiers = (bun && bun.tiers) || [];
    if (!tiers.length) return [terms];
    return tiers.map((t) => {
      const name = String((t && t.title) || '').trim() || ('Buy ' + ((t && t.qty) || 1));
      return name + ' · ' + terms;
    });
  }
  function intervalDiscountTitle(p) {
    return intervalDiscountLines(p).join('\n');
  }
  function intervalDiscountCell(p) {
    const lines = intervalDiscountLines(p);
    if (lines.length === 1) return esc(lines[0]);
    return '<div class="sub-offer">' + lines.map((line) => '<div>' + esc(line) + '</div>').join('') + '</div>';
  }

  function mappingPill(mapping) {
    if (mapping === 'mapped') return '<span class="pill pill-green">Ready to use</span>';
    if (mapping === 'unmatched') return '<span class="pill pill-orange">Product not synced</span>';
    if (mapping === 'skipped') return '<span class="pill pill-gray">Not used</span>';
    return '<span class="pill pill-orange">Product not synced</span>';
  }

  function refreshSellingPlans(done) {
    const state = subscriptionState();
    state.lastSyncedLabel = 'just now';
    state.lastSyncedAt = '2026-09-05 14:10';
    toast('Subscriptions refreshed from Shopify');
    if (done) done();
  }

  // The shared shell translates lazily rendered views at runtime. Register this
  // page's copy here so the Chinese interface stays coherent without changing
  // the English source strings used by the rest of the prototype.
  if (window.I18N && window.I18N.extend) {
    window.I18N.extend({
      'Subscriptions': '订阅',
      'Plans': '订阅',
      'Contracts': '合同',
      'Created after a successful BestCheckout payment. Shopify app contracts stay in that app.': '支付成功后才会在 BestCheckout 生成。Shopify 订阅应用里的合同仍留在原应用。',
      'Contract ID': '合同 ID',
      'Contracts ID': '合同 ID',
      'Search customer': '搜索客户',
      'Search email': '搜索邮箱',
      'Search plan': '搜索订阅',
      'Search subscription': '搜索订阅',
      'Subscription': '订阅',
      'Search contract ID': '搜索合同 ID',
      'No contracts in this view.': '这个视图里还没有合同。',
      'Next charge': '下次扣款',
      'Past due': '逾期',
      'Cancelled': '已取消',
      'Frequency': '周期',
      'Amount per cycle': '每期金额',
      'Charges completed': '已扣款次数',
      'Billing schedule': '扣款计划',
      'Upcoming orders': '即将扣款',
      'Past orders': '历史订单',
      'Activity log': '活动记录',
      'Change shipping address': '编辑收货地址',
      'Edit shipping address': '编辑收货地址',
      'Retry payment now': '立即重试扣款',
      'Update payment method': '更新支付方式',
      'Cancel subscription': '取消订阅',
      'Cancel this subscription? It will stop future charges.': '取消这份订阅？之后将不再扣款。',
      'Enter an email.': '请输入邮箱。',
      'Enter a country/region.': '请输入国家/地区。',
      'Select a country/region.': '请选择国家/地区。',
      'Enter a first name.': '请输入名。',
      'Enter a last name.': '请输入姓。',
      'Enter an address.': '请输入地址。',
      'Enter a state.': '请输入州/省。',
      'Select a state.': '请选择州/省。',
      'Enter a city.': '请输入城市。',
      'Select a city.': '请选择城市。',
      'Enter a ZIP code.': '请输入邮编。',
      'This contract was not found': '找不到这份合同。',
      'Selling plans from Shopify': '来自 Shopify 的订阅',
      'Imported from Shopify Selling Plans. Create or edit them in Shopify or your subscription app.': '从 Shopify 导入。请在 Shopify 或订阅应用中创建和编辑。',
      'If the product has an active Bundle, shoppers pick One-time or Subscribe & Save on the product page. Products without a Bundle still use checkout intercept.': '商品有启用中的套装时，买家在商品页选择一次性购买或订阅省。没有套装的普通商品仍走结账拦截。',
      'Create subscriptions here. Plans from Shopify, Appstle, Skio, or Kaching are not imported — recreate them if you still need them. With an active Bundle, shoppers pick One-time or Subscribe & Save on the product page. Without a Bundle, BestCheckout does not take over the product page; checkout follows the shopper\'s subscribe checkbox only when this plan is active.': '请在这里创建订阅。Shopify、Appstle、Skio、Kaching 里的订阅不会导入，需要的请重新建。有启用套装时，买家在商品页购买选项里选一次性或订阅省。没有套装则不接管商品页；买家已勾选订阅且本计划已启用，结账才按订阅走，否则一次性。',
      'Create the offer here. Shopify subscription apps are not imported. If this product has an active Bundle, shoppers see it on the product page; otherwise it is offered at checkout only.': '请在这里创建订阅。不会从 Shopify 订阅应用导入。该商品有启用套装时出现在商品页买盒，否则只在结账拦截中提供。',
      'Subscribe & Save offers one product or bundle on a recurring schedule. If that product has an active Bundle, shoppers pick one-time or subscribe on its product page; otherwise it is offered at checkout.': '“订阅省”按周期绑定一个商品或套装。该商品有启用套装时，买家在商品页选择一次性购买或订阅；否则只在结账拦截中提供。',
      'Subscribe & Save offers one product or bundle on a recurring schedule. Customers pick one-time or subscribe on its product page.': '“订阅省”按周期绑定一个商品或套装。客户在商品页选择一次性购买或订阅。',
      'Enter a discount of 0 or more.': '请输入不小于 0 的折扣。',
      'Billing': '扣款',
      'Performance': '数据表现',
      'Created': '创建时间',
      'Add product': '添加商品',
      'Purchase options': '购买方式',
      'One-time Purchase': '一次性购买',
      'Subscribe & Save': '订阅省',
      'Plan name': '订阅名称',
      'Bill every': '扣款周期',
      'One-time price': '一次性价格',
      'Subscription discount': '订阅折扣',
      'Percentage off': '百分比折扣',
      'Fixed amount': '固定金额',
      'Recurring price': '续订价格',
      'Commitment': '承诺期',
      'Minimum cycles': '最少期数',
      'Storefront style': '店铺展示样式',
      'Radio list': '单选列表',
      'Buttons': '按钮',
      'Bordered': '描边卡片',
      'Pills': '胶囊按钮',
      'Subscribe CTA': '订阅主按钮',
      'One-time purchase': '一次性购买',
      'Sold as a bundle': '按套装售卖',
      'Force subscription': '强制订阅',
      'When on, checkout uses this plan even if the shopper did not check Subscribe on the product page.': '开启后，即使买家没有在商品页勾选订阅，只要命中本计划，结账也按订阅走。',
      'Show delivery details': '展示配送说明',
      'When on, checkout shows the delivery interval and savings under the product.': '开启后，结账页商品下方会显示配送周期和优惠。',
      'This product has no active Bundle. Checkout uses this plan even if the shopper did not check Subscribe on the product page.': '该商品没有启用套装。即使买家没有在商品页勾选订阅，只要命中本计划，结账也按订阅走。',
      'Clear selected product': '清除已选商品',
      'No product selected': '未选择商品',
      'Subscribed tier': '订阅档位',
      'How the Subscribe & Save options look on this product\'s page.': '“订阅省”选项在该商品页上的展示样式。',
      'One product can have only one active subscription plan on the storefront. Draft/deactivated plans can be kept.': '每个商品在店铺前台只能有一个启用中的订阅。停用的订阅可以保留。',
      'Customers can\'t cancel before this many charges. 0 = cancel anytime.': '在达到该期数前买家不能取消。0 表示随时可取消。',
      'From the selected bundle tier': '来自选中的套装档位',
      'From the product': '来自商品',
      'Replace current active plan?': '要替换当前已启用的订阅吗？',
      'Replace and activate': '替换并启用',
      'Add subscription': '添加订阅',
      'Activated': '已启用',
      'Deactivated': '已停用',
      'Create subscription offers in BestCheckout. Shopify subscription apps are not imported.': '在 BestCheckout 创建订阅。不会从 Shopify 订阅应用导入。',
      'Recreate any offer you still want from Shopify, Appstle, Skio, or Kaching. With an active Bundle, shoppers pick One-time or Subscribe & Save on the product page. Without a Bundle, checkout follows the shopper\'s subscribe checkbox only when this plan is active.': 'Shopify、Appstle、Skio、Kaching 里的订阅请在这里重新创建。有启用套装时，买家在商品页购买选项里选一次性或订阅省。没有套装则不接管商品页；买家已勾选订阅且本计划已启用，结账才按订阅走。',
      'No subscriptions yet. Add a subscription to offer Subscribe & Save.': '还没有订阅。添加一条订阅即可提供订阅省。',
      'subscriptions created in BestCheckout': '条在 BestCheckout 创建的订阅',
      'Sync Shopify selling plans, or create a checkout-only plan that stays off the product page.': '可同步 Shopify 订阅，也可在这里创建订阅。有套装的商品会出现在商品页买盒。',
      'Sync Shopify subscriptions, or create a checkout-only subscription that stays off the product page.': '可同步 Shopify 订阅，也可在这里创建订阅。有套装的商品会出现在商品页买盒。',
      'Refresh Shopify subscriptions, or create a checkout-only subscription that stays off the product page.': '可刷新 Shopify 订阅，也可创建订阅。有套装的商品会出现在商品页买盒。',
      'Import Shopify Selling Plans for regular products. Products with an active Bundle show One-time / Subscribe & Save on the product page.': 'Shopify Selling Plan 导入只服务没有套装的普通商品。有启用套装的商品，买盒会显示一次性购买 / 订阅省。',
      'Shopify Selling Plan import still covers regular products without a Bundle (checkout intercept). Products with an active Bundle no longer need a Shopify Selling Plan to show Subscribe & Save on the product page.': 'Shopify Selling Plan 导入仍服务没有套装的普通商品（结账拦截）。有启用套装的商品不再依赖 Shopify Selling Plan，也能在商品页买盒出现订阅。',
      'Shopify-imported subscriptions stay on the product page. Subscriptions created in BestCheckout appear at checkout only. Multipack prices belong in Bundles.': '有启用套装的商品，订阅会出现在商品页买盒，不再依赖 Shopify Selling Plan。没有套装的普通商品仍走结账拦截。',
      'Product-level subscriptions imported from Shopify': '从 Shopify 导入的商品级订阅',
      'Shopify Selling Plans for regular products without a Bundle': '为没有套装的普通商品导入的 Shopify Selling Plan',
      'Subscriptions refreshed from Shopify': '已从 Shopify 刷新订阅',
      'This subscription was not found': '找不到这条订阅。',
      'No subscriptions yet. Refresh Shopify or add a checkout-only subscription.': '还没有订阅。请刷新 Shopify，或添加一条仅结账页订阅。',
      'No subscriptions yet. Refresh Shopify or add a subscription.': '还没有订阅。请刷新 Shopify，或添加一条订阅。',
      'Add subscription': '添加订阅',
      'Create subscription': '创建订阅',
      'Edit subscription': '编辑订阅',
      'View subscription': '查看订阅',
      'Back': '返回',
      'Save subscription': '保存订阅',
      'Delete subscription': '删除订阅',
      'Subscription name': '订阅名称',
      'Subscription ID': '订阅 ID',
      'Subscription details': '订阅详情',
      'Search subscription name': '搜索订阅名称',
      'Search subscription ID': '搜索订阅 ID',
      'Product title': '商品标题',
      'Shopify product ID': 'Shopify 商品 ID',
      'Search product title': '搜索商品标题',
      'Search Shopify product ID': '搜索 Shopify 商品 ID',
      'Search SKU': '搜索 SKU',
      'Refresh subscriptions': '刷新订阅',
      'Please enter a subscription name.': '请输入订阅名称。',
      'Shopify imported subscriptions are read-only here. Change them in Shopify or the subscription app, then refresh.': '从 Shopify 导入的订阅在这里只能查看。请到 Shopify 或订阅应用里修改，然后刷新。',
      'Bind a product. If that product has an active Bundle, shoppers see One-time / Subscribe & Save on the product page. Otherwise it is offered at checkout only.': '绑定商品。该商品有启用中的套装时，买家在商品页选择一次性购买或订阅省；否则只在结账拦截中提供。',
      'This imported subscription already appears on the Shopify product page.': '若该商品有启用中的套装，买盒会显示一次性购买 / 订阅省。',
      'BestCheckout does not write this subscription to Shopify. Buyers will not see it on the product page.': '有启用套装时，买家在商品页买盒选择订阅；没有套装时，只在结账拦截里出现。',
      'Checkout applies this subscription when the cart contains this product.': '购物车包含该商品时，结账会套用这条订阅。',
      'This product has an active Bundle. Shoppers pick One-time or Subscribe & Save on the product page. Price is the current pack × this discount.': '该商品有启用中的套装。买家在商品页选择一次性购买或订阅省。价格为当前档位价 × 订阅折扣。',
      'This product has an active Bundle. Activate this plan to show One-time / Subscribe & Save on the product page.': '该商品有启用中的套装。启用本计划后，商品页买盒会出现一次性购买 / 订阅省。',
      'This product has no active Bundle, so BestCheckout does not take over the product page. Checkout follows the shopper\'s subscribe checkbox only when this plan is active.': '该商品没有启用套装，不接管商品页。买家已勾选订阅且本计划已启用，结账才按订阅走，否则一次性。',
      'Shown on product page': '展示在商品页',
      'Product page + Checkout': '商品页 + 结账',
      'One-time Purchase': '一次性购买',
      'Subscribe & Save': '订阅省',
      'Product page preview': '商品页预览',
      'Imported Shopify subscriptions stay read-only.': '从 Shopify 导入的订阅在这里只能查看。',
      'Delete this checkout-only subscription? Checkout will stop offering it.': '删除这条仅结账页订阅？结账将不再提供该优惠。',
      'Delete this subscription? Checkout will stop offering it.': '删除这条订阅？结账将不再提供该优惠。',
      'Subscription list': '订阅列表',
      'Refresh': '刷新',
      'Ready to use': '可用',
      'Product not synced': '商品未同步',
      'Not used': '未使用',
      'Selling plan': '订阅',
      'Interval': '周期',
      'Discount': '折扣',
      'Source app': '来源应用',
      'View subscriptions': '查看订阅',
      'Refresh selling plans': '刷新订阅',
      'Add plan': '添加订阅',
      'Edit plan': '编辑订阅',
      'Create plan': '创建订阅',
      'Save plan': '保存订阅',
      'Checkout only': '仅结账页',
      'Product page + checkout': '商品页 + 结账',
      'Product page + Checkout': '商品页 + 结账',
      'Product page': '商品页',
      'Shown on product page': '展示在商品页',
      'Shown on': '展示位置',
      'BestCheckout': 'BestCheckout',
      'Source': '来源',
      'Plan name': '订阅名称',
      'Shopify product': 'Shopify 商品',
      'Plan details': '订阅详情',
      'Shown as the subscription line in checkout.': '只用于后台列表，不会出现在结账行。',
      'Used in the BestCheckout list only. Checkout shows Delivery every {interval}, not this name.': '只用于 BestCheckout 后台列表。结账行按周期拼接，例如 Delivery every 1 month，不会显示这个名称。',
      'e.g. Subscribe & save': '例如 Subscribe & save',
      'Every': '每',
      'Add product': '添加商品',
      'Change': '更换',
      'No product selected': '未选择商品',
      'Checkout preview': '结账预览',
      'Billing interval': '计费周期',
      'This offer stays off the Shopify product page.': '该商品没有启用中的套装，订阅只在结账拦截中提供。',
      'This imported plan already appears on the Shopify product page.': '这条导入订阅已经出现在 Shopify 商品详情页。',
      'Create a checkout-only subscription that shoppers see after they start checkout.': '创建一个只在结账页出现的订阅，买家进入结账后才会看到。',
      'Shopify imported plans are read-only here. Change them in Shopify or the subscription app, then refresh.': '从 Shopify 导入的订阅在这里只能查看。请到 Shopify 或订阅应用里修改，然后刷新。',
      'Please enter a plan name.': '请输入订阅名称。',
      'Select a Shopify product.': '请选择一个 Shopify 商品。',
      'Interval must be at least 1.': '周期间隔必须不小于 1。',
      'Enter a discount greater than 0.': '请输入大于 0 的折扣。',
      'Percentage discount cannot exceed 100.': '百分比折扣不能超过 100。',
      'All sources': '全部来源',
      'All visibility': '全部展示位置',
      'Plan ID': '订阅 ID',
      'Search plan name': '搜索订阅名称',
      'Search product': '搜索商品',
      'Search plan ID': '搜索订阅 ID',
      'Reset': '重置',
      'Shopify': 'Shopify',
      '% off': '% 折扣',
      '$ off': '金额折扣',
      'Manage the transactional messages your store sends automatically.': '管理店铺自动发送的事务邮件。',
      'Sender identity': '发件身份',
      'Manage sender identity': '管理发件身份',
      'Verified': '已验证',
      'Reply-to': '回复地址',
      'Leave blank to use your store service email.': '留空时，默认使用店铺服务邮箱。',
      'Verified sending domain': '已验证发件域名',
      'Sending domain': '发件域名',
      'Store default sending domain': '店铺默认发件域名',
      'Branded sending domain': '品牌发件域名',
      'Add branded sending domain': '添加品牌发件域名',
      'Use a subdomain such as <b>mail.yourdomain.com</b>. We will show the verification records after you add it.': '使用如 <b>mail.yourdomain.com</b> 的子域名。添加后，我们会展示需要配置的验证记录。',
      'This domain is created for your store and is ready to send transactional email.': '此域名由系统为你的店铺生成，可立即发送事务邮件。',
      'Use your own domain to make your sender easier for customers to recognize. When it is verified, it replaces the default sender automatically.': '使用自己的域名，提高顾客对发件人的品牌识别度。验证成功后，会自动替换默认发件域名。',
      'This domain is used automatically for transactional email.': '此域名当前自动用于发送事务邮件。',
      'Correct the DNS records, then verify again.': '请修正 DNS 记录后重新验证。',
      'DNS records were not found. Correct them, then check again.': '未检测到 DNS 记录。请修正后再次验证。',
      'DNS verification failed.': 'DNS 验证失败。',
      'We could not find the DNS records. Review them, then try again.': '未检测到 DNS 记录。请检查记录后再次验证。',
      'Sending domain verified and activated': '发件域名已验证并自动启用。',
      'Add the DNS records to complete verification.': '请添加 DNS 记录以完成验证。',
      'Status': '状态',
      'Used for transactional email': '用于发送事务邮件',
      'Available after activation': '设为当前发件域名后可用',
      'Active sender domain': '当前发件域名',
      'Used by': '当前用于',
      'Waiting for sender-domain verification': '等待发件域名验证',
      'DNS records required for this candidate domain': '此候选域名需要配置 DNS 记录',
      'Ready to use as active sender domain': '可设为当前发件域名',
      'Not verified': '未验证',
      'BestCheckout default': 'BestCheckout 默认',
      'BestCheckout default sender domain': 'BestCheckout 默认发件域名',
      'Platform-managed sender domain': '平台托管发件域名',
      'Platform-generated default sender domain': '平台自动生成的默认发件域名',
      'BestShopio is verifying this default domain. No DNS action is required.': 'BestShopio 正在验证此默认域名，无需配置 DNS。',
      'Customer emails can send through this default domain.': '客户邮件可通过此默认域名立即发送。',
      'Customer emails stay off until a sender domain is verified.': '发件域名验证完成前，客户邮件保持关闭。',
      'This address will be ready after the sender domain is verified.': '发件域名验证完成后，此地址即可使用。',
      'The address uses the active BestCheckout default domain:': '发件地址使用当前 BestCheckout 默认域名：',
      'BestCheckout provisions this address for your store. Switch to a verified custom domain to edit the address prefix.': 'BestCheckout 已为你的店铺生成此发件地址。切换到已验证的自定义域名后，可编辑地址前缀。',
      'BestShopio creates a default sender domain during store setup and verifies it automatically. Add a custom domain only if you want to replace the default sender domain.': 'BestShopio 会在建店时自动生成并验证默认发件域名。只有需要替换默认发件域名时，才添加自定义域名。',
      'BestShopio creates a platform-managed default sender domain during store setup. It can send transactional email immediately. Add a custom domain only if you want to replace the default sender domain.': 'BestShopio 会在建店时自动生成平台托管的默认发件域名，可立即发送事务邮件。只有需要替换默认发件域名时，才添加自定义域名。',
      'Verify a sender domain before enabling email notifications.': '请先验证一个发件域名，再启用邮件通知。',
      'Add these records exactly at your DNS provider. Verification happens asynchronously; this prototype does not mark a pending domain as verified.': '请在你的 DNS 服务商处逐条添加这些记录。验证会异步完成；此原型不会将待验证域名标记为已验证。',
      'Checkout customer emails': '结账顾客邮件',
      'Final order confirmation': '最终订单确认',
      'Order refund': '订单退款',
      'Sent once after payment and every Upsell or Downsell decision are complete.': '付款成功且所有 Upsell / Downsell 决策完成后，仅发送一次。',
      'Configure the sender name and reply-to address customers see on your emails.': '设置顾客在邮件中看到的发件人名称和回复地址。',
      'From identity': '发件身份信息',
      'Sender address': '发件地址',
      'Sending domains': '发件域名',
      'Add domain': '添加域名',
      'Invoice': '发票',
      'Download PDF': '下载 PDF',
      'The order details, invoice and customer information are included automatically. You can use {{customer.first_name}} and {{order.number}} in this copy.': '订单明细、发票和客户信息会自动附带。正文中可使用 {{customer.first_name}} 和 {{order.number}}。',
      'Add these DNS records at your DNS provider. Verification will continue automatically after the records are found.': '请在你的 DNS 服务商处添加以下记录。检测到记录后会自动继续验证。',
      'Copy': '复制',
      'DNS record copied': 'DNS 记录已复制',
      'Waiting for DNS': '等待 DNS',
      'Active sender domain': '当前发件域名',
      'Use as active': '设为当前域名',
      'View DNS records': '查看 DNS 记录',
      'Email title': '邮件标题',
      'Message': '邮件正文',
      'Record test preview': '记录测试预览',
      'Send test': '发送测试邮件',
      'Edit code': '编辑代码',
      'Notifications': '通知',
      'Edit': '编辑',
      'Localize': '本地化',
      'Template variables': '模板变量',
      'Available variables': '可用变量',
      'Click a variable to insert it at the cursor. Blocks are inserted into the email body.': '点击变量可插入到光标处；预置区块会插入邮件正文。',
      'Only the variables and blocks listed here are supported.': '仅支持此处列出的变量和区块。',
      'Customer': '顾客',
      'Store': '店铺',
      'Order': '订单',
      'Order amounts': '订单金额',
      'Addresses': '地址',
      'Refund': '退款',
      'Prebuilt blocks': '预置区块',
      'Variable inserted': '变量已插入',
      'Variable copied': '变量已复制',
      'Email subject': '电子邮件主题',
      'Email body (HTML)': '电子邮件正文（HTML）',
      'Use Preview to check the rendered email.': '使用“预览”检查渲染后的邮件。',
      'You can use supported customer, order, and store variables in this template. Order, tracking, invoice, and address blocks are rendered safely when the email is sent.': '可在模板中使用受支持的顾客、订单和店铺变量。订单、物流、发票和地址区块会在发送时安全渲染。',
      'Add another store language to create a localized template.': '添加其他店铺语言后，即可创建本地化模板。',
      'Send test email': '发送测试邮件',
      'Recipient': '收件人',
      'Shown in the customer inbox for every transactional message.': '显示在每一封事务邮件的顾客收件箱中。',
      'Customer replies go to this address.': '顾客回复会发送到此地址。',
      'Save sender identity': '保存发件身份',
      'The email delivery service supplies the DNS records when you add a candidate domain. Domains cannot be edited; add a new candidate, verify it, then make it active.': '添加候选域名后，邮件发送服务会提供 DNS 记录。域名创建后不可编辑；如需修改，请新建候选域名、完成验证后再设为当前域名。',
      'Add sending domain': '添加发件域名',
      'Create DNS records': '生成 DNS 记录',
      'Domain': '域名',
      'Remove sending domain?': '移除发件域名？',
      'Remove domain': '移除域名',
      'Remove': '移除',
      'Remove this sending domain?': '移除此发件域名？',
      'Removing this domain cancels its verification. You can add a different domain afterwards.': '移除后会取消该域名的验证。随后可以添加其他发件域名。',
      'Complete the sender identity fields': '请填写完整的发件身份信息',
      'Sender identity saved': '发件身份已保存',
      'Active sender domain updated': '当前发件域名已更新',
      'Sending domain removed': '发件域名已移除',
      'Enter a valid domain': '请输入有效域名',
      'This sending domain is already added': '该发件域名已添加',
      'Send a test email with sample order data to check the recipient and message layout.': '向指定地址发送一封包含示例订单数据的测试邮件，用于检查收件人和邮件版式。',
      'Test email sent': '测试邮件已发送',
      'Set up your sending domain': '设置发件域名',
      'Automatic setup': '自动设置',
      'Recommended · no records to copy': '推荐 · 无需手动添加记录',
      'Connect a supported DNS provider and BestCheckout adds the verification records automatically.': '连接受支持的 DNS 服务商后，BestCheckout 会自动添加验证记录。',
      'Connect DNS provider': '连接 DNS 服务商',
      'Manual setup': '手动设置',
      'For another DNS provider': '适用于其他 DNS 服务商',
      'Add the CNAME and TXT records yourself. We’ll verify the domain after the records are found.': '自行添加 CNAME 和 TXT 记录。检测到记录后，我们会验证该域名。',
      'View DNS records': '查看 DNS 记录',
      'Hide DNS records': '收起 DNS 记录',
      'Verification records': '验证记录',
      'Check verification': '检查验证',
      'Choose the provider that manages DNS for your sending domain. We’ll add the email verification records after you authorize it.': '选择管理发件域名 DNS 的服务商。授权后，我们会添加邮件验证记录。',
      'DNS provider connected': 'DNS 服务商已连接',
      'DNS provider': 'DNS 服务商',
      'Connect': '连接',
      'Advertising & analytics': '广告数据',
      'Keep your checkout conversion data connected to Meta and Google.': '让你的结账转化数据持续回传至 Meta 和 Google。',
      'Automatic setup is active': '自动设置已启用',
      'Existing verified configuration is used automatically for new BestCheckout sessions.': '已验证的现有配置会自动用于新的 BestCheckout 结账会话。',
      'Check connection': '检查连接',
      'No channels connected': '没有已连接的渠道',
      '1 channel connected': '1 个渠道已连接',
      'Meta browser events active': 'Meta 浏览器事件已启用',
      'Meta needs attention': 'Meta 需要处理',
      'Meta not connected': 'Meta 未连接',
      'Connected automatically from your existing setup': '已根据现有设置自动连接',
      'Automatically adopted from your existing setup': '已自动复用现有设置',
      'No checkout events are sent to this destination.': '不会向此目标发送新的结账事件。',
      'Browser events': '浏览器事件',
      'Browser events active': '浏览器事件已启用',
      'Browser Pixel': '浏览器 Pixel',
      'Browser Pixel active': '浏览器 Pixel 已启用',
      'Detected storefront Pixel': '前台检测到的 Pixel',
      'Detected on your Shopify storefront': '已在 Shopify 店铺前台检测到',
      'Meta authorization': 'Meta 授权',
      'Authorized Meta data source': '已授权 Meta 数据源',
      'Authorized': '已授权',
      'Not needed': '无需授权',
      'Connect Meta': '连接 Meta',
      'Manage Meta': '管理 Meta',
      'Manage CAPI': '管理 CAPI',
      'Manage connection': '管理连接',
      'Add access token': '添加 Access Token',
      'Update access token': '更新 Access Token',
      'Add Conversions API access token': '添加 Conversions API Access Token',
      'Replace access token': '替换 Access Token',
      'Replace Conversions API access token': '替换 Conversions API Access Token',
      'Conversions API access token': 'Conversions API Access Token',
      'Save and verify': '保存并验证',
      'Update and verify': '更新并验证',
      'Manual access token': '手动填写的 Access Token',
      'Connected with a manually added access token': '已通过手动填写的 Access Token 连接',
      'Detected Pixel matched': '已匹配前台检测到的 Pixel',
      'Ready for access token': '可添加 Access Token',
      'Conversions API': 'Conversions API',
      'Conversions API connected': 'Conversions API 已连接',
      'Needs connection': '需要连接',
      'Browser only': '仅浏览器',
      'Exact Pixel match': 'Pixel 完全匹配',
      'Pixel match': 'Pixel 匹配',
      'Automatically adopted': '已自动复用',
      'Waiting for Meta authorization': '等待 Meta 授权',
      'Pixel mismatch': 'Pixel 不匹配',
      'Multiple Pixels detected': '检测到多个 Pixel',
      'No Pixel detected': '未检测到 Pixel',
      'Server events remain off until one matching Pixel is confirmed.': '在确认唯一匹配的 Pixel 前，服务端事件不会启用。',
      'Browser Pixel is active. Connect Meta to add server events.': '浏览器 Pixel 已启用。连接 Meta 后即可增加服务端事件。',
      'Browser Pixel is active. Add an access token to send server events.': '浏览器 Pixel 已启用。添加 Access Token 后即可发送服务端事件。',
      'No Meta Pixel was detected on the storefront.': '未在店铺前台检测到 Meta Pixel。',
      'A unique storefront Pixel is required before server events can be enabled.': '需先在店铺前台检测到唯一的 Pixel，才能启用服务端事件。',
      'A unique Measurement ID is required before GA4 server events can be enabled.': '需在店铺前台检测到唯一的 Measurement ID，才能启用 GA4 服务端事件。',
      'Storefront Pixel changed. Enter a new access token for the detected Pixel before server events can resume.': '店铺前台检测到的 Pixel 已变化；请为当前 Pixel 输入新的 Access Token，服务端事件才会恢复。',
      'Storefront Measurement ID changed. Enter a new API secret for the detected Measurement ID before server events can resume.': '店铺前台检测到的 Measurement ID 已变化；请为当前 Measurement ID 输入新的 API Secret，服务端事件才会恢复。',
      'Please enter a new access token for the detected Pixel.': '请为当前检测到的 Pixel 输入新的 Access Token。',
      'Please enter a new API secret for the detected Measurement ID.': '请为当前检测到的 Measurement ID 输入新的 API Secret。',
      'Add an access token to enable server events.': '添加 Access Token 后即可启用服务端事件。',
      'Browser events continue. Add an access token to also send server-side Purchase and refund events.': '浏览器事件会继续发送。添加 Access Token 后还会发送服务端的 Purchase 和退款事件。',
      'Paste the access token from Meta Events Manager. This is optional: browser events keep sending if you leave it blank.': '粘贴 Meta Events Manager 中的 Access Token。这是可选项；留空时浏览器事件会继续发送。',
      'You can view and copy the saved access token in Manage CAPI.': '可在“管理 CAPI”中查看并复制已保存的 Access Token。',
      'Select the access token to copy it.': '可选中 Access Token 后复制。',
      'Please enter a Conversions API access token.': '请输入 Conversions API Access Token。',
      'Access token saved. Server events are connected for the detected Pixel.': 'Access Token 已保存，服务端事件已连接到前台检测到的 Pixel。',
      'Access token updated. Server events remain connected for the detected Pixel.': 'Access Token 已更新，服务端事件会继续连接到前台检测到的 Pixel。',
      'Browser Pixel and server events use the same matched Pixel.': '浏览器 Pixel 与服务端事件使用同一个已匹配的 Pixel。',
      'Browser events continue while server events are not connected.': '服务端事件未连接时，浏览器事件会继续发送。',
      'Server event source': '服务端事件来源',
      'Existing server connection': '现有服务端连接',
      'Connected through Meta authorization': '已通过 Meta 授权连接',
      'Last CAPI response': '最近 CAPI 响应',
      'Meta connection': 'Meta 连接',
      'Disconnect server events': '断开服务端事件',
      'Disconnecting server events keeps the Browser Pixel active.': '断开服务端事件不会影响浏览器 Pixel。',
      'Google measurement and container IDs are read from the active configuration.': 'Google 衡量 ID 和 GTM 容器 ID 来自当前启用的配置。',
      'Connect a Meta Business and data source. BestCheckout enables server events only when one authorized Pixel matches the Pixel detected on your storefront.': '连接 Meta 商务资产和数据源。仅当一个已授权 Pixel 与店铺前台检测到的 Pixel 匹配时，BestCheckout 才会启用服务端事件。',
      'Continue to Meta': '继续前往 Meta',
      'Meta authorized. Pixel matched and server events are connected.': 'Meta 已授权，Pixel 已匹配，服务端事件已连接。',
      'Connection check complete. Browser Pixel and server events match.': '连接检查完成，浏览器 Pixel 与服务端事件已匹配。',
      'Pixel detected. Connect Meta to enable server events.': '已检测到 Pixel。连接 Meta 后可启用服务端事件。',
      'Pixel detected. Add an access token to enable server events.': '已检测到 Pixel。添加 Access Token 后可启用服务端事件。',
      'Meta authorization does not match the Pixel detected on your storefront.': 'Meta 授权资产与店铺前台检测到的 Pixel 不匹配。',
      'Server events': '服务端事件',
      'Server events connected': '服务端事件已连接',
      'GA4 event delivery': 'GA4 事件投递',
      'GTM event delivery': 'GTM 事件投递',
      'GA4 measurement ID': 'GA4 衡量 ID',
      'GTM container': 'GTM 容器',
      'GA4 server events': 'GA4 服务端事件',
      'Needs API secret': '需要 API Secret',
      'Configured': '已配置',
      'API secret (Measurement Protocol)': 'API Secret（Measurement Protocol）',
      'Add API secret': '添加 API Secret',
      'Update API secret': '更新 API Secret',
      'Manage API secret': '管理 API Secret',
      'Add GA4 Measurement Protocol API secret': '添加 GA4 Measurement Protocol API Secret',
      'Replace GA4 Measurement Protocol API secret': '替换 GA4 Measurement Protocol API Secret',
      'This enables GA4 server-side events through Measurement Protocol.': '配置后会通过 Measurement Protocol 启用 GA4 服务端事件。',
      'Please enter a Measurement Protocol API secret.': '请输入 Measurement Protocol API Secret。',
      'Measurement Protocol API secret saved. GA4 server-side events are connected.': 'Measurement Protocol API Secret 已保存，GA4 服务端事件已连接。',
      'Measurement Protocol API secret updated. GA4 server-side events remain connected.': 'Measurement Protocol API Secret 已更新，GA4 服务端事件会继续连接。',
      'GA4 browser events and GTM events are active separately. Add an API secret to send GA4 server-side events.': 'GA4 浏览器事件和 GTM 事件分别启用。添加 API Secret 后，可发送 GA4 服务端事件。',
      'GA4 browser events, GA4 server-side events, and GTM events are active separately.': 'GA4 浏览器事件、GA4 服务端事件、GTM 事件均分别启用。',
      'Events are sent directly to GA4': '事件直接发送至 GA4',
      'Events are sent to GTM': '事件发送至 GTM',
      'GA4 and GTM receive their own event streams from BestCheckout.': 'GA4 与 GTM 分别接收来自 BestCheckout 的独立事件流。',
      'Last delivery': '最近投递',
      'Test': '测试',
      'Ready for a test event': '可发送测试事件',
      'Connection is active for new checkout sessions.': '连接已对新的结账会话生效。',
      'Send test event': '发送测试事件',
      'Reconnect': '重新连接',
      'Not connected': '未连接',
      'Needs attention': '需要处理',
      'Events sent by BestCheckout': '由 BestCheckout 发送的事件',
      'Event mapping is managed automatically. You never need to select individual checkout events.': '事件映射由系统自动管理，无需逐项选择结账事件。',
      'What BestCheckout sends': 'BestCheckout 会发送的事件',
      'Once a tag is detected, BestCheckout automatically sends the checkout events shown below. You never need to configure events one by one.': '检测到标签后，BestCheckout 会自动发送下方所列的结账事件，无需逐项配置。',
      'Browser events: Detected Meta Pixel, GA4, and GTM tags receive the matching browser events in the table.': '浏览器事件：检测到的 Meta Pixel、GA4 和 GTM 标签会接收下表对应的浏览器事件。',
      'Server Purchase: After you save a Meta access token or GA4 API secret, BestCheckout also sends completed purchases (Purchase) from the server; other checkout events stay browser-only. Within each destination, browser and server copies of the same order are counted once. Meta, GA4, and GTM each receive their own events.': '服务端 Purchase：保存 Meta Access Token 或 GA4 API Secret 后，BestCheckout 还会从服务端发送已完成购买（Purchase）；其余结账事件仅由浏览器发送。同一渠道内，同一笔订单的浏览器与服务端 Purchase 只计一次；Meta、GA4 和 GTM 会分别收到各自的事件。',
      'View coverage': '查看覆盖范围',
      'Shopify storefront keeps browsing, product, search and cart events. BestCheckout owns the checkout journey. When browser and server events are both used, Purchase is counted once per order.': 'Shopify 店铺前台继续负责浏览、商品、搜索和购物车事件。BestCheckout 负责结账流程；同时使用浏览器和服务端事件时，每笔订单的 Purchase 只计为一次。',
      'BestCheckout event': 'BestCheckout 事件',
      'Delivery': '投递方式',
      'Checkout started': '开始结账',
      'Contact information': '联系信息',
      'Shipping information': '配送信息',
      'Payment information': '支付信息',
      'Post-purchase offer': '购后优惠',
      'Browser event': '浏览器事件',
      'Server event': '服务端事件',
      'Browser + server · once per order': '浏览器 + 服务端 · 每笔订单一次',
      'Browser event · Meta CAPI not connected': '浏览器事件 · Meta CAPI 未连接',
      'Meta not sent · CAPI not connected': 'Meta 不会发送 · CAPI 未连接',
      'Meta not sent · No Pixel detected': 'Meta 不会发送 · 未检测到 Pixel',
      'Checkout session · once': '结账会话 · 一次',
      'Completed purchase': '购买',
      'Shopify storefront keeps browsing, product, search and cart events. BestCheckout owns the checkout journey. Browser Pixel sends checkout events now. Connect Meta before Meta server-side Purchase and refund events are sent.': 'Shopify 店铺前台继续负责浏览、商品、搜索和购物车事件。BestCheckout 负责结账流程；当前由浏览器 Pixel 发送结账事件。连接 Meta 后，才会发送 Meta 服务端的 Purchase 和退款事件。',
      'Shopify storefront keeps browsing, product, search and cart events. BestCheckout owns the checkout journey. Browser Pixel sends checkout events now. Add an access token before Meta server-side Purchase and refund events are sent.': 'Shopify 店铺前台继续负责浏览、商品、搜索和购物车事件。BestCheckout 负责结账流程；当前由浏览器 Pixel 发送结账事件。添加 Access Token 后，才会发送 Meta 服务端的 Purchase 和退款事件。',
      'Shopify storefront keeps browsing, product, search and cart events. BestCheckout owns the checkout journey. No Meta events are sent until a storefront Pixel is detected and Meta is connected.': 'Shopify 店铺前台继续负责浏览、商品、搜索和购物车事件。需先检测到前台 Pixel 并连接 Meta，才会发送 Meta 事件。',
      'Shopify storefront keeps browsing, product, search and cart events. BestCheckout owns the checkout journey. No Meta events are sent until a storefront Pixel is detected.': 'Shopify 店铺前台继续负责浏览、商品、搜索和购物车事件。需先检测到前台 Pixel，才会发送 Meta 事件。',
      'Disconnect': '断开连接',
      'Disconnecting this destination will stop sending new BestCheckout checkout events. This does not resend or change past orders.': '断开后将停止向此目标发送新的 BestCheckout 结账事件，不会补发或改变过去的订单。',
      'Connection check complete. Existing setup remains active.': '连接检查完成，现有设置保持启用。',
      'Multiple Pixels were detected. CAPI remains off until one matching Pixel is confirmed.': '检测到多个 Pixel。在确认唯一匹配的 Pixel 前，CAPI 不会启用。',
      'No Meta Pixel was detected. No Meta events are being sent.': '未检测到 Meta Pixel。不会发送 Meta 事件。',
      'Test event recorded just now': '测试事件刚刚记录',
      'Connect Meta, GA4 and GTM for BestCheckout checkout events.': '分别连接 Meta、GA4 和 GTM，用于回传 BestCheckout 的结账事件。',
      'Meta Pixel & Conversions API': 'Meta Pixel 与 Conversions API',
      'Google Analytics 4': 'Google Analytics 4',
      'Google Tag Manager': 'Google Tag Manager',
      'Send checkout browser events through the detected Pixel. Add an access token for Conversions API.': '通过检测到的 Pixel 发送结账浏览器事件；添加 Access Token 后可启用 Conversions API。',
      'Send checkout events directly to GA4. Add an API secret for Measurement Protocol.': '直接向 GA4 发送结账事件；添加 API Secret 后可启用 Measurement Protocol。',
      'Send checkout events to the detected GTM container.': '向检测到的 GTM 容器发送结账事件。',
      'Storefront detection': '店铺前台检测',
      'Detected tag': '检测到的标签',
      'Detected on your Shopify storefront': '已在 Shopify 店铺前台检测到',
      'Detected from your Shopify storefront': '从 Shopify 店铺前台检测到',
      'No tag detected on your Shopify storefront': '未在 Shopify 店铺前台检测到标签',
      'Detected': '已检测到',
      'Needs confirmation': '需要确认',
      'Not detected': '未检测到',
      'Meta tracking': 'Meta 数据回传',
      'GA4 tracking': 'GA4 数据回传',
      'GTM tracking': 'GTM 数据回传',
      'Pixel ID': 'Pixel ID',
      'Detected Pixel ID': '检测到的 Pixel ID',
      'Storefront Pixel ID': '店铺前台 Pixel ID',
      'Measurement ID': 'Measurement ID',
      'Storefront Measurement ID': '店铺前台 Measurement ID',
      'Container ID': 'Container ID',
      'Storefront Container ID': '店铺前台 Container ID',
      'CAPI access token': 'CAPI Access Token',
      'CAPI not configured': 'CAPI 未配置',
      'Access token configured': 'Access Token 已配置',
      'API secret not configured': 'API Secret 未配置',
      'API secret configured': 'API Secret 已配置',
      'Browser events active': '浏览器事件已启用',
      'Browser and server events active': '浏览器与服务端事件已启用',
      'Server events off': '服务端事件未启用',
      'Not configured': '未配置',
      'Configure Meta': '配置 Meta',
      'Configure GA4': '配置 GA4',
      'Configure GTM': '配置 GTM',
      'Manage Meta tracking': '管理 Meta 数据回传',
      'Manage GA4': '管理 GA4',
      'Manage GTM': '管理 GTM',
      'Optional': '可选',
      'BestCheckout sends checkout events only to the destinations configured below. Detection helps you match the saved IDs with your Shopify storefront.': 'BestCheckout 只会向下方已配置的目标发送结账事件；前台检测帮助你核对已保存的 ID 是否与 Shopify 店铺一致。',
      'Detected and matched IDs are used for browser events. CAPI and GA4 server events start only after the corresponding credential is saved.': '前台检测且匹配的 ID 用于浏览器事件；CAPI 和 GA4 服务端事件仅在保存对应凭证后启用。',
      'Detected IDs are used automatically for browser events. CAPI and GA4 server events start only after the corresponding credential is saved.': '前台检测到的 ID 会自动用于浏览器事件；CAPI 和 GA4 服务端事件仅在保存对应凭证后启用。',
      'BestCheckout automatically sends checkout events to tags detected on your Shopify storefront.': 'BestCheckout 会自动向 Shopify 店铺前台检测到的标签发送结账事件。',
      'BestCheckout uses the detected Pixel for browser events. CAPI is enabled only when the saved Pixel ID matches it.': 'BestCheckout 使用检测到的 Pixel 发送浏览器事件；仅当已保存的 Pixel ID 与其一致时，才会启用 CAPI。',
      'BestCheckout uses the detected Pixel for browser events. Add an access token to also enable Conversions API.': 'BestCheckout 使用检测到的 Pixel 发送浏览器事件；添加 Access Token 后即可启用 Conversions API。',
      'BestCheckout uses the detected Measurement ID for checkout browser events. Add an API secret to also send GA4 server-side events.': 'BestCheckout 使用检测到的 Measurement ID 发送结账浏览器事件；添加 API Secret 后还会发送 GA4 服务端事件。',
      'BestCheckout uses the detected container for checkout events.': 'BestCheckout 使用检测到的容器发送结账事件。',
      'Please enter a Measurement ID.': '请输入 Measurement ID。',
      'Please enter a Container ID.': '请输入 Container ID。',
      'Please enter a Pixel ID.': '请输入 Pixel ID。',
      'This ID must match one of the IDs detected on your Shopify storefront.': '该 ID 必须与店铺前台检测到的任一 ID 匹配。',
      'The saved Pixel ID must match the unique Pixel detected on your storefront.': '已保存的 Pixel ID 必须与店铺前台唯一检测到的 Pixel 一致。',
      'Meta configuration saved.': 'Meta 配置已保存。',
      'GA4 configuration saved.': 'GA4 配置已保存。',
      'GTM configuration saved.': 'GTM 配置已保存。',
      'Disconnect Meta configuration?': '断开 Meta 配置？',
      'Disconnect GA4 configuration?': '断开 GA4 配置？',
      'Disconnect GTM configuration?': '断开 GTM 配置？',
      'Disconnecting this configuration keeps storefront detection visible.': '断开配置不会影响店铺前台检测结果。',
      'Meta configuration disconnected.': 'Meta 配置已断开。',
      'GA4 configuration disconnected.': 'GA4 配置已断开。',
      'GTM configuration disconnected.': 'GTM 配置已断开。',
      'App permissions': '应用权限',
      'Shopify API access scopes': 'Shopify API 权限范围',
      'Docs': '文档',
      'Required scopes': '所需权限',
      'Granted scopes': '已授予权限',
      'Missing scopes': '缺少的权限',
      'Review the Shopify scopes granted to this store.': '查看此店铺已授予的 Shopify 权限。',
      'Compare the required list with the scopes already granted to this store.': '对照此店铺已授予的权限和所需权限列表。',
      'Healthy': '健康',
      'Insufficient permissions': '权限不足',
      'All required permissions are granted. Downstream checkout, sync, and order write-back can run.': '所需权限已全部授予。下游结账、同步和订单回写可以正常进行。',
      'Some required permissions were not selected when this app was created. Downstream checkout, sync, or order write-back can fail until you re-authorize.': '创建应用时未勾选部分必需权限。重新授权前，下游结账、同步或订单回写可能失败。',
      'Needs re-authorization': '需要重新授权',
      'Ready for checkout': '可用于结账',
      'Re-authorize on Shopify': '在 Shopify 重新授权',
      'Opening Shopify to re-authorize this store': '正在打开 Shopify 以重新授权此店铺',
      'Copy': '复制',
      'Missing scopes copied': '缺少的权限已复制',
      'Granted scopes copied': '已授予权限已复制',
      'Products, variants & inventory': '商品、款式与库存',
      'Product selection, SKU, price, and inventory checks': '商品选择、SKU、价格和库存校验',
      'Collection selectors, collection rules, and product filters': '系列选择器、系列规则和商品筛选',
      'Customers & order history': '客户与历史订单',
      'Customer eligibility, tags, and returning-customer rules': '客户资格、标签和回头客规则',
      'Discounts & discount codes': '折扣与折扣码',
      'Automatic discounts, discount codes, and offer eligibility': '自动折扣、折扣码和优惠资格',
      'Shipping zones, rates & delivery profiles': '配送区域、运费与配送方案',
      'Accurate shipping calculation after the buyer enters an address': '买家填写地址后计算准确运费',
      'Store settings': '店铺设置',
      'Store currency, timezone, and brand defaults': '店铺币种、时区和品牌默认值',
      'All data synced · just now': '全部数据已同步 · 刚刚',
      'Syncing data…': '正在同步数据…',
      'Shopify data sync completed': 'Shopify 数据同步完成',
    }).addRules([
      { re: /^(\d+) of (\d+) required permissions granted$/, zh: function (m) { return '已授予 ' + m[1] + ' / ' + m[2] + ' 项必需权限'; } },
      { re: /^(\d+) mapped · (\d+) unmatched · last refresh (.+)$/, zh: function (m) {
        var when = m[3] === 'just now' ? '刚刚' : (/^(\d+) min ago$/.test(m[3]) ? (m[3].match(/^(\d+)/)[1] + ' 分钟前') : m[3]);
        return m[1] + ' 可用 · ' + m[2] + ' 商品未同步 · 上次刷新 ' + when;
      } },
      { re: /^All data synced · (.+)$/, zh: function (m) {
        var when = m[1] === 'just now' ? '刚刚' : (/^(\d+) min ago$/.test(m[1]) ? (m[1].match(/^(\d+)/)[1] + ' 分钟前') : m[1]);
        return '全部数据已同步 · ' + when;
      } },
      { re: /^([\d,]+) products$/, zh: function (m) { return m[1] + ' 个商品'; } },
      { re: /^([\d,]+) collections$/, zh: function (m) { return m[1] + ' 个系列'; } },
      { re: /^([\d,]+) customers$/, zh: function (m) { return m[1] + ' 位客户'; } },
      { re: /^(\d+) active$/, zh: function (m) { return m[1] + ' 个生效中'; } },
      { re: /^(\d+) profiles$/, zh: function (m) { return m[1] + ' 个方案'; } },
      { re: /^(\d+) plans$/, zh: function (m) { return m[1] + ' 个计划'; } },
      { re: /^Granted scopes: (.+)$/, zh: function (m) { return '已授予权限：' + m[1]; } },
      { re: /^(\d+) channels active$/, zh: function (m) { return m[1] + ' 个渠道已启用'; } },
      { re: /^(\d+) channels connected$/, zh: function (m) { return m[1] + ' 个渠道已连接'; } },
      { re: /^(\d+) min ago$/, zh: function (m) { return m[1] + ' 分钟前'; } },
      { re: /^Disconnect (Meta|Google)\?$/, zh: function (m) { return '断开 ' + m[1] + '？'; } },
      { re: /^(Meta|Google) is disconnected in this prototype\.$/, zh: function (m) { return m[1] + ' 已在此原型中断开连接。'; } },
      { re: /^(Meta|Google) is active for new checkout sessions\.$/, zh: function (m) { return m[1] + ' 已对新的结账会话启用。'; } },
      { re: /^(Meta|Google) test event recorded in this prototype\.$/, zh: function (m) { return m[1] + ' 测试事件已在此原型中记录。'; } },
    ]);
  }
  if (window.I18N && window.I18N.addRules) {
    window.I18N.addRules([
      { re: /^The address uses the active verified domain: @(.+)\.$/, zh: function (m) { return '发件地址使用当前已验证域名：@' + m[1] + '。'; } },
      { re: /^DNS records for (.+)$/, zh: function (m) { return m[1] + ' 的 DNS 记录'; } },
      { re: /^DNS records created for (.+)$/, zh: function (m) { return '已为 ' + m[1] + ' 生成 DNS 记录'; } },
      { re: /^Test email sent to (.+)$/, zh: function (m) { return '测试邮件已发送至 ' + m[1]; } }
    ]);
  }

  // ---- toast — use the same top-centred notification pattern as Purchase flows ----
  const toast = (msg, type) => {
    const level = type || (/failed|error|失败/i.test(String(msg)) ? 'error' : 'success');
    const tone = level === 'error' ? '#ff4d4f' : level === 'warning' ? '#faad14' : '#52c41a';
    const glyph = level === 'error' ? '×' : level === 'warning' ? '!' : '✓';
    document.querySelectorAll('.set-message').forEach((message) => message.remove());
    const t = document.createElement('div');
    t.className = 'set-message ' + level;
    t.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:8px;max-width:min(560px,calc(100vw - 48px));padding:9px 16px;background:#fff;color:rgba(0,0,0,.88);border-radius:8px;font-size:14px;line-height:1.45;z-index:300;box-shadow:0 6px 16px rgb(0 0 0 / 8%),0 3px 6px -4px rgb(0 0 0 / 12%),0 9px 28px 8px rgb(0 0 0 / 5%)';
    t.innerHTML = '<span aria-hidden="true" style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:' + tone + ';color:#fff;font-size:12px;font-weight:700;line-height:1;flex:none">' + glyph + '</span><span></span>';
    t.lastElementChild.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  };

  // ---- confirm dialog (mirrors Ant Modal.confirm) ----
  const confirm = (opts) => modal({
    title: opts.title, width: opts.width || 460,
    body: '<div class="muted" style="font-size:13.5px;line-height:1.6">' + esc(opts.content) + '</div>',
    okText: opts.okText || 'OK', danger: opts.danger,
    onOk: (m, close) => { close(); opts.onOk && opts.onOk(); },
  });

  // ===== shared small builders (reuse theme classes) =====
  // Linked/Not linked dot pill (matches render.tsx tag-dot-success / tag-dot-bg)
  const linkedPill = (linked) => linked
    ? '<span class="pill pill-green"><span class="dot"></span>Linked</span>'
    : '<span class="pill pill-gray"><span class="dot"></span>Not linked</span>';

  const sectionTitle = (t, sub) =>
    '<div class="card-title">' + esc(t) + '</div>' + (sub ? '<div class="muted" style="font-size:12.5px;margin-top:2px">' + esc(sub) + '</div>' : '');

  // a soft grey inner block (mirrors the borderless .b-c rows in the admin: #f7f8fb, no border)
  const block = (inner, bg) => '<div class="b-c" style="padding:14px 16px' + (bg ? ';background:' + bg : '') + '">' + inner + '</div>';

  // an Ant-style Switch (visual)
  let sw = 0;
  const toggle = (on, label) => {
    const id = 'sw' + (++sw);
    return '<label class="set-switch' + (on ? ' on' : '') + '" data-toggle="' + id + '"' + (label ? ' aria-label="' + esc(label) + '"' : '') + '><span class="set-knob"></span></label>';
  };

  // ===========================================================================
  // PAINT: shell renders the sidebar + "Settings" bar; we render ONLY the active
  // sub-page content into #root. All settings pages use the same readable
  // centered width; edit-like forms keep the narrower .set-narrow variant.
  // ===========================================================================
  // `centered` pages mirror the real admin's centered w-[860px] forms.
  function paint(bodyHtml, centered) {
    const wrap = centered === 'full'
      ? bodyHtml
      : '<div class="set-page' + (centered ? ' set-narrow' : '') + '">' + bodyHtml + '</div>';
    root.innerHTML =
      '<style>' + STYLES + '</style>' + wrap;
    if (window.I18N && window.I18N.apply) window.I18N.apply(root);
    // wire generic toggles (visual only)
    root.querySelectorAll('[data-toggle]').forEach((el) => el.onclick = () => el.classList.toggle('on'));
    // image upload tiles → open the OS file chooser (Store logo/ico/no-data, Checkout logo)
    root.querySelectorAll('.up-tile').forEach((el) => el.onclick = () => openFilePicker());
  }

  // open the native local-file chooser (prototype: selection is visual only)
  function openFilePicker(options) {
    const opts = options || {};
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = opts.accept == null ? 'image/png,image/jpeg,image/svg+xml,.ico' : opts.accept;
    inp.style.display = 'none';
    inp.onchange = () => {
      const f = inp.files && inp.files[0];
      if (f) {
        if (opts.onSelected) opts.onSelected(f);
        else toast('Selected ' + f.name);
      }
      inp.remove();
    };
    document.body.appendChild(inp);
    inp.click();
  }

  // a Page-style header (title + optional description + optional right slot)
  const pageHead = (title, sub, rightHtml) =>
    '<div class="flex items-end justify-between mb-4" style="gap:12px">' +
      '<div><div class="page-title" style="font-size:20px">' + esc(title) + '</div>' +
        (sub ? '<div class="muted" style="font-size:13px;margin-top:2px">' + esc(sub) + '</div>' : '') + '</div>' +
      '<div class="flex items-center gap-2">' + (rightHtml || '') + '</div>' +
    '</div>';

  const updateBtn = '<button class="btn btn-primary" data-act="save">Update</button>';

  // editable text field for a modal. `secret` only adds a "masked" note — the
  // value itself is always masked in DATA for secret fields.
  function field(label, value, placeholder, opts) {
    opts = opts || {};
    const v = value || '';
    const req = opts.optional ? '' : ' <span style="color:var(--err)">*</span>';
    const learn = opts.learnMore ? '<a class="lnk" href="' + esc(opts.learnMore) + '" target="_blank" rel="noreferrer" style="font-weight:400;float:right">Learn more</a>' : '';
    const addon = opts.addonBefore
      ? '<div class="set-addon"><span class="set-addon-prefix">' + esc(opts.addonBefore) + '</span><input class="input" value="' + esc(v) + '" placeholder="' + esc(placeholder || '') + '" style="border-top-left-radius:0;border-bottom-left-radius:0" /></div>'
      : '<input class="input" value="' + esc(v) + '" placeholder="' + esc(placeholder || '') + '" />';
    return '<div style="margin-bottom:12px"><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">' + esc(label) + req + learn + '</div>' +
      addon +
      (opts.secret && v ? '<div class="muted" style="font-size:11.5px;margin-top:4px">Stored securely · value is masked</div>' : '') +
      (opts.hint ? '<div class="muted" style="font-size:11.5px;margin-top:4px">' + esc(opts.hint) + '</div>' : '') +
      '</div>';
  }

  // PC + Mobile preview modal (NoDataPreviewModal / checkout preview modal)
  function openPreviewModal(title) {
    modal({ title: title, width: 760, okText: 'Complete', hideCancel: true,
      body:
        '<div style="display:grid;grid-template-columns:3fr 2fr;gap:20px">' +
          '<div><div class="text-sm" style="text-align:center;font-weight:600;color:var(--ink);margin-bottom:10px">PC Display</div>' +
            '<div class="preview-frame" style="height:230px"><span class="muted">Storefront PC preview</span></div></div>' +
          '<div><div class="text-sm" style="text-align:center;font-weight:600;color:var(--ink);margin-bottom:10px">Mobile Display</div>' +
            '<div class="preview-frame" style="height:230px"><span class="muted">Mobile preview</span></div></div>' +
        '</div>',
      onOk: (m, close) => close() });
  }

  // ===========================================================================
  // TAB 1 — BASE  ("Basic settings", centered w-860)
  //   render.tsx: Store information / Product information / Order information /
  //   Login through social media (Google only). One Update btn.
  // ===========================================================================
  function renderBase() {
    const b = D.base;

    const uploadCard = (u, label, desc, previewTitle) => {
      const tile = u.set
        ? '<div class="up-tile filled"><span class="up-ico">' + I.image + '</span><span class="up-name">' + esc(u.name) + '</span>' +
            '<button class="up-x" title="Remove">' + I.x + '</button></div>'
        : '<div class="up-tile"><span class="up-plus">' + I.plus + '</span><span class="up-add">Add images</span></div>';
      return block(
        '<div class="text-sm" style="font-weight:600;color:var(--ink);margin-bottom:2px">' + esc(label) + '</div>' +
        '<div class="muted" style="font-size:12.5px;margin-bottom:10px">' + esc(desc) +
          ' <a class="lnk" data-preview="' + esc(previewTitle) + '">Preview display here.</a>' +
          ' Recommended size: ' + esc(u.rec) + ', format: ' + esc(u.format) + '.</div>' +
        tile
      );
    };

    const fontTags = b.store.fonts.map((f) =>
      '<span class="field-pill">' + esc(f) + ' <span class="x" data-font="' + esc(f) + '">&times;</span></span>').join('');

    // V1.129 §7.4 Store: editable Store name (0/30) + read-only url / currency / time zone
    const sd = b.store.details || { name: 'Lavender Labs', url: 'lavender-labs.myshopify.com', currency: 'USD $', timezone: 'GMT-04:00' };
    const detailRow = (label, value) =>
      '<div class="flex items-center gap-3"><span class="text-sm" style="font-weight:600;color:var(--ink);min-width:140px">' + esc(label) + '</span>' +
      '<span class="muted" style="font-size:13px">' + esc(value) + '</span></div>';
    const storeDetailsBlock = block(
      '<div class="flex flex-col gap-4">' +
        '<div>' +
          '<div class="flex items-center justify-between" style="margin-bottom:6px">' +
            '<span class="text-sm" style="font-weight:600;color:var(--ink)">Store name</span>' +
            '<span class="muted" id="sd-name-cnt" style="font-size:12px">' + (sd.name || '').length + '/30</span></div>' +
          '<input class="input" style="width:100%" maxlength="30" placeholder="Please enter" value="' + esc(sd.name) + '"' +
            ' oninput="var e=document.getElementById(\'sd-name-cnt\');if(e)e.textContent=this.value.length+\'/30\'">' +
        '</div>' +
        detailRow('Store url', sd.url) +
        detailRow('Default currency', sd.currency) +
        detailRow('Default time zone', sd.timezone) +
      '</div>'
    );

    const storeCard =
      '<div class="panel card-pad mb-4">' + sectionTitle('Store information') +
        '<div class="mt-4 flex flex-col gap-4">' +
          storeDetailsBlock +
          uploadCard(b.store.logo, 'Store logo', 'This logo is displayed on the store.', 'Display Position of Store logo') +
          uploadCard(b.store.ico, 'Store ico', 'The icon displayed in the browser window.', 'Display Position of Store ico') +
          uploadCard(b.store.noData, 'No data icon', 'This logo is displayed on the store.', 'Display Position of No data icon') +
          block(
            '<div class="flex items-center justify-between mb-1">' +
              '<div><div class="text-sm" style="font-weight:600;color:var(--ink)">Store Font</div>' +
              '<div class="muted" style="font-size:12.5px">Add your preferred fonts to control store typography.</div></div>' +
              '<button class="btn btn-gray" data-act="add-font">Add font</button>' +
            '</div>' +
            '<div class="flex flex-wrap gap-1 mt-3">' + (fontTags || '<span class="muted" style="font-size:12.5px">No fonts added</span>') + '</div>'
          ) +
        '</div>' +
      '</div>';

    const prodRow = (p, name) => block(
      '<div class="flex items-center gap-3 mb-1"><span class="text-sm" style="font-weight:600;color:var(--ink)">' + esc(name) + '</span>' + toggle(p.on, name) + '</div>' +
      '<div class="muted" style="font-size:12.5px">' + esc(p.desc) + '</div>'
    );
    const productCard =
      '<div class="panel card-pad mb-4">' + sectionTitle('Product information') +
        '<div class="mt-4 flex flex-col gap-4">' +
          prodRow(b.product.reviews, 'Product Reviews') +
          prodRow(b.product.original, 'Original Price') +
        '</div>' +
      '</div>';

    const orderCard =
      '<div class="panel card-pad mb-4">' + sectionTitle('Order information') +
        '<div class="mt-4 flex flex-col gap-4">' +
          block(
            '<div class="text-sm" style="font-weight:600;color:var(--ink);margin-bottom:2px">Order ID prefix</div>' +
            '<div class="muted" style="font-size:12.5px;margin-bottom:8px">Order ID starts from 1001 by default. You may add a prefix to create custom IDs. e.g. "EN1001"</div>' +
            '<input class="input" id="ord-prefix" maxlength="10" placeholder="Please enter" value="' + esc(b.order.prefix) + '" style="width:300px" />' +
            '<div class="muted" style="font-size:12.5px;margin-top:6px">Order ID will be displayed as <span class="subtle" id="ord-prefix-eg">' + esc(b.order.prefix) + '1001, ' + esc(b.order.prefix) + '1002, ' + esc(b.order.prefix) + '1003...</span></div>'
          ) +
          block(
            '<div class="flex items-center gap-3 mb-1"><span class="text-sm" style="font-weight:600;color:var(--ink)">Order Auto-Cancel Time</span>' +
              '<div class="set-addon"><input class="input" type="number" value="' + b.order.autoCancelMinutes + '" min="1" max="1440" style="width:140px;border-top-right-radius:0;border-bottom-right-radius:0" /><span class="set-addon-suffix">Minutes</span></div></div>' +
            '<div class="muted" style="font-size:12.5px">Duration for To pay orders after Place order.</div>'
          ) +
          block(
            '<div class="flex items-center gap-3 mb-1"><span class="text-sm" style="font-weight:600;color:var(--ink)">Order Auto-Receive Time</span>' +
              '<div class="set-addon"><input class="input" type="number" value="' + b.order.autoReceiveDays + '" min="1" max="100" style="width:140px;border-top-right-radius:0;border-bottom-right-radius:0" /><span class="set-addon-suffix">Days</span></div></div>' +
            '<div class="muted" style="font-size:12.5px">Orders are auto-Receive after a set number of days from shipping (e.g., 10 days).</div>'
          ) +
        '</div>' +
      '</div>';

    const socialRow = (s) =>
      '<div class="flex items-center justify-between" style="padding:12px 0">' +
        '<div class="flex items-center gap-3">' + I.globe +
          '<span class="text-sm" style="font-weight:600;color:var(--ink)">' + esc(s.name) + '</span>' + linkedPill(s.linked) +
        '</div>' +
        '<button class="btn btn-gray" data-social="' + s.key + '">' + (s.linked ? 'Edit' : 'Link') + '</button>' +
      '</div>';
    const socialCard =
      '<div class="panel card-pad mb-4">' + sectionTitle('Login through social media', 'After connecting, customers can log in to the online store through their social media accounts.') +
        '<div class="mt-2">' + block(b.social.map(socialRow).join('')) + '</div>' +
      '</div>';

    paint(
      pageHead('Basic settings') +
      storeCard + productCard + orderCard + socialCard +
      '<div class="flex justify-end">' + updateBtn + '</div>',
      true
    );

    // wiring
    root.querySelectorAll('[data-act="save"]').forEach((b2) => b2.onclick = () => toast('Settings updated successfully'));
    root.querySelectorAll('[data-preview]').forEach((b2) => b2.onclick = () => openPreviewModal(b2.getAttribute('data-preview')));
    const addFont = root.querySelector('[data-act="add-font"]'); if (addFont) addFont.onclick = () => openAddFontModal();
    root.querySelectorAll('[data-font]').forEach((x) => x.onclick = () => toast('Removed font ' + x.getAttribute('data-font')));
    root.querySelectorAll('[data-social]').forEach((b2) => b2.onclick = () => openLoginModal(b2.getAttribute('data-social')));
    const pfx = root.querySelector('#ord-prefix');
    if (pfx) pfx.oninput = () => { const v = pfx.value || ''; const eg = root.querySelector('#ord-prefix-eg'); if (eg) eg.textContent = v + '1001, ' + v + '1002, ' + v + '1003...'; };
  }

  // Standalone BestCheckout only exposes the Shopify-store settings that affect
  // checkout. Storefront theme, social login and catalogue-administration
  // controls remain in the underlying BestShopio record and are not merchant
  // actions in this product.
  function renderShopifyConnectionSetup() {
    const body =
      '<style>' +
        '.bc-connect-page{max-width:640px}.bc-connect-card{padding:24px}.bc-connect-card h2{margin:0;color:var(--ink);font-size:18px;line-height:1.35}.bc-connect-card>p{max-width:560px;margin:7px 0 22px;color:var(--ink-muted);font-size:13px;line-height:1.55}.bc-connect-field{margin-top:16px}.bc-connect-field>label{display:block;margin-bottom:6px;color:var(--ink);font-size:12.5px;font-weight:650}.bc-connect-field input{box-sizing:border-box;width:100%;height:40px;border:1px solid var(--ctl);border-radius:8px;background:#fff;color:var(--ink);font:inherit;font-size:13px;padding:0 11px;outline:0}.bc-connect-field input:focus{border-color:var(--brand);box-shadow:0 0 0 2px rgb(0 102 230 / 8%)}.bc-connect-field.is-invalid input{border-color:var(--err)}.bc-connect-field small{display:block;margin-top:5px;color:var(--ink-muted);font-size:11.5px;line-height:1.45}.bc-connect-field .bc-connect-error{display:none;color:var(--err)}.bc-connect-field.is-invalid .bc-connect-error{display:block}.bc-connect-domain{display:flex;align-items:center;height:40px;border:1px solid var(--ctl);border-radius:8px;background:#fff}.bc-connect-domain:focus-within{border-color:var(--brand);box-shadow:0 0 0 2px rgb(0 102 230 / 8%)}.bc-connect-field.is-invalid .bc-connect-domain{border-color:var(--err)}.bc-connect-domain input{height:38px;border:0!important;box-shadow:none!important;flex:1}.bc-connect-domain span{padding:0 11px;color:var(--ink-muted);font-size:12px;font-weight:600}.bc-connect-secret{position:relative}.bc-connect-secret input{padding-right:62px}.bc-connect-secret button{position:absolute;top:4px;right:5px;height:32px;border:0;border-radius:6px;background:transparent;color:var(--brand);padding:0 8px;font:inherit;font-size:12px;font-weight:650;cursor:pointer}.bc-connect-secret button:hover{background:#f0f5ff}.bc-connect-confirm{display:flex;gap:8px;align-items:flex-start;margin-top:20px;color:var(--ink-body);font-size:12px;line-height:1.5}.bc-connect-confirm input{width:16px;height:16px;margin:1px 0 0;accent-color:var(--brand);flex:none}.bc-connect-confirm.is-invalid{color:var(--err)}.bc-connect-confirm .bc-connect-error{display:none;margin-top:3px;color:var(--err)}.bc-connect-confirm.is-invalid .bc-connect-error{display:block}.bc-connect-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:24px;padding-top:16px;border-top:1px solid var(--hair)}@media(max-width:640px){.bc-connect-card{padding:18px}.bc-connect-actions .btn{flex:1}}' +
      '</style>' +
      '<div class="bc-connect-page">' +
        pageHead('Shopify connection', 'Connect a Shopify store from your BestCheckout workspace.') +
        '<section class="panel bc-connect-card"><h2>Connect your Shopify store</h2><p>Enter the permanent Shopify address. BestCheckout prepares a Custom App and emails an install link, usually within about 1 day. You do not paste Client ID or Secret.</p>' +
          '<form data-shopify-connect-form novalidate>' +
            '<div class="bc-connect-field" data-connect-field="store"><label for="bc-connect-store">Shopify store address</label><div class="bc-connect-domain"><input id="bc-connect-store" autocomplete="off" placeholder="your-store"><span>.myshopify.com</span></div><small>Enter your permanent myshopify.com store address, not your storefront domain.</small><small class="bc-connect-error">Enter your Shopify store name.</small></div>' +
            '<div class="bc-connect-actions"><button type="button" class="btn btn-default" data-connect-cancel>Cancel</button><button type="submit" class="btn btn-primary">Submit store</button></div>' +
          '</form>' +
        '</section>' +
      '</div>';
    paint(body, false);
    const form = root.querySelector('[data-shopify-connect-form]');
    const cancel = root.querySelector('[data-connect-cancel]');
    if (cancel) cancel.onclick = () => { setShopifyConnectionSetupRoute(false); renderShopifyStore(); };
    if (form) form.onsubmit = (event) => {
      event.preventDefault();
      const store = root.querySelector('#bc-connect-store');
      const handle = String(store.value || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\.myshopify\.com$/i, '').replace(/[^a-z0-9-]/g, '');
      const field = root.querySelector('[data-connect-field="store"]');
      if (field) field.classList.toggle('is-invalid', !handle);
      if (!handle) return;
      window.location.assign('../?entry=connect-new-shopify-store#/connect-shopify?status=pending&shop=' + encodeURIComponent(handle));
    };
  }

  function renderShopifyStore() {
    const connectionState = window.BESTCHECKOUT_SHOPIFY_CONNECTION || 'connected';
    if (connectionState === 'unlinked') {
      if (!shopifyConnectionSetupOpen) setShopifyConnectionSetupRoute(true);
      renderShopifyConnectionSetup();
      return;
    }
    if (connectionState === 'pending' || connectionState === 'install' || connectionState === 'failed') {
      const store = currentShopifyStore();
      const copy = connectionState === 'failed'
        ? { title: 'Connection failed', body: 'Check the myshopify.com address and who opened the install link, then submit the store again.', pill: 'Failed', tone: 'pill-orange', action: 'Try again', href: '../?entry=connect-new-shopify-store#/connect-shopify?status=failed' }
        : connectionState === 'install'
          ? { title: 'Ready to install', body: 'Install from BestCheckout or from the email we sent. Selecting Install does not finish the connection by itself.', pill: 'Ready to install', tone: 'pill-orange', action: 'Open install', href: '../?entry=connect-new-shopify-store#/connect-shopify?status=install&shop=' + encodeURIComponent(String(store.url || '').replace(/\.myshopify\.com$/i, '')) }
          : { title: 'Preparing your install link', body: 'BestCheckout is creating a Custom App for this store. This usually takes about 1 day. You do not need to paste credentials.', pill: 'Preparing install link', tone: 'pill-orange', action: 'View connection status', href: '../?entry=connect-new-shopify-store#/connect-shopify?status=pending&shop=' + encodeURIComponent(String(store.url || '').replace(/\.myshopify\.com$/i, '')) };
      paint(
        pageHead('Shopify connection', 'BestCheckout connects this store through an install link, not Client ID and Secret.') +
        '<section class="panel card-pad mb-4"><div class="flex items-start justify-between" style="gap:12px"><div><div class="bc-store-name">' + esc(copy.title) + '</div><div class="bc-store-domain">' + esc(store.url) + '</div><p class="muted" style="margin:10px 0 0;font-size:13px;line-height:1.55">' + esc(copy.body) + '</p></div><span class="pill ' + copy.tone + '"><span class="dot"></span>' + esc(copy.pill) + '</span></div><div class="mt-4"><a class="btn btn-primary" href="' + copy.href + '">' + esc(copy.action) + '</a></div></section>',
        false
      );
      return;
    }
    const store = currentShopifyStore();
    const grantedIds = shopifyGrantedScopeIds(store);
    const missingScopes = SHOPIFY_REQUIRED_SCOPES.filter((scope) => grantedIds.indexOf(scope) === -1);
    const permissionsHealthy = missingScopes.length === 0;
    const grantedCount = SHOPIFY_REQUIRED_SCOPES.length - missingScopes.length;
    const syncRow = (name, count, detail) =>
      '<div class="bc-store-row"><div><strong>' + esc(name) + '</strong><span>' + esc(detail) + '</span></div><div class="bc-store-row-end"><b>' + esc(count) + '</b></div></div>';
    const status = '<span class="pill pill-green"><span class="dot"></span>Connected</span>';
    const permissionStatus = permissionsHealthy
      ? '<span class="pill pill-green bc-scope-status"><span class="dot"></span>Healthy</span>'
      : '<span class="pill pill-orange bc-scope-status"><span class="dot"></span>Insufficient permissions</span>';
    const missingList = missingScopes.join(',');
    const grantedList = grantedIds.join(',');
    const scopeChip = (scope, kind) => '<code class="bc-scope-chip' + (kind ? ' is-' + kind : '') + '">' + esc(scope) + '</code>';
    const missingChips = missingScopes.map((scope) => scopeChip(scope, 'miss')).join('');
    const grantedChips = grantedIds.map((scope) => scopeChip(scope, 'ok')).join('');
    const grantedPanel = '<div class="bc-scope-panel is-ok"><div class="bc-scope-panel-head"><small>Granted scopes<span class="bc-scope-count">' + grantedIds.length + '</span></small><button type="button" data-act="copy-granted-scopes">Copy</button></div><div class="bc-scope-chips">' + grantedChips + '</div></div>';
    const missingPanel = '<div class="bc-scope-panel is-miss"><div class="bc-scope-panel-head"><small>Missing scopes<span class="bc-scope-count">' + missingScopes.length + '</span></small><button type="button" data-act="copy-missing-scopes">Copy</button></div><div class="bc-scope-chips">' + missingChips + '</div></div>';
    const body =
      '<style>' +
        '.bc-store-kicker{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--ink-muted);text-transform:uppercase;margin-bottom:10px}.bc-store-name{font-size:17px;font-weight:700;color:var(--ink);margin-bottom:4px}.bc-store-domain{font-size:13px;color:var(--ink-muted)}.bc-store-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px;padding-top:16px;border-top:1px solid var(--hair)}.bc-store-fact small{display:block;color:var(--ink-muted);font-size:11px;margin-bottom:4px}.bc-store-fact strong{display:block;color:var(--ink-body);font-size:13px;font-weight:600;line-height:1.4}.bc-credentials{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}.bc-credential small{display:block;margin-bottom:6px;color:var(--ink-muted);font-size:11px;font-weight:600}.bc-credential-control{display:flex;align-items:center;min-width:0;height:38px;border:1px solid var(--ctl);border-radius:8px;background:#fff}.bc-credential-control code{min-width:0;flex:1;overflow:hidden;padding-left:11px;color:var(--ink-body);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;letter-spacing:.035em;text-overflow:ellipsis;white-space:nowrap}.bc-credential-toggle{display:grid;place-items:center;width:36px;height:36px;flex:none;border:0;border-radius:7px;background:transparent;color:var(--ink-muted);cursor:pointer}.bc-credential-toggle:hover{background:#f1f5fa;color:var(--brand)}.bc-credential-toggle:focus-visible{outline:2px solid var(--brand);outline-offset:1px}.bc-scope-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.bc-scope-title{display:flex;align-items:center;gap:6px}.bc-scope-title .card-title{margin:0}.bc-scope-docs{display:inline-grid;place-items:center;width:18px;height:18px;border:1px solid var(--ctl);border-radius:50%;color:var(--ink-muted);font-size:12px;font-weight:700;line-height:1;text-decoration:none}.bc-scope-docs:hover{border-color:var(--brand);color:var(--brand)}.bc-scope-status{margin-top:2px;white-space:nowrap}.bc-scope-compare{display:grid;grid-template-columns:1fr;gap:10px;margin-top:12px}.bc-scope-panel{min-width:0;padding:12px 14px;border:1px solid var(--hair);border-radius:10px;background:#fafbfd}.bc-scope-panel.is-miss{border-color:#f3d2a4;background:#fffdf8}.bc-scope-panel.is-ok{border-color:#ccebd8;background:#f6fbf8}.bc-scope-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.bc-scope-panel-head small{display:flex;align-items:center;gap:8px;margin:0;font-size:12px;font-weight:650}.bc-scope-panel.is-miss .bc-scope-panel-head small{color:#9a4b00}.bc-scope-panel.is-ok .bc-scope-panel-head small{color:#14834c}.bc-scope-panel-head button{border:0;background:none;color:var(--brand);padding:0;font:inherit;font-size:12.5px;font-weight:650;cursor:pointer}.bc-scope-count{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:999px;border:1px solid currentColor;background:#fff;font-size:11px;font-weight:650;line-height:1}.bc-scope-chips{display:flex;flex-wrap:wrap;gap:8px}.bc-scope-chip{display:inline-flex;align-items:center;height:26px;padding:0 9px;border:1px solid #d7deea;border-radius:6px;background:#fff;color:#3b4a63;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1;white-space:nowrap}.bc-scope-chip.is-miss{border-color:#f0c48a;background:#fff6ea;color:#9a4b00}.bc-scope-chip.is-ok{border-color:#b7e4c7;background:#eef9f2;color:#14834c}.bc-scope-alert{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:12px;padding:11px 12px;border:1px solid #f3d2a4;border-radius:10px;background:#fff8ee;color:#7a4b09;font-size:12.5px;line-height:1.5}.bc-scope-alert>div{display:flex;align-items:flex-start;gap:8px;min-width:0}.bc-scope-alert svg{flex:none;margin-top:1px}.bc-scope-alert .btn{display:inline-flex;align-items:center;gap:6px;flex:none}.bc-sync-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.bc-sync-status{margin-top:2px;white-space:nowrap}.bc-store-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 0;border-top:1px solid var(--hair)}.bc-store-row:first-child{border-top:0;padding-top:0}.bc-store-row strong{display:block;font-size:13.5px;color:var(--ink)}.bc-store-row span,.bc-store-row small{display:block;font-size:12px;color:var(--ink-muted);margin-top:3px;line-height:1.45}.bc-store-row-end{display:flex;align-items:center;gap:10px;white-space:nowrap}.bc-store-row-end>b{font-size:13px;color:var(--ink)}.bc-writeback{display:flex;align-items:flex-start;gap:11px;padding:14px 16px}.bc-writeback-ico{width:28px;height:28px;display:grid;place-items:center;flex:none;border-radius:50%;background:#e8f8ef;color:#14834c}.bc-writeback strong{display:block;font-size:13.5px;color:var(--ink);margin-bottom:4px}.bc-writeback p{margin:0;color:var(--ink-muted);font-size:12.5px;line-height:1.55}.bc-writeback-links{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:10px}.bc-writeback-links .lnk{display:inline-flex;align-items:center;height:20px;margin:0;padding:0;border:0;background:none;color:var(--brand);font:inherit;font-size:12.5px;font-weight:500;line-height:1;cursor:pointer}.bc-connection-option{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 0;border-top:1px solid var(--hair)}.bc-connection-option:first-child{padding-top:0;border-top:0}.bc-connection-option strong{display:block;font-size:13px;color:var(--ink)}.bc-connection-option span{display:block;font-size:12px;color:var(--ink-muted);line-height:1.5;margin-top:3px}@media(max-width:760px){.bc-store-facts,.bc-credentials,.bc-scope-compare{grid-template-columns:1fr;gap:10px}.bc-scope-heading,.bc-sync-heading,.bc-scope-alert{align-items:flex-start;flex-direction:column}.bc-scope-alert .btn{width:100%;justify-content:center}.bc-store-row,.bc-connection-option{align-items:flex-start;flex-direction:column}.bc-store-row-end{flex-direction:row;align-items:center}}' +
      '</style><style>.bc-sync-panel{overflow:hidden;padding:0!important}.bc-sync-heading{position:relative;align-items:center;padding:16px 18px;background:linear-gradient(120deg,#f2f7ff 0%,#fbfdff 72%);border-bottom:1px solid #d7e4f1;box-shadow:inset 3px 0 0 #4f83d8}.bc-sync-heading .card-title{color:#263b55;font-size:14px;font-weight:750}.bc-sync-heading .muted{color:#657a94!important;line-height:1.45}.bc-sync-content{padding:0 18px 16px;background:#fff}.bc-sync-content .bc-store-row:first-child{padding-top:14px}.bc-sync-actions{display:flex;justify-content:flex-start;padding-top:13px;border-top:1px solid var(--hair)}@media(max-width:760px){.bc-sync-heading{padding:14px 16px}.bc-sync-content{padding:0 16px 14px}}</style>' +
      pageHead('Shopify connection', 'Review the Shopify store and syncs that power your BestCheckout purchase experience.') +
      '<section class="panel card-pad mb-4"><div class="bc-store-kicker">Connected Shopify store</div><div class="flex items-start justify-between" style="gap:12px"><div><div class="bc-store-name">' + esc(store.name) + '</div><div class="bc-store-domain">' + esc(store.url) + '</div></div>' + status + '</div><div class="bc-store-facts"><div class="bc-store-fact"><small>Shop name</small><strong>' + esc(store.name) + '</strong></div><div class="bc-store-fact"><small>Myshopify domain</small><strong>' + esc(store.url) + '</strong></div><div class="bc-store-fact"><small>Connection status</small><strong>' + (permissionsHealthy ? 'Ready for checkout' : 'Needs re-authorization') + '</strong></div></div></section>' +
      '<section class="panel card-pad mb-4"><div class="bc-scope-heading"><div><div class="bc-scope-title"><div class="card-title">App permissions</div><a class="bc-scope-docs" href="' + SHOPIFY_SCOPES_DOCS + '" target="_blank" rel="noopener" aria-label="Shopify API access scopes" title="Shopify API access scopes">?</a></div><div class="muted" style="font-size:12.5px;margin-top:2px">' + esc(grantedCount + ' of ' + SHOPIFY_REQUIRED_SCOPES.length + ' required permissions granted') + '</div></div>' + permissionStatus + '</div><div class="bc-scope-compare">' + grantedPanel + (permissionsHealthy ? '' : missingPanel) + '</div>' + (permissionsHealthy
        ? '<p class="muted" style="margin:12px 0 0;font-size:12.5px;line-height:1.55">All required permissions are granted. Downstream checkout, sync, and order write-back can run.</p>'
        : '<div class="bc-scope-alert"><div>' + I.alert + '<span>Some required permissions are missing. Request a new install link so the store owner can confirm the updated access.</span></div><button type="button" class="btn btn-primary" data-act="reauth-shopify"><span>Request new install link</span></button></div>') + '</section>' +
      '<section class="panel mb-4 bc-sync-panel"><div class="bc-sync-heading"><div>' + sectionTitle('Shopify → BestCheckout data sync', 'BestCheckout reads Shopify as the source of truth for checkout. Data flows one way into BestCheckout.') + '</div><span class="pill pill-green bc-sync-status"><span class="dot"></span><span data-sync-summary>All data synced · 5 min ago</span></span></div>' +
        '<div class="bc-sync-content"><div class="bc-sync-rows">' +
          syncRow('Products, variants & inventory', '1,310 products', 'Product selection, SKU, price, and inventory checks') +
          syncRow('Collections', '48 collections', 'Collection selectors, collection rules, and product filters') +
          syncRow('Customers & order history', '215 customers', 'Customer eligibility, tags, and returning-customer rules') +
          syncRow('Discounts & discount codes', '23 active', 'Automatic discounts, discount codes, and offer eligibility') +
          syncRow('Shipping zones, rates & delivery profiles', '9 profiles', 'Accurate shipping calculation after the buyer enters an address') +
          syncRow('Store settings', 'USD · en-US', 'Store currency, timezone, and brand defaults') +
        '</div><div class="bc-sync-actions"><button class="btn btn-default" data-act="sync">Sync now</button></div></div>' +
      '</section>' +
      '<section class="panel card-pad mb-4">' + sectionTitle('Order write-back to Shopify', 'BestCheckout creates the order, then Shopify remains the fulfillment workspace.') +
        '<div class="mt-4"><div class="b-c bc-writeback"><span class="bc-writeback-ico">' + I.check + '</span><div><strong>Paid BestCheckout orders are automatically created in Shopify</strong><p>After payment, your existing Shopify fulfillment workflow continues as usual. There is no setting to save on this page.</p><div class="bc-writeback-links"><a class="lnk" href="#/orders">View orders</a></div></div></div></div>' +
      '</section>';

    // The shared Settings frame keeps this operational overview readable while
    // allowing its cards and data rows to use the full settings content width.
    paint(body, false);
    const sync = root.querySelector('[data-act="sync"]');
    if (sync) sync.onclick = () => {
      sync.disabled = true; sync.textContent = 'Syncing…';
      root.querySelectorAll('[data-sync-summary]').forEach((el) => { el.textContent = 'Syncing data…'; });
      setTimeout(() => {
        if (!root || !root.contains(sync)) return;
        sync.disabled = false; sync.textContent = 'Sync now';
        root.querySelectorAll('[data-sync-summary]').forEach((el) => { el.textContent = 'All data synced · just now'; });
        toast('Shopify data sync completed');
      }, 650);
    };
    const copyMissing = root.querySelector('[data-act="copy-missing-scopes"]');
    if (copyMissing) copyMissing.onclick = () => {
      try { navigator.clipboard.writeText(missingList); } catch (e) {}
      toast('Missing scopes copied');
    };
    const copyGranted = root.querySelector('[data-act="copy-granted-scopes"]');
    if (copyGranted) copyGranted.onclick = () => {
      try { navigator.clipboard.writeText(grantedList); } catch (e) {}
      toast('Granted scopes copied');
    };
    const reauth = root.querySelector('[data-act="reauth-shopify"]');
    if (reauth) reauth.onclick = () => {
      const handle = String(store.url || '').replace(/\.myshopify\.com$/i, '');
      window.location.assign('../?entry=connect-new-shopify-store#/connect-shopify?status=pending&shop=' + encodeURIComponent(handle));
    };
  }

  const SUB_CATALOG = {
    'Daily Multivitamin (60 ct)': 38,
    'Neurix Focus & Energy Gum': 34.99,
    'Signature Blend Coffee 500g': 30,
    'Vitamin C Serum Refill 30ml': 52,
    'Limited Winter Candle': 28,
    'Focus Gum — Multipack': 49.98,
    'Collagen Peptides 30-Day': 44,
    'Magnesium Sleep Gummies': 26,
    'Protein Powder 2lb': 48,
    'Daily Immune Support Complex with Elderberry (90 ct)': 36,
  };
  const SUB_IMGS = [
    'https://silixwear.com/cdn/shop/files/Dark-GRAY.jpg?v=1776154216&width=160',
    'https://silixwear.com/cdn/shop/files/01_cf6e37ef-a0ab-4c82-ac61-c30d06d3111e.jpg?width=160',
    'https://silixwear.com/cdn/shop/files/01_50091071-d25f-4060-9fce-acd28e12ce10.jpg?width=160',
    'https://silixwear.com/cdn/shop/files/7_3bd5ccd0-0637-4559-b7be-1cd8196b15d4.jpg?width=160',
  ];
  const SUB_KW_FIELDS = [
    { value: 'name', label: 'Subscription name', placeholder: 'Search subscription name' },
    { value: 'product_title', label: 'Product title', placeholder: 'Search product title' },
    { value: 'product_id', label: 'Shopify product ID', placeholder: 'Search Shopify product ID' },
    { value: 'id', label: 'Subscription ID', placeholder: 'Search subscription ID' },
  ];
  let SUB_LST = { kw: '', kwApplied: '', kwType: 'name', origin: '', visibility: '', status: '', page: 1, size: 20 };
  let SUB_EDIT = null;
  let SUB_EDIT_KEY = null;
  let SUB_EDIT_ORIGIN = null;
  let SUB_EDIT_BACKUP = null;
  let SUB_ERRORS = {};
  let SUB_PREVIEW_MODE = 'sub';
  const SUB_STYLES =
    '.bn-sw{position:relative;display:inline-block;width:34px;height:18px;border-radius:9999px;background:var(--ctl);cursor:pointer;transition:background .15s;flex:none}' +
    '.bn-sw::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .15s;box-shadow:0 1px 2px rgba(0,0,0,.2)}' +
    '.bn-sw.on{background:var(--brand)}.bn-sw.on::after{transform:translateX(16px)}' +
    '.bn-sw.is-disabled{opacity:.55;cursor:default}' +
    '.bn-ribbon{position:absolute;top:-8px;right:12px;z-index:2;background:var(--ribbon,#8a5a2b);color:#fff;font-size:10px;font-weight:700;line-height:1.2;letter-spacing:.02em;padding:4px 10px;border-radius:999px;white-space:nowrap;pointer-events:none}' +
    '.bn-act{display:inline-grid;place-items:center;width:30px;height:30px;border:0;border-radius:7px;background:transparent;color:var(--ink-muted);cursor:pointer}' +
    '.bn-act:hover{background:var(--panel);color:var(--ink)}' +
    '.sub-editor{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:24px;align-items:start;max-width:1220px;margin:0 auto}' +
    '.sub-preview-card{position:sticky;top:16px}' +
    '.sub-ck{background:#f5f5f5;border:1px solid var(--hair);border-radius:12px;padding:16px 14px}' +
    '.sub-ck-row{display:flex;align-items:flex-start;gap:10px}' +
    '.sub-ck-img{width:40px;height:40px;border-radius:8px;overflow:hidden;background:#e9ecf2;flex:none}' +
    '.sub-ck-img img{width:100%;height:100%;object-fit:cover;display:block}' +
    '.sub-ck-title{font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.35}' +
    '.sub-ck-pr{margin-left:auto;flex:none;white-space:nowrap;font-size:13.5px;font-weight:650}' +
    '.sub-ck-pr s{font-size:12px;color:var(--ink-muted);font-weight:500;margin-right:6px}' +
    '.sub-ck-deal{display:flex;align-items:center;justify-content:flex-end;gap:5px;margin-top:4px;font-size:12px;color:var(--ink-muted)}' +
    '.sub-err{color:var(--err);font-size:12px;margin-top:5px}' +
    '.bn-num input::-webkit-outer-spin-button,.bn-num input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}' +
    '.bn-num input[type=number]{-moz-appearance:textfield}' +
    '.sub-tbl{width:100%;table-layout:fixed}' +
    '.sub-tbl th,.sub-tbl td{padding:12px 16px}' +
    '.sub-tbl th:last-child,.sub-tbl td:last-child{width:72px;padding-right:16px;text-align:center}' +
    '.sub-tbl td{white-space:nowrap}' +
    '.sub-tbl .sub-clip{overflow:hidden;text-overflow:ellipsis}' +
    '.sub-tbl .sub-prod{white-space:normal}' +
    '.sub-tbl .sub-bun{display:flex;align-items:center;gap:6px;margin-top:3px;min-width:0}' +
    '.sub-src-tag{display:inline-block;font-size:10px;margin-top:0}' +
    '.sub-tbl .sub-vis{white-space:normal}' +
    '.sub-tbl .sub-offer{white-space:normal;line-height:1.55}' +
    '.sub-tbl .sub-offer>div{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.sub-vis-pills{display:flex;flex-direction:column;align-items:flex-start;gap:5px}' +
    '.sub-vis-pill{font-size:12px;padding:4px 10px;white-space:nowrap}' +
    '.sub-ct-tbl{width:100%;min-width:1020px;table-layout:fixed}' +
    '.sub-ct-tbl th,.sub-ct-tbl td{padding:12px 14px}' +
    '.sub-ct-tbl th:last-child,.sub-ct-tbl td:last-child{padding-right:16px;text-align:center}' +
    '.sub-ct-tbl td{white-space:nowrap}' +
    '.sub-ct-tbl .num{padding-left:12px;padding-right:20px}' +
    '.sub-ct-tbl th.num,.sub-ct-tbl td.num{width:112px}' +
    '.sub-ct-tbl th.sub-ct-next,.sub-ct-tbl td.sub-ct-next{width:132px}' +
    '.sub-ct-tbl .sub-clip{overflow:hidden;text-overflow:ellipsis}' +
    '@media(max-width:980px){.sub-editor{grid-template-columns:1fr}.sub-preview-card{position:static}}';

  function isLocalPlan(p) { return !!(p && p.origin === 'bestcheckout'); }
  function activeBundleFor(productName, productId) {
    const list = ((window.DATA_BUNDLES || {}).bundles || []);
    const name = String(productName || '').trim().toLowerCase();
    const id = String(productId || '').replace(/\D/g, '');
    return list.find((b) => {
      if ((b.status || '') !== 'active') return false;
      const bn = String(b.parentProduct || '').trim().toLowerCase();
      const bid = String(b.parentProductId || '').replace(/\D/g, '');
      if (id && bid && bid === id) return true;
      if (name && bn && (name === bn || name.indexOf(bn) === 0 || bn.indexOf(name) === 0)) return true;
      return false;
    }) || null;
  }
  function showsOnProductPage(p) {
    if (!p || (p.status || 'active') !== 'active') return false;
    const bun = activeBundleFor(p.product, p.productId);
    if (!bun) return false;
    if (p.bundleId && String(p.bundleId) !== String(bun.id)) return false;
    return true;
  }
  function planKey(p) { return (p && (p.key || p.id)) || ''; }
  function planByKey(key) {
    const k = decodeURIComponent(String(key || ''));
    return (subscriptionState().sellingPlans || []).find((p) => String(p.key) === k || String(p.id) === k) || null;
  }
  function planSurface(p) {
    return activeBundleFor(p && p.product, p && p.productId) ? 'pdp' : 'checkout';
  }
  function visibilityLabel(p) {
    return planSurface(p) === 'pdp' ? 'Product page + Checkout' : 'Checkout';
  }
  function visibilityPills(p) {
    const checkout = '<span class="pill pill-gray sub-vis-pill">Checkout</span>';
    if (planSurface(p) !== 'pdp') return checkout;
    return '<div class="sub-vis-pills"><span class="pill pill-green sub-vis-pill">Product page</span>' + checkout + '</div>';
  }
  function visibilityNote(p) {
    const bun = activeBundleFor(p && p.product, p && p.productId);
    if (bun && (p && (p.status || 'active') === 'active')) {
      return 'This product has an active Bundle. Shoppers pick One-time or Subscribe & Save on the product page. Price is the current pack × this discount.';
    }
    if (bun) {
      return 'This product has an active Bundle. Activate this plan to show One-time / Subscribe & Save on the product page.';
    }
    if (p && p.forceSubscription) {
      return 'This product has no active Bundle. Checkout uses this plan even if the shopper did not check Subscribe on the product page.';
    }
    return 'This product has no active Bundle, so BestCheckout does not take over the product page. Checkout follows the shopper\'s subscribe checkbox only when this plan is active.';
  }
  function showsForceSubscription(p) {
    return !!(p && String(p.product || '').trim() && !activeBundleFor(p.product, p.productId));
  }
  function showsDeliveryDetails(p) {
    return !p || p.showDeliveryDetails !== false;
  }
  function sourceLabel(p) {
    return isLocalPlan(p) ? 'BestCheckout' : ((p && p.sourceApp) || 'Shopify');
  }
  function catalogPriceOf(p) {
    if (p && p.catalogPrice != null && p.catalogPrice !== '') return Number(p.catalogPrice);
    if (p && p.product && SUB_CATALOG[p.product] != null) return SUB_CATALOG[p.product];
    return null;
  }
  function discountAmount(p) {
    const price = catalogPriceOf(p);
    if (price == null) return 0;
    const d = p && p.discount;
    if (!d) return 0;
    if (d.type === 'fixed') return Number(d.value) || 0;
    return Math.round(price * (Number(d.value) || 0)) / 100;
  }
  function imgAt(url, w) {
    if (!url) return url;
    return /[?&]width=\d+/.test(url)
      ? url.replace(/width=\d+/, 'width=' + w)
      : url + (url.indexOf('?') >= 0 ? '&' : '?') + 'width=' + w;
  }
  function subProductImage(name, explicit) {
    if (explicit) return explicit;
    const s = String(name || '');
    if (!s) return '';
    let h = 0, i = 0;
    for (; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return SUB_IMGS[h % SUB_IMGS.length];
  }
  function subProductThumb(name, px) {
    const size = px || 36;
    const src = subProductImage(name);
    return '<span class="sub-ck-img" style="width:' + size + 'px;height:' + size + 'px">' +
      (src ? '<img src="' + esc(src) + '" alt="" onerror="this.remove()" />' : '') +
      '</span>';
  }
  function nextLocalKey() {
    const nums = (subscriptionState().sellingPlans || [])
      .filter((p) => isLocalPlan(p))
      .map((p) => Number(String(p.key || p.id).replace(/\D/g, '')))
      .filter((n) => !isNaN(n));
    return 'PL-' + String((nums.length ? Math.max.apply(null, nums) : 1000) + 1);
  }
  function subscriptionDisplayId(id) {
    const n = Number(String(id || '').replace(/\D/g, ''));
    return isNaN(n) || !String(id || '').replace(/\D/g, '') ? String(id || '') : String(n);
  }
  function sortByCreatedDesc(rows, idOf) {
    rows.sort((a, b) => {
      const da = String((a && (a.createdAt || a.startedAt)) || '');
      const db = String((b && (b.createdAt || b.startedAt)) || '');
      if (da !== db) return da < db ? 1 : -1;
      if (!idOf) return 0;
      const na = Number(idOf(a));
      const nb = Number(idOf(b));
      if (!isNaN(na) && !isNaN(nb) && na !== nb) return nb - na;
      return 0;
    });
    return rows;
  }
  function subscriptionRouteParts() {
    const parts = String(curRest || '').split('/').filter(Boolean);
    if (parts[0] === 'subscriptions') parts.shift();
    return parts;
  }
  function matchShopifyProductId(value, query) {
    const raw = String(value || '').toLowerCase();
    const q = String(query || '').trim().toLowerCase();
    if (!q || !raw) return false;
    if (raw.indexOf(q) >= 0) return true;
    const digits = q.replace(/\D/g, '');
    const idDigits = raw.replace(/\D/g, '');
    return !!(digits && idDigits && idDigits.indexOf(digits) >= 0);
  }
  function subFieldErr(msg) { return msg ? '<div class="sub-err">' + esc(msg) + '</div>' : ''; }
  function clearSubMarkedError(key, el, box) {
    if (key) delete SUB_ERRORS[key];
    [el, box].forEach((node) => {
      if (!node) return;
      node.classList.remove('has-error');
      if (node.previousElementSibling && node.previousElementSibling.classList.contains('ui-select')) {
        node.previousElementSibling.classList.remove('has-error');
      }
      node.querySelectorAll('.sub-err').forEach((n) => n.remove());
      if (node.parentNode) node.parentNode.querySelectorAll(':scope > .sub-err').forEach((n) => n.remove());
    });
  }
  function syncFilterPlaceholder(input, fields, type) {
    const field = (fields || []).find((o) => o.value === type) || (fields || [])[0];
    if (!input || !field) return;
    input.placeholder = field.placeholder || 'Search';
    if (window.I18N && window.I18N.apply) window.I18N.apply(input);
  }
  function packPriceForPlan(p) {
    const bun = activeBundleFor(p && p.product, p && p.productId);
    if (bun && bun.tiers && bun.tiers.length) {
      const ti = bun.defaultTier != null ? bun.defaultTier : 0;
      const tier = bun.tiers[ti] || bun.tiers[0];
      if (tier && tier.price != null && tier.price !== '') return Number(tier.price);
    }
    return catalogPriceOf(p);
  }
  function subscribePrice(oneTime, p) {
    if (oneTime == null) return null;
    const d = p && p.discount;
    if (!d) return oneTime;
    if (d.type === 'fixed') return Math.max(0, Number(oneTime) - Number(d.value || 0));
    return Math.round(Number(oneTime) * (100 - Number(d.value || 0))) / 100;
  }
  function subMoney(n) {
    if (n == null || n === '' || isNaN(Number(n))) return '—';
    return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function subNumInput(id, value, opts) {
    opts = opts || {};
    return '<span class="bn-num" style="' + (opts.w ? 'width:' + opts.w : 'width:100%') + ';display:inline-flex;align-items:stretch;height:36px;border:1px solid var(--ctl);border-radius:var(--radius);overflow:hidden;background:#fff">' +
      '<input class="input" id="' + id + '" type="number"' + (opts.min != null ? ' min="' + opts.min + '"' : '') + (opts.step ? ' step="' + opts.step + '"' : '') + (opts.placeholder ? ' placeholder="' + esc(opts.placeholder) + '"' : '') + ' value="' + (value == null ? '' : esc(value)) + '" style="flex:1;min-width:0;height:100%;border:0;border-radius:0;padding:0 10px" />' +
      '<span style="flex:none;width:20px;display:flex;flex-direction:column;border-left:1px solid var(--ctl)">' +
        '<button type="button" class="bn-nup" tabindex="-1" style="flex:1;border:0;background:#f3f4f8;cursor:pointer;color:var(--ink-muted);font-size:7px;line-height:0">&#9650;</button>' +
        '<button type="button" class="bn-ndn" tabindex="-1" style="flex:1;border:0;border-top:1px solid var(--ctl);background:#f3f4f8;cursor:pointer;color:var(--ink-muted);font-size:7px;line-height:0">&#9660;</button>' +
      '</span></span>';
  }
  function hexToRgba(hex, a) {
    const h = String(hex || '').replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(full, 16);
    if (isNaN(n)) return 'rgba(138,90,43,' + a + ')';
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function styleGlyph(key) {
    const dot = (f) => '<span style="width:7px;height:7px;border-radius:50%;border:1.5px solid ' + (f ? 'var(--brand)' : 'var(--ctl)') + ';background:' + (f ? 'var(--brand)' : 'transparent') + ';flex:none"></span>';
    const bar = (w) => '<span style="height:5px;width:' + w + ';background:#d7dbe7;border-radius:2px;flex:none"></span>';
    const row = (f, w) => '<div style="display:flex;align-items:center;gap:4px">' + dot(f) + bar(w) + '</div>';
    if (key === 'buttons') {
      const cell = (on) => '<span style="height:13px;border:1.5px solid ' + (on ? 'var(--brand)' : 'var(--ctl)') + ';border-radius:3px;display:block"></span>';
      return '<div style="display:grid;grid-template-columns:15px 15px;gap:4px">' + cell(false) + cell(true) + cell(false) + cell(false) + '</div>';
    }
    if (key === 'pills') {
      return '<div style="width:46px;height:16px;border-radius:999px;background:#eef0f5;padding:2px;display:flex;align-items:stretch;gap:2px">' +
        '<span style="flex:1;border-radius:999px;background:#fff;box-shadow:0 1px 2px rgba(15,23,42,.12)"></span>' +
        '<span style="flex:1;border-radius:999px"></span></div>';
    }
    if (key === 'bordered') {
      return '<div style="display:flex;flex-direction:column;gap:4px"><span style="border:1px solid var(--ctl);border-radius:4px;padding:3px 5px;display:block">' + row(false, '26px') + '</span><span style="border:1.5px solid var(--brand);border-radius:4px;padding:3px 5px;display:block">' + row(true, '26px') + '</span></div>';
    }
    if (key === 'autoship') {
      return '<div style="display:flex;flex-direction:column;align-items:center;gap:5px;width:46px">' +
        '<span style="font-size:8px;line-height:1;color:#9aa3b2;letter-spacing:-0.02em">One-time</span>' +
        '<span style="height:11px;width:100%;background:var(--brand);border-radius:3px;display:block"></span></div>';
    }
    return '<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">' + row(false, '32px') + row(true, '26px') + '</div>';
  }
  function bundleTiersForEdit(p) {
    const bun = activeBundleFor(p && p.product, p && p.productId) ||
      ((((window.DATA_BUNDLES || {}).bundles) || []).find((b) => p && p.bundleId && String(b.id) === String(p.bundleId)) || null);
    return (bun && bun.tiers) ? bun.tiers : [];
  }
  function oneTimePriceOf(p) {
    const tiers = bundleTiersForEdit(p);
    if (tiers.length) {
      const ti = Math.max(0, Math.min(Number(p.tierIndex || 0), tiers.length - 1));
      const t = tiers[ti] || tiers[0];
      if (t && t.price != null && t.price !== '') return Number(t.price);
    }
    return packPriceForPlan(p);
  }
  function recurringPriceOf(p) {
    return subscribePrice(oneTimePriceOf(p), p);
  }
  function resolvedTierIndex(p, fallback) {
    const raw = p && p.tierIndex;
    if (raw == null || raw === '') {
      const fb = Number(fallback);
      return isNaN(fb) ? 0 : fb;
    }
    const n = Number(raw);
    return isNaN(n) ? 0 : n;
  }
  function applySelectedTier(p, i) {
    if (!p) return;
    const tiers = bundleTiersForEdit(p);
    const idx = Math.max(0, Math.min(Number(i == null || i === '' ? 0 : i), Math.max(0, tiers.length - 1)));
    p.tierIndex = idx;
    const t = tiers[idx];
    if (!t) return;
    if (t.price != null && t.price !== '') p.catalogPrice = t.price;
    if (!p.interval) p.interval = { every: 1, unit: 'month' };
    p.interval.every = Math.max(1, Number(t.qty) || 1);
  }
  function tierGifts(t) {
    if (!t) return [];
    if (t.gifts && t.gifts.length) return t.gifts;
    return (t.components || []).filter((c) => c && c.role === 'gift' && String(c.product || '').trim());
  }
  function recurringDisplay(p) {
    const rec = recurringPriceOf(p);
    if (rec == null) return '<span class="muted" style="font-weight:400">—</span>';
    const every = Number(p.interval && p.interval.every) || 1;
    const unit = (p.interval && p.interval.unit) || 'month';
    const u = every === 1 ? unit : every + ' ' + unit + 's';
    return subMoney(rec) + '<span class="muted" style="font-weight:400;font-size:12px;margin-left:6px">/ ' + u + '</span>';
  }
  function buyBoxHtml(p) {
    const style = (p && p.widgetStyle) || 'radio';
    const oneTime = oneTimePriceOf(p);
    const rec = subscribePrice(oneTime, p);
    const pct = p && p.discount && p.discount.type === 'percent' ? Number(p.discount.value) || 0 : 0;
    const hasDisc = oneTime != null && rec != null && rec !== oneTime;
    const freqTxt = checkoutCadenceLabel(p && p.interval);
    const mode = SUB_PREVIEW_MODE || 'sub';
    const onOne = mode === 'onetime';
    const onSub = !onOne;
    const radio = (on) => '<span style="width:15px;height:15px;border-radius:50%;border:1.5px solid ' + (on ? 'var(--brand)' : 'var(--ctl)') + ';flex:none;display:inline-grid;place-items:center">' + (on ? '<span style="width:7px;height:7px;border-radius:50%;background:var(--brand)"></span>' : '') + '</span>';
    const save = pct ? '<span class="pill pill-green" style="padding:0 7px">' + pct + '%</span>' : '';
    const onePrice = '<span style="flex:none;white-space:nowrap;font-weight:600">' + subMoney(oneTime) + '</span>';
    const subPrice = '<span style="flex:none;white-space:nowrap">' + (hasDisc ? '<span class="muted" style="text-decoration:line-through">' + subMoney(oneTime) + '</span> ' : '') + '<b>' + subMoney(rec) + '</b></span>';
    const oneRow = (st) => '<label data-buymode="onetime" style="display:flex;align-items:center;gap:8px;cursor:pointer;' + (st || 'padding:6px 0') + '">' + radio(onOne) + '<span style="flex:1">One-time Purchase</span>' + onePrice + '</label>';
    const subRow = (st) => '<label data-buymode="sub" style="display:flex;align-items:center;gap:8px;cursor:pointer;' + (st || 'padding:6px 0') + '">' + radio(onSub) + '<span style="flex:1">Subscribe &amp; Save ' + save + '</span>' + subPrice + '</label>';
    const sel = '<div class="muted" style="margin-top:6px;margin-left:23px;font-size:12.5px">' + esc(freqTxt) + '</div>';
    const head = '<div class="muted" style="font-size:12px;margin-bottom:8px;font-weight:600">Purchase options</div>';
    if (style === 'buttons') {
      const btn = (m, t1, t2, t3, on) => '<div data-buymode="' + m + '" style="border:1.5px solid ' + (on ? 'var(--brand)' : 'var(--ctl)') + ';border-radius:8px;padding:10px;text-align:center;font-size:12px;line-height:1.5;cursor:pointer;display:flex;flex-direction:column;justify-content:center"><div>' + t1 + '</div>' + (t2 ? '<div style="font-weight:600;color:var(--ok)">' + t2 + '</div>' : '') + (t3 ? '<div>' + t3 + '</div>' : '') + '</div>';
      return head + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
        btn('onetime', 'One-time<br>' + subMoney(oneTime), '', '', onOne) +
        btn('sub', 'Subscribe', pct ? 'Save ' + pct + '%' : '', (hasDisc ? '<s class="muted">' + subMoney(oneTime) + '</s> ' : '') + subMoney(rec), onSub) +
      '</div>';
    }
    if (style === 'pills') {
      const subLbl = pct ? 'Subscribe &amp; Save ' + pct + '%' : 'Subscribe &amp; Save';
      const pill = (m, label, on) => '<div data-buymode="' + m + '" style="flex:1;min-width:0;text-align:center;padding:10px 8px;border-radius:999px;font-size:12px;font-weight:600;line-height:1.25;cursor:pointer;' +
        (on ? 'background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(15,23,42,.14)' : 'background:transparent;color:#6b7280') + '">' + label + '</div>';
      return '<div style="display:flex;align-items:stretch;gap:2px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:3px">' +
        pill('onetime', 'One-time purchase', onOne) +
        pill('sub', subLbl, onSub) +
      '</div>';
    }
    if (style === 'bordered') {
      return head + oneRow('border:1px solid ' + (onOne ? 'var(--ink)' : 'var(--hair)') + ';border-radius:8px;padding:11px') +
        '<div style="border:1.5px solid ' + (onSub ? 'var(--ink)' : 'var(--hair)') + ';border-radius:8px;padding:11px;margin-top:8px">' + subRow('') + sel + '</div>';
    }
    if (style === 'autoship') {
      return '<div data-buymode="onetime" style="text-align:center;cursor:pointer;font-size:13px;line-height:1.4;padding:2px 0;color:' + (onOne ? 'var(--ink)' : 'var(--ink-muted)') + '">One-time purchase</div>';
    }
    return head + oneRow() + subRow() + sel;
  }
  function planPreviewHtml(p) {
    const bun = activeBundleFor(p && p.product, p && p.productId);
    const tiers = bundleTiersForEdit(p);
    if (bun && tiers.length) {
      const bc = bun.brandColor || '#8a5a2b';
      const hdr = bun.header || {};
      const sel = Math.max(0, Math.min(resolvedTierIndex(p, bun.defaultTier), tiers.length - 1));
      const head = '<div style="text-align:' + (hdr.align || 'center') + ';font-weight:700;color:' + bc + ';font-size:16px;margin-bottom:14px' + (hdr.line ? ';border-bottom:' + (hdr.thickness || 2) + 'px solid ' + bc + ';padding-bottom:8px' : '') + '">' + esc(hdr.text || 'Bundle') + '</div>';
      const cards = tiers.map((t, i) => {
        const on = i === sel;
        const radio = '<span style="flex:none;width:15px;height:15px;border-radius:50%;border:1.5px solid ' + (on ? bc : 'var(--ctl)') + ';display:inline-grid;place-items:center">' + (on ? '<span style="width:7px;height:7px;border-radius:50%;background:' + bc + '"></span>' : '') + '</span>';
        const badge = t.badge ? '<span class="bn-ribbon" style="--ribbon:' + bc + '">' + esc(t.badge) + '</span>' : '';
        const gifts = tierGifts(t);
        const giftRows = gifts.length ? '<div style="margin:10px -12px -12px;border-radius:0 0 6.5px 6.5px;overflow:hidden' + (on ? '' : ';opacity:0.5') + '">' + gifts.map((g, gi) => {
          const gimg = subProductImage(g.product || g.displayName);
          return '<div class="flex items-center gap-2" style="background:' + hexToRgba(bc, 0.78) + ';color:#fff;font-size:11.5px;padding:7px 12px' + (gi ? ';border-top:1px solid rgba(255,255,255,0.18)' : '') + '">' +
            '<span style="width:38px;height:38px;border-radius:5px;overflow:hidden;background:rgba(255,255,255,0.25);flex:none;display:inline-block">' +
              (gimg ? '<img src="' + esc(gimg) + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.remove()" />' : '') +
            '</span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">+ ' + esc(g.displayName || g.product) + '</span></div>';
        }).join('') + '</div>' : '';
        return '<div data-ptier="' + i + '" style="position:relative;overflow:visible;border:1.5px solid ' + (on ? bc : 'var(--hair)') + ';border-radius:8px;padding:12px;margin-bottom:10px;cursor:pointer">' + badge +
          '<div class="flex items-center justify-between" style="gap:8px"><div class="flex items-center gap-2">' + radio +
            '<div><div style="font-weight:600;font-size:13.5px">' + (esc(t.title) || (t.qty + ' PCS')) + (t.tag ? ' <span style="background:' + bc + ';color:#fff;font-size:9.5px;font-weight:700;border-radius:4px;padding:2px 6px">' + esc(t.tag) + '</span>' : '') + '</div>' +
            (t.subtitle ? '<div class="muted" style="font-size:11.5px">' + esc(t.subtitle) + '</div>' : '') + '</div></div>' +
            '<div style="text-align:right"><span style="font-weight:700;color:' + bc + '">' + subMoney(t.price) + '</span>' + (t.compareAt ? ' <s class="muted" style="font-size:12px">' + subMoney(t.compareAt) + '</s>' : '') + '</div></div>' + giftRows + '</div>';
      }).join('');
      const box = (p.widgetStyle || 'radio') === 'pills'
        ? '<div style="margin:0 0 14px">' + buyBoxHtml(p) + '</div>'
        : '<div style="margin:10px 0 0">' + buyBoxHtml(p) + '</div>';
      const cta = String((bun && bun.buttonText) || '').trim() || 'Buy Now';
      const isAutoship = (p.widgetStyle || 'radio') === 'autoship';
      const oneTime = oneTimePriceOf(p);
      const rec = subscribePrice(oneTime, p);
      const ctaPay = (SUB_PREVIEW_MODE === 'onetime') ? oneTime : rec;
      const ctaLabel = isAutoship && ctaPay != null ? (cta + ' - ' + subMoney(ctaPay)) : cta;
      const ctaMode = isAutoship ? ' data-buymode="sub"' : '';
      return '<div class="i18n-skip">' + head + ((p.widgetStyle || 'radio') === 'pills' ? box + cards : cards + box) +
        '<button class="btn" style="width:100%;justify-content:center;margin-top:12px;height:44px;font-weight:600;background:' + bc + ';color:#fff;border:0;border-radius:8px;cursor:pointer"' + ctaMode + '>' + esc(ctaLabel) + '</button></div>';
    }
    const oneTime = packPriceForPlan(p);
    const rec = subscribePrice(oneTime, p);
    const save = oneTime == null ? 0 : Math.max(0, oneTime - (rec || 0));
    const deal = checkoutCadenceLabel(p && p.interval);
    const img = subProductImage(p && p.product, p && p.image);
    const priceHtml = rec == null
      ? '<div class="sub-ck-pr muted">—</div>'
      : '<div class="sub-ck-pr">' + (save ? '<s>$' + Number(oneTime).toFixed(2) + '</s>' : '') + '<strong>$' + Number(rec).toFixed(2) + '</strong></div>';
    return '<div class="sub-ck i18n-skip">' +
      '<div class="sub-ck-row">' +
        '<span class="sub-ck-img">' + (img ? '<img src="' + esc(img) + '" alt="" />' : '') + '</span>' +
        '<div style="min-width:0;flex:1"><div class="sub-ck-title">' + esc((p && p.product) || 'No product selected') + '</div></div>' +
        priceHtml +
      '</div>' +
      (showsDeliveryDetails(p) ? '<div class="sub-ck-deal">' + I.refresh + '<span>' + esc(deal) + (save ? ' (−$' + save.toFixed(2) + ')' : '') + '</span></div>' : '') +
    '</div>';
  }
  function planProductName(p) { return String((p && p.product) || '').trim(); }
  function activePlanSiblingOf(plan) {
    const product = planProductName(plan);
    const pid = String((plan && plan.productId) || '').replace(/\D/g, '');
    const id = planKey(plan);
    if (!product && !pid) return null;
    return merchantPlans().find((x) => {
      if (planKey(x) === id || (x.status || 'active') !== 'active') return false;
      if (pid && String(x.productId || '').replace(/\D/g, '') === pid) return true;
      return planProductName(x) === product;
    }) || null;
  }
  function deactivateActivePlanSiblings(plan) {
    const product = planProductName(plan);
    const pid = String((plan && plan.productId) || '').replace(/\D/g, '');
    const id = planKey(plan);
    merchantPlans().forEach((x) => {
      if (planKey(x) === id || (x.status || 'active') !== 'active') return;
      if ((pid && String(x.productId || '').replace(/\D/g, '') === pid) || planProductName(x) === product) x.status = 'draft';
    });
  }
  function subscriptionPreviewHtml(note) {
    const onPdp = showsOnProductPage(SUB_EDIT);
    const oneTime = packPriceForPlan(SUB_EDIT);
    const save = oneTime == null ? 0 : Math.max(0, oneTime - (subscribePrice(oneTime, SUB_EDIT) || 0));
    const recurring = subscribePrice(oneTime, SUB_EDIT);
    const deal = checkoutCadenceLabel(SUB_EDIT.interval);
    const img = subProductImage(SUB_EDIT.product);
    if (onPdp) {
      const pct = SUB_EDIT.discount && SUB_EDIT.discount.type === 'percent' ? Number(SUB_EDIT.discount.value) || 0 : 0;
      const radio = (on) => '<span style="width:15px;height:15px;border-radius:50%;border:1.5px solid ' + (on ? 'var(--brand)' : 'var(--ctl)') + ';flex:none;display:inline-grid;place-items:center">' + (on ? '<span style="width:7px;height:7px;border-radius:50%;background:var(--brand)"></span>' : '') + '</span>';
      const moneyTxt = (n) => n == null ? '—' : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return '<div class="i18n-skip" style="border:1px solid var(--hair);border-radius:12px;padding:14px;background:#fff">' +
        '<div class="muted" style="font-size:12px;margin-bottom:8px;font-weight:600">Purchase options</div>' +
        '<label style="display:flex;align-items:center;gap:8px;padding:6px 0"><span style="flex:none">' + radio(false) + '</span><span style="flex:1">One-time Purchase</span><span style="font-weight:600">' + moneyTxt(oneTime) + '</span></label>' +
        '<label style="display:flex;align-items:center;gap:8px;padding:6px 0"><span style="flex:none">' + radio(true) + '</span><span style="flex:1">Subscribe &amp; Save' + (pct ? ' <span class="pill pill-green" style="padding:0 7px">' + pct + '%</span>' : '') + '</span><span>' + (save ? '<s class="muted">' + moneyTxt(oneTime) + '</s> ' : '') + '<b>' + moneyTxt(recurring) + '</b></span></label>' +
        '<div class="muted" style="margin-top:6px;margin-left:23px;font-size:12.5px">' + esc(deal) + '</div>' +
      '</div>' +
      '<p class="muted" style="font-size:12.5px;margin-top:10px;line-height:1.55">' + esc(note || '') + '</p>';
    }
    const priceHtml = recurring == null
      ? '<div class="sub-ck-pr muted">—</div>'
      : '<div class="sub-ck-pr">' + (save ? '<s>$' + Number(oneTime).toFixed(2) + '</s>' : '') + '<strong>$' + Number(recurring).toFixed(2) + '</strong></div>';
    return '<div class="sub-ck i18n-skip">' +
      '<div class="sub-ck-row">' +
        '<span class="sub-ck-img">' + (img ? '<img src="' + esc(img) + '" alt="" />' : '') + '</span>' +
        '<div style="min-width:0;flex:1"><div class="sub-ck-title">' + esc(SUB_EDIT.product || 'No product selected') + '</div></div>' +
        priceHtml +
      '</div>' +
      (showsDeliveryDetails(SUB_EDIT) ? '<div class="sub-ck-deal">' + I.refresh + '<span>' + esc(deal) + (save ? ' (−$' + save.toFixed(2) + ')' : '') + '</span></div>' : '') +
    '</div>' +
    '<p class="muted" style="font-size:12.5px;margin-top:10px;line-height:1.55">' + esc(note || '') + '</p>';
  }

  function renderSubscriptions() {
    const parts = subscriptionRouteParts();
    if (parts[0] === 'contracts') {
      if (parts[1]) return renderContractDetail(parts[1]);
      return renderContractList();
    }
    if (parts[0] === 'new' || parts[0] === 'create') return renderSubscriptionEditor(null);
    if (parts[0] === 'edit' && parts[1]) {
      const plan = planByKey(parts[1]);
      if (!plan || !isLocalPlan(plan)) { toast('This subscription was not found'); location.hash = '#/subscriptions'; return; }
      return renderSubscriptionEditor(plan);
    }
    renderSubscriptionList();
  }

  let SUB_CT = { tab: 'all', kw: '', kwApplied: '', kwType: 'customer', page: 1, size: 20 };
  const SUB_CT_FIELDS = [
    { value: 'customer', label: 'Customer', placeholder: 'Search customer' },
    { value: 'email', label: 'Email', placeholder: 'Search email' },
    { value: 'plan', label: 'Subscription', placeholder: 'Search subscription' },
    { value: 'id', label: 'Contract ID', placeholder: 'Search contract ID' },
  ];
  const SUB_CT_TABS = [
    { k: 'all', label: 'All' },
    { k: 'active', label: 'Active' },
    { k: 'unpaid', label: 'Past due' },
    { k: 'cancelled', label: 'Cancelled' },
  ];
  function contractList() { return subscriptionState().contracts || []; }
  function contractById(id) {
    const k = decodeURIComponent(String(id || ''));
    return contractList().find((c) => String(c.id) === k || String(c.subscriptionId) === k) || null;
  }
  function contractStatusMeta(status) {
    if (status === 'active') return { label: 'Active', cls: 'pill-green' };
    if (status === 'unpaid') return { label: 'Past due', cls: 'pill-red' };
    return { label: 'Cancelled', cls: 'pill-gray' };
  }
  function contractPill(status) {
    const m = contractStatusMeta(status);
    return '<span class="pill ' + m.cls + '">' + m.label + '</span>';
  }
  function contractMoney(n) {
    return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function contractDate(s) {
    if (!s) return '—';
    const d = new Date(String(s).slice(0, 10) + 'T00:00:00');
    if (isNaN(d.getTime())) return esc(s);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function contractGateway(id) {
    return ({ stripe: 'Stripe', airwallex: 'Airwallex', paypal: 'PayPal' })[id] || id || '—';
  }
  function contractRow(k, v) {
    return '<div class="flex items-center justify-between" style="padding:7px 0;border-bottom:1px solid var(--hair);font-size:13.5px"><span class="muted">' + k + '</span><span style="color:var(--ink);font-weight:500;text-align:right">' + v + '</span></div>';
  }
  function contractCard(title, inner) {
    return '<div class="panel card-pad mb-4"><div class="mb-3"><div class="card-title">' + title + '</div></div>' + inner + '</div>';
  }
  function addContractCycle(dateStr, every, unit, n) {
    if (!dateStr) return '';
    const d = new Date(String(dateStr).slice(0, 10) + 'T00:00:00');
    const step = (every || 1) * n;
    if (unit === 'week') d.setDate(d.getDate() + 7 * step);
    else if (unit === 'year') d.setFullYear(d.getFullYear() + step);
    else d.setMonth(d.getMonth() + step);
    const p2 = (x) => (String(x).length < 2 ? '0' + x : String(x));
    return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate());
  }
  function orderHref(id) { return id ? '#/orders/' + encodeURIComponent(id) : ''; }
  function planHref(key) { return key ? '#/subscriptions/edit/' + encodeURIComponent(key) : ''; }

  function renderContractList() {
    const field = SUB_CT_FIELDS.find((f) => f.value === SUB_CT.kwType) || SUB_CT_FIELDS[0];
    const kwOpts = SUB_CT_FIELDS.map((f) => '<option value="' + f.value + '"' + (f.value === SUB_CT.kwType ? ' selected' : '') + '>' + f.label + '</option>').join('');
    let rows = contractList().slice();
    if (SUB_CT.tab !== 'all') rows = rows.filter((c) => c.status === SUB_CT.tab);
    if (SUB_CT.kwApplied) {
      const q = SUB_CT.kwApplied.toLowerCase();
      rows = rows.filter((c) => {
        if (SUB_CT.kwType === 'email') return String(c.email || '').toLowerCase().indexOf(q) >= 0;
        if (SUB_CT.kwType === 'plan') return String(c.plan || '').toLowerCase().indexOf(q) >= 0 || String(c.product || '').toLowerCase().indexOf(q) >= 0;
        if (SUB_CT.kwType === 'id') return String(c.id || '').toLowerCase().indexOf(q) >= 0 || String(c.subscriptionId || '').indexOf(q) >= 0;
        return String(c.customer || '').toLowerCase().indexOf(q) >= 0;
      });
    }
    sortByCreatedDesc(rows, (c) => c.subscriptionId);
    const total = rows.length;
    const pages = Math.max(1, Math.ceil(total / SUB_CT.size));
    if (SUB_CT.page > pages) SUB_CT.page = pages;
    const pageRows = rows.slice((SUB_CT.page - 1) * SUB_CT.size, SUB_CT.page * SUB_CT.size);
    const counts = { all: contractList().length, active: 0, unpaid: 0, cancelled: 0 };
    contractList().forEach((c) => { if (counts[c.status] != null) counts[c.status] += 1; });
    const tabs = SUB_CT_TABS.map((t) =>
      '<div class="tab' + (t.k === SUB_CT.tab ? ' active' : '') + '" data-ct-tab="' + t.k + '">' + t.label +
      '<span class="count-badge">' + (counts[t.k] || 0) + '</span></div>').join('');
    const tags = SUB_CT.kwApplied
      ? '<div class="flex gap-2 mt-3" style="flex-wrap:wrap"><span class="field-pill" data-clear-ct>' + esc(field.label) + ': ' + esc(SUB_CT.kwApplied) + ' <span class="x">&times;</span></span></div>'
      : '';
    const tableRows = pageRows.map((c) =>
      '<tr data-cid="' + esc(c.id) + '" style="cursor:pointer">' +
        '<td><div class="sub-clip" style="font-weight:600;color:var(--ink)">' + esc(c.customer) + '</div><div class="muted sub-clip" style="font-size:12px">' + esc(c.email) + '</div></td>' +
        '<td><div class="sub-clip">' + esc(c.plan) + '</div><div class="muted sub-clip" style="font-size:12px">' + esc(c.product) + '</div></td>' +
        '<td>' + esc(intervalLabel(c.interval)) + '</td>' +
        '<td class="sub-ct-next">' + (c.next ? contractDate(c.next) : '<span class="muted">—</span>') + '</td>' +
        '<td class="num">' + contractMoney(c.amount) + '</td>' +
        '<td>' + contractPill(c.status) + '</td>' +
        '<td style="text-align:center" data-stop><button class="bn-act" data-view-ct="' + esc(c.id) + '" title="View" aria-label="View">' + I.eye + '</button></td>' +
      '</tr>').join('');
    let pagerNums = '';
    const pagerItem = (label, page, opts) => {
      opts = opts || {};
      return '<span class="pg-item' + (opts.active ? ' active' : '') + (opts.disabled ? ' disabled' : '') + '"' +
        (opts.disabled ? '' : ' data-ct-page="' + page + '"') + '>' + label + '</span>';
    };
    for (let p = 1; p <= pages; p++) pagerNums += pagerItem(String(p), p, { active: p === SUB_CT.page });
    const pager = '<div class="pg">' + pagerItem('‹', SUB_CT.page - 1, { disabled: SUB_CT.page <= 1 }) + pagerNums +
      pagerItem('›', SUB_CT.page + 1, { disabled: SUB_CT.page >= pages }) +
      '<select class="pg-size" id="ct-pgsize">' + ['20', '50', '100'].map((s) => '<option value="' + s + '"' + (Number(s) === SUB_CT.size ? ' selected' : '') + '>' + s + ' / page</option>').join('') + '</select></div>';
    paint(
      '<style>' + SUB_STYLES + '</style>' +
      '<div class="flex items-center justify-between mb-4" style="gap:12px"><div><h1 class="page-title">Contracts</h1>' +
        '<div class="muted" style="font-size:13px;margin-top:3px;line-height:1.5">Created after a successful BestCheckout payment. Shopify app contracts stay in that app.</div></div></div>' +
      '<div class="panel">' +
        '<div class="tabs" style="padding:0 8px">' + tabs + '</div>' +
        '<div class="card-pad" style="padding-bottom:8px"><div class="filter-bar">' +
          '<div class="flex items-center" style="min-width:400px">' +
            '<select class="filter-select" id="ct-kwtype" data-ui-fit data-ui-match-width style="border-top-right-radius:0;border-bottom-right-radius:0">' + kwOpts + '</select>' +
            '<div style="position:relative;flex:1">' +
              '<input class="filter-input" id="ct-kw" placeholder="' + esc(field.placeholder) + '" value="' + esc(SUB_CT.kw) + '" style="width:100%;padding-left:12px;padding-right:32px;border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px" />' +
              '<span class="filter-ico">' + svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>', 14) + '</span>' +
            '</div></div>' +
        '</div>' + tags + '</div>' +
        '<div style="overflow-x:auto"><table class="tbl sub-ct-tbl"><colgroup>' +
          '<col style="width:22%"><col style="width:26%"><col style="width:16%"><col style="width:132px"><col style="width:112px"><col style="width:100px"><col style="width:72px">' +
        '</colgroup><thead><tr>' +
          '<th>Customer</th><th>Subscription</th><th>Frequency</th><th class="sub-ct-next">Next charge</th><th class="num">Amount</th><th>Status</th><th style="text-align:center">Action</th>' +
        '</tr></thead><tbody id="ct-tbody">' +
          (tableRows || '<tr><td colspan="7" style="text-align:center;padding:40px" class="muted">No contracts in this view.</td></tr>') +
        '</tbody></table></div>' +
        '<div class="flex items-center justify-between card-pad"><span class="muted" style="font-size:13px">Total ' + total + ' records</span>' + pager + '</div>' +
      '</div>',
      'full'
    );
    const kwType = root.querySelector('#ct-kwtype');
    const kw = root.querySelector('#ct-kw');
    if (kwType) kwType.onchange = () => {
      SUB_CT.kwType = kwType.value;
      syncFilterPlaceholder(kw, SUB_CT_FIELDS, SUB_CT.kwType);
      if (SUB_CT.kwApplied) { SUB_CT.page = 1; renderContractList(); }
    };
    if (kw) {
      kw.oninput = () => { SUB_CT.kw = kw.value; };
      const commit = () => { SUB_CT.kw = kw.value; SUB_CT.kwApplied = SUB_CT.kw.trim(); SUB_CT.page = 1; renderContractList(); };
      kw.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } };
      kw.onblur = commit;
    }
    root.querySelectorAll('[data-clear-ct]').forEach((el) => el.onclick = () => { SUB_CT.kw = ''; SUB_CT.kwApplied = ''; SUB_CT.page = 1; renderContractList(); });
    root.querySelectorAll('[data-ct-tab]').forEach((el) => el.onclick = () => { SUB_CT.tab = el.getAttribute('data-ct-tab'); SUB_CT.page = 1; renderContractList(); });
    root.querySelectorAll('[data-ct-page]').forEach((el) => el.onclick = () => { SUB_CT.page = Number(el.getAttribute('data-ct-page')); renderContractList(); });
    const pg = root.querySelector('#ct-pgsize');
    if (pg) pg.onchange = () => { SUB_CT.size = Number(pg.value); SUB_CT.page = 1; renderContractList(); };
    root.querySelectorAll('#ct-tbody tr[data-cid]').forEach((tr) => tr.onclick = (e) => {
      if (e.target.closest('[data-stop]')) return;
      location.hash = '#/subscriptions/contracts/' + encodeURIComponent(tr.getAttribute('data-cid'));
    });
    root.querySelectorAll('[data-view-ct]').forEach((btn) => btn.onclick = (e) => {
      e.stopPropagation();
      location.hash = '#/subscriptions/contracts/' + encodeURIComponent(btn.getAttribute('data-view-ct'));
    });
  }

  function renderContractDetail(id) {
    const c = contractById(id);
    if (!c) { toast('This contract was not found'); location.hash = '#/subscriptions/contracts'; return; }
    const planLink = c.planKey
      ? '<a href="' + planHref(c.planKey) + '" style="color:var(--brand);font-weight:500;text-decoration:none">' + esc(c.plan) + '</a>'
      : esc(c.plan);
    const productCell = '<div class="flex items-center gap-2" style="justify-content:flex-end">' + subProductThumb(c.product, 28) + '<span>' + esc(c.product) + '</span></div>';
    const summary = contractRow('Subscription', planLink) + contractRow('Product', productCell) + contractRow('Quantity', c.qty || 1) +
      contractRow('Billing cycle', intervalLabel(c.interval)) + contractRow('Amount per cycle', contractMoney(c.amount)) +
      contractRow('Started', contractDate(c.startedAt)) + contractRow('Charges completed', c.cyclesDone || 0);
    const overdue = c.status === 'unpaid';
    const schedule = c.status === 'cancelled'
      ? '<div class="muted" style="font-size:13.5px">Ended on ' + contractDate(c.endedAt) + '. No further charges.</div>'
      : '<div style="font-size:13.5px;color:var(--ink)">' + (overdue
        ? '<span style="color:var(--err)">Payment overdue since <b>' + contractDate(c.next) + '</b></span>'
        : 'Next charge on <b>' + contractDate(c.next) + '</b>') + ' · ' + contractMoney(c.amount) + '</div>' +
        '<div class="muted" style="font-size:12px;margin-top:6px">Charged automatically via ' + esc(contractGateway(c.gateway)) + '.</div>';
    const history = !(c.history || []).length
      ? '<div class="muted" style="font-size:13px">No charges yet.</div>'
      : '<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Order</th><th>Date</th><th class="num">Amount</th><th style="width:110px">Status</th></tr></thead><tbody>' +
        c.history.map((o) => {
          const href = orderHref(o.id);
          const label = esc(o.sn || o.id);
          return '<tr><td>' + (href ? '<a href="' + href + '" style="color:var(--brand);font-weight:500;text-decoration:none">' + label + '</a>' : label) + '</td><td>' + contractDate(o.date) + '</td><td class="num">' + contractMoney(o.amount) + '</td><td>' +
            '<span class="pill ' + (o.status === 'paid' ? 'pill-green' : o.status === 'failed' ? 'pill-red' : 'pill-gray') + '">' + (o.status === 'paid' ? 'Paid' : o.status === 'failed' ? 'Failed' : esc(o.status)) + '</span></td></tr>';
        }).join('') + '</tbody></table></div>';
    let upcoming = '';
    if (c.status === 'cancelled') upcoming = '<div class="muted" style="font-size:13px">No upcoming charges — this subscription has ended.</div>';
    else if (!c.next) upcoming = '<div class="muted" style="font-size:13px">No upcoming charges scheduled.</div>';
    else {
      const every = (c.interval && c.interval.every) || 1;
      const unit = (c.interval && c.interval.unit) || 'month';
      let rows = '';
      for (let i = 0; i < 4; i++) {
        const date = i === 0 ? c.next : addContractCycle(c.next, every, unit, i);
        const lbl = i === 0 ? (overdue ? 'Overdue' : 'Next charge') : 'Scheduled';
        const cls = (i === 0 && overdue) ? 'pill-red' : (i === 0 ? 'pill-blue' : 'pill-gray');
        rows += '<tr><td>' + contractDate(date) + '</td><td>' + esc(c.product) + '</td><td class="num">' + contractMoney(c.amount) + '</td><td><span class="pill ' + cls + '">' + lbl + '</span></td></tr>';
      }
      upcoming = '<div style="overflow-x:auto"><table class="tbl"><thead><tr><th style="width:130px">Charge date</th><th>Product</th><th class="num" style="width:90px">Amount</th><th style="width:120px">Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<div class="muted" style="font-size:12px;margin-top:8px">Projected from the current schedule.</div>';
    }
    const ev = [{
      d: c.startedAt,
      t: 'Subscription started',
      sub: (c.source === 'post_purchase' ? 'Opened after a post-purchase add-on. ' : '') + 'Subscription: ' + c.plan,
    }];
    (c.history || []).forEach((o) => ev.push({
      d: o.date,
      t: (o.status === 'paid' ? 'Charge succeeded' : o.status === 'failed' ? 'Charge failed' : 'Charge ' + o.status) + ' · ' + contractMoney(o.amount),
      orderId: o.id, orderSn: o.sn,
    }));
    if (c.status === 'cancelled') ev.push({ d: c.endedAt, t: 'Subscription cancelled', sub: 'No further charges' });
    else if (c.next) ev.push({ d: c.next, t: 'Next charge scheduled', sub: contractMoney(c.amount), future: true });
    ev.sort((a, b) => String(b.d || '').localeCompare(String(a.d || '')));
    const activity = '<div>' + ev.map((e, i) => {
      const last = i === ev.length - 1;
      const orderBit = e.orderId
        ? '<div class="muted" style="font-size:12px">Order <a href="' + orderHref(e.orderId) + '" style="color:var(--brand);text-decoration:none">' + esc(e.orderSn || e.orderId) + '</a></div>'
        : (e.sub ? '<div class="muted" style="font-size:12px">' + esc(e.sub) + '</div>' : '');
      return '<div style="display:flex;gap:12px">' +
        '<div style="flex:none;display:flex;flex-direction:column;align-items:center"><span style="width:10px;height:10px;border-radius:50%;flex:none;margin-top:3px;background:' + (e.future ? 'var(--ctl)' : 'var(--brand)') + '"></span>' +
        (last ? '' : '<span style="flex:1;width:2px;background:var(--hair);margin:2px 0"></span>') + '</div>' +
        '<div style="flex:1;min-width:0;padding-bottom:' + (last ? '0' : '16px') + '"><div style="font-size:13px;color:var(--ink);font-weight:500">' + esc(e.t) + '</div>' + orderBit + '</div>' +
        '<div class="muted" style="font-size:12px;white-space:nowrap;flex:none">' + (e.d ? contractDate(e.d) : '') + '</div></div>';
    }).join('') + '</div>';
    const actBtn = (act, txt, danger) => '<button class="btn btn-default" type="button" data-ca="' + act + '" style="width:100%;justify-content:center;margin-bottom:8px' + (danger ? ';color:var(--err);border-color:#f3c4ba' : '') + '">' + txt + '</button>';
    let actions = '';
    if (c.status === 'cancelled') actions = '<div class="muted" style="font-size:13px">Cancelled on ' + contractDate(c.endedAt) + '. No further charges.</div>';
    else {
      if (c.status === 'active') actions += actBtn('address', 'Edit shipping address');
      if (c.status === 'unpaid') actions += actBtn('retry', 'Retry payment now') + actBtn('method', 'Update payment method');
      actions += actBtn('cancel', 'Cancel subscription', true);
    }
    const customer = contractRow('Name', esc(c.customer)) + contractRow('Email', esc(c.email)) +
      '<div style="padding-top:8px;font-size:12.5px;color:var(--ink-body);line-height:1.5"><span class="muted">Ships to</span><br>' + esc(c.address) + '</div>';
    const payment = contractRow('Method', esc(c.method || '—')) + contractRow('Gateway', esc(contractGateway(c.gateway)));
    paint(
      '<style>' + SUB_STYLES + '</style>' +
      '<div class="detail-wrap">' +
        '<div class="flex items-center justify-between mb-6"><div class="flex items-center gap-2">' +
          '<a class="back-btn" href="#/subscriptions/contracts" title="Back">' + I.chevL + '</a>' +
          '<span class="page-title">' + esc(c.customer) + '</span> ' + contractPill(c.status) +
        '</div><span class="muted" style="font-size:13px">Contracts ID：' + esc(c.subscriptionId != null && c.subscriptionId !== '' ? String(c.subscriptionId) : String(c.id || '').replace(/^SUB-/i, '')) + '</span></div>' +
        '<div class="detail-cols"><div class="detail-main">' +
          contractCard('Subscription', summary) +
          contractCard('Billing schedule', schedule) +
          contractCard('Upcoming orders', upcoming) +
          contractCard('Past orders', history) +
          contractCard('Activity log', activity) +
        '</div><div class="detail-rail">' +
          contractCard('Manage', actions) +
          contractCard('Customer', customer) +
          contractCard('Payment', payment) +
        '</div></div></div>',
      'full'
    );
    root.querySelectorAll('[data-ca]').forEach((btn) => btn.onclick = () => handleContractAction(c, btn.getAttribute('data-ca')));
  }

  function handleContractAction(c, act) {
    if (act === 'retry') {
      c.status = 'active';
      toast('Payment retried — charge succeeded');
      renderContractDetail(c.id);
      return;
    }
    if (act === 'cancel') {
      window.UI.confirm({
        title: 'Cancel subscription',
        content: 'Cancel this subscription? It will stop future charges.',
        okText: 'Cancel subscription',
        danger: true,
        onOk: () => {
          c.status = 'cancelled';
          c.endedAt = '2026-09-05';
          c.next = '';
          toast('Subscription cancelled');
          renderContractDetail(c.id);
        },
      });
      return;
    }
    if (act === 'address') return openContractAddressModal(c);
    if (act === 'method') toast('Update payment method — opens the gateway hosted page in production');
  }

  const SA_GEO = [
    { name: 'United States', aliases: ['US', 'USA'], iso: 'US', dial: '+1', states: [
      { name: 'Oregon', aliases: ['OR'], cities: ['Portland', 'Eugene', 'Salem'] },
      { name: 'California', aliases: ['CA'], cities: ['San Francisco', 'San Diego', 'Los Angeles'] },
      { name: 'Washington', aliases: ['WA'], cities: ['Seattle', 'Tacoma', 'Bellevue'] },
      { name: 'Colorado', aliases: ['CO'], cities: ['Denver', 'Boulder', 'Colorado Springs'] },
      { name: 'Illinois', aliases: ['IL'], cities: ['Chicago', 'Naperville'] },
      { name: 'New York', aliases: ['NY'], cities: ['New York', 'Brooklyn', 'Buffalo'] },
      { name: 'Texas', aliases: ['TX'], cities: ['Houston', 'Austin', 'Dallas'] },
      { name: 'Florida', aliases: ['FL'], cities: ['Miami', 'Orlando', 'Tampa'] },
    ] },
    { name: 'Canada', aliases: ['CA'], iso: 'CA', dial: '+1', states: [
      { name: 'Ontario', aliases: ['ON'], cities: ['Toronto', 'Ottawa'] },
      { name: 'British Columbia', aliases: ['BC'], cities: ['Vancouver', 'Victoria'] },
    ] },
    { name: 'United Kingdom', aliases: ['UK', 'GB'], iso: 'GB', dial: '+44', states: [
      { name: 'England', aliases: ['ENG'], cities: ['London', 'Manchester'] },
      { name: 'Scotland', aliases: ['SCT'], cities: ['Edinburgh', 'Glasgow'] },
    ] },
    { name: 'Australia', aliases: ['AU'], iso: 'AU', dial: '+61', states: [
      { name: 'New South Wales', aliases: ['NSW'], cities: ['Sydney', 'Newcastle'] },
      { name: 'Victoria', aliases: ['VIC'], cities: ['Melbourne', 'Geelong'] },
    ] },
    { name: 'Germany', aliases: ['DE'], iso: 'DE', dial: '+49', states: [
      { name: 'Berlin', aliases: ['BE'], cities: ['Berlin'] },
      { name: 'Bavaria', aliases: ['BY'], cities: ['Munich'] },
    ] },
    { name: 'Singapore', aliases: ['SG'], iso: 'SG', dial: '+65', states: [
      { name: 'Singapore', aliases: ['SG'], cities: ['Singapore'] },
    ] },
  ];
  function saGeoMatch(list, raw, pick) {
    const q = String(raw || '').trim().toLowerCase();
    if (!q) return null;
    return (list || []).find((item) => {
      const name = pick(item);
      return name.toLowerCase() === q || (item.aliases || []).some((a) => String(a).toLowerCase() === q);
    }) || null;
  }
  function saGeoCountry(raw) { return saGeoMatch(SA_GEO, raw, (c) => c.name); }
  function saGeoState(country, raw) { return saGeoMatch((country && country.states) || [], raw, (s) => s.name); }
  function saGeoNames(list) { return (list || []).map((x) => (typeof x === 'string' ? x : x.name)); }
  function saParsePhone(raw, countryObj) {
    const text = String(raw || '').trim();
    const codes = SA_GEO.slice().sort((a, b) => b.dial.length - a.dial.length);
    for (let i = 0; i < codes.length; i++) {
      const c = codes[i];
      if (text === c.dial || text.startsWith(c.dial)) {
        const local = text.slice(c.dial.length).replace(/^[\s-]*/, '');
        return { country: (countryObj && countryObj.dial === c.dial) ? countryObj : c, local };
      }
    }
    return { country: countryObj || SA_GEO[0], local: text };
  }
  function saFormatPhone(dial, local) {
    const num = String(local || '').trim();
    if (!num) return '';
    return (String(dial || '').trim() || '+1') + ' ' + num;
  }
  function saDialCodes() {
    const seen = {};
    return SA_GEO.filter((c) => {
      if (seen[c.dial]) return false;
      seen[c.dial] = true;
      return true;
    }).map((c) => c.dial);
  }

  function openContractAddressModal(c) {
    const parts = String(c.address || '').split(',').map((x) => x.trim()).filter(Boolean);
    const street = parts[0] || '';
    const countryRaw = parts.length >= 4 ? parts[parts.length - 1] : '';
    const stateZip = parts.length >= 3 ? parts[parts.length - 2] : '';
    const szM = stateZip.match(/^(.*?)\s+(\S+)$/);
    const stateRaw = szM ? szM[1] : stateZip;
    const zip = szM ? szM[2] : '';
    const cityRaw = parts.length >= 4 ? parts[1] : '';
    const countryObj = saGeoCountry(countryRaw);
    const stateObj = saGeoState(countryObj, stateRaw);
    const country = countryObj ? countryObj.name : countryRaw;
    const state = stateObj ? stateObj.name : stateRaw;
    const cityList = stateObj ? stateObj.cities.slice() : [];
    const city = cityRaw && cityList.indexOf(cityRaw) < 0 ? cityRaw : (cityRaw || '');
    const parsedPhone = saParsePhone(c.phone, countryObj);
    const nm = String(c.customer || '').trim().split(/\s+/);
    const first = nm.length > 1 ? nm.slice(0, -1).join(' ') : (nm[0] || '');
    const last = nm.length > 1 ? nm[nm.length - 1] : '';
    const SA_REQ = [
      { id: 'sa-email', err: 'Enter an email.' },
      { id: 'sa-country', err: 'Select a country/region.' },
      { id: 'sa-first', err: 'Enter a first name.' },
      { id: 'sa-last', err: 'Enter a last name.' },
      { id: 'sa-addr', err: 'Enter an address.' },
      { id: 'sa-state', err: 'Select a state.' },
      { id: 'sa-city', err: 'Select a city.' },
      { id: 'sa-zip', err: 'Enter a ZIP code.' },
    ];
    const floatInp = (id, label, val) =>
      '<div class="sa-field">' +
        '<label class="sa-float' + (String(val || '').trim() ? ' has-value' : '') + '">' +
          '<span class="sa-float-label">' + esc(label) + '</span>' +
          '<input class="sa-input" id="' + id + '" placeholder=" " value="' + esc(val || '') + '" autocomplete="off" />' +
        '</label>' +
        '<div class="sa-ferr" id="' + id + '-err" hidden></div>' +
      '</div>';
    const floatSel = (id, label, val, options) => {
      const cur = String(val || '');
      const names = (options || []).slice();
      if (cur && names.indexOf(cur) < 0) names.unshift(cur);
      return '<div class="sa-field">' +
        '<label class="sa-float' + (cur ? ' has-value' : '') + '">' +
          '<span class="sa-float-label">' + esc(label) + '</span>' +
          '<select class="sa-input sa-select" id="' + id + '" data-ui-compact>' +
            '<option value="" hidden></option>' +
            names.map((n) => '<option value="' + esc(n) + '"' + (n === cur ? ' selected' : '') + '>' + esc(n) + '</option>').join('') +
          '</select>' +
        '</label>' +
        '<div class="sa-ferr" id="' + id + '-err" hidden></div>' +
      '</div>';
    };
    const phoneField = () => {
      const dial = ((parsedPhone.country && parsedPhone.country.dial) || '+1');
      const local = parsedPhone.local || '';
      const opts = saDialCodes().map((code) =>
        '<option value="' + esc(code) + '"' + (code === dial ? ' selected' : '') + '>' + esc(code) + '</option>'
      ).join('');
      return '<div class="sa-field">' +
        '<div class="sa-phone">' +
          '<label class="sa-dial">' +
            '<select class="sa-dial-sel" id="sa-dial" data-ui-compact aria-label="Country calling code">' + opts + '</select>' +
          '</label>' +
          '<label class="sa-float' + (local ? ' has-value' : '') + '">' +
            '<span class="sa-float-label">Phone</span>' +
            '<input class="sa-input" id="sa-phone" placeholder=" " value="' + esc(local) + '" autocomplete="tel" />' +
          '</label>' +
        '</div>' +
      '</div>';
    };
    const body =
      '<style>' +
        '.sa-field{margin-bottom:12px}' +
        '.sa-float{position:relative;display:block;min-width:0}' +
        '.sa-float-label{position:absolute;z-index:3;top:50%;left:12px;max-width:calc(100% - 24px);color:#8c8c8c;font-size:14px;line-height:1.25;transform:translateY(-50%);pointer-events:none;overflow:visible;white-space:nowrap;transition:top .12s ease,transform .12s ease,font-size .12s ease}' +
        '.sa-float:has(.sa-select) .sa-float-label{max-width:calc(100% - 44px)}' +
        '.sa-input{width:100%;height:50px;padding:18px 12px 6px;border:1px solid var(--ctl);border-radius:8px;font-size:14px;background:#fff;box-sizing:border-box}' +
        '.sa-input::placeholder{color:transparent}' +
        '.sa-input:focus{outline:none;border-color:var(--brand)}' +
        '.sa-select{-webkit-appearance:none;appearance:none;cursor:pointer;padding-right:32px;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238c8c8c\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}' +
        '.sa-float:focus-within .sa-float-label,.sa-float.has-value .sa-float-label{top:8px;font-size:11px;transform:none}' +
        '.sa-float.is-error .sa-input,.sa-float.is-error .sa-input:focus{border-color:var(--err)}' +
        '.sa-ferr{color:var(--err);font-size:12px;margin-top:6px;line-height:1.4}' +
        '.sa-phone{display:flex;align-items:stretch;border:1px solid var(--ctl);border-radius:8px;background:#fff;overflow:hidden}' +
        '.sa-phone:focus-within{border-color:var(--brand)}' +
        '.sa-dial{position:relative;flex:none;display:flex;align-items:center;border-right:1px solid var(--ctl)}' +
        '.sa-dial-sel{-webkit-appearance:none;appearance:none;height:50px;border:0;padding:0 26px 0 12px;min-width:68px;background-color:transparent;font-size:14px;color:var(--ink);cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238c8c8c\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center}' +
        '.sa-dial-sel:focus{outline:none}' +
        '.sa-phone .sa-float{flex:1;min-width:0}' +
        '.sa-phone .sa-input{border:0;border-radius:0;height:50px}' +
        '.sa-phone .sa-input:focus{border:0}' +
        '.sa-float .ui-select.sa-select,.sa-dial .ui-select.sa-dial-sel{background-image:none;z-index:auto}' +
        '.sa-float .ui-select:hover,.sa-dial .ui-select:hover{z-index:auto}' +
        '.sa-float .ui-select .ui-select-label{flex:1;min-width:0;align-self:flex-end;height:22px;transform:none}' +
        '.sa-float:focus-within .ui-select.sa-input{border-color:var(--brand)}' +
        '.sa-float.is-error .ui-select.sa-input,.sa-float.is-error .ui-select.sa-input:focus{border-color:var(--err)}' +
        '.sa-dial .ui-select.sa-dial-sel{background-image:none;border:0;height:50px;min-width:68px;padding:0 8px 0 12px;background-color:transparent}' +
        '.sa-dial .ui-select .ui-select-label{transform:none}' +
        '.sa-phone .ui-select.sa-input{border:0}' +
      '</style>' +
      '<div style="font-size:13px;font-weight:500;color:var(--ink);margin-bottom:8px">Contact</div>' +
      floatInp('sa-email', 'Email', c.email) +
      '<div style="font-size:13px;font-weight:500;color:var(--ink);margin:4px 0 8px">Delivery</div>' +
      floatSel('sa-country', 'Country/Region', country, saGeoNames(SA_GEO)) +
      '<div class="grid grid-cols-2 gap-3"><div>' + floatInp('sa-first', 'First name', first) + '</div><div>' + floatInp('sa-last', 'Last name', last) + '</div></div>' +
      floatInp('sa-addr', 'Address', street) +
      floatInp('sa-apt', 'Apartment, suite, etc. (optional)', '') +
      '<div class="grid grid-cols-3 gap-3"><div>' + floatSel('sa-state', 'State', state, saGeoNames((countryObj && countryObj.states) || [])) + '</div><div>' + floatSel('sa-city', 'City', city, cityList) + '</div><div>' + floatInp('sa-zip', 'ZIP code', zip) + '</div></div>' +
      phoneField();
    const backdrop = document.createElement('div'); backdrop.className = 'modal-backdrop';
    const m = document.createElement('div'); m.className = 'modal'; m.style.width = '760px'; m.style.maxWidth = 'calc(100vw - 32px)';
    m.innerHTML =
      '<div class="modal-head flex items-center justify-between"><span>Edit shipping address</span><span data-x style="cursor:pointer;font-size:18px;line-height:1;color:var(--muted)">&times;</span></div>' +
      '<div class="modal-body">' + body + '</div>' +
      '<div class="modal-foot"><button class="btn btn-default" data-cancel>Cancel</button><button class="btn btn-primary" data-ok>Save</button></div>';
    backdrop.appendChild(m); document.body.appendChild(backdrop);
    if (window.UI && window.UI.scan) window.UI.scan(m);
    const close = () => {
      if (window.UI && window.UI.closePop) window.UI.closePop();
      backdrop.remove();
    };
    const setFieldErr = (id, msg) => {
      const el = m.querySelector('#' + id);
      const wrap = el && el.closest('.sa-float');
      const err = m.querySelector('#' + id + '-err');
      if (wrap) wrap.classList.toggle('is-error', !!msg);
      if (err) { err.textContent = msg || ''; err.hidden = !msg; }
    };
    const syncFloat = (el) => {
      const wrap = el.closest('.sa-float');
      if (wrap) wrap.classList.toggle('has-value', String(el.value || '').length > 0);
    };
    const fillSelect = (sel, options, current) => {
      if (!sel) return;
      const cur = String(current || '');
      const names = (options || []).slice();
      if (cur && names.indexOf(cur) < 0) names.unshift(cur);
      sel.innerHTML = '<option value="" hidden></option>' + names.map((n) =>
        '<option value="' + esc(n) + '"' + (n === cur ? ' selected' : '') + '>' + esc(n) + '</option>'
      ).join('');
      syncFloat(sel);
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const countrySel = m.querySelector('#sa-country');
    const stateSel = m.querySelector('#sa-state');
    const citySel = m.querySelector('#sa-city');
    const dialSel = m.querySelector('#sa-dial');
    m.querySelectorAll('.sa-input').forEach((el) => {
      syncFloat(el);
      el.addEventListener('input', () => { syncFloat(el); setFieldErr(el.id, ''); });
      el.addEventListener('change', () => { syncFloat(el); setFieldErr(el.id, ''); });
    });
    if (countrySel) countrySel.addEventListener('change', () => {
      const next = saGeoCountry(countrySel.value);
      fillSelect(stateSel, saGeoNames((next && next.states) || []), '');
      fillSelect(citySel, [], '');
      if (dialSel && next) {
        dialSel.value = next.dial;
        dialSel.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setFieldErr('sa-state', '');
      setFieldErr('sa-city', '');
    });
    if (stateSel) stateSel.addEventListener('change', () => {
      const nextCountry = saGeoCountry(countrySel && countrySel.value);
      const nextState = saGeoState(nextCountry, stateSel.value);
      fillSelect(citySel, (nextState && nextState.cities) || [], '');
      setFieldErr('sa-city', '');
    });
    m.querySelector('[data-x]').onclick = close;
    m.querySelector('[data-cancel]').onclick = close;
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
    m.querySelector('[data-ok]').onclick = () => {
      let bad = false;
      SA_REQ.forEach((f) => {
        const empty = !m.querySelector('#' + f.id).value.trim();
        setFieldErr(f.id, empty ? f.err : '');
        if (empty) bad = true;
      });
      if (bad) return;
      const g = (fid) => m.querySelector('#' + fid).value.trim();
      c.email = g('sa-email');
      c.phone = saFormatPhone(dialSel && dialSel.value, g('sa-phone'));
      c.customer = (g('sa-first') + ' ' + g('sa-last')).trim();
      c.address = [g('sa-addr'), g('sa-apt'), g('sa-city'), (g('sa-state') + ' ' + g('sa-zip')).trim(), g('sa-country')].filter(Boolean).join(', ');
      close();
      toast('Address updated');
      renderContractDetail(c.id);
    };
  }

  function renderSubscriptionList() {
    let rows = merchantPlans().slice();
    if (SUB_LST.kwApplied) {
      const q = SUB_LST.kwApplied.toLowerCase();
      rows = rows.filter((p) => {
        if (SUB_LST.kwType === 'product' || SUB_LST.kwType === 'product_title') return (p.product || '').toLowerCase().indexOf(q) >= 0;
        if (SUB_LST.kwType === 'product_id') return matchShopifyProductId(p.productId, q);
        if (SUB_LST.kwType === 'id') return String(planKey(p)).toLowerCase().indexOf(q) >= 0;
        return (p.name || '').toLowerCase().indexOf(q) >= 0;
      });
    }
    if (SUB_LST.visibility === 'checkout') rows = rows.filter((p) => planSurface(p) === 'checkout');
    if (SUB_LST.visibility === 'shopify' || SUB_LST.visibility === 'pdp') rows = rows.filter((p) => planSurface(p) === 'pdp');
    if (SUB_LST.status === 'active') rows = rows.filter((p) => (p.status || 'active') === 'active');
    if (SUB_LST.status === 'draft') rows = rows.filter((p) => p.status === 'draft');
    sortByCreatedDesc(rows, (p) => subscriptionDisplayId(planKey(p)));
    const searchIco = svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', 16);
    const kwField = SUB_KW_FIELDS.find((o) => o.value === SUB_LST.kwType) || SUB_KW_FIELDS[0];
    const kwOpts = SUB_KW_FIELDS.map((o) => '<option value="' + o.value + '"' + (SUB_LST.kwType === o.value ? ' selected' : '') + '>' + o.label + '</option>').join('');
    const tags = [];
    if (SUB_LST.kwApplied) tags.push('<span class="field-pill" data-clear="kw">' + esc(kwField.label) + ': ' + esc(SUB_LST.kwApplied) + ' <span class="x">&times;</span></span>');
    if (SUB_LST.visibility) tags.push('<span class="field-pill" data-clear="visibility">Shown on: ' + esc(SUB_LST.visibility === 'checkout' ? 'Checkout' : 'Product page + Checkout') + ' <span class="x">&times;</span></span>');
    if (SUB_LST.status) tags.push('<span class="field-pill" data-clear="status">Status: ' + (SUB_LST.status === 'active' ? 'Activated' : 'Deactivated') + ' <span class="x">&times;</span></span>');
    const total = rows.length;
    const pages = Math.max(1, Math.ceil(total / SUB_LST.size));
    if (SUB_LST.page > pages) SUB_LST.page = pages;
    const pageRows = rows.slice((SUB_LST.page - 1) * SUB_LST.size, SUB_LST.page * SUB_LST.size);
    const pagerItem = (label, p, opts) => {
      opts = opts || {};
      return '<span class="pg-item' + (opts.active ? ' active' : '') + (opts.disabled ? ' disabled' : '') + '"' + (opts.disabled ? '' : ' data-sub-page="' + p + '"') + '>' + label + '</span>';
    };
    let pagerNums = '';
    for (let p = 1; p <= pages; p++) pagerNums += pagerItem(String(p), p, { active: p === SUB_LST.page });
    const pager = '<div class="pg">' + pagerItem('‹', SUB_LST.page - 1, { disabled: SUB_LST.page <= 1 }) + pagerNums + pagerItem('›', SUB_LST.page + 1, { disabled: SUB_LST.page >= pages }) +
      '<select class="pg-size" id="sub-pgsize">' + ['20', '50', '100'].map((s) => '<option value="' + s + '"' + (Number(s) === SUB_LST.size ? ' selected' : '') + '>' + s + ' / page</option>').join('') + '</select></div>';
    const tableRows = pageRows.map((p) => {
      const statusCell = (p.status || 'active') === 'active'
        ? '<span class="pill pill-green">Activated</span>'
        : '<span class="pill pill-gray">Deactivated</span>';
      const bun = activeBundleFor(p.product, p.productId);
      const prodCell = bun
        ? subProductThumb(p.product, 36) +
          '<div style="min-width:0"><div class="sub-clip" data-tip="' + esc(bun.name) + '">' + esc(bun.name) + '</div>' +
          '<div class="sub-bun"><span class="pill pill-blue sub-src-tag">Sold as a bundle</span></div></div>'
        : subProductThumb(p.product, 36) +
          '<div style="min-width:0"><div class="sub-clip" data-tip="' + esc(p.product) + '">' + esc(p.product) + '</div></div>';
      return '<tr data-plan="' + esc(planKey(p)) + '" style="cursor:pointer">' +
        '<td><div class="sub-clip" style="font-weight:600;color:var(--ink)" data-tip="' + esc(p.name || '') + '">' + esc(p.name) + '</div><div class="muted sub-clip" style="font-size:12px">' + esc(planKey(p)) + '</div></td>' +
        '<td class="sub-prod"><div class="flex items-center gap-2" style="min-width:0">' + prodCell + '</div></td>' +
        '<td class="sub-offer" data-tip="' + esc(intervalDiscountTitle(p)).replace(/\n/g, '&#10;') + '">' + intervalDiscountCell(p) + '</td>' +
        '<td class="sub-vis">' + visibilityPills(p) + '</td>' +
        '<td>' + statusCell + '</td>' +
        '<td style="text-align:center;white-space:nowrap" data-stop><button class="bn-act" data-view="' + esc(planKey(p)) + '" title="View" aria-label="View">' + I.eye + '</button></td>' +
      '</tr>';
    }).join('');
    paint(
      '<style>' + SUB_STYLES + '</style>' +
      '<div class="flex items-center justify-between mb-4" style="gap:12px"><div><h1 class="page-title">Subscriptions</h1>' +
        '<div class="muted" style="font-size:13px;margin-top:3px;line-height:1.5;max-width:920px">Create subscriptions here. Plans from Shopify, Appstle, Skio, or Kaching are not imported — recreate them if you still need them. With an active Bundle, shoppers pick One-time or Subscribe & Save on the product page. Without a Bundle, BestCheckout does not take over the product page; checkout follows the shopper\'s subscribe checkbox only when this plan is active.</div></div>' +
        '<div class="flex items-center gap-2"><a class="btn btn-primary" href="#/subscriptions/new">Add subscription</a></div></div>' +
      '<div class="panel">' +
        '<div class="card-pad" style="padding-bottom:8px"><div class="filter-bar">' +
          '<div class="flex items-center" style="min-width:400px">' +
            '<select class="filter-select" id="sub-kwtype" data-ui-fit data-ui-match-width style="border-top-right-radius:0;border-bottom-right-radius:0">' + kwOpts + '</select>' +
            '<div style="position:relative;flex:1">' +
              '<input class="filter-input" id="sub-kw" placeholder="' + esc(kwField.placeholder) + '" value="' + esc(SUB_LST.kw) + '" style="width:100%;padding-left:12px;padding-right:32px;border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px" />' +
              '<span class="filter-ico">' + searchIco + '</span>' +
            '</div></div>' +
          '<select class="filter-select" id="sub-vis" style="width:230px"><option value="">All visibility</option><option value="pdp"' + (SUB_LST.visibility === 'pdp' || SUB_LST.visibility === 'shopify' ? ' selected' : '') + '>Product page + Checkout</option><option value="checkout"' + (SUB_LST.visibility === 'checkout' ? ' selected' : '') + '>Checkout</option></select>' +
          '<select class="filter-select" id="sub-status" style="width:150px"><option value="">All status</option><option value="active"' + (SUB_LST.status === 'active' ? ' selected' : '') + '>Activated</option><option value="draft"' + (SUB_LST.status === 'draft' ? ' selected' : '') + '>Deactivated</option></select>' +
        '</div>' + (tags.length ? '<div class="flex items-center gap-2 mt-3" style="flex-wrap:wrap" id="sub-tags">' + tags.join('') + '</div>' : '') + '</div>' +
        '<div style="overflow-x:auto"><table class="tbl sub-tbl"><colgroup>' +
          '<col style="width:22%"><col style="width:24%"><col style="width:26%"><col style="width:11%"><col style="width:11%"><col style="width:6%">' +
        '</colgroup><thead><tr>' +
          '<th>Subscription</th><th>Product</th><th>Billing</th><th>Shown on</th><th>Status</th><th style="text-align:center">Action</th>' +
        '</tr></thead><tbody id="bc-sub-tbody">' +
          (tableRows || '<tr><td colspan="6" style="text-align:center;padding:40px" class="muted">No subscriptions yet. Add a subscription to offer Subscribe & Save.</td></tr>') +
        '</tbody></table></div>' +
        '<div class="flex items-center justify-between card-pad"><span class="muted" style="font-size:13px">Total ' + total + ' records</span>' + pager + '</div>' +
      '</div>',
      'full'
    );
    const applyFilters = () => {
      SUB_LST.kw = (root.querySelector('#sub-kw') || {}).value || '';
      SUB_LST.kwApplied = SUB_LST.kw.trim();
      SUB_LST.kwType = (root.querySelector('#sub-kwtype') || {}).value || SUB_LST.kwType;
      SUB_LST.visibility = (root.querySelector('#sub-vis') || {}).value || '';
      SUB_LST.status = (root.querySelector('#sub-status') || {}).value || '';
      SUB_LST.page = 1;
      renderSubscriptionList();
    };
    const kwType = root.querySelector('#sub-kwtype');
    const kw = root.querySelector('#sub-kw');
    if (kwType) kwType.onchange = () => {
      SUB_LST.kwType = kwType.value;
      syncFilterPlaceholder(kw, SUB_KW_FIELDS, SUB_LST.kwType);
      if (SUB_LST.kwApplied) { SUB_LST.page = 1; renderSubscriptionList(); }
    };
    if (kw) {
      kw.oninput = () => { SUB_LST.kw = kw.value; };
      const commit = () => { SUB_LST.kw = kw.value; SUB_LST.kwApplied = SUB_LST.kw.trim(); SUB_LST.page = 1; renderSubscriptionList(); };
      kw.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } };
      kw.onblur = commit;
    }
    ['sub-vis', 'sub-status'].forEach((id) => {
      const el = root.querySelector('#' + id);
      if (el) el.onchange = applyFilters;
    });
    root.querySelectorAll('#sub-tags [data-clear]').forEach((tg) => tg.onclick = () => {
      const k = tg.getAttribute('data-clear');
      if (k === 'kw') { SUB_LST.kw = ''; SUB_LST.kwApplied = ''; }
      if (k === 'visibility') SUB_LST.visibility = '';
      if (k === 'status') SUB_LST.status = '';
      SUB_LST.page = 1;
      renderSubscriptionList();
    });
    const pgSize = root.querySelector('#sub-pgsize');
    if (pgSize) pgSize.onchange = () => { SUB_LST.size = Number(pgSize.value) || 20; SUB_LST.page = 1; renderSubscriptionList(); };
    root.querySelectorAll('[data-sub-page]').forEach((el) => el.onclick = () => { SUB_LST.page = Number(el.getAttribute('data-sub-page')); renderSubscriptionList(); });
    root.querySelectorAll('#bc-sub-tbody tr[data-plan]').forEach((tr) => tr.onclick = (e) => {
      if (e.target.closest('[data-stop]')) return;
      location.hash = '#/subscriptions/edit/' + encodeURIComponent(tr.getAttribute('data-plan'));
    });
    root.querySelectorAll('[data-view]').forEach((btn) => btn.onclick = (e) => {
      e.stopPropagation();
      location.hash = '#/subscriptions/edit/' + encodeURIComponent(btn.getAttribute('data-view'));
    });
  }

  const SUB_PREFILL_KEY = 'bcSubFromBundle';
  function consumeBundleSubPrefill() {
    try {
      const raw = sessionStorage.getItem(SUB_PREFILL_KEY);
      if (!raw) return null;
      sessionStorage.removeItem(SUB_PREFILL_KEY);
      const o = JSON.parse(raw);
      return o && String(o.product || '').trim() ? o : null;
    } catch (e) { return null; }
  }
  function blankSubscription() {
    return {
      origin: 'bestcheckout',
      visibility: 'checkout',
      status: 'draft',
      name: '',
      product: '',
      productSku: '',
      productId: '',
      image: '',
      catalogPrice: '',
      itemType: '',
      bundleId: '',
      tierIndex: 0,
      minCycles: 0,
      widgetStyle: 'radio',
      forceSubscription: false,
      showDeliveryDetails: true,
      interval: { every: 1, unit: 'month' },
      discount: { type: 'percent', value: 10 },
      sourceApp: 'BestCheckout',
      mapping: 'local',
    };
  }
  function normalizeSubscriptionEdit(p) {
    if (!p.interval) p.interval = { every: 1, unit: 'month' };
    if (!p.discount) p.discount = { type: 'percent', value: 10 };
    if (p.minCycles == null || p.minCycles === '') p.minCycles = 0;
    if (!p.widgetStyle) p.widgetStyle = 'radio';
    p.forceSubscription = !!p.forceSubscription;
    p.showDeliveryDetails = p.showDeliveryDetails !== false;
    if (!p.itemType) {
      const bun = activeBundleFor(p.product, p.productId);
      p.itemType = bun ? 'bundle' : (p.product ? 'product' : '');
      if (bun) {
        p.bundleId = bun.id;
        if (p.tierIndex == null) p.tierIndex = bun.defaultTier != null ? bun.defaultTier : 0;
      }
    }
    return p;
  }

  function collectSubscriptionForm() {
    if (!SUB_EDIT || !isLocalPlan(SUB_EDIT)) return;
    const name = root.querySelector('#pl-name') || root.querySelector('#sub-name');
    if (name) SUB_EDIT.name = name.value || '';
    const every = root.querySelector('#pl-every') || root.querySelector('#sub-every');
    if (every) SUB_EDIT.interval.every = Number(every.value || 0);
    const unit = root.querySelector('#pl-unit') || root.querySelector('#sub-unit');
    if (unit) SUB_EDIT.interval.unit = unit.value || 'month';
    const dval = root.querySelector('#pl-discval') || root.querySelector('#sub-dval');
    if (dval) SUB_EDIT.discount.value = dval.value;
    const min = root.querySelector('#pl-min');
    if (min) SUB_EDIT.minCycles = Number(min.value || 0);
    const status = root.querySelector('.pl-statusr:checked');
    if (status) SUB_EDIT.status = status.value;
    else if (root.querySelector('#sub-status-sw')) {
      SUB_EDIT.status = root.querySelector('#sub-status-sw').classList.contains('on') ? 'active' : 'draft';
    }
  }
  function subscriptionSnapshot() {
    return JSON.stringify({
      name: String((SUB_EDIT && SUB_EDIT.name) || ''),
      product: String((SUB_EDIT && SUB_EDIT.product) || ''),
      productSku: String((SUB_EDIT && SUB_EDIT.productSku) || ''),
      productId: String((SUB_EDIT && SUB_EDIT.productId) || ''),
      image: String((SUB_EDIT && SUB_EDIT.image) || ''),
      catalogPrice: SUB_EDIT && SUB_EDIT.catalogPrice,
      status: (SUB_EDIT && SUB_EDIT.status) === 'draft' ? 'draft' : 'active',
      every: Number(SUB_EDIT && SUB_EDIT.interval && SUB_EDIT.interval.every) || 0,
      unit: (SUB_EDIT && SUB_EDIT.interval && SUB_EDIT.interval.unit) || 'month',
      dtype: (SUB_EDIT && SUB_EDIT.discount && SUB_EDIT.discount.type) || 'percent',
      dval: String((SUB_EDIT && SUB_EDIT.discount && SUB_EDIT.discount.value) ?? ''),
      minCycles: Number((SUB_EDIT && SUB_EDIT.minCycles) || 0),
      widgetStyle: (SUB_EDIT && SUB_EDIT.widgetStyle) || 'radio',
      forceSubscription: !!(SUB_EDIT && SUB_EDIT.forceSubscription),
      showDeliveryDetails: !SUB_EDIT || SUB_EDIT.showDeliveryDetails !== false,
      itemType: (SUB_EDIT && SUB_EDIT.itemType) || '',
      bundleId: (SUB_EDIT && SUB_EDIT.bundleId) || '',
      tierIndex: Number((SUB_EDIT && SUB_EDIT.tierIndex) || 0),
    });
  }
  function isSubscriptionDirty() {
    return !!(SUB_EDIT && SUB_EDIT_ORIGIN != null && subscriptionSnapshot() !== SUB_EDIT_ORIGIN);
  }
  function syncSubscriptionUnsaved() {
    if (window.UI && window.UI.setUnsavedBar) window.UI.setUnsavedBar(root, isSubscriptionDirty());
  }
  function resetSubscriptionEditor() {
    SUB_EDIT = null;
    SUB_EDIT_KEY = null;
    SUB_EDIT_ORIGIN = null;
    SUB_EDIT_BACKUP = null;
    SUB_ERRORS = {};
  }

  function scrollToFirstSubscriptionError() {
    requestAnimationFrame(() => {
      const el = root && root.querySelector('.has-error, .sub-err');
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const focusable = (el.matches && el.matches('input,select,textarea,button')) ? el : el.querySelector('input,select,textarea,button');
      if (focusable && focusable.focus) focusable.focus({ preventScroll: true });
    });
  }

  function validateSubscription() {
    SUB_ERRORS = {};
    const name = String(SUB_EDIT.name || '').trim();
    if (!name) SUB_ERRORS.name = 'Please enter a subscription name.';
    else if (name.length > 255) SUB_ERRORS.name = 'Please enter a subscription name.';
    if (!String(SUB_EDIT.product || '').trim()) SUB_ERRORS.product = 'Select a Shopify product.';
    const every = Number(SUB_EDIT.interval && SUB_EDIT.interval.every);
    if (!every || every < 1 || every !== Math.floor(every)) SUB_ERRORS.every = 'Interval must be at least 1.';
    const unit = SUB_EDIT.interval && SUB_EDIT.interval.unit;
    if (['week', 'month', 'year'].indexOf(unit) < 0) SUB_ERRORS.unit = 'Select week, month, or year.';
    const dtype = SUB_EDIT.discount && SUB_EDIT.discount.type;
    if (dtype !== 'percent' && dtype !== 'fixed') SUB_ERRORS.dtype = 'Select a discount type.';
    const dval = Number(SUB_EDIT.discount && SUB_EDIT.discount.value);
    if (dval < 0 || (SUB_EDIT.discount && SUB_EDIT.discount.value === '')) SUB_ERRORS.dval = 'Enter a discount of 0 or more.';
    else if (dtype === 'percent' && dval > 100) SUB_ERRORS.dval = 'Percentage discount cannot exceed 100.';
    return !Object.keys(SUB_ERRORS).length;
  }

  function renderSubscriptionEditor(plan) {
    const isNew = !plan;
    const readonly = !!(plan && !isLocalPlan(plan));
    const seed = !plan ? consumeBundleSubPrefill() : null;
    if (!SUB_EDIT || SUB_EDIT_KEY !== (plan ? planKey(plan) : 'new') || seed) {
      const base = plan ? JSON.parse(JSON.stringify(plan)) : blankSubscription();
      if (seed) {
        base.product = String(seed.product || '').trim();
        base.productId = seed.productId ? String(seed.productId) : '';
        base.image = seed.image || '';
        base.itemType = 'bundle';
        base.bundleId = seed.bundleId || '';
        if (seed.tierIndex != null && seed.tierIndex !== '') base.tierIndex = Number(seed.tierIndex) || 0;
      }
      SUB_EDIT = normalizeSubscriptionEdit(base);
      if (seed) applySelectedTier(SUB_EDIT, seed.tierIndex != null && seed.tierIndex !== '' ? Number(seed.tierIndex) || 0 : (SUB_EDIT.tierIndex || 0));
      SUB_EDIT_KEY = plan ? planKey(plan) : 'new';
      SUB_ERRORS = {};
      SUB_PREVIEW_MODE = 'sub';
      SUB_EDIT_BACKUP = JSON.parse(JSON.stringify(SUB_EDIT));
      SUB_EDIT_ORIGIN = subscriptionSnapshot();
    } else {
      normalizeSubscriptionEdit(SUB_EDIT);
    }
    const p = SUB_EDIT;
    const title = isNew ? 'Add subscription' : (p.name || 'Subscription');
    const saveText = isNew ? 'Add subscription' : 'Save';
    const bun = activeBundleFor(p.product, p.productId);
    const isBun = !!(bun || p.itemType === 'bundle');
    const tiers = bundleTiersForEdit(p);
    const errCls = (on) => on ? ' has-error' : '';
    const label = (t, req) => '<div class="ctrl-label" style="text-transform:none;margin-bottom:6px">' + t + (req ? ' <span style="color:var(--err)">*</span>' : '') + '</div>';
    const card = (titleText, inner) => '<div class="panel card-pad mb-4"><div class="flex items-center justify-between mb-3"><div class="card-title">' + titleText + '</div></div>' + inner + '</div>';
    const unitOpt = ['week', 'month', 'year'].map((u) => {
      const every = Number(p.interval && p.interval.every) || 1;
      return '<option value="' + u + '"' + ((p.interval && p.interval.unit) === u ? ' selected' : '') + '>' + u + (every === 1 ? '' : 's') + '</option>';
    }).join('');
    const itemRow = (p.product)
      ? '<div style="display:flex;align-items:center;gap:12px;border:1px solid var(--hair);border-radius:8px;padding:12px">' +
          '<span class="sub-ck-img" style="width:40px;height:40px">' + (p.product ? '<img src="' + esc(imgAt(subProductImage(p.product, p.image), 160)) + '" alt="" />' : '') + '</span>' +
          '<div style="flex:1;min-width:0"><div style="font-size:13.5px;color:var(--ink);font-weight:500">' + esc(isBun ? ((bun && bun.name) || p.product) : p.product) + '</div>' +
            (isBun
              ? '<div style="font-size:12px;margin-top:3px"><span class="pill pill-blue" style="font-size:10px">Sold as a bundle</span></div>'
              : '') + '</div>' +
          (readonly ? '' : '<button class="btn btn-default" data-act="clear-item">Clear selected product</button>') +
        '</div>'
      : '<div class="pick-box' + errCls(SUB_ERRORS.product) + '" style="display:flex;align-items:center;gap:10px;border:1px dashed var(--ctl);border-radius:8px;padding:14px">' +
          '<span class="muted" style="flex:1;min-width:0;font-size:13.5px">No product selected</span>' +
          (readonly ? '' : '<button class="btn btn-default" data-act="pick-product">Add product</button>') +
        '</div>';
    const tierSel = (isBun && tiers.length > 1)
      ? '<div style="margin-top:12px">' + label('Subscribed tier') +
          '<div style="display:flex;flex-direction:column;gap:8px" id="pl-tiers">' +
          tiers.map((t, i) => {
            const on = resolvedTierIndex(p, 0) === i;
            return '<label data-ptier="' + i + '" style="display:flex;align-items:center;gap:10px;border:1.5px solid ' + (on ? 'var(--brand)' : 'var(--hair)') + ';border-radius:8px;padding:9px 11px;cursor:pointer">' +
              '<input type="radio" name="pl-tier"' + (on ? ' checked' : '') + ' style="accent-color:var(--brand);width:15px;height:15px;pointer-events:none;flex:none" />' +
              '<span style="flex:1;font-size:13px;font-weight:500">' + (esc(t.title) || (t.qty + ' PCS')) + (t.tag ? ' <span class="pill pill-blue" style="font-size:10px">' + esc(t.tag) + '</span>' : '') + '</span>' +
              '<span style="font-weight:700;font-size:13px">' + subMoney(t.price) + (t.compareAt ? ' <s class="muted" style="font-weight:400;font-size:11px">' + subMoney(t.compareAt) + '</s>' : '') + '</span></label>';
          }).join('') + '</div></div>'
      : '';
    const dtype = (p.discount && p.discount.type) || 'percent';
    const styleNames = { radio: 'Radio list', buttons: 'Buttons', bordered: 'Bordered', pills: 'Pills', autoship: 'Subscribe CTA' };
    const styleThumb = (key) => {
      const on = (p.widgetStyle || 'radio') === key;
      return '<div data-pstyle="' + key + '" style="cursor:pointer;border:1.5px solid ' + (on ? 'var(--brand)' : 'var(--ctl)') + ';border-radius:8px;padding:16px 14px 14px;position:relative;background:#fff">' +
        (on ? '<span style="position:absolute;top:8px;right:10px;color:var(--brand);font-size:12px">●</span>' : '') +
        '<div style="height:48px;display:flex;align-items:center;justify-content:center">' + styleGlyph(key) + '</div>' +
        '<div style="font-size:12.5px;color:var(--ink);margin-top:10px;text-align:center;font-weight:500">' + styleNames[key] + '</div></div>';
    };
    const statusRadios = ['active', 'draft'].map((s) => '<label class="flex items-center gap-2" style="cursor:pointer;font-size:13.5px;color:var(--ink)"><input type="radio" name="pl-status" class="pl-statusr" value="' + s + '"' + ((p.status || 'active') === s ? ' checked' : '') + (readonly ? ' disabled' : '') + ' style="width:16px;height:16px;accent-color:var(--brand);cursor:pointer" /> ' + (s === 'active' ? 'Activated' : 'Deactivated') + '</label>').join('');
    paint(
      '<style>' + SUB_STYLES + '</style>' +
      (!readonly && window.UI && window.UI.unsavedBar ? window.UI.unsavedBar({ show: false, saveLabel: isNew ? 'Add' : 'Save' }) : '') +
      '<div class="detail-wrap">' +
        '<div class="flex items-center justify-between mb-6"><div class="flex items-center gap-2">' +
          '<a class="back-btn" href="#/subscriptions" title="Back">' + I.chevL + '</a>' +
          '<span class="page-title">' + title + '</span>' + (isNew ? '' : ' <span class="pill ' + ((p.status || 'active') === 'draft' ? 'pill-gray' : 'pill-green') + '">' + ((p.status || 'active') === 'draft' ? 'Deactivated' : 'Activated') + '</span>') +
        '</div>' + (isNew ? '' : '<span class="muted" style="font-size:13px">Subscription ID：' + esc(planKey(p) || SUB_EDIT_KEY) + '</span>') + '</div>' +
        '<div class="detail-cols" style="max-width:1220px"><div class="detail-main">' +
          card('Plan name',
            '<input class="input' + errCls(SUB_ERRORS.name) + '" id="pl-name" value="' + esc(p.name || '') + '" placeholder="e.g. Coffee Club — Monthly" maxlength="255"' + (readonly ? ' disabled' : '') + ' />' + subFieldErr(SUB_ERRORS.name)) +
          card('Product',
            itemRow + tierSel + subFieldErr(SUB_ERRORS.product) +
            (showsForceSubscription(p)
              ? '<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--hair)">' +
                  '<div class="flex items-center justify-between" style="gap:12px">' +
                    '<div style="font-size:13.5px;font-weight:600;color:var(--ink)">Force subscription</div>' +
                    '<span class="bn-sw' + (p.forceSubscription ? ' on' : '') + (readonly ? ' is-disabled' : '') + '" data-act="force-sub" role="switch" aria-checked="' + (p.forceSubscription ? 'true' : 'false') + '"' + (readonly ? ' aria-disabled="true"' : '') + '></span>' +
                  '</div>' +
                  '<div class="muted" style="font-size:12px;margin-top:8px;line-height:1.5">When on, checkout uses this plan even if the shopper did not check Subscribe on the product page.</div>' +
                  '<div class="flex items-center justify-between" style="gap:12px;margin-top:16px">' +
                    '<div style="font-size:13.5px;font-weight:600;color:var(--ink)">Show delivery details</div>' +
                    '<span class="bn-sw' + (showsDeliveryDetails(p) ? ' on' : '') + (readonly ? ' is-disabled' : '') + '" data-act="show-deal" role="switch" aria-checked="' + (showsDeliveryDetails(p) ? 'true' : 'false') + '"' + (readonly ? ' aria-disabled="true"' : '') + '></span>' +
                  '</div>' +
                  '<div class="muted" style="font-size:12px;margin-top:8px;line-height:1.5">When on, checkout shows the delivery interval and savings under the product.</div>' +
                '</div>'
              : '<div class="muted" style="font-size:12px;margin-top:8px">Subscribe &amp; Save offers one product or bundle on a recurring schedule. Customers pick one-time or subscribe on its product page.</div>')) +
          card('Billing',
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
              '<div>' + label('Bill every') + '<div style="display:flex;gap:8px">' + subNumInput('pl-every', (p.interval && p.interval.every) || 1, { min: 1, w: '92px', placeholder: 'e.g. 1' }) + '<select class="input" id="pl-unit" style="flex:1"' + (readonly ? ' disabled' : '') + '>' + unitOpt + '</select></div>' + subFieldErr(SUB_ERRORS.every) + '</div>' +
              '<div>' + label('One-time price') + '<div class="input" id="pl-onetime" style="display:flex;align-items:center;background:var(--panel);color:var(--ink)">' + (oneTimePriceOf(p) != null ? subMoney(oneTimePriceOf(p)) : '<span class="muted">—</span>') + '</div><div class="muted" style="font-size:11px;margin-top:5px">' + (isBun ? 'From the selected bundle tier' : 'From the product') + '</div></div>' +
              '<div>' + label('Subscription discount') +
                '<div style="display:flex;gap:8px;align-items:stretch">' +
                  '<div style="display:inline-flex;border:1px solid var(--ctl);border-radius:8px;overflow:hidden;flex:none">' +
                    '<button type="button" class="pl-dtbtn" data-dt="percent" style="height:36px;padding:0 11px;font-size:12.5px;border:none;cursor:pointer;' + (dtype !== 'fixed' ? 'background:var(--brand);color:#fff' : 'background:#fff;color:var(--ink)') + '">Percentage off</button>' +
                    '<button type="button" class="pl-dtbtn" data-dt="fixed" style="height:36px;padding:0 11px;font-size:12.5px;border:none;border-left:1px solid var(--ctl);cursor:pointer;' + (dtype === 'fixed' ? 'background:var(--brand);color:#fff' : 'background:#fff;color:var(--ink)') + '">Fixed amount</button>' +
                  '</div>' +
                  '<div style="display:inline-flex;align-items:stretch;border:1px solid var(--ctl);border-radius:8px;overflow:hidden;height:36px;flex:1;min-width:0">' +
                    (dtype === 'fixed' ? '<span style="display:grid;place-items:center;padding:0 9px;background:var(--panel);border-right:1px solid var(--ctl)">$</span>' : '') +
                    '<input id="pl-discval" type="number" min="0" step="' + (dtype === 'fixed' ? '0.01' : '1') + '" value="' + esc((p.discount && p.discount.value) || 0) + '" placeholder="e.g. 10" style="flex:1;border:none;outline:none;padding:0 10px;font-size:13px;min-width:0"' + (readonly ? ' disabled' : '') + ' />' +
                    (dtype !== 'fixed' ? '<span style="display:grid;place-items:center;padding:0 9px;background:var(--panel);border-left:1px solid var(--ctl)">%</span>' : '') +
                  '</div>' +
                '</div>' + subFieldErr(SUB_ERRORS.dval) + '</div>' +
              '<div>' + label('Recurring price') + '<div class="input" id="pl-recurring" style="display:flex;align-items:center;background:var(--panel);font-weight:600">' + recurringDisplay(p) + '</div></div>' +
            '</div>') +
          card('Commitment',
            label('Minimum cycles') + subNumInput('pl-min', p.minCycles || 0, { min: 0, w: '220px', placeholder: 'e.g. 0' }) +
            '<div class="muted" style="font-size:11.5px;margin-top:6px">Customers can\'t cancel before this many charges. 0 = cancel anytime.</div>') +
          (isBun ? card('Storefront style',
            '<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px" id="pl-styles">' + ['radio', 'buttons', 'bordered', 'pills', 'autoship'].map(styleThumb).join('') + '</div>' +
            '<div class="muted" style="font-size:12px;margin-top:12px">How the Subscribe &amp; Save options look on this product\'s page.</div>') : '') +
          '<div class="flex items-center mt-1">' +
            (!readonly && !isNew ? '<button class="btn btn-default" data-act="delete" style="color:var(--err);border-color:#f3c4ba">Delete subscription</button>' : '<span></span>') +
            (readonly ? '' : '<button class="btn btn-primary" data-act="save" style="margin-left:auto">' + saveText + '</button>') +
          '</div>' +
        '</div><div class="detail-rail" style="width:400px;flex:0 0 400px">' +
          card('Status', '<div style="display:flex;flex-direction:column;gap:11px;padding:2px 0">' + statusRadios +
            '<div class="muted" style="font-size:12px;line-height:1.45;padding-top:2px">One product can have only one active subscription plan on the storefront. Draft/deactivated plans can be kept.</div></div>') +
          card('Preview', '<div id="pl-preview">' + planPreviewHtml(p) + '</div>') +
        '</div></div>' +
      '</div>',
      'full'
    );
    const refreshPreview = () => {
      collectSubscriptionForm();
      const rec = root.querySelector('#pl-recurring');
      if (rec) rec.innerHTML = recurringDisplay(SUB_EDIT);
      const ot = root.querySelector('#pl-onetime');
      if (ot) ot.innerHTML = oneTimePriceOf(SUB_EDIT) != null ? subMoney(oneTimePriceOf(SUB_EDIT)) : '<span class="muted">—</span>';
      const box = root.querySelector('#pl-preview');
      if (box) { box.innerHTML = planPreviewHtml(SUB_EDIT); wirePreviewInner(); }
      if (window.I18N && window.I18N.apply) window.I18N.apply(root);
      syncSubscriptionUnsaved();
    };
    function wirePreviewInner() {
      root.querySelectorAll('#pl-preview [data-buymode]').forEach((el) => {
        el.onclick = () => { SUB_PREVIEW_MODE = el.getAttribute('data-buymode'); refreshPreview(); };
      });
      root.querySelectorAll('#pl-preview [data-ptier]').forEach((el) => {
        el.onclick = () => { applySelectedTier(SUB_EDIT, Number(el.getAttribute('data-ptier'))); renderSubscriptionEditor(plan); };
      });
    }
    wirePreviewInner();
    if (!readonly) {
      const nameEl = root.querySelector('#pl-name');
      if (nameEl) nameEl.oninput = () => { SUB_EDIT.name = nameEl.value; if (nameEl.value.trim()) clearSubMarkedError('name', nameEl); syncSubscriptionUnsaved(); };
      const everyEl = root.querySelector('#pl-every');
      if (everyEl) everyEl.oninput = () => { SUB_EDIT.interval.every = Number(everyEl.value || 0); if (Number(everyEl.value) >= 1) clearSubMarkedError('every', everyEl); refreshPreview(); };
      const unitEl = root.querySelector('#pl-unit');
      if (unitEl) unitEl.onchange = () => { SUB_EDIT.interval.unit = unitEl.value; refreshPreview(); };
      const dvalEl = root.querySelector('#pl-discval');
      if (dvalEl) dvalEl.oninput = () => {
        let d = dvalEl.value === '' ? 0 : Number(dvalEl.value);
        if (d < 0) d = 0;
        if (SUB_EDIT.discount.type !== 'fixed' && d > 100) d = 100;
        SUB_EDIT.discount.value = d;
        if (d >= 0) clearSubMarkedError('dval', dvalEl);
        refreshPreview();
      };
      const minEl = root.querySelector('#pl-min');
      if (minEl) minEl.oninput = () => { SUB_EDIT.minCycles = Number(minEl.value || 0); syncSubscriptionUnsaved(); };
      root.querySelectorAll('.pl-statusr').forEach((r) => r.onchange = () => { SUB_EDIT.status = r.value; syncSubscriptionUnsaved(); });
      root.querySelectorAll('.pl-dtbtn').forEach((b) => b.onclick = () => {
        collectSubscriptionForm();
        SUB_EDIT.discount.type = b.getAttribute('data-dt');
        renderSubscriptionEditor(plan);
      });
      root.querySelectorAll('.bn-nup, .bn-ndn').forEach((b) => b.onclick = () => {
        const inp = b.closest('.bn-num').querySelector('input');
        const step = Number(inp.step) || 1;
        const mn = inp.getAttribute('min');
        let v = (Number(inp.value) || 0) + (b.classList.contains('bn-nup') ? step : -step);
        if (mn !== null) v = Math.max(Number(mn), v);
        inp.value = (String(step).indexOf('.') >= 0) ? v.toFixed(2) : v;
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      });
      root.querySelectorAll('#pl-styles [data-pstyle]').forEach((c) => c.onclick = () => {
        SUB_EDIT.widgetStyle = c.getAttribute('data-pstyle');
        renderSubscriptionEditor(plan);
      });
      root.querySelectorAll('#pl-tiers [data-ptier]').forEach((el) => el.onclick = () => {
        applySelectedTier(SUB_EDIT, Number(el.getAttribute('data-ptier')));
        renderSubscriptionEditor(plan);
      });
    }
    const pick = root.querySelector('[data-act="pick-product"]');
    if (pick) pick.onclick = () => {
      if (!window.UI || !window.UI.productPicker) { toast('Product picker is not available'); return; }
      window.UI.productPicker({
        multiple: false,
        selected: SUB_EDIT.product ? [SUB_EDIT.product] : [],
        onConfirm: (picked) => {
          collectSubscriptionForm();
          const prod = picked[0];
          SUB_EDIT.product = prod ? prod.name : '';
          SUB_EDIT.productSku = prod && prod.sku ? prod.sku : '';
          SUB_EDIT.productId = prod && prod.id ? String(prod.id) : '';
          SUB_EDIT.image = (prod && prod.image) || subProductImage(SUB_EDIT.product);
          const found = activeBundleFor(SUB_EDIT.product, SUB_EDIT.productId);
          if (found) {
            SUB_EDIT.itemType = 'bundle';
            SUB_EDIT.bundleId = found.id;
            applySelectedTier(SUB_EDIT, found.defaultTier != null ? found.defaultTier : 0);
          } else {
            SUB_EDIT.itemType = 'product';
            SUB_EDIT.bundleId = '';
            SUB_EDIT.tierIndex = 0;
            SUB_EDIT.catalogPrice = (prod && prod.price) || SUB_CATALOG[SUB_EDIT.product] || '';
          }
          if (SUB_EDIT.product) delete SUB_ERRORS.product;
          renderSubscriptionEditor(plan);
        },
      });
    };
    const forceSw = root.querySelector('[data-act="force-sub"]');
    if (forceSw && !readonly) {
      forceSw.onclick = () => {
        SUB_EDIT.forceSubscription = !SUB_EDIT.forceSubscription;
        forceSw.classList.toggle('on', !!SUB_EDIT.forceSubscription);
        forceSw.setAttribute('aria-checked', SUB_EDIT.forceSubscription ? 'true' : 'false');
        syncSubscriptionUnsaved();
      };
    }
    const dealSw = root.querySelector('[data-act="show-deal"]');
    if (dealSw && !readonly) {
      dealSw.onclick = () => {
        SUB_EDIT.showDeliveryDetails = !showsDeliveryDetails(SUB_EDIT);
        dealSw.classList.toggle('on', showsDeliveryDetails(SUB_EDIT));
        dealSw.setAttribute('aria-checked', showsDeliveryDetails(SUB_EDIT) ? 'true' : 'false');
        refreshPreview();
      };
    }
    const clr = root.querySelector('[data-act="clear-item"]');
    if (clr) clr.onclick = () => {
      collectSubscriptionForm();
      SUB_EDIT.product = '';
      SUB_EDIT.productSku = '';
      SUB_EDIT.productId = '';
      SUB_EDIT.image = '';
      SUB_EDIT.catalogPrice = '';
      SUB_EDIT.itemType = '';
      SUB_EDIT.bundleId = '';
      SUB_EDIT.tierIndex = 0;
      renderSubscriptionEditor(plan);
    };
    const saveSubscription = () => {
      collectSubscriptionForm();
      if (!validateSubscription()) { renderSubscriptionEditor(plan); scrollToFirstSubscriptionError(); return; }
      const commit = () => {
        const saved = {
          key: SUB_EDIT_KEY === 'new' ? nextLocalKey() : SUB_EDIT.key || SUB_EDIT_KEY,
          id: SUB_EDIT.id && SUB_EDIT_KEY !== 'new' ? SUB_EDIT.id : (SUB_EDIT_KEY === 'new' ? nextLocalKey() : SUB_EDIT.id),
          origin: 'bestcheckout',
          visibility: showsOnProductPage(Object.assign({}, SUB_EDIT, { status: SUB_EDIT.status === 'draft' ? 'draft' : 'active' })) ? 'pdp' : 'checkout',
          status: SUB_EDIT.status === 'draft' ? 'draft' : 'active',
          name: String(SUB_EDIT.name || '').trim(),
          product: String(SUB_EDIT.product || '').trim(),
          productSku: SUB_EDIT.productSku || '',
          productId: SUB_EDIT.productId || '',
          image: SUB_EDIT.image || subProductImage(SUB_EDIT.product),
          catalogPrice: oneTimePriceOf(SUB_EDIT),
          itemType: SUB_EDIT.itemType || '',
          bundleId: SUB_EDIT.bundleId || '',
          tierIndex: Number(SUB_EDIT.tierIndex || 0),
          minCycles: Number(SUB_EDIT.minCycles || 0),
          widgetStyle: SUB_EDIT.widgetStyle || 'radio',
          forceSubscription: !!(showsForceSubscription(SUB_EDIT) && SUB_EDIT.forceSubscription),
          showDeliveryDetails: SUB_EDIT.showDeliveryDetails !== false,
          interval: { every: Number(SUB_EDIT.interval.every), unit: SUB_EDIT.interval.unit },
          discount: { type: SUB_EDIT.discount.type, value: Number(SUB_EDIT.discount.value) },
          sourceApp: 'BestCheckout',
          mapping: 'local',
          mappingNote: visibilityNote(SUB_EDIT),
          createdAt: SUB_EDIT.createdAt || '2026-09-05',
        };
        if (SUB_EDIT_KEY === 'new') saved.id = saved.key;
        if (saved.status === 'active') deactivateActivePlanSiblings(saved);
        const list = subscriptionState().sellingPlans;
        const idx = list.findIndex((row) => planKey(row) === saved.key);
        if (idx >= 0) list[idx] = saved;
        else list.unshift(saved);
        resetSubscriptionEditor();
        toast('Saved');
        location.hash = '#/subscriptions';
      };
      if (SUB_EDIT.status !== 'draft') {
        const conflict = activePlanSiblingOf(SUB_EDIT);
        if (conflict) {
          window.UI.confirm({
            title: 'Replace current active plan?',
            content: planProductName(SUB_EDIT) + ' already has an active subscription plan: ' + (conflict.name || conflict.id) + '. Activating ' + (SUB_EDIT.name || 'this plan') + ' will deactivate the current active plan.',
            okText: 'Replace and activate',
            onOk: commit,
          });
          return;
        }
      }
      commit();
    };
    const saveBtn = root.querySelector('[data-act="save"]');
    if (saveBtn) saveBtn.onclick = saveSubscription;
    const saveBar = root.querySelector('[data-act="save-bar"]');
    if (saveBar) saveBar.onclick = saveSubscription;
    const discard = root.querySelector('[data-act="discard"]');
    if (discard) discard.onclick = () => {
      if (!SUB_EDIT_BACKUP) return;
      SUB_EDIT = JSON.parse(JSON.stringify(SUB_EDIT_BACKUP));
      SUB_ERRORS = {};
      renderSubscriptionEditor(plan);
    };
    const del = root.querySelector('[data-act="delete"]');
    if (del) del.onclick = () => window.UI.confirm({
      title: 'Delete subscription',
      content: 'Delete this subscription? Checkout will stop offering it.',
      okText: 'Delete',
      danger: true,
      onOk: () => {
        subscriptionState().sellingPlans = (subscriptionState().sellingPlans || []).filter((p) => planKey(p) !== SUB_EDIT_KEY);
        resetSubscriptionEditor();
        toast('Deleted');
        location.hash = '#/subscriptions';
      },
    });
    syncSubscriptionUnsaved();
  }

  // Add font — mirrors fontModel.tsx: "Font:" label + Ant Select(mode=multiple) of
  // removable font tags, grey Cancel + orange (#db4015) OK.
  function openAddFontModal() {
    const sel = D.base.store.fonts.slice();
    const chips = () => sel.map((f) =>
      '<span class="ms-tag">' + esc(f) + '<span class="ms-x" data-rm="' + esc(f) + '">&times;</span></span>').join('');
    const ctrl = modal({
      title: 'Add font', width: 400, okText: 'OK',
      okStyle: 'background:#db4015;border-color:#db4015;color:#fff',
      body:
        '<div style="padding:8px 0 0">' +
          '<div class="flex items-center gap-4" style="margin-bottom:24px">' +
            '<span class="text-sm" style="font-weight:500;color:var(--ink);width:48px;flex:none">Font:</span>' +
            '<div class="ms-box" id="ms-box" style="flex:1"></div>' +
          '</div>' +
        '</div>',
      onOk: (m, close) => { close(); toast('Store fonts updated'); },
    });
    const box = ctrl.m.querySelector('#ms-box');
    const paint = () => {
      box.innerHTML = chips() + '<input class="ms-input" placeholder="' + (sel.length ? '' : 'Select') + '" />';
      box.querySelectorAll('[data-rm]').forEach((x) => x.onclick = () => {
        const f = x.getAttribute('data-rm'); const i = sel.indexOf(f); if (i > -1) sel.splice(i, 1); paint();
      });
    };
    paint();
  }
  function openLoginModal(key) {
    const s = D.base.social.find((x) => x.key === key);
    const body =
      '<div class="muted mb-4" style="font-size:13px">' + esc(s.blurb) + '</div>' +
      field('App ID', s.fields.appId, 'Please enter App ID') +
      field('App Secret', s.fields.appSecret, 'Please enter App Secret', { secret: true }) +
      field('Redirect URIs', s.fields.redirectUris, "Please enter Redirect URIs, You can enter your store's homepage URL.");
    modal({ title: s.modalTitle, width: 620, okText: 'Save',
      body, onOk: (m, close) => { close(); toast(s.linked ? 'Edit successfully' : 'Connected successfully'); },
      extraLeft: s.linked ? '<button class="btn" style="background:var(--err);color:#fff" data-disc>Cancel connection</button>' : '',
      onExtra: (m, close) => { close(); toast('Cancelled connection successfully'); } });
  }
  // ===========================================================================
  // TAB 2 — PAYMENTS  ("Payments", centered w-860)
  //   render.tsx: "Card Payments & Express Checkout" card (processor radio +
  //   Airwallex then Stripe rows: logo + method icons + Linked dot + Edit/Link)
  //   then a separate PayPal card. Credentials are entered in modals only.
  // ===========================================================================
  // ---- v2 资源 / 能力 ----
  const PAY_ASSET = 'settings/assets/payments/';
  const payImg = (f, hh, cn) => '<img' + (cn ? ' class="' + cn + '"' : '') + ' src="' + PAY_ASSET + f + '" style="height:' + (hh || 18) + 'px" alt=""/>';
  const PAY_ICON = {
    cards: payImg('visa.svg', 20) + payImg('mastercard.svg', 20) + payImg('amex.svg', 20) + payImg('unionpay.svg', 20),
    applepay: payImg('applepay.svg'), googlepay: payImg('googlepay.svg'), link: payImg('link.svg'),
    amazonpay: payImg('amazonpay.svg?v=20260723amazonpayicon1', 18, 'amazon-pay-icon'), klarna: payImg('klarna.svg'), paypal: payImg('paypal-logo.svg', 16),
  };
  // 各处理方「我们采用的集成方式」下 Express 块实际能出的方式（均已查官方文档核实 2026-06，见 PRD §5.2）。
  // PayPal 的 Cards、Apple Pay、Google Pay 共用同一个收款账户；具体钱包仍由资格条件决定。
  // Adyen=Components / Checkout=Flow / NMI=Collect.js（仅卡；钱包不对接——改地址无法更新运费）
  // Mollie=Components(GooglePay 待确认) / Braintree=Hosted Fields
  const PAY_EXPRESS = {
    stripe: ['applepay', 'googlepay', 'link', 'klarna', 'amazonpay'], airwallex: ['applepay', 'googlepay'],
    paypal_cards: ['applepay', 'googlepay'], adyen: ['applepay', 'googlepay'], checkout: ['applepay', 'googlepay'], mollie: ['applepay'], nmi: [], braintree: ['applepay', 'googlepay'],
  };
  // Official merchant dashboards. Stripe has a public payment-methods URL; others
  // land on login / dashboard home because payment-method pages need an account context.
  const PAY_DASH = {
    stripe: 'https://dashboard.stripe.com/settings/payment_methods',
    airwallex: 'https://www.airwallex.com/app/login',
    adyen: 'https://ca-live.adyen.com/ca/ca/login.shtml',
    checkout: 'https://dashboard.checkout.com',
    mollie: 'https://my.mollie.com/dashboard/login',
    nmi: 'https://secure.nmi.com/merchants/login.php',
    braintree: 'https://www.braintreegateway.com/login',
    paypal: 'https://developer.paypal.com/dashboard',
    paypal_cards: 'https://developer.paypal.com/dashboard',
  };
  function pDashLink(key, label) {
    const href = PAY_DASH[key];
    if (!href) return '<span class="lnkico">' + label + '</span>';
    return '<a class="lnkico" href="' + href + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
  }
  // 连接弹窗字段规格（Stripe / Airwallex 字段、文案、Learn more 链接对齐线上 StripeAccount / AirwallexAccount）
  const PAY_FORMS = {
    stripe: { desc: 'Allows users to pay with Card, Apple Pay, Google Pay, Link, Amazon Pay, and Klarna (where available).',
      fields: [
        { k: 'pub', label: 'Publishable Key', msg: 'Please enter Publishable Key' },
        { k: 'sec', label: 'Secret Key', msg: 'Please enter Secret Key' },
      ] },
    airwallex: { desc: 'Allows users to pay with Visa, Master Card, American Express, Discover, Diners Club, JCB, Apple Pay, Google Pay',
      fields: [
        { k: 'appkey', label: 'App Key', msg: 'Please enter App Key' },
        { k: 'cid', label: 'Client ID', msg: 'Please enter Client ID' },
      ], file: { label: 'Airwallex domain verification file', button: 'Upload ZIP', hint: 'Only .zip files up to 1MB are supported.', accept: '.zip' } },
    paypal: { desc: 'Allows users to pay with Visa, Master Card, American Express, Discover, Diners Club, JCB, Apple Pay, Google Pay', fields: [
      { k: 'cid', label: 'Client ID', msg: 'Please enter Client ID' }, { k: 'sec', label: 'Secret key', msg: 'Please enter Secret key' },
    ], file: { label: 'PayPal domain verification file', button: 'Upload file', accept: '', marginBottom: 16 } },
    adyen: { fields: [
      { k: 'api', label: 'API key', msg: 'Please enter API key' },
      { k: 'ck', label: 'Client key', msg: 'Please enter Client key' },
      { k: 'mer', label: 'Merchant account', msg: 'Please enter Merchant account' },
      { k: 'mapi', label: 'Management API key', msg: 'Please enter Management API key' },
      { k: 'prefix', label: 'Live URL prefix', msg: 'Please enter Live URL prefix', value: '/' },
    ], file: { label: 'Adyen domain verification file', button: 'Upload file', accept: '', marginBottom: 16 },
      afterFile: [{ k: 'gpay', label: 'Google Pay merchant ID', optional: true }] },
    checkout: { fields: [
      { k: 'sec', label: 'Secret key', msg: 'Please enter Secret key' },
      { k: 'pub', label: 'Public key', msg: 'Please enter Public key' },
      { k: 'cid', label: 'Client ID', msg: 'Please enter Client ID' },
      { k: 'chid', label: 'Processing channel ID', optional: true },
    ], file: { label: 'Checkout domain verification file', button: 'Upload file', accept: '', marginBottom: 16 },
      afterFile: [
        { k: 'oauthid', label: 'OAuth client ID', optional: true },
        { k: 'oauthsec', label: 'OAuth client secret', optional: true },
      ] },
    mollie: { fields: [
      { k: 'api', label: 'API key', msg: 'Please enter API key' },
      { k: 'pid', label: 'Profile ID', msg: 'Please enter Profile ID' },
    ], file: { label: 'Mollie domain verification file', button: 'Upload file', accept: '', marginBottom: 16 } },
    nmi: { desc: 'Allows users to pay with Visa, Mastercard, American Express, Discover, Diners Club, and JCB. Apple Pay and Google Pay are not available with NMI.',
      fields: [
        { k: 'sk', label: 'Private Security Key', msg: 'Please enter Private Security Key' },
        { k: 'tk', label: 'Public Security Key', msg: 'Please enter Public Security Key' },
      ] },
    braintree: { fields: [
      { k: 'pub', label: 'Public key', msg: 'Please enter Public key' },
      { k: 'priv', label: 'Private key', msg: 'Please enter Private key' },
      { k: 'mid', label: 'Merchant ID', msg: 'Please enter Merchant ID' },
      { k: 'gpay', label: 'Google merchant ID', optional: true },
    ], file: { label: 'Braintree domain verification file', button: 'Upload file', accept: '', marginBottom: 16 } },
    klarna_direct: { fields: [{ k: 'uid', label: 'API username (UID)' }, { k: 'pwd', label: 'API password' }, { k: 'region', label: 'Region（EU / NA / OC）' }] },
  };

  const ppCapKey = (id) => ({ applepay: 'applePay', googlepay: 'googlePay' }[id] || id);
  function ppCap(id) { return (D.payments.paypal.capabilities || {})[ppCapKey(id)] || 'unavailable'; }
  function pPaypalExpress() {
    return PAY_EXPRESS.paypal_cards.filter((id) => ppCap(id) === 'enabled');
  }
  function pExpressFor(processor) {
    if (!processor) return [];
    return processor.key === 'paypal_cards' ? pPaypalExpress().slice() : (PAY_EXPRESS[processor.key] || []).slice();
  }
  // PayPal reuses the connected PayPal account for Card Fields and eligible Express wallets.
  const pProcsVis = () => {
    const pp = D.payments.paypal;
    const paypalCards = pp.connected && pp.capabilities.cards === 'enabled'
      ? [{ key: 'paypal_cards', name: 'PayPal', logo: 'paypal-logo.svg', connected: true, accountKey: 'paypal' }]
      : [];
    return D.payments.processors.concat(paypalCards);
  };
  const pConnected = () => pProcsVis().filter((p) => p.connected);
  function pActive() { let a = pProcsVis().find((p) => p.key === D.payments.cardProcessor && p.connected); if (!a) a = pConnected()[0] || null; return a; }
  const pLogo = (p, hh) => p.logo
    ? payImg(p.logo, hh || 20)
    : '<span class="pm-mono">' + esc(p.name) + '</span>';
  function pMethPill(connected) {
    if (!connected) return '<span class="pill pill-gray"><span class="dot"></span>Not connected</span>';
    return '<span class="pill pill-green"><span class="dot"></span>Connected</span>';
  }
  // ① 卡 + Express 单处理方槽位（picker 内连接/切换/管理）
  function pSlot() {
    const a = pActive();
    const picker = '<div class="proc-pick"><span class="lab">Card processor</span>' +
      pProcsVis().map((p) => {
        if (p.connected) {
          const on = a && p.key === a.key;
          // ⚙ on every connected provider → edit credentials anytime; click a non-active name = switch
          const cog = '<button class="pchip-cog" data-cfg="' + (p.accountKey || p.key) + '" title="Manage credentials">⚙</button>';
          if (on) return '<span class="pchip on"><span class="pchip-name">' + pLogo(p, 15) + '</span>' + cog + '</span>';
          return '<span class="pchip"><button class="pchip-name" data-setproc="' + p.key + '" title="Set as processor">' + pLogo(p, 15) + '</button>' + cog + '</span>';
        }
        return '<button class="add" data-cfg="' + p.key + '">+ ' + esc(p.name) + '</button>';
      }).join('') + '</div>';
    if (!a) {
      return '<div class="panel card-pad"><div class="slot-head"><span class="slot-title">Cards &amp; Express processor</span>' + picker + '</div>' +
        '<div class="muted" style="padding:14px 0 4px;font-size:13px">No processor connected yet. Click “+ …” above to connect one and start accepting cards and Apple/Google Pay.</div></div>';
    }
    const paypalCards = a.key === 'paypal_cards';
    const express = pExpressFor(a);
    const expIcos = express.map((id) => PAY_ICON[id]).join(' ');
    const cardOnly = !express.length;
    const intro = cardOnly
      ? 'Once a processor is connected, card input shows at checkout. This processor does not provide Apple Pay or Google Pay.'
      : 'Once a processor is connected, card input and Express both show at checkout automatically; the specific wallets are auto-detected by buyer device/environment.';
    const cardMeta = (paypalCards ? 'PayPal Card Fields · Visa / Mastercard / Amex …' : 'Visa / Mastercard / Amex / UnionPay …') + ' · ' + pDashLink(a.key, 'Manage in dashboard ↗');
    const expressMeta = cardOnly
      ? (a.key === 'nmi'
        ? 'NMI currently supports card payments only. Apple Pay and Google Pay are not available. To offer wallets, switch the card processor to Stripe, Airwallex, or PayPal.'
        : 'This processor supports card payments only. Apple Pay and Google Pay are not available.')
      : 'Auto-rendered by buyer environment';
    const expressRow = '<div class="slot-row"><span class="ic">' + (expIcos || '<span class="muted" style="font-size:12px">This processor has no Express</span>') + '</span><div class="bd"><span class="lbl">Express Checkout</span><span class="meta">' + expressMeta + '</span></div></div>';
    return '<div class="panel card-pad">' +
      '<div class="slot-head"><span class="slot-title">Processed by ' + esc(a.name) + '</span>' + picker + '</div>' +
      '<div class="sec-sub" style="margin:0 0 14px">' + intro + '</div>' +
      '<div class="slot-row"><span class="ic">' + PAY_ICON.cards + '</span><div class="bd"><span class="lbl">Cards</span><span class="meta">' + cardMeta + '</span></div></div>' +
      expressRow +
      '<div class="syncline">Synced from the active processor · just now · <span class="lnkico" data-refresh>↻ Refresh</span></div>' +
    '</div>';
  }

  // ② 独立支付方式（PayPal / Klarna 自有直连）
  function pIndep() {
    let html = ''; const pp = D.payments.paypal;
    html += '<div class="panel imeth paypal-method"><div class="imeth-head"><span class="lg">' + payImg('paypal-logo.svg', 24) + '</span><div><div class="nm">PayPal Wallet</div><div class="sub">Independent wallet, self-settling · runs alongside the card processor</div></div><div class="right">' + pMethPill(pp.connected) + (pp.connected ? '<button class="set-prim" data-cfg="paypal">Manage</button>' : '<button class="btn btn-primary" data-cfg="paypal">Connect</button>') + '</div></div></div>';
    {
      const k = D.payments.klarna;
      if (k.directConnected) {
        html += '<div class="panel imeth" style="display:block"><div style="display:flex;align-items:center;gap:13px"><span class="lg">' + payImg('klarna.svg', 24) + '</span><div><div class="nm">Klarna · own direct account</div><div class="sub">Your own Klarna direct account · rates usually better than via a PSP</div></div><div class="right">' + pMethPill(true) + '<button class="set-prim" data-cfg="klarna_direct">Manage</button></div></div><div class="dnote">💡 Klarna at checkout uses your direct account; if the active processor also has Klarna enabled, it defers to the direct account automatically to avoid showing twice to buyers.</div></div>';
      } else {
        html += '<div class="panel imeth"><span class="lg">' + payImg('klarna.svg', 24) + '</span><div><div class="nm">Klarna · own direct account</div><div class="sub">Have your own Klarna account? Connect it for better rates and platform routing (otherwise it is rendered by the active processor).</div></div><div class="right"><span class="pill pill-gray"><span class="dot"></span>Not connected</span><button class="btn btn-primary" data-cfg="klarna_direct">Connect</button></div></div>';
      }
    }
    return html;
  }

  // 手机端结账预览（对齐实测：快捷支付按钮 → OR → 银行卡）
  function pPreview() {
    const a = pActive();
    const express = a ? pExpressFor(a) : [];
    const hasPaypal = D.payments.paypal.connected;
    const klarnaDirect = D.payments.klarna.directConnected;
    const hasCard = !!a;
    if (!express.length && !hasPaypal && !klarnaDirect && !hasCard) return '<div class="muted" style="text-align:center;padding:24px 0;font-size:13px">No payment provider connected yet, buyers can\'t pay.</div>';
    const order = { applepay: 0, googlepay: 1, link: 2, amazonpay: 3, klarna: 4 };
    express.sort((x, y) => (order[x] ?? 9) - (order[y] ?? 9));
    const stacked = a && a.key === 'airwallex';
    const ppBtn = '<div style="height:46px;border-radius:9px;background:#ffc439;display:grid;place-items:center;margin-bottom:8px">' + payImg('paypal-logo.svg', 20) + '</div>';
    const fullBox = (id) => '<div class="wallet" style="width:100%;height:46px;margin-bottom:8px">' + PAY_ICON[id] + '</div>';
    let html = '';
    if (hasPaypal) html += ppBtn;
    if (stacked) {
      express.forEach((id) => html += fullBox(id));
      if (klarnaDirect && !express.includes('klarna')) html += fullBox('klarna');
    } else {
      const grid = express.slice(); if (klarnaDirect && !grid.includes('klarna')) grid.push('klarna');
      if (grid.length) html += '<div class="wallets">' + grid.map((id, i) => { const full = (grid.length % 2 === 1) && (i === grid.length - 1); return '<div class="wallet"' + (full ? ' style="grid-column:1 / -1"' : '') + '>' + PAY_ICON[id] + '</div>'; }).join('') + '</div>';
    }
    if (hasCard) {
      const anyW = hasPaypal || express.length || klarnaDirect;
      if (anyW) html += '<div style="text-align:center;font-size:11px;color:var(--ink-muted);margin:2px 0 10px">or pay with card</div>';
      html += '<div class="ck-opt sel"><span class="ck-radio"></span><span>Cards</span><span class="ck-ico">' + PAY_ICON.cards + '</span></div>';
    }
    if (hasPaypal) html += '<div class="ck-opt" data-preview-wallet="paypal"><span class="ck-radio"></span><span>PayPal</span><span class="ck-ico">' + PAY_ICON.paypal + '</span></div>';
    if (klarnaDirect) html += '<div class="ck-opt" data-preview-wallet="klarna"><span class="ck-radio"></span><span>Pay With Klarna</span><span class="ck-ico">' + PAY_ICON.klarna + '</span></div>';
    return html + '<div class="ck-pay">Pay now</div>';
  }

  function pReco() {
    if (D.payments.phase !== 2) return '';
    return '<div class="reco"><div class="star">★</div><div style="flex:1"><div style="font-weight:700;font-size:14px;color:var(--ink)">BestShopio Payments <span class="pill pill-blue" style="margin-left:6px"><span class="dot"></span>Coming soon</span></div><div class="sec-sub" style="margin:3px 0 0">Platform acquiring — one-click setup, instant settlement, smart routing + retries behind the scenes. No account of your own needed.</div></div><button class="btn btn-gray" disabled style="opacity:.6;cursor:default">Coming soon</button></div>';
  }

  // Switch processor — confirm dialog (reuses SPA modal())
  function pConfirmSwitch(key) {
    const cur = pActive(); const p = pProcsVis().find((x) => x.key === key);
    const paypalImpact = key === 'paypal_cards'
      ? '<div class="dnote" style="margin-top:10px">Cards will move to PayPal. Apple Pay and Google Pay will appear only after the PayPal account, checkout domain, and buyer environment are eligible.</div>'
      : '';
    const nmiImpact = key === 'nmi'
      ? '<div class="dnote" style="margin-top:10px">Apple Pay and Google Pay will no longer appear at checkout. Buyers can still pay by card through NMI. PayPal Wallet and Klarna are not affected.</div>'
      : '';
    modal({ title: 'Switch card processor', width: 440, okText: 'Switch',
      body: '<div style="font-size:13.5px;line-height:1.65;color:var(--ink-body)">Cards and Express Checkout at checkout will switch processor. The payment methods buyers see may change accordingly.</div><div style="font-size:13px;margin-top:8px"><b>' + esc(cur ? cur.name : '—') + '</b> → <b>' + esc(p.name) + '</b></div>' + paypalImpact + nmiImpact + '<div class="muted" style="font-size:12px;margin-top:10px">Switch during off-peak hours; in-flight transactions are unaffected.</div>',
      onOk: (m, close) => { D.payments.cardProcessor = key; close(); renderPayments(); toast('Switched successfully'); } });
  }

  function pIsConnected(key) { if (key === 'paypal') return D.payments.paypal.connected; if (key === 'paypal_cards') return D.payments.paypal.connected && D.payments.paypal.capabilities.cards === 'enabled'; if (key === 'klarna_direct') return D.payments.klarna.directConnected; const p = D.payments.processors.find((p) => p.key === key); return p && p.connected; }
  function pEntName(key) { if (key === 'paypal' || key === 'paypal_cards') return 'PayPal'; if (key === 'klarna_direct') return 'Klarna Direct'; const p = D.payments.processors.find((p) => p.key === key); return p ? p.name : ''; }
  function pAccountMode(key) {
    if (key === 'paypal' || key === 'paypal_cards') return (D.payments.paypal && D.payments.paypal.mode) || 'live';
    if (key === 'klarna_direct') return (D.payments.klarna && D.payments.klarna.mode) || 'live';
    const p = D.payments.processors.find((x) => x.key === key);
    return (p && p.mode) || 'live';
  }
  function pSetAccountMode(key, mode) {
    const next = mode === 'sandbox' ? 'sandbox' : 'live';
    if (key === 'paypal' || key === 'paypal_cards') D.payments.paypal.mode = next;
    else if (key === 'klarna_direct') D.payments.klarna.mode = next;
    else { const p = D.payments.processors.find((x) => x.key === key); if (p) p.mode = next; }
  }
  function pModeLocale(en, zh) {
    return (window.I18N && window.I18N.lang === 'zh') ? zh : en;
  }
  const PAY_MANUAL_WEBHOOK = { nmi: true, braintree: true };
  const PAY_WEBHOOK_HOST = 'https://api.bestcheckout.com';
  const PAY_WEBHOOK_TOKEN = { nmi: '7c2a91e04b8d4f16a3e55c8f0d12b476', braintree: 'b9e14c70a2f84d3bb6c018e5a47d9f21' };
  function pEnsureWebhookToken(key) {
    const p = D.payments.processors.find((x) => x.key === key);
    if (!p) return '';
    if (!p.webhookToken) p.webhookToken = PAY_WEBHOOK_TOKEN[key] || (key + 'webhook');
    return p.webhookToken;
  }
  function pWebhookUrl(key) {
    return PAY_WEBHOOK_HOST + '/api/' + key + '/webhook/' + pEnsureWebhookToken(key);
  }
  function pWebhookNote(key, connected) {
    if (!PAY_MANUAL_WEBHOOK[key]) return '';
    const name = pEntName(key);
    if (!connected) {
      return '<div class="i18n-skip muted" style="font-size:12.5px;margin:4px 0 14px;line-height:1.55">' +
        esc(pModeLocale(
          'After you connect, we will show a webhook URL. Create a webhook in the ' + name + ' dashboard with that URL. We will receive payment results automatically.',
          '连接成功后，这里会给出 Webhook 地址。请到 ' + name + ' 后台创建 Webhook 并粘贴该地址，我们会自动接收支付结果。'
        )) + '</div>';
    }
    return '<div class="i18n-skip" style="margin:8px 0 14px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px">' +
        '<div style="font-size:13px;font-weight:600;color:var(--ink)">' + pModeLocale('Webhook URL', 'Webhook 地址') + '</div>' +
        '<button type="button" class="btn btn-default" data-copy-webhook style="height:28px;padding:0 10px;font-size:12px">' + pModeLocale('Copy', '复制') + '</button></div>' +
      '<div style="font-size:12px;line-height:1.5;word-break:break-all;background:#f6f7fb;border:1px solid var(--ctl);border-radius:8px;padding:9px 11px;color:var(--ink)">' + esc(pWebhookUrl(key)) + '</div>' +
      '<div class="muted" style="font-size:12px;margin-top:6px;line-height:1.55">' +
        esc(pModeLocale(
          'Create a webhook in your ' + name + ' dashboard and paste this URL. We will receive payment results automatically after it is saved.',
          '请到 ' + name + ' 后台创建 Webhook 并粘贴此地址。保存后我们会自动接收支付结果。'
        )) + '</div></div>';
  }
  function pModeFields(key) {
    const selected = pAccountMode(key);
    const live = pModeLocale('Live', '正式');
    const sandbox = pModeLocale('Sandbox', '沙盒');
    const hint = pModeLocale(
      'Sandbox is for test payments only. Bind the payment provider\'s sandbox merchant account. Switch to Live before accepting real customer payments.',
      '沙盒仅用于测试支付收单，需绑定该支付机构的沙盒商户账号。向买家正式收款前，请切换到正式模式。'
    );
    return '<div class="i18n-skip" style="margin:8px 0 4px"><div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:8px">' + pModeLocale('Mode', '模式') + '</div>' +
      '<div style="display:flex;gap:22px;align-items:center;font-size:13px;color:var(--ink-body)">' +
        '<label style="display:inline-flex;align-items:center;gap:7px;cursor:pointer"><input type="radio" name="payment-mode" data-payment-mode value="live"' + (selected === 'live' ? ' checked' : '') + '> ' + live + '</label>' +
        '<label style="display:inline-flex;align-items:center;gap:7px;cursor:pointer"><input type="radio" name="payment-mode" data-payment-mode value="sandbox"' + (selected === 'sandbox' ? ' checked' : '') + '> ' + sandbox + '</label></div>' +
      '<div class="muted" style="font-size:12px;margin-top:8px;line-height:1.55">' + hint + '</div></div>';
  }

  // 连接 / 管理弹窗。仅 Braintree / NMI 需要商家把 Webhook 地址贴回支付机构后台。
  function pConnect(key) {
    if (key === 'paypal') D.payments.paypal.connected = true;
    else if (key === 'paypal_cards') return;
    else if (key === 'klarna_direct') { D.payments.klarna.directConnected = true; D.payments.klarna.directOn = true; }
    else {
      const pr = D.payments.processors.find((p) => p.key === key);
      const hadActive = !!pActive();
      pr.connected = true;
      if (PAY_MANUAL_WEBHOOK[key]) pEnsureWebhookToken(key);
      if (!hadActive) D.payments.cardProcessor = key;
    }
  }
  function pDisconnect(key) {
    if (key === 'paypal') {
      D.payments.paypal.connected = false;
      if (D.payments.cardProcessor === 'paypal_cards') { const n = pConnected()[0]; D.payments.cardProcessor = n ? n.key : null; }
    }
    else if (key === 'klarna_direct') D.payments.klarna.directConnected = false;
    else { const pr = D.payments.processors.find((p) => p.key === key); pr.connected = false; if (D.payments.cardProcessor === key) { const n = pConnected()[0]; D.payments.cardProcessor = n ? n.key : null; } }
  }
  function pOpenConnect(key) {
    const connected = pIsConnected(key); const name = pEntName(key);
    const spec = PAY_FORMS[key] || { fields: [{ k: 'k1', label: 'API key' }, { k: 'k2', label: 'Secret' }] };
    let body = '';
    if (spec.desc) body += '<div class="muted" style="font-size:13px;margin-bottom:12px;line-height:1.5">' + esc(spec.desc) + '</div>';
    const fieldHtml = (f) => {
      const learn = f.learn ? '<a href="' + f.learn + '" target="_blank" style="font-size:12px;color:var(--brand);font-weight:400">Learn more</a>' : '';
      const star = f.optional ? '' : ' <span style="color:var(--err)">*</span>';
      return '<div style="margin-bottom:4px"><div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600;color:var(--ink);margin-bottom:6px"><span>' + esc(f.label) + star + '</span>' + learn + '</div>' +
        '<input class="input" data-pf="' + f.k + '" placeholder="Please enter ' + esc(f.label) + '"' + (connected ? ' value="•••••••••••• (saved)"' : (f.value ? ' value="' + esc(f.value) + '"' : '')) + ' />' +
        '<div data-perr="' + f.k + '" style="min-height:18px;font-size:12px;color:var(--err);margin-top:3px"></div></div>';
    };
    body += spec.fields.map(fieldHtml).join('');
    if (spec.file) {
      const file = typeof spec.file === 'string'
        ? { label: spec.file, button: 'Upload ZIP', hint: 'Only .zip files up to 1MB are supported.', accept: '.zip' }
        : spec.file;
      body += '<div style="margin:' + (file.marginTop || 0) + 'px 0 ' + (file.marginBottom == null ? 4 : file.marginBottom) + 'px"><div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:6px">' + esc(file.label) + '</div><button class="btn btn-default" type="button" data-file-upload data-file-accept="' + esc(file.accept || '') + '">' + esc(file.button || 'Upload file') + '</button>' + (file.hint ? '<div class="muted" style="font-size:11.5px;margin-top:4px">' + esc(file.hint) + '</div>' : '') + '</div>';
    }
    if (spec.afterFile) body += spec.afterFile.map(fieldHtml).join('');
    body += '<div data-webhook-slot>' + pWebhookNote(key, connected) + '</div>';
    body += pModeFields(key);

    const bindWebhookCopy = (root) => {
      root.querySelectorAll('[data-copy-webhook]').forEach((button) => {
        button.onclick = () => {
          const url = pWebhookUrl(key);
          try { navigator.clipboard.writeText(url); } catch (e) {}
          toast(pModeLocale('Webhook URL copied', '已复制 Webhook 地址'));
        };
      });
    };
    const revealWebhookAfterConnect = (m, close) => {
      const slot = m.querySelector('[data-webhook-slot]');
      if (slot) {
        slot.innerHTML = pWebhookNote(key, true);
        slot.scrollIntoView({ block: 'nearest' });
      }
      const titleEl = m.querySelector('.modal-head span');
      if (titleEl) titleEl.textContent = 'Manage ' + name;
      const okBtn = m.querySelector('[data-ok]');
      if (okBtn) okBtn.textContent = 'Save';
      const foot = m.querySelector('.modal-foot');
      if (foot && !m.querySelector('[data-disc]')) {
        foot.style.justifyContent = 'space-between';
        const disc = h('<button class="btn" style="background:var(--err);color:#fff" data-disc>Cancel connection</button>');
        foot.insertBefore(disc, foot.firstChild);
        disc.onclick = () => { pDisconnect(key); close(); renderPayments(); toast('Cancelled connection successfully'); };
      }
      bindWebhookCopy(m);
    };

    let liveConnected = connected;
    const dlg = modal({
      title: key === 'paypal' ? (connected ? 'Manage PayPal' : 'Connect PayPal developer account') : ((connected ? 'Manage ' : 'Connect ') + name), width: 520, okText: connected ? 'Save' : 'Connect',
      body,
      extraLeft: connected ? '<button class="btn" style="background:var(--err);color:#fff" data-disc>Cancel connection</button>' : '',
      onOk: (m, close) => {
        // 校验：必填字段不能为空（对齐线上 validateForm）
        let okAll = true, firstBad = null;
        spec.fields.concat(spec.afterFile || []).forEach((f) => {
          const inp = m.querySelector('[data-pf="' + f.k + '"]');
          const err = m.querySelector('[data-perr="' + f.k + '"]');
          const val = ((inp && inp.value) || '').trim();
          if (!f.optional && !val) { okAll = false; if (err) err.textContent = f.msg || ('Please enter ' + f.label); if (inp) inp.style.borderColor = 'var(--err)'; if (!firstBad) firstBad = inp; }
        });
        if (!okAll) { if (firstBad) firstBad.focus(); return; }   // 校验不过不关闭
        const mode = m.querySelector('[data-payment-mode]:checked');
        if (mode) pSetAccountMode(key, mode.value);
        if (!liveConnected) {
          pConnect(key);
          liveConnected = true;
          renderPayments();
          toast('Connected successfully');
          if (PAY_MANUAL_WEBHOOK[key]) {
            revealWebhookAfterConnect(m, close);
            return;
          }
          close();
          return;
        }
        close(); renderPayments(); toast('Edit successfully');
      },
      onExtra: (m, close) => { pDisconnect(key); close(); renderPayments(); toast('Cancelled connection successfully'); },
    });
    // 输入即清除该字段错误；文件选择仅更新原型展示
    dlg.m.querySelectorAll('[data-pf]').forEach((inp) => inp.oninput = () => { const err = dlg.m.querySelector('[data-perr="' + inp.dataset.pf + '"]'); if (err) err.textContent = ''; inp.style.borderColor = ''; });
    dlg.m.querySelectorAll('[data-file-upload]').forEach((button) => {
      button.onclick = () => openFilePicker({
        accept: button.dataset.fileAccept || '',
        onSelected: (file) => {
          button.textContent = file.name;
          toast('Selected ' + file.name);
        }
      });
    });
    bindWebhookCopy(dlg.m);
  }

  const PAY_CSS =
    '.payv2{width:100%}.payv2 .pay-grid{display:grid;grid-template-columns:1fr;gap:24px;align-items:start;width:100%;max-width:none}' +
    '@media(min-width:1200px){.payv2 .pay-grid{grid-template-columns:minmax(0,1fr) 340px}}' +
    '.payv2 .seg{display:inline-flex;background:#eef0f7;border-radius:9px;padding:3px;gap:2px}' +
    '.payv2 .seg button{border:none;background:transparent;height:30px;padding:0 14px;border-radius:7px;font-size:13px;font-weight:600;color:var(--ink-muted);cursor:pointer}' +
    '.payv2 .seg button.on{background:#fff;color:var(--brand);box-shadow:0 1px 2px rgb(16 24 40/8%)}' +
    '.payv2 .sec-title{font-size:14px;font-weight:600;color:var(--ink);margin:20px 0 4px}' +
    '.payv2 .sec-sub{font-size:13px;color:var(--ink-muted);margin:0 0 12px;line-height:1.5}' +
    '.payv2 .slot-head{display:flex;flex-direction:column;align-items:flex-start;gap:10px;margin-bottom:10px}' +
    '.payv2 .slot-title{font-weight:600;font-size:14px;color:var(--ink)}' +
    '.payv2 .proc-pick{display:flex;gap:8px;flex-wrap:wrap;align-items:center;row-gap:8px}' +
    '.payv2 .proc-pick .lab{font-size:12px;color:var(--ink-muted);margin-right:2px}' +
    '.payv2 .proc-pick button{height:30px;padding:0 11px;border-radius:8px;border:1px solid var(--ctl);background:#fff;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;color:var(--ink)}' +
    '.payv2 .proc-pick button.on{border-color:var(--brand);background:var(--brand-50);color:var(--brand);font-weight:600}' +
    '.payv2 .proc-pick img{height:15px}' +
    '.payv2 .proc-pick .add{border-style:dashed;color:var(--brand)}' +
    '.payv2 .proc-pick .add:hover{background:var(--brand-50)}' +
    '.payv2 .proc-pick .pchip{display:inline-flex;align-items:center;height:30px;border:1px solid var(--ctl);border-radius:8px;overflow:hidden}' +
    '.payv2 .proc-pick .pchip.on{border-color:var(--brand);background:var(--brand-50)}' +
    '.payv2 .proc-pick .pchip .pchip-name{height:28px;padding:0 6px 0 11px;border:none;background:transparent;display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--ink);cursor:pointer}' +
    '.payv2 .proc-pick .pchip.on .pchip-name{color:var(--brand);font-weight:600;cursor:default}' +
    '.payv2 .proc-pick .pchip .pchip-name:hover{background:rgba(0,0,0,.04)}' +
    '.payv2 .proc-pick .pchip.on .pchip-name:hover{background:transparent}' +
    '.payv2 .proc-pick .pchip .pchip-cog{height:28px;padding:0 8px;border:none;border-left:1px solid var(--hair);background:transparent;color:var(--ink-muted);cursor:pointer;font-size:12px}' +
    '.payv2 .proc-pick .pchip .pchip-cog:hover{background:rgba(0,0,0,.05);color:var(--ink)}' +
    '.payv2 .proc-pick .lock{height:30px;padding:0 11px;border-radius:8px;border:1px dashed var(--hair);background:var(--panel);font-size:13px;color:var(--ink-muted);display:inline-flex;align-items:center;gap:6px}' +
    '.payv2 .slot-row{display:flex;align-items:center;gap:12px;padding:14px 0;border-top:1px solid var(--hair)}' +
    '.payv2 .slot-row .ic{display:flex;gap:4px;align-items:center;flex-wrap:wrap}.payv2 .express-unavailable{white-space:nowrap;flex:none}' +
    '.payv2 .slot-row .ic img{height:20px}' +
    '.payv2 .slot-row .bd{display:flex;flex-direction:column;flex:1;min-width:0}' +
    '.payv2 .slot-row .lbl{font-weight:600;font-size:13.5px;color:var(--ink)}' +
    '.payv2 .slot-row .meta{font-size:12px;color:var(--ink-muted);margin-top:2px;line-height:1.5}' +
    '.payv2 .slot-row .right{margin-left:auto}' +
    '.payv2 .sw{width:34px;height:20px;border-radius:9999px;background:#cfd5e4;position:relative;cursor:pointer;transition:background .15s;flex:none;display:inline-block}' +
    '.payv2 .sw.on{background:var(--brand)}' +
    '.payv2 .sw i{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .15s;box-shadow:0 1px 2px rgb(0 0 0/20%)}' +
    '.payv2 .sw.on i{left:16px}' +
    '.payv2 .lnkico{color:var(--brand);cursor:pointer;text-decoration:none}.payv2 a.lnkico{color:var(--brand)}.payv2 .lnkico:hover{text-decoration:underline}' +
    '.payv2 .syncline{font-size:12px;color:var(--ink-muted);padding-top:12px;border-top:1px solid var(--hair);display:flex;gap:8px;flex-wrap:wrap;align-items:center}' +
    '.payv2 .imeth{display:flex;align-items:center;gap:13px;padding:15px 16px;margin-bottom:12px}' +
    '.payv2 .paypal-method{display:block}.payv2 .imeth-head{display:flex;align-items:center;gap:13px}' +
    '.payv2 .imeth .lg{height:24px;display:flex;align-items:center}.payv2 .imeth .lg img{height:24px}' +
    '.payv2 .imeth .nm{font-weight:700;font-size:14px;color:var(--ink)}' +
    '.payv2 .imeth .sub{font-size:12.5px;color:var(--ink-muted);margin-top:2px}' +
    '.payv2 .imeth .right{margin-left:auto;display:flex;align-items:center;gap:10px}' +
    '.payv2 .dnote{margin:10px 0 0;font-size:12.5px;color:#1e3a8a;background:#eef4ff;border:1px solid #cfe1ff;border-radius:9px;padding:9px 12px;line-height:1.6}' +
    '.payv2 .set-prim{font-size:12px;color:var(--brand);background:#fff;border:1px solid var(--ctl);border-radius:8px;padding:5px 11px;cursor:pointer}' +
    '.payv2 .set-prim:hover{border-color:var(--brand);background:var(--brand-50)}' +
    '.payv2 .pm-mono{font-weight:800;font-size:13px;color:var(--ink)}' +
    '.payv2 .reco{display:flex;align-items:center;gap:14px;padding:16px;border:1px solid #cfe1ff;background:linear-gradient(95deg,#eef4ff,#f7faff);border-radius:12px;margin-bottom:18px}' +
    '.payv2 .reco .star{width:38px;height:38px;border-radius:10px;background:var(--brand);color:#fff;display:grid;place-items:center;flex:none}' +
    '.payv2 .preview-col{position:sticky;top:16px}' +
    '.payv2 .phone{background:#fff;border:1px solid var(--ctl);border-radius:22px;box-shadow:var(--float-shadow);padding:14px;max-width:380px;margin:0 auto}' +
    '.payv2 .phone-notch{width:90px;height:5px;border-radius:3px;background:#e3e6ef;margin:2px auto 12px}' +
    '.payv2 .ck-h{font-size:13px;font-weight:700;color:var(--ink);margin:2px 0 10px}' +
    '.payv2 .ck-opt{display:flex;align-items:center;gap:10px;border:1px solid var(--ctl);border-radius:10px;padding:11px 12px;margin-bottom:8px;font-size:13px}' +
    '.payv2 .ck-opt.sel{border-color:var(--brand);box-shadow:0 0 0 2px var(--brand-50)}' +
    '.payv2 .ck-radio{width:16px;height:16px;border-radius:50%;border:2px solid var(--ctl);flex:none}' +
    '.payv2 .ck-opt.sel .ck-radio{border-color:var(--brand);background:radial-gradient(circle at center,var(--brand) 0 4px,#fff 5px)}' +
    '.payv2 .ck-ico{margin-left:auto;display:flex;gap:4px}.payv2 .ck-ico img{height:16px}' +
    '.payv2 .ck-pay{margin-top:6px;height:42px;border-radius:10px;background:var(--brand);color:#fff;font-weight:700;font-size:14px;display:grid;place-items:center}' +
    '.payv2 .wallets{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}' +
    '.payv2 .wallet{height:40px;border-radius:9px;border:1px solid var(--ctl);display:grid;place-items:center}.payv2 .wallet img{height:18px}.payv2 .amazon-pay-icon{width:18px;max-width:18px;object-fit:contain;display:block}' +
    '.payv2 .preview-note{font-size:11.5px;color:var(--ink-muted);text-align:center;margin-top:10px;line-height:1.5}' +
    '.payv2 .foot-note{font-size:12px;color:var(--ink-muted);margin-top:20px;line-height:1.7}';

  function renderPayments() {
    const main =
      '<div class="sec-title" style="margin-top:0">① Cards &amp; Express checkout</div>' +
      '<div class="sec-sub">Only one processor at a time renders card fields. Express wallets follow the active processor; with PayPal, Apple Pay and Google Pay depend on account capability, checkout-domain verification, and buyer environment.</div>' +
      pSlot() +
      '<div class="sec-title">② Independent payment methods</div>' +
      '<div class="sec-sub">Self-settling — can run alongside the card processor, each on its own rails.</div>' +
      pIndep();
    const preview =
      '<div class="preview-col"><div class="phone"><div class="phone-notch"></div>' +
        '<div class="ck-h">Checkout · methods buyers see</div>' + pPreview() + '</div>' +
        '<div class="preview-note">What buyers see are the methods lit up by connected providers.</div></div>';
    paint(
      '<style>' + PAY_CSS + '</style>' +
      '<div class="payv2">' +
        '<div style="margin-bottom:14px"><div class="page-title" style="font-size:20px">Payments</div></div>' +
        '<div class="pay-grid"><div>' + main + '</div>' + preview + '</div>' +
      '</div>',
      false
    );
    root.querySelectorAll('[data-setproc]').forEach((el) => el.onclick = () => pConfirmSwitch(el.dataset.setproc));
    root.querySelectorAll('[data-cfg]').forEach((el) => el.onclick = () => pOpenConnect(el.dataset.cfg));
    root.querySelectorAll('[data-refresh]').forEach((el) => el.onclick = () => toast('Synced from the active processor'));
  }

  // (旧 openProviderModal 已移除——连接/管理改由 pOpenConnect 承接，见上)

  // NOTE: Tracking pixels (Meta / GA4 / TikTok / Google Ads / Custom) moved out
  //   of Settings — Pixel + CAPI now lives in each platform's Channel workspace:
  //   #/facebook (Meta) and #/google (GA4 + Google Ads). Aligns with BestShopio
  //   Channel architecture.

  // ===========================================================================
  // TAB 3 — CURRENCY  ("Currency", full width)
  //   index.vue: description "Default currency: USD $" + search bar + table.
  //   edit.vue rendered as a modal here (rate/symbol/status), exchange_rate_type
  //   0 = automatic, 1 = manual; price rounding "Round up to the nearest …".
  // ===========================================================================
  function renderCurrency() {
    const c = D.currency;
    const rows = c.list.map((r) =>
      '<tr data-cid="' + r.id + '">' +
        '<td><div class="flex items-center gap-2"><span class="ccy-flag">' + esc(r.country_code) + '</span>' +
          '<span class="subtle" style="font-weight:500">' + esc(r.country_name) + '</span></div></td>' +
        '<td>' + esc(r.currency_code) + '</td>' +
        '<td>' + esc(r.currency_symbol) + '</td>' +
        '<td>' + toggle(r.currency_status === 1, r.currency_code + ' status') + '</td>' +
        '<td>' + esc(r.exchange_rate_type_text) + '</td>' +
        '<td class="muted">' + esc(r.exchange_rate_round_type_text) + '</td>' +
        '<td style="text-align:right"><button class="lnk" data-edit-ccy="' + r.id + '">Edit</button></td>' +
      '</tr>').join('');

    const fieldOpts = c.searchFieldOptions.map((o) => '<option value="' + o.value + '">' + esc(o.label) + '</option>').join('');

    const table =
      '<div class="panel">' +
        '<div class="card-pad" style="background:#f7f8fb;border-bottom:1px solid var(--hair);border-radius:10px 10px 0 0;padding:12px 16px">' +
          '<div class="flex items-center gap-2 flex-wrap">' +
            '<select class="filter-select" style="width:160px">' + fieldOpts + '</select>' +
            '<input class="filter-input" placeholder="Please enter keywords to search" style="padding-left:12px;width:268px" />' +
            '<select class="filter-select" style="width:160px"><option>Status</option><option>On</option><option>Off</option></select>' +
            '<select class="filter-select" style="width:160px"><option>Exchange rate</option><option>Automatic</option><option>Manual</option></select>' +
          '</div>' +
        '</div>' +
        '<div style="overflow-x:auto"><table class="tbl" style="min-width:900px">' +
          '<thead><tr><th>Country</th><th>Currency code</th><th>Currency symbol</th><th>Status</th><th>Exchange rate</th><th>Price rounding</th><th style="text-align:right">Action</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table></div>' +
      '</div>';

    paint(
      pageHead('Currency', 'Default currency: ' + c.defaultCurrency) +
      table,
      false
    );

    root.querySelectorAll('[data-edit-ccy]').forEach((b2) => b2.onclick = (e) => { e.stopPropagation(); openCurrencyEdit(Number(b2.getAttribute('data-edit-ccy'))); });
    root.querySelectorAll('#root tr[data-cid]').forEach((tr) => tr.onclick = () => openCurrencyEdit(Number(tr.getAttribute('data-cid'))));
  }

  function openCurrencyEdit(id) {
    const r = D.currency.list.find((x) => x.id === id);
    if (!r) return;
    const auto = r.exchange_rate_type === 0;
    const radio = (on, label, sub) =>
      '<label class="set-radio2' + (on ? ' on' : '') + '"><span class="proc-radio">' + (on ? '<span class="proc-dot"></span>' : '') + '</span>' +
      '<span><span class="subtle" style="font-weight:500">' + esc(label) + '</span>' + (sub ? '<div class="muted" style="font-size:12px;margin-top:2px">' + esc(sub) + '</div>' : '') + '</span></label>';
    const round = r.exchange_rate_round_type === 1;
    const body =
      block('<div class="flex gap-8 text-sm"><div><span class="muted">Currency code:</span> <span class="subtle" style="font-weight:500">' + esc(r.currency_code) + '</span></div>' +
            '<div><span class="muted">Currency symbol:</span> <span class="subtle" style="font-weight:500">' + esc(r.currency_symbol) + '</span></div></div>') +
      // Exchange rate
      '<div style="border:1px solid var(--hair);border-radius:10px;padding:14px 16px;margin-top:16px">' +
        '<div class="card-title" style="font-size:15px;margin-bottom:10px">Exchange rate</div>' +
        '<div class="flex flex-col gap-2">' +
          radio(auto, 'Using automatic exchange rates', 'The price of an item will change automatically based on the market rate and includes a 0% conversion fee. 1 ' + r.original_currency + ' = ' + r.exchange_rate_auto_value + ' ' + r.currency_code + '.') +
          radio(!auto, 'Use manual exchange rates', 'Customized exchange rates, no conversion fees.') +
        '</div>' +
        '<div class="mt-2 flex items-center gap-2" style="' + (auto ? 'opacity:.5' : '') + '"><span class="muted text-sm">1 ' + esc(r.original_currency) + ' =</span>' +
          '<div class="set-addon"><input class="input" type="number" value="' + esc(r.exchange_rate) + '" step="0.01" min="0" style="width:160px;border-top-right-radius:0;border-bottom-right-radius:0" /><span class="set-addon-suffix">' + esc(r.currency_code) + '</span></div></div>' +
      '</div>' +
      // Price rounding
      '<div style="border:1px solid var(--hair);border-radius:10px;padding:14px 16px;margin-top:16px">' +
        '<div class="card-title" style="font-size:15px;margin-bottom:10px">Price rounding</div>' +
        '<div class="flex flex-col gap-2">' +
          '<label class="set-radio' + (round ? ' on' : '') + '"><span class="proc-radio">' + (round ? '<span class="proc-dot"></span>' : '') + '</span><span>Round up to the nearest ' + esc(r.currency_code) + ' ' + esc(r.currency_symbol) + '</span>' +
            '<input class="input" type="number" value="' + (r.exchange_rate_round || 1) + '" min="1" style="width:120px;margin-left:8px"' + (round ? '' : ' disabled') + ' /></label>' +
          '<label class="set-radio' + (round ? '' : ' on') + '"><span class="proc-radio">' + (round ? '' : '<span class="proc-dot"></span>') + '</span>Do not round prices</label>' +
          (round ? '' : '<div class="muted" style="font-size:12px;margin-left:24px">The price will automatically be rounded to two decimal places.</div>') +
        '</div>' +
      '</div>' +
      // Price decimal
      '<div style="border:1px solid var(--hair);border-radius:10px;padding:14px 16px;margin-top:16px">' +
        '<div class="card-title" style="font-size:15px;margin-bottom:10px">Price decimal</div>' +
        '<div class="flex flex-col gap-2">' + [0, 1, 2].map((d) => '<label class="set-radio' + (r.exchange_rate_decimal === d ? ' on' : '') + '"><span class="proc-radio">' + (r.exchange_rate_decimal === d ? '<span class="proc-dot"></span>' : '') + '</span>' + d + '</label>').join('') + '</div>' +
      '</div>';
    modal({ title: r.country_name, width: 600, okText: 'Update', body, onOk: (m, close) => { close(); toast('Updated successfully'); } });
  }

  // ===========================================================================
  // TAB 4 — METAFIELDS  ("Metafields", centered w-860)
  //   list.tsx (resource picker) -> detail.tsx (Name / Data Type / Used in) ->
  //   form.tsx (add/edit, custom. prefix). No system pill / nskey in the table.
  //   sub-state: mfResource = null (picker) | 'products' | 'variants'
  // ===========================================================================
  let mfResource = null;
  let mfAdding = false; // true = showing the inline "Add field definition" view (not a modal — mirrors form.tsx)

  function renderMetafields() {
    const m = D.metafields;
    if (!mfResource) {
      const rows = m.resources.map((r) => {
        const count = (m.definitions[r.key] || []).length;
        const ico = r.badge
          ? '<span class="mf-res-ico">' + esc(r.badge) + '</span>'
          : '<span class="mf-res-ico">' + I.tagSm + '</span>';
        return '<button class="mf-res" data-res="' + r.key + '">' + ico +
          '<span style="flex:1;text-align:left"><span class="text-sm" style="font-weight:600;color:var(--ink);display:block">' + esc(r.title) + '</span>' +
          '<span class="muted" style="font-size:12.5px">' + count + ' definitions</span></span>' +
          '<span class="muted">' + I.chevR + '</span></button>';
      }).join('');
      paint(
        pageHead('Metafields', 'Add a custom piece of data to a specific part of your store') +
        '<div class="panel card-pad">' + sectionTitle('Metafield', 'Select a module to manage extended fields') +
          '<div class="mt-4 flex flex-col gap-2">' + rows + '</div>' +
        '</div>',
        true
      );
      root.querySelectorAll('[data-res]').forEach((b2) => b2.onclick = () => { mfResource = b2.getAttribute('data-res'); renderMetafields(); });
      return;
    }

    const r = m.resources.find((x) => x.key === mfResource);
    const defs = m.definitions[mfResource] || [];
    if (mfAdding) { paintAddDefinition(r); return; }
    const suffix = mfResource === 'variants' ? 'variants' : 'products';
    const title = mfResource === 'variants' ? 'Product variant metafields' : 'Product metafields';
    const rows = defs.map((d) =>
      '<tr>' +
        '<td><div class="flex items-center gap-3"><span class="muted mf-grip">' + I.grip + '</span><span class="subtle" style="font-weight:500">' + esc(d.name) + '</span></div></td>' +
        '<td><div class="flex items-center gap-2"><span class="mf-type-ico">' + I.tagSm + '</span><span>' + esc(d.typeLabel) + '</span></div></td>' +
        '<td class="muted">' + d.usedIn + ' ' + suffix + '</td>' +
      '</tr>').join('');

    paint(
      '<div class="flex items-center justify-between mb-4">' +
        '<div class="flex items-center gap-3">' +
          '<button class="back-btn" data-act="mf-back" title="Back">' + I.chevL + '</button>' +
          '<div class="page-title" style="font-size:18px">' + esc(title) + '</div>' +
        '</div>' +
        (defs.length ? '<button class="btn btn-primary" data-act="mf-add">Add fields</button>' : '') +
      '</div>' +
      (defs.length
        ? '<div class="panel"><div style="overflow-x:auto"><table class="tbl" style="min-width:560px">' +
            '<thead><tr><th>Name</th><th>Data Type</th><th>Used in</th></tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table></div>' +
            '<div class="flex items-center justify-between card-pad"><span class="muted" style="font-size:13px">Total ' + defs.length + ' records</span></div>' +
          '</div>'
        : // blank state (blank.tsx)
          '<div class="panel" style="min-height:360px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:48px">' +
            '<div class="mf-blank-ico">' + I.tagSm + '</div>' +
            '<div class="card-title" style="font-size:18px;margin-top:16px">' + (mfResource === 'variants' ? 'Add metafield for product variant' : 'Add metafield for product category') + '</div>' +
            '<div class="muted" style="font-size:13px;margin-top:6px;margin-bottom:18px">' + (mfResource === 'variants' ? 'Used to add extention fields and data for product variant' : 'Used to add extention fields and data for product category') + '</div>' +
            '<button class="btn btn-primary" data-act="mf-add">Add fields</button>' +
          '</div>'),
      true
    );
    const back = root.querySelector('[data-act="mf-back"]'); if (back) back.onclick = () => { mfResource = null; renderMetafields(); };
    root.querySelectorAll('[data-act="mf-add"]').forEach((b2) => b2.onclick = () => { mfAdding = true; renderMetafields(); });
  }

  // Add field definition — an inline VIEW with a back arrow (mirrors form.tsx), NOT a modal.
  function paintAddDefinition(resource) {
    const m = D.metafields;
    const typeOpts = m.typeOptions.map((g) =>
      '<optgroup label="' + esc(g.group) + '">' + g.types.map((t) => '<option value="' + t.type + '">' + esc(t.label) + '</option>').join('') + '</optgroup>').join('');
    const title = resource.key === 'variants' ? 'Add variant metafield definition' : 'Add product metafield definition';
    paint(
      '<div class="flex items-center gap-3 mb-4">' +
        '<button class="back-btn" data-act="def-back" title="Back">' + I.chevL + '</button>' +
        '<div class="page-title" style="font-size:18px">' + esc(title) + '</div>' +
      '</div>' +
      '<div class="panel card-pad">' +
        field('Name', '', 'Name') +
        field('Namespace and key', '', 'namespace.key', { addonBefore: 'custom.' }) +
        '<div style="margin-bottom:12px"><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Type <span style="color:var(--err)">*</span></div>' +
          '<select class="input"><option value="" disabled selected>Select type</option>' + typeOpts + '</select></div>' +
        '<div><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Description (Optional)</div>' +
          '<textarea class="input" rows="3" placeholder="Please Enter" style="height:auto;padding:8px 12px;resize:vertical"></textarea></div>' +
      '</div>' +
      '<div class="flex justify-end gap-2 mt-4">' +
        '<button class="btn btn-default" data-act="def-cancel">Cancel</button>' +
        '<button class="btn btn-primary" data-act="def-add">Add</button>' +
      '</div>',
      true
    );
    const goBack = () => { mfAdding = false; renderMetafields(); };
    const back = root.querySelector('[data-act="def-back"]'); if (back) back.onclick = goBack;
    const cancel = root.querySelector('[data-act="def-cancel"]'); if (cancel) cancel.onclick = goBack;
    const add = root.querySelector('[data-act="def-add"]'); if (add) add.onclick = () => { mfAdding = false; toast(resource.key + ' metafield definition created successfully'); renderMetafields(); };
  }

  // ===========================================================================
  // TAB 6 — SHIPPABLE LOCATIONS  ("Ship locations", full width)
  //   index.vue + list.tsx + table.tsx: filter bar + expandable table
  //   (Country/Region / Located in / Status (Visible|Hidden) / Sort / Action).
  //   LocationFormModal: Country/Region + Located in + Status radio + Sort.
  // ===========================================================================
  function flattenLocations(nodes, depth, acc, openSet) {
    nodes.forEach((n) => {
      acc.push({ node: n, depth: depth });
      if (n.children && n.children.length && openSet.has(n.id)) {
        flattenLocations(n.children, depth + 1, acc, openSet);
      }
    });
    return acc;
  }
  let locOpen = new Set([1]); // expanded row ids (North America open by default)

  function renderLocations() {
    const tree = D.locations.tree;
    let total = 0;
    tree.forEach((n) => { total++; });

    const rowsHtml = () => {
      const flat = flattenLocations(tree, 0, [], locOpen);
      return flat.map(({ node: n, depth }) => {
        const indent = depth * 16;
        const hasKids = n.snum && n.snum > 0;
        const caret = hasKids
          ? '<button class="loc-caret' + (locOpen.has(n.id) ? ' open' : '') + '" data-loc-toggle="' + n.id + '">' + I.chevR + '</button>'
          : '<span style="width:16px;display:inline-block"></span>';
        const flag = depth === 0 && n.code ? '<span class="ccy-flag" style="width:20px;height:14px">' + esc(n.code) + '</span>' : (depth === 0 ? '<span class="ccy-flag" style="width:20px;height:14px"></span>' : '');
        const vis = n.is_show === 1;
        const sortVal = (!n.sort || Number(n.sort) === 0) ? '--' : n.sort;
        return '<tr data-locrow="' + n.id + '">' +
          '<td><div class="flex items-center gap-2" style="padding-left:' + indent + 'px">' + caret + flag + '<span>' + esc(n.name) + '</span></div></td>' +
          '<td class="muted">' + (n.located_in ? esc(n.located_in) : '- -') + '</td>' +
          '<td><div class="flex items-center gap-2">' + toggle(vis, n.name + ' status') + '<span class="muted">' + (vis ? 'Visible' : 'Hidden') + '</span></div></td>' +
          '<td class="muted">' + esc(sortVal) + '</td>' +
          '<td><div class="flex items-center gap-1">' +
            '<button class="set-icon-btn" data-loc-edit="' + n.id + '" title="Edit">' + I.pencil + '</button>' +
            '<button class="set-icon-btn danger" data-loc-del="' + n.id + '" title="Delete">' + I.trash + '</button>' +
          '</div></td>' +
        '</tr>';
      }).join('');
    };

    paint(
      pageHead('Ship locations', 'Set delivery regions at checkout', '<button class="btn btn-primary" data-act="loc-add">Add location</button>') +
      '<div class="panel">' +
        '<div class="card-pad" style="background:#fff;border-bottom:1px solid var(--hair);padding:16px">' +
          '<div class="flex items-center gap-2 flex-wrap">' +
            '<select class="filter-select" style="width:150px"><option value="country">Country/Region</option><option value="locatedIn">Located in</option></select>' +
            '<input class="filter-input" placeholder="Search" style="padding-left:12px;width:268px" />' +
            '<select class="filter-select" style="width:160px"><option>Status</option><option>Visible</option><option>Hidden</option></select>' +
          '</div>' +
        '</div>' +
        '<div style="overflow-x:auto"><table class="tbl loc-table" style="min-width:760px">' +
          '<thead><tr><th>Country/Region</th><th>Located in</th><th style="width:160px">Status</th><th style="width:120px">Sort</th><th style="width:110px">Action</th></tr></thead>' +
          '<tbody id="loc-tbody">' + rowsHtml() + '</tbody>' +
        '</table></div>' +
        '<div class="flex items-center justify-between card-pad"><span class="muted" style="font-size:13px">Total ' + total + ' records</span></div>' +
      '</div>',
      false
    );

    const wire = () => {
      root.querySelectorAll('[data-loc-toggle]').forEach((el) => el.onclick = (e) => {
        e.stopPropagation();
        const id = Number(el.getAttribute('data-loc-toggle'));
        if (locOpen.has(id)) locOpen.delete(id); else locOpen.add(id);
        const tb = root.querySelector('#loc-tbody'); if (tb) { tb.innerHTML = rowsHtml(); wire(); }
      });
      root.querySelectorAll('[data-loc-edit]').forEach((el) => el.onclick = (e) => { e.stopPropagation(); openLocationModal('edit', Number(el.getAttribute('data-loc-edit'))); });
      root.querySelectorAll('[data-loc-del]').forEach((el) => el.onclick = (e) => {
        e.stopPropagation();
        confirm({ title: 'Delete location', content: 'Once deleted, the data cannot be retrieved. Please confirm before proceeding!', okText: 'Delete', danger: true, onOk: () => toast('Location deleted successfully') });
      });
    };
    wire();
    const add = root.querySelector('[data-act="loc-add"]'); if (add) add.onclick = () => openLocationModal('add');
  }

  function findLocNode(nodes, id) {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) { const f = findLocNode(n.children, id); if (f) return f; }
    }
    return null;
  }

  function openLocationModal(mode, id) {
    const rec = mode === 'edit' ? findLocNode(D.locations.tree, id) : null;
    // flat list of all locations as "Located in" options
    const flatOpts = [];
    const walk = (nodes, prefix) => nodes.forEach((n) => {
      flatOpts.push({ id: n.id, label: (prefix ? prefix + ' > ' : '') + n.name });
      if (n.children) walk(n.children, (prefix ? prefix + ' > ' : '') + n.name);
    });
    walk(D.locations.tree, '');
    const vis = rec ? rec.is_show === 1 : true;
    const body =
      field('Country/Region', rec ? rec.name : '', 'Country/Region') +
      '<div style="margin-bottom:12px"><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Located in <span style="color:var(--err)">*</span></div>' +
        '<select class="input"' + (mode === 'edit' ? ' disabled' : '') + '><option value="" disabled' + (rec ? '' : ' selected') + '>Please select</option>' +
          flatOpts.map((o) => '<option value="' + o.id + '"' + (rec && rec.located_in && o.label === (rec.located_in) ? ' selected' : '') + '>' + esc(o.label) + '</option>').join('') +
        '</select></div>' +
      '<div style="margin-bottom:12px"><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Status <span style="color:var(--err)">*</span></div>' +
        '<label class="set-radio' + (vis ? ' on' : '') + '" style="margin-right:16px"><span class="proc-radio">' + (vis ? '<span class="proc-dot"></span>' : '') + '</span>Visible</label>' +
        '<label class="set-radio' + (vis ? '' : ' on') + '"><span class="proc-radio">' + (vis ? '' : '<span class="proc-dot"></span>') + '</span>Hidden</label></div>' +
      '<div><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Sort</div>' +
        '<div class="flex items-center gap-3"><input class="input" type="number" min="0" placeholder="Sort" value="' + (rec && rec.sort ? rec.sort : '') + '" style="width:200px" />' +
        '<span class="muted" style="font-size:12px">Higher sort show first</span></div></div>';
    modal({ title: mode === 'edit' ? 'Edit location' : 'Add location', width: 620, okText: mode === 'edit' ? 'Update' : 'Add', body,
      onOk: (m, close) => { close(); toast(mode === 'edit' ? 'Updated successfully' : 'Added successfully'); } });
  }

  // ===========================================================================
  // TAB 7 — SHIPPING RATES  ("Shipping rates", centered w-860)
  //   list.tsx -> general.tsx / custom.tsx (profile detail with ZonesPanel +
  //   NoChargeAreas; custom adds profile-name + Products). Rate/Zone modals.
  //   sub-state: rateProfile = null (list) | profile id
  // ===========================================================================
  let rateProfile = null;

  function renderRates() {
    const data = D.rates;
    if (rateProfile == null) {
      const general = data.profiles.find((p) => p.is_general === 1);
      const customs = data.profiles.filter((p) => p.is_general === 0);

      const generalRow = general
        ? '<div class="rate-row" data-profile="' + general.id + '">' +
            '<span class="rate-ico">' + I.globe + '</span>' +
            '<span style="flex:1;text-align:left"><span class="muted" style="font-size:13px">Supported shipping ' + general.zones_count + ' zone(s)</span></span>' +
            '<span class="muted">' + I.chevR + '</span></div>'
        : '';
      const generalCard =
        '<div class="panel card-pad mb-4">' +
          '<div class="mb-2"><div class="text-sm" style="font-weight:600;color:var(--ink)">General shipping rates</div>' +
            '<div class="muted" style="font-size:12.5px">All products that are not in other shipping profiles.</div></div>' +
          generalRow +
        '</div>';

      const customRow = (p) =>
        '<div class="rate-row" data-profile="' + p.id + '">' +
          '<span class="rate-ico">' + I.globe + '</span>' +
          '<span style="flex:1;text-align:left">' +
            '<span class="text-sm" style="font-weight:600;color:var(--ink);display:block">' + esc(p.name) + '</span>' +
            '<span class="muted" style="font-size:12.5px">Includes ' + (p.products_count || 0) + ' product(s), available for shipping to ' + (p.regions_count || 0) + ' region(s)</span>' +
          '</span>' +
          '<span class="muted">' + I.chevR + '</span></div>';
      const customCard =
        '<div class="panel card-pad mb-4">' +
          '<div class="flex items-center justify-between mb-2"><div><div class="text-sm" style="font-weight:600;color:var(--ink)">Custom shipping profile</div>' +
            '<div class="muted" style="font-size:12.5px">Create a shipping profile to add custom rates for groups of products.</div></div>' +
            '<button class="btn btn-primary" data-act="add-profile">Add</button></div>' +
          '<div class="mt-3 flex flex-col gap-3">' + (customs.length ? customs.map(customRow).join('') : '<div class="muted text-sm" style="text-align:center;padding:24px 0">No custom profiles</div>') + '</div>' +
        '</div>';

      paint(
        pageHead('Shipping rates', 'Set shipping fees at checkout.') +
        generalCard + customCard,
        true
      );
      root.querySelectorAll('[data-profile]').forEach((b2) => b2.onclick = () => { rateProfile = Number(b2.getAttribute('data-profile')); renderRates(); });
      const ap = root.querySelector('[data-act="add-profile"]'); if (ap) ap.onclick = () => { rateProfile = 'new'; renderRates(); };
      return;
    }

    renderRateProfile();
  }

  function renderRateProfile() {
    const data = D.rates;
    const isNew = rateProfile === 'new';
    const p = isNew ? null : data.profiles.find((x) => x.id === rateProfile);
    if (!isNew && !p) { rateProfile = null; renderRates(); return; }
    const isCustom = isNew || p.is_general === 0;
    const sym = data.currencySymbol;
    const title = p ? (p.is_general === 1 ? 'General shipping rates' : 'Edit the shipping rates for custom profile') : 'Add the shipping rates for custom profile';

    const rateRule = (rt) => {
      if (rt.condition_type === 'none') return '';
      if (rt.condition_type === 'price') {
        const mn = Number(rt.min_value || 0);
        return rt.max_value == null ? 'Orders ' + sym + mn.toFixed(2) + ' and up' : 'Orders ' + sym + mn.toFixed(2) + '-' + sym + Number(rt.max_value).toFixed(2);
      }
      const mn = Number(rt.min_value || 0);
      return rt.max_value == null ? 'Weight ' + mn.toFixed(2) + 'g and up' : 'Weight ' + mn.toFixed(2) + 'g-' + Number(rt.max_value).toFixed(2) + 'g';
    };
    const ratePrice = (rt) => rt.price === 0
      ? '<span class="rate-free">Free</span>'
      : '<span class="rate-price">' + sym + Number(rt.price).toFixed(2) + '</span>';

    const zones = p ? p.zones : [];
    const zoneBlock = (z) => {
      const areasText = (z.areas && z.areas.length) ? z.areas.join(', ') : (z.region_ids ? z.region_ids.length + ' region(s)' : '');
      const rates = z.rates.length
        ? '<div class="rate-list">' + z.rates.map((rt) =>
            '<div class="rate-item"><div style="min-width:0"><div class="subtle" style="font-weight:500;font-size:13px">' + esc(rt.name) + '</div>' +
              (rateRule(rt) ? '<div class="muted" style="font-size:12px">' + rateRule(rt) + '</div>' : '') + '</div>' +
              '<div class="flex items-center gap-2">' + ratePrice(rt) +
                '<button class="set-icon-btn" data-rate-menu="' + z.id + ':' + rt.id + '" title="More">' + I.dots + '</button></div></div>').join('') + '</div>'
        : '<div class="rate-empty"><div class="muted text-sm">No shipping rates found for this region</div>' +
            '<div style="margin-top:10px"><button class="btn btn-primary" style="height:28px" data-add-rate="' + z.id + '">Add shipping rate</button></div>' +
            '<div style="margin-top:10px;font-size:12px;color:var(--err)">Add shipping to ensure that customers in this area complete the checkout</div></div>';
      return '<div class="zone-block">' +
        '<div class="flex items-center justify-between">' +
          '<div class="flex items-center gap-2"><span class="zone-ico">' + I.truck + '</span><span class="subtle" style="font-weight:600">' + esc(z.name) + '</span></div>' +
          '<div class="flex items-center gap-2">' +
            (z.rates.length ? '<button class="btn btn-gray" style="height:28px" data-add-rate="' + z.id + '">Add shipping rate</button>' : '') +
            '<button class="set-icon-btn" data-zone-menu="' + z.id + '" title="More">' + I.dots + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="muted" style="font-size:12px;margin:4px 0 10px">Includes deliveries to: ' + esc(areasText) + '</div>' +
        rates +
      '</div>';
    };

    const zonesCard =
      '<div class="panel mb-4">' +
        '<div class="flex items-center justify-between card-pad" style="border-bottom:1px solid var(--hair);padding:16px"><div>' +
          '<div class="text-sm" style="font-weight:600;color:var(--ink);font-size:15px">Shipping zones and shipping rates</div>' +
          '<div class="muted" style="font-size:12px;margin-top:2px">Set shipping zones and rates visible to customers at checkout.</div></div>' +
          (zones.length ? '<button class="btn btn-gray" style="height:28px" data-act="add-zone">Add shipping zone</button>' : '') +
        '</div>' +
        (zones.length
          ? '<div class="card-pad flex flex-col gap-3" style="padding:16px">' + zones.map(zoneBlock).join('') + '</div>'
          : '<div class="card-pad" style="text-align:center;padding:40px"><div class="muted text-sm">No shipping zones yet</div>' +
              '<div style="margin-top:10px"><button class="btn btn-primary" style="height:28px" data-act="add-zone">Add shipping zone</button></div></div>') +
      '</div>';

    const noChargeAreas = D.rates.noChargeAreas;
    const noCharge =
      '<div class="panel card-pad mb-4">' +
        '<div class="text-sm" style="font-weight:600;color:var(--ink);margin-bottom:6px">Areas with no shipping charges added</div>' +
        (noChargeAreas.length
          ? '<div class="muted" style="font-size:12px">' + noChargeAreas.length + ' countries/regions: ' + esc(noChargeAreas.join(', ')) + '</div>'
          : '<div class="muted text-sm">No data available</div>') +
      '</div>';

    // custom-profile name + products
    let customHead = '';
    if (isCustom) {
      const prods = (p && p.products) || [];
      const prodRows = prods.length
        ? '<div class="rate-list">' + prods.map((pr) =>
            '<div class="rate-item"><div class="flex items-center gap-3"><span class="prod-thumb">IMG</span>' +
              '<div><div class="text-sm">' + esc(pr.store_name) + '</div>' + (pr.spec_type === 1 ? '<div class="muted" style="font-size:12px">(' + pr.variantNum + ' variants selected)</div>' : '') + '</div></div>' +
              '<button class="set-icon-btn" title="Remove">' + I.x + '</button></div>').join('') + '</div>'
        : '<div class="muted text-sm" style="text-align:center;padding:24px 0">No data available<div style="margin-top:8px"><button class="btn btn-primary" style="height:28px" data-act="add-products">Add products</button></div></div>';
      customHead =
        '<div class="panel card-pad mb-4">' +
          '<div class="text-sm" style="font-weight:600;color:var(--ink);margin-bottom:6px">Custom profile name <span class="muted" style="font-weight:400">(Customers won\'t see this)</span></div>' +
          '<input class="input" maxlength="100" placeholder="Please enter" value="' + esc(p ? p.name : '') + '" /></div>' +
        '<div class="panel card-pad mb-4">' +
          '<div class="flex items-center justify-between mb-3"><div class="text-sm" style="font-weight:600;color:var(--ink);font-size:15px">Products</div>' +
            (prods.length ? '<button class="btn btn-gray" style="height:28px" data-act="add-products">Add products</button>' : '') + '</div>' +
          prodRows +
        '</div>';
    } else {
      // general profile shows a read-only Products panel
      customHead =
        '<div class="panel card-pad mb-4">' +
          '<div class="text-sm" style="font-weight:600;color:var(--ink);font-size:15px">Products</div>' +
          '<div class="muted" style="font-size:12px;margin-top:4px">All products not in other profiles. Newly created products are added to this profile.</div>' +
          '<div class="muted text-sm" style="text-align:center;padding:24px 0;margin-top:8px;border:1px solid var(--hair);border-radius:8px">No data available</div>' +
        '</div>';
    }

    const footer = isCustom
      ? '<div class="flex items-center ' + (isNew ? 'justify-end' : 'justify-between') + '">' +
          (isNew ? '' : '<button class="btn" style="background:var(--err);color:#fff" data-act="del-profile">Delete group profile</button>') +
          '<button class="btn btn-primary" data-act="save">' + (isNew ? 'Add' : 'Update') + '</button>' +
        '</div>'
      : '<div class="flex justify-end">' + updateBtn + '</div>';

    paint(
      '<div class="flex items-center gap-3 mb-4">' +
        '<button class="back-btn" data-act="rate-back" title="Back">' + I.chevL + '</button>' +
        '<div class="page-title" style="font-size:20px">' + esc(title) + '</div>' +
      '</div>' +
      customHead + zonesCard + noCharge + footer,
      true
    );

    const back = root.querySelector('[data-act="rate-back"]'); if (back) back.onclick = () => { rateProfile = null; renderRates(); };
    root.querySelectorAll('[data-act="save"]').forEach((b2) => b2.onclick = () => { toast(isNew ? 'Created successfully' : 'Updated successfully'); if (isNew) { rateProfile = null; renderRates(); } });
    const az = root.querySelector('[data-act="add-zone"]'); if (az) az.onclick = () => openZoneModal('add');
    const ap2 = root.querySelector('[data-act="add-products"]'); if (ap2) ap2.onclick = () => toast('Add products — select products for this profile');
    const dp = root.querySelector('[data-act="del-profile"]'); if (dp) dp.onclick = () => confirm({ title: 'Delete group profile', content: 'Are you sure you want to delete this profile?', okText: 'Delete', danger: true, onOk: () => { toast('Deleted successfully'); rateProfile = null; renderRates(); } });
    root.querySelectorAll('[data-add-rate]').forEach((b2) => b2.onclick = () => openRateModal('add', Number(b2.getAttribute('data-add-rate')), null));
    root.querySelectorAll('[data-rate-menu]').forEach((b2) => b2.onclick = (e) => {
      const [zid, rid] = b2.getAttribute('data-rate-menu').split(':').map(Number);
      openRowMenu(e.currentTarget, [
        { label: 'Edit rate', onClick: () => openRateModal('edit', zid, rid) },
        { label: 'Delete', danger: true, onClick: () => { const z = (p.zones || []).find((x) => x.id === zid); confirm({ title: 'Delete rate', content: 'Are you sure you want to delete "' + (z ? (z.rates.find((r) => r.id === rid) || {}).name : '') + '"?', okText: 'Delete', danger: true, onOk: () => { if (z) z.rates = z.rates.filter((r) => r.id !== rid); renderRateProfile(); } }); } },
      ]);
    });
    root.querySelectorAll('[data-zone-menu]').forEach((b2) => b2.onclick = (e) => {
      const zid = Number(b2.getAttribute('data-zone-menu'));
      openRowMenu(e.currentTarget, [
        { label: 'Edit zone', onClick: () => openZoneModal('edit', zid) },
        { label: 'Delete', danger: true, onClick: () => { const z = (p.zones || []).find((x) => x.id === zid); confirm({ title: 'Delete zone', content: 'Are you sure you want to delete "' + (z ? z.name : '') + '"?', okText: 'Delete', danger: true, onOk: () => { if (p) p.zones = p.zones.filter((x) => x.id !== zid); renderRateProfile(); } }); } },
      ]);
    });
  }

  // tiny dropdown menu anchored to a button (mirrors Ant Dropdown)
  function openRowMenu(anchor, items) {
    document.querySelectorAll('.row-menu').forEach((m) => m.remove());
    const menu = h('<div class="row-menu"></div>');
    menu.innerHTML = items.map((it, i) => '<button class="row-menu-item' + (it.danger ? ' danger' : '') + '" data-i="' + i + '">' + esc(it.label) + '</button>').join('');
    document.body.appendChild(menu);
    const r = anchor.getBoundingClientRect();
    menu.style.top = (r.bottom + window.scrollY + 4) + 'px';
    menu.style.left = (r.right + window.scrollX - menu.offsetWidth) + 'px';
    menu.querySelectorAll('[data-i]').forEach((el) => el.onclick = () => { const it = items[Number(el.getAttribute('data-i'))]; menu.remove(); it.onClick(); });
    setTimeout(() => {
      const close = (e) => { if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', close); } };
      document.addEventListener('click', close);
    }, 0);
  }

  function openZoneModal(mode, zoneId) {
    const data = D.rates;
    const p = data.profiles.find((x) => x.id === rateProfile);
    const z = mode === 'edit' && p ? (p.zones || []).find((x) => x.id === zoneId) : null;
    const regionNames = [];
    const walk = (nodes) => nodes.forEach((n) => { regionNames.push(n.name); if (n.children) walk(n.children); });
    walk(D.locations.tree);
    const selected = z && z.areas ? z.areas : [];
    const body =
      '<div style="margin-bottom:16px"><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Shipping zone name <span class="muted" style="font-weight:400">(Customers won\'t see this)</span></div>' +
        '<input class="input" maxlength="100" placeholder="Please enter shipping zone name" value="' + esc(z ? z.name : '') + '" /></div>' +
      '<div><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Shipping zone</div>' +
        '<div class="zone-region-pick">' +
          regionNames.slice(0, 12).map((nm) =>
            '<label class="edit-check" style="padding:5px 0"><input type="checkbox"' + (selected.includes(nm) ? ' checked' : '') + ' /><span>' + esc(nm) + '</span></label>').join('') +
        '</div></div>';
    modal({ title: mode === 'edit' ? 'Edit shipping zone' : 'Add shipping zone', width: 560, okText: mode === 'edit' ? 'Done' : 'Add', body,
      onOk: (m, close) => { close(); toast('Shipping zone saved'); } });
  }

  function openRateModal(mode, zoneId, rateId) {
    const data = D.rates;
    const p = data.profiles.find((x) => x.id === rateProfile);
    const zone = p ? (p.zones || []).find((z) => z.id === zoneId) : null;
    const rt = (mode === 'edit' && zone) ? (zone.rates.find((r) => r.id === rateId) || {}) : {};
    const sym = data.currencySymbol;
    const cond = rt.condition_type || 'none';
    const hasCond = cond === 'price' || cond === 'weight';

    const condRadio = (val, label) =>
      '<label class="set-radio' + (cond === val ? ' on' : '') + '" data-radio="cond" data-val="' + val + '" style="margin-right:16px"><span class="proc-radio">' + (cond === val ? '<span class="proc-dot"></span>' : '') + '</span>' + esc(label) + '</label>';

    const isPrice = cond === 'price';
    const minMaxBlock = (unit, before) =>
      '<div class="flex items-center gap-3" style="margin-top:8px"><div class="text-sm" style="width:140px">Minimum ' + unit + ':</div>' +
        '<div class="set-addon">' + (before ? '<span class="set-addon-prefix">' + esc(sym) + '</span>' : '') + '<input class="input" type="number" min="0" step="0.01" value="' + (rt.min_value != null ? rt.min_value : '') + '" style="width:120px' + (before ? ';border-top-left-radius:0;border-bottom-left-radius:0' : '') + '" />' + (before ? '' : '<span class="set-addon-suffix">g</span>') + '</div></div>' +
      '<div class="flex items-center gap-3" style="margin-top:8px"><div class="text-sm" style="width:140px">Maximum ' + unit + ':</div>' +
        '<div class="set-addon">' + (before ? '<span class="set-addon-prefix">' + esc(sym) + '</span>' : '') + '<input class="input" type="number" min="0" step="0.01" placeholder="No limit" value="' + (rt.max_value != null ? rt.max_value : '') + '" style="width:120px' + (before ? ';border-top-left-radius:0;border-bottom-left-radius:0' : '') + '" />' + (before ? '' : '<span class="set-addon-suffix">g</span>') + '</div></div>';

    const body =
      '<div style="margin-bottom:14px"><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Shipping rate name <span class="muted" style="font-weight:400">(Displayed during checkout when the customer chooses a logistics option. PayPal limits this to 24 characters — longer names may cause checkout errors.)</span></div>' +
        '<input class="input" maxlength="24" placeholder="Please enter shipping rate name" value="' + esc(rt.name || '') + '" list="rate-name-sugg" />' +
        '<datalist id="rate-name-sugg">' + data.rateNameSuggestions.map((s) => '<option value="' + esc(s) + '"></option>').join('') + '</datalist></div>' +
      '<div style="margin-bottom:14px"><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Additional description</div>' +
        '<textarea class="input" rows="3" maxlength="100" placeholder="Additional description for logistic timeliness, delivery noticeand other information, which will be displayed when there is no freight merge. (Optional)" style="height:auto;padding:8px 12px;resize:vertical">' + esc(rt.description || '') + '</textarea></div>' +
      '<div style="margin-bottom:12px"><div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Price:</div>' +
        '<div class="set-addon"><span class="set-addon-prefix">' + esc(sym) + '</span><input class="input" type="number" min="0" step="0.01" value="' + (rt.price != null ? rt.price : '') + '" style="width:160px;border-top-left-radius:0;border-bottom-left-radius:0" /></div></div>' +
      '<div style="margin-bottom:10px"><a class="lnk" data-act="toggle-cond">' + (hasCond ? 'Delete conditions' : 'More pricing options') + '</a></div>' +
      '<div data-cond-wrap style="display:' + (hasCond ? 'block' : 'none') + '">' +
        '<div class="ctrl-label" style="text-transform:none;margin-bottom:6px">Charging method <span class="muted" style="font-weight:400">(Conditions are inclusive on both ends: Minimum ≤ value ≤ Maximum)</span></div>' +
        '<div style="margin-bottom:4px">' + condRadio('weight', 'Based on item weight') + condRadio('price', 'Based on order price') + '</div>' +
        '<div data-minmax>' + (cond === 'weight' ? minMaxBlock('weight', false) : minMaxBlock('price', true)) + '</div>' +
      '</div>' +
      '<div style="margin-top:14px"><div class="ctrl-label" style="text-transform:none;margin-bottom:8px">Checkout preview</div>' +
        '<div class="checkout-preview"><div class="checkout-preview-row"><div style="max-width:80%"><div class="text-sm" style="font-weight:500">' + esc(rt.name || 'Shipping rate name') + '</div>' +
          '<div class="muted" style="font-size:12px">' + esc(rt.description || 'Additional description') + '</div></div>' +
          '<div class="text-sm" style="font-weight:500">' + (Number(rt.price || 0) === 0 ? '<span class="rate-free">Free</span>' : sym + Number(rt.price || 0).toFixed(2)) + '</div></div></div>' +
      '</div>';

    const ctrl = modal({ title: mode === 'edit' ? 'Edit shipping rate' : 'Add shipping rate', width: 640, okText: mode === 'edit' ? 'Done' : 'Add', body,
      onOk: (m, close) => { close(); toast('Shipping rate saved'); } });

    // toggle "More pricing options"
    const tog = ctrl.m.querySelector('[data-act="toggle-cond"]');
    const wrap = ctrl.m.querySelector('[data-cond-wrap]');
    if (tog) tog.onclick = () => {
      const open = wrap.style.display === 'none';
      wrap.style.display = open ? 'block' : 'none';
      tog.textContent = open ? 'Delete conditions' : 'More pricing options';
    };
    // charging-method radio toggle + swap min/max units
    const wireCond = () => ctrl.m.querySelectorAll('[data-radio="cond"]').forEach((el) => el.onclick = () => {
      const val = el.getAttribute('data-val');
      ctrl.m.querySelectorAll('[data-radio="cond"]').forEach((s) => { s.classList.remove('on'); const d = s.querySelector('.proc-radio'); if (d) d.innerHTML = ''; });
      el.classList.add('on'); const dot = el.querySelector('.proc-radio'); if (dot) dot.innerHTML = '<span class="proc-dot"></span>';
      const mm = ctrl.m.querySelector('[data-minmax]');
      if (mm) mm.innerHTML = val === 'weight' ? minMaxBlock('weight', false) : minMaxBlock('price', true);
    });
    wireCond();
  }

  // ===========================================================================
  // MODAL (shared) — mirrors the orders prototype modal
  // ===========================================================================
  function modal({ title, body, width, okText, onOk, extraLeft, onExtra, danger, hideCancel, okStyle }) {
    const backdrop = h('<div class="modal-backdrop"></div>');
    const m = h('<div class="modal"></div>');
    if (width) m.style.width = width + 'px';
    m.style.maxWidth = 'calc(100vw - 24px)';
    m.innerHTML =
      '<div class="modal-head flex items-center justify-between"><span>' + esc(title) + '</span>' +
        '<span class="drawer-x" data-x style="cursor:pointer">' + I.x + '</span></div>' +
      '<div class="modal-body" style="max-height:70vh;overflow:auto">' + body + '</div>' +
      '<div class="modal-foot" style="justify-content:' + (extraLeft ? 'space-between' : 'flex-end') + '">' +
        (extraLeft || '') +
        '<div class="flex gap-2">' + (hideCancel ? '' : '<button class="btn btn-default" data-cancel>Cancel</button>') +
        '<button class="btn ' + (danger || okStyle ? '' : 'btn-primary') + '" ' + (danger ? 'style="background:var(--err);color:#fff"' : (okStyle ? 'style="' + okStyle + '"' : '')) + ' data-ok>' + (okText || 'Save') + '</button></div></div>';
    backdrop.appendChild(m); document.body.appendChild(backdrop);
    const close = () => backdrop.remove();
    m.querySelector('[data-x]').onclick = close;
    const cancelBtn = m.querySelector('[data-cancel]'); if (cancelBtn) cancelBtn.onclick = close;
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
    m.querySelector('[data-ok]').onclick = () => onOk(m, close);
    // submit on Enter from a text input (textarea / Shift+Enter keep newline behavior)
    m.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && e.target && e.target.tagName === 'INPUT') {
        e.preventDefault();
        const okBtn = m.querySelector('[data-ok]');
        if (okBtn) okBtn.click();
      }
    });
    const disc = m.querySelector('[data-disc]'); if (disc && onExtra) disc.onclick = () => onExtra(m, close);
    // generic radio/checkbox visual toggles inside modal (skip ones wired by caller)
    m.querySelectorAll('.set-radio:not([data-radio]), .set-radio2').forEach((el) => el.onclick = () => {
      const grp = el.parentElement;
      grp.querySelectorAll('.set-radio, .set-radio2').forEach((s) => { s.classList.remove('on'); const d = s.querySelector('.proc-radio'); if (d) d.innerHTML = ''; });
      el.classList.add('on'); const dot = el.querySelector('.proc-radio'); if (dot) dot.innerHTML = '<span class="proc-dot"></span>';
    });
    return { m, close };
  }

  // ===========================================================================
  // ROUTER  (SPA: shell passes `rest` = the part after #/settings/)
  // sub-page ids: base | payments | currency | metafields |
  //   shippable-locations | shipping-rates. Deeper segments pre-seed drill state.
  // ===========================================================================
  // ===========================================================================
  // V1.129 Staff and permissions — Roles + Staff (replaces the earlier stubs).
  // BestCheckout staff are created in this admin. There is no invite or access-code
  // flow, so accounts are Active or Inactive only. Mock data is module-scoped so
  // the CRUD flows mutate and re-render in place.
  // ===========================================================================
  const ROLE_NAMES = ['Administrator', 'Operations Specialist', 'Customer Service Representative', 'Order Specialist'];
  const PERM_TREE = [
    { title: 'Overview', children: ['View overview'] },
    { title: 'Purchase flows', children: ['Purchase flow list', 'Create purchase flow', 'Edit purchase flow', 'Publish purchase flow'] },
    { title: 'Checkout pages', children: ['Page list', 'Create page', 'Edit page'] },
    { title: 'Bundles', children: ['Bundle list', 'Create bundle', 'Edit bundle'] },
    { title: 'Subscriptions', children: ['Subscription list', 'Create subscription', 'Edit subscription', 'Contract list', 'Contract detail', 'Cancel contract', 'Retry payment'] },
    { title: 'Orders', children: ['Order list', 'Order detail', 'Refund', 'Note'] },
    { title: 'Settings', children: ['Shopify connection', 'Checkout domain', 'Payment services', 'Ad data', 'Email notifications', 'Roles', 'Staff'] },
  ];
  const ALL_LEAVES = PERM_TREE.reduce((a, p) => a.concat(p.children), []);
  let rolesData = [
    { role: 'Administrator', desc: 'Full access to all features and settings', members: 2, perms: ALL_LEAVES.slice() },
    { role: 'Operations Specialist', desc: 'Manages purchase flows, checkout pages, and orders', members: 1, perms: ['Purchase flow list', 'Create purchase flow', 'Edit purchase flow', 'Publish purchase flow', 'Page list', 'Create page', 'Edit page', 'Bundle list', 'Create bundle', 'Edit bundle', 'Order list', 'Order detail'] },
    { role: 'Customer Service Representative', desc: 'Handles order questions and refunds', members: 1, perms: ['Order list', 'Order detail', 'Note', 'Refund'] },
    { role: 'Order Specialist', desc: '', members: 1, perms: ['Order list', 'Order detail', 'Note'] },
  ];
  let staffData = [
    { email: 'zhangsan@gmail.com', role: ['Administrator'], name: 'Zhang San', status: 'Active' },
    { email: 'lisi@gmail.com', role: ['Operations Specialist'], name: 'Li Si', status: 'Inactive' },
    { email: 'wangwu@gmail.com', role: ['Customer Service Representative'], name: 'Wang Wu', status: 'Active' },
    { email: 'liuma@gmail.com', role: ['Order Specialist'], name: 'Liu Ma', status: 'Active' },
    { email: 'chenliu@gmail.com', role: ['Administrator'], name: 'Chen Liu', status: 'Inactive' },
  ];
  const STAFF_PILL = { 'Active': 'pill-green', 'Inactive': 'pill-gray' };
  const ALL_STATUSES = ['Active', 'Inactive'];

  // inline svgs scoped to these pages
  const SP_X = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  const SP_CARET = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  const SP_CHEVR = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

  const SP_STYLES = `
  .sp-wrap { width: 100%; max-width: none; margin: 0; }
  .sp-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
  .sp-sub { color: var(--ink-muted); font-size: 13px; margin-top: 4px; }
  .sp-actions { display: flex; align-items: center; gap: 10px; flex: none; }
  .sp-card { border: 1px solid var(--hair); border-radius: 12px; overflow: visible; background: #fff; }
  .sp-filter { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--hair); }
  .sp-search { display: flex; align-items: center; height: 36px; border: 1px solid var(--ctl); border-radius: 8px; overflow: hidden; background: #fff; }
  .sp-search .lbl { display: flex; align-items: center; height: 100%; padding: 0 12px; font-size: 13px; font-weight: 600; color: var(--ink); background: var(--panel); border-right: 1px solid var(--hair); }
  .sp-search input { height: 100%; min-width: 240px; padding: 0 12px; border: 0; outline: 0; font-size: 13px; color: var(--ink); background: transparent; }
  .sp-search .ui-select { border: 0 !important; border-right: 1px solid var(--hair) !important; border-radius: 0 !important; height: 100%; background: var(--panel); min-width: 92px; }
  .sp-field-sel { min-width: 92px; }
  .sp-dd { position: relative; }
  .sp-dd-btn { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 12px; border: 1px solid var(--ctl); border-radius: 8px; background: #fff; font-size: 13px; color: var(--ink); cursor: pointer; }
  .sp-dd-btn svg { color: var(--ink-muted); }
  .sp-dd-menu { position: absolute; top: 42px; left: 0; min-width: 200px; background: #fff; border: 1px solid var(--hair); border-radius: 8px; box-shadow: var(--float-shadow); padding: 6px; z-index: 50; }
  .sp-dd-menu[hidden] { display: none; }
  .sp-opt { display: flex; align-items: center; gap: 9px; padding: 7px 8px; border-radius: 6px; font-size: 13px; color: var(--ink-body); cursor: pointer; }
  .sp-opt:hover { background: var(--panel); }
  .sp-opt input { width: 15px; height: 15px; accent-color: var(--brand); }
  .sp-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 16px; }
  .sp-chips:not(:empty) { padding: 12px 16px 2px; }
  .sp-chip { display: inline-flex; align-items: center; gap: 8px; padding: 5px 10px; border-radius: 6px; background: #eef2ff; color: #33415c; font-size: 12.5px; }
  .sp-chip button { display: inline-flex; border: 0; background: none; color: #7587b0; cursor: pointer; padding: 0; }
  .sp-ellip { display: inline-block; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: bottom; }
  .sp-foot { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid var(--hair); }
  .sp-empty { padding: 56px 0; text-align: center; color: var(--ink-muted); font-size: 13px; }
  .sp-icon-btn { display: inline-grid; place-items: center; width: 30px; height: 30px; border-radius: 7px; border: 0; background: transparent; color: var(--ink-muted); cursor: pointer; }
  .sp-icon-btn:hover { background: var(--panel); color: var(--ink); }
  .sp-icon-btn.danger:hover { color: var(--err); }
  /* modal form fields */
  .sp-field { margin-bottom: 16px; }
  .sp-label { display: block; margin-bottom: 7px; font-size: 13.5px; font-weight: 600; color: #2f3542; }
  .sp-input-wrap { position: relative; }
  .sp-input { width: 100%; height: 42px; padding: 0 54px 0 14px; border: 1px solid var(--ctl); border-radius: 6px; font-size: 14px; color: var(--ink); box-sizing: border-box; outline: none; }
  .sp-input:focus { border-color: var(--brand); box-shadow: 0 0 0 2px rgb(0 102 230 / 8%); }
  .sp-input.err { border-color: var(--err); }
  .sp-input[disabled] { background: var(--panel); color: var(--ink-muted); }
  .sp-cnt { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--ink-muted); }
  .sp-err { margin-top: 6px; color: var(--err); font-size: 13px; }
  .sp-err:empty { display: none; }
  /* permission tree */
  .perm-tree { border: 1px solid var(--hair); border-radius: 8px; padding: 6px 6px; max-height: 280px; overflow: auto; }
  .perm-row { display: flex; align-items: center; gap: 4px; padding: 3px 6px; }
  .perm-caret { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; padding: 0; border: 0; background: none; color: var(--ink-muted); cursor: pointer; transition: transform .12s; flex: none; }
  .perm-caret.open { transform: rotate(90deg); }
  .perm-children { padding-left: 30px; padding-bottom: 4px; display: flex; flex-direction: column; }
  .perm-children[hidden] { display: none; }
  .chk { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink-body); cursor: pointer; padding: 4px 0; }
  .chk input { width: 15px; height: 15px; accent-color: var(--brand); cursor: pointer; flex: none; }
  /* role multi-select */
  .sp-ms-box { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 42px; padding: 6px 12px; border: 1px solid var(--ctl); border-radius: 6px; cursor: pointer; }
  .sp-ms-box.err { border-color: var(--err); }
  .sp-ms-ph { color: var(--ink-muted); font-size: 14px; }
  .sp-ms-val { display: flex; flex-wrap: wrap; gap: 6px; }
  .sp-ms-tag { background: #f0f1f3; border-radius: 4px; padding: 2px 8px; font-size: 13px; color: var(--ink); }
  .sp-ms { position: relative; }
  .sp-ms-list { position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 30; background: #fff; border: 1px solid var(--hair); border-radius: 8px; padding: 4px; box-shadow: 0 8px 24px rgba(15,23,42,.12); max-height: 220px; overflow: auto; }
  .sp-ms-list[hidden] { display: none; }
  .sp-ms-list .chk { display: flex; width: 100%; padding: 7px 10px; border-radius: 6px; box-sizing: border-box; }
  .sp-ms-list .chk:hover { background: #f5f6f8; }
  /* radio (Active/Inactive) */
  .sp-radio { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--ink-body); cursor: pointer; margin-right: 28px; }
  .sp-radio input { width: 15px; height: 15px; accent-color: var(--brand); }
  `;

  function spPager() {
    return '<div class="pg"><button class="pg-item" disabled>&lsaquo;</button><button class="pg-item active">1</button><button class="pg-item" disabled>&rsaquo;</button><span class="muted" style="margin-left:8px;font-size:13px">20 / page</span></div>';
  }

  // ---- permission tree (Add/Edit role) ----
  function permTreeHtml(checked) {
    checked = checked || [];
    const cset = new Set(checked);
    return '<div class="perm-tree">' + PERM_TREE.map((p, i) => {
      const childCount = p.children.filter((c) => cset.has(c)).length;
      const allOn = childCount === p.children.length;
      const kids = p.children.map((c) =>
        '<label class="chk"><input type="checkbox" data-leaf="' + esc(c) + '" data-parent="' + i + '"' + (cset.has(c) ? ' checked' : '') + '/><span>' + esc(c) + '</span></label>'
      ).join('');
      return '<div class="perm-node">' +
        '<div class="perm-row"><button type="button" class="perm-caret" data-caret="' + i + '">' + SP_CHEVR + '</button>' +
          '<label class="chk"><input type="checkbox" data-grp="' + i + '"' + (allOn ? ' checked' : '') + '/><span style="font-weight:600">' + esc(p.title) + '</span></label></div>' +
        '<div class="perm-children" data-children="' + i + '" hidden>' + kids + '</div>' +
      '</div>';
    }).join('') + '</div>';
  }
  function wirePermTree(m) {
    m.querySelectorAll('[data-caret]').forEach((btn) => {
      btn.onclick = () => {
        const i = btn.getAttribute('data-caret');
        const kids = m.querySelector('[data-children="' + i + '"]');
        const open = kids.hasAttribute('hidden');
        if (open) kids.removeAttribute('hidden'); else kids.setAttribute('hidden', '');
        btn.classList.toggle('open', open);
      };
    });
    const syncGroup = (i) => {
      const grp = m.querySelector('[data-grp="' + i + '"]');
      const kids = Array.from(m.querySelectorAll('[data-parent="' + i + '"]'));
      const on = kids.filter((k) => k.checked).length;
      grp.checked = on === kids.length && on > 0;
      grp.indeterminate = on > 0 && on < kids.length;
    };
    m.querySelectorAll('[data-grp]').forEach((grp) => {
      grp.onclick = () => {
        const i = grp.getAttribute('data-grp');
        m.querySelectorAll('[data-parent="' + i + '"]').forEach((k) => { k.checked = grp.checked; });
        grp.indeterminate = false;
      };
    });
    m.querySelectorAll('[data-leaf]').forEach((leaf) => {
      leaf.addEventListener('change', () => syncGroup(leaf.getAttribute('data-parent')));
    });
    PERM_TREE.forEach((p, i) => syncGroup(i));
  }
  function collectPerms(m) {
    return Array.from(m.querySelectorAll('[data-leaf]:checked')).map((c) => c.getAttribute('data-leaf'));
  }
  function wireCounter(m, id) {
    const inp = m.querySelector('#' + id), cnt = m.querySelector('#' + id + '-cnt');
    const upd = () => { if (cnt) cnt.textContent = inp.value.length + '/100'; };
    inp.addEventListener('input', upd); upd();
  }

  // ---- role multi-select (Add/Edit staff) ----
  function roleSelectHtml(selected) {
    selected = selected || [];
    const box = selected.length
      ? '<div class="sp-ms-val">' + selected.map((r) => '<span class="sp-ms-tag">' + esc(r) + '</span>').join('') + '</div>'
      : '<span class="sp-ms-ph">Select role</span>';
    const opts = ROLE_NAMES.map((r) => '<label class="chk"><input type="checkbox" data-role value="' + esc(r) + '"' + (selected.indexOf(r) >= 0 ? ' checked' : '') + '/><span>' + esc(r) + '</span></label>').join('');
    return '<div class="sp-ms"><div class="sp-ms-box" data-ms-box>' + box + '<span style="color:var(--ink-muted);flex:none">' + SP_CARET + '</span></div>' +
      '<div class="sp-ms-list" data-ms-list hidden>' + opts + '</div></div>';
  }
  function wireRoleSelect(m) {
    const box = m.querySelector('[data-ms-box]'), list = m.querySelector('[data-ms-list]');
    const toggle = () => { if (list.hasAttribute('hidden')) list.removeAttribute('hidden'); else list.setAttribute('hidden', ''); };
    box.onclick = toggle;
    m.addEventListener('click', (e) => { if (!e.target.closest('.sp-ms')) list.setAttribute('hidden', ''); });
    const redraw = () => {
      const sel = collectRoles(m);
      box.innerHTML = (sel.length
        ? '<div class="sp-ms-val">' + sel.map((r) => '<span class="sp-ms-tag">' + esc(r) + '</span>').join('') + '</div>'
        : '<span class="sp-ms-ph">Select role</span>') + '<span style="color:var(--ink-muted);flex:none">' + SP_CARET + '</span>';
      box.onclick = toggle;
    };
    m.querySelectorAll('[data-role]').forEach((c) => c.addEventListener('change', redraw));
  }
  function collectRoles(m) { return Array.from(m.querySelectorAll('[data-role]:checked')).map((c) => c.value); }
  function setErr(m, key, msg) {
    const el = m.querySelector('[data-err="' + key + '"]'); if (el) el.textContent = msg || '';
  }

  // ===================== ROLES =====================
  let roleQuery = '';
  function roleRowsHtml() {
    const list = rolesData.filter((r) => !roleQuery || r.role.toLowerCase().indexOf(roleQuery.toLowerCase()) >= 0);
    if (!list.length) return '<tr><td colspan="4"><div class="sp-empty">No data</div></td></tr>';
    return list.map((r) => {
      const desc = r.desc ? '<span class="sp-ellip" title="' + esc(r.desc) + '">' + esc(r.desc) + '</span>' : '<span class="muted">- -</span>';
      return '<tr data-role="' + esc(r.role) + '">' +
        '<td style="font-weight:500;color:var(--ink)">' + esc(r.role) + '</td>' +
        '<td class="muted">' + desc + '</td>' +
        '<td>' + r.members + '</td>' +
        '<td><div class="flex" style="gap:2px"><button class="sp-icon-btn" data-edit title="Edit">' + I.pencil + '</button><button class="sp-icon-btn danger" data-del title="Delete">' + I.trash + '</button></div></td>' +
      '</tr>';
    }).join('');
  }
  function refreshRoles(scope) {
    scope.querySelector('#sp-rbody').innerHTML = roleRowsHtml();
    scope.querySelector('#sp-rchips').innerHTML = roleQuery
      ? '<span class="sp-chip">Role: ' + esc(roleQuery) + ' <button data-clear>' + SP_X + '</button></span>' : '';
    wireRoleRows(scope);
  }
  function wireRoleRows(scope) {
    scope.querySelectorAll('#sp-rbody [data-edit]').forEach((b) => b.onclick = (e) => { e.stopPropagation(); openRoleModal(b.closest('tr').getAttribute('data-role')); });
    scope.querySelectorAll('#sp-rbody [data-del]').forEach((b) => b.onclick = (e) => { e.stopPropagation(); deleteRole(b.closest('tr').getAttribute('data-role')); });
    const clear = scope.querySelector('#sp-rchips [data-clear]');
    if (clear) clear.onclick = () => { roleQuery = ''; scope.querySelector('#sp-role-q').value = ''; refreshRoles(scope); };
  }
  function renderRoles() {
    paint('<style>' + SP_STYLES + '</style>' +
      '<div class="sp-wrap">' +
        '<div class="sp-head"><div><div class="page-title">Roles</div><div class="sp-sub">Manage staff roles and access permissions</div></div>' +
          '<button class="btn btn-primary" data-add>Add role</button></div>' +
        '<div class="sp-card">' +
          '<div class="sp-filter"><div class="sp-search"><span class="lbl">Role</span><input id="sp-role-q" placeholder="Search" value="' + esc(roleQuery) + '"/></div></div>' +
          '<div class="sp-chips" id="sp-rchips"></div>' +
          '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Role</th><th>Description</th><th style="width:120px">Member</th><th style="width:120px">Action</th></tr></thead><tbody id="sp-rbody"></tbody></table></div>' +
          '<div class="sp-foot"><span class="muted">Total ' + rolesData.length + ' records</span>' + spPager() + '</div>' +
        '</div>' +
      '</div>', false);
    const scope = root;
    refreshRoles(scope);
    scope.querySelector('[data-add]').onclick = () => openRoleModal(null);
    const q = scope.querySelector('#sp-role-q');
    q.addEventListener('input', () => { roleQuery = q.value.trim(); refreshRoles(scope); q.focus(); });
  }
  function openRoleModal(roleName) {
    const existing = roleName ? rolesData.find((r) => r.role === roleName) : null;
    const body =
      '<div class="sp-field"><label class="sp-label">Role</label><div class="sp-input-wrap"><input id="r-name" class="sp-input" maxlength="100" placeholder="Example: Order Specialist" value="' + esc(existing ? existing.role : '') + '"/><span class="sp-cnt" id="r-name-cnt">0/100</span></div><div class="sp-err" data-err="r-name"></div></div>' +
      '<div class="sp-field"><label class="sp-label">Description</label><div class="sp-input-wrap"><input id="r-desc" class="sp-input" maxlength="100" placeholder="Example: Handles order questions and refunds" value="' + esc(existing ? existing.desc : '') + '"/><span class="sp-cnt" id="r-desc-cnt">0/100</span></div></div>' +
      '<div class="sp-field"><label class="sp-label">Permission</label>' + permTreeHtml(existing ? existing.perms : []) + '<div class="sp-err" data-err="perm"></div></div>';
    const ref = modal({
      title: existing ? 'Edit role' : 'Add role', width: 560, okText: existing ? 'Update' : 'Add', body,
      onOk: (m, close) => {
        const name = m.querySelector('#r-name').value.trim();
        const desc = m.querySelector('#r-desc').value.trim();
        const perms = collectPerms(m);
        setErr(m, 'r-name', ''); setErr(m, 'perm', ''); m.querySelector('#r-name').classList.remove('err');
        let ok = true;
        if (!name) { setErr(m, 'r-name', 'Please enter role'); m.querySelector('#r-name').classList.add('err'); ok = false; }
        else if (rolesData.some((r) => r.role.toLowerCase() === name.toLowerCase() && (!existing || r.role !== existing.role))) { setErr(m, 'r-name', 'Role already exist'); m.querySelector('#r-name').classList.add('err'); ok = false; }
        if (!perms.length) { setErr(m, 'perm', 'Please select permission'); ok = false; }
        if (!ok) return;
        if (existing) { existing.role = name; existing.desc = desc; existing.perms = perms; toast('Updated successfully'); }
        else { rolesData.push({ role: name, desc, members: 0, perms }); toast('Added successfully'); }
        close(); renderRoles();
      },
    });
    wireCounter(ref.m, 'r-name'); wireCounter(ref.m, 'r-desc'); wirePermTree(ref.m);
  }
  function deleteRole(roleName) {
    const r = rolesData.find((x) => x.role === roleName);
    confirm({
      title: 'Confirm to delete?', okText: 'Confirm', danger: true,
      content: 'Once deleted, the data cannot be retrieved. Please confirm before proceeding!',
      onOk: () => {
        if (r && r.members > 0) { toast('Failed to delete. This role is currently in use'); return; }
        rolesData = rolesData.filter((x) => x.role !== roleName);
        toast('Deleted successfully'); renderRoles();
      },
    });
  }

  // ===================== STAFF =====================
  let staffField = 'Email', staffQuery = '', staffStatuses = [];
  function staffMatch(s) {
    if (staffStatuses.length && staffStatuses.indexOf(s.status) < 0) return false;
    if (!staffQuery) return true;
    const q = staffQuery.toLowerCase();
    const val = staffField === 'Email' ? s.email : staffField === 'Name' ? s.name : s.role.join(', ');
    return String(val).toLowerCase().indexOf(q) >= 0;
  }
  function staffActions() {
    return '<button class="sp-icon-btn" data-edit title="Edit">' + I.pencil + '</button>' +
      '<button class="sp-icon-btn danger" data-del title="Delete">' + I.trash + '</button>';
  }
  function staffRowsHtml() {
    const list = staffData.filter(staffMatch);
    if (!list.length) return '<tr><td colspan="5"><div class="sp-empty">No data</div></td></tr>';
    return list.map((s) => {
      const roleTxt = s.role.length ? s.role.join(', ') : '- -';
      const name = s.name ? esc(s.name) : '<span class="muted">- -</span>';
      return '<tr data-email="' + esc(s.email) + '">' +
        '<td>' + esc(s.email) + '</td>' +
        '<td><span class="sp-ellip" title="' + esc(roleTxt) + '">' + esc(roleTxt) + '</span></td>' +
        '<td>' + name + '</td>' +
        '<td><span class="pill ' + STAFF_PILL[s.status] + '"><span class="dot"></span>' + s.status + '</span></td>' +
        '<td><div class="flex" style="gap:2px">' + staffActions() + '</div></td>' +
      '</tr>';
    }).join('');
  }
  function staffChipsHtml() {
    let chips = '';
    if (staffQuery) chips += '<span class="sp-chip">' + staffField + ': ' + esc(staffQuery) + ' <button data-clear-q>' + SP_X + '</button></span>';
    if (staffStatuses.length) chips += '<span class="sp-chip">Status: ' + staffStatuses.join(', ') + ' <button data-clear-s>' + SP_X + '</button></span>';
    return chips;
  }
  function refreshStaff(scope) {
    scope.querySelector('#sp-sbody').innerHTML = staffRowsHtml();
    scope.querySelector('#sp-schips').innerHTML = staffChipsHtml();
    wireStaffRows(scope);
    const cq = scope.querySelector('#sp-schips [data-clear-q]'); if (cq) cq.onclick = () => { staffQuery = ''; scope.querySelector('#sp-staff-q').value = ''; refreshStaff(scope); };
    const cs = scope.querySelector('#sp-schips [data-clear-s]'); if (cs) cs.onclick = () => { staffStatuses = []; if (scope.querySelector('#sp-status-menu')) scope.querySelectorAll('#sp-status-menu input').forEach((x) => { x.checked = false; }); refreshStaff(scope); };
  }
  function wireStaffRows(scope) {
    scope.querySelectorAll('#sp-sbody [data-edit]').forEach((b) => b.onclick = (e) => { e.stopPropagation(); openStaffModal('edit', b.closest('tr').getAttribute('data-email')); });
    scope.querySelectorAll('#sp-sbody [data-del]').forEach((b) => b.onclick = (e) => { e.stopPropagation(); deleteStaff(b.closest('tr').getAttribute('data-email')); });
  }
  function renderStaff() {
    paint('<style>' + SP_STYLES + '</style>' +
      '<div class="sp-wrap">' +
        '<div class="sp-head"><div><div class="page-title">Staff</div><div class="sp-sub">Add team members in BestCheckout and manage their access.</div></div>' +
          '<div class="sp-actions"><button class="btn btn-primary" data-add>Add staff</button></div></div>' +
        '<div class="sp-card">' +
          '<div class="sp-filter">' +
            '<div class="sp-search"><select id="sp-field" class="filter-select sp-field-sel"><option>Email</option><option>Role</option><option>Name</option></select><input id="sp-staff-q" placeholder="Search"/></div>' +
            '<div class="sp-dd"><button class="sp-dd-btn" id="sp-status-btn">Status' + SP_CARET + '</button><div class="sp-dd-menu" id="sp-status-menu" hidden></div></div>' +
          '</div>' +
          '<div class="sp-chips" id="sp-schips"></div>' +
          '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Email</th><th style="width:230px">Role</th><th style="width:130px">Name</th><th style="width:150px">Status</th><th style="width:110px">Action</th></tr></thead><tbody id="sp-sbody"></tbody></table></div>' +
          '<div class="sp-foot"><span class="muted">Total ' + staffData.length + ' records</span>' + spPager() + '</div>' +
        '</div>' +
      '</div>', false);
    const scope = root;
    refreshStaff(scope);
    scope.querySelector('[data-add]').onclick = () => openStaffModal('add');
    const fsel = scope.querySelector('#sp-field');
    fsel.addEventListener('change', () => { staffField = fsel.value; if (staffQuery) refreshStaff(scope); });
    const q = scope.querySelector('#sp-staff-q');
    q.value = staffQuery;
    q.addEventListener('input', () => { staffQuery = q.value.trim(); refreshStaff(scope); q.focus(); });
    const sbtn = scope.querySelector('#sp-status-btn'), smenu = scope.querySelector('#sp-status-menu');
    smenu.innerHTML = ALL_STATUSES.map((st) => '<label class="sp-opt"><input type="checkbox" value="' + st + '"' + (staffStatuses.indexOf(st) >= 0 ? ' checked' : '') + '/><span>' + st + '</span></label>').join('');
    sbtn.onclick = (e) => { e.stopPropagation(); smenu.hidden = !smenu.hidden; };
    smenu.querySelectorAll('input').forEach((c) => c.addEventListener('change', () => {
      staffStatuses = Array.from(smenu.querySelectorAll('input:checked')).map((x) => x.value);
      refreshStaff(scope);
    }));
    if (!root.__spMenuClose) {
      root.__spMenuClose = true;
      document.addEventListener('mousedown', (e) => {
        const dd = root.querySelector('.sp-dd');
        const menu = root.querySelector('#sp-status-menu');
        if (menu && dd && !dd.contains(e.target)) menu.hidden = true;
      });
    }
  }
  function openStaffModal(mode, email) {
    const s = email ? staffData.find((x) => x.email === email) : null;
    const isAdd = mode === 'add';
    const title = isAdd ? 'Add staff' : 'Edit staff';
    const emailField = isAdd
      ? '<div class="sp-field"><label class="sp-label">Email</label><div class="sp-input-wrap"><input id="s-email" class="sp-input" maxlength="100" placeholder="Example: name@example.com"/><span class="sp-cnt" id="s-email-cnt">0/100</span></div><div class="sp-err" data-err="s-email"></div></div>'
      : '<div class="sp-field"><label class="sp-label">Email</label><input class="sp-input" disabled value="' + esc(s.email) + '"/></div>';
    const selectedRoles = isAdd ? [] : s.role.slice();
    const roleField = '<div class="sp-field"><label class="sp-label">Role</label>' + roleSelectHtml(selectedRoles) + '<div class="sp-err" data-err="s-role"></div></div>';
    const nameField = '<div class="sp-field"><label class="sp-label">Name</label><div class="sp-input-wrap"><input id="s-name" class="sp-input" maxlength="100" placeholder="Please enter full name. Example: John Smith" value="' + esc(s ? s.name : '') + '"/><span class="sp-cnt" id="s-name-cnt">0/100</span></div><div class="sp-err" data-err="s-name"></div></div>';
    const currentStatus = s ? s.status : 'Active';
    const statusField = '<div class="sp-field"><label class="sp-label">Status</label><div style="display:flex;align-items:center"><label class="sp-radio"><input type="radio" name="s-status" value="Active"' + (currentStatus === 'Active' ? ' checked' : '') + '/> Active</label><label class="sp-radio"><input type="radio" name="s-status" value="Inactive"' + (currentStatus !== 'Active' ? ' checked' : '') + '/> Inactive</label></div></div>';
    const body = emailField + roleField + nameField + statusField;
    const ref = modal({
      title, width: 560, okText: isAdd ? 'Add' : 'Update', body,
      onOk: (m, close) => {
        const roles = collectRoles(m);
        setErr(m, 's-role', ''); setErr(m, 's-email', ''); setErr(m, 's-name', '');
        let ok = true;
        let emailVal = s ? s.email : '';
        const nameEl = m.querySelector('#s-name');
        nameEl.classList.remove('err');
        if (isAdd) {
          const emailEl = m.querySelector('#s-email');
          emailEl.classList.remove('err');
          emailVal = emailEl.value.trim();
          if (!emailVal) { setErr(m, 's-email', 'Please enter email'); emailEl.classList.add('err'); ok = false; }
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { setErr(m, 's-email', 'The email you entered is invalid'); emailEl.classList.add('err'); ok = false; }
          else if (staffData.some((x) => x.email.toLowerCase() === emailVal.toLowerCase())) { setErr(m, 's-email', 'Email already exist'); emailEl.classList.add('err'); ok = false; }
        }
        const name = nameEl.value.trim();
        if (!name) { setErr(m, 's-name', 'Please enter name'); nameEl.classList.add('err'); ok = false; }
        if (!roles.length) { setErr(m, 's-role', 'Please select role'); ok = false; }
        if (!ok) return;
        const status = (m.querySelector('input[name="s-status"]:checked') || { value: 'Active' }).value;
        if (isAdd) {
          staffData.unshift({ email: emailVal, role: roles, name, status });
          toast('Add staff successfully');
        } else {
          s.role = roles; s.name = name; s.status = status;
          toast('Update staff successfully');
        }
        close(); renderStaff();
      },
    });
    wireRoleSelect(ref.m);
    if (ref.m.querySelector('#s-email-cnt')) wireCounter(ref.m, 's-email');
    wireCounter(ref.m, 's-name');
  }
  function deleteStaff(email) {
    confirm({
      title: 'Confirm to delete?', okText: 'Confirm', danger: true,
      content: 'Once deleted, the data cannot be retrieved. Please confirm before proceeding!',
      onOk: () => { staffData = staffData.filter((x) => x.email !== email); toast('Deleted successfully'); renderStaff(); },
    });
  }

  // ===========================================================================
  // V1.139 Self-service · DOMAINS  (Settings → Domains)
  //   System (free) domain is auto-connected at provisioning and not deletable.
  //   Custom domains: 3-step Add wizard (input → configure DNS → bound) with
  //   automatic DNS detection + automatic SSL (issue & auto-renew). State machine
  //   per PRD §6.2: pending_verification → ssl_pending → connected (dns_error /
  //   ssl_failed are the failure branches). Mock data is module-scoped and now
  //   carries one domain in EVERY status (connected / redirecting / redirectable /
  //   pending_verification / dns_error / ssl_pending / ssl_failed / system) so a dev
  //   can see each state → available-action mapping at a glance (PRD §6.3).
  // ===========================================================================
  let domainsData = [
    { domain: 'www.nutrofuels.com',         type: 'custom', primary: true,  status: 'connected',            redirectTo: null },
    { domain: 'nutrofuels.com',             type: 'custom', primary: false, status: 'connected',            redirectTo: 'www.nutrofuels.com' },
    { domain: 'nutrofuels.shop',            type: 'custom', primary: false, status: 'connected',            redirectTo: null },
    { domain: 'shop.nutrofuels.io',         type: 'custom', primary: false, status: 'pending_verification', redirectTo: null },
    { domain: 'go.nutrofuels.io',           type: 'custom', primary: false, status: 'dns_error',            redirectTo: null },
    { domain: 'checkout.nutrofuels.io',     type: 'custom', primary: false, status: 'ssl_pending',          redirectTo: null },
    { domain: 'promo.nutrofuels.io',        type: 'custom', primary: false, status: 'ssl_failed',           redirectTo: null },
    { domain: 'nutrofuels.stores.bestshopio.com', type: 'system', primary: false, status: 'connected',      redirectTo: null },
  ];
  // BestCheckout has one buyer-facing checkout address per Shopify store. It is
  // deliberately separate from the storefront's primary / redirect domains.
  const shopifyDomain = D.shopifyConnection || {
    storeName: 'Lavender Labs',
    myshopifyDomain: 'lavender-labs.myshopify.com',
    primaryDomain: 'lavenderlabs.co',
    primaryDomainSyncedAt: 'Just now',
  };
  let checkoutDomain = {
    platform: 'lavender-labs.stores.bestcheckout.com/checkout',
    custom: 'checkout.' + shopifyDomain.primaryDomain,
    status: 'not_connected',
    provider: '',
    verificationMode: '',
    verificationAttempt: 0,
    isChecking: false,
  };
  let domainStep = null;   // null = list · 'add' = configure DNS · 'bound' = success (set by show())
  let pendingDomain = '';  // domain being added through the wizard
  let domainVerifyFailed = false; // wizard: first "Verify now" shows the DNS-not-detected state, retry succeeds

  const DOMAIN_BADGE = {
    connected:            { cls: 'pill-green',  label: 'Connected' },
    not_connected:        { cls: 'pill-gray',   label: 'Not connected' },
    provisioning:         { cls: 'pill-blue',   label: 'Setting up' },
    pending_verification: { cls: 'pill-orange', label: 'Pending verification' },
    dns_error:            { cls: 'pill-red',    label: 'DNS error' },
    ssl_pending:          { cls: 'pill-blue',   label: 'SSL pending' },
    ssl_failed:           { cls: 'pill-red',    label: 'SSL failed' },
  };
  const PLATFORM_IP = '76.223.54.18';
  const PLATFORM_CNAME = 'connect.bestcheckout.com';
  const DNS_PROVIDER_META = {
    GoDaddy: {
      color: '#00a4a6',
      ink: '#111111',
      host: 'sso.godaddy.com',
      loginTitle: 'Sign in to GoDaddy',
      button: 'Sign in',
    },
    Cloudflare: {
      color: '#f6821f',
      ink: '#1d1f20',
      host: 'dash.cloudflare.com',
      loginTitle: 'Log in to Cloudflare',
      button: 'Log in',
    },
    Namecheap: {
      color: '#de3723',
      ink: '#1a1a1a',
      host: 'ap.www.namecheap.com',
      loginTitle: 'Sign in to Namecheap',
      button: 'Sign in',
    },
  };
  let dnsProviderLoggedIn = {};

  const DOMAIN_STYLES = `
  .dom-wrap { width: 100%; max-width: none; margin: 0; }
  .dom-list { border: 1px solid var(--hair); border-radius: 12px; overflow: hidden; background: #fff; }
  .dom-row { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-bottom: 1px solid var(--hair); }
  .dom-row:last-child { border-bottom: none; }
  .dom-ico { width: 36px; height: 36px; border-radius: 8px; background: #eef2ff; color: var(--brand); display: grid; place-items: center; flex: none; }
  .dom-info { flex: 1; min-width: 0; }
  .dom-name { font-weight: 600; font-size: 14px; color: var(--ink); }
  .dom-meta { color: var(--ink-muted); font-size: 12.5px; margin-top: 3px; }
  .dom-meta a { color: var(--brand); cursor: pointer; }
  .dom-actions { display: flex; align-items: center; gap: 14px; flex: none; }
  .dom-link { color: var(--ink-muted); font-size: 13px; font-weight: 500; cursor: pointer; background: none; border: 0; }
  .dom-link:hover { color: var(--ink); }
  .dom-link.danger { color: var(--err); }
  /* add-domain wizard */
  .dstep { display: flex; align-items: center; gap: 10px; margin: 4px 0 24px; font-size: 13px; color: var(--ink-muted); }
  .dstep .sp { display: flex; align-items: center; gap: 8px; }
  .dstep .sn { width: 22px; height: 22px; border-radius: 50%; background: var(--panel); color: var(--ink-muted); display: grid; place-items: center; font-size: 12px; font-weight: 700; }
  .dstep .sp.on .sn { background: var(--brand); color: #fff; }
  .dstep .sp.on { color: var(--ink); font-weight: 600; }
  .dstep .sp.ok .sn { background: #2bb673; color: #fff; }
  .dstep .ln { width: 30px; height: 1px; background: var(--hair); }
  .dns-tbl { border: 1px solid var(--hair); border-radius: 8px; overflow: hidden; }
  .dns-tr { display: grid; grid-template-columns: 96px 90px 1fr 86px; align-items: center; border-bottom: 1px solid var(--hair); }
  .dns-tr:last-child { border-bottom: none; }
  .dns-th { background: var(--panel); font-size: 11px; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; letter-spacing: .4px; }
  .dns-cell { padding: 11px 14px; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dns-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .dns-copy { font-size: 12px; font-weight: 600; color: var(--brand); border: 1px solid var(--ctl); background: #fff; border-radius: 6px; padding: 5px 10px; cursor: pointer; }
  .ssl-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-muted); margin-top: 16px; }
  .ssl-spin { width: 13px; height: 13px; border: 2px solid var(--brand); border-top-color: transparent; border-radius: 50%; animation: dsp .7s linear infinite; }
  @keyframes dsp { to { transform: rotate(360deg); } }
  .dns-fail { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 12px 14px; border-radius: 8px; background: #fdecea; color: #b3261e; font-size: 13px; line-height: 1.5; }
  .dns-fail svg { width: 16px; height: 16px; flex: none; margin-top: 1px; }
  .dbound { text-align: center; padding: 30px 20px 12px; }
  .dbound .ck { width: 60px; height: 60px; border-radius: 50%; background: #e7f7ee; color: #2bb673; display: grid; place-items: center; margin: 0 auto 16px; }
  .dbinding { min-height: 190px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .dbinding .ssl-spin { width: 34px; height: 34px; border-width: 3px; margin: 0 auto 18px; }
  /* modal form fields (Connect domain) — same look as the Roles/Staff modal inputs */
  .sp-field { margin-bottom: 16px; }
  .sp-label { display: block; margin-bottom: 7px; font-size: 13.5px; font-weight: 600; color: #2f3542; }
  .sp-input-wrap { position: relative; }
  .sp-input { width: 100%; height: 42px; padding: 0 14px; border: 1px solid var(--ctl); border-radius: 6px; font-size: 14px; color: var(--ink); box-sizing: border-box; outline: none; background: #fff; }
  .sp-input::placeholder { color: var(--ink-muted); }
  .sp-input:focus { border-color: var(--brand); box-shadow: 0 0 0 2px rgb(0 102 230 / 8%); }
  .sp-input.err { border-color: var(--err); }
  .sp-err { margin-top: 6px; color: var(--err); font-size: 13px; }
  .sp-err:empty { display: none; }
  @media (max-width: 720px) { .dns-tr { grid-template-columns: 1fr; } .dns-th { display: none; } .dns-cell { border-bottom: 1px solid var(--hair); } .dom-row { flex-wrap: wrap; } }
  `;

  function domainMetaLine(d) {
    if (d.type === 'system') return 'Free store domain · always available';
    if (d.primary) return 'Primary domain';
    if (d.status === 'connected') {
      return d.redirectTo
        ? 'Redirects to ' + esc(d.redirectTo) + ' · <a data-primary="' + esc(d.domain) + '">Set as primary</a>'
        : '<a data-primary="' + esc(d.domain) + '">Set as primary</a> · <a data-redirect="' + esc(d.domain) + '">Redirect</a>';
    }
    if (d.status === 'pending_verification' || d.status === 'dns_error') {
      const msg = d.status === 'dns_error' ? 'DNS records not detected yet' : 'Waiting for DNS records';
      return msg + ' · <a data-verify="' + esc(d.domain) + '">Verify now</a> · <a data-guide="' + esc(d.domain) + '">View guide</a>';
    }
    if (d.status === 'ssl_pending') return 'DNS verified · issuing SSL certificate…';
    if (d.status === 'ssl_failed') return 'SSL issuance failed · <a data-verify="' + esc(d.domain) + '">Retry</a>';
    return '';
  }
  function domainRowHtml(d) {
    const badge = DOMAIN_BADGE[d.status] || { cls: 'pill-gray', label: d.status };
    const sslSuffix = (d.primary && d.status === 'connected') ? ' · SSL active' : '';
    // Primary + system domains are not deletable — you must set another domain as primary first (PRD §6.3).
    const del = (d.type === 'system' || d.primary) ? '' : '<button class="dom-link danger" data-del="' + esc(d.domain) + '">Delete</button>';
    return '<div class="dom-row">' +
        '<div class="dom-ico">' + I.globe + '</div>' +
        '<div class="dom-info"><div class="dom-name">' + esc(d.domain) + '</div>' +
          '<div class="dom-meta">' + domainMetaLine(d) + '</div></div>' +
        '<div class="dom-actions"><span class="pill ' + badge.cls + '"><span class="dot"></span>' + badge.label + sslSuffix + '</span>' + del + '</div>' +
      '</div>';
  }
  function renderCheckoutDomainExperience() {
    const customBadge = DOMAIN_BADGE[checkoutDomain.status] || DOMAIN_BADGE.not_connected;
    const flowMode = checkoutDomain.verificationMode || (checkoutDomain.provider === 'Manual DNS' ? 'manual' : 'automatic');
    const setupCopy = checkoutDomain.status === 'connected'
      ? 'Your branded address is active and SSL is managed automatically.'
      : checkoutDomain.status === 'pending_verification'
        ? 'DNS is being prepared. Your default checkout address stays available while BestCheckout verifies the record.'
        : checkoutDomain.status === 'dns_error'
          ? 'BestCheckout could not confirm the DNS record yet. Retry the DNS step when you are ready.'
          : checkoutDomain.status === 'ssl_pending'
            ? 'DNS is verified. BestCheckout is issuing SSL for your branded checkout address.'
            : checkoutDomain.status === 'ssl_failed'
              ? 'DNS is verified, but SSL could not be issued yet. Retry SSL to start issuance again.'
              : 'Connect a supported provider to create the DNS record automatically, or add one CNAME yourself.';
    const statusProgress = checkoutDomain.status === 'pending_verification'
      ? '<div class="domain-progress"><span class="ssl-spin"></span><div><strong>' + (flowMode === 'automatic' ? 'Checking public DNS record' : 'Waiting for DNS records') + '</strong><br/>' + (flowMode === 'automatic' ? esc(checkoutDomain.provider || 'Your DNS provider') + ' already wrote the CNAME. BestCheckout is confirming it for ' + esc(checkoutDomain.custom) + '.' : 'Add the CNAME record, then return here to verify the connection.') + '</div><div class="domain-progress-actions">' + (flowMode === 'manual' ? '<button class="btn btn-primary" data-resume-domain>Verify now</button>' : '<button class="btn btn-primary" data-resume-domain>Continue verification</button>') + '</div></div>'
      : checkoutDomain.status === 'dns_error'
        ? '<div class="domain-progress is-error"><span>' + I.info + '</span><div><strong>DNS record not found</strong><br/>We could not find this DNS record yet. Check the record details, then verify again.</div><div class="domain-progress-actions"><button class="btn btn-primary" data-resume-domain>Retry DNS</button></div></div>'
        : checkoutDomain.status === 'ssl_pending'
          ? '<div class="domain-progress"><span class="ssl-spin"></span><div><strong>SSL certificate is being issued</strong><br/>DNS is verified. BestCheckout is securing ' + esc(checkoutDomain.custom) + ' now.</div></div>'
          : checkoutDomain.status === 'ssl_failed'
            ? '<div class="domain-progress is-error"><span>' + I.info + '</span><div><strong>DNS verified, SSL needs attention</strong><br/>The DNS record is resolving, but SSL could not be issued yet. Retry to start SSL issuance again.</div><div class="domain-progress-actions"><button class="btn btn-primary" data-resume-domain>Retry SSL</button></div></div>'
            : '';
    let setupPath = checkoutDomain.status === 'connected'
      ? ''
      : checkoutDomain.status !== 'not_connected'
        ? statusProgress
        : '<div class="domain-path-grid">' +
            '<article class="domain-path domain-path-primary"><div class="domain-path-head"><span class="domain-path-icon">' + I.globe + '</span><div><strong>Automatic setup</strong><small>Recommended · no DNS record to copy</small></div><span class="domain-recommended">Recommended</span></div><p>Authorize your DNS provider once. BestCheckout writes this checkout CNAME, then provisions SSL.</p><div class="domain-provider-list"><span>GoDaddy</span><span>Cloudflare</span><span>Namecheap</span></div><button class="btn btn-primary" type="button" data-open-auto-domain>Connect DNS provider</button></article>' +
            '<article class="domain-path"><div class="domain-path-head"><span class="domain-path-icon domain-path-icon-muted">' + I.info + '</span><div><strong>Manual setup</strong><small>Add one CNAME record</small></div></div><p>Add one CNAME record yourself. BestCheckout verifies it and provisions SSL once the record is found.</p><button class="btn btn-gray" data-open-manual-domain>Show CNAME record</button></article>' +
          '</div>';
    const sslAssurance = '<style>.domain-ssl-assurance{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:13px 14px;border:1px solid #dce5f5;border-radius:8px;background:#f7f9fc;color:var(--ink-body)}.domain-ssl-assurance>span{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#e8f6ee;color:#16875b;flex:none}.domain-ssl-assurance svg{width:14px;height:14px}.domain-ssl-assurance strong{display:block;color:var(--ink);font-size:13px;line-height:1.4}.domain-ssl-assurance p{margin:3px 0 0;color:var(--ink-muted);font-size:12.5px;line-height:1.5}</style><aside class="domain-ssl-assurance"><span>' + I.check + '</span><div><strong>SSL is automatic</strong><p>BestCheckout automatically issues and renews the SSL certificate for every checkout domain. You never need to manage a certificate or server.</p></div></aside>';
    setupPath += sslAssurance;
    paint(
      '<style>' + DOMAIN_STYLES +
        '.domain-stack{display:flex;flex-direction:column;gap:16px}.domain-stack>.flex:first-child{margin-bottom:0}.domain-card{border:1px solid var(--hair);border-radius:12px;background:#fff;padding:20px}.domain-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.domain-card-main{display:flex;gap:12px;min-width:0;flex:1}.domain-card-actions{display:flex;align-items:center;gap:8px;flex:none;white-space:nowrap}.domain-card-actions .pill,.domain-card-actions .btn{flex:none;white-space:nowrap}.domain-card-icon{width:40px;height:40px;border-radius:10px;background:#eef3ff;color:var(--brand);display:grid;place-items:center;flex:none}.domain-card-icon.is-default{background:#edf8f2;color:#16875b}.domain-eyebrow{font-size:12px;font-weight:650;color:var(--ink-muted);margin-bottom:5px}.domain-address{font-size:16px;line-height:1.4;font-weight:650;color:var(--ink);overflow-wrap:anywhere}.domain-note{font-size:12.5px;line-height:1.55;color:var(--ink-muted);margin-top:5px}.domain-scope-note{font-size:12px;line-height:1.5;color:var(--ink-muted);margin-top:6px}.domain-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px;padding-top:15px;border-top:1px solid var(--hair)}.domain-fact small{display:block;color:var(--ink-muted);font-size:11px;margin-bottom:4px}.domain-fact strong{display:block;color:var(--ink-body);font-size:13px;font-weight:600;line-height:1.45;overflow-wrap:anywhere}.domain-path-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.domain-path{position:relative;display:flex;min-height:222px;flex-direction:column;border:1px solid var(--hair);border-radius:10px;padding:16px;background:#fff}.domain-path-primary{border-color:#b9d2ff;background:#fbfdff}.domain-path-head{display:flex;align-items:flex-start;gap:10px}.domain-path-icon{width:32px;height:32px;display:grid;place-items:center;border-radius:8px;background:#eaf2ff;color:var(--brand);flex:none}.domain-path-icon-muted{background:#f2f4f7;color:var(--ink-muted)}.domain-path-head strong{display:block;color:var(--ink);font-size:14px;line-height:1.35}.domain-path-head small{display:block;color:var(--ink-muted);font-size:12px;margin-top:2px;line-height:1.4}.domain-recommended{margin-left:auto;border-radius:999px;background:#eaf2ff;color:var(--brand);font-size:10.5px;font-weight:650;padding:3px 7px;white-space:nowrap}.domain-path p{color:var(--ink-muted);font-size:12.5px;line-height:1.55;margin:13px 0}.domain-path .btn{margin-top:auto;align-self:flex-start}.domain-provider-list{display:flex;flex-wrap:wrap;gap:6px;margin:-2px 0 14px}.domain-provider-list span{border:1px solid #dce5f5;border-radius:5px;background:#fff;color:var(--ink-body);font-size:11.5px;font-weight:600;padding:4px 7px}.domain-progress{display:flex;align-items:flex-start;gap:10px;margin-top:18px;padding:13px;border:1px solid #c9d9f7;border-radius:8px;background:#f7faff;color:var(--ink-body);font-size:12.5px;line-height:1.55}.domain-progress.is-error{align-items:center;border-color:#fecaca;background:#fff7f7;color:#a13b2b}.domain-progress>span{color:var(--brand);display:inline-flex;flex:none}.domain-progress.is-error>span{color:#b42318}.domain-progress .ssl-spin{margin-top:3px}.domain-progress-actions{display:flex;align-items:center;gap:8px;margin-left:auto;flex:none;white-space:nowrap}.domain-progress-actions .btn{flex:none;white-space:nowrap}@media(max-width:760px){.domain-card-top{flex-direction:column}.domain-card-actions{width:100%;justify-content:flex-end}.domain-facts,.domain-path-grid{grid-template-columns:1fr}.domain-progress{flex-wrap:wrap}.domain-progress-actions{margin-left:0;width:100%;justify-content:flex-end}}' +
        '</style><div class="dom-wrap domain-stack">' +
        pageHead('Checkout domain', 'Every connected Shopify store receives a secure BestCheckout checkout address. Add your own branded subdomain whenever you are ready.') +
        '<div style="display:flex;align-items:flex-start;gap:11px;margin:0 0 -4px"><span class="domain-card-icon" style="width:32px;height:32px;border-radius:8px">' + I.globe + '</span><div><div style="font-size:14px;font-weight:650;line-height:1.35;color:var(--ink)">Checkout domains</div><div style="margin-top:2px;font-size:12.5px;line-height:1.5;color:var(--ink-muted)">Used on the buyer payment flow. SSL is managed automatically.</div></div></div>' +
        '<section class="domain-card"><div class="domain-card-top"><div class="domain-card-main"><span class="domain-card-icon is-default">' + I.check + '</span><div><div class="domain-eyebrow">Default checkout address</div><div class="domain-address">' + esc(checkoutDomain.platform) + '</div><div class="domain-note">Created automatically when you connect Shopify. Use it immediately for previews and buyer traffic while your branded domain is being prepared.</div></div></div><div class="domain-card-actions"><span class="pill pill-green"><span class="dot"></span>Active · SSL managed</span><button class="btn btn-gray" data-copy-default-domain>Copy</button></div></div><div class="domain-facts"><div class="domain-fact"><small>Used on</small><strong>Checkout · Upsell · Downsell · Thank you</strong></div><div class="domain-fact"><small>SSL</small><strong>Enabled and renewed automatically</strong></div><div class="domain-fact"><small>Fallback</small><strong>Always available if a branded domain is not ready</strong></div></div></section>' +
        '<section class="domain-card"><div class="domain-card-top"><div class="domain-card-main"><span class="domain-card-icon">' + I.globe + '</span><div><div class="domain-eyebrow">Recommended branded checkout address</div><div class="domain-address">' + esc(checkoutDomain.custom) + '</div><div class="domain-note">' + esc(setupCopy) + '</div><div class="domain-scope-note">Your Shopify storefront domain stays unchanged. This only sets the address BestCheckout uses for checkout.</div></div></div><div class="domain-card-actions"><span class="pill ' + customBadge.cls + '"><span class="dot"></span>' + customBadge.label + (checkoutDomain.status === 'connected' ? ' · SSL active' : '') + '</span><button class="btn btn-gray" data-edit-custom-domain>Edit subdomain</button></div></div>' + setupPath + '</section>' +
      '</div>',
      false
    );
    root.querySelector('[data-copy-default-domain]').onclick = () => copyCheckoutDomain(checkoutDomain.platform);
    root.querySelectorAll('[data-edit-custom-domain]').forEach((el) => el.onclick = openSuggestedDomainModal);
    const auto = root.querySelector('[data-open-auto-domain]'); if (auto) auto.onclick = openDnsProviderModal;
    const manual = root.querySelector('[data-open-manual-domain]'); if (manual) manual.onclick = () => openCheckoutDomainFlow('manual');
    root.querySelectorAll('[data-resume-domain]').forEach((el) => el.onclick = () => openCheckoutDomainFlow(flowMode));
  }

  function renderEmailSendingDomains() {
    const n = D.notifications, sender = n.sender, profile = sender.profile;
    const active = nfActiveDomain();
    const senderAddressFor = (d) => (d.default ? sender.platformLocalPart : profile.localPart) + '@' + d.domain;
    const emailStyles = '<style>' + DOMAIN_STYLES + '.email-sending-shell{display:flex;flex-direction:column;gap:16px}.email-sending-intro{display:flex;gap:10px;align-items:flex-start;padding:13px 14px;border:1px solid #dce5f5;border-radius:9px;background:#f7f9fc;color:var(--ink-body);font-size:12.5px;line-height:1.55}.email-sending-intro svg{width:17px;height:17px;flex:none;color:var(--brand);margin-top:1px}.email-sending-list{display:flex;flex-direction:column;gap:12px}.email-sending-card{border:1px solid var(--hair);border-radius:12px;background:#fff;overflow:hidden}.email-sending-card.is-active{border-color:#b9d2ff}.email-sending-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:18px 20px}.email-sending-card-main{display:flex;gap:12px;min-width:0}.email-sending-icon{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;background:#eef3ff;color:var(--brand);flex:none}.email-sending-icon.is-active{background:#e9f8ef;color:#16875b}.email-sending-eyebrow{font-size:11.5px;font-weight:650;color:var(--ink-muted);margin-bottom:4px}.email-sending-domain{font-size:16px;line-height:1.4;font-weight:650;color:var(--ink);overflow-wrap:anywhere}.email-sending-note{font-size:12.5px;line-height:1.5;color:var(--ink-muted);margin-top:4px}.email-sending-status{flex:none}.email-sending-facts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;padding:14px 20px 16px;border-top:1px solid var(--hair);background:#fbfcfe}.email-sending-fact small{display:block;font-size:11px;color:var(--ink-muted);margin-bottom:4px}.email-sending-fact strong{display:block;font-size:13px;line-height:1.45;color:var(--ink-body);font-weight:600;overflow-wrap:anywhere}.email-sending-dns{padding:0 20px 18px}.email-sending-dns-copy{margin:13px 0 12px;font-size:12.5px;line-height:1.5;color:var(--ink-muted)}.email-sending-dns-copy strong{color:var(--ink-body)}.email-sending-actions{display:flex;justify-content:flex-end;gap:8px;padding:0 20px 18px}@media(max-width:720px){.email-sending-card-head{flex-direction:column}.email-sending-facts{grid-template-columns:1fr}.email-sending-actions{justify-content:flex-start;flex-wrap:wrap}.email-sending-dns{padding-left:12px;padding-right:12px}.email-sending-dns .dns-tr{grid-template-columns:1fr}.email-sending-dns .dns-th{display:none}}</style>';
    const domainCard = (d) => {
      const isActive = active && active.id === d.id;
      const isPending = !d.default && d.status === 'pending';
      const isVerified = !d.default && d.status === 'verified';
      const badge = isActive ? '<span class="pill pill-green"><span class="dot"></span>Active sender</span>' : d.default ? '<span class="pill pill-gray"><span class="dot"></span>Platform default</span>' : isVerified ? '<span class="pill pill-green"><span class="dot"></span>Verified</span>' : '<span class="pill pill-orange"><span class="dot"></span>Waiting for DNS</span>';
      const note = isActive ? 'Used for transactional email now.' : d.default ? 'Ready to use at any time as the store fallback sender.' : isVerified ? 'Ready to use as the active sender domain.' : 'Add the verification records before this domain can become active.';
      const records = isPending && (d.records || []).length ? '<div class="email-sending-dns"><div class="email-sending-dns-copy"><strong>Verification records</strong> · Add these at your DNS provider. If BestShopio manages this DNS zone, the records are added automatically.</div><div class="dns-tbl"><div class="dns-tr dns-th"><div class="dns-cell">Type</div><div class="dns-cell">Name</div><div class="dns-cell">Value</div><div class="dns-cell"></div></div>' + (d.records || []).map((r) => '<div class="dns-tr"><div class="dns-cell dns-mono">' + esc(r.type) + '</div><div class="dns-cell dns-mono">' + esc(r.host) + '</div><div class="dns-cell dns-mono">' + esc(r.value) + '</div><div class="dns-cell"><button class="dns-copy" data-copy-email-dns="' + esc(r.type + ' ' + r.host + ' ' + r.value) + '">Copy</button></div></div>').join('') + '</div></div>' : '';
      const actions = isPending ? '<button class="btn btn-default" data-check-email-domain="' + esc(d.id) + '">Check verification</button><button class="btn btn-default" data-remove-email-domain="' + esc(d.id) + '">Remove</button>' : !isActive ? '<button class="btn btn-default" data-use-email-domain="' + esc(d.id) + '">Use as active</button>' + (d.default ? '' : '<button class="btn btn-default" data-remove-email-domain="' + esc(d.id) + '">Remove</button>') : '';
      return '<section class="email-sending-card' + (isActive ? ' is-active' : '') + '"><div class="email-sending-card-head"><div class="email-sending-card-main"><span class="email-sending-icon' + (isActive ? ' is-active' : '') + '">' + (isActive ? I.check : I.globe) + '</span><div><div class="email-sending-eyebrow">' + (d.default ? 'Default sender domain' : 'Branded sender domain') + '</div><div class="email-sending-domain">' + esc(d.domain) + '</div><div class="email-sending-note">' + note + '</div></div></div><div class="email-sending-status">' + badge + '</div></div><div class="email-sending-facts"><div class="email-sending-fact"><small>Sender address</small><strong>' + esc(senderAddressFor(d)) + '</strong></div><div class="email-sending-fact"><small>Applies to</small><strong>All transactional emails</strong></div><div class="email-sending-fact"><small>DNS</small><strong>' + (d.default ? 'Platform managed' : d.dnsManagedByBestShopio ? 'Managed by BestShopio' : 'Managed externally') + '</strong></div></div>' + records + (actions ? '<div class="email-sending-actions">' + actions + '</div>' : '') + '</section>';
    };
    paint(emailStyles + '<div class="dom-wrap email-sending-shell"><div class="flex items-center justify-between mb-4" style="gap:12px"><div class="flex items-center gap-3"><button class="back-btn" data-email-domain-back title="Back">' + I.chevL + '</button><div><div class="page-title" style="font-size:20px">Email sending</div><div class="muted" style="font-size:13px;margin-top:2px">Choose the sender domain for transactional emails. It is separate from your storefront and checkout addresses.</div></div></div><button class="btn btn-primary" data-add-email-domain>Add sending domain</button></div><div class="email-sending-intro">' + I.info + '<div>One sender identity is shared by this store’s transactional emails. The default sender remains available while a branded domain is waiting for verification.</div></div><div class="email-sending-list">' + sender.domains.slice().sort((a, b) => Number(!a.default) - Number(!b.default)).map(domainCard).join('') + '</div></div>', false);
    root.querySelector('[data-email-domain-back]').onclick = () => { location.hash = '#/settings/notifications/sender'; };
    root.querySelector('[data-add-email-domain]').onclick = openEmailSendingDomainModal;
    root.querySelectorAll('[data-copy-email-dns]').forEach((el) => el.onclick = () => { try { navigator.clipboard.writeText(el.getAttribute('data-copy-email-dns')); } catch (e) {} toast('DNS record copied'); });
    root.querySelectorAll('[data-check-email-domain]').forEach((el) => el.onclick = () => { const d = sender.domains.find((x) => x.id === el.getAttribute('data-check-email-domain')); if (!d || d.status !== 'pending') return; d.status = 'verified'; toast('Domain verification updated'); renderEmailSendingDomains(); });
    root.querySelectorAll('[data-use-email-domain]').forEach((el) => el.onclick = () => { const d = sender.domains.find((x) => x.id === el.getAttribute('data-use-email-domain')); if (!d || (!d.default && d.status !== 'verified')) return; sender.activeDomainId = d.id; toast('Active sender domain updated'); renderEmailSendingDomains(); });
    root.querySelectorAll('[data-remove-email-domain]').forEach((el) => el.onclick = () => { const d = sender.domains.find((x) => x.id === el.getAttribute('data-remove-email-domain')); if (!d || d.default) return; if (sender.activeDomainId === d.id) return toast('Choose another active sender domain before removing this one'); modal({ title: 'Remove sending domain?', width: 460, okText: 'Remove domain', body: '<div class="muted" style="font-size:13px;line-height:1.6">The verification for <b>' + esc(d.domain) + '</b> will be deleted. You can add this domain again later if needed.</div>', onOk: (m, close) => { sender.domains = sender.domains.filter((x) => x.id !== d.id); close(); toast('Sending domain removed'); renderEmailSendingDomains(); } }); });
  }

  function openEmailSendingDomainModal(afterAdd) {
    const sender = D.notifications.sender;
    const tx = (text) => window.I18N && typeof window.I18N.t === 'function' ? window.I18N.t(text) : text;
    modal({
      title: 'Add branded sending domain',
      width: 520,
      okText: 'Add domain',
      body: '<div class="muted mb-4" style="font-size:13px;line-height:1.6">' + tx('Use a subdomain such as <b>mail.yourdomain.com</b>. We will show the verification records after you add it.') + '</div><label class="nf-label" for="email-sending-domain-input">Sending domain</label><input class="input" id="email-sending-domain-input" placeholder="mail.yourdomain.com" style="width:100%" />',
      onOk: (m, close) => {
        const domain = ((m.querySelector('#email-sending-domain-input') || {}).value || '')
          .trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        if (!validDomain(domain)) return toast('Enter a valid domain');
        if (sender.domains.some((d) => d.domain === domain)) return toast('This sending domain is already added');
        if (sender.domains.some((d) => !d.default)) return toast('You can add one branded sending domain per store');
        const verificationId = 'brv_' + Date.now().toString(36);
        const token = verificationId.slice(4);
        sender.emailDnsGuideOpen = false;
        sender.domains.push({
          id: 'domain-' + Date.now(),
          domain: domain,
          verificationId: verificationId,
          status: 'pending',
          verificationAttempt: 0,
          dnsManagedByBestShopio: false,
          records: [
            { type: 'CNAME', host: 'br.' + token + '._domainkey', value: 'br.' + token + '.dkim.sender-validation.net' },
            { type: 'TXT', host: '_sender-verification', value: 'sender-verification=' + verificationId },
          ],
        });
        close();
        toast('Verification records are ready');
        (typeof afterAdd === 'function' ? afterAdd : renderEmailSendingDomains)();
      },
    });
  }

  function openEmailDnsProviderModal(domainId) {
    const sender = D.notifications.sender;
    const domain = sender.domains.find((d) => d.id === domainId && !d.default);
    if (!domain) return;
    const option = (name, checked) => '<label class="email-dns-provider-option"><input type="radio" name="email-dns-provider" value="' + name + '"' + (checked ? ' checked' : '') + ' /><span class="email-dns-provider-radio"></span><span><strong>' + name + '</strong><small>Adds only the email verification records for ' + esc(domain.domain) + '.</small></span></label>';
    modal({
      title: 'Connect a DNS provider',
      width: 540,
      okText: 'Connect',
      body: '<style>.email-dns-provider-intro{margin:0 0 14px;color:var(--ink-muted);font-size:13px;line-height:1.55}.email-dns-provider-option{display:flex;align-items:flex-start;gap:10px;margin-top:8px;padding:12px;border:1px solid var(--hair);border-radius:9px;cursor:pointer}.email-dns-provider-option:hover{border-color:#a8c7ff;background:#fbfdff}.email-dns-provider-option input{position:absolute;opacity:0}.email-dns-provider-radio{width:16px;height:16px;flex:none;margin-top:2px;border:1px solid #aeb8c8;border-radius:50%}.email-dns-provider-option input:checked + .email-dns-provider-radio{border:5px solid var(--brand)}.email-dns-provider-option strong{display:block;color:var(--ink);font-size:13.5px}.email-dns-provider-option small{display:block;margin-top:3px;color:var(--ink-muted);font-size:12px;line-height:1.45}</style><p class="email-dns-provider-intro">Choose the provider that manages DNS for <b>' + esc(domain.domain) + '</b>. BestCheckout will add the email verification records after you authorize it.</p>' + option('GoDaddy', true) + option('Cloudflare') + option('Namecheap'),
      onOk: (m, close) => {
        const selected = m.querySelector('input[name="email-dns-provider"]:checked');
        domain.dnsManagedByBestShopio = true;
        domain.dnsProvider = selected ? selected.value : 'GoDaddy';
        close();
        toast('DNS provider connected');
        renderNotifSender();
      },
    });
  }

  function copyCheckoutDomain(value) {
    try { navigator.clipboard.writeText('https://' + value); } catch (e) {}
    toast('Checkout address copied');
  }

  function openSuggestedDomainModal() {
    modal({
      title: 'Set branded checkout domain', width: 520, okText: 'Save',
      body: '<div class="muted" style="font-size:13px;margin-bottom:14px;line-height:1.55">Use a subdomain of your Shopify store domain. We recommend <b>checkout.' + esc(shopifyDomain.primaryDomain) + '</b>.</div><div class="sp-field"><label class="sp-label">Checkout subdomain</label><div class="sp-input-wrap"><input id="branded-checkout-domain" class="sp-input" value="' + esc(checkoutDomain.custom) + '" placeholder="checkout.' + esc(shopifyDomain.primaryDomain) + '"/></div><div class="sp-err" data-err="branded-checkout-domain"></div></div>',
      onOk: (m, close) => {
        const value = (m.querySelector('#branded-checkout-domain').value || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        if (!validDomain(value) || value.split('.').length < 3) { setErr(m, 'branded-checkout-domain', 'Use a subdomain, for example checkout.' + shopifyDomain.primaryDomain); m.querySelector('#branded-checkout-domain').classList.add('err'); return; }
        checkoutDomain.custom = value; checkoutDomain.status = 'not_connected'; checkoutDomain.provider = ''; checkoutDomain.verificationMode = ''; checkoutDomain.verificationAttempt = 0; checkoutDomain.isChecking = false; close(); renderDomainList();
      },
    });
  }

  function openDnsProviderModal() {
    const option = (name, checked) => '<label class="dns-provider-option"><input type="radio" name="dns-provider" value="' + name + '"' + (checked ? ' checked' : '') + '/><span class="dns-provider-radio"></span><span><strong>' + name + '</strong><small>One-time authorization to add only this checkout CNAME.</small></span></label>';
    const current = checkoutDomain.provider && checkoutDomain.provider !== 'Manual DNS' ? checkoutDomain.provider : 'GoDaddy';
    modal({
      title: (checkoutDomain.verificationMode === 'manual' || domainStep === 'manual') ? 'Switch to automatic DNS setup' : 'Connect a DNS provider', width: 560, okText: 'Continue',
      body: '<style>.dns-provider-intro{font-size:13px;line-height:1.55;color:var(--ink-muted);margin-bottom:14px}.dns-provider-domain{padding:10px 12px;margin-bottom:14px;border-radius:8px;background:#f5f8fd;color:var(--ink);font-size:13px}.dns-provider-option{display:flex;align-items:flex-start;gap:10px;padding:12px;border:1px solid var(--hair);border-radius:9px;margin-top:8px;cursor:pointer}.dns-provider-option:hover{border-color:#a8c7ff;background:#fbfdff}.dns-provider-option input{position:absolute;opacity:0}.dns-provider-radio{width:16px;height:16px;margin-top:2px;border:1px solid #aeb8c8;border-radius:50%;flex:none}.dns-provider-option input:checked + .dns-provider-radio{border:5px solid var(--brand)}.dns-provider-option strong{display:block;color:var(--ink);font-size:13.5px}.dns-provider-option small{display:block;margin-top:3px;color:var(--ink-muted);font-size:12px;line-height:1.45}</style><div class="dns-provider-intro">Choose where DNS for <b>' + esc(shopifyDomain.primaryDomain) + '</b> is managed. BestCheckout will add <b>' + esc(checkoutDomain.custom) + '</b> automatically after you authorize the provider.</div><div class="dns-provider-domain">No manual CNAME record is required with a supported provider.</div>' + option('GoDaddy', current === 'GoDaddy') + option('Cloudflare', current === 'Cloudflare') + option('Namecheap', current === 'Namecheap'),
      onOk: (m, close) => {
        const selected = m.querySelector('input[name="dns-provider"]:checked');
        checkoutDomain.provider = selected ? selected.value : 'GoDaddy';
        checkoutDomain.verificationMode = 'automatic';
        checkoutDomain.verificationAttempt = 0;
        checkoutDomain.isChecking = false;
        close();
        location.hash = dnsProviderLoggedIn[checkoutDomain.provider]
          ? '#/settings/domains/provider-authorize'
          : '#/settings/domains/provider-login';
      },
    });
  }

  function dnsProviderInfo(name) {
    return DNS_PROVIDER_META[name] || DNS_PROVIDER_META.GoDaddy;
  }

  function checkoutCnameHost() {
    return (checkoutDomain.custom || 'checkout.yourdomain.com').split('.')[0] || 'checkout';
  }

  function removeDnsProviderOverlay() {
    const el = document.getElementById('bc-dns-provider-overlay');
    if (!el) return;
    if (el._onEsc) document.removeEventListener('keydown', el._onEsc);
    el.remove();
  }

  function cancelDnsProviderAuthorization() {
    removeDnsProviderOverlay();
    location.hash = '#/settings/domains';
    toast('Authorization cancelled. Your checkout domain was not changed.', 'warning');
  }

  function finishDnsProviderAuthorization() {
    checkoutDomain.status = 'pending_verification';
    checkoutDomain.verificationMode = 'automatic';
    checkoutDomain.verificationAttempt = 0;
    checkoutDomain.isChecking = false;
    removeDnsProviderOverlay();
    location.hash = '#/settings/domains/automatic';
  }

  function dnsProviderOverlayBody(step, provider, meta) {
    const host = checkoutCnameHost();
    const domain = checkoutDomain.custom;
    const zone = shopifyDomain.primaryDomain;
    if (step === 'login') {
      return '<div class="bc-dns-prov-brand">' + esc(provider) + '</div>' +
        '<h2 class="bc-dns-prov-title">' + esc(meta.loginTitle) + '</h2>' +
        '<p class="bc-dns-prov-lead">Sign in to authorize a one-time DNS update for <b>' + esc(zone) + '</b>.</p>' +
        '<label class="bc-dns-prov-label" for="bc-dns-email">Account email</label>' +
        '<input id="bc-dns-email" class="bc-dns-prov-input" data-dns-email type="email" autocomplete="username" placeholder="you@example.com"/>' +
        '<div class="bc-dns-prov-err" data-err="dns-email"></div>' +
        '<label class="bc-dns-prov-label" for="bc-dns-password">Account password</label>' +
        '<input id="bc-dns-password" class="bc-dns-prov-input" data-dns-password type="password" autocomplete="current-password" placeholder="Enter password"/>' +
        '<div class="bc-dns-prov-err" data-err="dns-password"></div>' +
        '<p class="bc-dns-prov-hint">Prototype: any email and password will continue.</p>' +
        '<button type="button" class="bc-dns-prov-primary" data-dns-signin>' + esc(meta.button) + '</button>' +
        '<button type="button" class="bc-dns-prov-link" data-dns-skip-login>Already signed in? Continue to authorization</button>';
    }
    if (step === 'authorize') {
      const proxyRow = provider === 'Cloudflare'
        ? '<div class="bc-dns-rec"><span>Proxy</span><strong>DNS only</strong></div>'
        : '';
      const proxyNote = provider === 'Cloudflare'
        ? '<p class="bc-dns-prov-warn">This record must stay DNS only. Do not enable the orange cloud.</p>'
        : '';
      return '<div class="bc-dns-prov-brand">' + esc(provider) + '</div>' +
        '<h2 class="bc-dns-prov-title">Authorize DNS records from BestCheckout</h2>' +
        '<p class="bc-dns-prov-lead">This is a one-time authorization. BestCheckout will not get permission to make later DNS changes.</p>' +
        '<div class="bc-dns-prov-app"><strong>BestCheckout</strong><span>wants to add one checkout CNAME on <b>' + esc(zone) + '</b></span></div>' +
        '<p class="bc-dns-prov-copy">' + esc(provider) + ' will write the following record for <b>' + esc(domain) + '</b>.</p>' +
        '<div class="bc-dns-rec-card">' +
          '<div class="bc-dns-rec"><span>Record type</span><strong>CNAME</strong></div>' +
          '<div class="bc-dns-rec"><span>Host</span><strong>' + esc(host) + '</strong></div>' +
          '<div class="bc-dns-rec"><span>Content</span><strong>' + PLATFORM_CNAME + '</strong></div>' +
          '<div class="bc-dns-rec"><span>TTL</span><strong>Auto</strong></div>' +
          proxyRow +
        '</div>' +
        '<p class="bc-dns-prov-warn">If this host already has a record, authorizing replaces it with this CNAME.</p>' +
        proxyNote +
        '<div class="bc-dns-prov-actions"><button type="button" class="bc-dns-prov-ghost" data-dns-cancel>Cancel</button><button type="button" class="bc-dns-prov-primary" data-dns-authorize>Authorize</button></div>';
    }
    return '<div class="bc-dns-prov-brand">' + esc(provider) + '</div>' +
      '<div class="bc-dns-prov-ok">' + I.check + '</div>' +
      '<h2 class="bc-dns-prov-title">Successfully updated DNS records</h2>' +
      '<p class="bc-dns-prov-lead">The CNAME for <b>' + esc(domain) + '</b> now points to <b>' + PLATFORM_CNAME + '</b>.</p>' +
      '<p class="bc-dns-prov-copy">Close this window to continue verification in BestCheckout. SSL is issued after the public record is found.</p>' +
      '<button type="button" class="bc-dns-prov-primary" data-dns-finish>Close and continue</button>';
  }

  function mountDnsProviderOverlay(step) {
    if (!checkoutDomain.provider || checkoutDomain.provider === 'Manual DNS') checkoutDomain.provider = 'GoDaddy';
    checkoutDomain.verificationMode = 'automatic';
    const provider = checkoutDomain.provider;
    const meta = dnsProviderInfo(provider);
    const host = checkoutCnameHost();
    const url = 'https://' + meta.host + '/domainconnect/v2/domainTemplates/providers/bestcheckout.com/services/checkout-cname?domain=' + encodeURIComponent(shopifyDomain.primaryDomain) + '&host=' + encodeURIComponent(host);
    removeDnsProviderOverlay();
    const overlay = h(
      '<div id="bc-dns-provider-overlay" class="bc-dns-prov-overlay" role="dialog" aria-modal="true" aria-label="' + esc(provider) + ' authorization">' +
        '<style>' +
          '.bc-dns-prov-overlay{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:24px;background:rgb(15 23 42 / 42%)}' +
          '.bc-dns-prov-win{width:min(560px,100%);max-height:min(88vh,760px);display:flex;flex-direction:column;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 24px 60px rgb(15 23 42 / 28%)}' +
          '.bc-dns-prov-chrome{display:flex;align-items:center;gap:10px;padding:8px 12px;background:#eceff3;border-bottom:1px solid #d7dde6}' +
          '.bc-dns-prov-dots{display:flex;gap:5px;flex:none}' +
          '.bc-dns-prov-dots i{width:10px;height:10px;border-radius:50%;background:#c5ccd6}' +
          '.bc-dns-prov-url{min-width:0;flex:1;display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:7px;background:#fff;color:#526072;font-size:12px;line-height:1.3}' +
          '.bc-dns-prov-url span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
          '.bc-dns-prov-x{width:28px;height:28px;border:0;border-radius:6px;background:transparent;color:#526072;cursor:pointer}' +
          '.bc-dns-prov-x:hover{background:#e2e7ee}' +
          '.bc-dns-prov-sim{padding:7px 16px;background:#f6f8fb;color:#5b6573;font-size:11.5px;font-weight:650;letter-spacing:.01em;border-bottom:1px solid #e7ecf2}' +
          '.bc-dns-prov-body{padding:22px 24px 24px;overflow:auto}' +
          '.bc-dns-prov-brand{color:' + meta.color + ';font-size:20px;font-weight:750;letter-spacing:-.03em;line-height:1}' +
          '.bc-dns-prov-title{margin:14px 0 0;color:' + meta.ink + ';font-size:22px;font-weight:700;line-height:1.25}' +
          '.bc-dns-prov-lead,.bc-dns-prov-copy{margin:8px 0 0;color:#526072;font-size:13.5px;line-height:1.55}' +
          '.bc-dns-prov-label{display:block;margin:16px 0 6px;color:' + meta.ink + ';font-size:12.5px;font-weight:650}' +
          '.bc-dns-prov-input{width:100%;height:40px;padding:0 12px;border:1px solid #cfd6e0;border-radius:8px;background:#fff;color:' + meta.ink + ';font-size:14px}' +
          '.bc-dns-prov-input:focus{outline:2px solid ' + meta.color + ';outline-offset:1px;border-color:' + meta.color + '}' +
          '.bc-dns-prov-input.err{border-color:#d92d20}' +
          '.bc-dns-prov-err{min-height:16px;margin-top:5px;color:#d92d20;font-size:12px;line-height:1.4}' +
          '.bc-dns-prov-hint{margin:8px 0 0;color:#6b7380;font-size:12px;line-height:1.45}' +
          '.bc-dns-prov-primary{display:block;width:100%;margin-top:16px;height:42px;border:0;border-radius:8px;background:' + meta.color + ';color:#fff;font-size:14px;font-weight:700;cursor:pointer}' +
          '.bc-dns-prov-primary:hover{filter:brightness(.96)}' +
          '.bc-dns-prov-ghost{height:42px;padding:0 16px;border:1px solid #cfd6e0;border-radius:8px;background:#fff;color:' + meta.ink + ';font-size:14px;font-weight:650;cursor:pointer}' +
          '.bc-dns-prov-link{display:block;width:100%;margin-top:10px;border:0;background:transparent;color:' + meta.color + ';font-size:12.5px;font-weight:650;cursor:pointer;text-align:center}' +
          '.bc-dns-prov-app{display:flex;flex-direction:column;gap:3px;margin-top:16px;padding:12px 13px;border:1px solid #e5eaf1;border-radius:9px;background:#f8fafc}' +
          '.bc-dns-prov-app strong{color:' + meta.ink + ';font-size:14px}' +
          '.bc-dns-prov-app span{color:#526072;font-size:12.5px;line-height:1.45}' +
          '.bc-dns-rec-card{margin-top:14px;border:1px solid #e5eaf1;border-radius:9px;overflow:hidden}' +
          '.bc-dns-rec{display:grid;grid-template-columns:88px 1fr;gap:10px;padding:10px 13px;border-top:1px solid #eef2f7;font-size:13px}' +
          '.bc-dns-rec:first-child{border-top:0}' +
          '.bc-dns-rec span{color:#6b7380}' +
          '.bc-dns-rec strong{color:' + meta.ink + ';font-weight:650;overflow-wrap:anywhere}' +
          '.bc-dns-prov-warn{margin:12px 0 0;padding:10px 12px;border-radius:8px;background:#fff7ed;color:#9a3412;font-size:12.5px;line-height:1.5}' +
          '.bc-dns-prov-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}' +
          '.bc-dns-prov-actions .bc-dns-prov-primary{width:auto;margin-top:0;padding:0 18px}' +
          '.bc-dns-prov-ok{display:grid;place-items:center;width:44px;height:44px;margin-top:8px;border-radius:50%;background:#e8f8ef;color:#16875b}' +
          '@media(max-width:640px){.bc-dns-prov-overlay{padding:0;align-items:end}.bc-dns-prov-win{width:100%;max-height:94vh;border-radius:12px 12px 0 0}.bc-dns-prov-actions{flex-direction:column-reverse}.bc-dns-prov-actions .bc-dns-prov-primary,.bc-dns-prov-ghost{width:100%}}' +
        '</style>' +
        '<div class="bc-dns-prov-win">' +
          '<div class="bc-dns-prov-chrome">' +
            '<span class="bc-dns-prov-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
            '<div class="bc-dns-prov-url"><span>' + I.globe + '</span><span>' + esc(url) + '</span></div>' +
            '<button type="button" class="bc-dns-prov-x" data-dns-close aria-label="Close">' + I.x + '</button>' +
          '</div>' +
          '<div class="bc-dns-prov-sim">Simulated ' + esc(provider) + ' window · prototype</div>' +
          '<div class="bc-dns-prov-body">' + dnsProviderOverlayBody(step, provider, meta) + '</div>' +
        '</div>' +
      '</div>'
    );
    overlay._onEsc = (e) => {
      if (e.key !== 'Escape') return;
      if (step === 'done') finishDnsProviderAuthorization();
      else cancelDnsProviderAuthorization();
    };
    document.addEventListener('keydown', overlay._onEsc);
    overlay.onclick = (e) => {
      if (e.target !== overlay) return;
      if (step === 'done') finishDnsProviderAuthorization();
      else cancelDnsProviderAuthorization();
    };
    const closeBtn = overlay.querySelector('[data-dns-close]');
    if (closeBtn) closeBtn.onclick = () => {
      if (step === 'done') finishDnsProviderAuthorization();
      else cancelDnsProviderAuthorization();
    };
    const signin = overlay.querySelector('[data-dns-signin]');
    if (signin) signin.onclick = () => submitDnsProviderLogin(overlay);
    const skip = overlay.querySelector('[data-dns-skip-login]');
    if (skip) skip.onclick = () => {
      dnsProviderLoggedIn[provider] = true;
      location.hash = '#/settings/domains/provider-authorize';
    };
    const cancel = overlay.querySelector('[data-dns-cancel]');
    if (cancel) cancel.onclick = cancelDnsProviderAuthorization;
    const authorize = overlay.querySelector('[data-dns-authorize]');
    if (authorize) authorize.onclick = () => {
      checkoutDomain.status = 'pending_verification';
      location.hash = '#/settings/domains/provider-done';
    };
    const finish = overlay.querySelector('[data-dns-finish]');
    if (finish) finish.onclick = finishDnsProviderAuthorization;
    overlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || !e.target || e.target.tagName !== 'INPUT') return;
      e.preventDefault();
      if (signin) signin.click();
    });
    document.body.appendChild(overlay);
    const email = overlay.querySelector('[data-dns-email]');
    if (email) email.focus();
  }

  function submitDnsProviderLogin(overlay) {
    const emailInput = overlay.querySelector('[data-dns-email]');
    const passInput = overlay.querySelector('[data-dns-password]');
    const email = ((emailInput || {}).value || '').trim();
    const password = (passInput || {}).value || '';
    setErr(overlay, 'dns-email', '');
    setErr(overlay, 'dns-password', '');
    if (emailInput) emailInput.classList.remove('err');
    if (passInput) passInput.classList.remove('err');
    let blocked = false;
    if (!email) {
      setErr(overlay, 'dns-email', 'Enter your email.');
      if (emailInput) emailInput.classList.add('err');
      blocked = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr(overlay, 'dns-email', 'Enter a valid email.');
      if (emailInput) emailInput.classList.add('err');
      blocked = true;
    }
    if (!password) {
      setErr(overlay, 'dns-password', 'Enter your password.');
      if (passInput) passInput.classList.add('err');
      blocked = true;
    }
    if (blocked) return;
    dnsProviderLoggedIn[checkoutDomain.provider || 'GoDaddy'] = true;
    location.hash = '#/settings/domains/provider-authorize';
  }

  // Both setup paths share the same domain lifecycle. The path only decides who
  // creates the CNAME (BestCheckout or the merchant); DNS/SSL outcomes remain
  // pending_verification → dns_error → ssl_pending → ssl_failed → connected.
  function openCheckoutDomainFlow(mode) {
    checkoutDomain.verificationMode = mode;
    if (mode === 'manual') checkoutDomain.provider = 'Manual DNS';
    location.hash = '#/settings/domains/' + mode;
  }

  function isActiveCheckoutDomainFlow(mode) {
    return location.hash === '#/settings/domains/' + mode;
  }

  function rerenderCheckoutDomainFlow(mode) {
    if (!isActiveCheckoutDomainFlow(mode)) return;
    renderDomains();
    // The flow re-renders after async DNS/SSL jobs finish. Re-apply the runtime
    // locale overlay so loading and error states follow the selected language.
    if (window.I18N && typeof window.I18N.apply === 'function') window.I18N.apply(root);
  }

  // Keep each asynchronous state visible long enough to be understood in the
  // prototype. Production timing is driven by the real DNS and SSL jobs.
  const DOMAIN_DNS_CHECK_DELAY = 2400;
  const DOMAIN_SSL_ISSUANCE_DELAY = 3200;

  function advanceCheckoutDomainVerification(mode) {
    if (checkoutDomain.isChecking || checkoutDomain.status === 'ssl_pending') return;
    checkoutDomain.verificationMode = mode;
    if (mode === 'manual') checkoutDomain.provider = 'Manual DNS';
    checkoutDomain.isChecking = true;
    rerenderCheckoutDomainFlow(mode);

    window.setTimeout(() => {
      checkoutDomain.isChecking = false;
      checkoutDomain.verificationAttempt = (checkoutDomain.verificationAttempt || 0) + 1;
      if (checkoutDomain.verificationAttempt === 1) {
        checkoutDomain.status = 'dns_error';
        rerenderCheckoutDomainFlow(mode);
        return;
      }

      checkoutDomain.status = 'ssl_pending';
      rerenderCheckoutDomainFlow(mode);
      window.setTimeout(() => {
        if (checkoutDomain.verificationAttempt === 2) {
          checkoutDomain.status = 'ssl_failed';
          rerenderCheckoutDomainFlow(mode);
          return;
        }
        checkoutDomain.status = 'connected';
        if (isActiveCheckoutDomainFlow(mode)) {
          location.hash = '#/settings/domains';
          toast('Checkout domain connected · SSL active');
        }
      }, DOMAIN_SSL_ISSUANCE_DELAY);
    }, DOMAIN_DNS_CHECK_DELAY);
  }

  // Matches BestShopio Settings → Domains: verification replaces the setup
  // panel with one centered, non-blocking task state for both DNS and SSL.
  function renderCheckoutDomainBindingScreen(mode) {
    const status = checkoutDomain.status;
    const checkingDns = checkoutDomain.isChecking && status !== 'ssl_failed';
    const isManual = mode === 'manual';
    const title = checkingDns ? 'Checking your DNS records…' : 'Connecting your domain…';
    const copy = checkingDns
      ? 'We\'re checking the records for ' + esc(checkoutDomain.custom) + '.'
      : 'We\'re securing ' + esc(checkoutDomain.custom) + '.';
    const pageTitle = isManual ? 'Set up ' : 'Connect ';
    const pageSubtitle = isManual ? 'Manual DNS setup' : 'Automatic DNS setup with ' + esc(checkoutDomain.provider || 'GoDaddy');
    const steps = isManual
      ? '<span class="sp ok"><span class="sn">' + I.check + '</span>Choose domain</span><span class="ln"></span>' +
          (checkingDns
            ? '<span class="sp on"><span class="sn">2</span>Checking DNS</span><span class="ln"></span><span class="sp"><span class="sn">3</span>Verify</span>'
            : '<span class="sp ok"><span class="sn">' + I.check + '</span>Add DNS record</span><span class="ln"></span><span class="sp on"><span class="sn">3</span>Connecting domain</span>')
      : '<span class="sp ok"><span class="sn">' + I.check + '</span>Choose domain</span><span class="ln"></span><span class="sp ok"><span class="sn">' + I.check + '</span>Connect provider</span><span class="ln"></span><span class="sp on"><span class="sn">3</span>' + (checkingDns ? 'Checking DNS' : 'Connecting domain') + '</span>';
    paint(
      '<style>' + DOMAIN_STYLES + '</style><div class="dom-wrap"><div class="flex items-center gap-3 mb-4"><button class="back-btn" data-domain-back title="Back">' + I.chevL + '</button><div><div class="page-title" style="font-size:20px">' + pageTitle + esc(checkoutDomain.custom) + '</div><div class="muted" style="font-size:13px;margin-top:2px">' + pageSubtitle + '</div></div></div><div class="dstep">' + steps + '</div><section class="panel card-pad"><div class="dbound dbinding"><span class="ssl-spin"></span><div class="page-title" style="font-size:20px">' + title + '</div><div class="muted" style="font-size:13.5px;margin-top:6px;line-height:1.6">' + copy + '</div><div class="muted" style="font-size:13.5px;margin-top:2px;line-height:1.6">This takes just a few seconds.</div><div class="muted" style="font-size:12.5px;margin-top:5px">You can safely leave this page.</div><div style="margin-top:20px"><button class="btn btn-gray" data-domain-back>Verify later</button></div></div></section></div>',
      false
    );
    root.querySelectorAll('[data-domain-back]').forEach((el) => el.onclick = () => { location.hash = '#/settings/domains'; });
  }

  function automaticCnameRecapHtml(provider) {
    const host = checkoutCnameHost();
    return '<div class="dns-tbl" style="margin-top:14px"><div class="dns-tr dns-th"><div class="dns-cell">Type</div><div class="dns-cell">Name</div><div class="dns-cell">Value</div></div><div class="dns-tr"><div class="dns-cell dns-mono">CNAME</div><div class="dns-cell dns-mono">' + esc(host) + '</div><div class="dns-cell dns-mono">' + PLATFORM_CNAME + '</div></div></div><div class="muted" style="font-size:12px;line-height:1.45;margin-top:8px">Written once at ' + esc(provider) + '. Shown here for confirmation only.</div>';
  }

  function renderAutomaticDomainSetup() {
    const provider = checkoutDomain.provider || 'GoDaddy';
    const status = checkoutDomain.status;
    const checking = checkoutDomain.isChecking;
    if (status === 'pending_verification' && !checking) {
      advanceCheckoutDomainVerification('automatic');
      return;
    }
    const pageTitle = (status === 'ssl_pending' || status === 'ssl_failed')
      ? 'Securing ' + esc(checkoutDomain.custom)
      : 'Checking DNS for ' + esc(checkoutDomain.custom);
    const body = checking
      ? '<div class="checkout-domain-verification is-pending"><span class="ssl-spin"></span><div><strong>' + (status === 'ssl_failed' ? 'Restarting SSL issuance' : 'Checking public DNS record') + '</strong><p>' + (status === 'ssl_failed' ? 'BestCheckout is starting SSL issuance again for this verified DNS record.' : 'BestCheckout is confirming the public CNAME for ' + esc(checkoutDomain.custom) + '.') + '</p></div></div>'
      : status === 'dns_error'
        ? '<div class="checkout-domain-verification is-error"><span>' + I.info + '</span><div><strong>DNS record not found</strong><p>BestCheckout could not confirm the public CNAME yet. The record may still be propagating. Retry to check again.</p></div></div>'
        : status === 'ssl_pending'
          ? '<div class="checkout-domain-verification is-pending"><span class="ssl-spin"></span><div><strong>SSL certificate is being issued</strong><p>DNS is verified. BestCheckout is securing ' + esc(checkoutDomain.custom) + ' now.</p></div></div>'
          : status === 'ssl_failed'
            ? '<div class="checkout-domain-verification is-error"><span>' + I.info + '</span><div><strong>DNS verified, SSL needs attention</strong><p>The DNS record is resolving, but SSL could not be issued yet. Retry to start SSL issuance again.</p></div></div>'
            : '<div class="checkout-domain-verification is-pending"><span class="ssl-spin"></span><div><strong>Checking public DNS record</strong><p>BestCheckout is confirming the public CNAME for ' + esc(checkoutDomain.custom) + '.</p></div></div>';
    const action = checking || status === 'ssl_pending'
      ? ''
      : (status === 'dns_error' || status === 'ssl_failed')
        ? '<button class="btn btn-primary" data-verify-automatic-domain>' + (status === 'dns_error' ? 'Retry DNS' : 'Retry SSL') + '</button>'
        : '';
    paint('<style>' + DOMAIN_STYLES + '.checkout-domain-verification{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:12px 13px;border:1px solid var(--hair);border-radius:8px;font-size:12.5px;line-height:1.5}.checkout-domain-verification>span{display:inline-flex;flex:none;margin-top:1px}.checkout-domain-verification .ssl-spin{margin-top:3px}.checkout-domain-verification strong{display:block;font-size:13px}.checkout-domain-verification p{margin:3px 0 0}.checkout-domain-verification.is-error{border-color:#fecaca;background:#fff7f7;color:#a13b2b}.checkout-domain-verification.is-pending{border-color:#c9d9f7;background:#f7faff;color:var(--ink-body)}</style><div class="dom-wrap"><div class="flex items-center gap-3 mb-4"><button class="back-btn" data-domain-back title="Back">' + I.chevL + '</button><div><div class="page-title" style="font-size:20px">' + pageTitle + '</div><div class="muted" style="font-size:13px;margin-top:2px">Automatic DNS setup with ' + esc(provider) + '</div></div></div><div class="dstep"><span class="sp ok"><span class="sn">' + I.check + '</span>Choose domain</span><span class="ln"></span><span class="sp ok"><span class="sn">' + I.check + '</span>Connect provider</span><span class="ln"></span><span class="sp on"><span class="sn">3</span>Verify</span></div><section class="panel card-pad"><div class="card-title">Public DNS record</div><div class="muted" style="font-size:13px;line-height:1.6;margin-top:5px">' + esc(provider) + ' already wrote this CNAME. BestCheckout is confirming the public record, then issuing SSL. Your default checkout address stays available.</div>' + automaticCnameRecapHtml(provider) + body + '<div class="flex justify-end gap-2 mt-4"><button class="btn btn-gray" data-domain-back>Verify later</button>' + action + '</div></section></div>', false);
    root.querySelectorAll('[data-domain-back]').forEach((el) => el.onclick = () => { location.hash = '#/settings/domains'; });
    const verify = root.querySelector('[data-verify-automatic-domain]'); if (verify) verify.onclick = () => advanceCheckoutDomainVerification('automatic');
  }

  function renderManualDomainSetupLegacy() {
    const host = (checkoutDomain.custom || 'checkout.yourdomain.com').split('.')[0] || 'checkout';
    paint('<style>' + DOMAIN_STYLES + '</style><div class="dom-wrap"><div class="flex items-center gap-3 mb-4"><button class="back-btn" data-domain-back title="Back">' + I.chevL + '</button><div><div class="page-title" style="font-size:20px">Set up ' + esc(checkoutDomain.custom) + '</div><div class="muted" style="font-size:13px;margin-top:2px">Manual DNS setup</div></div></div><div class="dstep"><span class="sp ok"><span class="sn">' + I.check + '</span>Choose domain</span><span class="ln"></span><span class="sp on"><span class="sn">2</span>Add DNS record</span><span class="ln"></span><span class="sp"><span class="sn">3</span>Verify</span></div><section class="panel card-pad"><div class="card-title">Add this DNS record at your domain provider</div><div class="muted" style="font-size:13px;line-height:1.55;margin:4px 0 16px">Sign in to where you bought <b>' + esc(shopifyDomain.primaryDomain) + '</b> (e.g. GoDaddy, Namecheap, Alibaba Cloud) and add the record below. BestCheckout detects it automatically.</div><div class="dns-tbl"><div class="dns-tr dns-th"><div class="dns-cell">Type</div><div class="dns-cell">Name</div><div class="dns-cell">Value</div><div class="dns-cell"></div></div><div class="dns-tr"><div class="dns-cell dns-mono">CNAME</div><div class="dns-cell dns-mono">' + esc(host) + '</div><div class="dns-cell dns-mono">' + PLATFORM_CNAME + '</div><div class="dns-cell"><button class="dns-copy" data-copy-manual-domain>Copy</button></div></div></div><div class="ssl-pill"><span class="ssl-spin"></span>After adding the record, click Verify now to check your domain.</div><div class="flex justify-end gap-2 mt-4"><button class="btn btn-gray" data-domain-back>Verify later</button><button class="btn btn-primary" data-finish-manual>Verify now</button></div></section></div>', false);
    root.querySelectorAll('[data-domain-back]').forEach((el) => el.onclick = () => { location.hash = '#/settings/domains'; });
    root.querySelector('[data-copy-manual-domain]').onclick = () => { try { navigator.clipboard.writeText('CNAME ' + host + ' ' + PLATFORM_CNAME); } catch (e) {} toast('CNAME record copied'); };
    addDomainGuideLink(root.querySelector('[data-finish-manual]').parentElement);
    root.querySelector('[data-finish-manual]').onclick = () => { checkoutDomain.provider = 'Manual DNS'; checkoutDomain.status = 'connected'; location.hash = '#/settings/domains'; toast('Checkout domain connected · SSL active'); };
  }

  function renderManualDomainSetup() {
    const host = (checkoutDomain.custom || 'checkout.yourdomain.com').split('.')[0] || 'checkout';
    const status = checkoutDomain.status;
    const checking = checkoutDomain.isChecking;
    if (checking || status === 'ssl_pending') return renderCheckoutDomainBindingScreen('manual');
    const feedback = checking
      ? '<div class="checkout-domain-verification is-pending"><span class="ssl-spin"></span><div><strong>' + (status === 'ssl_failed' ? 'Restarting SSL issuance' : 'Checking DNS records') + '</strong><p>' + (status === 'ssl_failed' ? 'BestCheckout is starting SSL issuance again for this verified DNS record.' : 'BestCheckout is checking the CNAME record before it can issue SSL.') + '</p></div></div>'
      : status === 'dns_error'
      ? '<div class="checkout-domain-verification is-error"><span>' + I.info + '</span><div><strong>DNS record not found</strong><p>We could not find this DNS record yet. Check the record details, then verify again.</p></div></div>'
      : status === 'ssl_pending'
        ? '<div class="checkout-domain-verification is-pending"><span class="ssl-spin"></span><div><strong>SSL certificate is being issued</strong><p>DNS is verified. BestCheckout is securing this checkout address now.</p></div></div>'
        : status === 'ssl_failed'
        ? '<div class="checkout-domain-verification is-error"><span>' + I.info + '</span><div><strong>DNS verified, SSL needs attention</strong><p>The DNS record is resolving, but SSL could not be issued yet. Retry to start SSL issuance again.</p></div></div>'
        : status === 'connected'
          ? '<div class="checkout-domain-verification is-success"><span>' + I.check + '</span><div><strong>Checkout domain connected</strong><p>DNS and SSL are active. Buyers can now use this address securely.</p></div></div>'
        : '<div class="ssl-pill"><span class="ssl-spin"></span>After adding the record, click Verify now to check your domain.</div>';
    const action = status === 'connected'
      ? '<button class="btn btn-primary" data-domain-back>Back to checkout domain</button>'
      : checking || status === 'ssl_pending'
        ? ''
        : '<button class="btn btn-primary" data-verify-manual-domain>' + (status === 'dns_error' ? 'Verify again' : status === 'ssl_failed' ? 'Retry SSL' : 'Verify now') + '</button>';
    const stepThree = status === 'connected'
      ? '<span class="sp ok"><span class="sn">' + I.check + '</span>Verified</span>'
      : '<span class="sp"><span class="sn">3</span>Verify</span>';
    paint(
      '<style>' + DOMAIN_STYLES +
        '.checkout-domain-verification{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:12px 13px;border:1px solid var(--hair);border-radius:8px;font-size:12.5px;line-height:1.5}.checkout-domain-verification>span{display:inline-flex;flex:none;margin-top:1px}.checkout-domain-verification .ssl-spin{margin-top:3px}.checkout-domain-verification strong{display:block;font-size:13px}.checkout-domain-verification p{margin:3px 0 0}.checkout-domain-verification.is-error{border-color:#fecaca;background:#fff7f7;color:#a13b2b}.checkout-domain-verification.is-success{border-color:#b8e6cc;background:#f3fcf6;color:#16794e}.checkout-domain-verification.is-pending{border-color:#c9d9f7;background:#f7faff;color:var(--ink-body)}' +
      '</style><div class="dom-wrap"><div class="flex items-center gap-3 mb-4"><button class="back-btn" data-domain-back title="Back">' + I.chevL + '</button><div><div class="page-title" style="font-size:20px">Set up ' + esc(checkoutDomain.custom) + '</div><div class="muted" style="font-size:13px;margin-top:2px">Manual DNS setup</div></div></div><div class="dstep"><span class="sp ok"><span class="sn">' + I.check + '</span>Choose domain</span><span class="ln"></span><span class="sp on"><span class="sn">2</span>Add DNS record</span><span class="ln"></span>' + stepThree + '</div><section class="panel card-pad"><div class="card-title">Add this DNS record at your domain provider</div><div class="muted" style="font-size:13px;line-height:1.55;margin:4px 0 16px">Sign in to where you bought <b>' + esc(shopifyDomain.primaryDomain) + '</b> (e.g. GoDaddy, Namecheap, Alibaba Cloud) and add the record below. BestCheckout detects it automatically.</div><div class="dns-tbl"><div class="dns-tr dns-th"><div class="dns-cell">Type</div><div class="dns-cell">Name</div><div class="dns-cell">Value</div><div class="dns-cell"></div></div><div class="dns-tr"><div class="dns-cell dns-mono">CNAME</div><div class="dns-cell dns-mono">' + esc(host) + '</div><div class="dns-cell dns-mono">' + PLATFORM_CNAME + '</div><div class="dns-cell"><button class="dns-copy" data-copy-manual-domain>Copy</button></div></div></div>' + feedback + '<div class="flex justify-end gap-2 mt-4">' + (status === 'connected' ? '' : '<button class="btn btn-gray" data-domain-back>Verify later</button>') + action + '</div></section></div>',
      false
    );
    root.querySelectorAll('[data-domain-back]').forEach((el) => el.onclick = () => { location.hash = '#/settings/domains'; });
    root.querySelector('[data-copy-manual-domain]').onclick = () => { try { navigator.clipboard.writeText('CNAME ' + host + ' ' + PLATFORM_CNAME); } catch (e) {} toast('CNAME record copied'); };
    addDomainGuideLink(root.querySelector('[data-verify-manual-domain]')?.parentElement);
    const verify = root.querySelector('[data-verify-manual-domain]'); if (verify) verify.onclick = () => advanceCheckoutDomainVerification('manual');
  }

  function renderDomainList() {
    return renderCheckoutDomainExperience();
    const badge = DOMAIN_BADGE[checkoutDomain.status] || DOMAIN_BADGE.connected;
    paint(
      '<style>' + DOMAIN_STYLES +
        '.checkout-domain-card{border:1px solid var(--hair);border-radius:12px;background:#fff;padding:20px}.checkout-domain-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.checkout-domain-icon{width:40px;height:40px;border-radius:10px;background:#eef3ff;color:var(--brand);display:grid;place-items:center;flex:none}.checkout-domain-eyebrow{font-size:12px;font-weight:600;color:var(--ink-muted);margin-bottom:5px}.checkout-domain-name{font-size:16px;line-height:1.35;font-weight:600;color:var(--ink)}.checkout-domain-note{font-size:12.5px;line-height:1.55;color:var(--ink-muted);margin-top:6px}.checkout-domain-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:20px;padding-top:16px;border-top:1px solid var(--hair)}.checkout-domain-fact{min-width:0}.checkout-domain-fact small{display:block;color:var(--ink-muted);font-size:11px;margin-bottom:4px}.checkout-domain-fact strong{display:block;color:var(--ink-body);font-size:13px;font-weight:600;line-height:1.4}.checkout-domain-assurance{display:flex;gap:10px;align-items:flex-start;margin-top:16px;padding:12px 13px;border-radius:8px;background:#f7f9fc;color:var(--ink-body);font-size:12.5px;line-height:1.55}.checkout-domain-assurance svg{color:var(--brand);width:18px;height:18px;flex:none;margin-top:1px}@media(max-width:720px){.checkout-domain-top{flex-direction:column}.checkout-domain-grid{grid-template-columns:1fr;gap:10px}}' +
        '</style><div class="dom-wrap">' +
        pageHead('Checkout domain', 'Set the secure address buyers see throughout a BestCheckout purchase flow: checkout, Upsell, Downsell, and Thank you pages. Your Shopify storefront domain stays unchanged.',
          '<button class="btn btn-primary domain-change-action" data-add-domain>Change checkout domain</button>') +
        '<section class="checkout-domain-card"><div class="checkout-domain-top"><div class="flex" style="gap:12px"><span class="checkout-domain-icon">' + I.globe + '</span><div><div class="checkout-domain-eyebrow">Checkout address</div><div class="checkout-domain-name">' + esc(checkoutDomain.domain) + '</div><div class="checkout-domain-note">Used throughout each BestCheckout purchase flow.</div></div></div><span class="pill ' + badge.cls + '"><span class="dot"></span><span>' + badge.label + '</span><span> · </span><span>SSL active</span></span></div>' +
          '<div class="checkout-domain-grid"><div class="checkout-domain-fact"><small>Used on</small><strong>Checkout · Upsell · Downsell · Thank you pages</strong></div><div class="checkout-domain-fact"><small>SSL</small><strong>Active · renews automatically</strong></div><div class="checkout-domain-fact"><small>Shopify storefront</small><strong>lavender-labs.myshopify.com</strong></div></div>' +
          '<div class="checkout-domain-assurance">' + I.info + '<span>Your Shopify storefront keeps its current address. This domain is used only for BestCheckout purchase-flow pages: checkout, Upsell, Downsell, and Thank you.</span></div>' +
        '</section>' +
        '<div class="set-note" style="margin-top:18px"><div class="card-title" style="margin-bottom:4px">One domain, one checkout experience</div>' +
          '<div class="muted" style="font-size:12.5px;line-height:1.5">A branded checkout domain helps buyers recognize your store while BestCheckout handles the secure checkout experience.</div></div>' +
      '</div>',
      false
    );
    root.querySelector('[data-add-domain]').onclick = openAddDomainModal;
  }
  function renderAddDomainDNS() {
    const dom = pendingDomain || 'yourdomain.com';
    const host = dom.split('.')[0] || 'checkout';
    paint(
      '<style>' + DOMAIN_STYLES + '</style><div class="dom-wrap">' +
        pageHead('Set checkout domain') +
        '<div class="dstep">' +
          '<span class="sp ok"><span class="sn">' + I.check + '</span>Choose checkout domain</span><span class="ln"></span>' +
          '<span class="sp on"><span class="sn">2</span>Configure DNS</span><span class="ln"></span>' +
          '<span class="sp"><span class="sn">3</span>Ready</span>' +
        '</div>' +
        '<div class="panel card-pad">' +
          '<div class="card-title">Add this DNS record at your domain provider</div>' +
          '<div class="muted" style="font-size:13px;margin:4px 0 16px;line-height:1.5">Sign in to where you bought <b>' + esc(shopifyDomain.primaryDomain) + '</b> (e.g. GoDaddy, Namecheap, Alibaba Cloud) and add the record below. BestCheckout detects it automatically.</div>' +
          '<div class="dns-tbl">' +
            '<div class="dns-tr dns-th"><div class="dns-cell">Type</div><div class="dns-cell">Name</div><div class="dns-cell">Value</div><div class="dns-cell"></div></div>' +
            '<div class="dns-tr"><div class="dns-cell dns-mono">CNAME</div><div class="dns-cell dns-mono">' + esc(host) + '</div><div class="dns-cell dns-mono">' + PLATFORM_CNAME + '</div><div class="dns-cell"><button class="dns-copy" data-copy="' + PLATFORM_CNAME + '">Copy</button></div></div>' +
          '</div>' +
          (domainVerifyFailed
            ? '<div class="dns-fail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg><div><b>We couldn\'t detect your CNAME yet.</b> DNS changes can take up to 30 minutes to take effect. Double-check the record above, then verify again.</div></div>'
            : '<div class="ssl-pill"><span class="ssl-spin"></span>After adding the record, click Verify now to check your domain.</div>') +
          '<div class="flex items-center justify-between" style="margin-top:22px">' +
            '<a class="lnk" data-guide-faq style="font-size:13px;cursor:pointer">Having issues? View the setup guide</a>' +
            '<div class="flex" style="gap:10px"><button class="btn btn-gray" data-verify-later>Verify later</button><button class="btn btn-primary" data-verify-now>' + (domainVerifyFailed ? 'Verify again' : 'Verify now') + '</button></div>' +
          '</div>' +
        '</div>' +
      '</div>',
      false
    );
    root.querySelectorAll('[data-copy]').forEach((b) => b.onclick = () => { try { navigator.clipboard.writeText(b.getAttribute('data-copy')); } catch (e) {} toast('Copied'); });
    root.querySelector('[data-verify-later]').onclick = () => { location.hash = '#/settings/domains'; };
    root.querySelector('[data-verify-now]').onclick = () => {
      if (!domainVerifyFailed) { domainVerifyFailed = true; renderAddDomainDNS(); }    // first check: DNS not propagated yet → show failure state
      else { domainVerifyFailed = false; location.hash = '#/settings/domains/bound'; } // retry: records detected → bound
    };
    root.querySelector('[data-guide-faq]').onclick = () => openDomainGuide();
  }
  function renderAddDomainBound() {
    const dom = pendingDomain || 'yourdomain.com';
    paint(
      '<style>' + DOMAIN_STYLES + '</style><div class="dom-wrap">' +
        pageHead('Set checkout domain') +
        '<div class="dstep">' +
          '<span class="sp ok"><span class="sn">' + I.check + '</span>Choose checkout domain</span><span class="ln"></span>' +
          '<span class="sp ok"><span class="sn">' + I.check + '</span>Configure DNS</span><span class="ln"></span>' +
          '<span class="sp on"><span class="sn">3</span>Ready</span>' +
        '</div>' +
        '<div class="panel card-pad"><div class="dbound">' +
          '<div class="ck"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
          '<div class="page-title" style="font-size:20px"><span>' + esc(dom) + '</span><span> is ready for checkout</span></div>' +
          '<div class="muted" style="font-size:13.5px;margin-top:6px;line-height:1.6">Buyers will use <b>https://' + esc(dom) + '</b> on your BestCheckout checkout, Upsell, Downsell, and Thank you pages. Your Shopify storefront domain is unchanged.</div>' +
          '<div style="color:#2bb673;font-weight:600;font-size:13px;margin-top:8px">SSL active · auto-renews before expiry</div>' +
          '<div style="margin-top:20px"><button class="btn btn-primary" data-back-domains>Back to checkout domain</button></div>' +
        '</div></div>' +
      '</div>',
      false
    );
    root.querySelector('[data-back-domains]').onclick = () => {
      if (pendingDomain) checkoutDomain = { domain: pendingDomain, status: 'connected' };
      pendingDomain = '';
      location.hash = '#/settings/domains';
    };
  }
  function renderDomains() {
    if (domainStep === 'email-sending') { location.hash = '#/settings/notifications/sender-domain'; return; }
    if (domainStep === 'automatic') return renderAutomaticDomainSetup();
    if (domainStep === 'manual') return renderManualDomainSetup();
    if (domainStep === 'add') return renderAddDomainDNS();
    if (domainStep === 'bound') return renderAddDomainBound();
    if (domainStep === 'provider-login' || domainStep === 'provider-authorize' || domainStep === 'provider-done') {
      renderDomainList();
      mountDnsProviderOverlay(domainStep.replace('provider-', ''));
      return;
    }
    return renderDomainList();
  }
  function validDomain(v) {
    return /^(?!www\.)([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(v);
  }
  function openAddDomainModal() {
    modal({
      title: 'Set checkout domain', width: 520, okText: 'Next',
      body:
        '<div class="muted" style="font-size:13px;margin-bottom:14px">Use a subdomain for the buyer checkout, such as <b>checkout.yourdomain.com</b>. Your Shopify storefront domain will not change.</div>' +
        '<div class="sp-field"><label class="sp-label">Checkout domain</label><div class="sp-input-wrap"><input id="add-dom" class="sp-input" placeholder="checkout.yourdomain.com" style="padding-right:14px"/></div><div class="sp-err" data-err="add-dom"></div></div>',
      onOk: (m, close) => {
        const v = (m.querySelector('#add-dom').value || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        setErr(m, 'add-dom', ''); m.querySelector('#add-dom').classList.remove('err');
        if (!v) { setErr(m, 'add-dom', 'Please enter a checkout domain'); m.querySelector('#add-dom').classList.add('err'); return; }
        if (!validDomain(v) || v.split('.').length < 3) { setErr(m, 'add-dom', 'Use a subdomain, for example checkout.yourdomain.com'); m.querySelector('#add-dom').classList.add('err'); return; }
        if (checkoutDomain.domain === v) { setErr(m, 'add-dom', 'This is already your checkout domain'); m.querySelector('#add-dom').classList.add('err'); return; }
        pendingDomain = v; domainVerifyFailed = false; close(); location.hash = '#/settings/domains/add';
      },
    });
  }
  function deleteDomain(dom) {
    confirm({
      title: 'Remove this domain?', okText: 'Remove', danger: true,
      content: 'Customers will no longer reach your store at ' + dom + '. You can re-add it later.',
      onOk: () => { domainsData = domainsData.filter((d) => d.domain !== dom); toast('Domain removed'); renderDomainList(); },
    });
  }
  function setPrimaryDomain(dom) {
    domainsData.forEach((d) => { d.primary = (d.domain === dom); if (d.domain === dom) d.redirectTo = null; });
    toast('Primary domain updated'); renderDomainList();
  }
  // "Redirect" = send this domain's visitors (301) to the primary domain, so every
  // address resolves to one canonical store URL (good for SEO + branding).
  function redirectDomain(dom) {
    const primary = domainsData.find((d) => d.primary);
    if (!primary) { toast('Set a primary domain first'); return; }
    const d = domainsData.find((x) => x.domain === dom);
    if (d) { d.redirectTo = primary.domain; toast('Now redirecting to ' + primary.domain); renderDomainList(); }
  }
  function verifyDomain(dom) {
    const d = domainsData.find((x) => x.domain === dom);
    if (d) { d.status = 'connected'; }
    toast('Domain connected · SSL active'); renderDomainList();
  }
  function addDomainGuideLink(actionRow) {
    if (!actionRow) return;
    const actions = document.createElement('div');
    actions.className = 'flex';
    actions.style.gap = '10px';
    while (actionRow.firstChild) actions.appendChild(actionRow.firstChild);
    const guide = document.createElement('a');
    guide.className = 'lnk';
    guide.href = '#';
    guide.style.cssText = 'font-size:13px;cursor:pointer';
    guide.textContent = 'Having issues? View the setup guide';
    guide.onclick = (event) => { event.preventDefault(); openDomainGuide(); };
    const supportLinks = document.createElement('div');
    supportLinks.className = 'flex';
    supportLinks.style.cssText = 'gap:12px;flex-wrap:wrap';
    supportLinks.append(guide);
    actionRow.style.justifyContent = 'space-between';
    actionRow.style.alignItems = 'center';
    actionRow.style.flexWrap = 'wrap';
    actionRow.append(supportLinks, actions);
    if (window.I18N && window.I18N.apply) window.I18N.apply(supportLinks);
  }

  // "Having issues? View the setup guide" — DNS records recap + troubleshooting.
  function openDomainGuide() {
    const host = (pendingDomain || checkoutDomain.custom || 'checkout.yourdomain.com').split('.')[0] || 'checkout';
    modal({
      title: 'Connecting your checkout domain', width: 580, okText: 'Got it', hideCancel: true,
      body:
        '<div class="muted" style="font-size:13px;margin-bottom:14px;line-height:1.6">At your domain provider (GoDaddy, Namecheap, Alibaba Cloud, …), add this DNS record. We detect it automatically and issue SSL for the checkout domain.</div>' +
        '<div class="dns-tbl" style="margin-bottom:16px">' +
          '<div class="dns-tr dns-th" style="grid-template-columns:96px 90px 1fr"><div class="dns-cell">Type</div><div class="dns-cell">Name</div><div class="dns-cell">Value</div></div>' +
          '<div class="dns-tr" style="grid-template-columns:96px 90px 1fr"><div class="dns-cell dns-mono">CNAME</div><div class="dns-cell dns-mono">' + esc(host) + '</div><div class="dns-cell dns-mono">' + PLATFORM_CNAME + '</div></div>' +
        '</div>' +
        '<div style="font-weight:600;font-size:13.5px;color:var(--ink);margin-bottom:8px">If it isn\'t verifying</div>' +
        '<ul style="margin:0;padding-left:18px;color:var(--ink-body);font-size:13px;line-height:1.75">' +
          '<li>DNS changes can take up to 30 minutes — sometimes a few hours — to take effect. Wait, then verify again.</li>' +
          '<li>Remove any old DNS record on <b>' + esc(host) + '</b> that points elsewhere.</li>' +
          '<li>If your domain is proxied (e.g. Cloudflare), set the records to <b>DNS only</b>, not proxied.</li>' +
          '<li>Copy the values exactly — a typo or trailing dot will fail.</li>' +
        '</ul>',
      onOk: (m, close) => close(),
    });
  }

  // ===========================================================================
  // NOTIFICATIONS (V1.141) — transactional email config, per store.
  //   List (events grouped) -> Editor (left form + live desktop/mobile preview)
  //   + Brand settings (shared tokens). Merge tags + dynamic "blocks" expand in
  //   the preview against sample order data, so the body can't be broken.
  //   sub-state: notifSub = null (list) | 'brand' | <eventCode> (editor)
  // ===========================================================================
  let notifSub = null;
  let notifDevice = 'desktop';
  let notifEditorMode = 'preview';
  let nfInsertTarget = 'nf-template';
  let nfInsertSelection = { id: null, start: null, end: null };

  // sample order data the preview renders against (resolves {{merge.tags}})
  const NF_SAMPLE = {
    'customer.first_name': 'Emma', 'customer.name': 'Emma Johnson',
    'order.number': '1042', 'order.detail_url': '#', 'order.invoice_url': '#', 'order.currency': 'US$', 'order.date': 'June 10, 2026',
    'order.subtotal': 'US$ 174.66', 'order.discount': '-US$ 5.00', 'order.discount_code': 'WELCOME5',
    'order.shipping': 'Free', 'order.shipping_original': 'US$ 8.99', 'order.shipping_discount': '-US$ 8.99', 'order.shipping_discount_code': 'FREESHIP', 'order.tax': 'US$ 0.00',
    'order.total': 'US$ 169.66', 'order.total_paid': 'US$ 84.88', 'order.total_discount': 'US$ 46.59',
    'order.shipping_address': 'Emma Johnson, 2261 Market St, San Francisco, CA 94114, US',
    'order.billing_address': 'Emma Johnson, 2261 Market St, San Francisco, CA 94114, US',
    'order.payment_brand': 'VISA', 'order.shipping_method': 'Standard shipping',
    'order.payment_method': 'Visa ···· 4242',
    'shipment.tracking_number': 'LX123456789CN', 'shipment.carrier': 'YunExpress', 'shipment.tracking_url': '#',
    'refund.amount': 'US$ 84.78',
    'refund.transactions': [
      { method: 'Visa', amount: 'US$ 55.98' },
      { method: 'Visa', amount: 'US$ 28.80' },
    ],
    'checkout.recovery_url': '../hosted-checkout/index.html?token=rcv_1042_demo',
  };
  let nfPreviewEvent = '';
  const NF_ITEMS = [
    {
      kind: 'bundle', name: 'Coffee Office Pack', qty: 1, originalPrice: 'US$ 69.97', price: 'US$ 55.98',
      subscription: { cadence: 'Delivery every 2 months' },
      discounts: [{ label: 'Bundle discount', amount: '-US$ 7.99' }, { label: 'Subscription discount', amount: '-US$ 6.00' }],
      children: [
        { name: 'Signature Blend Coffee 500g', variant: 'Whole bean / 2 Pack', qty: 2 },
        { name: 'Coffee Brew Guide', variant: 'Digital download', qty: 1 },
      ],
    },
    {
      kind: 'bundle', name: 'Focus Gum - Multipack', qty: 1, originalPrice: 'US$ 57.30', price: 'US$ 49.30',
      discounts: [{ label: 'Bundle discount', amount: '-US$ 8.00' }],
      children: [
        { name: 'Neurix Focus & Energy Gum', variant: 'Mint / 12 Pack', qty: 2 },
        { name: 'Neurix Focus & Energy Gum', variant: 'Citrus / 12 Pack', qty: 2 },
      ],
    },
    {
      name: 'Whey Protein 1kg', variant: 'Vanilla / 1kg', qty: 1, originalPrice: 'US$ 39.00', price: 'US$ 31.59',
      subscription: { cadence: 'Delivery every 1 month' },
      discounts: [{ label: 'Subscription discount', amount: '-US$ 3.90' }, { label: 'Product discount', amount: '-US$ 3.51' }],
    },
    { name: 'Daily Multivitamin (60 ct)', variant: '60 capsules', qty: 1, originalPrice: 'US$ 32.00', price: 'US$ 28.80', discounts: [{ label: 'Product discount', amount: '-US$ 3.20' }] },
    { name: 'Stainless Steel Coffee Scoop', variant: '30 ml', qty: 1, price: 'US$ 8.99' },
  ];
  const nfStatusPill = (c) => c.enabled
    ? '<span class="pill pill-green"><span class="dot"></span>On</span>'
    : '<span class="pill pill-gray"><span class="dot"></span>Off</span>';

  function nfFindEvent(code) {
    for (const g of D.notifications.groups) { const e = (g.events || []).find((x) => x.code === code); if (e) return { ev: e, group: g }; }
    return null;
  }
  function nfEditorPath(code, mode) {
    const base = '#/settings/notifications/' + encodeURIComponent(code);
    return mode === 'code' ? base + '/edit' : base;
  }
  function nfVariablePanel(ev) {
    const tx = (text) => window.I18N && typeof window.I18N.t === 'function' ? window.I18N.t(text) : text;
    const isAbandoned = ev.code === 'abandoned_checkout';
    const isOrderEmail = ['checkout_purchase_finalized', 'checkout_refunded', 'abandoned_checkout'].includes(ev.code);
    const item = (token, kind) =>
      '<span class="nf-var-token"><button type="button" class="nf-var-insert" data-insert-token="' + esc(token) + '" data-token-kind="' + kind + '" title="' + tx('Click a variable to insert it at the cursor. Blocks are inserted into the email body.') + '"><code>{{' + esc(token) + '}}</code></button><button type="button" class="nf-var-copy" data-copy-token="' + esc(token) + '" title="' + tx('Copy') + '">' + tx('Copy') + '</button></span>';
    const group = (title, tokens, kind) => tokens.length
      ? '<div class="nf-var-group"><div class="nf-var-group-title">' + tx(title) + '</div><div class="nf-var-token-list">' + tokens.map((token) => item(token, kind)).join('') + '</div></div>'
      : '';
    const orderTokens = ['order.number', 'order.date', 'order.detail_url', 'order.currency'];
    const amountTokens = ['order.subtotal', 'order.discount', 'order.shipping', 'order.tax', 'order.total', 'order.total_paid', 'order.total_discount'];
    const addressTokens = ['order.shipping_address', 'order.billing_address', 'order.payment_brand', 'order.payment_method', 'order.shipping_method'];
    const refundTokens = ev.code === 'checkout_refunded' ? ['refund.amount'] : [];
    const blockTokens = ev.code === 'checkout_refunded'
      ? ['block.refund_summary']
      : isAbandoned
        ? ['block.cta_button', 'block.order_summary']
        : ['block.cta_button', 'block.order_summary', 'block.customer_information'];
    return '<section class="nf-variable-panel"><div class="nf-variable-panel-head"><div><div class="nf-variable-panel-title">' + tx('Available variables') + '</div><div class="nf-variable-panel-copy">' + tx('Click a variable to insert it at the cursor. Blocks are inserted into the email body.') + '</div></div><div class="nf-variable-panel-note">' + tx('Only the variables and blocks listed here are supported.') + '</div></div><div class="nf-variable-grid">' +
      group('Customer', ['customer.first_name', 'customer.name'], 'scalar') +
      group('Store', ['store.name', 'store.url', 'store.contact_email'], 'scalar') +
      group('Checkout', isAbandoned ? ['checkout.recovery_url'] : [], 'scalar') +
      (isOrderEmail ? group('Order', orderTokens, 'scalar') + group('Order amounts', amountTokens, 'scalar') + (isAbandoned ? '' : group('Addresses', addressTokens, 'scalar')) : '') +
      group('Refund', refundTokens, 'scalar') + group('Prebuilt blocks', blockTokens, 'block') +
    '</div></section>';
  }
  const nfSwitch = (on, code) => '<label class="set-switch' + (on ? ' on' : '') + '" data-nf-toggle="' + code + '"><span class="set-knob"></span></label>';
  function nfActiveDomain() {
    const s = D.notifications.sender;
    const active = (s.domains || []).find((d) => d.id === s.activeDomainId);
    return active && (active.status === 'verified' || active.status === 'platform') ? active : null;
  }
  function nfSenderDomain() {
    const s = D.notifications.sender;
    return nfActiveDomain() || (s.domains || []).find((d) => d.default) || (s.domains || [])[0] || null;
  }
  function nfSenderAddress() {
    const s = D.notifications.sender, d = nfSenderDomain();
    const localPart = d && d.default
      ? (s.platformLocalPart || s.profile.localPart || 'orders')
      : (s.profile.localPart || s.platformLocalPart || 'orders');
    return localPart + '@' + (d ? d.domain : '');
  }
  function nfReplyToAddress() {
    const brand = D.notifications.brand || {};
    return D.notifications.sender.profile.replyTo || brand.contactEmail || brand.storeOwnerEmail || nfSenderAddress();
  }
  function nfBuildBody(ev, headline, copy) {
    const opening = '<h2 class="nf-h">' + esc(headline || '') + '</h2><p class="nf-lead">' + esc(copy || '') + '</p>';
    if (ev.code === 'checkout_purchase_finalized') return opening + '{{block.cta_button}}\n{{block.order_summary}}\n{{block.customer_information}}';
    if (ev.code === 'order_shipped') return opening + '{{block.tracking}}\n{{block.shipment_items}}\n{{block.cta_button}}';
    if (ev.code === 'checkout_refunded') {
      const refundCopy = esc(copy || '').replace(/\{\{\s*refund\.amount\s*\}\}/gi, '<strong>{{refund.amount}}</strong>');
      return '<h2 class="nf-h">' + esc(headline || '') + '</h2><p class="nf-lead">' + refundCopy + '</p>{{block.refund_summary}}';
    }
    if (ev.code === 'abandoned_checkout') return opening + '{{block.cta_button}}\n{{block.order_summary}}';
    return opening + '{{block.cta_button}}\n{{block.order_summary}}\n{{block.shipping_address}}';
  }
  function nfTemplateSource(ev, headline, copy) {
    return nfBuildBody(ev, headline, copy);
  }
  // Refund notices do not include an invoice. Strip a stale editor draft too,
  // so the preview and its saved template stay consistent with that contract.
  function nfSanitizeTemplate(ev, source) {
    const body = String(source || '');
    return (ev.code === 'checkout_purchase_finalized' || ev.code === 'checkout_refunded')
      ? body.replace(/\s*\{\{\s*block\.invoice\s*\}\}\s*/gi, '\n')
      : body;
  }

  // resolve a scalar merge tag against brand + sample data
  function nfResolve(key, b) {
    if (key === 'store.name') return b.storeName;
    if (key === 'store.url') return 'lavender-labs.myshopify.com';
    if (key === 'store.contact_email') return b.contactEmail;
    if (key.indexOf('store.') === 0) return b.storeName;
    return NF_SAMPLE[key];
  }
  // expand a dynamic block tag to safe HTML (the merchant never hand-codes loops)
  function nfBlock(tag, b) {
    const color = b.primaryColor || '#0066e6';
    const panel = (label, inner) =>
      '<div style="background:#f7f8fa;border-radius:12px;padding:20px 22px;margin:0 0 16px">' +
        (label ? '<div style="font-size:12px;font-weight:600;letter-spacing:.04em;color:#9aa3b2;margin-bottom:14px">' + label + '</div>' : '') + inner + '</div>';
    const itemsRows = (items) => items.map((it) => {
      const initial = esc(String(it.name || '·').trim().charAt(0));
      return '<div style="display:flex;align-items:center;gap:14px;padding:9px 0">' +
        '<div style="width:50px;height:50px;border-radius:10px;background:#eef2fb;color:' + color + ';font-weight:700;font-size:16px;display:flex;align-items:center;justify-content:center;flex:none">' + initial + '</div>' +
        '<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:#2a2f3a">' + esc(it.name) + '</div>' +
          '<div style="font-size:12.5px;color:#9aa3b2;margin-top:2px">' + esc(it.variant) + ' · Qty ' + it.qty + '</div></div>' +
        '<div style="font-size:14px;font-weight:600;color:#2a2f3a;white-space:nowrap">' + esc(it.price) + '</div>' +
      '</div>';
    }).join('');
    const totalRow = (label, val) => '<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13.5px;color:#6b7480"><span>' + label + '</span><span>' + val + '</span></div>';
    const nfUnbreakMoney = (value) => String(value || '').replace(/\s+/g, '\u00a0');
    const shopifyProductDiscount = (label, amount) => '<div class="nf-email-product-discount"><img src="../settings/assets/shopify-discount-tag.png" alt="" aria-hidden="true"><span>' + esc(label) + (amount ? ' (' + esc(nfUnbreakMoney(amount)) + ')' : '') + '</span></div>';
    const shopifyItemsRows = (items) => items.map((it) => {
      const discounts = it.discounts || (it.discountCode ? [{ label: it.discountCode, amount: it.discountAmount }] : []);
      const subscription = it.subscription
        ? '<div class="nf-email-subscription"><span>Subscription</span><b>·</b><span>' + esc(it.subscription.cadence) + '</span></div>'
        : '';
      const componentRows = (it.children || []).map((child) =>
        '<div class="nf-email-bundle-component"><div class="nf-email-bundle-component-image" aria-hidden="true"></div><div class="nf-email-bundle-component-copy"><div class="nf-email-bundle-component-name"><span class="nf-email-included">Included</span><span class="nf-email-bundle-component-title">' + esc(child.name) + '&nbsp;&times;&nbsp;' + child.qty + '</span></div><div class="nf-email-bundle-component-variant">' + esc(child.variant) + '</div></div></div>'
      ).join('');
      const variant = it.variant
        ? '<div class="nf-email-product-variant">' + esc(it.variant) + '</div>'
        : '';
      const details = subscription + (discounts.length ? '<div class="nf-email-product-discounts">' + discounts.map((discount) => shopifyProductDiscount(discount.label, discount.amount)).join('') + '</div>' : '') + componentRows;
      return '<div class="nf-email-product-row' + (it.kind === 'bundle' ? ' is-bundle' : '') + '">' +
        '<div class="nf-email-product-image" aria-hidden="true"></div>' +
        '<div class="nf-email-product-copy">' +
          '<div class="nf-email-product-head"><div class="nf-email-product-title">' + (it.kind === 'bundle' ? '<span class="nf-email-bundle-badge i18n-skip">Bundle</span>' : '') + esc(it.name) + '&nbsp;&times;&nbsp;' + it.qty + '</div>' + variant + '</div>' +
          (details ? '<div class="nf-email-product-details">' + details + '</div>' : '') +
        '</div>' +
        '<div class="nf-email-product-price">' + (it.originalPrice ? '<del>' + esc(it.originalPrice) + '</del>' : '') + '<span>' + esc(it.price) + '</span></div>' +
      '</div>';
    }).join('');
    const shopifyTotalRow = (label, val, strong) => '<div class="nf-email-total-row' + (strong ? ' is-strong' : '') + '"><span>' + label + '</span><span>' + val + '</span></div>';
    const shopifyDiscountCode = (code, amount) => '<div class="nf-email-discount-code"><img src="../settings/assets/shopify-discount-tag.png" alt="" aria-hidden="true"><span>' + esc(code) + (amount ? ' (' + esc(nfUnbreakMoney(amount)) + ')' : '') + '</span></div>';
    const shopifyShippingRows = () => {
      const freeShipping = NF_SAMPLE['order.shipping_discount_code'];
      const shippingValue = freeShipping
        ? '<span class="nf-email-shipping-original">' + esc(NF_SAMPLE['order.shipping_original']) + '</span><strong>Free</strong>'
        : esc(NF_SAMPLE['order.shipping']);
      return shopifyTotalRow('Shipping', shippingValue) + (freeShipping ? shopifyDiscountCode(freeShipping, NF_SAMPLE['order.shipping_discount']) : '');
    };
    const shopifyTotalDiscount = () => NF_SAMPLE['order.total_discount']
      ? '<p class="nf-email-total-discount">You saved <span>' + esc(NF_SAMPLE['order.total_discount']) + '</span></p>'
      : '';
    const shopifyRefundTransactions = () => (NF_SAMPLE['refund.transactions'] || []).map((refund) =>
      '<div class="nf-email-refund-payment-row"><div><span>Refund</span><small>' + esc(refund.method || '') + '</small></div><strong>-' + esc(refund.amount || '') + '</strong></div>'
    ).join('');
    const addressLines = (value) => {
      const parts = String(value || '').split(/,\s*/).filter(Boolean);
      if (parts.length >= 5) {
        return esc(parts[0]) + '<br>' + esc(parts[1]) + '<br>' + esc(parts[2] + ', ' + parts[3]) + '<br>' + esc(parts[4]);
      }
      return parts.map((part) => esc(part)).join('<br>');
    };
    const infoBlock = (title, value) =>
      '<div class="nf-email-info-block"><div class="nf-email-info-title">' + title + '</div><div class="nf-email-info-value">' + value + '</div></div>';
    const customerInfo = () =>
      '<section class="nf-email-section nf-email-customer"><div class="nf-email-section-inner">' +
        '<h3>Customer information</h3>' +
        '<div class="nf-email-customer-grid">' +
          infoBlock('Shipping address', addressLines(NF_SAMPLE['order.shipping_address'])) +
          infoBlock('Billing address', addressLines(NF_SAMPLE['order.billing_address'])) +
          infoBlock('Payment', '<span class="nf-email-payment-brand">' + NF_SAMPLE['order.payment_brand'] + '</span>' + NF_SAMPLE['order.payment_method']) +
          infoBlock('Shipping method', esc(NF_SAMPLE['order.shipping_method'])) +
        '</div>' +
      '</div></section>';
    if (tag === 'block.cta_button')
      return '<div class="nf-email-actions">' +
        '<a href="' + (nfPreviewEvent === 'abandoned_checkout' ? esc(NF_SAMPLE['checkout.recovery_url']) : '#') + '" class="nf-email-button" style="background:' + color + '">' + (nfPreviewEvent === 'abandoned_checkout' ? 'Complete your checkout' : 'View your order') + '</a>' +
        '<span class="nf-email-action-or">or</span><a href="#" class="nf-email-store-link" style="color:' + color + '">Visit our store</a></div>';
    if (tag === 'block.tracking')
      return panel('Tracking number · ' + NF_SAMPLE['shipment.carrier'],
        '<div style="font-size:18px;font-weight:700;color:#1f2430;letter-spacing:.02em;margin-bottom:16px">' + NF_SAMPLE['shipment.tracking_number'] + '</div>' +
        '<a href="#" style="display:inline-block;background:' + color + ';color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:11px 22px;border-radius:8px">Track package</a>');
    if (tag === 'block.refund_summary')
      return '<section class="nf-email-section nf-email-summary nf-email-refund-summary"><div class="nf-email-section-inner">' +
        '<h3>Order summary</h3><div class="nf-email-product-list">' + shopifyItemsRows(NF_ITEMS) + '</div>' +
        '<div class="nf-email-totals">' +
          shopifyTotalRow('Subtotal', NF_SAMPLE['order.subtotal']) + shopifyTotalRow('Order discount', NF_SAMPLE['order.discount']) +
          shopifyDiscountCode(NF_SAMPLE['order.discount_code'], NF_SAMPLE['order.discount']) +
          shopifyShippingRows() + shopifyTotalRow('Taxes', NF_SAMPLE['order.tax']) +
        '</div><div class="nf-email-total-divider">' + shopifyTotalRow('Total', NF_SAMPLE['order.total'], true) +
          '<div class="nf-email-total-paid">' + shopifyTotalRow('Total paid', NF_SAMPLE['order.total_paid'], true) + '</div>' + shopifyTotalDiscount() + '</div>' +
        '<div class="nf-email-refund-payments"><div class="nf-email-refund-payment-row"><div><span>Visa</span><small>ending in 4242</small></div><strong>' + NF_SAMPLE['order.total'] + '</strong></div>' +
          shopifyRefundTransactions() + '</div>' +
      '</div></section>';
    if (tag === 'block.order_summary')
      return '<section class="nf-email-section nf-email-summary"><div class="nf-email-section-inner">' +
        '<h3>Order summary</h3><div class="nf-email-product-list">' + shopifyItemsRows(NF_ITEMS) + '</div>' +
        '<div class="nf-email-totals">' +
          shopifyTotalRow('Subtotal', NF_SAMPLE['order.subtotal']) + shopifyTotalRow('Order discount', NF_SAMPLE['order.discount']) +
          shopifyDiscountCode(NF_SAMPLE['order.discount_code'], NF_SAMPLE['order.discount']) +
          shopifyShippingRows() + shopifyTotalRow('Taxes', NF_SAMPLE['order.tax']) +
        '</div><div class="nf-email-total-divider">' + shopifyTotalRow('Total', NF_SAMPLE['order.total'], true) +
          '<div class="nf-email-total-paid">' + shopifyTotalRow('Total paid', NF_SAMPLE['order.total_paid'], true) + '</div>' + shopifyTotalDiscount() + '</div></div></section>';
    if (tag === 'block.invoice')
      return '<div class="nf-email-invoice"><div><div class="nf-email-info-title">Invoice</div><div class="nf-email-invoice-meta">#' + esc(NF_SAMPLE['order.number']) + ' · PDF</div></div><a href="' + esc(NF_SAMPLE['order.invoice_url']) + '" style="color:' + color + '">Download PDF</a></div>';
    if (tag === 'block.shipping_address')
      return panel('Shipping address', '<div style="font-size:14px;color:#5a6473;line-height:1.7">' + esc(NF_SAMPLE['order.shipping_address']) + '</div>');
    if (tag === 'block.customer_information') return customerInfo();
    if (tag === 'block.line_items') return itemsRows(NF_ITEMS);
    if (tag === 'block.shipment_items') return panel('Items in this shipment', itemsRows(NF_ITEMS));
    return '';
  }
  // expand a body string (blocks first, then scalar tags) -> preview HTML
  function nfExpand(body, b) {
    return String(body || '')
      .replace(/\{\{\s*(block\.[a-z_]+)\s*\}\}/gi, (m, t) => nfBlock(t.trim(), b))
      .replace(/\{\{\s*([a-z0-9_.]+)\s*\}\}/gi, (m, k) => { const v = nfResolve(k.trim(), b); return v != null ? esc(v) : '<span class="nf-unktag">{{' + esc(k.trim()) + '}}</span>'; });
  }
  // expand inline text (subject / preheader) -> plain text
  function nfText(str, b) {
    return String(str || '').replace(/\{\{\s*([a-z0-9_.]+)\s*\}\}/gi, (m, k) => { const v = nfResolve(k.trim(), b); return v != null ? v : ''; });
  }

  // the rendered email card (device = 'desktop' | 'mobile')
  function nfCardHtml(b, st) {
    nfPreviewEvent = st.eventCode || '';
    const color = b.primaryColor || '#0066e6';
    const mobile = st.device === 'mobile';
    const width = mobile ? 360 : 600;
    const unsub = st.eventCode === 'abandoned_checkout' ? '<div class="nf-email-unsub" style="margin-top:10px"><a href="#" style="color:' + color + '">Unsubscribe from marketing emails</a></div>' : '';
    return '<div class="email-card' + (mobile ? ' is-mobile' : '') + (st.eventCode === 'checkout_refunded' ? ' is-refund' : '') + '" style="width:' + width + 'px">' +
      '<div class="nf-email-header"><div class="nf-email-inner"><a href="#" class="nf-email-shop-name">' + esc(b.storeName || 'Your store') + '</a><div class="nf-email-order-number">Order #' + esc(NF_SAMPLE['order.number']) + '</div></div></div>' +
      '<div class="nf-email-body">' + nfExpand(st.body, b) + '</div>' +
      '<div class="nf-email-footer"><div class="nf-email-inner">If you have any questions, reply to this email or contact us at <a href="mailto:' + esc(nfReplyToAddress()) + '" style="color:' + color + '">' + esc(nfReplyToAddress()) + '</a>' + unsub + '</div></div>' +
    '</div>';
  }

  // read the live form values for the preview
  function nfReadForm(ev) {
    const g = (id) => { const el = root.querySelector('#' + id); return el ? el.value : ''; };
    return {
      device: notifDevice,
      fromName: D.notifications.sender.profile.fromName,
      fromEmail: nfSenderAddress(),
      subject: g('nf-subject') || ev.config.subject,
      preheader: g('nf-preheader') || ev.config.preheader,
      body: nfSanitizeTemplate(ev, g('nf-template') || ev.config.template || nfTemplateSource(ev, ev.config.headline, ev.config.copy)),
    };
  }
  function nfUpdatePreview(ev) {
    const b = D.notifications.brand;
    const st = nfReadForm(ev);
    const inbox = root.querySelector('#nf-inbox');
    if (inbox) inbox.innerHTML = '<span class="l">Subject:</span><span class="v">' + esc(nfText(st.subject, b)) + '</span>';
    const stage = root.querySelector('#nf-stage');
    if (stage) { stage.innerHTML = nfCardHtml(b, st); nfFit(); }
  }
  // scale the email card to fit the preview stage width (keeps a faithful layout)
  function nfFit() {
    try {
      const stage = root.querySelector('#nf-stage'); const card = stage && stage.querySelector('.email-card');
      if (!card) return;
      card.style.transform = 'none';
      const avail = stage.clientWidth - 24, w = card.offsetWidth;
      const s = Math.min(1, avail / w);
      card.style.transformOrigin = 'top center';
      card.style.transform = 'scale(' + s + ')';
      stage.style.height = (card.offsetHeight * s + 36) + 'px';
    } catch (e) {}
  }
  function renderNotifications() {
    if (notifSub === 'sender-domain') return renderEmailSendingDomains();
    if (notifSub === 'sender') return renderNotifSender();
    if (notifSub) { const f = nfFindEvent(notifSub); if (f && !f.group.locked) return renderNotifEditor(f.ev); notifSub = null; }
    return renderNotifList();
  }

  function renderNotifList() {
    const n = D.notifications;
    const sender = n.sender, activeDomain = nfActiveDomain(), senderDomain = nfSenderDomain(), senderAddress = nfSenderAddress();
    const senderStatus = activeDomain
      ? activeDomain.default
        ? '<span class="pill pill-gray"><span class="dot"></span>BestCheckout default</span>'
        : '<span class="pill pill-green"><span class="dot"></span>Verified</span>'
      : '<span class="pill pill-gray"><span class="dot"></span>Not verified</span>';
    const senderDescription = activeDomain
      ? activeDomain.default
        ? '<span>Platform-managed sender domain</span> ' + esc(activeDomain.domain) + ' · <span>Customer emails can send through this default domain.</span>'
        : '<span>Reply-to</span> ' + esc(nfReplyToAddress()) + ' · <span>Verified sending domain</span> ' + esc(activeDomain.domain)
      : '<span>BestCheckout default sender domain</span> ' + esc(senderDomain ? senderDomain.domain : '') + ' · <span>Customer emails stay off until a sender domain is verified.</span>';
    const groupsHtml = n.groups.map((g) => {
      const rows = g.events.map((ev) => {
        if (g.locked) {
          return '<div class="nf-row locked">' +
            '<span class="nf-ico">' + I.globe + '</span>' +
            '<div class="nf-main"><div class="nf-name">' + esc(ev.name) + '</div><div class="nf-desc">' + esc(ev.desc) + '</div></div>' +
            '<div class="nf-right"><span class="pill pill-gray">Coming soon</span></div></div>';
        }
        const c = ev.config;
        return '<div class="nf-row" data-edit="' + ev.code + '">' +
          '<span class="nf-ico">' + I.globe + '</span>' +
          '<div class="nf-main"><div class="nf-name">' + esc(ev.name) + '</div>' +
            '<div class="nf-desc">' + esc(ev.desc) + '</div></div>' +
          '<div class="nf-right">' + nfStatusPill(c) + nfSwitch(c.enabled, ev.code) + '<span class="nf-chev">' + I.chevR + '</span></div>' +
        '</div>';
      }).join('');
      return '<div class="nf-group">' +
        '<div class="nf-group-h">' + esc(g.label) + (g.locked ? '<span class="nf-soon">Roadmap</span>' : '') + '</div>' +
        (g.note ? '<div class="muted" style="font-size:12.5px;margin:0 2px 8px">' + esc(g.note) + '</div>' : '') +
        '<div class="nf-list">' + rows + '</div></div>';
    }).join('');

    paint(
      '<style>' + NOTIF_STYLES + '</style>' +
      pageHead('Notifications', 'Manage the transactional messages your store sends automatically.') +
      '<div class="nf-sender-card mb-4">' +
        '<div class="nf-sender-ico">' + I.globe + '</div>' +
        '<div class="nf-main"><div class="nf-name">Sender identity ' + senderStatus + '</div>' +
          '<div class="nf-sender-address">' + esc(sender.profile.fromName) + ' &lt;' + esc(senderAddress) + '&gt;</div>' +
          '<div class="nf-desc">' + senderDescription + '</div></div>' +
        '<button class="btn btn-default" data-sender-open>Manage sender identity</button>' +
      '</div>' +
      groupsHtml,
      false
    );

    root.querySelectorAll('[data-nf-toggle]').forEach((el) => el.onclick = (e) => {
      e.stopPropagation();
      const f = nfFindEvent(el.getAttribute('data-nf-toggle')); if (!f) return;
      const c = f.ev.config;
      if (!c.enabled && !nfActiveDomain()) return toast('Verify a sender domain before enabling email notifications.');
      c.enabled = !c.enabled;
      toast(c.enabled ? f.ev.name + ' turned on' : f.ev.name + ' turned off');
      renderNotifList();
    });
    root.querySelectorAll('[data-edit]').forEach((el) => el.onclick = () => { notifEditorMode = 'preview'; location.hash = '#/settings/notifications/' + encodeURIComponent(el.getAttribute('data-edit')); });
    const senderOpen = root.querySelector('[data-sender-open]');
    if (senderOpen) senderOpen.onclick = () => { location.hash = '#/settings/notifications/sender'; };
  }

  function renderNotifSender() {
    const n = D.notifications, sender = n.sender, profile = sender.profile, active = nfActiveDomain();
    const tx = (text) => window.I18N && typeof window.I18N.t === 'function' ? window.I18N.t(text) : text;
    const domainRows = sender.domains.map((d) => {
      const isActive = d.id === sender.activeDomainId;
      const isDefault = !!d.default;
      const needsDns = !isDefault && d.status !== 'verified';
      const status = isDefault
        ? '<span class="pill pill-gray"><span class="dot"></span>BestCheckout default</span>'
        : d.status === 'verified'
          ? '<span class="pill pill-green"><span class="dot"></span>Verified</span>'
          : '<span class="pill pill-gray"><span class="dot"></span>Not verified</span>';
      const primaryAction = isActive
        ? ''
        : d.status === 'verified'
          ? '<button class="btn btn-default" data-domain-active="' + esc(d.id) + '">Use as active</button>'
          : isDefault
            ? '<span class="nf-pending">Customer emails can send through this default domain.</span>'
          : '<span class="nf-pending">Waiting for sender-domain verification</span>';
      const domainSummary = isDefault
        ? 'Platform-managed sender domain'
        : d.status === 'verified'
          ? 'Verified sending domain'
          : 'Waiting for sender-domain verification';
      const senderAddress = isActive ? nfSenderAddress() : '—';
      const senderNote = isActive ? 'Used for transactional email' : 'Available after activation';
      const statusValue = isActive
        ? '<span class="pill pill-green"><span class="dot"></span>Active sender domain</span>'
        : primaryAction;
      const statusNote = isActive
        ? 'Used for transactional email'
        : d.status === 'verified'
          ? 'Ready to use as active sender domain'
          : 'Waiting for sender-domain verification';
      const dnsRows = needsDns ? (d.records || []).map((r) =>
        '<div class="nf-dns-row nf-dns-inline"><div class="nf-dns-cell">' + esc(r.type) + '</div><div class="nf-dns-cell nf-mono">' + esc(r.host) + '</div><div class="nf-dns-cell nf-mono">' + esc(r.value) + '</div><div class="nf-dns-cell nf-dns-copy-cell"><button class="nf-dns-copy" data-copy-dns-record="' + esc(r.type + ' ' + r.host + ' ' + r.value) + '">Copy</button></div></div>'
      ).join('') : '';
      const dnsGuide = needsDns
        ? '<div class="nf-domain-dns"><div class="nf-dns-guide">Add these DNS records at your DNS provider. Verification will continue automatically after the records are found.</div><div class="nf-dns-table"><div class="nf-dns-row nf-dns-head nf-dns-inline nf-dns-inline-head"><div class="nf-dns-cell">Type</div><div class="nf-dns-cell">Host</div><div class="nf-dns-cell">Value</div><div class="nf-dns-cell"></div></div>' + dnsRows + '</div></div>'
        : '';
      const actions = isActive || isDefault ? '' : '<button class="btn btn-default" data-domain-remove="' + esc(d.id) + '">Remove</button>';
      return '<div class="nf-domain-row' + (needsDns ? ' has-dns' : '') + '">' +
        '<div class="nf-domain-main">' +
          '<div class="nf-domain-header"><div class="nf-domain-field-label">Sending domain</div><div class="nf-domain-value">' + esc(d.domain) + ' ' + status + '</div><div class="nf-domain-cell-hint">' + domainSummary + '</div></div>' +
          '<div class="nf-domain-facts">' +
            '<div class="nf-domain-cell"><div class="nf-domain-field-label">Sender address</div><div class="nf-domain-value nf-domain-address">' + esc(senderAddress) + '</div><div class="nf-domain-cell-hint">' + senderNote + '</div></div>' +
            '<div class="nf-domain-cell nf-domain-status"><div class="nf-domain-field-label">Status</div><div class="nf-domain-status-value">' + statusValue + '</div><div class="nf-domain-cell-hint">' + statusNote + '</div>' + (actions ? '<div class="nf-domain-actions">' + actions + '</div>' : '') + '</div>' +
          '</div>' +
        '</div>' + dnsGuide + '</div>';
    }).join('');
    const input = (label, id, value, hint, placeholder, readOnly) =>
      '<div style="margin-bottom:14px"><label class="nf-label" for="' + id + '">' + label + '</label>' +
      '<input class="input" id="' + id + '" value="' + esc(value || '') + '"' + (placeholder ? ' placeholder="' + esc(placeholder) + '"' : '') + (readOnly ? ' readonly aria-readonly="true"' : '') + ' style="width:100%" />' +
      (hint ? '<div class="nf-hint">' + hint + '</div>' : '') + '</div>';
    const defaultDomain = sender.domains.find((d) => d.default) || null;
    const brandedDomain = sender.domains.find((d) => !d.default) || null;
    const senderAddressFor = (d) => ((d && d.default ? sender.platformLocalPart : profile.localPart) || sender.platformLocalPart) + '@' + (d ? d.domain : '');
    const defaultDomainCard = defaultDomain
      ? '<article class="nf-sender-domain-card is-default"><div class="nf-sender-domain-card-head"><span class="nf-sender-domain-icon">' + I.globe + '</span><div class="nf-sender-domain-card-main"><div class="nf-sender-domain-card-title">Store default sending domain</div><div class="nf-sender-domain-card-address">' + esc(senderAddressFor(defaultDomain)) + '</div></div><span class="pill pill-gray"><span class="dot"></span>BestCheckout default</span></div><p class="nf-sender-domain-card-copy">This domain is created for your store and is ready to send transactional email.</p></article>'
      : '';
    const brandedStatus = !brandedDomain
      ? ''
      : brandedDomain.status === 'verified'
        ? '<span class="pill pill-green"><span class="dot"></span>' + tx('Active sender domain') + '</span>'
        : brandedDomain.status === 'dns_error'
          ? '<span class="pill pill-red"><span class="dot"></span>DNS error</span>'
          : '<span class="pill pill-orange"><span class="dot"></span>Pending verification</span>';
    const brandedCopy = !brandedDomain
      ? 'Use your own domain to make your sender easier for customers to recognize. When it is verified, it replaces the default sender automatically.'
      : brandedDomain.status === 'verified'
        ? 'This domain is used automatically for transactional email.'
        : brandedDomain.status === 'dns_error'
          ? 'Correct the DNS records, then verify again.'
          : 'Add the DNS records to complete verification.';
    const brandedDomainControls = brandedDomain
      ? '<div class="nf-sender-domain-card-controls">' + brandedStatus + '<button type="button" class="nf-sender-domain-remove" data-remove-sending-domain="' + esc(brandedDomain.id) + '">' + tx('Delete') + '</button></div>'
      : '';
    const brandedDomainCard = '<article class="nf-sender-domain-card is-branded' + (brandedDomain ? ' has-domain' : '') + '"><div class="nf-sender-domain-card-head"><span class="nf-sender-domain-icon is-branded">' + I.globe + '</span><div class="nf-sender-domain-card-main"><div class="nf-sender-domain-card-title">' + (brandedDomain ? 'Branded sending domain' : 'Add branded sending domain') + '</div>' + (brandedDomain ? '<div class="nf-sender-domain-card-address">' + esc(senderAddressFor(brandedDomain)) + '</div>' : '<p class="nf-sender-domain-card-copy is-inline">' + brandedCopy + '</p>') + '</div>' + brandedDomainControls + '</div>' + (brandedDomain ? '<p class="nf-sender-domain-card-copy">' + brandedCopy + '</p>' : '') + (brandedDomain ? '' : '<div class="nf-sender-domain-card-actions"><button class="btn btn-primary" data-manage-sending-domain>Add branded sending domain</button></div>') + '</article>';
    const brandedDomainSetup = brandedDomain && brandedDomain.status !== 'verified'
      ? (function () {
          const records = brandedDomain.records || [];
          const recordsList = records.map((record) =>
            '<div class="nf-email-dns-row"><code>' + esc(record.type) + '</code><code>' + esc(record.host) + '</code><code>' + esc(record.value) + '</code><button class="nf-dns-copy" data-copy-sender-dns="' + esc(record.type + ' ' + record.host + ' ' + record.value) + '">' + tx('Copy') + '</button></div>'
          ).join('');
          const verificationError = (source) => brandedDomain.status === 'dns_error' && brandedDomain.lastVerificationSource === source
            ? '<div class="nf-email-verification-error" role="alert">' + I.info + '<div><strong>' + tx('DNS verification failed.') + '</strong><span>' + tx('We could not find the DNS records. Review them, then try again.') + '</span></div></div>'
            : '';
          const recordsPanel = sender.emailDnsGuideOpen
            ? '<div class="nf-email-dns-records"><div class="nf-email-dns-records-title">' + tx('Verification records') + '</div>' + recordsList + '</div><div class="nf-email-setup-actions"><button class="btn btn-default" data-email-hide-dns>' + tx('Hide DNS records') + '</button><button class="btn btn-primary" data-email-check-domain="' + esc(brandedDomain.id) + '" data-email-check-source="manual">' + tx('Check verification') + '</button></div>' + verificationError('manual')
            : '<button class="btn btn-gray" data-email-show-dns>' + tx('View DNS records') + '</button>';
          const providerList = '<div class="nf-email-provider-list"><span>GoDaddy</span><span>Cloudflare</span><span>Namecheap</span></div>';
          const automaticAction = brandedDomain.dnsManagedByBestShopio
            ? '<div class="nf-email-setup-connected">' + I.check + '<span>' + tx('DNS provider connected') + '</span></div><button class="btn btn-primary" data-email-check-domain="' + esc(brandedDomain.id) + '" data-email-check-source="automatic">' + tx('Check verification') + '</button>' + verificationError('automatic')
            : providerList + '<button class="btn btn-primary" data-email-auto-dns="' + esc(brandedDomain.id) + '">' + tx('Connect DNS provider') + '</button>';
          return '<section class="nf-email-domain-setup" data-sender-domain-setup><div class="nf-email-domain-setup-head"><div><div class="nf-email-domain-setup-title">' + tx('Set up your sending domain') + '</div><div class="nf-email-domain-setup-copy">' + esc(brandedDomain.domain) + '</div></div></div><div class="nf-email-setup-grid"><article class="nf-email-setup-path is-primary"><div class="nf-email-setup-path-head"><span class="nf-email-setup-icon">' + I.globe + '</span><div><strong>' + tx('Automatic setup') + '</strong><small>' + tx('Recommended · no records to copy') + '</small></div><span class="nf-email-setup-recommended">' + tx('Recommended') + '</span></div><p>' + tx('Connect a supported DNS provider and BestCheckout adds the verification records automatically.') + '</p><div class="nf-email-setup-path-action">' + automaticAction + '</div></article><article class="nf-email-setup-path"><div class="nf-email-setup-path-head"><span class="nf-email-setup-icon is-muted">' + I.info + '</span><div><strong>' + tx('Manual setup') + '</strong><small>' + tx('For another DNS provider') + '</small></div></div><p>' + tx('Add the CNAME and TXT records yourself. We’ll verify the domain after the records are found.') + '</p><div class="nf-email-setup-path-action">' + recordsPanel + '</div></article></div></section>';
        })()
      : '';
    const brandedDomainFlow = '<div class="nf-branded-domain-flow">' + brandedDomainCard + brandedDomainSetup + '</div>';

    paint(
      '<style>' + NOTIF_STYLES + '</style>' +
      '<div class="nf-list-shell"><div class="flex items-center gap-3 mb-4"><button class="back-btn" data-back title="Back">' + I.chevL + '</button>' +
        '<div><div class="page-title" style="font-size:18px">Sender identity</div><div class="muted" style="font-size:12.5px;margin-top:2px">Configure the sender name and reply-to address customers see on your emails.</div></div></div>' +
      '<div class="nf-sender-layout">' +
        '<div class="panel card-pad"><div class="nf-section-title">From identity</div>' +
          input('From name', 'nf-sender-name', profile.fromName, 'Shown in the customer inbox for every transactional message.') +
          input('Sender address', 'nf-sender-local', active && active.default ? nfSenderAddress() : profile.localPart, active ? (active.default ? 'BestCheckout provisions this address for your store. Switch to a verified custom domain to edit the address prefix.' : 'The address uses the active verified domain: @' + esc(active.domain) + '.') : 'This address will be ready after the sender domain is verified.', '', !!(active && active.default)) +
          input('Reply-to', 'nf-sender-reply', profile.replyTo, 'Leave blank to use your store service email.', n.brand.contactEmail) +
          '<button class="btn btn-primary" data-sender-save>Save sender identity</button></div>' +
        '<section class="nf-sender-domain-section"><div class="nf-section-title">Sending domain</div>' +
          defaultDomainCard + brandedDomainFlow +
        '</section>' +
      '</div></div>',
      false
    );

    root.querySelector('[data-back]').onclick = () => { location.hash = '#/settings/notifications'; };
    root.querySelector('[data-sender-save]').onclick = () => {
      const get = (id) => (root.querySelector('#' + id).value || '').trim();
      const name = get('nf-sender-name'), rawLocalPart = get('nf-sender-local'), replyTo = get('nf-sender-reply');
      const localPart = active && active.default
        ? sender.platformLocalPart
        : rawLocalPart.replace(/[^a-z0-9._+-]/gi, '').toLowerCase();
      if (!name || !localPart) return toast('Complete the sender identity fields');
      profile.fromName = name;
      profile.localPart = localPart;
      profile.replyTo = replyTo;
      toast('Sender identity saved');
      if (window.SettingsChrome) window.SettingsChrome.setDirty(false);
      renderNotifSender();
    };
    const manageSendingDomain = root.querySelector('[data-manage-sending-domain]');
    if (manageSendingDomain) manageSendingDomain.onclick = () => openEmailSendingDomainModal(renderNotifSender);
    root.querySelectorAll('[data-remove-sending-domain]').forEach((button) => {
      button.onclick = () => {
        const domain = sender.domains.find((item) => item.id === button.getAttribute('data-remove-sending-domain'));
        if (!domain || domain.default) return;
        modal({
          title: tx('Remove this sending domain?'),
          width: 440,
          okText: tx('Remove'),
          danger: true,
          body: '<div class="muted" style="font-size:13px;line-height:1.6"><b>' + esc(domain.domain) + '</b><br/>' + tx('Removing this domain cancels its verification. You can add a different domain afterwards.') + '</div>',
          onOk: (_, close) => {
            sender.domains = sender.domains.filter((item) => item.id !== domain.id);
            if (sender.activeDomainId === domain.id) sender.activeDomainId = (sender.domains.find((item) => item.default) || {}).id || '';
            sender.emailDnsGuideOpen = false;
            close();
            toast(tx('Sending domain removed'));
            renderNotifSender();
          },
        });
      };
    });
    root.querySelectorAll('[data-email-auto-dns]').forEach((button) => {
      button.onclick = () => openEmailDnsProviderModal(button.getAttribute('data-email-auto-dns'));
    });
    root.querySelectorAll('[data-email-show-dns]').forEach((button) => {
      button.onclick = () => { sender.emailDnsGuideOpen = true; renderNotifSender(); };
    });
    root.querySelectorAll('[data-email-hide-dns]').forEach((button) => {
      button.onclick = () => { sender.emailDnsGuideOpen = false; renderNotifSender(); };
    });
    root.querySelectorAll('[data-copy-sender-dns]').forEach((button) => {
      button.onclick = () => {
        const value = button.getAttribute('data-copy-sender-dns') || '';
        try { navigator.clipboard.writeText(value); } catch (e) {}
        toast('DNS record copied');
      };
    });
    root.querySelectorAll('[data-email-check-domain]').forEach((button) => {
      button.onclick = () => {
        const domain = sender.domains.find((d) => d.id === button.getAttribute('data-email-check-domain'));
        if (!domain) return;
        const source = button.getAttribute('data-email-check-source') || 'manual';
        domain.lastVerificationSource = source;
        domain.verificationAttempt = (domain.verificationAttempt || 0) + 1;
        if (domain.verificationAttempt === 1) {
          domain.status = 'dns_error';
          sender.emailDnsGuideOpen = source === 'manual';
          toast(tx('DNS records were not found. Correct them, then check again.'));
          renderNotifSender();
          return;
        }
        domain.status = 'verified';
        sender.activeDomainId = domain.id;
        sender.emailDnsGuideOpen = false;
        toast(tx('Sending domain verified and activated'));
        renderNotifSender();
      };
    });
  }

  function renderNotifEditor(ev) {
    const c = ev.config;
    const isCode = notifEditorMode === 'code';
    const source = nfSanitizeTemplate(ev, c.template || nfTemplateSource(ev, c.headline, c.copy));
    const tx = (text) => window.I18N && typeof window.I18N.t === 'function' ? window.I18N.t(text) : text;
    const editLabel = tx('Edit code');
    const crumbs = isCode ? editLabel : tx(ev.name);
    const actions = isCode
      ? '<button class="btn btn-primary" data-preview>Preview</button>'
      : '<button class="btn btn-default" data-test>' + tx('Send test') + '</button><button class="btn btn-primary" data-code>Edit code</button>';
    const preview =
      '<section class="nf-shop-preview"><div class="nf-pv-head"><div class="nf-pv-title">Preview</div>' +
        '<div class="nf-seg"><button data-dev="desktop" class="' + (notifDevice === 'desktop' ? 'on' : '') + '">Desktop</button><button data-dev="mobile" class="' + (notifDevice === 'mobile' ? 'on' : '') + '">Mobile</button></div></div>' +
        '<div class="nf-inbox" id="nf-inbox"></div><div class="nf-stage" id="nf-stage"></div></section>';
    const variablePanel = isCode ? nfVariablePanel(ev) : '';
    const code =
      '<section class="nf-code-page"><div class="nf-code-card"><div class="nf-code-card-title">Preview</div><label class="nf-label" for="nf-subject">Email subject</label><input class="input" id="nf-subject" value="' + esc(c.subject || '') + '" style="width:100%;margin:7px 0 16px" />' +
        '<label class="nf-label" for="nf-template">Email body (HTML)</label><div class="nf-code-wrap"><div class="nf-code-gutter" aria-hidden="true">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16</div><textarea id="nf-template" class="nf-code" spellcheck="false" wrap="soft">' + esc(source) + '</textarea></div><div class="nf-hint" style="margin-top:10px">Use Preview to check the rendered email.</div></div>' +
      '<div class="nf-code-notice"><div class="nf-code-notice-title">Template variables</div><div>You can use supported customer, order, and store variables in this template. Order, tracking, invoice, and address blocks are rendered safely when the email is sent.</div></div>' +
      variablePanel +
      '</section>';

    paint('<style>' + NOTIF_STYLES + '</style><div class="nf-shop-shell">' +
      '<div class="nf-shop-head"><div class="flex items-center gap-3"><button class="back-btn" data-back title="Back">' + I.chevL + '</button><div class="nf-crumb">' + crumbs + '</div></div><div class="flex items-center gap-2">' + actions + '</div></div>' +
      (isCode ? code : preview) + '</div>', false);

    if (!isCode) { nfUpdatePreview(ev); setTimeout(nfFit, 0); }
    root.querySelector('[data-back]').onclick = () => {
      if (isCode) {
        nfSaveFromForm(ev);
        location.hash = nfEditorPath(ev.code, 'preview');
        return;
      }
      location.hash = '#/settings/notifications';
    };
    root.querySelector('[data-code]')?.addEventListener('click', () => { location.hash = nfEditorPath(ev.code, 'code'); });
    root.querySelector('[data-preview]')?.addEventListener('click', () => { nfSaveFromForm(ev); location.hash = nfEditorPath(ev.code, 'preview'); });
    root.querySelector('[data-test]')?.addEventListener('click', () => openNotifTestModal(ev));
    root.querySelectorAll('[data-dev]').forEach((bd) => bd.onclick = () => { notifDevice = bd.getAttribute('data-dev'); root.querySelectorAll('[data-dev]').forEach((x) => x.classList.toggle('on', x === bd)); nfUpdatePreview(ev); });
    ['nf-subject', 'nf-template'].forEach((id) => {
      const el = root.querySelector('#' + id);
      if (!el) return;
      const rememberTarget = () => {
        nfInsertTarget = id;
        const start = typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
        const end = typeof el.selectionEnd === 'number' ? el.selectionEnd : start;
        nfInsertSelection = { id, start, end };
      };
      el.addEventListener('input', () => { rememberTarget(); nfSaveFromForm(ev); });
      ['focus', 'click', 'keyup', 'select'].forEach((eventName) => el.addEventListener(eventName, rememberTarget));
    });
    root.querySelectorAll('[data-insert-token]').forEach((button) => button.onclick = () => {
      const token = button.getAttribute('data-insert-token');
      const isBlock = button.getAttribute('data-token-kind') === 'block';
      const targetId = isBlock ? 'nf-template' : nfInsertTarget;
      const field = root.querySelector('#' + targetId) || root.querySelector('#nf-template');
      if (!field || !token) return;
      const selection = nfInsertSelection.id === targetId && Number.isInteger(nfInsertSelection.start) && Number.isInteger(nfInsertSelection.end)
        ? nfInsertSelection
        : { start: field.value.length, end: field.value.length };
      const before = field.value.slice(0, selection.start);
      const after = field.value.slice(selection.end);
      const value = '{{' + token + '}}';
      field.value = before + value + after;
      const caret = before.length + value.length;
      field.focus();
      field.setSelectionRange(caret, caret);
      nfInsertTarget = targetId;
      nfInsertSelection = { id: targetId, start: caret, end: caret };
      field.dispatchEvent(new Event('input', { bubbles: true }));
      toast((window.I18N && window.I18N.t ? window.I18N.t('Variable inserted') : 'Variable inserted'));
    });
    root.querySelectorAll('[data-copy-token]').forEach((button) => button.onclick = () => {
      const token = button.getAttribute('data-copy-token');
      if (!token) return;
      try { navigator.clipboard.writeText('{{' + token + '}}'); } catch (e) {}
      toast((window.I18N && window.I18N.t ? window.I18N.t('Variable copied') : 'Variable copied'));
    });
  }

  // persist the form back into the event config (prototype: in-memory)
  function nfSaveFromForm(ev) {
    const g = (id) => { const el = root.querySelector('#' + id); return el ? el.value : undefined; };
    const c = ev.config;
    ['subject|nf-subject', 'preheader|nf-preheader', 'headline|nf-headline', 'copy|nf-copy', 'template|nf-template'].forEach((p) => { const [k, id] = p.split('|'); const v = g(id); if (v !== undefined) c[k] = k === 'template' ? nfSanitizeTemplate(ev, v) : v; });
    c.updatedAt = '2026-07-27';
  }

  function openNotifTestModal(ev) {
    modal({
      title: 'Send test email', width: 460, okText: 'Send test',
      body: '<div class="muted mb-4" style="font-size:13px;line-height:1.6">Send a test email with sample order data to check the recipient and message layout.</div>' +
        field('Recipient', window.SITE && window.SITE.email ? window.SITE.email : '', 'you@example.com'),
      onOk: (m, close) => {
        const inp = m.querySelector('input'); const to = inp ? inp.value : '';
        D.notifications.deliveryLog.push({ event: ev.code, recipient: to, recordedAt: new Date().toISOString() });
        close(); toast(to ? 'Test email sent to ' + to : 'Test email sent');
      },
    });
  }

  const NOTIF_STYLES = `
  .nf-group { margin-bottom: 22px; }
  .nf-group:last-child { margin-bottom: 0; }
  .nf-group-h { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-muted); margin: 0 2px 8px; }
  .nf-soon { text-transform: none; letter-spacing: 0; font-size: 11px; font-weight: 500; color: var(--ink-muted); background: var(--panel); border: 1px solid var(--hair); border-radius: 9999px; padding: 1px 8px; }
  .nf-list { display: flex; flex-direction: column; gap: 10px; }
  .nf-row { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border: 1px solid var(--hair); border-radius: 10px; background: #fff; cursor: pointer; transition: border-color .12s, background .12s; }
  .nf-row:hover { border-color: var(--brand); background: #fcfdff; }
  .nf-row.locked { cursor: default; background: var(--panel); }
  .nf-row.locked:hover { border-color: var(--hair); background: var(--panel); }
  .nf-ico { width: 36px; height: 36px; border-radius: 8px; background: #e6f0ff; color: var(--brand); display: grid; place-items: center; flex: none; }
  .nf-row.locked .nf-ico { background: #eef0f4; color: var(--ink-muted); }
  .nf-main { flex: 1; min-width: 0; }
  .nf-name { font-size: 14px; font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 8px; }
  .nf-desc { font-size: 12.5px; color: var(--ink-muted); margin-top: 2px; }
  .nf-right { display: flex; align-items: center; gap: 12px; flex: none; }
  .nf-chev { color: var(--ink-muted); display: inline-flex; }
  .nf-sender-card { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid #cfe0ff; border-radius: 10px; background: #f8fbff; }
  .nf-sender-ico { width: 36px; height: 36px; display: grid; place-items: center; flex: none; border-radius: 8px; background: #e6f0ff; color: var(--brand); }
  .nf-sender-address { font-size: 13px; color: var(--ink); margin-top: 3px; }
  .nf-sender-card .btn { flex: none; }
  .nf-list-shell { width: min(860px, 100%); margin: 0 auto; }
  .nf-sender-layout { display: flex; flex-direction: column; gap: 16px; align-items: stretch; }
  .nf-section-title { font-size: 14px; font-weight: 650; color: var(--ink); margin-bottom: 16px; }
  .nf-sender-domain-section { display: flex; flex-direction: column; gap: 12px; }
  .nf-sender-domain-section .nf-section-title { margin: 0 2px 2px; }
  .nf-sender-domain-card { border: 1px solid var(--hair); border-radius: 12px; padding: 17px 18px; background: #fff; box-shadow: 0 1px 2px rgb(21 32 51 / 3%); }
  .nf-sender-domain-card.is-default { background: #fbfcff; }
  .nf-sender-domain-card.is-branded { border: 0; background: transparent; box-shadow: none; }
  .nf-sender-domain-card.is-branded.has-domain { background: transparent; }
  .nf-sender-domain-card-head { display: flex; align-items: flex-start; gap: 12px; }
  .nf-sender-domain-icon { display: grid; place-items: center; width: 36px; height: 36px; flex: none; border-radius: 9px; background: #eef2f6; color: #64748b; }
  .nf-sender-domain-icon.is-branded { background: #e6f0ff; color: var(--brand); }
  .nf-sender-domain-card-main { flex: 1; min-width: 0; padding-top: 1px; }
  .nf-sender-domain-card-title { color: var(--ink); font-size: 14px; font-weight: 650; line-height: 1.35; }
  .nf-sender-domain-card-address { margin-top: 4px; color: var(--ink-body); font-size: 13px; font-weight: 600; line-height: 1.45; overflow-wrap: anywhere; }
  .nf-sender-domain-card-copy { margin: 2px 0 0 48px; color: var(--ink-muted); font-size: 12.5px; line-height: 1.55; }
  .nf-sender-domain-card-main .nf-sender-domain-card-copy.is-inline { margin: 3px 0 0; }
  .nf-sender-domain-card-actions { display: flex; margin: 14px 0 0 48px; }
  .nf-sender-domain-card-actions .btn { min-width: 132px; }
  .nf-sender-domain-card-controls { display: flex; align-items: center; gap: 10px; flex: none; margin-left: auto; }
  .nf-sender-domain-remove { border: 0; padding: 3px 0; color: #b42318; background: transparent; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; }
  .nf-sender-domain-remove:hover { color: #8f1d14; text-decoration: underline; }
  .nf-branded-domain-flow { display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid #cfe0ff; border-radius: 12px; background: linear-gradient(135deg, #fbfdff 0%, #f5f9ff 100%); }
  .nf-branded-domain-flow > .nf-sender-domain-card { padding: 0; }
  .nf-branded-domain-flow > .nf-email-domain-setup { margin: 0; }
  .nf-sender-ref { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px; margin: 0 0 14px; border: 1px solid var(--hair); border-radius: 8px; background: var(--panel); }
  .nf-copy { width: 100%; min-height: 150px; padding: 10px 12px; border: 1px solid var(--ctl); border-radius: 8px; resize: vertical; color: var(--ink); background: #fff; font: 13px/1.6 inherit; }
  .nf-copy:focus { outline: none; border-color: var(--brand); }
  .nf-domain-list { display: flex; flex-direction: column; gap: 10px; }
  .nf-domain-row { display: flex; align-items: center; gap: 14px; padding: 0; border: 1px solid #dfe5ec; border-radius: 10px; background: #fff; overflow: hidden; }
  .nf-domain-row.has-dns { display: block; padding: 0; overflow: hidden; }
  .nf-domain-main { width: 100%; }
  .nf-domain-header { padding: 18px 20px 16px; }
  .nf-domain-facts { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(220px, .8fr); border-top: 1px solid #e8edf3; }
  .nf-domain-cell { min-width: 0; padding: 16px 20px; }
  .nf-domain-cell + .nf-domain-cell { border-left: 1px solid #e8edf3; }
  .nf-domain-field-label { margin-bottom: 8px; color: #778294; font-size: 11.5px; font-weight: 600; letter-spacing: .02em; }
  .nf-domain-value { display: flex; align-items: center; gap: 8px; min-width: 0; color: var(--ink); font-size: 14px; font-weight: 600; line-height: 1.45; }
  .nf-domain-value .pill, .nf-domain-status-value .pill { flex: none; white-space: nowrap; }
  .nf-domain-address { overflow-wrap: anywhere; }
  .nf-domain-cell-hint { margin-top: 5px; color: var(--ink-muted); font-size: 12px; line-height: 1.45; }
  .nf-domain-status { background: #fbfcfe; }
  .nf-domain-status-value { display: flex; align-items: center; min-height: 20px; }
  .nf-domain-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
  .nf-pending { color: var(--ink-muted); font-size: 12px; }
  .nf-dns-table { border: 1px solid var(--hair); border-radius: 8px; overflow: hidden; }
  .nf-dns-row { display: grid; grid-template-columns: 88px 160px minmax(0, 1fr); border-top: 1px solid var(--hair); }
  .nf-dns-row.nf-dns-inline { grid-template-columns: 76px 148px minmax(0, 1fr) 64px; }
  .nf-dns-row:first-child { border-top: 0; }
  .nf-dns-head { background: var(--panel); font-size: 12px; font-weight: 600; color: var(--ink-muted); }
  .nf-dns-cell { min-width: 0; padding: 10px 12px; font-size: 12.5px; overflow-wrap: anywhere; }
  .nf-mono { font-family: ui-monospace, Menlo, Consolas, monospace; }
  .nf-domain-dns { border-top: 1px solid var(--hair); padding: 12px 14px 14px; background: #fbfdff; }
  .nf-dns-guide { margin: 0 0 10px; color: var(--ink-muted); font-size: 12px; line-height: 1.5; }
  .nf-dns-copy-cell { display: flex; align-items: center; justify-content: flex-end; }
  .nf-dns-copy { padding: 4px 8px; border: 1px solid var(--ctl); border-radius: 6px; background: #fff; color: var(--brand); font: inherit; font-size: 12px; cursor: pointer; }
  .nf-dns-copy:hover { border-color: var(--brand); background: #f7faff; }
  .nf-email-domain-setup { margin-top: 2px; }
  .nf-email-domain-setup-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin: 0; }
  .nf-email-domain-setup-title { color: var(--ink); font-size: 14px; font-weight: 650; line-height: 1.4; }
  .nf-email-domain-setup-copy { margin-top: 3px; color: var(--ink-muted); font-size: 12.5px; line-height: 1.45; overflow-wrap: anywhere; }
  .nf-email-setup-grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 12px; }
  .nf-email-setup-path { display: flex; flex-direction: column; min-height: 0; padding: 16px; border: 1px solid var(--hair); border-radius: 10px; background: #fff; }
  .nf-email-setup-path.is-primary { border-color: #b9d2ff; background: #fbfdff; }
  .nf-email-setup-path-head { display: flex; align-items: flex-start; gap: 10px; }
  .nf-email-setup-icon { display: grid; place-items: center; width: 32px; height: 32px; flex: none; border-radius: 8px; color: var(--brand); background: #eaf2ff; }
  .nf-email-setup-icon.is-muted { color: var(--ink-muted); background: #f2f4f7; }
  .nf-email-setup-path-head > div { min-width: 0; flex: 1; }
  .nf-email-setup-path-head strong { display: block; color: var(--ink); font-size: 14px; line-height: 1.35; }
  .nf-email-setup-path-head small { display: block; margin-top: 2px; color: var(--ink-muted); font-size: 12px; line-height: 1.4; }
  .nf-email-setup-recommended { flex: none; padding: 3px 7px; border-radius: 999px; color: var(--brand); background: #eaf2ff; font-size: 10.5px; font-weight: 650; white-space: nowrap; }
  .nf-email-setup-path p { margin: 13px 0; color: var(--ink-muted); font-size: 12.5px; line-height: 1.55; }
  .nf-email-setup-path-action { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: auto; }
  .nf-email-setup-path-action .btn { flex: none; }
  .nf-email-provider-list { display: flex; flex-basis: 100%; flex-wrap: wrap; gap: 6px; }
  .nf-email-provider-list span { padding: 4px 7px; border: 1px solid #dce5f5; border-radius: 5px; color: var(--ink-body); background: #fff; font-size: 11.5px; font-weight: 600; }
  .nf-email-setup-connected { display: inline-flex; align-items: center; gap: 7px; color: #16875b; font-size: 12.5px; font-weight: 600; }
  .nf-email-setup-connected svg { width: 15px; height: 15px; }
  .nf-email-dns-records { width: 100%; overflow: hidden; border: 1px solid var(--hair); border-radius: 8px; background: #fff; }
  .nf-email-dns-records-title { padding: 9px 11px; border-bottom: 1px solid var(--hair); color: var(--ink-muted); background: var(--panel); font-size: 11.5px; font-weight: 650; }
  .nf-email-dns-row { display: grid; grid-template-columns: 64px minmax(0, .9fr) minmax(0, 1.1fr) auto; gap: 8px; align-items: center; padding: 9px 10px; border-top: 1px solid var(--hair); }
  .nf-email-dns-row:first-of-type { border-top: 0; }
  .nf-email-dns-row code { min-width: 0; overflow-wrap: anywhere; color: var(--ink-body); font: 11.5px/1.45 ui-monospace, Menlo, Consolas, monospace; }
  .nf-email-setup-actions { display: flex; flex-wrap: wrap; gap: 8px; }
  .nf-email-verification-error { display: flex; flex-basis: 100%; align-items: flex-start; gap: 8px; margin-top: 2px; padding: 10px 11px; border: 1px solid #f7c7c3; border-radius: 8px; color: #b42318; background: #fff1f0; font-size: 12px; line-height: 1.45; }
  .nf-email-verification-error svg { width: 15px; height: 15px; flex: none; margin-top: 1px; }
  .nf-email-verification-error div { display: grid; gap: 1px; }
  .nf-email-verification-error strong { font-weight: 700; }
  .nf-email-verification-error span { color: #c23b32; }
  @media (max-width: 840px) { .nf-domain-facts { grid-template-columns: 1fr; } .nf-domain-cell + .nf-domain-cell { border-left: 0; border-top: 1px solid #e8edf3; } }
  @media (max-width: 620px) { .nf-email-setup-grid { grid-template-columns: 1fr; } .nf-email-setup-path { min-height: 0; } .nf-email-dns-row { grid-template-columns: 54px minmax(0, 1fr) auto; } .nf-email-dns-row code:nth-child(3) { grid-column: 2; grid-row: 2; } .nf-email-dns-row .nf-dns-copy { grid-column: 3; grid-row: 1 / 3; } }
  @media (max-width: 620px) { .nf-sender-card { align-items: flex-start; flex-wrap: wrap; } .nf-sender-card .btn { width: 100%; } .nf-sender-ref { align-items: flex-start; flex-direction: column; } .nf-sender-domain-card { padding: 15px; } .nf-branded-domain-flow { gap: 12px; padding: 15px; } .nf-sender-domain-card-head { gap: 10px; flex-wrap: wrap; } .nf-sender-domain-card-controls { width: calc(100% - 46px); margin-left: 46px; justify-content: space-between; } .nf-sender-domain-card-copy, .nf-sender-domain-card-actions { margin-left: 0; } .nf-sender-domain-card-actions .btn { width: 100%; } .nf-dns-row { grid-template-columns: 68px 104px minmax(0, 1fr); } .nf-dns-row.nf-dns-inline { grid-template-columns: 58px minmax(0, 1fr) 54px; } .nf-dns-inline-head { display: none; } .nf-dns-row.nf-dns-inline > :nth-child(1) { grid-column: 1; grid-row: 1; } .nf-dns-row.nf-dns-inline > :nth-child(2) { grid-column: 2 / 4; grid-row: 1; } .nf-dns-row.nf-dns-inline > :nth-child(3) { grid-column: 2; grid-row: 2; } .nf-dns-row.nf-dns-inline > :nth-child(4) { grid-column: 3; grid-row: 2; } .nf-dns-cell { padding: 9px; font-size: 11.5px; } }

  /* Shopify-style notification editor */
  .nf-shop-shell { width: min(860px, 100%); margin: 0 auto; }
  .nf-shop-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 0 0 18px; }
  .nf-crumb { color: var(--ink); font-size: 20px; font-weight: 650; line-height: 1.4; }
  .nf-shop-preview, .nf-code-page { width: 100%; margin: 0 auto; }
  .nf-shop-preview { padding: 12px 18px 18px; border: 1px solid var(--hair); border-radius: 12px; background: #fff; }
  .nf-code-notice { margin: 16px 0; padding: 16px 18px; border: 1px solid var(--hair); border-radius: 12px; background: #fff; color: var(--ink-body); font-size: 13px; line-height: 1.65; }
  .nf-code-notice-title { color: var(--ink); font-size: 14px; font-weight: 650; margin-bottom: 4px; }
  .nf-variable-panel { margin: 0 0 16px; padding: 15px 18px 16px; border: 1px solid var(--hair); border-radius: 12px; background: #fff; }
  .nf-variable-panel-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
  .nf-variable-panel-title { color: var(--ink); font-size: 14px; font-weight: 650; line-height: 1.4; }
  .nf-variable-panel-copy { margin-top: 3px; color: var(--ink-muted); font-size: 12px; line-height: 1.5; }
  .nf-variable-panel-note { max-width: 220px; color: var(--ink-muted); font-size: 11.5px; line-height: 1.45; text-align: right; }
  .nf-variable-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 13px; }
  .nf-var-group { min-width: 0; }
  .nf-var-group-title { margin: 0 0 6px; color: var(--ink-body); font-size: 12px; font-weight: 600; }
  .nf-var-token-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .nf-var-token { display: inline-flex; min-width: 0; max-width: 100%; overflow: hidden; border: 1px solid #dfe5ed; border-radius: 6px; background: #f8fafc; }
  .nf-var-insert { min-width: 0; max-width: 100%; overflow: hidden; border: 0; padding: 5px 7px; background: transparent; color: #2458a8; cursor: pointer; font: 12px/1.35 ui-monospace, SFMono-Regular, Consolas, monospace; text-align: left; }
  .nf-var-insert:hover { background: #edf4ff; }
  .nf-var-insert code { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: inherit; }
  .nf-var-copy { flex: none; border: 0; border-left: 1px solid #dfe5ed; padding: 5px 7px; background: #fff; color: var(--ink-muted); cursor: pointer; font-size: 11px; line-height: 1.35; }
  .nf-var-copy:hover { color: var(--brand); background: #f7faff; }
  .nf-code-card { padding: 18px; border: 1px solid var(--hair); border-radius: 12px; background: #fff; }
  .nf-code-card-title { color: var(--ink); font-size: 14px; font-weight: 650; margin: 0 0 16px; }
  .nf-code-wrap { display: grid; grid-template-columns: 44px minmax(0, 1fr); min-height: 420px; border: 1px solid var(--ctl); border-radius: 8px; overflow: hidden; background: #fbfbfc; }
  .nf-code-gutter { padding: 12px 9px; border-right: 1px solid var(--hair); color: #9aa3b2; background: #f7f8fa; text-align: right; font: 12px/1.55 ui-monospace, SFMono-Regular, Consolas, monospace; user-select: none; }
  .nf-code { width: 100%; min-height: 420px; border: 0; outline: 0; resize: vertical; padding: 12px 14px; color: #263041; background: transparent; font: 12px/1.55 ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; overflow-x: hidden; tab-size: 2; }
  @media (max-width: 620px) { .nf-shop-head { align-items: flex-start; flex-direction: column; } .nf-shop-head > .flex:last-child { width: 100%; flex-wrap: wrap; } .nf-shop-head .btn { flex: 1; } .nf-shop-preview, .nf-code-card { padding: 12px; } .nf-code-wrap, .nf-code { min-height: 340px; } .nf-variable-panel { padding: 13px; } .nf-variable-panel-head { flex-direction: column; gap: 5px; } .nf-variable-panel-note { max-width: none; text-align: left; } .nf-variable-grid { grid-template-columns: 1fr; gap: 12px; } }
  .nf-label { display: block; font-size: 13px; font-weight: 600; color: var(--ink); margin: 0 0 6px; }
  .nf-hint { font-size: 11.5px; color: var(--ink-muted); margin-top: 5px; line-height: 1.5; }

  /* preview */
  .nf-pv-head { display: flex; min-height: 40px; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .nf-pv-title { display: flex; align-items: center; align-self: stretch; color: var(--ink); font-size: 13px; font-weight: 600; line-height: 1.35; }
  .nf-seg { display: inline-flex; border: 1px solid var(--ctl); border-radius: 8px; overflow: hidden; }
  .nf-seg button { border: none; background: #fff; padding: 6px 14px; font-size: 12.5px; color: var(--ink-body); cursor: pointer; }
  .nf-seg button + button { border-left: 1px solid var(--ctl); }
  .nf-seg button.on { background: var(--brand); color: #fff; }
  .nf-inbox { border: 1px solid var(--hair); border-bottom: none; border-radius: 10px 10px 0 0; background: #fff; padding: 10px 14px; font-size: 12.5px; }
  .nf-inbox .l { color: var(--ink-muted); } .nf-inbox .v { margin-left: 6px; color: var(--ink); font-weight: 500; }
  .nf-stage { border: 1px solid var(--hair); border-radius: 0 0 10px 10px; background: #eef1f5; padding: 18px 12px; overflow: hidden; display: flex; justify-content: center; align-items: flex-start; }
  .email-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 16px rgb(16 24 40 / 8%); overflow: hidden; margin: 0; flex: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; }
  .email-card .nf-h { margin: 0 0 10px; font-size: 22px; font-weight: 700; color: #1f2430; letter-spacing: -.01em; }
  .email-card .nf-lead { margin: 0 0 22px; font-size: 15px; color: #5a6473; line-height: 1.7; }
  .email-card .nf-fine { margin: 18px 0 0; font-size: 13px; color: #9aa3b2; line-height: 1.7; }
  /* Shopify notification geometry: header, content, summary, customer information and footer. */
  .email-card { border-radius: 0; box-shadow: none; color: #777; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; }
  .email-card .nf-email-inner { box-sizing: border-box; padding: 32px 40px; }
  .email-card .nf-email-header { background: #fff; }
  .email-card .nf-email-header .nf-email-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .email-card .nf-email-shop-name { color: #000; font-size: 20px; font-weight: 500; line-height: 1.25; text-decoration: none; }
  .email-card .nf-email-order-number { color: #999; font-size: 14px; line-height: 1.45; text-align: right; white-space: nowrap; }
  .email-card .nf-email-body { padding: 34px 40px 0; }
  .email-card .nf-h { margin: 0 0 10px; color: #000; font-size: 24px; font-weight: 400; letter-spacing: 0; line-height: 1.333; }
  .email-card .nf-lead { margin: 0; color: #777; font-size: 16px; line-height: 1.5; }
  .email-card .nf-email-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin: 30px 0 0; }
  .email-card .nf-email-button { display: inline-block; box-sizing: border-box; border-radius: 4px; color: #fff; font-size: 14px; font-weight: 600; line-height: 1.2; padding: 14px 22px; text-decoration: none; }
  .email-card .nf-email-action-or { color: #737373; font-size: 14px; }
  .email-card .nf-email-store-link { font-size: 14px; text-decoration: none; }
  .email-card .nf-email-section { margin: 36px -40px 0; background: #fff; }
  .email-card .nf-email-section-inner { padding: 32px 40px; }
  .email-card .nf-email-section h3 { margin: 0 0 21px; color: #000; font-size: 20px; font-weight: 400; line-height: 1.3; }
  .email-card .nf-email-product-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-top: 1px solid #e6e6e6; }
  .email-card .nf-email-product-row:first-child { border-top: 0; padding-top: 0; }
  .email-card .nf-email-product-row.is-bundle { align-items: flex-start; }
  .email-card .nf-email-product-image { display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; flex: none; box-sizing: border-box; border: 1px solid #dedede; border-radius: 4px; background: #f6f6f6; font-size: 16px; font-weight: 600; }
  .email-card .nf-email-product-copy { min-width: 0; flex: 1; }
  .email-card .nf-email-product-title, .email-card .nf-email-product-price { color: #555; font-size: 16px; font-weight: 500; line-height: 1.35; }
  .email-card .nf-email-bundle-badge { display: inline-block; margin: 0 7px 0 0; padding: 1px 5px; border-radius: 3px; background: #f0f4ff; color: #526bba; font-size: 11px; font-weight: 600; line-height: 1.35; vertical-align: 1px; }
  .email-card .nf-email-product-variant { margin-top: 3px; color: #999; font-size: 14px; line-height: 1.4; }
  .email-card .nf-email-subscription { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; margin-top: 5px; color: #777; font-size: 13px; line-height: 1.4; }
  .email-card .nf-email-subscription span:first-child { color: #555; font-weight: 500; }
  .email-card .nf-email-subscription b { color: #aaa; font-size: 12px; }
  .email-card .nf-email-product-discounts { margin-top: 4px; }
  .email-card .nf-email-product-discount { display: flex; align-items: flex-start; gap: 5px; margin-top: 3px; color: #777; font-size: 14px; line-height: 1.35; }
  .email-card .nf-email-product-discount img { display: block; width: 16px; height: 16px; flex: none; margin-top: 2px; }
  .email-card .nf-email-product-discount span { min-width: 0; overflow-wrap: break-word; word-break: normal; }
  .email-card .nf-email-bundle-component { display: flex; align-items: flex-start; gap: 9px; margin: 10px 0 0; padding: 10px 0 0 10px; border-top: 1px solid #f0f0f0; }
  .email-card .nf-email-bundle-component-image { width: 36px; height: 36px; flex: none; box-sizing: border-box; border: 1px solid #e4e4e4; border-radius: 3px; background: #fafafa; }
  .email-card .nf-email-bundle-component-copy { min-width: 0; flex: 1; }
  .email-card .nf-email-bundle-component-name { display: block; }
  .email-card .nf-email-included { display: inline-block; margin: 0 6px 0 0; padding: 1px 5px; border-radius: 3px; background: #f4f5f7; color: #8b919c; font-size: 11px; font-weight: 600; line-height: 1.35; vertical-align: 1px; }
  .email-card .nf-email-bundle-component-title { color: #666; font-size: 13px; font-weight: 500; line-height: 1.4; overflow-wrap: break-word; word-break: normal; }
  .email-card .nf-email-bundle-component-variant { margin-top: 2px; color: #999; font-size: 12px; line-height: 1.4; }
  .email-card .nf-email-product-price { white-space: nowrap; }
  .email-card .nf-email-product-row.is-bundle .nf-email-product-price { padding-top: 1px; }
  .email-card .nf-email-product-price { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
  .email-card .nf-email-product-price del { color: #999; font-size: 14px; font-weight: 400; }
  .email-card .nf-email-totals { width: 60%; margin: 22px 0 0 auto; }
  .email-card .nf-email-total-row { display: flex; justify-content: space-between; gap: 18px; padding: 4px 0; color: #777; font-size: 16px; line-height: 1.2; }
  .email-card .nf-email-total-row > span:last-child { color: #555; font-weight: 600; text-align: right; white-space: nowrap; }
  .email-card .nf-email-total-row.is-strong { color: #777; font-size: 16px; font-weight: 400; line-height: 1.25; }
  .email-card .nf-email-total-row.is-strong > span:last-child { color: #555; font-size: 20px; font-weight: 600; }
  .email-card .nf-email-total-paid .nf-email-total-row.is-strong > span:last-child { font-size: 16px; }
  .email-card .nf-email-discount-code { display: flex; align-items: center; gap: 6px; padding: 4px 0 6px 6px; color: #777; font-size: 14px; line-height: 1.35; }
  .email-card .nf-email-discount-code img { display: block; width: 18px; height: 18px; flex: none; }
  .email-card .nf-email-total-row > span:last-child { display: inline-flex; align-items: baseline; justify-content: flex-end; gap: 10px; }
  .email-card .nf-email-total-row .nf-email-shipping-original { color: #777; font-weight: 400; text-decoration: line-through; }
  .email-card .nf-email-total-row strong { color: #555; font-weight: 600; }
  .email-card .nf-email-total-divider { width: 60%; margin: 20px 0 0 auto; padding-top: 20px; border-top: 1px solid #dedede; }
  .email-card .nf-email-total-paid { margin-top: 14px; }
  .email-card .nf-email-total-discount { margin: 10px 0 0; color: #777; font-size: 16px; line-height: 1.1; text-align: right; }
  .email-card .nf-email-refund-payments { width: 60%; margin: 20px 0 0 auto; padding-top: 18px; border-top: 1px solid #dedede; }
  .email-card .nf-email-refund-payment-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; padding: 5px 0; color: #737373; font-size: 14px; line-height: 1.45; }
  .email-card .nf-email-refund-payment-row span, .email-card .nf-email-refund-payment-row small { display: block; }
  .email-card .nf-email-refund-payment-row small { margin-top: 1px; color: #8b8b8b; font-size: 12px; }
  .email-card .nf-email-refund-payment-row strong { color: #545454; font-size: 14px; font-weight: 600; white-space: nowrap; }
  .email-card .nf-email-invoice { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin: 0; padding: 22px 0; border-bottom: 1px solid #e6e6e6; }
  .email-card .nf-email-customer-grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 36px; row-gap: 26px; }
  .email-card .nf-email-info-block { min-width: 0; }
  .email-card .nf-email-info-title { margin: 0 0 5px; color: #555; font-size: 16px; font-weight: 500; line-height: 1.2; }
  .email-card .nf-email-invoice-meta, .email-card .nf-email-info-value { color: #777; font-size: 16px; line-height: 1.5; }
  .email-card .nf-email-invoice a { font-size: 14px; font-weight: 500; text-decoration: none; white-space: nowrap; }
  .email-card .nf-email-payment-brand { display: inline-block; margin-right: 7px; padding: 1px 4px; border: 1px solid #dedede; border-radius: 2px; color: #2457a6; font-size: 10px; font-weight: 700; line-height: 1.2; vertical-align: 1px; }
  .email-card .nf-email-footer { margin-top: 36px; border-top: 1px solid #e6e6e6; color: #737373; font-size: 13px; line-height: 1.6; text-align: center; }
  .email-card.is-refund .nf-email-footer { margin-top: 20px; }
  .email-card .nf-email-footer a { text-decoration: none; }
  .email-card.is-mobile .nf-email-inner, .email-card.is-mobile .nf-email-body, .email-card.is-mobile .nf-email-section-inner { padding-left: 24px; padding-right: 24px; }
  .email-card.is-mobile .nf-email-section { margin-left: -24px; margin-right: -24px; }
  .email-card.is-mobile .nf-email-totals, .email-card.is-mobile .nf-email-total-divider, .email-card.is-mobile .nf-email-refund-payments { width: 100%; }
  .email-card.is-mobile .nf-email-header .nf-email-inner { gap: 12px; }
  .email-card.is-mobile .nf-email-shop-name { font-size: 18px; }
  .email-card.is-mobile .nf-email-product-row { display: grid; grid-template-columns: 48px minmax(0, 1fr) auto; column-gap: 10px; row-gap: 4px; align-items: start; }
  .email-card.is-mobile .nf-email-product-image { grid-column: 1; grid-row: 1 / -1; align-self: start; width: 48px; height: 48px; }
  .email-card.is-mobile .nf-email-product-copy { display: contents; }
  .email-card.is-mobile .nf-email-product-head { grid-column: 2; grid-row: 1; min-width: 0; }
  .email-card.is-mobile .nf-email-product-price { grid-column: 3; grid-row: 1; }
  .email-card.is-mobile .nf-email-product-details { grid-column: 2 / -1; min-width: 0; }
  .email-card.is-mobile .nf-email-product-details > :first-child { margin-top: 0; }
  .email-card.is-mobile .nf-email-product-title { overflow-wrap: break-word; word-break: normal; }
  .email-card.is-mobile .nf-email-subscription { flex-wrap: wrap; white-space: normal; }
  .email-card.is-mobile .nf-email-product-discount { align-items: flex-start; font-size: 13px; }
  .email-card.is-mobile .nf-email-product-discount span { white-space: normal; overflow-wrap: break-word; word-break: normal; }
  .email-card.is-mobile .nf-email-bundle-component { padding-left: 0; gap: 8px; }
  .email-card.is-mobile .nf-email-bundle-component-image { width: 32px; height: 32px; }
  .email-card.is-mobile .nf-email-bundle-component-name { display: block; }
  .email-card.is-mobile .nf-email-included { display: inline-block; margin: 0 6px 0 0; }
  .email-card.is-mobile .nf-email-bundle-component-title { white-space: normal; overflow-wrap: break-word; }
  .email-card.is-mobile .nf-email-customer-grid { grid-template-columns: 1fr 1fr; column-gap: 16px; row-gap: 18px; }
  .email-card.is-mobile .nf-email-info-block:nth-child(1),
  .email-card.is-mobile .nf-email-info-block:nth-child(2) { grid-column: 1 / -1; }
  .email-card.is-mobile .nf-email-info-title { font-size: 15px; }
  .email-card.is-mobile .nf-email-info-value { font-size: 15px; line-height: 1.45; }
  .nf-unktag { background: #fff4d6; color: #92660a; border-radius: 4px; padding: 0 4px; font-size: .92em; }

  `;

  // ===========================================================================
  // ADVERTISING & ANALYTICS — store-level checkout event delivery
  // Existing verified configuration is active automatically. This page is an
  // exception-driven health surface, not a merchant-facing event editor.
  // ===========================================================================
  function resolveMetaConnection(meta) {
    const detected = (meta.detectedPixels || []).map((pixel) => typeof pixel === 'string' ? pixel : pixel.id).filter(Boolean);
    const authorization = meta.authorization || { status: 'Not connected', authorizedPixelIds: [] };
    const authorized = authorization.authorizedPixelIds || [];
    const matches = Array.from(new Set(detected.filter((pixelId) => authorized.includes(pixelId))));
    const singleDetected = detected.length === 1;
    const existing = meta.silentExistingCapi || {};
    const manual = meta.manualCapi || {};
    const existingMatch = Boolean(existing.valid && singleDetected && existing.pixelId === detected[0]);
    const manualToken = typeof manual.token === 'string' ? manual.token.trim() : '';
    const manualMatch = Boolean(manual.valid && manualToken && singleDetected && manual.pixelId === detected[0]);
    const authorizedMatch = Boolean(authorization.status === 'Connected' && singleDetected && matches.length === 1);

    if (!detected.length) {
      return { status: 'no_pixel', state: 'Not connected', detected, authorization: authorization.status, match: 'No Pixel detected', browser: 'No Pixel detected', server: 'Needs connection', serverConnected: false, canConnect: false };
    }
    if (existingMatch) {
      return { status: 'matched', state: 'Active', detected, authorization: 'Not needed', match: 'Automatically adopted', browser: 'Browser Pixel active', server: 'Conversions API connected', serverConnected: true, source: meta.source, credentialSource: 'Existing server connection', lastCapiResponse: meta.lastCapiResponse, authorizedPixelId: detected[0] };
    }
    if (manualMatch) {
      return { status: 'matched', state: 'Active', detected, authorization: 'Not needed', match: 'Detected Pixel matched', browser: 'Browser Pixel active', server: 'Conversions API connected', serverConnected: true, source: 'Connected with a manually added access token', credentialSource: 'Manual access token', lastCapiResponse: meta.lastCapiResponse, authorizedPixelId: detected[0] };
    }
    if (authorizedMatch) {
      return { status: 'matched', state: 'Active', detected, authorization: 'Authorized', match: 'Exact Pixel match', browser: 'Browser Pixel active', server: 'Conversions API connected', serverConnected: true, source: 'Connected through Meta authorization', credentialSource: 'Connected through Meta authorization', lastCapiResponse: meta.lastCapiResponse, authorizedPixelId: matches[0] };
    }
    if (detected.length > 1) {
      return { status: 'multiple', state: 'Needs attention', detected, authorization: authorization.status, match: 'Multiple Pixels detected', browser: 'Browser Pixel active', server: 'Needs connection', serverConnected: false, canConnect: false };
    }
    if (authorization.status === 'Connected') {
      return { status: 'mismatch', state: 'Needs attention', detected, authorization: 'Authorized', match: 'Pixel mismatch', browser: 'Browser Pixel active', server: 'Needs connection', serverConnected: false, canConnect: true };
    }
    return { status: 'browser_only', state: 'Browser only', detected, authorization: authorization.status, match: 'Ready for access token', browser: 'Browser Pixel active', server: 'Needs connection', serverConnected: false, canConnect: true, source: 'Detected on your Shopify storefront' };
  }

  function renderAdvertisingAnalytics() {
    const a = D.advertisingAnalytics;
    const metaConnection = resolveMetaConnection(a.meta);
    const connectedChannelCount = (metaConnection.serverConnected ? 1 : 0) + (a.google.state === 'Active' ? 1 : 0);
    const connectedChannelText = connectedChannelCount === 0 ? 'No channels connected' : connectedChannelCount === 1 ? '1 channel connected' : connectedChannelCount + ' channels connected';
    const metaOverview = metaConnection.status === 'browser_only' ? 'Meta browser events active' : (metaConnection.status === 'multiple' || metaConnection.status === 'mismatch') ? 'Meta needs attention' : metaConnection.status === 'no_pixel' ? 'Meta not connected' : '';
    const channelTitle = (channel) => channel === 'meta' ? 'Meta' : 'Google';
    const channelIcon = (channel) => channel === 'meta' ? I.facebook : I.google;
    const isActive = (channel) => channel === 'meta' ? resolveMetaConnection(a.meta).state !== 'Not connected' : a[channel].state === 'Active';
    const localize = (text) => window.I18N && typeof window.I18N.t === 'function' ? window.I18N.t(text) : text;
    const ga4S2SConnected = (item) => {
      const config = item.measurementProtocol || {};
      return Boolean(config.valid && typeof config.apiSecret === 'string' && config.apiSecret.trim());
    };
    const status = (value) => {
      const tone = value === 'Active' ? ' active' : value === 'Browser only' ? ' browser-only' : value === 'Needs attention' ? ' attention' : '';
      return '<span class="aa-status' + tone + '"><i></i>' + esc(value) + '</span>';
    };
    const metaCard = () => {
      const item = a.meta;
      const connection = resolveMetaConnection(item);
      const detected = connection.detected;
      const detectedLabel = detected.length === 1 ? detected[0] : detected.length + ' Pixels';
      const identifiers = '<div class="aa-id"><span>Detected storefront Pixel</span><strong>' + esc(detectedLabel || '—') + '</strong></div>';
      const stateRows = '<div><span>Browser Pixel</span><b>' + esc(connection.browser) + '</b></div>' +
        '<div><span>Conversions API</span><b>' + esc(connection.server) + '</b></div>' +
        '<div><span>Pixel match</span><b>' + esc(connection.match) + '</b></div>' +
        (connection.serverConnected ? '<div><span>Server event source</span><b>' + esc(connection.credentialSource) + '</b></div>' : '');
      const footerCopy = connection.serverConnected ? 'Browser Pixel and server events use the same matched Pixel.' : connection.status === 'no_pixel' ? 'No Meta Pixel was detected on the storefront.' : connection.status === 'multiple' ? 'A unique storefront Pixel is required before server events can be enabled.' : 'Browser events continue. Add an access token to also send server-side Purchase and refund events.';
      const action = connection.serverConnected ? 'manage-meta' : 'configure-capi';
      const actionLabel = connection.serverConnected ? 'Manage CAPI' : connection.canConnect ? 'Add access token' : 'Manage connection';
      return '<section class="aa-channel-card' + (connection.serverConnected ? ' is-active' : ' is-off') + '">' +
        '<header><span class="aa-channel-icon meta">' + channelIcon('meta') + '</span><div><h2>Meta</h2><p>' + esc(connection.source || footerCopy) + '</p></div>' + status(connection.state) + '</header>' +
        '<div class="aa-identifiers">' + identifiers + '</div>' +
        '<dl class="aa-state-list">' + stateRows + '</dl>' +
        '<footer><small>' + esc(footerCopy) + '</small><div><button class="btn btn-default" type="button" data-aa-action="' + action + '" data-aa-channel="meta">' + actionLabel + '</button></div></footer>' +
      '</section>';
    };
    const card = (channel) => {
      if (channel === 'meta') return metaCard();
      const item = a[channel];
      const active = isActive(channel);
      const ga4ServerConnected = ga4S2SConnected(item) && active;
      const ga4ServerState = ga4ServerConnected ? 'Server events connected' : active ? 'Needs API secret' : 'Not connected';
      const inactiveMessage = localize('No checkout events are sent to this destination.');
      const identifiers = '<div class="aa-id"><span>GTM</span><strong>' + esc(item.gtmId) + '</strong></div><div class="aa-id"><span>GA4</span><strong>' + esc(item.ga4Id) + '</strong></div>';
      const stateRows = '<div><span>GA4 event delivery</span><b>' + esc(active ? item.ga4Route : 'Not connected') + '</b></div>' +
        '<div><span>GA4 server events</span><b>' + esc(ga4ServerState) + '</b></div>' +
        '<div><span>GTM event delivery</span><b>' + esc(active ? item.gtmRoute : 'Not connected') + '</b></div>';
      const primaryAction = active ? (ga4ServerConnected ? 'manage' : 'configure-ga4-s2s') : 'reconnect';
      const primaryLabel = active ? (ga4ServerConnected ? 'Manage' : 'Add API secret') : 'Reconnect';
      const footerCopy = active
        ? (ga4ServerConnected ? 'GA4 browser events, GA4 server-side events, and GTM events are active separately.' : 'GA4 browser events and GTM events are active separately. Add an API secret to send GA4 server-side events.')
        : inactiveMessage;
      return '<section class="aa-channel-card' + (active ? ' is-active' : ' is-off' ) + '">' +
        '<header><span class="aa-channel-icon ' + channel + '">' + channelIcon(channel) + '</span><div><h2>' + channelTitle(channel) + '</h2><p>' + esc(active ? item.source : inactiveMessage) + '</p></div>' + status(item.state) + '</header>' +
        '<div class="aa-identifiers">' + identifiers + '</div>' +
        '<dl class="aa-state-list">' + stateRows + '</dl>' +
        '<footer><small>' + esc(footerCopy) + '</small><div><button class="btn btn-default" type="button" data-aa-action="' + primaryAction + '" data-aa-channel="' + channel + '">' + primaryLabel + '</button></div></footer>' +
      '</section>';
    };
    const eventDelivery = (event) => {
      if (metaConnection.serverConnected) return event.delivery;
      if (event.id === 'purchase') return metaConnection.status === 'no_pixel' ? 'Meta not sent · No Pixel detected' : 'Browser event · Meta CAPI not connected';
      if (event.id === 'refund') return 'Meta not sent · CAPI not connected';
      return event.delivery;
    };
    const eventNote = metaConnection.serverConnected
      ? 'Shopify storefront keeps browsing, product, search and cart events. BestCheckout owns the checkout journey. When browser and server events are both used, Purchase is counted once per order.'
      : metaConnection.status === 'no_pixel'
        ? 'Shopify storefront keeps browsing, product, search and cart events. BestCheckout owns the checkout journey. No Meta events are sent until a storefront Pixel is detected.'
        : 'Shopify storefront keeps browsing, product, search and cart events. BestCheckout owns the checkout journey. Browser Pixel sends checkout events now. Add an access token before Meta server-side Purchase and refund events are sent.';
    const googleStreamsNote = localize('GA4 and GTM receive their own event streams from BestCheckout.');
    const ga4S2SNote = ga4S2SConnected(a.google) && a.google.state === 'Active'
      ? localize('GA4 browser events, GA4 server-side events, and GTM events are active separately.')
      : localize('GA4 browser events and GTM events are active separately. Add an API secret to send GA4 server-side events.');
    const eventRows = a.events.map((event) =>
      '<tr><td><code>' + esc(event.id) + '</code><span>' + esc(event.label) + '</span></td><td>' + esc(event.meta) + '</td><td><code>' + esc(event.ga4) + '</code></td><td><code>' + esc(event.gtm) + '</code></td><td>' + esc(eventDelivery(event)) + '</td></tr>'
    ).join('');
    const styles = `
      .aa-page{display:grid;gap:18px;max-width:1120px}.aa-overview{display:grid;gap:18px;align-items:center;padding:20px;border:1px solid #cce5d9;border-radius:12px;background:linear-gradient(135deg,#f1faf5 0%,#f8fcff 100%)}.aa-overview-main{display:flex;gap:12px;align-items:flex-start}.aa-overview-icon,.aa-channel-icon{display:grid;place-items:center;flex:none}.aa-overview-icon{width:38px;height:38px;border-radius:10px;color:#137a48;background:#d8f1e3}.aa-overview h2,.aa-channel-card h2{margin:0;color:var(--ink);font-size:16px;line-height:1.35}.aa-overview p,.aa-channel-card header p{margin:4px 0 0;color:var(--ink-muted);font-size:12px;line-height:1.5}.aa-overview-meta{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}.aa-overview-meta span{padding:4px 8px;border:1px solid #d7e8df;border-radius:999px;color:#477260;background:#fff;font-size:11px;font-weight:600}.aa-channel-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.aa-channel-card{overflow:hidden;border:1px solid var(--hair);border-radius:12px;background:#fff}.aa-channel-card.is-active{border-color:#cde5d8}.aa-channel-card>header{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:10px;align-items:start;padding:17px 17px 14px;border-bottom:1px solid #eef1f4}.aa-channel-icon{width:38px;height:38px;border-radius:10px}.aa-channel-icon.meta{color:#1466d9;background:#eaf2ff}.aa-channel-icon.google{color:#3374d9;background:#edf5ff}.aa-status{display:inline-flex;align-items:center;gap:6px;padding:4px 8px;border-radius:999px;color:#8a6108;background:#fff6dc;font-size:11px;font-weight:700;white-space:nowrap}.aa-status i{width:6px;height:6px;border-radius:50%;background:#b88719}.aa-status.active{color:#167447;background:#e6f6ec}.aa-status.active i{background:#1a9b56}.aa-status.browser-only{color:#185e9d;background:#eaf4ff}.aa-status.browser-only i{background:#3585d6}.aa-status.attention{color:#aa5410;background:#fff0df}.aa-status.attention i{background:#d97706}.aa-identifiers{display:flex;flex-wrap:wrap;gap:8px;padding:14px 17px 4px}.aa-id{display:flex;align-items:center;gap:7px;padding:6px 8px;border:1px solid #e7ebef;border-radius:7px;background:#fafbfc}.aa-id span{color:var(--ink-muted);font-size:11px}.aa-id strong{color:var(--ink);font-size:12px;letter-spacing:.01em}.aa-state-list{display:grid;gap:0;margin:8px 17px 12px}.aa-state-list>div{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:8px 0;border-bottom:1px solid #f0f2f4}.aa-state-list>div:last-child{border-bottom:0}.aa-state-list span{color:var(--ink-muted);font-size:12px}.aa-state-list b{max-width:62%;color:var(--ink);font-size:12px;font-weight:600;line-height:1.35;text-align:right}.aa-channel-card footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 17px;border-top:1px solid #eef1f4;background:#fbfcfd}.aa-channel-card footer small{max-width:46%;color:var(--ink-muted);font-size:11px;line-height:1.4}.aa-channel-card footer>div{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:7px}.aa-channel-card .btn{height:32px;font-size:12px}.aa-event-coverage{overflow:hidden;border:1px solid var(--hair);border-radius:12px;background:#fff}.aa-event-coverage-head{display:grid;gap:3px;padding:16px 18px}.aa-event-coverage-head strong{color:var(--ink);font-size:14px}.aa-event-coverage-head small{color:var(--ink-muted);font-size:12px;line-height:1.45}.aa-event-note{display:flex;gap:10px;margin:0 18px 14px;padding:10px 11px;border:1px solid #dbe8fb;border-radius:8px;color:#365675;background:#f7faff;font-size:12px;line-height:1.5}.aa-event-note svg{flex:none;margin-top:1px}.aa-event-table{width:100%;border-collapse:collapse;border-top:1px solid #edf0f3}.aa-event-table th,.aa-event-table td{padding:10px 16px;border-bottom:1px solid #edf0f3;color:var(--ink-body);font-size:12px;text-align:left;vertical-align:top}.aa-event-table th{color:var(--ink-muted);background:#fafbfc;font-size:11px;font-weight:650}.aa-event-table td:first-child{display:grid;gap:4px}.aa-event-table code{width:max-content;max-width:100%;overflow:hidden;padding:2px 4px;border-radius:4px;color:#3e5774;background:#eff3f7;font:11px/1.25 ui-monospace,Menlo,Consolas,monospace;text-overflow:ellipsis;white-space:nowrap}.aa-modal-list{display:grid;gap:9px;margin:4px 0}.aa-modal-list>div{display:flex;justify-content:space-between;gap:16px;padding-bottom:9px;border-bottom:1px solid #edf0f3;color:var(--ink-muted);font-size:12px}.aa-modal-list>div:last-child{border-bottom:0}.aa-modal-list b{color:var(--ink);font-weight:600;text-align:right}.aa-modal-note{margin:14px 0 0;padding:10px 11px;border:1px solid #dbe8fb;border-radius:8px;background:#f7faff;color:#365675;font-size:12px;line-height:1.5}.aa-token-field{display:grid;gap:7px;margin-top:14px;color:var(--ink);font-size:12px;font-weight:650}.aa-token-field .input{width:100%;height:38px}.aa-disconnect{border:0;background:transparent;color:var(--err);font:inherit;font-size:12px;font-weight:650;cursor:pointer}@media(max-width:860px){.aa-channel-grid{grid-template-columns:1fr}}@media(max-width:620px){.aa-overview,.aa-channel-card footer{grid-template-columns:1fr;display:grid}.aa-channel-card footer small{max-width:none}.aa-channel-card footer>div{justify-content:flex-start}.aa-event-table th:nth-child(2),.aa-event-table td:nth-child(2){display:none}.aa-event-table th,.aa-event-table td{padding:9px 11px}}
    `;
    paint(
      '<style>' + styles + '</style>' +
      '<div class="aa-page">' +
        pageHead('Advertising & analytics', 'Keep your checkout conversion data connected to Meta and Google.') +
        '<section class="aa-overview"><div class="aa-overview-main"><span class="aa-overview-icon">' + I.analytics + '</span><div><h2>Automatic setup is active</h2><p>Existing verified configuration is used automatically for new BestCheckout sessions.</p><div class="aa-overview-meta"><span>' + esc(connectedChannelText) + '</span>' + (metaOverview ? '<span>' + esc(metaOverview) + '</span>' : '') + '</div></div></div></section>' +
        '<div class="aa-channel-grid">' + card('meta') + card('google') + '</div>' +
        '<section class="aa-event-coverage" id="aa-event-coverage"><div class="aa-event-coverage-head"><strong>Events sent by BestCheckout</strong><small>Event mapping is managed automatically. You never need to select individual checkout events.</small></div><div class="aa-event-note">' + I.info + '<span>' + esc(localize(eventNote) + ' ' + googleStreamsNote + ' ' + ga4S2SNote) + '</span></div><div class="tbl-wrap"><table class="aa-event-table"><thead><tr><th>BestCheckout event</th><th>Meta</th><th>GA4</th><th>GTM</th><th>Delivery</th></tr></thead><tbody>' + eventRows + '</tbody></table></div></section>' +
      '</div>',
      false
    );

    const configureCapi = (existingToken) => {
      const item = a.meta;
      const connection = resolveMetaConnection(item);
      if (connection.canConnect === false) {
        modal({
          title: 'Manage CAPI',
          width: 520,
          body: '<p class="muted" style="margin:0;font-size:12.5px;line-height:1.55">' + esc(connection.status === 'multiple' ? 'A unique storefront Pixel is required before server events can be enabled.' : 'No Meta Pixel was detected on the storefront.') + '</p>',
          okText: 'Done',
          onOk: function (_, close) { close(); },
        });
        return;
      }
      const replacing = Boolean(existingToken);
      const dialog = modal({
        title: replacing ? 'Replace Conversions API access token' : 'Add Conversions API access token',
        width: 540,
        body: '<p class="muted" style="margin:0 0 14px;font-size:12.5px;line-height:1.55">Paste the access token from Meta Events Manager. This is optional: browser events keep sending if you leave it blank.</p><div class="aa-modal-list"><div><span>Detected storefront Pixel</span><b>' + esc(connection.detected[0]) + '</b></div><div><span>Browser Pixel</span><b>' + esc(connection.browser) + '</b></div></div><label class="aa-token-field"><span>Conversions API access token</span><input class="input" type="text" autocomplete="off" spellcheck="false" data-capi-token placeholder="Paste access token" value="' + esc(existingToken || '') + '" /></label><p class="aa-modal-note">You can view and copy the saved access token in Manage CAPI.</p>',
        okText: replacing ? 'Update and verify' : 'Save and verify',
        onOk: function (m, close) {
          const input = m.querySelector('[data-capi-token]');
          const token = input ? input.value.trim() : '';
          if (!token) {
            if (input) input.focus();
            toast('Please enter a Conversions API access token.', 'warning');
            return;
          }
          item.manualCapi = { valid: true, pixelId: connection.detected[0], token };
          close();
          renderAdvertisingAnalytics();
          toast(replacing ? 'Access token updated. Server events remain connected for the detected Pixel.' : 'Access token saved. Server events are connected for the detected Pixel.');
        },
      });
      const tokenInput = dialog.m.querySelector('[data-capi-token]');
      if (tokenInput) tokenInput.focus();
    };
    const configureGa4S2S = (existingSecret) => {
      const item = a.google;
      const replacing = Boolean(existingSecret);
      const dialog = modal({
        title: replacing ? 'Replace GA4 Measurement Protocol API secret' : 'Add GA4 Measurement Protocol API secret',
        width: 540,
        body: '<p class="muted" style="margin:0 0 14px;font-size:12.5px;line-height:1.55">This enables GA4 server-side events through Measurement Protocol.</p><div class="aa-modal-list"><div><span>GA4 measurement ID</span><b>' + esc(item.ga4Id) + '</b></div><div><span>GA4 event delivery</span><b>' + esc(item.ga4Route) + '</b></div></div><label class="aa-token-field"><span>API secret (Measurement Protocol)</span><input class="input" type="password" autocomplete="off" spellcheck="false" data-ga4-api-secret placeholder="Paste API secret" /></label>',
        okText: replacing ? 'Update and verify' : 'Save and verify',
        onOk: function (m, close) {
          const input = m.querySelector('[data-ga4-api-secret]');
          const apiSecret = input ? input.value.trim() : '';
          if (!apiSecret) {
            if (input) input.focus();
            toast('Please enter a Measurement Protocol API secret.', 'warning');
            return;
          }
          item.measurementProtocol = { valid: true, apiSecret };
          close();
          renderAdvertisingAnalytics();
          toast(replacing ? 'Measurement Protocol API secret updated. GA4 server-side events remain connected.' : 'Measurement Protocol API secret saved. GA4 server-side events are connected.');
        },
      });
      const apiSecretInput = dialog.m.querySelector('[data-ga4-api-secret]');
      if (apiSecretInput) apiSecretInput.focus();
    };
    const openConnection = (channel) => {
      if (channel === 'meta') {
        const item = a.meta;
        const connection = resolveMetaConnection(item);
        const rows = '<div><span>Detected storefront Pixel</span><b>' + esc(connection.detected.length === 1 ? connection.detected[0] : connection.detected.length + ' Pixels') + '</b></div>' +
          '<div><span>Browser Pixel</span><b>' + esc(connection.browser) + '</b></div>' +
          '<div><span>Pixel match</span><b>' + esc(connection.match) + '</b></div>' +
          '<div><span>Conversions API</span><b>' + esc(connection.server) + '</b></div>' +
          (connection.serverConnected ? '<div><span>Server event source</span><b>' + esc(connection.credentialSource) + '</b></div>' : '');
        const tokenField = item.manualCapi && item.manualCapi.token
          ? '<label class="aa-token-field"><span>Conversions API access token</span><input class="input" type="text" readonly autocomplete="off" spellcheck="false" value="' + esc(item.manualCapi.token) + '" data-capi-token-display /></label><p class="aa-modal-note">Select the access token to copy it.</p>'
          : '';
        const dialog = modal({
          title: 'Manage CAPI',
          width: 540,
          body: '<p class="muted" style="margin:0 0 14px;font-size:12.5px;line-height:1.55">' + esc(connection.source || 'Browser Pixel is active. Add an access token to send server events.') + '</p><div class="aa-modal-list">' + rows + '</div>' + tokenField,
          okText: 'Done',
          onOk: function (_, close) { close(); },
          extraLeft: connection.serverConnected ? '<div class="flex gap-2">' + (item.manualCapi && item.manualCapi.token ? '<button type="button" class="btn btn-default" data-replace-token>Replace access token</button>' : '') + '<button type="button" class="aa-disconnect" data-disc>Disconnect server events</button></div>' : '',
          onExtra: function (_, close) {
            close();
            confirm({
              title: 'Disconnect server events?',
              content: 'Disconnecting server events keeps the Browser Pixel active.',
              okText: 'Disconnect',
              danger: true,
              onOk: function () {
                item.silentExistingCapi = { valid: false, pixelId: '' };
                item.manualCapi = { valid: false, pixelId: '', token: '' };
                item.authorization = { status: 'Not connected', authorizedPixelIds: [] };
                item.source = '';
                renderAdvertisingAnalytics();
                toast('Browser Pixel is active. Add an access token to send server events.');
              },
            });
          },
        });
        const savedTokenInput = dialog.m.querySelector('[data-capi-token-display]');
        if (savedTokenInput) {
          savedTokenInput.addEventListener('focus', () => savedTokenInput.select());
          savedTokenInput.addEventListener('click', () => savedTokenInput.select());
        }
        const replaceTokenButton = dialog.m.querySelector('[data-replace-token]');
        if (replaceTokenButton) replaceTokenButton.onclick = () => {
          dialog.close();
          configureCapi(item.manualCapi.token);
        };
        return;
      }
      const item = a[channel];
      const active = isActive(channel);
      const ga4ServerConnected = ga4S2SConnected(item) && active;
      const googleConfigNote = localize('Google measurement and container IDs are read from the active configuration.') + ' ' + googleStreamsNote + ' ' + (ga4ServerConnected ? localize('GA4 browser events, GA4 server-side events, and GTM events are active separately.') : localize('GA4 browser events and GTM events are active separately. Add an API secret to send GA4 server-side events.'));
      const rows = channel === 'meta'
        ? '<div><span>Pixel</span><b>' + esc(item.pixelId) + '</b></div><div><span>Browser events</span><b>' + esc(item.browser) + '</b></div><div><span>Server events</span><b>' + esc(item.server) + '</b></div>'
        : '<div><span>GA4 measurement ID</span><b>' + esc(item.ga4Id) + '</b></div><div><span>GA4 event delivery</span><b>' + esc(item.ga4Route) + '</b></div><div><span>GA4 server events</span><b>' + esc(ga4ServerConnected ? 'Server events connected' : 'Needs API secret') + '</b></div><div><span>API secret (Measurement Protocol)</span><b>' + esc(ga4ServerConnected ? 'Configured' : 'Needs API secret') + '</b></div><div><span>GTM container</span><b>' + esc(item.gtmId) + '</b></div><div><span>GTM event delivery</span><b>' + esc(item.gtmRoute) + '</b></div>';
      const dialog = modal({
        title: channelTitle(channel) + ' connection',
        width: 520,
        body: '<p class="muted" style="margin:0 0 14px;font-size:12.5px;line-height:1.55">' + esc(item.source) + '</p><div class="aa-modal-list">' + rows + '</div><p class="aa-modal-note">' + esc(googleConfigNote) + '</p>',
        okText: 'Done',
        onOk: function (_, close) { close(); },
        extraLeft: active ? '<div class="flex gap-2"><button type="button" class="btn btn-default" data-manage-ga4-s2s>' + (ga4ServerConnected ? 'Manage API secret' : 'Add API secret') + '</button><button type="button" class="aa-disconnect" data-disc>Disconnect</button></div>' : '',
        onExtra: function (_, close) {
          close();
          confirm({
            title: 'Disconnect ' + channelTitle(channel) + '?',
            content: 'Disconnecting this destination will stop sending new BestCheckout checkout events. This does not resend or change past orders.',
            okText: 'Disconnect',
            danger: true,
            onOk: function () {
              item.state = 'Not connected';
              item.testState = 'Not connected';
              renderAdvertisingAnalytics();
              toast(channelTitle(channel) + ' is disconnected in this prototype.');
            },
          });
        },
      });
      const manageGa4S2SButton = dialog.m.querySelector('[data-manage-ga4-s2s]');
      if (manageGa4S2SButton) manageGa4S2SButton.onclick = () => {
        dialog.close();
        configureGa4S2S(item.measurementProtocol && item.measurementProtocol.apiSecret);
      };
    };
    root.querySelectorAll('[data-aa-action]').forEach((button) => {
      button.onclick = () => {
        const action = button.getAttribute('data-aa-action');
        const channel = button.getAttribute('data-aa-channel');
        if (action === 'manage-meta') { openConnection('meta'); return; }
        if (action === 'configure-capi') { configureCapi(); return; }
        if (action === 'configure-ga4-s2s') { configureGa4S2S(); return; }
        if (action === 'manage') { openConnection(channel); return; }
        if (action === 'reconnect') {
          a[channel].state = 'Active';
          a[channel].source = 'Connected automatically from your existing setup';
          renderAdvertisingAnalytics();
          toast(channelTitle(channel) + ' is active for new checkout sessions.');
          return;
        }
      };
    });
  }

  // ===========================================================================
  // ADVERTISING & ANALYTICS V2 — three independent configuration adapters
  // Meta, GA4 and GTM map to separate BestShopio configuration APIs. Runtime
  // storefront detection is deliberately kept outside saved credentials.
  // ===========================================================================
  function renderAdvertisingAnalyticsV2() {
    const a = D.advertisingAnalytics;
    const localize = (text) => {
      const i18n = window.I18N;
      return i18n && i18n.lang === 'zh' && typeof i18n.t === 'function'
        ? i18n.t(text)
        : text;
    };
    const values = (list) => [...new Set((list || []).map((value) => String(value || '').trim()).filter(Boolean))];
    const meta = a.meta || {};
    const ga4 = a.ga4 || {};
    const gtm = a.gtm || {};
    const metaIds = values(meta.detection && meta.detection.pixelIds);
    const ga4Ids = values(ga4.detection && ga4.detection.measurementIds);
    const gtmIds = values(gtm.detection && gtm.detection.containerIds);
    const metaConfig = meta.config || { pixelId: '', accessToken: '', enabled: false };
    const ga4Config = ga4.config || { measurementId: '', apiSecret: '', enabled: false };
    const single = (list) => list.length === 1 ? list[0] : '';
    const metaDetected = single(metaIds);
    const ga4Detected = single(ga4Ids);
    const metaMatch = Boolean(metaDetected && metaConfig.pixelId && metaConfig.pixelId === metaDetected);
    const ga4Match = Boolean(ga4Detected && ga4Config.measurementId === ga4Detected);
    const metaBrowser = Boolean(metaIds.length);
    const metaServer = Boolean(metaConfig.enabled && metaConfig.accessToken && metaMatch);
    const ga4Browser = Boolean(ga4Ids.length);
    const ga4Server = Boolean(ga4Config.enabled && ga4Browser && ga4Config.apiSecret && ga4Match);
    const gtmBrowser = Boolean(gtmIds.length);
    const detectTone = (ids) => ids.length ? 'detected' : 'neutral';
    const detectLabel = (ids) => ids.length ? 'Detected' : 'Not detected';
    const status = (label, tone) => '<span class="aa-status ' + (tone || 'neutral') + '"><i></i>' + esc(localize(label)) + '</span>';
    const toolCard = (opts) =>
      '<section class="aa-tool-card">' +
        '<header><span class="aa-tool-icon ' + esc(opts.kind) + '">' + opts.icon + '</span><div><h2>' + esc(localize(opts.title)) + '</h2><p>' + esc(localize(opts.description)) + '</p></div>' + status(opts.detectLabel, opts.detectTone) + '</header>' +
        '<div class="aa-connector-row' + (opts.action ? '' : ' no-action') + '"><span class="aa-connector-badge ' + esc(opts.kind) + '">' + esc(opts.badge) + '</span><div class="aa-connector-copy"><strong>' + esc(localize(opts.connectorTitle)) + '</strong><small>' + opts.summary + '</small></div><div class="aa-connector-state">' + status(opts.deliveryLabel, opts.deliveryTone) + '</div>' + (opts.action ? '<button class="btn btn-default" type="button" data-aa-v2="' + esc(opts.action) + '">' + esc(localize(opts.actionLabel)) + '</button>' : '') + '</div>' +
      '</section>';
    const idsText = (ids) => ids.join(', ') || '—';
    const metaCredentialStatus = metaServer ? 'Access token configured' : metaIds.length > 1 ? 'A unique storefront Pixel is required before server events can be enabled.' : metaConfig.accessToken ? 'Needs confirmation' : 'CAPI not configured';
    const ga4CredentialStatus = ga4Server ? 'API secret configured' : ga4Ids.length > 1 ? 'A unique Measurement ID is required before GA4 server events can be enabled.' : ga4Config.apiSecret ? 'Needs confirmation' : 'API secret not configured';
    const metaSummary = '<span>' + esc(localize('Storefront Pixel ID')) + '</span>: <b>' + esc(idsText(metaIds)) + '</b><em>·</em>' + esc(localize(metaCredentialStatus));
    const ga4Summary = '<span>' + esc(localize('Storefront Measurement ID')) + '</span>: <b>' + esc(idsText(ga4Ids)) + '</b><em>·</em>' + esc(localize(ga4CredentialStatus));
    const gtmSummary = '<span>' + esc(localize('Storefront Container ID')) + '</span>: <b>' + esc(idsText(gtmIds)) + '</b>';
    const metaCard = toolCard({
      kind: 'meta',
      icon: I.facebook,
      badge: 'Meta',
      title: 'Meta Pixel & Conversions API',
      description: 'Send checkout browser events through the detected Pixel. Add an access token for Conversions API.',
      connectorTitle: 'Meta tracking',
      detectLabel: detectLabel(metaIds),
      detectTone: detectTone(metaIds),
      summary: metaSummary,
      deliveryLabel: metaServer ? 'Browser and server events active' : metaBrowser ? 'Browser events active' : (metaIds.length ? 'Needs confirmation' : 'Not configured'),
      deliveryTone: metaServer || metaBrowser ? 'active' : (metaIds.length ? 'attention' : 'neutral'),
      action: metaDetected ? 'meta' : '',
      actionLabel: metaConfig.accessToken ? 'Update access token' : 'Add access token',
    });
    const ga4Card = toolCard({
      kind: 'ga4',
      icon: I.google,
      badge: 'GA4',
      title: 'Google Analytics 4',
      description: 'Send checkout events directly to GA4. Add an API secret for Measurement Protocol.',
      connectorTitle: 'GA4 tracking',
      detectLabel: detectLabel(ga4Ids),
      detectTone: detectTone(ga4Ids),
      summary: ga4Summary,
      deliveryLabel: ga4Server ? 'Browser and server events active' : ga4Browser ? 'Browser events active' : (ga4Ids.length ? 'Needs confirmation' : 'Not configured'),
      deliveryTone: ga4Server || ga4Browser ? 'active' : (ga4Ids.length ? 'attention' : 'neutral'),
      action: ga4Detected ? 'ga4' : '',
      actionLabel: ga4Config.apiSecret ? 'Update API secret' : 'Add API secret',
    });
    const gtmCard = toolCard({
      kind: 'gtm',
      icon: I.google,
      badge: 'GTM',
      title: 'Google Tag Manager',
      description: 'Send checkout events to the detected GTM container.',
      connectorTitle: 'GTM tracking',
      detectLabel: detectLabel(gtmIds),
      detectTone: detectTone(gtmIds),
      summary: gtmSummary,
      deliveryLabel: gtmBrowser ? 'Browser events active' : (gtmIds.length ? 'Needs confirmation' : 'Not configured'),
      deliveryTone: gtmBrowser ? 'active' : (gtmIds.length ? 'attention' : 'neutral'),
      action: '',
      actionLabel: '',
    });
    const eventRows = (a.events || []).map((event) =>
      '<tr><td><code>' + esc(event.id) + '</code><span>' + esc(event.label) + '</span></td><td>' + esc(event.meta) + '</td><td><code>' + esc(event.ga4) + '</code></td><td><code>' + esc(event.gtm) + '</code></td></tr>'
    ).join('');
    const styles =
      '.aa-page{display:grid;gap:16px;max-width:1080px}.aa-page>.flex:first-child{margin-bottom:0}.aa-config-stack{display:grid;gap:14px}.aa-tool-card{overflow:hidden;border:1px solid var(--hair);border-radius:12px;background:#fff}.aa-tool-card>header{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:12px;align-items:start;padding:17px 18px 14px;border-bottom:1px solid #eef1f4}.aa-tool-icon{display:grid;place-items:center;width:40px;height:40px;border-radius:10px}.aa-tool-icon.meta{color:#1466d9;background:#eaf2ff}.aa-tool-icon.ga4{color:#d97706;background:#fff4df}.aa-tool-icon.gtm{color:#246fdb;background:#edf5ff}.aa-tool-card h2{margin:0;color:var(--ink);font-size:16px;line-height:1.35}.aa-tool-card header p{margin:4px 0 0;color:var(--ink-muted);font-size:12px;line-height:1.5}.aa-status{display:inline-flex;align-items:center;gap:6px;padding:4px 8px;border-radius:999px;color:#6b7280;background:#f4f5f7;font-size:11px;font-weight:700;white-space:nowrap}.aa-status i{width:6px;height:6px;border-radius:50%;background:#8a94a6}.aa-status.active{color:#167447;background:#e6f6ec}.aa-status.active i{background:#1a9b56}.aa-status.detected{color:#185e9d;background:#eaf4ff}.aa-status.detected i{background:#3585d6}.aa-status.attention{color:#aa5410;background:#fff0df}.aa-status.attention i{background:#d97706}.aa-detection{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 18px;border-bottom:1px solid #eef1f4;background:#fbfcfd}.aa-detection>div:first-child{display:grid;gap:2px}.aa-detection span{color:var(--ink);font-size:12px;font-weight:650}.aa-detection small{color:var(--ink-muted);font-size:11px}.aa-detect-tags{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px}.aa-detect-tag{padding:4px 7px;border:1px solid #d9e8fb;border-radius:6px;color:#245c9e;background:#f3f8ff;font:600 11px/1.2 ui-monospace,Menlo,Consolas,monospace}.aa-detect-empty{color:var(--ink-muted)!important;font-weight:500!important}.aa-connector-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;gap:12px;align-items:center;margin:14px 18px;padding:12px 14px;border-radius:9px;background:#f6f8fb}.aa-connector-row.no-action{grid-template-columns:auto minmax(0,1fr) auto}.aa-connector-badge{display:grid;place-items:center;min-width:40px;height:32px;padding:0 8px;border-radius:7px;font-size:12px;font-weight:750}.aa-connector-badge.meta{color:#1466d9;background:#eaf2ff}.aa-connector-badge.ga4{color:#bc7500;background:#fff1cf}.aa-connector-badge.gtm{color:#fff;background:#246fdb}.aa-connector-copy{display:grid;min-width:0;gap:3px}.aa-connector-copy strong{color:var(--ink);font-size:13px}.aa-connector-copy small{display:flex;flex-wrap:wrap;gap:4px;color:var(--ink-muted);font-size:12px;line-height:1.4}.aa-connector-copy small b{color:var(--ink);font-weight:650}.aa-connector-copy small em{font-style:normal;color:#aab2bd}.aa-connector-row .btn{height:32px;font-size:12px}.aa-event-coverage{overflow:hidden;border:1px solid var(--hair);border-radius:12px;background:#fff}.aa-event-coverage-head{display:grid;gap:3px;padding:16px 18px}.aa-event-coverage-head strong{color:var(--ink);font-size:14px}.aa-event-coverage-head small{color:var(--ink-muted);font-size:12px;line-height:1.45}.aa-event-note{display:flex;gap:10px;margin:0 18px 14px;padding:10px 11px;border:1px solid #dbe8fb;border-radius:8px;color:#365675;background:#f7faff;font-size:12px;line-height:1.5}.aa-event-note svg{flex:none;margin-top:1px}.aa-event-note-copy{display:grid;gap:5px;min-width:0}.aa-event-note-copy p{margin:0}.aa-event-table{width:100%;border-collapse:collapse;border-top:1px solid #edf0f3}.aa-event-table th,.aa-event-table td{padding:10px 16px;border-bottom:1px solid #edf0f3;color:var(--ink-body);font-size:12px;text-align:left;vertical-align:top}.aa-event-table th{color:var(--ink-muted);background:#fafbfc;font-size:11px;font-weight:650}.aa-event-table td:first-child{display:grid;gap:4px}.aa-event-table code{width:max-content;max-width:100%;overflow:hidden;padding:2px 4px;border-radius:4px;color:#3e5774;background:#eff3f7;font:11px/1.25 ui-monospace,Menlo,Consolas,monospace;text-overflow:ellipsis;white-space:nowrap}.aa-token-field{display:grid;gap:7px;margin-top:14px;color:var(--ink);font-size:12px;font-weight:650}.aa-token-field .input{width:100%;height:38px}@media(max-width:700px){.aa-tool-card>header{grid-template-columns:40px minmax(0,1fr)}.aa-tool-card>header .aa-status{grid-column:2}.aa-detection{align-items:flex-start;display:grid}.aa-detect-tags{justify-content:flex-start}.aa-connector-row{grid-template-columns:auto minmax(0,1fr)}.aa-connector-row.no-action{grid-template-columns:auto minmax(0,1fr)}.aa-connector-state{grid-column:2}.aa-connector-row .btn{grid-column:1/-1;width:100%}.aa-event-table th,.aa-event-table td{padding:9px 11px}.aa-event-table th:nth-child(2),.aa-event-table td:nth-child(2){display:none}}';
    paint(
      '<style>' + styles + '.aa-token-field .input{font-weight:400}.aa-token-field .input::placeholder{font-weight:400}.aa-detected-source{display:grid;gap:7px;margin:0 0 14px;padding:12px 13px;border:1px solid #e1e8f0;border-radius:9px;background:#f8fafc}.aa-detected-source-label{color:var(--ink-muted);font-size:11px;font-weight:650}.aa-detected-source-details{display:flex;align-items:center;gap:10px;min-width:0}.aa-detected-source-details strong{color:var(--ink);font-size:13px}.aa-detected-source-id{display:flex;align-items:center;gap:5px;margin-left:auto;min-width:0;color:var(--ink-muted);font-size:11px}.aa-detected-source-id code{overflow:hidden;padding:3px 6px;border:1px solid #dfe7f0;border-radius:5px;color:#344054;background:#fff;font:600 11px/1.2 ui-monospace,Menlo,Consolas,monospace;text-overflow:ellipsis;white-space:nowrap}@media(max-width:520px){.aa-detected-source-details{align-items:flex-start;flex-wrap:wrap}.aa-detected-source-id{flex-basis:100%;margin-left:0}}@media(max-width:700px){.aa-event-coverage .tbl-wrap{overflow-x:auto}.aa-event-table{min-width:720px}.aa-event-table th:nth-child(2),.aa-event-table td:nth-child(2){display:table-cell}}</style>' +
      '<div class="aa-page">' +
        pageHead('Advertising & analytics', 'BestCheckout automatically sends checkout events to tags detected on your Shopify storefront.') +
        '<div class="aa-config-stack">' + metaCard + ga4Card + gtmCard + '</div>' +
        '<section class="aa-event-coverage"><div class="aa-event-coverage-head"><strong>' + esc(localize('What BestCheckout sends')) + '</strong><small>' + esc(localize('Once a tag is detected, BestCheckout automatically sends the checkout events shown below. You never need to configure events one by one.')) + '</small></div><div class="aa-event-note">' + I.info + '<div class="aa-event-note-copy"><p>' + esc(localize('Browser events: Detected Meta Pixel, GA4, and GTM tags receive the matching browser events in the table.')) + '</p><p>' + esc(localize('Server Purchase: After you save a Meta access token or GA4 API secret, BestCheckout also sends completed purchases (Purchase) from the server; other checkout events stay browser-only. Within each destination, browser and server copies of the same order are counted once. Meta, GA4, and GTM each receive their own events.')) + '</p></div></div><div class="tbl-wrap"><table class="aa-event-table"><thead><tr><th>BestCheckout event</th><th>Meta</th><th>GA4</th><th>GTM</th></tr></thead><tbody>' + eventRows + '</tbody></table></div></section>' +
      '</div>',
      false
    );

    const field = (label, attr, value, placeholder, opts) =>
      '<label class="aa-token-field"><span>' + esc(localize(label)) + (opts && opts.optional ? ' <b class="muted" style="font-weight:500">(' + esc(localize('Optional')) + ')</b>' : '') + '</span><input class="input" type="' + ((opts && opts.secret) ? 'password' : 'text') + '" autocomplete="off" spellcheck="false" ' + ((opts && opts.readOnly) ? 'readonly ' : '') + attr + ' placeholder="' + esc(placeholder) + '" value="' + esc(value || '') + '" /></label>';
    const detectionInfo = (detectedTag, identifierLabel, ids) =>
      '<div class="aa-detected-source">' +
        '<span class="aa-detected-source-label">' + esc(localize('Detected from your Shopify storefront')) + '</span>' +
        '<div class="aa-detected-source-details"><strong>' + esc(localize(detectedTag)) + '</strong><span class="aa-detected-source-id"><span>' + esc(localize(identifierLabel)) + '</span><code>' + esc(ids.join(', ') || localize('No tag detected on your Shopify storefront')) + '</code></span></div>' +
      '</div>';
    const openMeta = () => {
      if (!metaDetected) {
        toast(localize('A unique storefront Pixel is required before server events can be enabled.'), 'warning');
        return;
      }
      const hasToken = Boolean(metaConfig.accessToken);
      const staleToken = Boolean(hasToken && !metaMatch);
      const dialog = modal({
        title: hasToken ? 'Manage Meta tracking' : 'Configure Meta',
        width: 540,
        body: '<p class="muted" style="margin:0 0 14px;font-size:12.5px;line-height:1.55">' + esc(localize('BestCheckout uses the detected Pixel for browser events. Add an access token to also enable Conversions API.')) + '</p>' + detectionInfo('Meta Pixel', 'Pixel ID', metaIds) + (staleToken ? '<p class="muted" style="margin:14px 0 0;font-size:12px;line-height:1.55;color:#aa5410">' + esc(localize('Storefront Pixel changed. Enter a new access token for the detected Pixel before server events can resume.')) + '</p>' : '') + field('CAPI access token', 'data-aa-v2-meta-token', staleToken ? '' : metaConfig.accessToken, 'Paste access token', { optional: true }),
        okText: 'Save',
        onOk: (m, close) => {
          const accessToken = (m.querySelector('[data-aa-v2-meta-token]') || {}).value || '';
          if (staleToken && !accessToken.trim()) {
            toast(localize('Please enter a new access token for the detected Pixel.'), 'warning');
            return;
          }
          if (accessToken.trim() && metaIds.length !== 1) {
            toast(localize('A unique storefront Pixel is required before server events can be enabled.'), 'warning');
            return;
          }
          meta.config = { pixelId: metaDetected, accessToken: accessToken.trim(), enabled: Boolean(accessToken.trim()) };
          close();
          renderAdvertisingAnalyticsV2();
          toast(localize('Meta configuration saved.'));
        },
      });
      const input = dialog.m.querySelector('[data-aa-v2-meta-token]');
      if (input) input.focus();
    };
    const openGa4 = () => {
      if (!ga4Detected) {
        toast(localize('No tag detected on your Shopify storefront'), 'warning');
        return;
      }
      const hasSecret = Boolean(ga4Config.apiSecret);
      const staleSecret = Boolean(hasSecret && !ga4Match);
      const dialog = modal({
        title: hasSecret ? 'Manage GA4' : 'Configure GA4',
        width: 540,
        body: '<p class="muted" style="margin:0 0 14px;font-size:12.5px;line-height:1.55">' + esc(localize('BestCheckout uses the detected Measurement ID for checkout browser events. Add an API secret to also send GA4 server-side events.')) + '</p>' + detectionInfo('Google Analytics 4', 'Measurement ID', ga4Ids) + (staleSecret ? '<p class="muted" style="margin:14px 0 0;font-size:12px;line-height:1.55;color:#aa5410">' + esc(localize('Storefront Measurement ID changed. Enter a new API secret for the detected Measurement ID before server events can resume.')) + '</p>' : '') + field('API secret (Measurement Protocol)', 'data-aa-v2-ga4-secret', staleSecret ? '' : ga4Config.apiSecret, 'Paste API secret', { optional: true, secret: true }),
        okText: 'Save',
        onOk: (m, close) => {
          const apiSecret = (m.querySelector('[data-aa-v2-ga4-secret]') || {}).value || '';
          if (staleSecret && !apiSecret.trim()) {
            toast(localize('Please enter a new API secret for the detected Measurement ID.'), 'warning');
            return;
          }
          ga4.config = { measurementId: ga4Detected, apiSecret: apiSecret.trim(), enabled: Boolean(apiSecret.trim()) };
          close();
          renderAdvertisingAnalyticsV2();
          toast(localize('GA4 configuration saved.'));
        },
      });
      const input = dialog.m.querySelector('[data-aa-v2-ga4-secret]');
      if (input) input.focus();
    };
    root.querySelectorAll('[data-aa-v2]').forEach((button) => {
      button.onclick = () => {
        const action = button.getAttribute('data-aa-v2');
        if (action === 'meta') openMeta();
        if (action === 'ga4') openGa4();
      };
    });
  }

  // ===================== AI AND MCP =====================
  // Merchants connect an AI host (Claude, ChatGPT, Cursor) to BestCheckout over
  // the Model Context Protocol. Capabilities are split across separate server
  // URLs so the public help server and tenant data never share an audience.
  const MCP_SERVERS = [
    {
      id: 'guide', name: 'Guide', url: 'https://mcp.bestcheckout.com/guide',
      auth: 'none', desc: 'Official help articles so the AI answers setup questions without inventing steps.',
    },
    {
      id: 'insights', name: 'Insights', url: 'https://mcp.bestcheckout.com/insights',
      auth: 'oauth', desc: 'Read-only shop context, connection health, purchase flows, checkout metrics and orders.',
    },
    {
      id: 'operate', name: 'Operate', url: 'https://mcp.bestcheckout.com/operate',
      auth: 'oauth', desc: 'Edit drafts and offers, then publish or pause after you confirm the change.',
    },
    {
      id: 'page-design', name: 'Page Design', url: 'https://mcp.bestcheckout.com/page-design',
      auth: 'token', desc: 'Generate checkout and Thank you page drafts, then import them for review.', soon: true,
    },
  ];
  let mcpConnections = [
    {
      id: 'c1', host: 'Claude.ai', by: 'hello@lavenderlabs.co', role: 'Owner', added: 'Aug 28, 2026',
      scopes: ['shops:read', 'funnels:read', 'pages:read', 'analytics:read', 'funnels:write'],
      shops: 'all', lastUsed: '2 hours ago',
    },
    {
      id: 'c2', host: 'ChatGPT', by: 'hello@lavenderlabs.co', role: 'Owner', added: 'Aug 30, 2026',
      scopes: ['shops:read', 'funnels:read', 'analytics:read'],
      shops: ['Lavender Labs'], lastUsed: 'Yesterday',
    },
  ];
  let mcpTokens = [
    { id: 't1', server: 'Insights', shop: 'Lavender Labs', purpose: 'Cursor local development', created: 'Aug 29, 2026', lastUsed: '5 hours ago' },
    { id: 't2', server: 'Operate', shop: 'Lavender Labs', purpose: 'Grok CLI release script', created: 'Sep 1, 2026', lastUsed: 'Never used' },
  ];
  const mcpShops = () => (window.STORES || []);
  const mcpRole = () => ((window.SITE && window.SITE.role) || '');
  const mcpShopScope = (shops) => (shops === 'all'
    ? 'All ' + mcpShops().length + ' shops'
    : shops.join(', '));

  const MCP_STYLES = `
  .mcp-stack { display: flex; flex-direction: column; gap: 16px; }
  .mcp-card { border: 1px solid var(--hair); border-radius: 12px; background: #fff; padding: 20px; }
  .mcp-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
  .mcp-card-head strong { display: block; font-size: 14px; font-weight: 650; color: var(--ink); line-height: 1.35; }
  .mcp-card-head small { display: block; margin-top: 3px; font-size: 12.5px; line-height: 1.5; color: var(--ink-muted); }
  .mcp-srv-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .mcp-srv { position: relative; display: flex; flex-direction: column; border: 1px solid var(--hair); border-radius: 10px; padding: 14px; background: #fff; }
  .mcp-srv-soon { overflow: hidden; }
  .mcp-srv-soon-mask { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,.68); border-radius: 10px; z-index: 2; }
  .mcp-srv-soon-mask span { display: inline-flex; align-items: center; padding: 7px 12px; border-radius: 999px; background: #111827; color: #fff; font-size: 12px; font-weight: 700; letter-spacing: .03em; }
  .mcp-srv-top { display: flex; align-items: center; gap: 9px; }
  .mcp-srv-ico { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; background: #eaf2ff; color: var(--brand); flex: none; }
  .mcp-srv-name { font-size: 13.5px; font-weight: 650; color: var(--ink); }
  .mcp-srv p { margin: 10px 0 12px; font-size: 12.5px; line-height: 1.55; color: var(--ink-muted); }
  .mcp-srv-url { display: flex; align-items: center; gap: 8px; margin-top: auto; padding: 8px 10px; border: 1px solid var(--hair); border-radius: 7px; background: var(--panel); }
  .mcp-srv-url code { flex: 1; min-width: 0; font-size: 12px; color: var(--ink-body); overflow-wrap: anywhere; }
  .mcp-tag { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 650; white-space: nowrap; }
  .mcp-tag-open { background: #edf8f2; color: #16875b; }
  .mcp-tag-auth { background: #eaf2ff; color: var(--brand); }
  .mcp-scope-list { display: flex; flex-wrap: wrap; gap: 5px; }
  .mcp-scope { display: inline-flex; align-items: center; padding: 3px 7px; border: 1px solid #dce5f5; border-radius: 5px; background: #fff; font-size: 11px; font-weight: 600; color: var(--ink-body); white-space: nowrap; }
  .mcp-empty { border: 1px dashed var(--hair); border-radius: 10px; background: var(--panel); padding: 22px; text-align: center; font-size: 13px; color: var(--ink-muted); }
  .mcp-note { display: flex; align-items: flex-start; gap: 10px; padding: 13px 14px; border: 1px solid #ffd8a8; border-radius: 8px; background: #fff8ef; }
  .mcp-note > span { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: #ffe8cc; color: #b25e02; flex: none; }
  .mcp-note strong { display: block; font-size: 13px; line-height: 1.4; color: var(--ink); }
  .mcp-note p { margin: 3px 0 0; font-size: 12.5px; line-height: 1.55; color: var(--ink-body); }
  .mcp-reveal { display: flex; align-items: center; gap: 8px; padding: 11px 12px; border: 1px solid var(--hair); border-radius: 8px; background: var(--panel); }
  .mcp-reveal code { flex: 1; min-width: 0; font-size: 12.5px; color: var(--ink); overflow-wrap: anywhere; }
  @media (max-width: 860px) { .mcp-srv-grid { grid-template-columns: 1fr; } }
  `;

  function renderAiMcp() {
    const canManage = mcpRole() === 'Owner' || mcpRole() === 'Admin';
    const servers = MCP_SERVERS.map((s) =>
      '<article class="mcp-srv' + (s.soon ? ' mcp-srv-soon' : '') + '">' +
        (s.soon ? '<div class="mcp-srv-soon-mask" aria-hidden="true"><span>Coming soon</span></div>' : '') +
        '<div class="mcp-srv-top"><span class="mcp-srv-ico">' + I.globe + '</span>' +
          '<span class="mcp-srv-name">' + esc(s.name) + '</span>' +
          '<span class="mcp-tag ' + (s.auth === 'none' ? 'mcp-tag-open' : 'mcp-tag-auth') + '" style="margin-left:auto">' +
            (s.auth === 'none' ? 'No sign-in' : s.auth === 'token' ? 'Token only' : 'Sign-in required') + '</span></div>' +
        '<p>' + esc(s.desc) + '</p>' +
        '<div class="mcp-srv-url"><code>' + esc(s.url) + '</code>' +
          '<button class="btn btn-gray" data-copy-server="' + esc(s.url) + '"' + (s.soon ? ' disabled' : '') + '>Copy</button></div>' +
      '</article>').join('');

    const connRows = mcpConnections.map((c) =>
      '<tr><td><div style="font-weight:600;color:var(--ink)">' + esc(c.host) + '</div>' +
          '<div class="muted" style="font-size:12px;margin-top:2px">' + esc(c.by) + ' · ' + esc(c.role) + '</div></td>' +
        '<td><div class="mcp-scope-list">' + c.scopes.map((s) => '<span class="mcp-scope">' + esc(s) + '</span>').join('') + '</div></td>' +
        '<td>' + esc(mcpShopScope(c.shops)) + '</td>' +
        '<td>' + esc(c.lastUsed) + '</td>' +
        '<td><div class="flex items-center gap-2">' +
          '<button class="btn btn-gray" data-conn-shops="' + c.id + '">Shop access</button>' +
          '<button class="set-icon-btn danger" title="Revoke" data-conn-revoke="' + c.id + '">' + I.trash + '</button>' +
        '</div></td></tr>').join('');

    const tokenRows = mcpTokens.map((t) =>
      '<tr><td><div style="font-weight:600;color:var(--ink)">' + esc(t.purpose) + '</div>' +
          '<div class="muted" style="font-size:12px;margin-top:2px">Created ' + esc(t.created) + '</div></td>' +
        '<td>' + esc(t.server) + '</td><td>' + esc(t.shop) + '</td><td>' + esc(t.lastUsed) + '</td>' +
        '<td><button class="set-icon-btn danger" title="Revoke" data-token-revoke="' + t.id + '">' + I.trash + '</button></td></tr>').join('');

    paint('<style>' + MCP_STYLES + '</style><div class="mcp-stack">' +
      pageHead('AI and MCP', 'Let your AI assistant read and operate this workspace over the Model Context Protocol.') +

      (canManage ? '' :
        '<div class="mcp-note"><span>' + I.info + '</span><div><strong>Only the Owner and Admin can manage connections</strong>' +
        '<p>You can see the server addresses, but you cannot authorize a host or issue a token with your current role.</p></div></div>') +

      '<div class="mcp-card">' +
        '<div class="mcp-card-head"><div><strong>Server addresses</strong>' +
          '<small>Add each address separately in your AI host. Guide needs no sign-in; the others ask you to authorize first.</small></div></div>' +
        '<div class="mcp-srv-grid">' + servers + '</div>' +
      '</div>' +

      '<div class="mcp-card">' +
        '<div class="mcp-card-head"><div><strong>Authorized connections</strong>' +
          '<small>A connection can never do more than the person who authorized it. Revoking takes effect immediately.</small></div>' +
          (canManage ? '<button class="btn btn-primary" data-mcp-authorize>Authorize a host</button>' : '') + '</div>' +
        (mcpConnections.length
          ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Host and authorized by</th><th>Scopes</th>' +
            '<th style="width:150px">Shop access</th><th style="width:120px">Last used</th><th style="width:170px">Action</th>' +
            '</tr></thead><tbody>' + connRows + '</tbody></table></div>'
          : '<div class="mcp-empty">No host is connected yet.</div>') +
      '</div>' +

      '<div class="mcp-card">' +
        '<div class="mcp-card-head"><div><strong>MCP tokens</strong>' +
          '<small>For hosts that cannot sign in, such as Cursor, Lovable and Grok CLI. One token covers one server address and one shop.</small></div>' +
          (canManage ? '<button class="btn btn-primary" data-mcp-issue>Issue token</button>' : '') + '</div>' +
        (mcpTokens.length
          ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Purpose</th><th style="width:130px">Server</th>' +
            '<th style="width:160px">Shop scope</th><th style="width:120px">Last used</th><th style="width:80px">Action</th>' +
            '</tr></thead><tbody>' + tokenRows + '</tbody></table></div>'
          : '<div class="mcp-empty">No token has been issued yet.</div>') +
      '</div>' +

      '<div class="mcp-note"><span>' + I.info + '</span><div><strong>What your AI provider can see</strong>' +
        '<p>Once you authorize a host, the shop data covered by the granted scopes is sent to that AI provider to answer your questions. ' +
        'Order tools never return customer email, address or phone. Publishing always asks you to confirm first.</p></div></div>' +

      '<div class="mcp-card"><div class="mcp-card-head"><div><strong>Setup guides</strong>' +
        '<small>Step-by-step instructions for each host, and how to revoke access.</small></div>' +
        '<a class="btn btn-gray" href="help/#guide=mcp-configuration" target="_blank" rel="noopener">Open guides</a></div>' +
        '<div class="muted" style="font-size:12.5px;line-height:1.6">Every connection, revoke, token issue and token revoke is recorded in the activity log.</div>' +
      '</div>' +
    '</div>', false);

    root.querySelectorAll('[data-copy-server]').forEach((b) => b.onclick = () => {
      try { navigator.clipboard.writeText(b.getAttribute('data-copy-server')); } catch (e) {}
      toast('Server address copied');
    });
    const authorize = root.querySelector('[data-mcp-authorize]');
    if (authorize) authorize.onclick = openMcpAuthorizeModal;
    const issue = root.querySelector('[data-mcp-issue]');
    if (issue) issue.onclick = openMcpTokenModal;
    root.querySelectorAll('[data-conn-shops]').forEach((b) => b.onclick = () => openMcpShopAccessModal(b.getAttribute('data-conn-shops')));
    root.querySelectorAll('[data-conn-revoke]').forEach((b) => b.onclick = () => revokeMcpConnection(b.getAttribute('data-conn-revoke')));
    root.querySelectorAll('[data-token-revoke]').forEach((b) => b.onclick = () => revokeMcpToken(b.getAttribute('data-token-revoke')));
  }

  // Authorization happens in the host, not here: this only explains the handoff.
  function openMcpAuthorizeModal() {
    modal({
      title: 'Authorize a host', width: 560, okText: 'Done',
      body:
        '<div class="muted" style="font-size:13px;line-height:1.65">Authorization starts in your AI host, not in this page.</div>' +
        '<ol style="margin:14px 0 0;padding-left:20px;font-size:13px;line-height:1.75;color:var(--ink-body)">' +
          '<li>Copy the server address you want to connect.</li>' +
          '<li>Add it as a connector in Claude, ChatGPT or Cursor.</li>' +
          '<li>The host opens a BestCheckout sign-in page, where you approve the requested access.</li>' +
          '<li>Come back here to narrow which shops that connection may read.</li>' +
        '</ol>' +
        '<div class="mcp-note" style="margin-top:16px"><span>' + I.info + '</span><div>' +
          '<strong>You approve your whole account, then narrow it here</strong>' +
          '<p>The approval screen covers every shop you can already access. Use Shop access on the connection to restrict it afterwards, with no need to authorize again.</p>' +
        '</div></div>',
      hideCancel: true,
      onOk: (_m, close) => close(),
    });
  }

  function openMcpShopAccessModal(id) {
    const conn = mcpConnections.find((c) => c.id === id);
    if (!conn) return;
    const all = conn.shops === 'all';
    const rows = mcpShops().map((s, i) =>
      '<label class="set-radio2' + (all || conn.shops.indexOf(s.name) >= 0 ? ' on' : '') + '" style="margin-bottom:8px">' +
        '<input type="checkbox" data-mcp-shop="' + i + '"' + (all || conn.shops.indexOf(s.name) >= 0 ? ' checked' : '') + '/>' +
        '<span><span style="display:block;font-weight:600;color:var(--ink)">' + esc(s.name) + '</span>' +
        '<span class="muted" style="font-size:12px">' + esc(s.url) + '</span></span></label>').join('');
    modal({
      title: 'Shop access for ' + conn.host, width: 520, okText: 'Save',
      body: '<div class="muted" style="font-size:13px;line-height:1.6;margin-bottom:14px">' +
        'Requests for a shop that is not selected fail immediately. This never grants more than the authorizing member can access.</div>' + rows,
      onOk: (m, close) => {
        const picked = mcpShops().filter((s, i) => m.querySelector('[data-mcp-shop="' + i + '"]').checked).map((s) => s.name);
        if (!picked.length) { toast('Select at least one shop'); return; }
        conn.shops = picked.length === mcpShops().length ? 'all' : picked;
        close(); toast('Shop access updated'); renderAiMcp();
      },
    });
  }

  function revokeMcpConnection(id) {
    const conn = mcpConnections.find((c) => c.id === id);
    if (!conn) return;
    confirm({
      title: 'Revoke this connection?', okText: 'Revoke', danger: true,
      content: conn.host + ' loses access right away. Anyone using it will have to authorize again.',
      onOk: () => {
        mcpConnections = mcpConnections.filter((c) => c.id !== id);
        toast('Connection revoked'); renderAiMcp();
      },
    });
  }

  function revokeMcpToken(id) {
    const token = mcpTokens.find((t) => t.id === id);
    if (!token) return;
    confirm({
      title: 'Revoke this token?', okText: 'Revoke', danger: true,
      content: 'Any host still using "' + token.purpose + '" stops working immediately.',
      onOk: () => {
        mcpTokens = mcpTokens.filter((t) => t.id !== id);
        toast('Token revoked'); renderAiMcp();
      },
    });
  }

  function openMcpTokenModal() {
    const serverOptions = MCP_SERVERS.filter((s) => s.auth !== 'none')
      .map((s) => '<option value="' + esc(s.name) + '">' + esc(s.name) + '</option>').join('');
    const shopOptions = mcpShops().map((s) => '<option value="' + esc(s.name) + '">' + esc(s.name) + '</option>').join('');
    modal({
      title: 'Issue MCP token', width: 520, okText: 'Issue token',
      body:
        '<div class="sp-field"><label class="sp-label">Server</label>' +
          '<select id="mcp-t-server" class="sp-input">' + serverOptions + '</select>' +
          '<div class="muted" style="font-size:12px;margin-top:5px">A token works on one server address only.</div></div>' +
        '<div class="sp-field"><label class="sp-label">Shop</label>' +
          '<select id="mcp-t-shop" class="sp-input">' + shopOptions + '</select>' +
          '<div class="muted" style="font-size:12px;margin-top:5px">A token works on one shop only.</div></div>' +
        '<div class="sp-field"><label class="sp-label">Purpose</label>' +
          '<input id="mcp-t-purpose" class="sp-input" maxlength="60" placeholder="Example: Cursor local development"/>' +
          '<div class="sp-err" data-err="mcp-t-purpose"></div></div>',
      onOk: (m, close) => {
        const purpose = m.querySelector('#mcp-t-purpose').value.trim();
        setErr(m, 'mcp-t-purpose', '');
        if (!purpose) { setErr(m, 'mcp-t-purpose', 'Please enter a purpose'); return; }
        const server = m.querySelector('#mcp-t-server').value;
        const shop = m.querySelector('#mcp-t-shop').value;
        mcpTokens.push({
          id: 't' + (Date.now() % 100000), server, shop, purpose,
          created: 'Sep 7, 2026', lastUsed: 'Never used',
        });
        close(); renderAiMcp(); revealMcpToken(server, shop);
      },
    });
  }

  // The plaintext token is shown exactly once and can never be read again.
  function revealMcpToken(server, shop) {
    const value = 'bcmcp_' + server.toLowerCase().replace(/[^a-z]/g, '') + '_' + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 10);
    const ref = modal({
      title: 'Copy your token now', width: 540, okText: 'I have copied it', hideCancel: true,
      body:
        '<div class="mcp-note" style="margin-bottom:14px"><span>' + I.info + '</span><div>' +
          '<strong>This is the only time the token is shown</strong>' +
          '<p>Store it in the host configuration straight away. If you lose it, revoke this token and issue a new one.</p>' +
        '</div></div>' +
        '<div class="mcp-reveal"><code>' + esc(value) + '</code>' +
          '<button class="btn btn-gray" data-mcp-copy-token>Copy</button></div>' +
        '<div class="muted" style="font-size:12.5px;line-height:1.6;margin-top:12px">' +
          esc(server) + ' · ' + esc(shop) + ' · send it as the Authorization header.</div>',
      onOk: (_m, close) => close(),
    });
    ref.m.querySelector('[data-mcp-copy-token]').onclick = () => {
      try { navigator.clipboard.writeText(value); } catch (e) {}
      toast('Token copied');
    };
  }

  const ROUTES = {
    notifications: renderNotifications,
    base: renderShopifyStore,
    subscriptions: renderSubscriptions,
    domains: renderDomains,
    payments: renderPayments,
    'advertising-analytics': renderAdvertisingAnalyticsV2,
    currency: renderCurrency,
    metafields: renderMetafields,
    'shippable-locations': renderLocations,
    'shipping-rates': renderRates,
    roles: renderRoles,
    staff: renderStaff,
    'ai-mcp': renderAiMcp,
  };

  let curRest = '';
  // settings dirty bar: any edit in the content flips the shell header to "You have unsaved changes"
  function wireDirty() {
    if (!root || root.__dirtyWired) return;
    root.__dirtyWired = true;
    const onEdit = () => {
      if (!window.SettingsChrome) return;
      window.SettingsChrome.setDirty(true, {
        onDiscard: () => { show(curRest); if (window.SettingsChrome) window.SettingsChrome.setDirty(false); },
        onUpdate: () => { toast('Updated successfully'); if (window.SettingsChrome) window.SettingsChrome.setDirty(false); },
      });
    };
    root.addEventListener('input', onEdit);
    root.addEventListener('change', onEdit);
  }
  function show(rest) {
    removeDnsProviderOverlay();
    curRest = rest || '';
    const parts = String(rest || '').split('/').filter(Boolean);
    const key = ROUTES[parts[0]] ? parts[0] : 'base';
    const sub = parts[1];
    // reset / seed drill-down sub-states for the active sub-page
    mfResource = (key === 'metafields' && sub) ? decodeURIComponent(sub) : null;
    mfAdding = false;
    rateProfile = (key === 'shipping-rates' && sub != null && sub !== '')
      ? (sub === 'new' ? 'new' : Number(decodeURIComponent(sub))) : null;
    domainStep = (key === 'domains' && sub) ? sub : null;
    notifSub = (key === 'notifications' && sub != null && sub !== '') ? decodeURIComponent(sub) : null;
    notifEditorMode = key === 'notifications' && notifSub && parts[2] === 'edit' ? 'code' : 'preview';
    ROUTES[key]();
    if (key !== 'subscriptions') wireDirty();
    if (root && root.parentElement) root.parentElement.scrollTop = 0;
  }

  // ===========================================================================
  // page-scoped styles (Settings-only widgets layered on top of theme.css)
  // ===========================================================================
  const STYLES = `
  /* All Settings pages share a focused reading width. Forms retain the
     narrower 860px measure used by the live admin. */
  .set-page { width: 1120px; max-width: 100%; margin: 0 auto; }
  .set-page.set-narrow { width: 960px; }
  .domain-change-action { flex: 0 0 auto; min-width: 168px; justify-content: center; white-space: nowrap; }

  /* switch */
  .set-switch { display: inline-flex; align-items: center; width: 40px; height: 22px; border-radius: 9999px; background: var(--ctl); cursor: pointer; transition: background .15s; flex: none; padding: 2px; }
  .set-switch.on { background: var(--brand); }
  .set-knob { width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform .15s; box-shadow: 0 1px 2px rgb(0 0 0 / 20%); }
  .set-switch.on .set-knob { transform: translateX(18px); }

  /* upload tile */
  .up-tile { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; width: 104px; height: 104px; border: 1px dashed var(--ctl); border-radius: 8px; background: var(--panel); color: var(--ink-muted); cursor: pointer; }
  .up-tile:hover { border-color: var(--brand); color: var(--brand); }
  .up-plus { display: inline-flex; }
  .up-add { font-size: 11.5px; }
  .up-tile.filled { border-style: solid; background: #fff; position: relative; color: var(--ink-body); }
  .up-ico { color: var(--brand); }
  .up-name { font-size: 10.5px; max-width: 88px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .up-x { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 6px; border: none; background: rgba(0,0,0,.45); color: #fff; display: grid; place-items: center; cursor: pointer; }

  /* input addon (suffix/prefix) */
  .set-addon { display: inline-flex; align-items: stretch; }
  .set-addon .input { border-radius: var(--radius); }
  .set-addon-suffix, .set-addon-prefix { display: inline-flex; align-items: center; padding: 0 12px; border: 1px solid var(--ctl); background: var(--panel); font-size: 13px; color: var(--ink-body); }
  .set-addon-suffix { border-left: none; border-top-right-radius: var(--radius); border-bottom-right-radius: var(--radius); }
  .set-addon-prefix { border-right: none; border-top-left-radius: var(--radius); border-bottom-left-radius: var(--radius); }

  .set-range { flex: 1; accent-color: var(--brand); height: 4px; }

  /* note / banner box — borderless grey (mirrors reference rounded-md bg-[#f7f8fa]) */
  .set-note { background: #f7f8fb; border-radius: 8px; padding: 16px; }

  /* multi-select tag box (Add font modal — Ant Select mode=multiple look) */
  .ms-box { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; min-height: 36px; padding: 4px 8px; border: 1px solid var(--ctl); border-radius: 8px; background: #fff; cursor: text; }
  .ms-box:focus-within { border-color: var(--brand); }
  .ms-tag { display: inline-flex; align-items: center; gap: 6px; background: #f0f1f3; border-radius: 4px; padding: 2px 6px 2px 8px; font-size: 13px; color: var(--ink); }
  .ms-x { display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ink-muted); font-size: 14px; line-height: 1; }
  .ms-x:hover { color: var(--ink); }
  .ms-input { flex: 1; min-width: 60px; border: none; outline: none; background: transparent; font-size: 13px; height: 26px; color: var(--ink); }

  /* payments — processor logo + soft icon box (mirrors render.tsx + global .b-c) */
  .prov-block { margin-bottom: 24px; }
  .prov-block:last-child { margin-bottom: 0; }
  .prov-logo { display: flex; align-items: center; margin-bottom: 16px; }
  .prov-logo img { display: block; width: auto; object-fit: contain; }

  .pay-bc { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #f7f8fb; border-radius: 8px 8px 0 0; padding: 16px; }
  .pay-icons { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
  .pay-ico { height: 24px; width: auto; object-fit: contain; display: block; }
  .proc-radio { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--ctl); display: inline-grid; place-items: center; flex: none; }
  .set-radio.on .proc-radio, .set-radio2.on .proc-radio { border-color: var(--brand); }
  .proc-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand); }
  .set-radio { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink-body); cursor: pointer; }
  .set-radio2 { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; color: var(--ink-body); cursor: pointer; padding: 8px 10px; border: 1px solid var(--hair); border-radius: 8px; }
  .set-radio2.on { border-color: var(--brand); background: #e6f0ff; }

  /* currency flag chip */
  .ccy-flag { display: inline-grid; place-items: center; width: 22px; height: 16px; border-radius: 3px; background: var(--panel); border: 1px solid var(--hair); font-size: 9px; font-weight: 700; color: var(--ink-muted); letter-spacing: -.02em; }

  /* metafields */
  .mf-res { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 14px; border: 1px solid var(--hair); border-radius: 10px; background: var(--panel); cursor: pointer; }
  .mf-res:hover { background: #f1f3f8; }
  .mf-res-ico { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 8px; background: #fff; border: 1px solid var(--hair); color: var(--ink-muted); flex: none; font-size: 11px; font-weight: 600; }
  .mf-grip { cursor: move; color: var(--ink-muted); display: inline-flex; }
  .mf-type-ico { display: inline-grid; place-items: center; width: 24px; height: 24px; border-radius: 5px; border: 1px solid var(--hair); color: var(--ink-muted); flex: none; }
  .mf-blank-ico { display: grid; place-items: center; width: 72px; height: 72px; border-radius: 50%; background: #e6f0ff; color: var(--brand); }

  /* icon button (table row actions / dropdown trigger) */
  .set-icon-btn { display: inline-grid; place-items: center; width: 30px; height: 30px; border-radius: 7px; border: none; background: transparent; color: var(--ink-muted); cursor: pointer; }
  .set-icon-btn:hover { background: var(--panel); color: var(--ink); }
  .set-icon-btn.danger:hover { color: var(--err); }

  /* shippable locations table */
  .loc-table tbody tr { cursor: default; }
  .loc-caret { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; padding: 0; border: none; background: transparent; cursor: pointer; color: var(--ink-muted); transition: transform .15s; flex: none; }
  .loc-caret.open { transform: rotate(90deg); }

  /* dropdown row menu */
  .row-menu { position: absolute; z-index: 95; min-width: 120px; background: #fff; border: 1px solid var(--hair); border-radius: 8px; box-shadow: var(--float-shadow); padding: 4px; }
  .row-menu-item { display: block; width: 100%; text-align: left; padding: 7px 10px; border: none; background: transparent; font-size: 13px; color: var(--ink-body); border-radius: 6px; cursor: pointer; }
  .row-menu-item:hover { background: var(--panel); }
  .row-menu-item.danger { color: var(--err); }

  /* shipping rates */
  .rate-row { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 14px; border: 1px solid var(--hair); border-radius: 10px; background: var(--panel); cursor: pointer; }
  .rate-row:hover { background: #f1f3f8; }
  .rate-ico { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 8px; background: #fff; border: 1px solid var(--hair); color: var(--ink-muted); flex: none; }
  .zone-block { border: 1px solid var(--hair); border-radius: 12px; padding: 14px 16px; }
  .zone-ico { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 7px; background: #e6f0ff; color: var(--brand); flex: none; }
  .rate-list { border: 1px solid var(--hair); border-radius: 8px; overflow: hidden; }
  .rate-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #fff; border-bottom: 1px solid var(--hair); }
  .rate-item:last-child { border-bottom: none; }
  .rate-empty { border: 1px solid var(--hair); border-radius: 8px; background: var(--panel); padding: 16px; text-align: center; }
  .rate-free { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 6px; background: var(--ok-bg); color: #00684a; font-size: 12px; font-weight: 600; }
  .rate-price { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 6px; background: #e6f0ff; color: #0058c4; font-size: 12px; font-weight: 600; }
  .prod-thumb { display: inline-grid; place-items: center; width: 36px; height: 36px; border-radius: 6px; background: var(--panel); border: 1px solid var(--hair); color: var(--ink-muted); font-size: 10px; flex: none; }

  /* checkout preview (rate modal) */
  .checkout-preview { background: var(--panel); border-radius: 8px; padding: 14px; }
  .checkout-preview-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; background: #fff; border: 1px solid var(--hair); border-radius: 8px; padding: 10px 14px; }

  /* zone region picker */
  .zone-region-pick { max-height: 220px; overflow: auto; border: 1px solid var(--hair); border-radius: 8px; padding: 8px 12px; }

  /* preview modal frame */
  .preview-frame { display: grid; place-items: center; border: 1px solid var(--hair); border-radius: 10px; background: var(--panel); }
  `;

  // ---- SPA registration (the shell drives render + renders the sidebar) ----
  window.VIEWS = window.VIEWS || {};
  window.VIEWS.settings = { render: function (el, rest) { root = el; show(rest || 'base'); } };
})();
