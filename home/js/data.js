/* BestShopio Admin - Home dashboard mock.
   Period summaries are intentionally aggregated here so Home stays independent
   from the lazy-loaded Analytics workspace. */
(function () {
  window.DATA_HOME = {
    periods: {
      '7d': {
        label: 'Last 7 days',
        comparison: 'vs previous 7 days',
        metrics: [
          { title: 'Sales through BestCheckout', value: '$117,284', change: '+16.7%' },
          { title: 'Completed orders', value: '2,016', change: '+14.9%' },
          { title: 'Checkout conversion', value: '63.8%', change: '+4.7 pts', shopifyLift: '+4.7 pts' },
          { title: 'Additional offer sales', value: '$11,552', change: '+13.2%' }
        ],
        series: [13200, 14860, 15520, 16140, 17280, 18310, 21974],
        labels: ['Jul 9', 'Jul 10', 'Jul 11', 'Jul 12', 'Jul 13', 'Jul 14', 'Jul 15'],
        flows: [
          { name: 'First-order boost', sessions: '742', orders: '498', conversion: '67.1%', aov: '$62.40', sales: '$31,075', lift: '+6.4 pts', id: 'first-order-boost' },
          { name: 'Smooth checkout', sessions: '1,274', orders: '812', conversion: '63.7%', aov: '$55.75', sales: '$45,269', lift: '+4.1 pts', id: 'smooth-checkout' }
        ],
        offers: [
          { type: 'Upsell', title: 'Sleep Bundle offer', rate: '21.4%', sales: '$5,420', note: 'Shoppers accepted after payment', tone: 'blue' },
          { type: 'Upsell', title: 'Magnesium refill', rate: '16.8%', sales: '$2,180', note: 'Shoppers accepted after payment', tone: 'blue' },
          { type: 'Upsell', title: 'Night recovery pack', rate: '12.6%', sales: '$1,042', note: 'Shoppers accepted after payment', tone: 'blue' },
          { type: 'Downsell', title: 'Half-size alternative', rate: '9.8%', sales: '$1,860', note: 'Recovered after the first offer was declined', tone: 'violet' },
          { type: 'Downsell', title: 'Trial bottle', rate: '7.1%', sales: '$1,050', note: 'Recovered after the first offer was declined', tone: 'violet' }
        ]
      },
      '30d': {
        label: 'Last 30 days',
        comparison: 'vs previous 30 days',
        metrics: [
          { title: 'Sales through BestCheckout', value: '$490,044', change: '+18.4%' },
          { title: 'Completed orders', value: '8,420', change: '+17.8%' },
          { title: 'Checkout conversion', value: '64.2%', change: '+5.1 pts', shopifyLift: '+5.1 pts' },
          { title: 'Additional offer sales', value: '$46,360', change: '+12.9%' }
        ],
        series: [14120, 15240, 14980, 16040, 17120, 16980, 18140, 18820, 20160, 21040, 21870, 23120],
        labels: ['Jun 24', 'Jun 27', 'Jun 30', 'Jul 3', 'Jul 6', 'Jul 9', 'Jul 12', 'Jul 15'],
        flows: [
          { name: 'First-order boost', sessions: '3,116', orders: '2,116', conversion: '67.9%', aov: '$62.40', sales: '$132,038', lift: '+6.4 pts', id: 'first-order-boost' },
          { name: 'Smooth checkout', sessions: '5,304', orders: '3,405', conversion: '64.2%', aov: '$55.75', sales: '$189,859', lift: '+4.8 pts', id: 'smooth-checkout' }
        ],
        offers: [
          { type: 'Upsell', title: 'Sleep Bundle offer', rate: '21.4%', sales: '$22,020', note: 'Shoppers accepted after payment', tone: 'blue' },
          { type: 'Upsell', title: 'Magnesium refill', rate: '16.8%', sales: '$8,860', note: 'Shoppers accepted after payment', tone: 'blue' },
          { type: 'Upsell', title: 'Night recovery pack', rate: '12.6%', sales: '$4,240', note: 'Shoppers accepted after payment', tone: 'blue' },
          { type: 'Downsell', title: 'Half-size alternative', rate: '9.8%', sales: '$7,180', note: 'Recovered after the first offer was declined', tone: 'violet' },
          { type: 'Downsell', title: 'Trial bottle', rate: '7.1%', sales: '$4,060', note: 'Recovered after the first offer was declined', tone: 'violet' }
        ]
      },
      '90d': {
        label: 'Last 90 days',
        comparison: 'vs previous 90 days',
        metrics: [
          { title: 'Sales through BestCheckout', value: '$1,367,890', change: '+15.2%' },
          { title: 'Completed orders', value: '23,470', change: '+13.6%' },
          { title: 'Checkout conversion', value: '62.9%', change: '+4.3 pts', shopifyLift: '+4.3 pts' },
          { title: 'Additional offer sales', value: '$122,130', change: '+12.2%' }
        ],
        series: [138800, 143220, 148140, 150680, 154920, 160140, 163480, 169030, 174920, 181340, 187220, 196000],
        labels: ['Apr 17', 'May 1', 'May 15', 'May 29', 'Jun 12', 'Jun 26', 'Jul 10', 'Jul 15'],
        flows: [
          { name: 'First-order boost', sessions: '8,576', orders: '5,742', conversion: '66.9%', aov: '$62.18', sales: '$357,082', lift: '+5.9 pts', id: 'first-order-boost' },
          { name: 'Smooth checkout', sessions: '14,894', orders: '9,373', conversion: '62.9%', aov: '$55.94', sales: '$524,404', lift: '+4.2 pts', id: 'smooth-checkout' }
        ],
        offers: [
          { type: 'Upsell', title: 'Sleep Bundle offer', rate: '21.4%', sales: '$58,140', note: 'Shoppers accepted after payment', tone: 'blue' },
          { type: 'Upsell', title: 'Magnesium refill', rate: '16.8%', sales: '$23,400', note: 'Shoppers accepted after payment', tone: 'blue' },
          { type: 'Upsell', title: 'Night recovery pack', rate: '12.6%', sales: '$11,210', note: 'Shoppers accepted after payment', tone: 'blue' },
          { type: 'Downsell', title: 'Half-size alternative', rate: '9.8%', sales: '$18,760', note: 'Recovered after the first offer was declined', tone: 'violet' },
          { type: 'Downsell', title: 'Trial bottle', rate: '7.1%', sales: '$10,620', note: 'Recovered after the first offer was declined', tone: 'violet' }
        ]
      }
    },
    // lift / shopifyLift are per metric. Show “+X pts vs Shopify” only when
    // that value is ahead of Shopify; omit it when the same store or row is behind.
    stores: {
      kiln: {
        periods: {
          '7d': {
            label: 'Last 7 days',
            comparison: 'vs previous 7 days',
            behindShopify: true,
            metrics: [
              { title: 'Sales through BestCheckout', value: '$48,620', change: '+6.2%' },
              { title: 'Completed orders', value: '892', change: '+4.1%' },
              { title: 'Checkout conversion', value: '54.1%', change: '-1.8 pts', shopifyLift: '' },
              { title: 'Additional offer sales', value: '$3,240', change: '+2.8%' }
            ],
            series: [6120, 6480, 6310, 7020, 6840, 7410, 8440],
            labels: ['Jul 9', 'Jul 10', 'Jul 11', 'Jul 12', 'Jul 13', 'Jul 14', 'Jul 15'],
            flows: [
              { name: 'First-order boost', sessions: '486', orders: '274', conversion: '56.4%', aov: '$54.80', sales: '$15,015', lift: '+2.3 pts', id: 'first-order-boost' },
              { name: 'Smooth checkout', sessions: '1,162', orders: '618', conversion: '53.2%', aov: '$54.38', sales: '$33,607', lift: '', id: 'smooth-checkout' }
            ],
            offers: [
              { type: 'Upsell', title: 'Add the travel mug', rate: '12.6%', sales: '$1,480', note: 'Shoppers accepted after payment', tone: 'blue' },
              { type: 'Upsell', title: 'Add paper filters', rate: '9.2%', sales: '$700', note: 'Shoppers accepted after payment', tone: 'blue' },
              { type: 'Downsell', title: 'Half-bag alternative', rate: '6.4%', sales: '$680', note: 'Recovered after the first offer was declined', tone: 'violet' },
              { type: 'Downsell', title: 'Just the beans', rate: '4.8%', sales: '$380', note: 'Recovered after the first offer was declined', tone: 'violet' }
            ]
          },
          '30d': {
            label: 'Last 30 days',
            comparison: 'vs previous 30 days',
            behindShopify: true,
            metrics: [
              { title: 'Sales through BestCheckout', value: '$198,440', change: '+5.4%' },
              { title: 'Completed orders', value: '3,684', change: '+3.8%' },
              { title: 'Checkout conversion', value: '53.6%', change: '-2.1 pts', shopifyLift: '' },
              { title: 'Additional offer sales', value: '$12,870', change: '+1.9%' }
            ],
            series: [14820, 15240, 14680, 15840, 15420, 16180, 15940, 16820, 16460, 17120],
            labels: ['Jun 24', 'Jun 27', 'Jun 30', 'Jul 3', 'Jul 6', 'Jul 9', 'Jul 12', 'Jul 15'],
            flows: [
              { name: 'First-order boost', sessions: '2,086', orders: '1,164', conversion: '55.8%', aov: '$54.80', sales: '$63,787', lift: '+1.9 pts', id: 'first-order-boost' },
              { name: 'Smooth checkout', sessions: '4,792', orders: '2,520', conversion: '52.6%', aov: '$53.43', sales: '$134,644', lift: '', id: 'smooth-checkout' }
            ],
            offers: [
              { type: 'Upsell', title: 'Add the travel mug', rate: '12.4%', sales: '$5,860', note: 'Shoppers accepted after payment', tone: 'blue' },
              { type: 'Upsell', title: 'Add paper filters', rate: '9.1%', sales: '$2,780', note: 'Shoppers accepted after payment', tone: 'blue' },
              { type: 'Downsell', title: 'Half-bag alternative', rate: '6.2%', sales: '$2,710', note: 'Recovered after the first offer was declined', tone: 'violet' },
              { type: 'Downsell', title: 'Just the beans', rate: '4.6%', sales: '$1,520', note: 'Recovered after the first offer was declined', tone: 'violet' }
            ]
          },
          '90d': {
            label: 'Last 90 days',
            comparison: 'vs previous 90 days',
            behindShopify: true,
            metrics: [
              { title: 'Sales through BestCheckout', value: '$562,180', change: '+4.6%' },
              { title: 'Completed orders', value: '10,428', change: '+3.2%' },
              { title: 'Checkout conversion', value: '52.9%', change: '-2.4 pts', shopifyLift: '' },
              { title: 'Additional offer sales', value: '$36,210', change: '+1.4%' }
            ],
            series: [54800, 56120, 55480, 57240, 56820, 58140, 57680, 59030, 58420, 60200],
            labels: ['Apr 17', 'May 1', 'May 15', 'May 29', 'Jun 12', 'Jun 26', 'Jul 10', 'Jul 15'],
            flows: [
              { name: 'First-order boost', sessions: '5,842', orders: '3,186', conversion: '54.5%', aov: '$54.62', sales: '$174,019', lift: '+1.4 pts', id: 'first-order-boost' },
              { name: 'Smooth checkout', sessions: '13,876', orders: '7,242', conversion: '52.2%', aov: '$53.59', sales: '$388,089', lift: '', id: 'smooth-checkout' }
            ],
            offers: [
              { type: 'Upsell', title: 'Add the travel mug', rate: '12.1%', sales: '$16,540', note: 'Shoppers accepted after payment', tone: 'blue' },
              { type: 'Upsell', title: 'Add paper filters', rate: '8.8%', sales: '$7,840', note: 'Shoppers accepted after payment', tone: 'blue' },
              { type: 'Downsell', title: 'Half-bag alternative', rate: '6.1%', sales: '$7,560', note: 'Recovered after the first offer was declined', tone: 'violet' },
              { type: 'Downsell', title: 'Just the beans', rate: '4.5%', sales: '$4,270', note: 'Recovered after the first offer was declined', tone: 'violet' }
            ]
          }
        }
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
