/* BestCheckout Admin · Bundles — list + editor.
   Quantity-break offer on a Shopify parent product. Active Bundle replaces
   that product's purchase area. Subscriptions stay in Subscriptions. */
(function () {
  const D = window.DATA_BUNDLES;
  let root;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => n == null || n === '' || isNaN(Number(n)) ? '—' : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: (Number(n) % 1 ? 2 : 0), maximumFractionDigits: 2 });
  const svg = (p, w) => '<svg viewBox="0 0 24 24" width="' + (w || 16) + '" height="' + (w || 16) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  const I = {
    back: svg('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>', 18),
    plus: svg('<path d="M12 5v14M5 12h14"/>', 15),
    x: svg('<path d="M18 6 6 18M6 6l12 12"/>', 15),
    trash: svg('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>', 16),
    eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>', 18),
    layers: svg('<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>', 22),
  };
  const STYLES =
    '.bn-sw{position:relative;display:inline-block;width:34px;height:18px;border-radius:9999px;background:var(--ctl);cursor:pointer;transition:background .15s;flex:none}' +
    '.bn-sw::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .15s;box-shadow:0 1px 2px rgba(0,0,0,.2)}' +
    '.bn-sw.on{background:var(--brand)}.bn-sw.on::after{transform:translateX(16px)}' +
    '.bn-tbl{width:100%;table-layout:fixed}' +
    '.bn-tbl th,.bn-tbl td{padding:12px 16px}' +
    '.bn-tbl th:last-child,.bn-tbl td:last-child{width:72px;padding-right:16px;text-align:center}' +
    '.bn-tbl td{white-space:nowrap}' +
    '.bn-tbl .bn-clip{overflow:hidden;text-overflow:ellipsis}' +
    '.bn-tbl .bn-tiers{white-space:normal;line-height:1.55}' +
    '.bn-tbl .bn-tiers>div{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.bn-pdp{border:1px solid var(--hair);border-radius:12px;padding:14px 14px 16px;background:#fff}' +
    '.bn-pdp-head{font-size:16px;font-weight:700;margin:0 0 14px}' +
    '.bn-pdp-card{position:relative;border:1.5px solid var(--hair);border-radius:10px;padding:11px 12px;margin-bottom:8px;cursor:pointer;background:#fff}' +
    '.bn-ribbon{position:absolute;top:-8px;right:12px;z-index:2;background:var(--ribbon,#8a5a2b);color:#fff;font-size:10px;font-weight:700;line-height:1.2;letter-spacing:.02em;padding:4px 10px;border-radius:999px;white-space:nowrap;pointer-events:none}' +
    '.bn-pdp-radio{flex:none;width:15px;height:15px;border-radius:50%;border:1.5px solid var(--ctl);display:inline-grid;place-items:center}' +
    '.bn-pdp-dot{width:7px;height:7px;border-radius:50%}' +
    '.bn-pdp-title{font-size:13px;font-weight:650;color:var(--ink);line-height:1.3}' +
    '.bn-pdp-sub{font-size:11.5px;color:var(--ink-muted);margin-top:2px}' +
    '.bn-pdp-price{font-size:13.5px;font-weight:750;white-space:nowrap}' +
    '.bn-pdp-compare{font-size:12px;color:var(--ink-muted);font-weight:400}' +
    '.bn-pdp-tag{display:inline-block;margin-left:6px;color:#fff;font-size:10px;font-weight:700;border-radius:4px;padding:1px 6px;vertical-align:1px}' +
    '.bn-pdp-gift{display:flex;align-items:center;gap:8px;margin:8px -12px -11px;padding:7px 12px;color:#fff;font-size:11.5px;border-radius:0 0 8px 8px}' +
    '.bn-pdp-gift img{width:28px;height:28px;border-radius:5px;object-fit:cover;background:rgba(255,255,255,.2)}' +
    '.bn-pdp-opt{margin:10px 0 0}' +
    '.bn-pdp-opt label{display:block;font-size:11px;font-weight:650;color:var(--ink-muted);margin-bottom:4px}' +
    '.bn-pdp-opt select{width:100%;height:32px;border:1px solid var(--ctl);border-radius:7px;padding:0 8px;font-size:12.5px;background:#fff}' +
    '.bn-pdp-cta{width:100%;height:42px;margin-top:12px;border:0;border-radius:8px;color:#fff;font-size:13.5px;font-weight:700;cursor:default}' +
    '.bn-pdp-note{font-size:11.5px;line-height:1.45;color:var(--ink-muted);margin-top:8px}' +
    '.bc-sticky-rail{position:sticky;top:16px;align-self:flex-start;max-height:calc(100vh - 32px);overflow-y:auto}' +
    '@media(max-width:980px){.bc-sticky-rail{position:static;max-height:none;overflow:visible}}';
  const STATUS = { active: { label: 'Activated', cls: 'pill-green' }, draft: { label: 'Deactivated', cls: 'pill-gray' } };
  const statusPill = (status) => {
    const m = STATUS[status] || STATUS.draft;
    return '<span class="pill ' + m.cls + '">' + esc(m.label) + '</span>';
  };
  const toast = (msg) => {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#242833;color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;z-index:200;box-shadow:0 8px 24px rgba(0,0,0,.18)';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  };
  const card = (title, inner, right) =>
    '<div class="panel card-pad mb-4"><div class="flex items-center justify-between mb-3"><div class="card-title">' + title + '</div>' + (right || '') + '</div>' + inner + '</div>';
  const label = (t, req) => '<div class="ctrl-label" style="text-transform:none;margin-bottom:6px">' + t + (req ? ' <span style="color:var(--err)">*</span>' : '') + '</div>';
  const numInput = (cls, data, value, opts) => {
    opts = opts || {};
    const a = 'class="input ' + cls + '" ' + data + ' type="number"' + (opts.min != null ? ' min="' + opts.min + '"' : '') + (opts.step ? ' step="' + opts.step + '"' : '') + (opts.placeholder ? ' placeholder="' + esc(opts.placeholder) + '"' : '');
    return '<span class="bn-num" style="' + (opts.w ? 'width:' + opts.w : 'width:100%') + ';display:inline-flex;align-items:stretch;height:36px;border:1px solid var(--ctl);border-radius:var(--radius);overflow:hidden;background:#fff">' +
      '<input ' + a + ' value="' + (value == null ? '' : esc(value)) + '" style="flex:1;min-width:0;height:100%;border:0;border-radius:0;padding:0 10px" />' +
      '<span style="flex:none;width:20px;display:flex;flex-direction:column;border-left:1px solid var(--ctl)">' +
        '<button type="button" class="bn-nup" tabindex="-1" style="flex:1;border:0;background:#f3f4f8;cursor:pointer;color:var(--ink-muted);font-size:7px;line-height:0">&#9650;</button>' +
        '<button type="button" class="bn-ndn" tabindex="-1" style="flex:1;border:0;border-top:1px solid var(--ctl);background:#f3f4f8;cursor:pointer;color:var(--ink-muted);font-size:7px;line-height:0">&#9660;</button>' +
      '</span></span>';
  };
  const VAR_COLORS = ['Grey', 'Black', 'Navy', 'Olive', 'Sand', 'Off-White'];
  const VAR_SIZES = ['S', 'M', 'L', 'XL'];
  const VAR_LENGTHS = ['Full Length', '7/8 Length', 'Cropped'];
  const variantGroups = (count) => {
    count = Math.max(1, count || 1);
    if (count <= 1) return [];
    const g = [{ name: 'Color', values: VAR_COLORS }];
    if (count >= 3) g.push({ name: 'Size', values: VAR_SIZES });
    if (count >= 5) g.push({ name: 'Length', values: VAR_LENGTHS });
    return g;
  };
  const imgBox = (src, px) => '<span style="width:' + (px || 40) + 'px;height:' + (px || 40) + 'px;border-radius:6px;overflow:hidden;background:#e9ecf2;color:#9aa3b2;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;flex:none">' + (src ? '<img src="' + src + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.remove()" />' : 'IMG') + '</span>';
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
  const compImg = (c) => (c && c.image) || (c && c.product ? productImage(c.product) : '');

  const byId = (id) => D.bundles.find((b) => String(b.id) === String(id));
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
      content: parentName(bundle) + ' already has an active Bundle: ' + (conflict.name || conflict.id) + '. Activating ' + (bundle.name || 'this Bundle') + ' will take over that product page instead.',
      okText: 'Replace and activate',
      onOk: onOk,
    });
  }
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const nextId = () => {
    const nums = D.bundles.map((b) => Number(String(b.id).replace(/\D/g, ''))).filter((n) => !isNaN(n));
    return 'BND-' + String((nums.length ? Math.max.apply(null, nums) : 0) + 1).padStart(2, '0');
  };
  function bundleDisplayId(id) {
    const n = Number(String(id || '').replace(/\D/g, ''));
    return isNaN(n) || !String(id || '').replace(/\D/g, '') ? String(id || '') : String(n);
  }
  function normalizeComponent(c, fallbackQty) {
    c = c || {};
    return {
      role: c.role === 'gift' ? 'gift' : 'main',
      product: c.product || '',
      image: c.image || '',
      qty: c.qty != null && c.qty !== '' ? c.qty : fallbackQty,
      displayName: c.displayName || '',
      variants: c.variants,
    };
  }
  function normalizeTier(t, parent) {
    t = t || {};
    let components = (t.components || []).map((c) => normalizeComponent(c, t.qty));
    if (!components.length) {
      const gifts = (t.gifts || []).map((g) => normalizeComponent({
        role: 'gift', product: g.product, image: g.image, qty: g.qty, displayName: g.displayName, variants: g.variants,
      }, 1));
      components = [{ role: 'main', product: parent || '', image: t.image || '', qty: t.qty, displayName: '' }].concat(gifts);
    }
    if (!components.some((c) => c.role === 'main')) {
      components.unshift({ role: 'main', product: parent || '', image: '', qty: t.qty, displayName: '' });
    }
    return {
      title: t.title || '',
      subtitle: t.subtitle || '',
      qty: t.qty,
      price: t.price,
      compareAt: t.compareAt,
      badge: t.badge || '',
      tag: t.tag || '',
      components: components,
    };
  }

  if (window.I18N && window.I18N.extend) {
    window.I18N.extend({
      'Bundles': '套装',
      'Add bundle': '添加套装',
      'Create a quantity-break offer and show it on the Shopify product page.': '创建一个数量档优惠，并在 Shopify 商品页购买区展示。',
      'When a Bundle is active, BestCheckout replaces the purchase area on that Shopify product page. After you add a Bundle here, you don\'t need another bundle app such as Kaching or Rapi.': '套装启用后，BestCheckout 会接管该 Shopify 商品页的购买区。在 BestCheckout 添加套装后，无需再安装 Kaching、Rapi 等其他 Bundle 应用。',
      'No bundles yet': '还没有套装',
      'Create a quantity-break offer so BestCheckout can replace the purchase area on that Shopify product page.': '创建一个数量档优惠，让 BestCheckout 接管该 Shopify 商品页的购买区。',
      'Shown on product page': '展示在商品页',
      'Checkout intercept only': '仅结账拦截',
      'Edit bundle': '编辑套装',
      'Bundle details': '套装详情',
      'Bundle name': '套装名称',
      'Bundle ID': '套装 ID',
      'Shopify product': 'Shopify 商品',
      'When this Bundle is active, BestCheckout replaces the purchase area on this product page. Add to cart goes to BestCheckout with the selected pack.': '启用后，BestCheckout 会替换该商品页的购买区。加购会带着选中的档位进入 BestCheckout。',
      'Checkout applies this Bundle when the cart contains this product.': '购物车包含该商品时，结账会使用这个套装。',
      'Status': '状态',
      'Active': '已启用',
      'Deactivated': '已停用',
      'This bundle appears on this product\'s page.': '该套装显示在此商品的页面上。',
      'One parent product can have only one active Bundle. Draft/deactivated Bundles can be kept.': '每个父商品只能启用一个套装。停用的套装可以保留。',
      'Brand color': '品牌色',
      'Bundle configuration': '套装配置',
      'Alignment': '对齐',
      'Left': '左对齐',
      'Center': '居中',
      'Right': '右对齐',
      'Header line': '标题分隔线',
      'Add a line to the header title': '为标题添加一条分隔线',
      'Line thickness': '线条粗细',
      'Header text': '标题文字',
      'Button text': '按钮文字',
      'Buy Now': '立即购买',
      'Display settings & template': '展示设置与模板',
      'Widget template': '组件模板',
      'Volume · Buy X Get Y': '阶梯数量 · 买 X 送 Y',
      'Tiers': '档位',
      'Title': '标题',
      'Title tag': '标题标签',
      'e.g. 2 PCS': '例如 2 PCS',
      'e.g. 50% OFF': '例如 50% OFF',
      'optional': '选填',
      'Subtitle': '副标题',
      'Corner badge': '角标',
      'Default selection': '默认选中',
      'Pre-selected on the product page': '在商品页预先选中',
      'Buy qty': '购买数量',
      'Price': '售价',
      'Compare-at': '划线价',
      'Components (BOM)': '组件（清单）',
      'follows Parent product': '跟随父商品',
      'Display name (optional)': '展示名称（选填）',
      'No product': '未选择商品',
      'Add tier': '添加档位',
      'Add gift': '添加赠品',
      'Product name': '商品名称',
      'Product image': '商品图片',
      'Add to cart': '加入购物车',
      'Preview': '预览',
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
      'Bundle': '套装',
      'Only one Bundle can be active for each product': '每个商品只能启用一个套装',
      'Replace the current active Bundle?': '要替换当前已启用的套装吗？',
      'Bundle saved and active': '套装已保存并启用',
      'Bundle saved': '套装已保存',
      'Add Subscribe & Save?': '要加订阅省吗？',
      'This product page only shows one-time packs until you add a plan. Add Subscribe & Save so shoppers can pick subscribe on the product page.': '现在商品页只有一次性档位。加上订阅省后，买家才能在商品页选择订阅。',
      'Add subscription': '添加订阅',
      'Subscribe & Save': '订阅省',
      'This product page only shows one-time packs until you add a plan.': '现在商品页只有一次性档位。加上订阅后，买家才能在商品页选择订阅。',
      'Not now': '暂不加',
      'Fix the highlighted fields before saving.': '请先修正标红的字段再保存。',
      'Activated': '已启用',
      'Deleted': '已删除',
      "Can't delete this bundle": '不能删除这个套装',
      'This product has a subscription. Delete the subscription first.': '这个商品已经有订阅。请先删除订阅，再删套装。',
      'View subscription': '查看订阅',
      'OK': '确定',
      'This Bundle was not found': '未找到该套装',
      'Reset': '重置',
      'All status': '全部状态',
      'Product page preview': '商品页预览',
      'How the purchase area looks after BestCheckout takes it over.': 'BestCheckout 接管后，商品页购买区的样子。',
      'Add a product and at least one tier to preview the product page.': '先选择商品并添加档位，才能预览商品页购买区。',
      'Shopify options': 'Shopify 规格',
      'These options come from the Shopify product. They are not configured in the Bundle.': '规格来自 Shopify 商品，不在套装里配置。',
      'ADD TO CART': '加入购物车',
      'Opens BestCheckout checkout with this pack. Shopify cart is not used.': '带着当前档位打开 BestCheckout 结账，不写入 Shopify 购物车。',
      'No gift selected': '未选择赠品',
      'Pick or type': '选择或输入',
      'e.g. The offer ending soon': '例如 The offer ending soon',
      'e.g. You save 50%': '例如 You save 50%',
      'e.g. Save 50%': '例如 Save 50%',
    });
  }

  const KW_FIELDS = [
    { value: 'name', label: 'Bundle name', placeholder: 'Search bundle name' },
    { value: 'product_title', label: 'Product title', placeholder: 'Search product title' },
    { value: 'product_id', label: 'Shopify product ID', placeholder: 'Search Shopify product ID' },
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
        if (LST.kwType === 'id') return String(b.id).toLowerCase().indexOf(q) >= 0;
        return (b.name || '').toLowerCase().indexOf(q) >= 0;
      });
    }
    if (LST.status) rows = rows.filter((b) => b.status === LST.status);
    rows.sort((a, b) => {
      const da = String(a.createdAt || '');
      const db = String(b.createdAt || '');
      if (da !== db) return da < db ? 1 : -1;
      return Number(bundleDisplayId(b.id)) - Number(bundleDisplayId(a.id));
    });
    return rows;
  }

  function tierLines(b) {
    return (b.tiers || []).map((t) => (t.title || ('Buy ' + t.qty)) + ' · ' + money(t.price));
  }
  function tierTitle(b) {
    return tierLines(b).join('\n');
  }
  function tierCell(b) {
    const lines = tierLines(b);
    if (!lines.length) return '—';
    if (lines.length === 1) return esc(lines[0]);
    return '<div class="bn-tiers">' + lines.map((line) => '<div>' + esc(line) + '</div>').join('') + '</div>';
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
    const statusOpts = '<option value="">All status</option><option value="active"' + (LST.status === 'active' ? ' selected' : '') + '>Activated</option><option value="draft"' + (LST.status === 'draft' ? ' selected' : '') + '>Deactivated</option>';
    const searchIco = svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', 16);
    const tags = [];
    if (LST.kwApplied) tags.push('<span class="field-pill" data-clear="kw">' + esc(kwField.label) + ': ' + esc(LST.kwApplied) + ' <span class="x">&times;</span></span>');
    if (LST.status) tags.push('<span class="field-pill" data-clear="status">Status: ' + (LST.status === 'active' ? 'Activated' : 'Deactivated') + ' <span class="x">&times;</span></span>');
    const rows = pageRows.map((b) =>
      '<tr data-id="' + b.id + '" style="cursor:pointer">' +
        '<td><div class="bn-clip" style="font-weight:600;color:var(--ink)" data-tip="' + esc(b.name || '') + '">' + esc(b.name) + '</div><div class="muted bn-clip" style="font-size:12px">Bundle ID：' + esc(bundleDisplayId(b.id)) + '</div></td>' +
        '<td><div class="flex items-center gap-2" style="min-width:0"><span style="flex:none">' + productThumb(b.parentProduct, b.parentImage, 36) + '</span><div class="bn-clip" data-tip="' + esc(b.parentProduct || '') + '">' + esc(b.parentProduct) + '</div></div></td>' +
        '<td class="bn-tiers" data-tip="' + esc(tierTitle(b)).replace(/\n/g, '&#10;') + '">' + tierCell(b) + '</td>' +
        '<td>' + statusPill(b.status) + '</td>' +
        '<td class="muted">' + esc(b.createdAt) + '</td>' +
        '<td style="text-align:center;white-space:nowrap" data-stop>' +
          '<button class="back-btn bn-view" data-view="' + b.id + '" title="View" style="width:30px;height:30px;color:var(--ink-muted)">' + I.eye + '</button>' +
        '</td>' +
      '</tr>').join('');

    root.innerHTML =
      '<style>' + STYLES + '</style>' +
      '<div class="flex items-center justify-between mb-4" style="gap:12px"><div><h1 class="page-title">Bundles</h1>' +
        '<div class="muted" style="font-size:13px;margin-top:3px;line-height:1.5;max-width:880px">When a Bundle is active, BestCheckout replaces the purchase area on that Shopify product page. After you add a Bundle here, you don\'t need another bundle app such as Kaching or Rapi.</div></div>' +
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
        '<div style="overflow-x:auto"><table class="tbl bn-tbl"><colgroup>' +
          '<col style="width:20%"><col style="width:22%"><col style="width:30%"><col style="width:11%"><col style="width:11%"><col style="width:6%">' +
        '</colgroup><thead><tr>' +
          '<th>Bundle name</th><th>Parent product</th><th>Tiers</th><th>Status</th><th>Created</th><th style="text-align:center">Action</th>' +
        '</tr></thead>' +
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
    root.querySelectorAll('[data-view]').forEach((el) => el.onclick = (e) => { e.stopPropagation(); location.hash = '#/bundles/edit/' + el.getAttribute('data-view'); });
  }

  function renderEmpty() {
    root.innerHTML =
      '<div class="flex items-center justify-between mb-4"><h1 class="page-title">Bundles</h1></div>' +
      '<div class="panel placeholder" style="min-height:300px"><div style="text-align:center"><div style="font-weight:600;margin-bottom:6px;color:var(--ink)">No bundles yet</div>' +
      '<div class="muted" style="margin-bottom:16px;max-width:440px;margin-left:auto;margin-right:auto">Create a quantity-break offer so BestCheckout can replace the purchase area on that Shopify product page.</div>' +
      '<a class="btn btn-primary" href="#/bundles/new">Add bundle</a></div></div>';
    if (window.I18N && window.I18N.apply) window.I18N.apply(root);
  }

  let EDIT = null, EDIT_ID = null, EDIT_ORIGIN = null, ERRORS = {}, previewSel = 0, previewVar = {};
  const snapshot = () => JSON.stringify({
    name: EDIT.name, parentProduct: EDIT.parentProduct, parentProductId: EDIT.parentProductId,
    parentSku: EDIT.parentSku, parentImage: EDIT.parentImage, status: EDIT.status,
    brandColor: EDIT.brandColor, header: EDIT.header, buttonText: EDIT.buttonText,
    defaultTier: EDIT.defaultTier, tiers: EDIT.tiers,
  });
  function normalizeHeader(h) {
    h = h || {};
    return {
      text: h.text || '',
      align: h.align === 'left' || h.align === 'right' ? h.align : 'center',
      line: !!h.line,
      thickness: Number(h.thickness) > 0 ? Number(h.thickness) : 2,
    };
  }
  function brandColor() {
    return EDIT && EDIT.brandColor ? EDIT.brandColor : '#8a5a2b';
  }
  function buttonTextOf(src) {
    const raw = src && typeof src === 'object' ? src.buttonText : src;
    const t = String(raw == null ? '' : raw).trim();
    return t || 'Buy Now';
  }
  function ribbonBadge(text, color) {
    const t = String(text || '').trim();
    if (!t) return '';
    return '<span class="bn-ribbon" style="--ribbon:' + (color || '#8a5a2b') + '">' + esc(t) + '</span>';
  }
  function hexToRgba(hex, a) {
    const h = String(hex || '').replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(full, 16);
    if (isNaN(n)) return 'rgba(138,90,43,' + a + ')';
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  const syncUnsaved = () => { if (window.UI && window.UI.setUnsavedBar) window.UI.setUnsavedBar(root, EDIT_ORIGIN !== null && snapshot() !== EDIT_ORIGIN); };

  function blankTier() {
    const last = EDIT && EDIT.tiers && EDIT.tiers[EDIT.tiers.length - 1];
    const q = last && Number(last.qty) ? Number(last.qty) + 1 : 1;
    return {
      title: '', subtitle: '', qty: q, price: null, compareAt: null, badge: '', tag: '',
      components: [{ role: 'main', product: (EDIT && EDIT.parentProduct) || '', image: (EDIT && EDIT.parentImage) || '', qty: q, displayName: '' }],
    };
  }

  function closeBadgePop() { document.querySelectorAll('.bn-badge-layer').forEach((l) => l.remove()); }
  function openBadgePop(input, onPick) {
    closeBadgePop();
    const layer = document.createElement('div');
    layer.className = 'bn-badge-layer';
    layer.style.cssText = 'position:fixed;inset:0;z-index:130';
    const pop = document.createElement('div');
    pop.className = 'menu-pop';
    pop.style.cssText = 'position:fixed;padding:6px;max-height:240px;overflow:auto;min-width:' + Math.max(input.offsetWidth, 170) + 'px';
    const badges = D.badges || [];
    pop.innerHTML = '<div class="muted" style="padding:4px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.04em">Recommended</div>' +
      badges.map((b) => '<div class="opt" data-b="' + esc(b) + '" style="padding:8px 10px;cursor:pointer;border-radius:6px;font-size:13px">' + esc(b) + '</div>').join('');
    const r = input.getBoundingClientRect();
    pop.style.top = (r.bottom + 4) + 'px';
    pop.style.left = r.left + 'px';
    layer.appendChild(pop);
    document.body.appendChild(layer);
    pop.querySelectorAll('[data-b]').forEach((o) => o.onmousedown = (e) => {
      e.preventDefault();
      input.value = o.getAttribute('data-b');
      onPick(o.getAttribute('data-b'));
      closeBadgePop();
    });
    layer.onmousedown = (e) => { if (e.target === layer) closeBadgePop(); };
  }

  function renderEditor(bundle) {
    EDIT_ID = bundle ? bundle.id : null;
    const sample = clone(D.samples.volume);
    const parent = bundle ? bundle.parentProduct : '';
    EDIT = {
      name: bundle ? bundle.name : '',
      parentProduct: parent,
      parentProductId: bundle ? bundle.parentProductId : '',
      parentSku: bundle ? bundle.parentSku : '',
      parentImage: bundle ? bundle.parentImage : '',
      status: bundle ? bundle.status : 'active',
      brandColor: (bundle && bundle.brandColor) || sample.brandColor || '#8a5a2b',
      header: normalizeHeader((bundle && bundle.header) || sample.header),
      buttonText: buttonTextOf(bundle || sample),
      defaultTier: bundle && bundle.defaultTier != null ? bundle.defaultTier : (sample.defaultTier || 0),
      tiers: (bundle && bundle.tiers && bundle.tiers.length ? bundle.tiers : sample.tiers).map((t) => normalizeTier(t, parent || '')),
    };
    if (!bundle) {
      EDIT.parentProduct = '';
      EDIT.parentProductId = '';
      EDIT.parentSku = '';
      EDIT.parentImage = '';
      (EDIT.tiers || []).forEach((t) => {
        t.components = (t.components || []).filter((c) => c.role !== 'gift');
        const fm = (t.components || []).find((c) => c.role === 'main');
        if (fm) { fm.product = ''; fm.image = ''; }
      });
      const gift = window.UI && window.UI.cheapestActiveProduct ? window.UI.cheapestActiveProduct() : null;
      const dest = EDIT.tiers[EDIT.defaultTier] || EDIT.tiers[EDIT.tiers.length - 1];
      if (gift && dest) {
        dest.components.push({
          role: 'gift',
          product: gift.name,
          image: gift.image || productImage(gift.name),
          qty: 1,
          displayName: '',
          variants: gift.variants,
        });
      }
    }
    if (EDIT.defaultTier > EDIT.tiers.length - 1) EDIT.defaultTier = Math.max(0, EDIT.tiers.length - 1);
    ERRORS = {};
    previewSel = EDIT.defaultTier;
    previewVar = {};
    EDIT_ORIGIN = snapshot();
    paintEditor();
  }

  function pricedTier(tier) {
    const price = tier.price === '' || tier.price == null ? null : Number(tier.price);
    const compare = tier.compareAt === '' || tier.compareAt == null ? null : Number(tier.compareAt);
    return { price: price, compare: compare };
  }

  function previewHtml() {
    const tiers = EDIT.tiers || [];
    if (previewSel >= tiers.length) previewSel = Math.max(0, tiers.length - 1);
    if (previewSel < 0) previewSel = 0;
    const displayPrice = (tier) => (tier && tier.price !== '' && tier.price != null) ? Number(tier.price) : null;
    const bc = brandColor();
    const header = EDIT.header || {};
    const headAlign = header.align || 'center';
    const head = '<div style="text-align:' + headAlign + ';font-weight:700;color:' + bc + ';font-size:16px;margin-bottom:14px' +
      (header.line ? ';border-bottom:' + (header.thickness || 2) + 'px solid ' + bc + ';padding-bottom:8px' : '') +
      '">' + esc(header.text || 'Bundle') + '</div>';
    const cards = tiers.map((t, i) => {
      const on = i === previewSel;
      const mains = (t.components || []).filter((c) => c.role === 'main');
      const gifts = (t.components || []).filter((c) => c.role === 'gift' && String(c.product || '').trim());
      const badge = ribbonBadge(t.badge, bc);
      const radio = '<span style="flex:none;width:15px;height:15px;border-radius:50%;border:1.5px solid ' + (on ? bc : 'var(--ctl)') + ';display:inline-grid;place-items:center">' + (on ? '<span style="width:7px;height:7px;border-radius:50%;background:' + bc + '"></span>' : '') + '</span>';
      const variantRows = on ? mains.map((m, mi) => {
        const multi = (m.variants == null || m.variants > 1);
        const vcount = (m.variants == null ? 6 : m.variants);
        const qty = Math.max(1, Number(m.qty || t.qty) || 1);
        const groups = multi ? variantGroups(vcount) : [];
        let row = '<div class="flex items-center gap-2" style="margin-top:10px">' + imgBox(compImg(m), 40) +
          '<div style="flex:1;min-width:0;font-size:13px;color:var(--ink)">' + (esc(m.displayName) || esc(m.product) || 'Product') + '</div>' +
          '<span class="muted" style="font-size:13px;white-space:nowrap">&times; ' + qty + '</span></div>';
        if (groups.length) {
          row += '<div class="muted" style="font-size:11px;margin-top:8px;font-weight:600">' + groups.map((g) => esc(g.name)).join(', ') + '</div>';
          for (let k = 1; k <= qty; k++) {
            row += '<div class="flex items-center gap-2" style="margin-top:5px">' + (qty > 1 ? '<span style="font-size:11.5px;color:var(--ink-muted);width:22px;flex:none">#' + k + '</span>' : '') +
              '<div style="display:flex;gap:6px;flex:1;min-width:0">' +
              groups.map((g, gi) => {
                const key = i + ':' + mi + ':' + k + ':' + gi;
                const sidx = Math.min(previewVar[key] || 0, g.values.length - 1);
                return '<select class="bn-vsel" data-vsel="' + key + '" style="flex:1;min-width:0;height:30px;border:1px solid var(--ctl);border-radius:6px;padding:0 6px;font-size:12px;color:var(--ink-body);background:#fff;cursor:pointer">' +
                  g.values.map((v, vi) => '<option' + (vi === sidx ? ' selected' : '') + '>' + esc(v) + '</option>').join('') +
                '</select>';
              }).join('') +
              '</div></div>';
          }
        }
        return row;
      }).join('') : '';
      const giftRows = gifts.length ? '<div style="margin:10px -12px -12px;border-radius:0 0 6.5px 6.5px;overflow:hidden' + (on ? '' : ';opacity:0.5') + '">' + gifts.map((g, gi) => {
        const gmulti = (g.variants != null && g.variants > 1);
        const ggroups = gmulti ? variantGroups(g.variants) : [];
        const sel = ggroups.length ? '<div style="display:flex;gap:6px;flex:none;margin-left:auto">' + ggroups.map((gg, ggi) => {
          const key = 'g:' + i + ':' + gi + ':' + ggi;
          const sidx = Math.min(previewVar[key] || 0, gg.values.length - 1);
          return '<select class="bn-vsel" data-vsel="' + key + '" title="' + esc(gg.name) + '" style="height:26px;max-width:128px;border:1px solid rgba(255,255,255,0.55);border-radius:6px;padding:0 6px;font-size:11.5px;color:var(--ink-body);background:#fff;cursor:pointer">' +
            gg.values.map((v, vi) => '<option' + (vi === sidx ? ' selected' : '') + '>' + esc(v) + '</option>').join('') +
          '</select>';
        }).join('') + '</div>' : '';
        return '<div class="flex items-center gap-2" style="background:' + hexToRgba(bc, 0.78) + ';color:#fff;font-size:11.5px;padding:7px 12px' + (gi ? ';border-top:1px solid rgba(255,255,255,0.18)' : '') + '"><span style="width:38px;height:38px;border-radius:5px;overflow:hidden;background:rgba(255,255,255,0.25);flex:none;display:inline-block"><img src="' + compImg(g) + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.remove()" /></span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">+ ' + esc(g.displayName || g.product) + '</span>' + sel + '</div>';
      }).join('') + '</div>' : '';
      return '<div data-ptier="' + i + '" style="position:relative;overflow:visible;border:1.5px solid ' + (on ? bc : 'var(--hair)') + ';border-radius:8px;padding:12px;margin-bottom:10px;cursor:pointer">' + badge +
        '<div class="flex items-center justify-between" style="gap:8px">' +
          '<div class="flex items-center gap-2" style="min-width:0">' + radio +
            '<div style="min-width:0"><div class="flex items-center gap-2" style="flex-wrap:wrap"><span style="font-weight:600;color:var(--ink);font-size:13.5px">' + (esc(t.title) || (t.qty + ' PCS')) + '</span>' + (t.tag ? '<span style="background:' + bc + ';color:#fff;font-size:9.5px;font-weight:700;border-radius:4px;padding:2px 6px;white-space:nowrap">' + esc(t.tag) + '</span>' : '') + '</div>' +
              (t.subtitle ? '<div class="muted" style="font-size:11.5px">' + esc(t.subtitle) + '</div>' : '') + '</div>' +
          '</div>' +
          '<div style="text-align:right;flex:none"><span style="font-weight:700;color:' + bc + '">' + money(displayPrice(t)) + '</span>' + (t.compareAt ? ' <s class="muted" style="font-size:12px">' + money(t.compareAt) + '</s>' : '') + '</div>' +
        '</div>' + variantRows + giftRows + '</div>';
    }).join('');
    return '<div class="i18n-skip">' + head + cards +
      '<button class="btn" style="width:100%;justify-content:center;text-align:center;margin-top:10px;height:44px;font-size:14px;font-weight:600;background:' + bc + ';color:#fff;border:0;border-radius:8px">' + esc(buttonTextOf(EDIT)) + '</button>' +
    '</div>';
  }

  function updatePreview() {
    const el = root.querySelector('#bn-preview');
    if (!el) return;
    el.innerHTML = previewHtml();
    wirePreview();
  }

  function wirePreview() {
    root.querySelectorAll('#bn-preview [data-ptier]').forEach((card) => {
      card.onclick = () => { previewSel = Number(card.getAttribute('data-ptier')); updatePreview(); };
    });
    root.querySelectorAll('#bn-preview .bn-vsel[data-vsel]').forEach((el) => {
      el.onclick = (e) => e.stopPropagation();
      el.onmousedown = (e) => e.stopPropagation();
      el.onchange = (e) => { e.stopPropagation(); previewVar[el.getAttribute('data-vsel')] = el.selectedIndex; };
    });
  }

  function componentRow(c, ti, ci) {
    const firstMainCi = (EDIT.tiers[ti].components || []).findIndex((x) => x.role === 'main');
    const isParentMain = c.role === 'main' && ci === firstMainCi;
    const roleTag = c.role === 'main'
      ? '<span style="font-size:10px;font-weight:700;color:var(--brand);background:#e6f0ff;border-radius:3px;padding:1px 6px">MAIN</span>'
      : '<span style="font-size:10px;font-weight:700;color:#c2620f;background:#fff2e6;border-radius:3px;padding:1px 6px">GIFT</span>';
    const qtyCell = isParentMain
      ? '<span class="muted" style="font-size:12.5px;white-space:nowrap">× <b style="color:var(--ink)" data-mainqty="' + ti + '">' + (EDIT.tiers[ti].qty) + '</b></span>'
      : numInput('bn-cq', 'data-i="' + ti + '" data-ci="' + ci + '"', c.qty, { min: 1, w: '78px', placeholder: 'e.g. 1' });
    const canRemove = !isParentMain;
    const hint = isParentMain ? ' <span class="muted" style="font-size:11px">&middot; follows Parent product</span>' : '';
    const changeBtn = isParentMain ? '' : '<button class="back-btn bn-cp" data-i="' + ti + '" data-ci="' + ci + '" title="Change product" style="width:30px;height:30px;color:var(--ink-muted)">' + I.layers + '</button>';
    return '<div class="flex items-center gap-3" style="border:1px solid var(--hair);border-radius:8px;padding:10px;margin-bottom:8px;background:#fff">' +
      imgBox(compImg(c), 34) +
      '<div style="flex:1;min-width:0">' + roleTag + ' <span style="font-size:13px;color:var(--ink)">' + (esc(c.product) || '<span class="muted">No product</span>') + '</span>' + hint +
        '<input class="input bn-cn" data-i="' + ti + '" data-ci="' + ci + '" value="' + esc(c.displayName || '') + '" placeholder="Display name (optional)" style="height:30px;margin-top:6px;font-size:12.5px" /></div>' +
      qtyCell +
      changeBtn +
      (canRemove ? '<button class="back-btn bn-cr" data-i="' + ti + '" data-ci="' + ci + '" title="Remove" style="width:30px;height:30px;color:var(--ink-muted)">' + I.trash + '</button>' : '') +
    '</div>';
  }

  function tierCard(tier, ti) {
    const defaultCtrl = (EDIT.tiers || []).length > 1
      ? '<label class="flex items-center gap-1" style="cursor:pointer;font-size:12.5px;color:var(--ink-body)" title="Pre-selected on the product page"><input type="radio" name="bn-default" class="bn-default" data-i="' + ti + '"' + (EDIT.defaultTier === ti ? ' checked' : '') + ' style="width:14px;height:14px;accent-color:var(--brand);cursor:pointer" /> Default selection</label>'
      : '';
    const head = '<div class="flex items-center justify-between mb-3"><div style="font-weight:600;color:var(--ink);font-size:13.5px">Tier ' + (ti + 1) + '</div>' +
      '<div class="flex items-center gap-3">' + defaultCtrl +
      (ti > 0 ? '<button class="back-btn" data-rmtier="' + ti + '" title="Remove" style="width:28px;height:28px;color:var(--ink-muted)">' + I.x + '</button>' : '') +
      '</div></div>';
    const fields =
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">' +
        '<div>' + label('Buy qty') + numInput('bn-f', 'data-i="' + ti + '" data-k="qty"', tier.qty, { min: 1, placeholder: 'e.g. 2' }) + fieldErr(ERRORS['qty-' + ti]) + '</div>' +
        '<div>' + label('Title') + '<input class="input bn-f" data-i="' + ti + '" data-k="title" value="' + esc(tier.title || '') + '" placeholder="e.g. 2 PCS" /></div>' +
        '<div>' + label('Title tag') + '<input class="input bn-tag" data-i="' + ti + '" value="' + esc(tier.tag || '') + '" placeholder="e.g. 50% OFF" /></div>' +
        '<div>' + label('Subtitle') + '<input class="input bn-f" data-i="' + ti + '" data-k="subtitle" value="' + esc(tier.subtitle || '') + '" placeholder="optional" /></div>' +
        '<div>' + label('Price') + numInput('bn-f', 'data-i="' + ti + '" data-k="price"', (tier.price == null ? '' : tier.price), { min: 0, step: '0.01', placeholder: 'e.g. 49.30' }) + fieldErr(ERRORS['price-' + ti]) + '</div>' +
        '<div>' + label('Compare-at') + numInput('bn-f', 'data-i="' + ti + '" data-k="compareAt"', (tier.compareAt == null ? '' : tier.compareAt), { min: 0, step: '0.01', placeholder: 'e.g. 98' }) + fieldErr(ERRORS['compare-' + ti]) + '</div>' +
        '<div>' + label('Corner badge') + '<input class="input bn-badge" data-i="' + ti + '" value="' + esc(tier.badge || '') + '" placeholder="Pick or type" autocomplete="off" /></div>' +
      '</div>';
    const comps = '<div class="ctrl-label" style="text-transform:none;margin:14px 0 8px">Components (BOM)</div>' +
      (tier.components || []).map((c, ci) => componentRow(c, ti, ci)).join('') +
      '<div class="flex gap-2 mt-1"><button class="btn btn-default" data-addcomp="gift:' + ti + '">' + I.plus + ' Add gift</button></div>';
    return '<div class="panel card-pad mb-3" style="background:var(--panel)">' + head + fields + comps + '</div>';
  }

  function paintEditor() {
    const isEdit = !!EDIT_ID;
    const nameErr = ERRORS.name || '';
    const productErr = ERRORS.parentProduct || '';
    const tiersErr = ERRORS.tiers || '';
    root.innerHTML =
      '<style>' + STYLES + '</style>' +
      (window.UI && window.UI.unsavedBar ? window.UI.unsavedBar({ show: false }) : '') +
      '<div class="detail-wrap">' +
        '<div class="flex items-center justify-between mb-6"><div class="flex items-center gap-2">' +
          '<a class="back-btn" href="#/bundles" title="Back">' + I.back + '</a>' +
          '<span class="page-title">' + (isEdit ? 'Edit bundle' : 'Add bundle') + '</span>' +
          (isEdit ? ' ' + statusPill(EDIT.status) : '') +
        '</div>' + (isEdit ? '<span class="muted" style="font-size:13px">Bundle ID：' + esc(bundleDisplayId(EDIT_ID)) + '</span>' : '') + '</div>' +
        '<div class="detail-cols" style="max-width:1220px"><div class="detail-main">' +
        card('Bundle name',
          '<input class="input' + (nameErr ? ' has-error' : '') + '" id="bn-name" value="' + esc(EDIT.name) + '" placeholder="e.g. Focus Gum — Multipack" />' + fieldErr(nameErr)) +
        card('Shopify product',
          '<div class="pick-box' + (productErr ? ' has-error' : '') + '" style="display:flex;align-items:center;gap:12px;border:1px solid var(--hair);border-radius:8px;padding:12px">' +
            imgBox(compImg({ image: EDIT.parentImage, product: EDIT.parentProduct }), 40) +
            '<div style="flex:1;min-width:0"><div style="font-size:13.5px;color:var(--ink);font-weight:500">' + (esc(EDIT.parentProduct) || '<span class="muted">No product selected</span>') + '</div>' +
            '<div class="muted" style="font-size:12px">This bundle appears on this product\'s page.</div></div>' +
            '<button class="btn btn-default" data-act="pick-parent">' + ((EDIT.parentProduct || '').trim() ? 'Change' : 'Add product') + '</button></div>' + fieldErr(productErr)) +
        card('Display settings & template',
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
            '<div>' + label('Widget template') +
              '<select class="input" id="bn-tpl"><option selected>Volume · Buy X Get Y</option></select></div>' +
            '<div>' + label('Brand color') +
              '<div style="display:flex;align-items:center;gap:8px"><input type="color" id="bn-color" value="' + esc(EDIT.brandColor || '#8a5a2b') + '" style="width:44px;height:34px;border:1px solid var(--ctl);border-radius:6px;background:none;padding:2px;cursor:pointer" /><span class="muted" style="font-size:12.5px">' + esc(EDIT.brandColor || '#8a5a2b') + '</span></div></div>' +
          '</div>' +
          '<div style="margin-top:14px">' + label('Button text') +
            '<input class="input" id="bn-btn" value="' + esc(buttonTextOf(EDIT)) + '" placeholder="Buy Now" /></div>') +
        card('Bundle configuration',
          '<div style="display:grid;grid-template-columns:2fr 1fr;gap:14px">' +
            '<div>' + label('Header text') +
              '<input class="input" id="bn-htext" value="' + esc((EDIT.header && EDIT.header.text) || '') + '" placeholder="e.g. The offer ending soon" /></div>' +
            '<div>' + label('Alignment') +
              '<select class="input" id="bn-halign">' +
                ['left', 'center', 'right'].map((a) => '<option value="' + a + '"' + ((EDIT.header && EDIT.header.align) === a ? ' selected' : '') + '>' + a.charAt(0).toUpperCase() + a.slice(1) + '</option>').join('') +
              '</select></div>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;align-items:start">' +
            '<div>' + label('Header line') +
              '<label class="flex items-center gap-2" style="cursor:pointer;font-size:13.5px;color:var(--ink)"><input type="checkbox" id="bn-hline"' + (EDIT.header && EDIT.header.line ? ' checked' : '') + ' style="width:15px;height:15px;accent-color:var(--brand)" /> Add a line to the header title</label></div>' +
            (EDIT.header && EDIT.header.line
              ? '<div>' + label('Line thickness') +
                  '<div class="flex items-center gap-3"><input type="range" id="bn-hthick" min="1" max="10" step="1" value="' + (EDIT.header.thickness || 2) + '" style="flex:1;accent-color:var(--brand)" /><span id="bn-hthick-val" style="font-size:13px;color:var(--ink);width:42px;text-align:right">' + (EDIT.header.thickness || 2) + ' px</span></div></div>'
              : '<div></div>') +
          '</div>') +
        card('Tiers', fieldErr(tiersErr) + '<div id="bn-tiers">' + (EDIT.tiers || []).map(tierCard).join('') + '</div>' +
          '<button class="btn btn-default" data-act="add-tier">' + I.plus + ' Add tier</button>') +
        '<div class="flex items-center" style="margin-top:20px">' +
          (isEdit ? '<button type="button" class="btn btn-default" data-act="delete" style="color:var(--err);border-color:#f3c4ba">Delete</button>' : '<span></span>') +
          '<button class="btn btn-primary" data-act="save" style="margin-left:auto">' + (isEdit ? 'Save' : 'Add bundle') + '</button></div>' +
        '</div><div class="detail-rail bc-sticky-rail" style="width:400px;flex:0 0 400px">' +
          card('Status',
            '<div style="display:flex;flex-direction:column;gap:11px;padding:2px 0">' +
              '<label class="flex items-center gap-2" style="cursor:pointer;font-size:13.5px;color:var(--ink)"><input type="radio" name="bn-status" class="bn-statusr" value="active"' + (EDIT.status === 'active' ? ' checked' : '') + ' style="width:16px;height:16px;accent-color:var(--brand);cursor:pointer" /> Activated</label>' +
              '<label class="flex items-center gap-2" style="cursor:pointer;font-size:13.5px;color:var(--ink)"><input type="radio" name="bn-status" class="bn-statusr" value="draft"' + (EDIT.status === 'draft' ? ' checked' : '') + ' style="width:16px;height:16px;accent-color:var(--brand);cursor:pointer" /> Deactivated</label>' +
            '</div>') +
          subscribeGuideCard() +
          card('Preview', '<div id="bn-preview">' + previewHtml() + '</div>') +
        '</div></div>' +
      '</div>';
    if (window.I18N && window.I18N.apply) window.I18N.apply(root);
    syncUnsaved();
    wireEditor();
  }

  function readEditor() {
    const name = root.querySelector('#bn-name');
    if (name) EDIT.name = name.value;
    const status = root.querySelector('.bn-statusr:checked');
    if (status) EDIT.status = status.value;
    if (!EDIT.header) EDIT.header = normalizeHeader();
    const header = root.querySelector('#bn-htext');
    if (header) EDIT.header.text = header.value;
    const align = root.querySelector('#bn-halign');
    if (align) EDIT.header.align = align.value;
    const line = root.querySelector('#bn-hline');
    if (line) EDIT.header.line = line.checked;
    const thick = root.querySelector('#bn-hthick');
    if (thick) EDIT.header.thickness = Number(thick.value) || 2;
    const color = root.querySelector('#bn-color');
    if (color) EDIT.brandColor = color.value;
    const btn = root.querySelector('#bn-btn');
    if (btn) EDIT.buttonText = btn.value;
    const def = root.querySelector('.bn-default:checked');
    if (def) EDIT.defaultTier = Number(def.getAttribute('data-i') != null ? def.getAttribute('data-i') : def.getAttribute('data-ti'));
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
      (tier.components || []).forEach((c, ci) => {
        if (c.role !== 'gift') return;
        if (!String(c.product || '').trim()) ERRORS['gift-' + ti + '-' + ci] = 'Select a gift product.';
        const gq = Number(c.qty);
        if (!c.qty || isNaN(gq) || gq < 1) ERRORS['gift-' + ti + '-' + ci] = 'Gift quantity must be at least 1.';
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
      brandColor: EDIT.brandColor || '#8a5a2b',
      buttonText: buttonTextOf(EDIT),
      header: normalizeHeader({
        text: String((EDIT.header && EDIT.header.text) || '').trim(),
        align: EDIT.header && EDIT.header.align,
        line: EDIT.header && EDIT.header.line,
        thickness: EDIT.header && EDIT.header.thickness,
      }),
      defaultTier: Math.max(0, Math.min(Number(EDIT.defaultTier) || 0, (EDIT.tiers || []).length - 1)),
      tierCount: (EDIT.tiers || []).length,
      orders: EDIT_ID && byId(EDIT_ID) ? byId(EDIT_ID).orders : 0,
      createdAt: EDIT_ID && byId(EDIT_ID) ? byId(EDIT_ID).createdAt : '2026-09-18',
      tiers: (EDIT.tiers || []).map((t) => ({
        title: String(t.title || '').trim(),
        subtitle: String(t.subtitle || '').trim(),
        qty: Number(t.qty),
        price: Number(t.price),
        compareAt: t.compareAt === '' || t.compareAt == null ? '' : Number(t.compareAt),
        badge: String(t.badge || '').trim(),
        tag: String(t.tag || '').trim(),
        components: (t.components || []).map((c) => ({
          role: c.role === 'gift' ? 'gift' : 'main',
          product: c.product || '',
          image: c.image || productImage(c.product),
          qty: Number(c.qty) || Number(t.qty) || 1,
          displayName: String(c.displayName || '').trim(),
          variants: c.variants,
        })),
      })),
    };
    const existing = EDIT_ID ? byId(EDIT_ID) : null;
    if (existing) Object.assign(existing, payload);
    else D.bundles.unshift(payload);
    EDIT_ID = payload.id;
    return payload;
  }

  function scrollToFirstError() {
    requestAnimationFrame(() => {
      const el = root && root.querySelector('.has-error, .bn-err');
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const focusable = (el.matches && el.matches('input,select,textarea,button')) ? el : el.querySelector('input,select,textarea,button');
      if (focusable && focusable.focus) focusable.focus({ preventScroll: true });
    });
  }

  function sellingPlans() {
    const d = window.DATA_SETTINGS || {};
    const nested = d.subscriptions && d.subscriptions.sellingPlans;
    return nested || d.sellingPlans || [];
  }
  function plansForParent(name, productId) {
    const plans = (sellingPlans() || []).filter((p) => p && p.origin === 'bestcheckout');
    const n = String(name || '').trim().toLowerCase();
    const id = String(productId || '').replace(/\D/g, '');
    return plans.filter((p) => {
      const pn = String(p.product || '').trim().toLowerCase();
      const pid = String(p.productId || '').replace(/\D/g, '');
      if (id && pid && id === pid) return true;
      if (n && pn && (n === pn || n.indexOf(pn) === 0 || pn.indexOf(n) === 0)) return true;
      return false;
    });
  }
  function subscribeGuideCard() {
    if (!EDIT_ID || !String(EDIT.parentProduct || '').trim()) return '';
    if (plansForParent(EDIT.parentProduct, EDIT.parentProductId).length) return '';
    return card('Subscribe & Save',
      '<div class="muted" style="font-size:12.5px;line-height:1.5;margin-bottom:12px">This product page only shows one-time packs until you add a plan.</div>' +
      '<button type="button" class="btn btn-primary" data-act="add-sub" style="width:100%">Add subscription</button>');
  }
  function goAddSubscription() {
    try {
      sessionStorage.setItem('bcSubFromBundle', JSON.stringify({
        product: String(EDIT.parentProduct || '').trim(),
        productId: String(EDIT.parentProductId || ''),
        image: EDIT.parentImage || '',
        bundleId: EDIT_ID || '',
        tierIndex: Math.max(0, Number(EDIT.defaultTier) || 0),
      }));
    } catch (e) {}
    location.hash = '#/subscriptions/new';
  }
  function offerSubscribeAfterSave() {
    if (!window.UI || !window.UI.confirm) { location.hash = '#/bundles'; return; }
    window.UI.confirm({
      title: 'Add Subscribe & Save?',
      content: 'This product page only shows one-time packs until you add a plan. Add Subscribe & Save so shoppers can pick subscribe on the product page.',
      okText: 'Add subscription',
      cancelText: 'Not now',
      onOk: () => { goAddSubscription(); },
      onCancel: () => { location.hash = '#/bundles'; },
    });
  }
  function saveBundle() {
    readEditor();
    if (!validate()) { paintEditor(); scrollToFirstError(); return; }
    const isCreate = !(EDIT_ID && byId(EDIT_ID));
    const becomingActive = EDIT.status === 'active';
    const wasActive = !!(EDIT_ID && byId(EDIT_ID) && byId(EDIT_ID).status === 'active');
    const apply = () => {
      persist(EDIT.status);
      EDIT_ORIGIN = snapshot();
      toast(EDIT.status === 'active' ? 'Bundle saved and active' : 'Bundle saved');
      const hasPlan = plansForParent(EDIT.parentProduct, EDIT.parentProductId).length > 0;
      if (!hasPlan && (isCreate || (becomingActive && !wasActive))) offerSubscribeAfterSave();
      else location.hash = '#/bundles';
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
    };
    root.querySelectorAll('.bn-statusr').forEach((r) => r.onchange = () => {
      EDIT.status = r.value;
      syncUnsaved();
    });
    const addSub = root.querySelector('[data-act="add-sub"]');
    if (addSub) addSub.onclick = () => { goAddSubscription(); };
    const color = root.querySelector('#bn-color');
    if (color) color.oninput = () => {
      EDIT.brandColor = color.value;
      if (color.nextElementSibling) color.nextElementSibling.textContent = color.value;
      syncUnsaved();
      updatePreview();
    };
    const btn = root.querySelector('#bn-btn');
    if (btn) btn.oninput = () => {
      EDIT.buttonText = btn.value;
      syncUnsaved();
      updatePreview();
    };
    const header = root.querySelector('#bn-htext');
    if (header) header.oninput = () => {
      if (!EDIT.header) EDIT.header = normalizeHeader();
      EDIT.header.text = header.value;
      syncUnsaved();
      updatePreview();
    };
    const align = root.querySelector('#bn-halign');
    if (align) align.onchange = () => {
      if (!EDIT.header) EDIT.header = normalizeHeader();
      EDIT.header.align = align.value;
      syncUnsaved();
      updatePreview();
    };
    const line = root.querySelector('#bn-hline');
    if (line) line.onchange = () => {
      if (!EDIT.header) EDIT.header = normalizeHeader();
      EDIT.header.line = line.checked;
      if (line.checked && !(EDIT.header.thickness > 0)) EDIT.header.thickness = 2;
      syncUnsaved();
      paintEditor();
    };
    const thick = root.querySelector('#bn-hthick');
    if (thick) thick.oninput = () => {
      if (!EDIT.header) EDIT.header = normalizeHeader();
      EDIT.header.thickness = Number(thick.value) || 2;
      const hv = root.querySelector('#bn-hthick-val');
      if (hv) hv.textContent = thick.value + ' px';
      syncUnsaved();
      updatePreview();
    };
    root.querySelectorAll('.bn-default').forEach((el) => el.onchange = () => {
      EDIT.defaultTier = Number(el.getAttribute('data-i'));
      previewSel = EDIT.defaultTier;
      syncUnsaved();
      updatePreview();
    });
    root.querySelectorAll('.bn-f').forEach((el) => el.oninput = () => {
      const i = Number(el.getAttribute('data-i')), k = el.getAttribute('data-k');
      if (!EDIT.tiers[i]) return;
      let v = el.value;
      if (k === 'qty') v = Number(v) || 1;
      if (k === 'price' || k === 'compareAt') v = v === '' ? null : Number(v);
      EDIT.tiers[i][k] = v;
      if (k === 'qty') {
        (EDIT.tiers[i].components || []).forEach((c) => { if (c.role === 'main') c.qty = EDIT.tiers[i].qty; });
        const mq = root.querySelector('[data-mainqty="' + i + '"]');
        if (mq) mq.textContent = EDIT.tiers[i].qty;
        if (v) clearMarkedError('qty-' + i, el);
      }
      if (k === 'price' && v != null) clearMarkedError('price-' + i, el);
      if (k === 'compareAt') clearMarkedError('compare-' + i, el);
      syncUnsaved();
      updatePreview();
    });
    root.querySelectorAll('.bn-badge').forEach((el) => {
      el.oninput = () => { EDIT.tiers[Number(el.getAttribute('data-i'))].badge = el.value; syncUnsaved(); updatePreview(); };
      el.onfocus = () => openBadgePop(el, (v) => {
        const t = EDIT.tiers[Number(el.getAttribute('data-i'))];
        if (t) t.badge = v;
        syncUnsaved();
        updatePreview();
      });
    });
    root.querySelectorAll('.bn-tag').forEach((el) => el.oninput = () => {
      EDIT.tiers[Number(el.getAttribute('data-i'))].tag = el.value;
      syncUnsaved();
      updatePreview();
    });
    root.querySelectorAll('.bn-cq').forEach((el) => el.oninput = () => {
      EDIT.tiers[Number(el.getAttribute('data-i'))].components[Number(el.getAttribute('data-ci'))].qty = Number(el.value) || 1;
      syncUnsaved();
      updatePreview();
    });
    root.querySelectorAll('.bn-cn').forEach((el) => el.oninput = () => {
      EDIT.tiers[Number(el.getAttribute('data-i'))].components[Number(el.getAttribute('data-ci'))].displayName = el.value;
      syncUnsaved();
      updatePreview();
    });
    root.querySelectorAll('.bn-cp').forEach((el) => el.onclick = () => {
      const i = Number(el.getAttribute('data-i')), ci = Number(el.getAttribute('data-ci'));
      window.UI.productPicker({
        multiple: false,
        showBundleTag: false,
        selected: [],
        onConfirm: (p) => {
          if (p[0]) {
            EDIT.tiers[i].components[ci].product = p[0].name;
            EDIT.tiers[i].components[ci].variants = p[0].variants;
            EDIT.tiers[i].components[ci].image = p[0].image || productImage(p[0].name);
          }
          paintEditor();
        },
      });
    });
    root.querySelectorAll('.bn-cr').forEach((el) => el.onclick = () => {
      EDIT.tiers[Number(el.getAttribute('data-i'))].components.splice(Number(el.getAttribute('data-ci')), 1);
      paintEditor();
    });
    root.querySelectorAll('[data-addcomp]').forEach((el) => el.onclick = () => {
      const parts = el.getAttribute('data-addcomp').split(':');
      const role = parts[0], i = Number(parts[1]);
      window.UI.productPicker({
        multiple: true,
        showBundleTag: false,
        selected: [],
        onConfirm: (ps) => {
          if (!ps || !ps.length) return;
          ps.forEach((p) => EDIT.tiers[i].components.push({
            role: role, product: p.name, qty: 1, displayName: '', variants: p.variants, image: p.image || productImage(p.name),
          }));
          paintEditor();
        },
      });
    });
    root.querySelectorAll('[data-rmtier]').forEach((el) => el.onclick = () => {
      const ri = Number(el.getAttribute('data-rmtier'));
      EDIT.tiers.splice(ri, 1);
      if (EDIT.defaultTier >= EDIT.tiers.length) EDIT.defaultTier = EDIT.tiers.length - 1;
      else if (ri < EDIT.defaultTier) EDIT.defaultTier -= 1;
      previewSel = EDIT.defaultTier;
      paintEditor();
    });
    const addTier = root.querySelector('[data-act="add-tier"]');
    if (addTier) addTier.onclick = () => { EDIT.tiers.push(blankTier()); paintEditor(); };
    root.querySelectorAll('.bn-nup, .bn-ndn').forEach((b) => b.onclick = () => {
      const inp = b.closest('.bn-num').querySelector('input');
      if (!inp) return;
      const step = parseFloat(inp.step) || 1;
      const min = inp.min !== '' ? parseFloat(inp.min) : -Infinity;
      let v = (parseFloat(inp.value) || 0) + (b.classList.contains('bn-nup') ? step : -step);
      if (v < min) v = min;
      inp.value = (String(step).indexOf('.') >= 0) ? v.toFixed(2) : String(v);
      inp.dispatchEvent(new Event('input', { bubbles: true }));
    });
    wirePreview();
    const pick = root.querySelector('[data-act="pick-parent"]');
    if (pick) pick.onclick = () => {
      window.UI.productPicker({
        multiple: false,
        showBundleTag: false,
        selected: EDIT.parentProduct ? [EDIT.parentProduct] : [],
        onConfirm: (picked) => {
          if (picked[0]) {
            EDIT.parentProduct = picked[0].name;
            EDIT.parentProductId = picked[0].id ? String(picked[0].id) : '';
            EDIT.parentSku = picked[0].sku || '';
            EDIT.parentImage = picked[0].image || productImage(picked[0].name);
            const unit = Number(picked[0].price);
            (EDIT.tiers || []).forEach((t) => {
              const fm = (t.components || []).find((c) => c.role === 'main');
              if (fm) {
                fm.product = picked[0].name;
                fm.variants = picked[0].variants;
                fm.image = EDIT.parentImage;
              }
              if (!isNaN(unit) && unit >= 0) {
                const qty = Number(t.qty) || 1;
                t.price = Math.round(unit * qty * 100) / 100;
              }
            });
          }
          if (EDIT.parentProduct) delete ERRORS.parentProduct;
          paintEditor();
          syncUnsaved();
        },
      });
    };
    const del = root.querySelector('[data-act="delete"]');
    if (del) del.onclick = () => {
      if (!EDIT_ID) return;
      const linked = plansForParent(EDIT.parentProduct, EDIT.parentProductId);
      if (linked.length) {
        const plan = linked[0];
        const key = (plan && (plan.key || plan.id)) || '';
        window.UI.confirm({
          title: "Can't delete this bundle",
          content: 'This product has a subscription. Delete the subscription first.',
          okText: 'View subscription',
          cancelText: 'OK',
          onOk: () => {
            location.hash = key ? '#/subscriptions/edit/' + encodeURIComponent(key) : '#/subscriptions';
          },
        });
        return;
      }
      window.UI.confirm({
        title: 'Delete bundle',
        content: 'Delete ' + (EDIT.name || EDIT_ID) + '? This product page will no longer use a BestCheckout purchase area.',
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
    closeBadgePop();
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
  window.VIEWS.bundles = {
    render: function (el, rest) { root = el; route(rest || ''); },
    unmount: function () { closeBadgePop(); },
  };
})();
