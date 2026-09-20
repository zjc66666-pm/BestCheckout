/* BestCheckout Admin · Bundles — quantity-break offers on a Shopify parent product.
   Active Bundle replaces that product's Shopify purchase area. Subscriptions stay
   in Subscriptions and are not configured here. */
window.DATA_BUNDLES = {
  templates: [
    { value: 'volume', label: 'Quantity break', desc: 'Same product, quantity tiers, optional gifts.' },
  ],
  badges: ['Most Popular', 'Best Value', 'Best Deal', 'Limited Time'],

  bundles: [
    {
      id: 'BND-01', name: 'Focus Gum — Multipack', parentProduct: 'Neurix Focus & Energy Gum', parentProductId: '8392014826808', parentSku: 'GUM-12',
      template: 'volume', status: 'active', tierCount: 3, orders: 312, createdAt: '2026-05-01',
      brandColor: '#8a5a2b',
      header: { text: 'The offer ending soon', align: 'center', line: true, thickness: 2 },
      defaultTier: 1,
      tiers: [
        { qty: 1, title: 'Buy 1', subtitle: '1 pack', price: 34.99, compareAt: 49, badge: '', tag: '', gifts: [] },
        { qty: 2, title: 'Buy 2, Get 1 FREE', subtitle: 'You save 50%', price: 49.30, compareAt: 98, badge: 'Most Popular', tag: 'Save 50%', gifts: [{ product: 'Focus E-Book', qty: 1, displayName: 'FREE Focus E-Book' }] },
        { qty: 3, title: 'Buy 3, Get 3 FREE', subtitle: 'You save 53%', price: 69.60, compareAt: 147, badge: 'Best Value', tag: 'Save 53%', gifts: [{ product: 'Focus E-Book', qty: 1, displayName: 'FREE Focus E-Book' }, { product: 'Shaker Bottle', qty: 1, displayName: 'FREE Shaker' }] },
      ],
    },
    {
      id: 'BND-02', name: 'Coffee Lovers 3-Pack', parentProduct: 'Signature Blend Coffee', parentProductId: '8211044229232', parentSku: 'COF-500',
      template: 'volume', status: 'draft', tierCount: 3, orders: 0, createdAt: '2026-06-01',
      brandColor: '#8a5a2b',
      header: { text: 'Stock up while the offer lasts', align: 'center', line: false, thickness: 2 },
      defaultTier: 1,
      tiers: [
        { qty: 1, title: '1 bag', subtitle: '', price: 24.00, compareAt: 30, badge: '', tag: '', gifts: [] },
        { qty: 2, title: '2 bags', subtitle: '', price: 42.00, compareAt: 60, badge: '', tag: '', gifts: [] },
        { qty: 3, title: '3 bags', subtitle: '', price: 58.00, compareAt: 90, badge: 'Best Value', tag: '', gifts: [{ product: 'Cold Brew Concentrate', qty: 1, displayName: 'FREE Cold Brew' }] },
      ],
    },
    {
      id: 'BND-07', name: 'Coffee Office Pack', parentProduct: 'Signature Blend Coffee', parentProductId: '8211044229232', parentSku: 'COF-500',
      template: 'volume', status: 'active', tierCount: 3, orders: 42, createdAt: '2026-06-17',
      brandColor: '#3f6b34',
      header: { text: 'The offer ending soon', align: 'center', line: true, thickness: 2 },
      defaultTier: 1,
      tiers: [
        { qty: 1, title: 'Single', subtitle: '1 bag', price: 24.00, compareAt: 30, badge: '', tag: '', gifts: [] },
        { qty: 3, title: 'Office 3-Pack', subtitle: 'Most offices start here', price: 62.00, compareAt: 90, badge: 'Most Popular', tag: 'Save 31%', gifts: [] },
        { qty: 6, title: 'Office 6-Pack', subtitle: '', price: 114.00, compareAt: 180, badge: 'Best Value', tag: '', gifts: [{ product: 'Shaker Bottle', qty: 1, displayName: 'FREE Shaker' }] },
      ],
    },
    {
      id: 'BND-06', name: 'Focus Gum Trial Bundle', parentProduct: 'Neurix Focus & Energy Gum', parentProductId: '8392014826808', parentSku: 'GUM-12',
      template: 'volume', status: 'draft', tierCount: 2, orders: 0, createdAt: '2026-06-16',
      brandColor: '#8a5a2b',
      header: { text: '', align: 'center', line: false, thickness: 2 },
      defaultTier: 0,
      tiers: [
        { qty: 1, title: 'Trial', subtitle: '', price: 29.99, compareAt: 34.99, badge: '', tag: '', gifts: [] },
        { qty: 2, title: 'Buy 2', subtitle: '', price: 49.30, compareAt: 69.98, badge: '', tag: '', gifts: [] },
      ],
    },
    {
      id: 'BND-03', name: 'Collagen Daily Pack', parentProduct: 'Collagen Peptides 30-Day', parentProductId: '8401122092032', parentSku: 'COL-30',
      template: 'volume', status: 'active', tierCount: 3, orders: 86, createdAt: '2026-07-02',
      brandColor: '#8a5a2b',
      header: { text: 'The offer ending soon', align: 'center', line: true, thickness: 2 },
      defaultTier: 1,
      tiers: [
        { qty: 1, title: '1 jar', subtitle: '30-day supply', price: 44, compareAt: 54, badge: '', tag: '', gifts: [] },
        { qty: 2, title: '2 jars', subtitle: 'You save 18%', price: 72, compareAt: 88, badge: 'Most Popular', tag: 'Save 18%', gifts: [{ product: 'Scoop', qty: 1, displayName: 'FREE Scoop' }] },
        { qty: 3, title: '3 jars', subtitle: 'Best value', price: 99, compareAt: 132, badge: 'Best Value', tag: 'Save 25%', gifts: [{ product: 'Scoop', qty: 1, displayName: 'FREE Scoop' }, { product: 'Shaker Bottle', qty: 1, displayName: 'FREE Shaker' }] },
      ],
    },
    {
      id: 'BND-04', name: 'Collagen Starter', parentProduct: 'Collagen Peptides 30-Day', parentProductId: '8401122092032', parentSku: 'COL-30',
      template: 'volume', status: 'draft', tierCount: 2, orders: 0, createdAt: '2026-07-03',
      brandColor: '#8a5a2b',
      header: { text: '', align: 'center', line: false, thickness: 2 },
      defaultTier: 0,
      tiers: [
        { qty: 1, title: 'Starter', subtitle: '', price: 39, compareAt: 44, badge: '', tag: '', gifts: [] },
        { qty: 2, title: 'Starter + 1', subtitle: '', price: 68, compareAt: 88, badge: '', tag: '', gifts: [] },
      ],
    },
    {
      id: 'BND-08', name: 'Protein Stack', parentProduct: 'Protein Powder 2lb', parentProductId: '8441881600000', parentSku: 'PRO-2LB',
      template: 'volume', status: 'active', tierCount: 4, orders: 51, createdAt: '2026-07-18',
      brandColor: '#3f6b34',
      header: { text: 'Stock up while the offer lasts', align: 'center', line: true, thickness: 2 },
      defaultTier: 1,
      tiers: [
        { qty: 1, title: '1 tub', subtitle: '', price: 48, compareAt: 56, badge: '', tag: '', gifts: [] },
        { qty: 2, title: '2 tubs', subtitle: '', price: 86, compareAt: 112, badge: 'Most Popular', tag: 'Save 23%', gifts: [] },
        { qty: 3, title: '3 tubs', subtitle: '', price: 120, compareAt: 168, badge: '', tag: '', gifts: [{ product: 'Shaker Bottle', qty: 1, displayName: 'FREE Shaker' }] },
        { qty: 6, title: '6 tubs', subtitle: 'Team stock-up', price: 216, compareAt: 336, badge: 'Best Value', tag: 'Save 36%', gifts: [{ product: 'Shaker Bottle', qty: 2, displayName: 'FREE Shaker x2' }] },
      ],
    },
    {
      id: 'BND-09', name: 'Protein Sample', parentProduct: 'Protein Powder 2lb', parentProductId: '8441881600000', parentSku: 'PRO-2LB',
      template: 'volume', status: 'draft', tierCount: 1, orders: 0, createdAt: '2026-07-19',
      brandColor: '#8a5a2b',
      header: { text: '', align: 'center', line: false, thickness: 2 },
      defaultTier: 0,
      tiers: [
        { qty: 1, title: '1 tub', subtitle: '', price: 48, compareAt: '', badge: '', tag: '', gifts: [] },
      ],
    },
    {
      id: 'BND-10', name: 'Candle Holiday Box', parentProduct: 'Limited Winter Candle', parentProductId: '8277004450912', parentSku: 'CND-WIN',
      template: 'volume', status: 'draft', tierCount: 2, orders: 0, createdAt: '2026-08-01',
      brandColor: '#8a5a2b',
      header: { text: 'Limited holiday run', align: 'center', line: false, thickness: 2 },
      defaultTier: 0,
      tiers: [
        { qty: 1, title: '1 candle', subtitle: '', price: 28, compareAt: '', badge: '', tag: '', gifts: [] },
        { qty: 3, title: '3 candles', subtitle: 'Gift set', price: 72, compareAt: 84, badge: 'Best Deal', tag: '', gifts: [] },
      ],
    },
    {
      id: 'BND-12', name: 'Night Magnesium Pack', parentProduct: 'Magnesium Sleep Gummies', parentProductId: '8366007725056', parentSku: 'MAG-60',
      template: 'volume', status: 'active', tierCount: 2, orders: 19, createdAt: '2026-08-12',
      brandColor: '#3f6b34',
      header: { text: 'The offer ending soon', align: 'center', line: true, thickness: 2 },
      defaultTier: 0,
      tiers: [
        { qty: 1, title: '1 bottle', subtitle: '60 gummies', price: 26, compareAt: 32, badge: '', tag: '', gifts: [] },
        { qty: 2, title: '2 bottles', subtitle: '', price: 46, compareAt: 64, badge: 'Most Popular', tag: 'Save 28%', gifts: [] },
      ],
    },
    {
      id: 'BND-13', name: 'Complete Recovery Routine — Home Gym Starter Kit', parentProduct: 'Daily Immune Support Complex with Elderberry (90 ct)', parentProductId: '8199003300864', parentSku: 'IMM-90',
      template: 'volume', status: 'draft', tierCount: 3, orders: 0, createdAt: '2026-08-20',
      brandColor: '#8a5a2b',
      header: { text: '', align: 'center', line: false, thickness: 2 },
      defaultTier: 1,
      tiers: [
        { qty: 1, title: 'Single bottle — try the daily immune routine', subtitle: '', price: 36, compareAt: 42, badge: '', tag: '', gifts: [] },
        { qty: 2, title: 'Two-month supply', subtitle: '', price: 64, compareAt: 84, badge: 'Most Popular', tag: '', gifts: [] },
        { qty: 3, title: 'Family stock-up', subtitle: '', price: 90, compareAt: 126, badge: 'Best Value', tag: '', gifts: [{ product: 'Travel Tin', qty: 1, displayName: 'FREE Travel Tin' }] },
      ],
    },
  ],

  samples: {
    volume: {
      parentProduct: '',
      brandColor: '#8a5a2b',
      header: { text: 'The offer ending soon', align: 'center', line: true, thickness: 2 },
      buttonText: 'Buy Now',
      defaultTier: 1,
      tiers: [
        { qty: 1, title: '1 PC', subtitle: '', price: 34.99, compareAt: 49, badge: '', tag: '', components: [{ role: 'main', product: '', qty: 1, displayName: '' }] },
        { qty: 2, title: '2 PCS', subtitle: 'One to wear, one to wash.', price: 49.30, compareAt: 98, badge: 'Most Popular', tag: '50% OFF', components: [{ role: 'main', product: '', qty: 2, displayName: '' }] },
        { qty: 3, title: '3 PCS', subtitle: '', price: 69.60, compareAt: 147, badge: 'Best Value', tag: 'Save 30%', components: [{ role: 'main', product: '', qty: 3, displayName: '' }] },
      ],
    },
  },
};
