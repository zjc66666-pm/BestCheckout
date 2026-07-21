/* BestShopio Admin - Home dashboard mock.
   Period summaries are intentionally aggregated here so Home stays independent
   from the lazy-loaded Analytics workspace. */
(function () {
  window.DATA_HOME = {
    periods: {
      today: {
        label: 'Today',
        comparison: 'vs yesterday',
        metrics: [
          { title: 'Checkout sales', value: '$1,284.60', change: '+12.4%', href: '#/performance' },
          { title: 'Completed checkouts', value: '27', change: '+8.0%', href: '#/orders' },
          { title: 'Checkout conversion', value: '64.2%', change: '+5.1 pts', href: '#/performance' },
          { title: 'Offer revenue', value: '$168.40', change: '+18.6%', href: '#/performance' }
        ],
        series: [310, 468, 392, 624, 545, 812, 701, 982],
        labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00', 'Now']
      },
      '7d': {
        label: 'Last 7 days',
        comparison: 'vs previous 7 days',
        metrics: [
          { title: 'Checkout sales', value: '$8,642.90', change: '+14.8%', href: '#/performance' },
          { title: 'Completed checkouts', value: '186', change: '+10.7%', href: '#/orders' },
          { title: 'Checkout conversion', value: '63.8%', change: '+4.7 pts', href: '#/performance' },
          { title: 'Offer revenue', value: '$1,146.80', change: '+16.2%', href: '#/performance' }
        ],
        series: [842, 1186, 1054, 1318, 1146, 1438, 1659],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      '30d': {
        label: 'Last 30 days',
        comparison: 'vs previous 30 days',
        metrics: [
          { title: 'Checkout sales', value: '$31,624.20', change: '+9.3%', href: '#/performance' },
          { title: 'Completed checkouts', value: '684', change: '+7.6%', href: '#/orders' },
          { title: 'Checkout conversion', value: '64.2%', change: '+5.1 pts', href: '#/performance' },
          { title: 'Offer revenue', value: '$4,286.40', change: '+14.9%', href: '#/performance' }
        ],
        series: [702, 816, 768, 946, 1092, 986, 1250, 1118, 1374, 1480],
        labels: ['Jun 14', 'Jun 17', 'Jun 20', 'Jun 23', 'Jun 26', 'Jun 29', 'Jul 2', 'Jul 5', 'Jul 8', 'Today']
      }
    },
    storeHealth: [
      { label: 'Shopify connection', value: 'Connected', detail: 'lavender-labs.myshopify.com', tone: 'ok', href: '#/settings/base' },
      { label: 'Payment services', value: '3 ready', detail: 'Airwallex, Stripe, PayPal', tone: 'ok', href: '#/payments' },
      { label: 'Checkout domain', value: 'Connected', detail: 'checkout.lavenderlabs.co', tone: 'ok', href: '#/domains' },
      { key: 'flows', label: 'Purchase flows', href: '#/flows' }
    ],
    update: {
      version: 'Next step',
      title: 'Preview the live checkout before sending traffic.',
      detail: 'Publish only the purchase flow you want buyers to enter.',
      href: '#/flows'
    }
  };
}());
