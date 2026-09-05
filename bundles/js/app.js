/* BestCheckout Admin · Bundles — list + transactional editor.
   Quantity-break offers only. No widget styling, Mix & Match, or storefront preview. */
(function () {
  const D = window.DATA_BUNDLES;
  let root;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => n == null || n === '' ? '—' : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const svg = (p, w) => '<svg viewBox="0 0 24 24" width="' + (w || 16) + '" height="' + (w || 16) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  const I = {
    back: svg('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>', 18),
    plus: svg('<path d="M12 5v14M5 12h14"/>', 15),
    trash: svg('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>', 16),
    eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'),
  };
  const STYLES =
    '.bn-sw{position:relative;display:inline-block;width:34px;height:18px;border-radius:9999px;background:var(--ctl);cursor:pointer;transition:background .15s;flex:none}' +
    '.bn-sw::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .15s;box-shadow:0 1px 2px rgba(0,0,0,.2)}' +
    '.bn-sw.on{background:var(--brand)}.bn-sw.on::after{transform:translateX(16px)}' +
    '.bn-act{display:inline-grid;place-items:center;width:30px;height:30px;border:0;border-radius:7px;background:transparent;color:var(--ink-muted);cursor:pointer}' +
    '.bn-act:hover{background:var(--panel);color:var(--ink)}.bn-act.danger:hover{color:var(--err);background:#fdece8}' +
    '.bn-editor{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:24px;align-items:start;max-width:1220px;margin:0 auto}' +
    '.bn-preview-card{position:sticky;top:16px}' +
    '.bn-chip{height:28px;padding:0 10px;border:1px solid var(--ctl);border-radius:999px;background:#fff;font-size:12px;color:var(--ink);cursor:pointer}' +
    '.bn-chip.on{border-color:var(--brand);background:#eef4ff;color:var(--brand);font-weight:650}' +
    '.bn-ck{background:#f5f5f5;border:1px solid var(--hair);border-radius:12px;padding:16px 14px}' +
    '.bn-ck-head{display:flex;align-items:center;gap:8px;margin-bottom:12px}' +
    '.bn-ck-badge{flex:none;height:18px;display:inline-flex;align-items:center;justify-content:center;background:#111;color:#fff;font-size:10px;font-weight:700;border-radius:4px;padding:0 6px;line-height:1}' +
    '.bn-ck-info{flex:1;min-width:0}' +
    '.bn-ck-title{flex:1;min-width:0;display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.bn-ck-pr{display:flex;align-items:baseline;gap:6px;flex:none;white-space:nowrap}' +
    '.bn-ck-pr strong{font-size:13.5px}' +
    '.bn-ck-pr s{font-size:12px;color:var(--ink-muted)}' +
    '.bn-ck-deal{display:flex;align-items:center;justify-content:flex-end;gap:5px;margin:2px 0 10px;font-size:12px;color:var(--ink-muted)}' +
    '.bn-ck-child{display:flex;gap:12px;align-items:center;margin:0 0 12px}' +
    '.bn-ck-child:last-child{margin-bottom:0}' +
    '.bn-ck-img{width:40px;height:40px;border-radius:8px;overflow:hidden;background:#e9ecf2;position:relative;flex:none}' +
    '.bn-ck-img img{width:100%;height:100%;object-fit:cover;display:block}' +
    '.bn-ck-qty{position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;border-radius:50%;background:#5c5f62;color:#fff;font-size:10px;font-weight:600;display:flex;align-items:center;justify-content:center;padding:0 4px;box-shadow:0 0 0 2px #f5f5f5}' +
    '.bn-ck-inc{display:inline-flex;align-items:center;flex:none;margin:0;padding:2px 7px;border-radius:6px;background:#fff2e3;color:#d9822b;font-size:10.5px;font-weight:700}' +
    '.bn-tbl{width:100%;min-width:880px;table-layout:fixed}' +
    '.bn-tbl th,.bn-tbl td{padding:12px 16px}' +
    '.bn-tbl th:last-child,.bn-tbl td:last-child{width:72px;padding-right:16px;text-align:center}' +
    '.bn-tbl td{white-space:nowrap}' +
    '.bn-tbl .bn-clip{overflow:hidden;text-overflow:ellipsis}' +
    '.bn-tbl .bn-tiers{white-space:normal;line-height:1.45}' +
    '@media(max-width:980px){.bn-editor{grid-template-columns:1fr}.bn-preview-card{position:static}}';
  function statusSwitch(on, id) {
    return '<label class="flex items-center gap-2" style="cursor:pointer" data-stop>' +
      '<span class="bn-sw' + (on ? ' on' : '') + '" data-toggle="' + esc(id) + '" role="switch" aria-checked="' + (on ? 'true' : 'false') + '"></span>' +
      '<span style="font-size:13px">' + (on ? 'Active' : 'Deactivated') + '</span></label>';
  }
  const toast = (msg) => {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#242833;color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;z-index:200;box-shadow:0 8px 24px rgba(0,0,0,.18)';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  };
  const card = (title, inner, sub) =>
    '<div class="panel card-pad mb-4"><div class="mb-3"><div class="card-title">' + title + '</div>' +
    (sub ? '<div class="muted" style="font-size:12.5px;margin-top:3px;line-height:1.5">' + sub + '</div>' : '') +
    '</div>' + inner + '</div>';
  const label = (t, req) => '<div class="ctrl-label" style="text-transform:none;margin-bottom:6px">' + t + (req ? ' <span style="color:var(--err)">*</span>' : '') + '</div>';
  function matchShopifyProductId(value, query) {
    const raw = String(value || '').toLowerCase();
    const q = String(query || '').trim().toLowerCase();
    if (!q || !raw) return false;
    if (raw.indexOf(q) >= 0) return true;
    const digits = q.replace(/\D/g, '');
    const idDigits = raw.replace(/\D/g, '');
    return !!(digits && idDigits && idDigits.indexOf(digits) >= 0);
  }
  const fieldErr = (msg) => msg ? '<div class="bn-err" style="color:var(--err);font-size:12px;margin-top:5px">' + esc(msg) + '</div>' : '';
  function clearMarkedError(key, el, box) {
    if (key) delete ERRORS[key];
    [el, box].forEach((node) => {
      if (!node) return;
      node.classList.remove('has-error');
      if (node.previousElementSibling && node.previousElementSibling.classList.contains('ui-select')) {
        node.previousElementSibling.classList.remove('has-error');
      }
      node.querySelectorAll('.bn-err').forEach((n) => n.remove());
      if (node.parentNode) node.parentNode.querySelectorAll(':scope > .bn-err').forEach((n) => n.remove());
    });
  }
  const PROD_IMGS = [
    'https://silixwear.com/cdn/shop/files/Dark-GRAY.jpg?v=1776154216&width=160',
    'https://silixwear.com/cdn/shop/files/01_cf6e37ef-a0ab-4c82-ac61-c30d06d3111e.jpg?width=160',
    'https://silixwear.com/cdn/shop/files/01_50091071-d25f-4060-9fce-acd28e12ce10.jpg?width=160',
    'https://silixwear.com/cdn/shop/files/7_3bd5ccd0-0637-4559-b7be-1cd8196b15d4.jpg?width=160',
  ];
  function productImage(name, explicit) {
    if (explicit) return explicit;
    const s = String(name || '');
    if (!s) return '';
    let h = 0, i = 0;
    for (; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return PROD_IMGS[h % PROD_IMGS.length];
  }
  function productThumb(name, explicit, px) {
    const size = px || 40;
    const src = productImage(name, explicit);
    return '<span class="bn-thumb" style="width:' + size + 'px;height:' + size + 'px;border-radius:8px;overflow:hidden;background:#e9ecf2;color:#9aa3b2;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;flex:none">' +
      (src ? '<img src="' + esc(src) + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.remove()" />' : 'IMG') +
      '</span>';
  }

  const byId = (id) => D.bundles.find((b) => String(b.id) === String(id));
  const STATUS = { active: { label: 'Active', cls: 'pill-green' }, draft: { label: 'Deactivated', cls: 'pill-gray' } };
  const parentName = (b) => String((b && b.parentProduct) || '').trim();
  function activeSiblingOf(bundle, nextStatus) {
    const parent = parentName(bundle);
    if (nextStatus !== 'active' || !parent) return null;
    const id = bundle && bundle.id != null ? String(bundle.id) : '';
    return D.bundles.find((b) => String(b.id) !== id && parentName(b) === parent && b.status === 'active') || null;
  }
  function deactivateActiveSiblings(bundle) {
    const parent = parentName(bundle);
    if (!parent) return;
    const id = bundle && bundle.id != null ? String(bundle.id) : '';
    D.bundles.forEach((b) => { if (String(b.id) !== id && parentName(b) === parent && b.status === 'active') b.status = 'draft'; });
  }
  function setBundleStatus(bundle, nextStatus) {
    if (!bundle) return;
    if (nextStatus === 'active') deactivateActiveSiblings(bundle);
    bundle.status = nextStatus;
  }
  function confirmReplaceActive(bundle, onOk) {
    const conflict = activeSiblingOf(bundle, 'active');
    if (!conflict) { onOk(); return; }
    window.UI.confirm({
      title: 'Replace the current active Bundle?',
      content: parentName(bundle) + ' already has an active Bundle: ' + (conflict.name || conflict.id) + '. Activating ' + (bundle.name || 'this Bundle') + ' will deactivate the current one.',
      okText: 'Replace and activate',
      onOk: onOk,
    });
  }
  const pill = (m) => '<span class="pill ' + m.cls + '">' + esc(m.label) + '</span>';
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const nextId = () => {
    const nums = D.bundles.map((b) => Number(String(b.id).replace(/\D/g, ''))).filter((n) => !isNaN(n));
    return 'BND-' + String((nums.length ? Math.max.apply(null, nums) : 0) + 1).padStart(2, '0');
  };

  if (window.I18N && window.I18N.extend) {
    window.I18N.extend({
      'Bundles': '套装',
      'Add bundle': '添加套装',
      'Quantity breaks used when BestCheckout prices the order. Create the same offer here if Shopify already uses a third-party bundle app.': 'BestCheckout 计价时使用的数量档。如果 Shopify 上已有第三方套装应用，请在这里创建对应的优惠。',
      'If you already use Kaching, Pumper, Rapid, or another bundle app, Shopify does not let BestCheckout read that app\'s data. Create the same quantity breaks here so checkout can price them.': '如果您已在使用 Kaching、Pumper、Rapid 等第三方套装应用，受 Shopify 限制，BestCheckout 无法同步这些应用里的数据。请在这里重新创建一次相同的数量档，结账才能按对应价格计价。',
      'BestCheckout cannot read offers from Kaching, Pumper, Rapid, or other bundle apps. Recreate the same quantity breaks here so checkout can price them.': 'BestCheckout 读不到 Kaching、Pumper、Rapid 等第三方套装应用里的优惠。请在这里重建相同数量档，结账才能按对应价格计价。',
      'Checkout pricing': '结账计价预览',
      'How BestCheckout will charge this product': '买家结账时，BestCheckout 会按选中档位这样计价。',
      'Order summary': '订单摘要',
      'This order': '本单金额',
      'Free': '免费',
      'Buy': '买',
      'No product selected': '未选择商品',
      'Add a product and at least one tier to preview checkout pricing.': '先选择商品并添加档位，才能预览结账计价。',
      'Parent product': '父商品',
      'Tiers': '档位',
      'Created': '创建时间',
      'No bundles yet': '还没有套装',
      'Create a quantity-break offer so checkout can price the same deal buyers see on Shopify.': '创建一个数量档优惠，让结账页能按买家在 Shopify 看到的同样规则计价。',
      'Bundle details': '套装详情',
      'Used by checkout when this product is in the cart. This is not a storefront widget.': '当购物车里有该商品时，结账会使用这条配置。这不是店铺装修组件。',
      'Bundle name': '套装名称',
      'Shopify product': 'Shopify 商品',
      'Quantity tiers': '数量档',
      'Each tier is a buy quantity, a locked selling price, and optional gifts.': '每一档包含购买数量、锁定售价和可选赠品。',
      'Each tier saves as one bundle rule: title, buy quantity, selling price, compare-at, and optional gifts.': '每一档对应一条 bundle 规则，保存档位标题、购买数量、售价、划线价和可选赠品。',
      'Tier title': '档位标题',
      'Shown as the Bundle parent line in checkout. Leave empty to save a blank title.': '会出现在结账页套装父行。可留空，保存时按空标题写入。',
      'e.g. 2 PCS': '例如 2 PCS',
      'Add tier': '添加档位',
      'Add gift': '添加赠品',
      'Buy quantity': '购买数量',
      'Selling price': '售价',
      'Compare-at': '划线价',
      'Gifts': '赠品',
      'Save bundle': '保存套装',
      'Enter a bundle name.': '请输入套装名称。',
      'Select a Shopify product.': '请选择一个 Shopify 商品。',
      'Enter a quantity of at least 1.': '请输入不小于 1 的数量。',
      'Each tier needs a different quantity.': '每一档的数量不能重复。',
      'Enter a price.': '请输入售价。',
      'Compare-at price must be greater than or equal to the selling price.': '划线价必须大于或等于售价。',
      'Add at least one tier.': '请至少添加一档。',
      'Select a gift product.': '请选择赠品商品。',
      'Gift quantity must be at least 1.': '赠品数量必须不小于 1。',
      'Bundle name': '套装名称',
      'Parent product': '父商品',
      'Product title': '商品标题',
      'Shopify product ID': 'Shopify 商品 ID',
      'Bundle ID': '套装 ID',
      'Search': '搜索',
      'Search bundle name': '搜索套装名称',
      'Search parent product': '搜索父商品',
      'Search product title': '搜索商品标题',
      'Search Shopify product ID': '搜索 Shopify 商品 ID',
      'Search SKU': '搜索 SKU',
      'Search bundle ID': '搜索套装 ID',
      'Edit bundle': '编辑套装',
      'Bundle': '套装',
      'Only one Bundle can be active for each product': '每个商品只能启用一个套装',
      'Replace the current active Bundle?': '要替换当前已启用的套装吗？',
      'Checkout applies this Bundle when the cart contains this product.': '购物车包含该商品时，结账会使用这个套装。',
      'Only one Bundle can be active for each product. The switch here is saved with the form.': '每个商品只能启用一个套装。这里的开关会随表单一并保存。',
      'Bundle saved and active': '套装已保存并启用',
      'Bundle saved': '套装已保存',
      'This Bundle was not found': '未找到该套装',
      'Reset': '重置',
      'All status': '全部状态',
      'Active': '已启用',
      'Deactivated': '已停用',
    });
  }

  const KW_FIELDS = [
    { value: 'name', label: 'Bundle name', placeholder: 'Search bundle name' },
    { value: 'product_title', label: 'Product title', placeholder: 'Search product title' },
    { value: 'product_id', label: 'Shopify product ID', placeholder: 'Search Shopify product ID' },
    { value: 'sku', label: 'SKU', placeholder: 'Search SKU' },
    { value: 'id', label: 'Bundle ID', placeholder: 'Search bundle ID' },
  ];
  let LST = { kw: '', kwApplied: '', kwType: 'name', status: '', page: 1, size: 20 };

  function listRows() {
    let rows = D.bundles.slice();
    if (LST.kwApplied) {
      const q = LST.kwApplied.toLowerCase();
      rows = rows.filter((b) => {
        if (LST.kwType === 'parent' || LST.kwType === 'product_title') return (b.parentProduct || '').toLowerCase().indexOf(q) >= 0;
        if (LST.kwType === 'product_id') return matchShopifyProductId(b.parentProductId, q);
        if (LST.kwType === 'sku') return String(b.parentSku || '').toLowerCase().indexOf(q) >= 0;
        if (LST.kwType === 'id') return String(b.id).toLowerCase().indexOf(q) >= 0;
        return (b.name || '').toLowerCase().indexOf(q) >= 0;
      });
    }
    if (LST.status) rows = rows.filter((b) => b.status === LST.status);
    return rows;
  }

  function toggleBundleStatus(bundle) {
    if (!bundle) return;
    if (bundle.status === 'active') {
      bundle.status = 'draft';
      toast('Deactivated');
      renderList();
      return;
    }
    confirmReplaceActive(bundle, () => {
      setBundleStatus(bundle, 'active');
      toast('Activated');
      renderList();
    });
  }

  function pagerHtml(page, pages) {
    const item = (label, p, opts) => {
      opts = opts || {};
      return '<span class="pg-item' + (opts.active ? ' active' : '') + (opts.disabled ? ' disabled' : '') + '"' + (opts.disabled ? '' : ' data-page="' + p + '"') + '>' + label + '</span>';
    };
    let nums = '';
    for (let p = 1; p <= pages; p++) nums += item(String(p), p, { active: p === page });
    return '<div class="pg">' + item('‹', page - 1, { disabled: page <= 1 }) + nums + item('›', page + 1, { disabled: page >= pages }) +
      '<select class="pg-size" id="bn-pgsize">' + ['20', '50', '100'].map((s) => '<option value="' + s + '"' + (Number(s) === LST.size ? ' selected' : '') + '>' + s + ' / page</option>').join('') + '</select></div>';
  }

  function renderList() {
    if (!D.bundles.length) return renderEmpty();
    const all = listRows();
    const total = all.length;
    const pages = Math.max(1, Math.ceil(total / LST.size));
    if (LST.page > pages) LST.page = pages;
    const pageRows = all.slice((LST.page - 1) * LST.size, (LST.page - 1) * LST.size + LST.size);
    const kwField = KW_FIELDS.find((o) => o.value === LST.kwType) || KW_FIELDS[0];
    const kwOpts = KW_FIELDS.map((o) => '<option value="' + o.value + '"' + (LST.kwType === o.value ? ' selected' : '') + '>' + o.label + '</option>').join('');
    const statusOpts = '<option value="">All status</option><option value="active"' + (LST.status === 'active' ? ' selected' : '') + '>Active</option><option value="draft"' + (LST.status === 'draft' ? ' selected' : '') + '>Deactivated</option>';
    const searchIco = svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', 16);
    const tags = [];
    if (LST.kwApplied) tags.push('<span class="field-pill" data-clear="kw">' + esc(kwField.label) + ': ' + esc(LST.kwApplied) + ' <span class="x">&times;</span></span>');
    if (LST.status) tags.push('<span class="field-pill" data-clear="status">Status: ' + (LST.status === 'active' ? 'Active' : 'Deactivated') + ' <span class="x">&times;</span></span>');
    const rows = pageRows.map((b) =>
      '<tr data-id="' + b.id + '" style="cursor:pointer">' +
        '<td><div class="bn-clip" style="font-weight:600;color:var(--ink)">' + esc(b.name) + '</div><div class="muted bn-clip" style="font-size:12px">' + esc(b.id) + '</div></td>' +
        '<td><div class="flex items-center gap-2" style="min-width:0"><span style="flex:none">' + productThumb(b.parentProduct, b.parentImage, 36) + '</span><div style="min-width:0"><div class="bn-clip">' + esc(b.parentProduct) + '</div>' +
          ((b.parentSku || b.parentProductId) ? '<div class="muted bn-clip" style="font-size:12px">' + esc([b.parentSku, b.parentProductId].filter(Boolean).join(' · ')) + '</div>' : '') +
        '</div></div></td>' +
        '<td class="bn-tiers">' + (b.tiers || []).map((t) => esc(t.title || ('Buy ' + t.qty)) + ' · ' + money(t.price)).join('<br>') + '</td>' +
        '<td>' + statusSwitch(b.status === 'active', b.id) + '</td>' +
        '<td class="muted">' + esc(b.createdAt) + '</td>' +
        '<td style="text-align:center;white-space:nowrap" data-stop>' +
          '<button class="bn-act" data-view="' + b.id + '" title="View" aria-label="View">' + I.eye + '</button>' +
        '</td>' +
      '</tr>').join('');

    root.innerHTML =
      '<style>' + STYLES + '</style>' +
      '<div class="flex items-center justify-between mb-4" style="gap:12px"><div><h1 class="page-title">Bundles</h1>' +
        '<div class="muted" style="font-size:13px;margin-top:3px;line-height:1.5">BestCheckout cannot read offers from Kaching, Pumper, Rapid, or other bundle apps. Recreate the same quantity breaks here so checkout can price them.</div></div>' +
        '<a class="btn btn-primary" href="#/bundles/new">Add bundle</a></div>' +
      '<div class="panel">' +
        '<div class="card-pad" style="padding-bottom:8px"><div class="filter-bar">' +
          '<div class="flex items-center" style="min-width:400px">' +
            '<select class="filter-select" id="bn-kwtype" data-ui-fit data-ui-match-width style="border-top-right-radius:0;border-bottom-right-radius:0">' + kwOpts + '</select>' +
            '<div style="position:relative;flex:1">' +
              '<input class="filter-input" id="bn-kw" placeholder="' + esc(kwField.placeholder) + '" value="' + esc(LST.kw) + '" style="width:100%;padding-left:12px;padding-right:32px;border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px" />' +
              '<span class="filter-ico">' + searchIco + '</span>' +
            '</div></div>' +
          '<select class="filter-select" id="bn-statusf" style="width:150px">' + statusOpts + '</select>' +
        '</div>' + (tags.length ? '<div class="flex items-center gap-2 mt-3" style="flex-wrap:wrap" id="bn-tags">' + tags.join('') + '</div>' : '') + '</div>' +
        '<div style="overflow-x:auto"><table class="tbl bn-tbl">' +
          '<thead><tr><th style="width:24%">Bundle</th><th style="width:26%">Parent product</th><th style="width:22%">Tiers</th><th style="width:148px">Status</th><th style="width:108px">Created</th><th style="width:72px;text-align:center">Action</th></tr></thead>' +
          '<tbody id="bn-tbody">' + (pageRows.length ? rows : '<tr><td colspan="6" style="text-align:center;padding:40px" class="muted">No bundles match these filters.</td></tr>') + '</tbody>' +
        '</table></div>' +
        '<div class="flex items-center justify-between card-pad"><span class="muted" style="font-size:13px">Total ' + total + ' records</span>' + pagerHtml(LST.page, pages) + '</div>' +
      '</div>';
    if (window.I18N && window.I18N.apply) window.I18N.apply(root);
    wireList();
  }

  function wireList() {
    const kwType = root.querySelector('#bn-kwtype');
    const kw = root.querySelector('#bn-kw');
    if (kwType) kwType.onchange = () => {
      LST.kwType = kwType.value;
      if (kw) {
        const field = KW_FIELDS.find((o) => o.value === LST.kwType) || KW_FIELDS[0];
        kw.placeholder = field.placeholder || 'Search';
        if (window.I18N && window.I18N.apply) window.I18N.apply(kw);
      }
      if (LST.kwApplied) { LST.page = 1; renderList(); }
    };
    const commitKw = () => { LST.kwApplied = (LST.kw || '').trim(); LST.page = 1; renderList(); };
    if (kw) {
      kw.oninput = () => { LST.kw = kw.value; };
      kw.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); commitKw(); } };
      kw.onblur = commitKw;
    }
    const stf = root.querySelector('#bn-statusf'); if (stf) stf.onchange = () => { LST.status = stf.value; LST.page = 1; renderList(); };
    root.querySelectorAll('#bn-tags [data-clear]').forEach((tg) => tg.onclick = () => {
      const k = tg.getAttribute('data-clear');
      if (k === 'kw') { LST.kw = ''; LST.kwApplied = ''; }
      if (k === 'status') LST.status = '';
      LST.page = 1; renderList();
    });
    const ps = root.querySelector('#bn-pgsize'); if (ps) ps.onchange = () => { LST.size = Number(ps.value); LST.page = 1; renderList(); };
    root.querySelectorAll('.pg-item[data-page]').forEach((el) => el.onclick = () => { LST.page = Number(el.getAttribute('data-page')); renderList(); });
    root.querySelectorAll('#bn-tbody tr[data-id]').forEach((tr) => tr.onclick = (e) => { if (e.target.closest('[data-stop]')) return; location.hash = '#/bundles/edit/' + tr.getAttribute('data-id'); });
    root.querySelectorAll('[data-toggle]').forEach((sw) => sw.onclick = (e) => {
      e.stopPropagation();
      toggleBundleStatus(byId(sw.getAttribute('data-toggle')));
    });
    root.querySelectorAll('[data-view]').forEach((el) => el.onclick = (e) => { e.stopPropagation(); location.hash = '#/bundles/edit/' + el.getAttribute('data-view'); });
  }

  function renderEmpty() {
    root.innerHTML =
      '<div class="flex items-center justify-between mb-4"><h1 class="page-title">Bundles</h1></div>' +
      '<div class="panel placeholder" style="min-height:300px"><div style="text-align:center"><div style="font-weight:600;margin-bottom:6px;color:var(--ink)">No bundles yet</div>' +
      '<div class="muted" style="margin-bottom:16px;max-width:420px;margin-left:auto;margin-right:auto">Create a quantity-break offer so checkout can price the same deal buyers see on Shopify.</div>' +
      '<a class="btn btn-primary" href="#/bundles/new">Add bundle</a></div></div>';
    if (window.I18N && window.I18N.apply) window.I18N.apply(root);
  }

  let EDIT = null, EDIT_ID = null, EDIT_ORIGIN = null, ERRORS = {}, previewSel = 0;
  const snapshot = () => JSON.stringify({ name: EDIT.name, parentProduct: EDIT.parentProduct, parentProductId: EDIT.parentProductId, parentSku: EDIT.parentSku, parentImage: EDIT.parentImage, status: EDIT.status, tiers: EDIT.tiers });
  const syncUnsaved = () => { if (window.UI && window.UI.setUnsavedBar) window.UI.setUnsavedBar(root, EDIT_ORIGIN !== null && snapshot() !== EDIT_ORIGIN); };

  function blankTier() { return { title: '', qty: '', price: '', compareAt: '', gifts: [] }; }

  function renderEditor(bundle) {
    EDIT_ID = bundle ? bundle.id : null;
    EDIT = {
      name: bundle ? bundle.name : '',
      parentProduct: bundle ? bundle.parentProduct : '',
      parentProductId: bundle ? bundle.parentProductId : '',
      parentSku: bundle ? bundle.parentSku : '',
      parentImage: bundle ? bundle.parentImage : '',
      status: bundle ? bundle.status : 'active',
      tiers: clone((bundle && bundle.tiers && bundle.tiers.length) ? bundle.tiers : D.samples.volume.tiers),
    };
    ERRORS = {};
    previewSel = Math.max(0, ((EDIT.tiers || []).length >= 2 ? 1 : 0));
    EDIT_ORIGIN = snapshot();
    paintEditor();
  }

  function previewHtml() {
    const product = String(EDIT.parentProduct || '').trim();
    const tiers = EDIT.tiers || [];
    if (previewSel >= tiers.length) previewSel = Math.max(0, tiers.length - 1);
    if (previewSel < 0) previewSel = 0;
    if (!product) {
      return '<div class="muted" style="font-size:12.5px;line-height:1.55">Add a product and at least one tier to preview checkout pricing.</div>';
    }
    const selected = tiers[previewSel] || {};
    const qty = selected.qty || 1;
    const price = selected.price === '' || selected.price == null ? null : Number(selected.price);
    const compare = selected.compareAt === '' || selected.compareAt == null ? null : Number(selected.compareAt);
    const save = (compare != null && price != null && compare > price) ? (compare - price) : 0;
    const gifts = (selected.gifts || []).filter((g) => String(g.product || '').trim());
    const title = String(selected.title || '').trim() || (qty + ' PCS');
    const chips = tiers.map((t, i) =>
      '<button type="button" class="bn-chip' + (i === previewSel ? ' on' : '') + '" data-ptier="' + i + '">' + esc(String(t.title || '').trim() || ('Buy ' + (t.qty || (i + 1)))) + '</button>'
    ).join('');
    const TAG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>';
    const thumb = (src, q) =>
      '<span class="bn-ck-img">' + (src ? '<img src="' + esc(src) + '" alt="" onerror="this.remove()" />' : '') +
        '<span class="bn-ck-qty">' + esc(q) + '</span></span>';
    const child = (name, image, q) =>
      '<div class="bn-ck-child">' + thumb(name ? productImage(name, image) : '', q) +
        '<div class="bn-ck-info"><div class="bn-ck-title"><span class="bn-ck-inc">Included</span><span>' + esc(name) + '</span></div></div></div>';
    return '<div class="flex gap-2 mb-3" style="flex-wrap:wrap">' + chips + '</div>' +
      '<div class="muted" style="font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin-bottom:10px">Order summary</div>' +
      '<div class="bn-ck i18n-skip">' +
        '<div class="bn-ck-head">' +
          '<span class="bn-ck-badge i18n-skip">Bundle</span>' +
          '<span class="bn-ck-title">' + esc(title) + '</span>' +
          '<span class="bn-ck-pr">' + (compare != null && save > 0 ? '<s>' + money(compare) + '</s>' : '') + '<strong>' + money(price) + '</strong></span>' +
        '</div>' +
        (save > 0 ? '<div class="bn-ck-deal">' + TAG + '<span>BUNDLE discount (−' + money(save) + ')</span></div>' : '') +
        child(product, EDIT.parentImage, qty) +
        gifts.map((g) => child(g.product, g.image, g.qty || 1)).join('') +
      '</div>';
  }

  function updatePreview() {
    const el = root.querySelector('#bn-preview');
    if (!el) return;
    el.innerHTML = previewHtml();
    if (window.I18N && window.I18N.apply) window.I18N.apply(el);
    root.querySelectorAll('#bn-preview [data-ptier]').forEach((card) => {
      card.onclick = () => { previewSel = Number(card.getAttribute('data-ptier')); updatePreview(); };
    });
  }

  function paintEditor() {
    const isEdit = !!EDIT_ID;
    const nameErr = ERRORS.name || '';
    const productErr = ERRORS.parentProduct || '';
    const tiersErr = ERRORS.tiers || '';
    const tierCards = (EDIT.tiers || []).map((tier, ti) => {
      const gifts = (tier.gifts || []).map((g, gi) =>
        '<div class="flex items-center gap-2" style="margin-top:8px">' +
          '<div class="flex items-center gap-2 pick-box' + (ERRORS['gift-' + ti + '-' + gi] ? ' has-error' : '') + '" style="flex:1;min-width:0;padding:8px 10px">' +
            productThumb(g.product, g.image, 32) +
            '<div style="font-size:13px;color:var(--ink);min-width:0">' + (esc(g.product) || '<span class="muted">No gift selected</span>') + '</div>' +
            (ERRORS['gift-' + ti + '-' + gi] ? fieldErr(ERRORS['gift-' + ti + '-' + gi]) : '') +
          '</div>' +
          '<input class="input bn-gift-qty' + (ERRORS['gift-' + ti + '-' + gi] ? ' has-error' : '') + '" data-ti="' + ti + '" data-gi="' + gi + '" type="number" min="1" value="' + esc(g.qty) + '" style="width:88px" />' +
          '<button type="button" class="back-btn" data-rm-gift="' + ti + ':' + gi + '" title="Remove gift" style="width:30px;height:30px;color:var(--ink-muted)">' + I.trash + '</button>' +
        '</div>').join('');
      return '<div class="bn-tier" style="border:1px solid var(--hair);border-radius:10px;padding:14px 16px;margin-bottom:12px">' +
        '<div class="flex items-center justify-between mb-3"><div style="font-weight:650;color:var(--ink)">Tier ' + (ti + 1) + '</div>' +
          ((EDIT.tiers || []).length > 1 ? '<button type="button" class="back-btn" data-rm-tier="' + ti + '" title="Remove tier" style="width:30px;height:30px;color:var(--ink-muted)">' + I.trash + '</button>' : '') +
        '</div>' +
        '<div style="margin-bottom:12px">' + label('Tier title') +
          '<input class="input bn-title" data-ti="' + ti + '" value="' + esc(tier.title || '') + '" placeholder="e.g. 2 PCS" maxlength="255" />' +
          '<div class="muted" style="font-size:12px;margin-top:4px">Shown as the Bundle parent line in checkout. Leave empty to save a blank title.</div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">' +
          '<div>' + label('Buy quantity', true) + '<input class="input bn-qty' + (ERRORS['qty-' + ti] ? ' has-error' : '') + '" data-ti="' + ti + '" type="number" min="1" value="' + esc(tier.qty) + '" />' + fieldErr(ERRORS['qty-' + ti]) + '</div>' +
          '<div>' + label('Selling price', true) + '<input class="input bn-price' + (ERRORS['price-' + ti] ? ' has-error' : '') + '" data-ti="' + ti + '" type="number" min="0" step="0.01" value="' + esc(tier.price) + '" />' + fieldErr(ERRORS['price-' + ti]) + '</div>' +
          '<div>' + label('Compare-at') + '<input class="input bn-compare' + (ERRORS['compare-' + ti] ? ' has-error' : '') + '" data-ti="' + ti + '" type="number" min="0" step="0.01" value="' + esc(tier.compareAt) + '" />' + fieldErr(ERRORS['compare-' + ti]) + '</div>' +
        '</div>' +
        '<div class="mt-3">' + label('Gifts') +
          (gifts || '<div class="muted" style="font-size:12.5px">No gifts on this tier.</div>') +
          '<button type="button" class="btn btn-default mt-2" data-add-gift="' + ti + '" style="height:32px">' + I.plus + '<span style="margin-left:6px">Add gift</span></button>' +
        '</div>' +
      '</div>';
    }).join('');

    root.innerHTML =
      '<style>' + STYLES + '</style>' +
      '<div class="bn-editor">' +
        '<div>' +
        '<div class="flex items-center gap-2 mb-5"><a class="back-btn" href="#/bundles" title="Back">' + I.back + '</a>' +
          '<div><div class="page-title">' + (isEdit ? 'Edit bundle' : 'Add bundle') + '</div>' +
          '<div class="muted" style="font-size:13px;margin-top:2px">Used by checkout when this product is in the cart. This is not a storefront widget.</div></div></div>' +
        card('Bundle details',
          '<div style="margin-bottom:14px">' + label('Bundle name', true) +
            '<input class="input' + (nameErr ? ' has-error' : '') + '" id="bn-name" value="' + esc(EDIT.name) + '" placeholder="e.g. Coffee Office Pack" />' + fieldErr(nameErr) + '</div>' +
          '<div style="margin-bottom:14px">' + label('Shopify product', true) +
            '<div class="pick-box' + (productErr ? ' has-error' : '') + '" style="display:flex;align-items:center;gap:12px;padding:12px">' +
              productThumb(EDIT.parentProduct, EDIT.parentImage, 44) +
              '<div style="flex:1;min-width:0"><div style="font-size:13.5px;color:var(--ink);font-weight:500">' + (esc(EDIT.parentProduct) || '<span class="muted">No product selected</span>') + '</div>' +
              '<div class="muted" style="font-size:12px">' + [EDIT.parentSku, EDIT.parentProductId].filter(Boolean).map(esc).join(' · ') + ([EDIT.parentSku, EDIT.parentProductId].filter(Boolean).length ? ' · ' : '') + 'Checkout applies this Bundle when the cart contains this product.</div></div>' +
              '<button class="btn btn-default" data-act="pick-parent">' + (EDIT.parentProduct ? 'Change' : 'Add product') + '</button></div>' + fieldErr(productErr) + '</div>' +
          '<div>' + label('Status') +
            '<label class="flex items-center gap-2" style="cursor:pointer;font-size:13.5px">' +
              '<span class="bn-sw' + (EDIT.status === 'active' ? ' on' : '') + '" id="bn-status" role="switch" aria-checked="' + (EDIT.status === 'active' ? 'true' : 'false') + '"></span>' +
              '<span id="bn-status-lbl">' + (EDIT.status === 'active' ? 'Active' : 'Deactivated') + '</span></label>' +
            '<div class="muted" style="font-size:12px;margin-top:4px">Only one Bundle can be active for each product. The switch here is saved with the form.</div></div>') +
        card('Quantity tiers',
          '<div class="muted" style="font-size:12.5px;margin-bottom:12px">Each tier saves as one bundle rule: title, buy quantity, selling price, compare-at, and optional gifts.</div>' +
          fieldErr(tiersErr) + tierCards +
          '<button type="button" class="btn btn-default" data-add-tier>' + I.plus + '<span style="margin-left:6px">Add tier</span></button>',
          '') +
        '<div class="flex items-center justify-between gap-2 mb-8">' +
          (isEdit ? '<button type="button" class="btn btn-default" data-act="delete" style="color:var(--err);border-color:#f3c4ba">Delete</button>' : '<span></span>') +
          '<div class="flex items-center gap-2"><a class="btn btn-default" href="#/bundles">' + (isEdit ? 'Back' : 'Cancel') + '</a>' +
          '<button class="btn btn-primary" data-act="save">Save bundle</button></div>' +
        '</div>' +
        '</div>' +
        '<div class="bn-preview-card">' + card('Checkout preview', '<div id="bn-preview">' + previewHtml() + '</div>') + '</div>' +
        (window.UI && window.UI.unsavedBar ? window.UI.unsavedBar({ show: false }) : '') +
      '</div>';
    if (window.I18N && window.I18N.apply) window.I18N.apply(root);
    syncUnsaved();
    wireEditor();
  }

  function readEditor() {
    const name = root.querySelector('#bn-name');
    if (name) EDIT.name = name.value;
    const status = root.querySelector('#bn-status');
    if (status) EDIT.status = status.classList.contains('on') ? 'active' : 'draft';
    root.querySelectorAll('.bn-title').forEach((el) => { const t = EDIT.tiers[Number(el.getAttribute('data-ti'))]; if (t) t.title = el.value; });
    root.querySelectorAll('.bn-qty').forEach((el) => { const t = EDIT.tiers[Number(el.getAttribute('data-ti'))]; if (t) t.qty = el.value; });
    root.querySelectorAll('.bn-price').forEach((el) => { const t = EDIT.tiers[Number(el.getAttribute('data-ti'))]; if (t) t.price = el.value; });
    root.querySelectorAll('.bn-compare').forEach((el) => { const t = EDIT.tiers[Number(el.getAttribute('data-ti'))]; if (t) t.compareAt = el.value; });
    root.querySelectorAll('.bn-gift-qty').forEach((el) => {
      const t = EDIT.tiers[Number(el.getAttribute('data-ti'))];
      const g = t && t.gifts[Number(el.getAttribute('data-gi'))];
      if (g) g.qty = el.value;
    });
  }

  function validate() {
    ERRORS = {};
    if (!String(EDIT.name || '').trim()) ERRORS.name = 'Enter a bundle name.';
    if (!String(EDIT.parentProduct || '').trim()) ERRORS.parentProduct = 'Select a Shopify product.';
    if (!(EDIT.tiers || []).length) ERRORS.tiers = 'Add at least one tier.';
    const seen = {};
    (EDIT.tiers || []).forEach((tier, ti) => {
      const qty = Number(tier.qty);
      if (!tier.qty || isNaN(qty) || qty < 1 || Math.floor(qty) !== qty) ERRORS['qty-' + ti] = 'Enter a quantity of at least 1.';
      else if (seen[qty]) ERRORS['qty-' + ti] = 'Each tier needs a different quantity.';
      else seen[qty] = true;
      const price = Number(tier.price);
      if (tier.price === '' || tier.price == null || isNaN(price) || price < 0) ERRORS['price-' + ti] = 'Enter a price.';
      if (tier.compareAt !== '' && tier.compareAt != null) {
        const compare = Number(tier.compareAt);
        if (isNaN(compare) || compare < 0) ERRORS['compare-' + ti] = 'Enter a valid compare-at price.';
        else if (!isNaN(price) && compare < price) ERRORS['compare-' + ti] = 'Compare-at price must be greater than or equal to the selling price.';
      }
      (tier.gifts || []).forEach((g, gi) => {
        if (!String(g.product || '').trim()) ERRORS['gift-' + ti + '-' + gi] = 'Select a gift product.';
        const gq = Number(g.qty);
        if (!g.qty || isNaN(gq) || gq < 1) ERRORS['gift-' + ti + '-' + gi] = 'Gift quantity must be at least 1.';
      });
    });
    return !Object.keys(ERRORS).length;
  }

  function persist(status) {
    const payload = {
      id: EDIT_ID || nextId(),
      name: String(EDIT.name || '').trim(),
      parentProduct: String(EDIT.parentProduct || '').trim(),
      parentProductId: EDIT.parentProductId || '',
      parentSku: EDIT.parentSku || '',
      parentImage: EDIT.parentImage || productImage(EDIT.parentProduct),
      template: 'volume',
      status: status,
      tierCount: (EDIT.tiers || []).length,
      orders: EDIT_ID && byId(EDIT_ID) ? byId(EDIT_ID).orders : 0,
      createdAt: EDIT_ID && byId(EDIT_ID) ? byId(EDIT_ID).createdAt : '2026-09-05',
      tiers: (EDIT.tiers || []).map((t) => ({
        title: String(t.title || '').trim(),
        qty: Number(t.qty),
        price: Number(t.price),
        compareAt: t.compareAt === '' || t.compareAt == null ? '' : Number(t.compareAt),
        gifts: (t.gifts || []).map((g) => ({ product: g.product, image: g.image || productImage(g.product), qty: Number(g.qty) })),
      })),
    };
    const existing = EDIT_ID ? byId(EDIT_ID) : null;
    if (existing) Object.assign(existing, payload);
    else D.bundles.unshift(payload);
    EDIT_ID = payload.id;
    return payload;
  }

  function saveBundle() {
    readEditor();
    if (!validate()) { paintEditor(); toast('Fix the highlighted fields before saving.'); return; }
    const apply = () => {
      persist(EDIT.status);
      EDIT_ORIGIN = snapshot();
      toast(EDIT.status === 'active' ? 'Bundle saved and active' : 'Bundle saved');
      location.hash = '#/bundles';
    };
    if (EDIT.status === 'active') confirmReplaceActive({ id: EDIT_ID, name: EDIT.name, parentProduct: EDIT.parentProduct, status: EDIT.status }, apply);
    else apply();
  }

  function wireEditor() {
    const name = root.querySelector('#bn-name');
    if (name) name.oninput = () => {
      EDIT.name = name.value;
      if (String(name.value || '').trim()) clearMarkedError('name', name);
      syncUnsaved();
      updatePreview();
    };
    const status = root.querySelector('#bn-status');
    if (status) status.onclick = () => {
      EDIT.status = EDIT.status === 'active' ? 'draft' : 'active';
      status.classList.toggle('on', EDIT.status === 'active');
      status.setAttribute('aria-checked', EDIT.status === 'active' ? 'true' : 'false');
      const lbl = root.querySelector('#bn-status-lbl');
      if (lbl) lbl.textContent = EDIT.status === 'active' ? 'Active' : 'Deactivated';
      syncUnsaved();
    };
    root.querySelectorAll('.bn-title, .bn-qty, .bn-price, .bn-compare, .bn-gift-qty').forEach((el) => el.oninput = () => {
      readEditor();
      const ti = el.getAttribute('data-ti');
      const gi = el.getAttribute('data-gi');
      if (el.classList.contains('bn-qty') && String(el.value || '').trim()) clearMarkedError('qty-' + ti, el);
      if (el.classList.contains('bn-price') && String(el.value || '').trim()) clearMarkedError('price-' + ti, el);
      if (el.classList.contains('bn-compare') && String(el.value || '').trim()) clearMarkedError('compare-' + ti, el);
      if (el.classList.contains('bn-gift-qty') && String(el.value || '').trim()) clearMarkedError('gift-' + ti + '-' + gi, el, el.previousElementSibling);
      syncUnsaved();
      updatePreview();
    });
    root.querySelectorAll('#bn-preview [data-ptier]').forEach((card) => {
      card.onclick = () => { previewSel = Number(card.getAttribute('data-ptier')); updatePreview(); };
    });
    const pick = root.querySelector('[data-act="pick-parent"]');
    if (pick) pick.onclick = () => {
      window.UI.productPicker({
        multiple: false,
        selected: EDIT.parentProduct ? [EDIT.parentProduct] : [],
        onConfirm: (picked) => {
          EDIT.parentProduct = picked[0] ? picked[0].name : '';
          EDIT.parentProductId = picked[0] && picked[0].id ? String(picked[0].id) : '';
          EDIT.parentSku = picked[0] && picked[0].sku ? picked[0].sku : '';
          EDIT.parentImage = picked[0] ? (picked[0].image || productImage(picked[0].name)) : '';
          if (EDIT.parentProduct) delete ERRORS.parentProduct;
          paintEditor();
          syncUnsaved();
        },
      });
    };
    const addTier = root.querySelector('[data-add-tier]');
    if (addTier) addTier.onclick = () => { readEditor(); EDIT.tiers.push(blankTier()); paintEditor(); };
    root.querySelectorAll('[data-rm-tier]').forEach((btn) => btn.onclick = () => {
      readEditor();
      const i = Number(btn.getAttribute('data-rm-tier'));
      if (EDIT.tiers.length <= 1) return;
      EDIT.tiers.splice(i, 1);
      paintEditor();
    });
    root.querySelectorAll('[data-add-gift]').forEach((btn) => btn.onclick = () => {
      const ti = Number(btn.getAttribute('data-add-gift'));
      window.UI.productPicker({
        multiple: false,
        onConfirm: (picked) => {
          readEditor();
          if (!EDIT.tiers[ti].gifts) EDIT.tiers[ti].gifts = [];
          EDIT.tiers[ti].gifts.push({ product: picked[0] ? picked[0].name : '', image: picked[0] ? picked[0].image : '', qty: 1 });
          const gi = EDIT.tiers[ti].gifts.length - 1;
          if (EDIT.tiers[ti].gifts[gi].product) delete ERRORS['gift-' + ti + '-' + gi];
          paintEditor();
        },
      });
    });
    root.querySelectorAll('[data-rm-gift]').forEach((btn) => btn.onclick = () => {
      readEditor();
      const parts = btn.getAttribute('data-rm-gift').split(':');
      const t = EDIT.tiers[Number(parts[0])];
      if (t) t.gifts.splice(Number(parts[1]), 1);
      paintEditor();
    });
    const del = root.querySelector('[data-act="delete"]');
    if (del) del.onclick = () => {
      if (!EDIT_ID) return;
      window.UI.confirm({
        title: 'Delete bundle',
        content: 'Delete ' + (EDIT.name || EDIT_ID) + '? Checkout will no longer use these quantity breaks.',
        okText: 'Delete',
        danger: true,
        onOk: () => {
          D.bundles = D.bundles.filter((b) => String(b.id) !== String(EDIT_ID));
          toast('Deleted');
          location.hash = '#/bundles';
        },
      });
    };
    const save = root.querySelector('[data-act="save"]');
    if (save) save.onclick = saveBundle;
    const discard = root.querySelector('[data-act="discard"]');
    if (discard) discard.onclick = () => { renderEditor(EDIT_ID ? byId(EDIT_ID) : null); };
    const saveBar = root.querySelector('[data-act="save-bar"]');
    if (saveBar) saveBar.onclick = saveBundle;
  }

  function route(rest) {
    const parts = String(rest || '').split('/').filter(Boolean);
    if (!parts.length) return renderList();
    if (parts[0] === 'new' || parts[0] === 'create') return renderEditor(null);
    if (parts[0] === 'edit' && parts[1]) {
      const bundle = byId(parts[1]);
      if (!bundle) { toast('This Bundle was not found'); return renderList(); }
      return renderEditor(bundle);
    }
    const maybe = byId(parts[0]);
    if (maybe) return renderEditor(maybe);
    renderList();
  }

  window.VIEWS = window.VIEWS || {};
  window.VIEWS.bundles = { render: function (el, rest) { root = el; route(rest || ''); } };
})();
