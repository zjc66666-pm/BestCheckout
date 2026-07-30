(function () {
  'use strict';

  if (window.I18N) window.I18N.extend({
    'Track the changes and service events that affect your checkout. Each event shows what changed, who or what caused it, and where to take the next step.': '查看影响结账的关键变更和服务事件；每条动态都说明发生了什么、由谁或什么服务触发，以及下一步该去哪里处理。',
    'Category': '类别', 'All results': '全部结果', 'Result': '结果', 'Related to': '关联对象', 'Who and source': '操作者与来源', 'Who': '操作者', 'Source': '来源',
    'Deployment': '发布', 'Integrations': '连接与同步', 'Team': '团队权限', 'In progress': '处理中', 'View details': '查看详情', 'Activity details': '动态详情',
    'Changes': '变更内容', 'Field': '字段', 'Before': '变更前', 'After': '变更后', 'Close': '关闭', 'System': '系统', 'Service': '服务',
    'Activity shows a safe summary for this store. Sensitive connection and payment details are not shown here.': '这里只展示当前店铺可安全查看的摘要；敏感连接信息和支付信息不会出现在这里。',
    'Order #EN1045 needs Shopify sync': '订单 #EN1045 需要同步到 Shopify', 'Shopify could not accept this paid order because its delivery profile is unavailable. Review the connection and retry sync before fulfillment begins.': 'Shopify 无法接收这笔已付款订单，因为配送配置暂不可用；开始履约前请检查连接并重新同步。',
    'Review order': '检查订单', 'Writeback status': '回写状态', 'Needs review': '需要检查',
    'Order #EN1048 sent to Shopify': '订单 #EN1048 已写入 Shopify', 'The paid order is ready for your existing fulfillment workflow.': '这笔已付款订单已经可以进入现有履约流程。', 'Sending to Shopify': '正在回写 Shopify', 'In Shopify': '已写入 Shopify',
    'Shopify refund synced for order #EN1028': '订单 #EN1028 的 Shopify 退款已同步', 'Shopify marked this order as fully refunded. BestCheckout has updated the order status.': 'Shopify 已将此订单标记为全额退款，BestCheckout 已更新订单状态。', 'Refund amount': '退款金额', 'Order status': '订单状态', 'Paid': '已付款', 'Refunded': '已退款',
    'Payment service': '支付服务', 'Payment services': '支付服务', 'Reconnect PayPal': '重新连接 PayPal', 'Connection': '连接状态', 'Reconnect required': '需要重新连接',
    'Airwallex connection verified': 'Airwallex 连接已验证', 'Card and express checkout are ready to accept payments.': '银行卡及快捷结账已可收款。', 'Checking': '检查中', 'Ready to accept payments': '可以收款',
    'Updated staff access for Jordan Lee': '已更新 Jordan Lee 的员工权限', 'Jordan can now review orders and manage checkout pages for this store.': 'Jordan 现在可以检查订单并管理此店铺的结账页面。', 'Staff member': '员工', 'Role': '角色', 'Order reviewer': '订单检查员', 'Order reviewer, page editor': '订单检查员、页面编辑员',
    'Domain service': '域名服务', 'Checkout domain': '结账域名', 'Domain status': '域名状态', 'Waiting for DNS': '等待 DNS',
    'Shopify integration': 'Shopify 连接', 'Catalog sync': '商品目录同步', 'Shopify connection': 'Shopify 连接', 'Products available to checkout': '可用于结账的商品', 'Discounts': '优惠',
    'Aura Thank you page': 'Aura Thank you 页面', 'Checkout page': '结账页面', 'Page version': '页面版本',
    'Shopify permissions update requested': '已请求更新 Shopify 权限', 'The store owner needs to approve the updated access request in Shopify.': '店铺所有者需要在 Shopify 中批准更新后的访问请求。', 'Review connection': '检查连接', 'Access request': '访问请求', 'Current permissions': '当前权限', 'Awaiting approval': '等待批准',
    'Paused “Returning customer offer”': '已暂停“复购客户优惠”', 'New buyers who match this rule now continue to the next live flow or Shopify Checkout.': '符合此规则的新买家现在会继续进入下一条已启用流程或 Shopify Checkout。', 'Buyer entry': '买家入口',
    'Shopify delivery update needs review': 'Shopify 配送更新需要检查', 'One delivery update could not be processed. Buyers can still complete checkout.': '有一条配送更新未能处理；买家仍可正常完成结账。', 'Service health': '服务状态', 'Healthy': '正常',
    'Updated first-order boost routing': '已更新首单加购流程分流', 'New customers now receive the intended checkout allocation.': '新客户现在会按预设分配进入结账路径。', 'New customer allocation': '新客户分配比例',
    'First order booster': '首单加购流程', 'The latest available products and discounts can now be used in purchase flows.': '最新可用的商品和优惠现在可以用于购买流程。'
  });

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function tr(value) {
    return window.I18N && window.I18N.lang === 'zh' && window.I18N.t ? window.I18N.t(value) : value;
  }

  function formatDate(value) {
    var date = new Date(value);
    var isZh = window.I18N && window.I18N.lang === 'zh';
    var locale = isZh ? 'zh-CN' : 'en-US';
    return date.toLocaleDateString(locale, { month: isZh ? 'numeric' : 'short', day: 'numeric', year: 'numeric' }) + ' · ' +
      date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function outcomeMeta(outcome) {
    return {
      succeeded: { label: 'Completed', tone: 'ok' },
      requires_action: { label: 'Needs attention', tone: 'warn' },
      in_progress: { label: 'In progress', tone: 'blue' }
    }[outcome] || { label: 'Completed', tone: 'ok' };
  }

  function categoryMeta(category) {
    return {
      deployment: { label: 'Deployment', tone: 'violet' },
      integration: { label: 'Integrations', tone: 'cyan' },
      orders: { label: 'Orders', tone: 'amber' },
      payments: { label: 'Payment services', tone: 'green' },
      team: { label: 'Team', tone: 'pink' }
    }[category] || { label: 'Activity', tone: 'gray' };
  }

  function render(root, rest) {
    var events = (window.DATA_ACTIVITY || []).slice().sort(function (a, b) { return new Date(b.at) - new Date(a.at); });
    var routeCategory = { order: 'orders', payments: 'payments' }[String(rest || '').split('/')[0].toLowerCase()];
    var selectedCategory = routeCategory || 'all';
    var selectedOutcome = 'all';
    var query = '';
    var queryDraft = '';
    var from = '';
    var to = '';
    var page = 1;
    var pageSize = 10;
    var searchTimer = 0;

    root.innerHTML =
      '<div class="view-wrap ac-view">' +
        '<style>' +
          '.ac-view{max-width:none;margin:0;padding:0 0 24px}.ac-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:16px}.ac-head h1{margin:0;color:var(--ink);font-size:20px;font-weight:650;line-height:1.4}.ac-head p{max-width:660px;margin:5px 0 0;color:var(--ink-muted);font-size:13px;line-height:1.5}.ac-head-note{display:flex;align-items:center;gap:8px;flex:none;padding:8px 10px;border:1px solid #f0d8a6;border-radius:8px;background:#fffaf0;color:#8b5e00;font-size:12px;font-weight:650;white-space:nowrap}.ac-head-note i{width:7px;height:7px;border-radius:50%;background:currentColor}.ac-panel{background:#fff;border:1px solid var(--hair);border-radius:12px;box-shadow:0 1px 2px rgba(20,30,50,.03);overflow:visible}.ac-filter{padding:15px 18px 14px;border-bottom:1px solid var(--hair)}.ac-filter-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.ac-filter-pair{display:flex;min-width:0}.ac-search{position:relative;flex:1;min-width:190px}.ac-search svg{position:absolute;right:10px;top:9px;width:14px;height:14px;fill:none;stroke:var(--ink-muted);stroke-width:1.8;pointer-events:none}.ac-kw-clear{position:absolute;right:32px;top:50%;transform:translateY(-50%);width:16px;height:16px;border:0;border-radius:50%;background:var(--ctl);color:#fff;display:grid;place-items:center;font-size:12px;line-height:1;cursor:pointer;padding:0}.ac-kw-clear:hover{background:var(--ink-muted)}#ac-search:placeholder-shown~.ac-kw-clear{display:none}.ac-filter-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.ac-filter-tags:empty{display:none}.ac-filter-tags .field-pill{cursor:pointer}.ac-filter .filter-select:hover,.ac-filter .filter-input:hover{position:relative;z-index:2}.ac-list-shell{overflow:hidden;border-radius:0 0 11px 11px}.ac-table-wrap{overflow-x:auto}.ac-table{width:100%;border-collapse:collapse;min-width:940px}.ac-table th{text-align:left;background:var(--panel);color:var(--ink-muted);font-size:11.5px;font-weight:650;letter-spacing:.02em;padding:10px 18px;border-bottom:1px solid var(--hair)}.ac-table td{padding:14px 18px;border-bottom:1px solid var(--hair);vertical-align:top}.ac-table tr:last-child td{border-bottom:0}.ac-table tr:hover td{background:#fbfcfe}.ac-title{font-size:13.5px;font-weight:650;color:var(--ink);line-height:1.42}.ac-detail{font-size:12.5px;line-height:1.48;color:var(--ink-muted);margin-top:3px;max-width:420px}.ac-subject{display:flex;flex-direction:column;gap:3px;min-width:130px}.ac-subject a{color:var(--brand);font-size:12.5px;font-weight:650;text-decoration:none;line-height:1.4}.ac-subject a:hover{text-decoration:underline}.ac-subject small{color:var(--ink-muted);font-size:11.5px}.ac-source{min-width:130px}.ac-source strong{display:block;color:var(--ink-body);font-size:12.5px;font-weight:600;line-height:1.4}.ac-source span{display:block;margin-top:3px;color:var(--ink-muted);font-size:11.5px;line-height:1.4}.ac-category{display:inline-flex;align-items:center;gap:5px;border-radius:999px;font-size:11px;font-weight:700;padding:4px 8px;white-space:nowrap}.ac-category:before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}.ac-category.violet{color:#7250ba;background:#f2edff}.ac-category.cyan{color:#087d98;background:#e8f8fb}.ac-category.amber{color:#9c6500;background:#fff3d4}.ac-category.green{color:#087c50;background:#e7f7ee}.ac-category.pink{color:#a14b6f;background:#fff0f5}.ac-category.gray{color:#596579;background:#f0f3f7}.ac-status{display:inline-flex;align-items:center;gap:5px;border-radius:999px;font-size:11.5px;font-weight:650;padding:4px 8px;white-space:nowrap}.ac-status:before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}.ac-status.ok{color:#008051;background:#e8f5ee}.ac-status.blue{color:#1565c0;background:#eaf2fe}.ac-status.warn{color:#9c6500;background:#fff3d4}.ac-time{color:var(--ink-muted);font-size:12px;white-space:nowrap}.ac-row-actions{display:flex;align-items:flex-start;gap:8px;min-width:124px}.ac-detail-btn{height:28px;padding:0 9px;border:1px solid var(--hair);border-radius:6px;background:#fff;color:var(--ink-body);font:600 12px/1 inherit;cursor:pointer;white-space:nowrap}.ac-detail-btn:hover{border-color:#aeb9cb;background:var(--panel)}.ac-next{display:inline-flex;align-items:center;min-height:28px;color:var(--brand);font-size:12px;font-weight:650;text-decoration:none;white-space:nowrap}.ac-next:hover{text-decoration:underline}.ac-empty{padding:52px 20px;text-align:center;color:var(--ink-muted);font-size:13px}.ac-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-top:1px solid var(--hair);background:#fff}.ac-total{color:var(--ink-muted);font-size:12.5px}.ac-total b{color:var(--ink);font-weight:600}.ac-footer .pg{margin-left:auto}.ac-footer .pg-item{font:inherit;font-size:13px}.ac-footer .pg-size{font-size:12.5px}.ac-modal-backdrop{position:fixed;inset:0;z-index:140;background:rgba(21,31,46,.34);display:flex;justify-content:flex-end}.ac-drawer{width:470px;max-width:100%;height:100%;box-sizing:border-box;background:#fff;box-shadow:-10px 0 30px rgba(20,35,60,.16);display:flex;flex-direction:column}.ac-drawer-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:22px 22px 17px;border-bottom:1px solid var(--hair)}.ac-drawer-head h2{margin:0;color:var(--ink);font-size:17px;line-height:1.42}.ac-drawer-head p{margin:5px 0 0;color:var(--ink-muted);font-size:12px}.ac-drawer-x{display:grid;place-items:center;flex:none;width:30px;height:30px;border:0;border-radius:6px;background:transparent;color:var(--ink-muted);font-size:21px;cursor:pointer}.ac-drawer-x:hover{background:var(--panel);color:var(--ink)}.ac-drawer-body{padding:19px 22px 28px;overflow:auto}.ac-detail-status{margin-bottom:18px}.ac-dl{margin:0;border-top:1px solid var(--hair)}.ac-dl-row{display:grid;grid-template-columns:112px minmax(0,1fr);gap:12px;padding:12px 0;border-bottom:1px solid var(--hair);font-size:12.5px;line-height:1.45}.ac-dl dt{color:var(--ink-muted)}.ac-dl dd{margin:0;color:var(--ink-body);font-weight:550}.ac-dl a{color:var(--brand);text-decoration:none}.ac-dl a:hover{text-decoration:underline}.ac-change-title{margin:21px 0 8px;color:var(--ink);font-size:13px;font-weight:650}.ac-change-table{width:100%;border:1px solid var(--hair);border-radius:8px;border-spacing:0;overflow:hidden;font-size:12px}.ac-change-table th{text-align:left;padding:8px 10px;background:var(--panel);color:var(--ink-muted);font-size:11px;font-weight:650}.ac-change-table td{padding:9px 10px;border-top:1px solid var(--hair);color:var(--ink-body);vertical-align:top}.ac-change-table td:first-child{color:var(--ink-muted);width:31%}.ac-drawer-action{margin-top:20px}.ac-drawer-action .btn{display:inline-flex;align-items:center;text-decoration:none}.ac-note{margin-top:16px;padding:10px 12px;border-radius:8px;background:#f7f9fc;color:var(--ink-muted);font-size:12px;line-height:1.5}@media(max-width:900px){.ac-head{display:block}.ac-head-note{display:inline-flex;margin-top:12px}.ac-table{min-width:0}.ac-table thead{display:none}.ac-table,.ac-table tbody,.ac-table tr,.ac-table td{display:block;width:100%;box-sizing:border-box}.ac-table tr{padding:14px 16px;border-bottom:1px solid var(--hair)}.ac-table tr:last-child{border-bottom:0}.ac-table td{padding:0;border:0;background:transparent!important}.ac-table tr:hover td{background:transparent}.ac-table td[data-label]:not(.ac-primary){display:grid;grid-template-columns:88px minmax(0,1fr);gap:10px;margin-top:9px}.ac-table td[data-label]:not(.ac-primary):before{content:attr(data-label);color:var(--ink-muted);font-size:11.5px;line-height:1.5}.ac-subject,.ac-source{min-width:0}.ac-row-actions{margin-top:13px;display:flex!important}.ac-row-actions:before{display:none}.ac-time{white-space:normal}.ac-footer{align-items:flex-start;flex-direction:column}.ac-footer .pg{margin-left:0;max-width:100%;gap:5px}.ac-footer .pg-item{min-width:30px}.ac-footer .pg-size{min-width:0}}@media(max-width:620px){.ac-filter{padding:13px}.ac-filter-row,.ac-filter-pair,.ac-search{width:100%!important}.ac-filter-pair{display:flex}.ac-filter-pair .filter-select{width:43%!important}.ac-filter-pair .ac-search{width:57%!important}.ac-filter> .ac-filter-row> .filter-select{width:100%!important}.ac-drawer{width:100%}.ac-drawer-head,.ac-drawer-body{padding-left:16px;padding-right:16px}.ac-dl-row{grid-template-columns:92px minmax(0,1fr)}}' +
        '</style>' +
        '<header class="ac-head"><div><h1>' + esc(tr('Activity log')) + '</h1><p>' + esc(tr('Track the changes and service events that affect your checkout. Each event shows what changed, who or what caused it, and where to take the next step.')) + '</p></div><button type="button" class="ac-head-note" data-attention-filter><i></i><span data-attention-count></span></button></header>' +
        '<section class="ac-panel">' +
          '<div class="ac-filter"><div class="ac-filter-row">' +
            '<div class="ac-filter-pair" style="width:392px;max-width:100%"><select class="filter-select" id="ac-category" data-ui-match-width aria-label="' + esc(tr('Category')) + '" style="width:152px;border-top-right-radius:0;border-bottom-right-radius:0"><option value="all">' + esc(tr('All activity')) + '</option><option value="deployment">' + esc(tr('Deployment')) + '</option><option value="integration">' + esc(tr('Integrations')) + '</option><option value="orders">' + esc(tr('Orders')) + '</option><option value="payments">' + esc(tr('Payment services')) + '</option><option value="team">' + esc(tr('Team')) + '</option></select><div class="ac-search"><input class="filter-input" id="ac-search" type="search" autocomplete="off" placeholder="' + esc(tr('Search activity')) + '" value="' + esc(queryDraft) + '" style="width:100%;padding-left:12px;padding-right:52px;border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px" /><button class="ac-kw-clear" type="button" data-search-clear aria-label="' + esc(tr('Clear')) + '">&times;</button><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path></svg></div></div>' +
            '<div class="ac-filter-pair" style="width:290px;max-width:100%"><select class="filter-select" id="ac-outcome" aria-label="' + esc(tr('Result')) + '" style="width:132px;border-top-right-radius:0;border-bottom-right-radius:0"><option value="all">' + esc(tr('All results')) + '</option><option value="succeeded">' + esc(tr('Completed')) + '</option><option value="requires_action">' + esc(tr('Needs attention')) + '</option><option value="in_progress">' + esc(tr('In progress')) + '</option></select><div class="ui-range filter-input" data-ui-range data-ph="Start date → End date" style="width:158px;border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px;padding-left:10px;padding-right:9px"><input type="hidden" id="ac-from" data-range="start" value="' + esc(from) + '" /><input type="hidden" id="ac-to" data-range="end" value="' + esc(to) + '" /></div></div>' +
          '</div><div class="ac-filter-tags" data-filter-tags></div></div>' +
          '<div class="ac-list-shell"><div class="ac-table-wrap"><table class="ac-table"><thead><tr><th>' + esc(tr('Activity')) + '</th><th>' + esc(tr('Related to')) + '</th><th>' + esc(tr('Result')) + '</th><th>' + esc(tr('Who and source')) + '</th><th>' + esc(tr('Time')) + '</th><th></th></tr></thead><tbody data-rows></tbody></table></div><footer class="ac-footer"><span class="ac-total" data-total></span><div class="pg" data-pager></div></footer></div>' +
        '</section>' +
      '</div>';

    var categorySelect = root.querySelector('#ac-category');
    var outcomeSelect = root.querySelector('#ac-outcome');
    var searchInput = root.querySelector('#ac-search');
    var fromInput = root.querySelector('#ac-from');
    var toInput = root.querySelector('#ac-to');
    var rowsEl = root.querySelector('[data-rows]');
    var totalEl = root.querySelector('[data-total]');
    var pagerEl = root.querySelector('[data-pager]');
    var tagsEl = root.querySelector('[data-filter-tags]');
    var attentionButton = root.querySelector('[data-attention-filter]');

    categorySelect.value = selectedCategory;
    if (window.I18N) window.I18N.apply(root);

    function activeRows() {
      var needle = query.trim().toLowerCase();
      return events.filter(function (row) {
        var date = new Date(row.at);
        var haystack = [row.title, row.detail, row.category, row.outcome, row.source, row.actor && row.actor.name, row.subject && row.subject.label].join(' ').toLowerCase();
        if (selectedCategory !== 'all' && row.category !== selectedCategory) return false;
        if (selectedOutcome !== 'all' && row.outcome !== selectedOutcome) return false;
        if (needle && haystack.indexOf(needle) < 0) return false;
        if (from && date < new Date(from + 'T00:00:00')) return false;
        if (to && date > new Date(to + 'T23:59:59')) return false;
        return true;
      });
    }

    function totalLabel(total) {
      if (window.I18N && window.I18N.lang === 'zh') return tr('Total') + total + tr('events');
      return 'Showing ' + total + ' events';
    }

    function pagerHtml(pages) {
      if (pages <= 1) return '';
      var item = function (label, target, opts) {
        opts = opts || {};
        var cls = 'pg-item' + (opts.active ? ' active' : '') + (opts.disabled ? ' disabled' : '');
        return '<button type="button" class="' + cls + '"' + (opts.disabled ? ' disabled' : ' data-ac-page="' + target + '"') + '>' + label + '</button>';
      };
      var nums = '';
      for (var p = 1; p <= pages; p++) nums += item(String(p), p, { active: p === page });
      return item('&lsaquo;', page - 1, { disabled: page <= 1 }) + nums + item('&rsaquo;', page + 1, { disabled: page >= pages });
    }

    function filterTagsHtml() {
      var tags = [];
      if (selectedCategory !== 'all') tags.push(['category', 'Category', categoryMeta(selectedCategory).label]);
      if (selectedOutcome !== 'all') tags.push(['outcome', 'Result', outcomeMeta(selectedOutcome).label]);
      if (query) tags.push(['search', 'Search', query]);
      if (from && to) tags.push(['date', 'Event time', from + ' → ' + to]);
      return tags.map(function (tag) {
        return '<button type="button" class="field-pill" data-clear-filter="' + tag[0] + '"><span class="muted">' + esc(tr(tag[1])) + ':</span> ' + esc(tr(tag[2])) + ' <span class="x">&times;</span></button>';
      }).join('');
    }

    function syncSelectLabel(select) {
      var ui = select && select.nextElementSibling;
      var label = ui && ui.classList.contains('ui-select') ? ui.querySelector('.ui-select-label') : null;
      if (label && select.selectedIndex >= 0) label.textContent = select.options[select.selectedIndex].textContent;
    }

    function refreshRangeLabel() {
      var range = root.querySelector('[data-ui-range]');
      if (range) range.dispatchEvent(new Event('ui-range-refresh'));
    }

    function openDetail(row, trigger) {
      var category = categoryMeta(row.category);
      var outcome = outcomeMeta(row.outcome);
      var changes = (row.changes || []).map(function (change) {
        return '<tr><td>' + esc(tr(change.label)) + '</td><td>' + esc(tr(change.before)) + '</td><td>' + esc(tr(change.after)) + '</td></tr>';
      }).join('');
      var backdrop = document.createElement('div');
      backdrop.className = 'ac-modal-backdrop';
      backdrop.innerHTML =
        '<aside class="ac-drawer" role="dialog" aria-modal="true" aria-labelledby="ac-drawer-title">' +
          '<header class="ac-drawer-head"><div><h2 id="ac-drawer-title">' + esc(tr(row.title)) + '</h2><p>' + esc(formatDate(row.at)) + ' · ' + esc(row.id) + '</p></div><button type="button" class="ac-drawer-x" data-ac-close aria-label="' + esc(tr('Close')) + '">&times;</button></header>' +
          '<div class="ac-drawer-body"><div class="ac-detail-status"><span class="ac-category ' + category.tone + '">' + esc(tr(category.label)) + '</span> <span class="ac-status ' + outcome.tone + '">' + esc(tr(outcome.label)) + '</span></div>' +
            '<p class="ac-detail" style="max-width:none;margin:0 0 18px">' + esc(tr(row.detail)) + '</p>' +
            '<dl class="ac-dl"><div class="ac-dl-row"><dt>' + esc(tr('Related to')) + '</dt><dd><a href="' + esc(row.subject.href) + '">' + esc(tr(row.subject.label)) + '</a><br><span class="muted">' + esc(tr(row.subject.kind)) + '</span></dd></div><div class="ac-dl-row"><dt>' + esc(tr('Who')) + '</dt><dd>' + esc(row.actor.name) + '<br><span class="muted">' + esc(tr(row.actor.type)) + '</span></dd></div><div class="ac-dl-row"><dt>' + esc(tr('Source')) + '</dt><dd>' + esc(tr(row.source)) + '</dd></div>' + (row.deployment ? '<div class="ac-dl-row"><dt>' + esc(tr('Deployment')) + '</dt><dd>' + esc(row.deployment) + '</dd></div>' : '') + '</dl>' +
            (changes ? '<h3 class="ac-change-title">' + esc(tr('Changes')) + '</h3><table class="ac-change-table"><thead><tr><th>' + esc(tr('Field')) + '</th><th>' + esc(tr('Before')) + '</th><th>' + esc(tr('After')) + '</th></tr></thead><tbody>' + changes + '</tbody></table>' : '') +
            (row.action ? '<div class="ac-drawer-action"><a class="btn btn-primary" href="' + esc(row.action.href) + '">' + esc(tr(row.action.label)) + '</a></div>' : '') +
            '<div class="ac-note">' + esc(tr('Activity shows a safe summary for this store. Sensitive connection and payment details are not shown here.')) + '</div>' +
          '</div>' +
        '</aside>';
      var lastFocused = trigger || document.activeElement;
      var previousBodyOverflow = document.body.style.overflow;
      document.body.appendChild(backdrop);
      document.body.style.overflow = 'hidden';
      if (window.I18N) window.I18N.apply(backdrop);
      var drawer = backdrop.querySelector('.ac-drawer');
      var closeButton = backdrop.querySelector('[data-ac-close]');
      var closed = false;
      var close = function () {
        if (closed) return;
        closed = true;
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = previousBodyOverflow;
        backdrop.remove();
        if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
      };
      var onKey = function (event) {
        if (event.key === 'Escape') { event.preventDefault(); close(); return; }
        if (event.key !== 'Tab') return;
        var focusable = Array.prototype.filter.call(drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), function (element) { return element.offsetParent !== null; });
        if (!focusable.length) { event.preventDefault(); return; }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      };
      closeButton.onclick = close;
      backdrop.onclick = function (event) { if (event.target === backdrop) close(); };
      backdrop.querySelectorAll('a[href]').forEach(function (link) { link.addEventListener('click', close); });
      document.addEventListener('keydown', onKey);
      window.setTimeout(function () { closeButton.focus(); }, 0);
    }

    function wirePager() {
      pagerEl.querySelectorAll('[data-ac-page]').forEach(function (button) {
        button.onclick = function () { page = Number(button.getAttribute('data-ac-page')); paint(); };
      });
    }

    function wireFilterTags() {
      tagsEl.querySelectorAll('[data-clear-filter]').forEach(function (button) {
        button.onclick = function () {
          var key = button.getAttribute('data-clear-filter');
          if (key === 'category') { selectedCategory = 'all'; categorySelect.value = selectedCategory; syncSelectLabel(categorySelect); }
          if (key === 'outcome') { selectedOutcome = 'all'; outcomeSelect.value = selectedOutcome; syncSelectLabel(outcomeSelect); }
          if (key === 'search') { query = ''; queryDraft = ''; searchInput.value = ''; }
          if (key === 'date') { from = ''; to = ''; fromInput.value = ''; toInput.value = ''; refreshRangeLabel(); }
          page = 1;
          paint();
        };
      });
    }

    function paint() {
      var visible = activeRows();
      var pages = Math.max(1, Math.ceil(visible.length / pageSize));
      if (page > pages) page = pages;
      var start = (page - 1) * pageSize;
      var pageRows = visible.slice(start, start + pageSize);
      var attentionCount = events.filter(function (row) { return row.outcome === 'requires_action'; }).length;
      totalEl.innerHTML = totalLabel(visible.length);
      attentionButton.querySelector('[data-attention-count]').textContent = tr('Needs attention') + ' · ' + attentionCount;
      attentionButton.classList.toggle('is-active', selectedOutcome === 'requires_action');
      rowsEl.innerHTML = pageRows.length ? pageRows.map(function (row) {
        var category = categoryMeta(row.category);
        var outcome = outcomeMeta(row.outcome);
        return '<tr><td class="ac-primary" data-label="' + esc(tr('Activity')) + '"><div class="ac-title">' + esc(tr(row.title)) + '</div><div class="ac-detail">' + esc(tr(row.detail)) + '</div><div style="margin-top:7px"><span class="ac-category ' + category.tone + '">' + esc(tr(category.label)) + '</span></div></td><td data-label="' + esc(tr('Related to')) + '"><div class="ac-subject"><a href="' + esc(row.subject.href) + '">' + esc(tr(row.subject.label)) + '</a><small>' + esc(tr(row.subject.kind)) + '</small></div></td><td data-label="' + esc(tr('Result')) + '"><span class="ac-status ' + outcome.tone + '">' + esc(tr(outcome.label)) + '</span></td><td data-label="' + esc(tr('Who and source')) + '"><div class="ac-source"><strong>' + esc(row.actor.name) + '</strong><span>' + esc(tr(row.actor.type)) + ' · ' + esc(tr(row.source)) + '</span></div></td><td data-label="' + esc(tr('Time')) + '" class="ac-time">' + esc(formatDate(row.at)) + '</td><td class="ac-row-actions" data-label=""><button type="button" class="ac-detail-btn" data-event-detail="' + esc(row.id) + '">' + esc(tr('View details')) + '</button>' + (row.action ? '<a class="ac-next" href="' + esc(row.action.href) + '">' + esc(tr(row.action.label)) + ' ›</a>' : '') + '</td></tr>';
      }).join('') : '<tr><td colspan="6"><div class="ac-empty">' + esc(tr('No activity matches these filters.')) + '</div></td></tr>';
      pagerEl.innerHTML = pagerHtml(pages);
      tagsEl.innerHTML = filterTagsHtml();
      if (window.I18N) { window.I18N.apply(rowsEl); window.I18N.apply(pagerEl); window.I18N.apply(tagsEl); }
      rowsEl.querySelectorAll('[data-event-detail]').forEach(function (button) {
        button.onclick = function () {
          var id = button.getAttribute('data-event-detail');
          var row = events.filter(function (event) { return event.id === id; })[0];
          if (row) openDetail(row, button);
        };
      });
      wirePager();
      wireFilterTags();
    }

    categorySelect.addEventListener('change', function () { selectedCategory = this.value; page = 1; paint(); });
    outcomeSelect.addEventListener('change', function () { selectedOutcome = this.value; page = 1; paint(); });
    searchInput.addEventListener('input', function () {
      queryDraft = this.value;
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () { query = queryDraft.trim(); page = 1; paint(); }, 180);
    });
    searchInput.addEventListener('keydown', function (event) { if (event.key === 'Enter') { query = queryDraft.trim(); page = 1; paint(); } });
    searchInput.addEventListener('blur', function () { query = queryDraft.trim(); page = 1; paint(); });
    fromInput.addEventListener('change', function () { from = this.value; to = toInput.value; page = 1; paint(); });
    toInput.addEventListener('change', function () { from = fromInput.value; to = this.value; page = 1; paint(); });
    root.querySelector('[data-search-clear]').addEventListener('click', function () { query = ''; queryDraft = ''; searchInput.value = ''; page = 1; paint(); });
    attentionButton.addEventListener('click', function () { selectedOutcome = selectedOutcome === 'requires_action' ? 'all' : 'requires_action'; outcomeSelect.value = selectedOutcome; syncSelectLabel(outcomeSelect); page = 1; paint(); });
    paint();
  }

  window.VIEWS = window.VIEWS || {};
  window.VIEWS.activity = { render: render };
}());
