import { badge, button, icon, pageHeader } from '../components/common.js';
import { ACTIVITY_FILTERS } from '../type.js';
import { escapeHtml } from '../utils.js';

export function renderActivity(state) {
  const isZh = state.ui.locale === 'zh';
  const text = function (en, zh) { return isZh ? zh : en; };
  const filterLabels = {
    all: text('All updates', '全部更新'),
    payment: text('Payments', '支付'),
    'post-purchase': text('Buyer offers', '买家优惠'),
    sync: text('Store data', '店铺数据'),
    writeback: text('Shopify orders', 'Shopify 订单'),
    tracking: text('Sales tracking', '销售追踪'),
  };
  const events = state.activity.filter(function (event) {
    return state.ui.activityFilter === 'all' || event.category === state.ui.activityFilter;
  });
  const options = ACTIVITY_FILTERS.map(function (filter) {
    return '<option value="' + filter.id + '"' + (state.ui.activityFilter === filter.id ? ' selected' : '') + '>' + filterLabels[filter.id] + '</option>';
  }).join('');
  const rows = events.map(function (event) {
    const iconName = event.category === 'post-purchase' ? 'sparkles' : event.category === 'payment' ? 'card' : event.category === 'tracking' ? 'pixel' : event.category === 'sync' ? 'sync' : 'orders';
    return '<article class="timeline-event"><div class="timeline-marker activity-' + escapeHtml(event.category) + '">' + icon(iconName, 17) + '</div><div class="timeline-card"><header><div><strong>' + escapeHtml(isZh && event.titleZh ? event.titleZh : event.title) + '</strong><span>' + escapeHtml(isZh && event.timeZh ? event.timeZh : event.time) + '</span></div>' + badge(event.status) + '</header><p>' + escapeHtml(isZh && event.detailZh ? event.detailZh : event.detail) + '</p><footer><button type="button" class="button button-plain" data-action="view-activity-detail" data-event-id="' + escapeHtml(event.id) + '">' + escapeHtml(text('View details', '查看详情')) + '</button></footer></div></article>';
  }).join('');
  const header = pageHeader(text('Activity', '活动日志'), text('Follow payments, buyer offers, store updates and Shopify orders in one place.', '在一个页面查看支付、买家优惠、店铺数据更新和 Shopify 订单状态。'));
  return '<div class="page-stack">' + header + '<section class="activity-summary-grid"><div class="card activity-summary"><span class="summary-icon summary-success">' + icon('check', 17) + '</span><div><strong>1,284</strong><small>' + escapeHtml(text('Completed today', '今日已完成')) + '</small></div></div><div class="card activity-summary"><span class="summary-icon summary-info">' + icon('sparkles', 17) + '</span><div><strong>18</strong><small>' + escapeHtml(text('Offers skipped safely', '已安全跳过的优惠')) + '</small></div></div><div class="card activity-summary"><span class="summary-icon summary-warning">' + icon('sync', 17) + '</span><div><strong>3</strong><small>' + escapeHtml(text('Shopify orders recovered', '已恢复的 Shopify 订单')) + '</small></div></div><div class="card activity-summary"><span class="summary-icon summary-critical">' + icon('alert', 17) + '</span><div><strong>0</strong><small>' + escapeHtml(text('Orders needing attention', '待处理订单')) + '</small></div></div></section><div class="filter-bar activity-filter-bar"><div class="activity-filter-rail"><label class="activity-filter-select" for="activity-filter"><span>' + escapeHtml(text('Update type', '更新类型')) + '</span><select id="activity-filter" data-change="activity-filter">' + options + '</select></label><i aria-hidden="true"></i><div class="activity-search-control">' + icon('search', 16) + '<input type="search" placeholder="' + escapeHtml(text('Search an order or update', '搜索订单或更新')) + '" aria-label="' + escapeHtml(text('Search activity', '搜索活动日志')) + '" data-activity-search /></div></div><span class="filter-meta" data-activity-count>' + events.length + ' ' + escapeHtml(text('updates shown', '条更新')) + '</span></div><section class="timeline" aria-label="BestCheckout activity timeline">' + rows + '</section></div>';
}
