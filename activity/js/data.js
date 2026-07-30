/*
 * Merchant-facing activity fixture.
 *
 * The prototype deliberately keeps the browser-only data source, but models the
 * contract that the product needs: a stable event id, source, actor, subject,
 * outcome and a small, safe change summary. Production writes this shape after
 * the business transaction or integration job reaches its relevant outcome.
 */
(function () {
  window.DATA_ACTIVITY = [
    {
      id: 'act_20260720_order_sync_review', at: '2026-07-20T11:08:00', category: 'orders', outcome: 'requires_action', severity: 'warning',
      title: 'Order #EN1045 needs Shopify sync', detail: 'Shopify could not accept this paid order because its delivery profile is unavailable. Review the connection and retry sync before fulfillment begins.',
      actor: { name: 'BestCheckout', type: 'System' }, source: 'Shopify integration', subject: { label: 'Order #EN1045', kind: 'Order', href: '#/orders/5053' },
      action: { label: 'Review order', href: '#/orders/5053' }, changes: [{ label: 'Writeback status', before: 'Sending to Shopify', after: 'Needs review' }]
    },
    {
      id: 'act_20260720_flow_published', at: '2026-07-20T10:42:00', category: 'deployment', outcome: 'succeeded', severity: 'info',
      title: 'Published “First order booster”', detail: 'New buyers can now see the checkout and an optional one-click offer.',
      actor: { name: 'Mia Chen', type: 'Staff' }, source: 'BestCheckout', subject: { label: 'First order booster', kind: 'Purchase flow', href: '#/flows' },
      deployment: 'Deployment #42', changes: [{ label: 'Buyer entry', before: 'Shopify Checkout', after: 'First order booster' }, { label: 'Offer', before: 'Off', after: 'One-click upsell' }]
    },
    {
      id: 'act_20260720_order_writeback', at: '2026-07-20T09:16:00', category: 'orders', outcome: 'succeeded', severity: 'info',
      title: 'Order #EN1048 sent to Shopify', detail: 'The paid order is ready for your existing fulfillment workflow.',
      actor: { name: 'BestCheckout', type: 'System' }, source: 'Shopify integration', subject: { label: 'Order #EN1048', kind: 'Order', href: '#/orders/5056' },
      changes: [{ label: 'Writeback status', before: 'Sending to Shopify', after: 'In Shopify' }]
    },
    {
      id: 'act_20260719_refund_completed', at: '2026-07-19T17:08:00', category: 'orders', outcome: 'succeeded', severity: 'info',
      title: 'Shopify refund synced for order #EN1028', detail: 'Shopify marked this order as fully refunded. BestCheckout has updated the order status.',
      actor: { name: 'Shopify', type: 'Service' }, source: 'Shopify integration', subject: { label: 'Order #EN1028', kind: 'Order', href: '#/orders/5037' },
      changes: [{ label: 'Refund amount', before: '$0.00', after: '$78.00' }, { label: 'Order status', before: 'Paid', after: 'Refunded' }]
    },
    {
      id: 'act_20260719_paypal_attention', at: '2026-07-19T14:21:00', category: 'payments', outcome: 'requires_action', severity: 'warning',
      title: 'PayPal needs your attention', detail: 'Reconnect the account before new buyers can choose PayPal at checkout.',
      actor: { name: 'PayPal', type: 'Service' }, source: 'Payment service', subject: { label: 'PayPal', kind: 'Payment service', href: '#/settings/payments' },
      action: { label: 'Reconnect PayPal', href: '#/settings/payments' }, changes: [{ label: 'Connection', before: 'Connected', after: 'Reconnect required' }]
    },
    {
      id: 'act_20260719_staff_access', at: '2026-07-19T11:05:00', category: 'team', outcome: 'succeeded', severity: 'info',
      title: 'Updated staff access for Jordan Lee', detail: 'Jordan can now review orders and manage checkout pages for this store.',
      actor: { name: 'Mia Chen', type: 'Staff' }, source: 'BestCheckout', subject: { label: 'Jordan Lee', kind: 'Staff member', href: '#/settings/staff' },
      changes: [{ label: 'Role', before: 'Order reviewer', after: 'Order reviewer, page editor' }]
    },
    {
      id: 'act_20260718_domain_connected', at: '2026-07-18T16:32:00', category: 'integration', outcome: 'succeeded', severity: 'info',
      title: 'Checkout domain connected', detail: 'Customers can now open checkout.lavenderlabs.co securely.',
      actor: { name: 'BestCheckout', type: 'System' }, source: 'Domain service', subject: { label: 'checkout.lavenderlabs.co', kind: 'Checkout domain', href: '#/settings/domains' },
      changes: [{ label: 'Domain status', before: 'Waiting for DNS', after: 'Connected' }]
    },
    {
      id: 'act_20260718_catalog_sync', at: '2026-07-18T13:18:00', category: 'integration', outcome: 'succeeded', severity: 'info',
      title: 'Checkout catalog updated', detail: 'The latest available products and discounts can now be used in purchase flows.',
      actor: { name: 'Shopify', type: 'Service' }, source: 'Shopify integration', subject: { label: 'Catalog sync', kind: 'Shopify connection', href: '#/settings/base' },
      changes: [{ label: 'Products available to checkout', before: '248', after: '252' }, { label: 'Discounts', before: '12', after: '14' }]
    },
    {
      id: 'act_20260718_page_version', at: '2026-07-18T10:46:00', category: 'deployment', outcome: 'succeeded', severity: 'info',
      title: 'Updated Thank you page', detail: 'The order confirmation message and recommended product block were changed.',
      actor: { name: 'Jordan Lee', type: 'Staff' }, source: 'BestCheckout', subject: { label: 'Aura Thank you page', kind: 'Checkout page', href: '#/pages' },
      changes: [{ label: 'Page version', before: 'v8', after: 'v9' }]
    },
    {
      id: 'act_20260717_scope_updated', at: '2026-07-17T18:04:00', category: 'integration', outcome: 'in_progress', severity: 'info',
      title: 'Shopify permissions update requested', detail: 'The store owner needs to approve the updated access request in Shopify.',
      actor: { name: 'Mia Chen', type: 'Staff' }, source: 'Shopify integration', subject: { label: 'Shopify connection', kind: 'Integration', href: '#/settings/base' },
      action: { label: 'Review connection', href: '#/settings/base' }, changes: [{ label: 'Access request', before: 'Current permissions', after: 'Awaiting approval' }]
    },
    {
      id: 'act_20260717_flow_paused', at: '2026-07-17T15:37:00', category: 'deployment', outcome: 'succeeded', severity: 'info',
      title: 'Paused “Returning customer offer”', detail: 'New buyers who match this rule now continue to the next live flow or Shopify Checkout.',
      actor: { name: 'Mia Chen', type: 'Staff' }, source: 'BestCheckout', subject: { label: 'Returning customer offer', kind: 'Purchase flow', href: '#/flows' },
      changes: [{ label: 'Buyer entry', before: 'Live', after: 'Paused' }]
    },
    {
      id: 'act_20260716_airwallex_verified', at: '2026-07-16T11:18:00', category: 'payments', outcome: 'succeeded', severity: 'info',
      title: 'Airwallex connection verified', detail: 'Card and express checkout are ready to accept payments.',
      actor: { name: 'Airwallex', type: 'Service' }, source: 'Payment service', subject: { label: 'Airwallex', kind: 'Payment service', href: '#/settings/payments' },
      changes: [{ label: 'Connection', before: 'Checking', after: 'Ready to accept payments' }]
    },
    {
      id: 'act_20260715_webhook_review', at: '2026-07-15T14:06:00', category: 'integration', outcome: 'requires_action', severity: 'warning',
      title: 'Shopify delivery update needs review', detail: 'One delivery update could not be processed. Buyers can still complete checkout.',
      actor: { name: 'Shopify', type: 'Service' }, source: 'Shopify integration', subject: { label: 'Shopify connection', kind: 'Integration', href: '#/settings/base' },
      action: { label: 'Review connection', href: '#/settings/base' }, changes: [{ label: 'Service health', before: 'Healthy', after: 'Needs review' }]
    },
    {
      id: 'act_20260714_flow_routing', at: '2026-07-14T09:34:00', category: 'deployment', outcome: 'succeeded', severity: 'info',
      title: 'Updated first-order boost routing', detail: 'New customers now receive the intended checkout allocation.',
      actor: { name: 'Mia Chen', type: 'Staff' }, source: 'BestCheckout', subject: { label: 'First order booster', kind: 'Purchase flow', href: '#/flows' },
      deployment: 'Deployment #41', changes: [{ label: 'New customer allocation', before: '50%', after: '100%' }]
    }
  ];
}());
