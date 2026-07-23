(function () {
  'use strict';

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

  function tone(status) {
    if (status === 'Needs attention') return 'warn';
    if (status === 'Draft') return 'muted';
    if (status === 'Published') return 'blue';
    return 'ok';
  }

  function render(root, rest) {
    var rows = (window.DATA_ACTIVITY || []).slice();
    var routeType = { order: 'Order' }[String(rest || '').split('/')[0].toLowerCase()];
    var selectedType = routeType || 'all';
    var selectedStatus = 'all';
    var query = '';
    var queryDraft = '';
    var from = '';
    var to = '';
    var page = 1;
    var pageSize = 20;

    root.innerHTML =
      '<div class="view-wrap ac-view">' +
        '<style>' +
          '.ac-view{max-width:none;margin:0;padding:0 0 4px}' +
          '.ac-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:16px}.ac-head h1{margin:0;color:var(--ink);font-size:20px;font-weight:600;line-height:1.5}.ac-head p{margin:5px 0 0;color:var(--ink-muted);font-size:13px;line-height:1.5}' +
          '.ac-panel{background:#fff;border:1px solid var(--hair);border-radius:12px;box-shadow:0 1px 2px rgba(20,30,50,.03);overflow:visible}' +
          '.ac-filter{padding:16px 18px;border-bottom:1px solid var(--hair)}.ac-filter-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.ac-filter-pair{display:flex;min-width:0}.ac-search{position:relative;flex:1;min-width:0}.ac-search svg{position:absolute;right:10px;top:9px;width:14px;height:14px;fill:none;stroke:var(--ink-muted);stroke-width:1.8;pointer-events:none}.ac-kw-clear{position:absolute;right:32px;top:50%;transform:translateY(-50%);width:16px;height:16px;border:0;border-radius:50%;background:var(--ctl);color:#fff;display:grid;place-items:center;font-size:12px;line-height:1;cursor:pointer;padding:0}.ac-kw-clear:hover{background:var(--ink-muted)}#ac-search:placeholder-shown~.ac-kw-clear{display:none}.ac-filter-tags{display:flex;gap:0;flex-wrap:wrap;margin-top:10px}.ac-filter-tags:empty{display:none}.ac-filter-tags .field-pill{cursor:pointer}.ac-filter .filter-select:hover,.ac-filter .filter-input:hover{position:relative;z-index:2}' +
          '.ac-list-shell{overflow:hidden;border-radius:0 0 11px 11px}.ac-table-wrap{overflow-x:auto}.ac-table{width:100%;border-collapse:collapse;min-width:760px}.ac-table th{text-align:left;background:var(--panel);color:var(--ink-muted);font-size:11.5px;font-weight:650;letter-spacing:.02em;padding:10px 18px;border-bottom:1px solid var(--hair)}.ac-table td{padding:15px 18px;border-bottom:1px solid var(--hair);vertical-align:top}.ac-table tr:last-child td{border-bottom:0}.ac-title{font-size:13.5px;font-weight:650;color:var(--ink);line-height:1.4}.ac-detail{font-size:12.5px;line-height:1.5;color:var(--ink-muted);margin-top:3px;max-width:560px}.ac-type{display:inline-flex;align-items:center;border-radius:5px;background:#f0f3f7;color:#546174;font-size:11.5px;font-weight:650;padding:4px 7px;white-space:nowrap}.ac-status{display:inline-flex;align-items:center;gap:5px;border-radius:999px;font-size:11.5px;font-weight:650;padding:4px 8px;white-space:nowrap}.ac-status:before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}.ac-status.ok{color:#008051;background:#e8f5ee}.ac-status.blue{color:#1565c0;background:#eaf2fe}.ac-status.warn{color:#9c6500;background:#fff3d4}.ac-status.muted{color:#62708d;background:#eef1f5}.ac-time{color:var(--ink-muted);font-size:12.5px;white-space:nowrap}.ac-empty{padding:48px 20px;text-align:center;color:var(--ink-muted);font-size:13px}.ac-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;border-top:1px solid var(--hair);background:#fff}.ac-total{color:var(--ink-muted);font-size:12.5px}.ac-total b{color:var(--ink);font-weight:600}.ac-footer .pg{margin-left:auto}.ac-footer .pg-item{font:inherit;font-size:13px}.ac-footer .pg-size{font-size:12.5px}' +
          '@media(max-width:760px){.ac-head{display:block}.ac-filter-row{align-items:stretch}.ac-filter-pair{width:100%!important;min-width:0}.ac-filter .ui-select.ac-status-select{width:100%!important}.ac-filter .ui-range{flex:1;min-width:0}.ac-footer{align-items:flex-start;flex-direction:column}.ac-footer .pg{margin-left:0;max-width:100%;gap:5px}.ac-footer .pg-item{min-width:30px}.ac-footer .pg-size{min-width:0}}' +
        '</style>' +
        '<div class="ac-head"><div><h1>Activity log</h1><p>Review the meaningful changes to this Shopify store: purchase flows, checkout pages, payment services, and orders.</p></div></div>' +
        '<section class="ac-panel">' +
          '<div class="ac-filter">' +
            '<div class="ac-filter-row">' +
              '<div class="ac-filter-pair" style="width:360px;max-width:100%"><select class="filter-select" id="ac-type" data-ui-match-width aria-label="' + esc(tr('Type')) + '" style="width:142px;border-top-right-radius:0;border-bottom-right-radius:0"><option value="all">All activity</option><option value="Flow">Flow</option><option value="Page">Page</option><option value="Order">Order</option><option value="Payment">Payment</option><option value="Domain">Domain</option><option value="Store">Store</option></select><div class="ac-search"><input class="filter-input" id="ac-search" type="search" autocomplete="off" placeholder="' + esc(tr('Search activity')) + '" value="' + esc(queryDraft) + '" style="width:100%;padding-left:12px;padding-right:52px;border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px" /><button class="ac-kw-clear" type="button" data-search-clear aria-label="' + esc(tr('Clear')) + '">&times;</button><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path></svg></div></div>' +
              '<div class="ac-filter-pair" style="width:428px;max-width:100%"><select class="filter-select" id="ac-time" aria-label="' + esc(tr('Event time')) + '" style="width:160px;border-top-right-radius:0;border-bottom-right-radius:0"><option value="at">Event time</option></select><div class="ui-range filter-input" data-ui-range data-ph="Start date → End date" style="width:268px;border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px;padding-left:12px;padding-right:10px"><input type="hidden" id="ac-from" data-range="start" value="' + esc(from) + '" /><input type="hidden" id="ac-to" data-range="end" value="' + esc(to) + '" /></div></div>' +
              '<select class="filter-select ac-status-select" id="ac-status" aria-label="' + esc(tr('Status')) + '" style="width:160px"><option value="all">All statuses</option><option value="Completed">Completed</option><option value="Published">Published</option><option value="Draft">Draft</option><option value="Needs attention">Needs attention</option></select>' +
            '</div>' +
            '<div class="ac-filter-tags" data-filter-tags></div>' +
          '</div>' +
          '<div class="ac-list-shell"><div class="ac-table-wrap"><table class="ac-table"><thead><tr><th>Activity</th><th>Type</th><th>Status</th><th>Time</th></tr></thead><tbody data-rows></tbody></table></div>' +
          '<footer class="ac-footer"><span class="ac-total" data-total></span><div class="pg" data-pager></div></footer></div>' +
        '</section>' +
      '</div>';

    var typeSelect = root.querySelector('#ac-type');
    var statusSelect = root.querySelector('#ac-status');
    var searchInput = root.querySelector('#ac-search');
    var fromInput = root.querySelector('#ac-from');
    var toInput = root.querySelector('#ac-to');
    var rowsEl = root.querySelector('[data-rows]');
    var totalEl = root.querySelector('[data-total]');
    var pagerEl = root.querySelector('[data-pager]');
    var tagsEl = root.querySelector('[data-filter-tags]');

    typeSelect.value = selectedType;
    if (window.I18N) window.I18N.apply(root);

    function activeRows() {
      var needle = query.trim().toLowerCase();
      return rows.filter(function (row) {
        var date = new Date(row.at);
        if (selectedType !== 'all' && row.type !== selectedType) return false;
        if (selectedStatus !== 'all' && row.status !== selectedStatus) return false;
        if (needle && [row.title, row.detail, row.type, row.status].join(' ').toLowerCase().indexOf(needle) < 0) return false;
        if (from && date < new Date(from + 'T00:00:00')) return false;
        if (to && date > new Date(to + 'T23:59:59')) return false;
        return true;
      });
    }

    function totalLabel(total) {
      if (window.I18N && window.I18N.lang === 'zh') return tr('Total') + total + tr('records');
      return 'Total ' + total + ' records';
    }

    function pageSizeLabel(size) {
      if (window.I18N && window.I18N.lang === 'zh') return tr('Per page') + ' ' + size + ' ' + tr('records');
      return size + ' / page';
    }

    function pagerHtml(pages) {
      var item = function (label, target, opts) {
        opts = opts || {};
        var cls = 'pg-item' + (opts.active ? ' active' : '') + (opts.disabled ? ' disabled' : '');
        return '<button type="button" class="' + cls + '"' + (opts.disabled ? ' disabled' : ' data-ac-page="' + target + '"') + '>' + label + '</button>';
      };
      var nums = '';
      for (var p = 1; p <= pages; p++) nums += item(String(p), p, { active: p === page });
      return item('&lsaquo;', page - 1, { disabled: page <= 1 }) + nums + item('&rsaquo;', page + 1, { disabled: page >= pages }) +
        '<select class="pg-size" data-ac-page-size aria-label="' + esc(tr('Per page')) + '">' + [20, 50, 100].map(function (size) {
          return '<option value="' + size + '"' + (size === pageSize ? ' selected' : '') + '>' + esc(pageSizeLabel(size)) + '</option>';
        }).join('') + '</select>';
    }

    function wirePager() {
      pagerEl.querySelectorAll('[data-ac-page]').forEach(function (button) { button.onclick = function () {
        page = Number(button.getAttribute('data-ac-page')); paint();
      }; });
      var sizeSelect = pagerEl.querySelector('[data-ac-page-size]');
      if (sizeSelect) sizeSelect.onchange = function () { pageSize = Number(sizeSelect.value); page = 1; paint(); };
    }

    function filterTagsHtml() {
      var tags = [];
      if (selectedType !== 'all') tags.push(['type', 'Type', selectedType]);
      if (query) tags.push(['search', 'Search', query]);
      if (from && to) tags.push(['date', 'Event time', from + ' → ' + to]);
      if (selectedStatus !== 'all') tags.push(['status', 'Status', selectedStatus]);
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

    function wireFilterTags() {
      tagsEl.querySelectorAll('[data-clear-filter]').forEach(function (button) { button.onclick = function () {
        var key = button.getAttribute('data-clear-filter');
        if (key === 'type') { selectedType = 'all'; typeSelect.value = selectedType; syncSelectLabel(typeSelect); }
        if (key === 'search') { query = ''; queryDraft = ''; searchInput.value = ''; }
        if (key === 'date') { from = ''; to = ''; fromInput.value = ''; toInput.value = ''; refreshRangeLabel(); }
        if (key === 'status') { selectedStatus = 'all'; statusSelect.value = selectedStatus; syncSelectLabel(statusSelect); }
        page = 1;
        paint();
      }; });
    }

    function paint() {
      var visible = activeRows();
      var pages = Math.max(1, Math.ceil(visible.length / pageSize));
      if (page > pages) page = pages;
      var start = (page - 1) * pageSize;
      var pageRows = visible.slice(start, start + pageSize);
      totalEl.innerHTML = totalLabel(visible.length);
      rowsEl.innerHTML = pageRows.length ? pageRows.map(function (row) {
        return '<tr><td><div class="ac-title">' + esc(row.title) + '</div><div class="ac-detail">' + esc(row.detail) + '</div></td><td><span class="ac-type">' + esc(row.type) + '</span></td><td><span class="ac-status ' + tone(row.status) + '">' + esc(row.status) + '</span></td><td class="ac-time">' + formatDate(row.at) + '</td></tr>';
      }).join('') : '<tr><td colspan="4"><div class="ac-empty">No activity matches these filters.</div></td></tr>';
      pagerEl.innerHTML = pagerHtml(pages);
      tagsEl.innerHTML = filterTagsHtml();
      if (window.I18N) { window.I18N.apply(rowsEl); window.I18N.apply(pagerEl); window.I18N.apply(tagsEl); }
      wirePager();
      wireFilterTags();
    }

    typeSelect.addEventListener('change', function () { selectedType = this.value; page = 1; paint(); });
    statusSelect.addEventListener('change', function () { selectedStatus = this.value; page = 1; paint(); });
    searchInput.addEventListener('input', function () { queryDraft = this.value; });
    searchInput.addEventListener('keydown', function (event) { if (event.key === 'Enter') { query = queryDraft.trim(); page = 1; paint(); } });
    searchInput.addEventListener('blur', function () { query = queryDraft.trim(); page = 1; paint(); });
    fromInput.addEventListener('change', function () { from = this.value; to = toInput.value; page = 1; paint(); });
    toInput.addEventListener('change', function () { from = fromInput.value; to = this.value; page = 1; paint(); });
    root.querySelector('[data-search-clear]').addEventListener('click', function () { query = ''; queryDraft = ''; searchInput.value = ''; page = 1; paint(); });
    paint();
  }

  window.VIEWS = window.VIEWS || {};
  window.VIEWS.activity = { render: render };
}());
