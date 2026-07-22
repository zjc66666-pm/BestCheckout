import { badge, icon, metricCard, pageHeader, sectionHeader } from '../components/common.js';
import { PERFORMANCE_TABS } from '../type.js';
import { escapeHtml } from '../utils.js';

const DATA_END = '2026-07-15';
const DATE_RANGES = {
  '7d': { id: '7d', title: 'Last 7 days', label: 'Jul 9 – Jul 15', start: '2026-07-09', end: '2026-07-15' },
  '14d': { id: '14d', title: 'Last 14 days', label: 'Jul 2 – Jul 15', start: '2026-07-02', end: '2026-07-15' },
  '30d': { id: '30d', title: 'Last 30 days', label: 'Jun 16 – Jul 15', start: '2026-06-16', end: '2026-07-15' },
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseDate(value) {
  const parts = String(value || '').split('-').map(Number);
  if (parts.length !== 3 || parts.some(function (part) { return !Number.isInteger(part); })) return null;
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return date.getUTCFullYear() === parts[0] && date.getUTCMonth() === parts[1] - 1 && date.getUTCDate() === parts[2] ? date : null;
}

function dateKey(date) { return date.getUTCFullYear() + '-' + String(date.getUTCMonth() + 1).padStart(2, '0') + '-' + String(date.getUTCDate()).padStart(2, '0'); }
function shiftDate(value, days) { const date = parseDate(value); if (!date) return value; date.setUTCDate(date.getUTCDate() + days); return dateKey(date); }
function formatDate(value, includeYear) { const date = parseDate(value); return date ? MONTHS[date.getUTCMonth()] + ' ' + date.getUTCDate() + (includeYear ? ', ' + date.getUTCFullYear() : '') : value; }
function daysBetween(start, end) { const first = parseDate(start); const last = parseDate(end); return first && last ? Math.max(1, Math.round((last - first) / 86400000) + 1) : 14; }
function formatRange(start, end) { const first = parseDate(start); const last = parseDate(end); return first && last ? formatDate(start, first.getUTCFullYear() !== last.getUTCFullYear()) + ' – ' + formatDate(end, first.getUTCFullYear() !== last.getUTCFullYear()) : 'Custom range'; }

function rangeFor(state) {
  const preset = DATE_RANGES[state.ui.performanceDateRange];
  if (preset) return Object.assign({}, preset, { days: daysBetween(preset.start, preset.end) });
  const start = parseDate(state.ui.performanceCustomStart) ? state.ui.performanceCustomStart : DATE_RANGES['14d'].start;
  const end = parseDate(state.ui.performanceCustomEnd) ? state.ui.performanceCustomEnd : DATE_RANGES['14d'].end;
  return { id: 'custom', label: formatRange(start, end), start: start, end: end, days: daysBetween(start, end) };
}

function rangeTicks(range) { const total = Math.max(0, range.days - 1); return [0, .33, .67, 1].map(function (part) { return formatDate(shiftDate(range.start, Math.round(total * part))); }); }
function valuesForRange(chart, range) {
  const requested = Math.max(1, range.days); const source = chart.slice();
  if (requested <= source.length) return source.slice(-requested);
  const additional = requested - source.length; const first = source[0] || 40;
  const history = Array.from({ length: additional }, function (_, index) { const distance = additional - index; return Math.max(6, first - Math.round(distance * .65) + ((index * 3) % 5) - 2); });
  return history.concat(source);
}

function pointY(values, value) { const height = 190; const min = Math.min.apply(null, values) - 3; const max = Math.max.apply(null, values) + 3; return height - ((value - min) / Math.max(1, max - min)) * height; }
function chartPath(values) {
  const width = 720; const height = 190; const min = Math.min.apply(null, values) - 3; const max = Math.max.apply(null, values) + 3; const divisor = Math.max(1, values.length - 1);
  return values.map(function (value, index) { const x = (index / divisor) * width; const y = height - ((value - min) / Math.max(1, max - min)) * height; return (index === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1); }).join(' ');
}

function scaleNumber(value, factor, prefix) {
  if (!value || value === '—') return value;
  const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(numeric) ? (prefix || '') + Math.round(numeric * factor).toLocaleString('en-US') : value;
}

function rowsForRange(state, range) {
  const factor = range.days / 14;
  return state.performanceRows[state.ui.performanceTab].map(function (row) { return Object.assign({}, row, { sessions: scaleNumber(row.sessions, factor), revenue: scaleNumber(row.revenue, factor, String(row.revenue || '').indexOf('$') === 0 ? '$' : '') }); });
}

function renderRows(state, range) {
  return rowsForRange(state, range).map(function (row) { return '<tr><td><strong data-i18n-skip>' + escapeHtml(row.name) + '</strong></td><td class="num">' + escapeHtml(row.sessions) + '</td><td class="num">' + escapeHtml(row.conversion) + '</td><td class="num">' + escapeHtml(row.aov) + '</td><td class="num">' + escapeHtml(row.revenue) + '</td><td class="num">' + (row.lift === 'Review' ? badge('Action required', 'Review') : '<span class="table-lift">' + escapeHtml(row.lift) + '</span>') + '</td></tr>'; }).join('');
}

function metricsForRange(metrics, range) {
  const factor = range.days / 14;
  return { gmv: Object.assign({}, metrics.gmv, { value: scaleNumber(metrics.gmv.value, factor, '$') || metrics.gmv.value }), conversion: Object.assign({}, metrics.conversion), aov: Object.assign({}, metrics.aov), recovered: Object.assign({}, metrics.recovered, { value: scaleNumber(metrics.recovered.value, factor, '$') || metrics.recovered.value }) };
}

function dateRangeControl(state, range) {
  const open = !!state.ui.performanceDatePickerOpen;
  const draftStart = state.ui.performanceDateDraftStart || range.start;
  const draftEnd = state.ui.performanceDateDraftEnd || range.end;
  const error = state.ui.performanceDateError ? '<p class="date-range-error" role="alert">' + escapeHtml(state.ui.performanceDateError) + '</p>' : '';
  const presets = ['7d', '14d', '30d'].map(function (id) { const preset = DATE_RANGES[id]; return '<button type="button" class="date-preset' + (range.id === id ? ' is-active' : '') + '" data-action="set-performance-date-preset" data-range="' + id + '"><strong>' + preset.title + '</strong><span>' + preset.label + '</span></button>'; }).join('');
  const popover = open ? '<section class="date-range-popover" role="dialog" aria-label="Choose date range"><div class="date-range-popover-head"><strong>Date range</strong><button type="button" class="date-range-close" data-action="close-performance-date-picker" aria-label="Close">×</button></div><div class="date-preset-grid">' + presets + '</div><div class="date-range-custom"><strong>Custom range</strong><div class="date-range-inputs"><label><span>Start date</span><input type="date" min="2025-07-16" max="' + DATA_END + '" value="' + escapeHtml(draftStart) + '" data-performance-date-start></label><span class="date-range-separator">to</span><label><span>End date</span><input type="date" min="2025-07-16" max="' + DATA_END + '" value="' + escapeHtml(draftEnd) + '" data-performance-date-end></label></div><p>Data is available through Jul 15, 2026.</p>' + error + '</div><footer><button type="button" class="button button-secondary" data-action="cancel-performance-date-picker">Cancel</button><button type="button" class="button button-primary" data-action="apply-performance-date-range">Apply</button></footer></section>' : '';
  return '<div class="performance-date-filter"><span class="date-range-label">Date range</span><button type="button" class="date-range-trigger" data-action="toggle-performance-date-picker" aria-expanded="' + open + '"><span>' + escapeHtml(range.label) + '</span>' + icon('chevron', 15) + '</button>' + popover + '</div>';
}

export function renderPerformance(state) {
  const range = rangeFor(state); const values = valuesForRange(state.chart, range); const ticks = rangeTicks(range); const metrics = metricsForRange(state.metrics, range);
  const header = pageHeader('Performance', 'Compare funnel, page, payment provider and acquisition channel outcomes.', dateRangeControl(state, range));
  const metricMarkup = '<section class="metric-grid">' + metricCard('Attributed GMV', metrics.gmv, 'analytics') + metricCard('Checkout conversion', metrics.conversion, 'flow') + metricCard('Average order value', metrics.aov, 'orders') + metricCard('Post-purchase revenue', metrics.recovered, 'sparkles') + '</section>';
  const points = values.map(function (value, index) { const x = (index / Math.max(1, values.length - 1)) * 720; return '<circle cx="' + x.toFixed(1) + '" cy="' + pointY(values, value).toFixed(1) + '" r="3.5"></circle>'; }).join('');
  const tabs = PERFORMANCE_TABS.map(function (tab) { const selected = state.ui.performanceTab === tab.id; return '<button type="button" role="tab" aria-selected="' + selected + '" class="tab' + (selected ? ' is-active' : '') + '" data-action="set-performance-tab" data-tab="' + tab.id + '">' + tab.label + '</button>'; }).join('');
  return '<div class="page-stack">' + header + metricMarkup + '<section class="card performance-chart-card"><div class="card-pad">' + sectionHeader('Checkout revenue trend', 'BestCheckout attributed GMV · daily · ' + range.label, '<span class="comparison-chip">vs Shopify checkout <strong>+18.4%</strong></span>') + '<div class="chart-wrap"><div class="chart-axis"><span>$8k</span><span>$6k</span><span>$4k</span><span>$2k</span><span>$0</span></div><svg class="performance-chart" viewBox="0 0 720 210" role="img" aria-label="Revenue for ' + escapeHtml(range.label) + '"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#29845a" stop-opacity=".22"/><stop offset="1" stop-color="#29845a" stop-opacity="0"/></linearGradient></defs><path class="chart-area" d="' + chartPath(values) + ' L720 210 L0 210 Z"></path><path class="chart-line" d="' + chartPath(values) + '"></path><g class="chart-points">' + points + '</g></svg><div class="chart-dates"><span>' + ticks[0] + '</span><span>' + ticks[1] + '</span><span>' + ticks[2] + '</span><span>' + ticks[3] + '</span></div></div></div></section><section class="card"><div class="table-toolbar"><div class="tabs" role="tablist">' + tabs + '</div><span class="performance-table-range">' + escapeHtml(range.label) + '</span></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Name</th><th class="num">Sessions</th><th class="num">Conversion / rate</th><th class="num">AOV / metric</th><th class="num">Revenue</th><th class="num">Lift</th></tr></thead><tbody>' + renderRows(state, range) + '</tbody></table></div></section><section class="attribution-footnote"><span>' + icon('shield', 18) + '</span><div><strong>Performance uses completed-order revenue</strong><p>Sales performance is confirmed after payment and accepted buyer offers are complete. Completed orders continue to Shopify for fulfillment.</p></div><button type="button" class="button button-plain" data-route="settings?tab=tracking">Review sales tracking</button></section></div>';
}
