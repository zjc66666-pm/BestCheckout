/* BestCheckout Admin · Bundles — transactional quantity-break offers.
   Created in BestCheckout so checkout can price the order. No widget styling,
   Mix & Match, or storefront template. Subscriptions are imported separately. */
window.DATA_BUNDLES = {
  templates: [
    { value: 'volume', label: 'Quantity break', desc: 'Same product, quantity tiers, optional gifts.' },
  ],

  bundles: [
    {
      id: 'BND-01', name: 'Focus Gum — Multipack', parentProduct: 'Neurix Focus & Energy Gum', parentProductId: '8392014826808', parentSku: 'GUM-12',
      template: 'volume', status: 'active', tierCount: 3, orders: 312, createdAt: '2026-05-01',
      tiers: [
        { qty: 1, title: '1 PC', price: 34.99, compareAt: 49, gifts: [] },
        { qty: 2, title: '2 PCS', price: 49.30, compareAt: 98, gifts: [{ product: 'Focus E-Book', qty: 1 }] },
        { qty: 3, title: '3 PCS', price: 69.60, compareAt: 147, gifts: [{ product: 'Focus E-Book', qty: 1 }, { product: 'Shaker Bottle', qty: 1 }] },
      ],
    },
    {
      id: 'BND-02', name: 'Coffee Lovers 3-Pack', parentProduct: 'Signature Blend Coffee', parentProductId: '8211044229232', parentSku: 'COF-500',
      template: 'volume', status: 'draft', tierCount: 3, orders: 0, createdAt: '2026-06-01',
      tiers: [
        { qty: 1, title: '1 bag', price: 24.00, compareAt: 30, gifts: [] },
        { qty: 2, title: '2 bags', price: 42.00, compareAt: 60, gifts: [] },
        { qty: 3, title: '3 bags', price: 58.00, compareAt: 90, gifts: [{ product: 'Cold Brew Concentrate', qty: 1 }] },
      ],
    },
    {
      id: 'BND-07', name: 'Coffee Office Pack', parentProduct: 'Signature Blend Coffee', parentProductId: '8211044229232', parentSku: 'COF-500',
      template: 'volume', status: 'active', tierCount: 3, orders: 42, createdAt: '2026-06-17',
      tiers: [
        { qty: 1, title: 'Single', price: 24.00, compareAt: 30, gifts: [] },
        { qty: 3, title: 'Office 3-Pack', price: 62.00, compareAt: 90, gifts: [] },
        { qty: 6, title: 'Office 6-Pack', price: 114.00, compareAt: 180, gifts: [{ product: 'Shaker Bottle', qty: 1 }] },
      ],
    },
    {
      id: 'BND-06', name: 'Focus Gum Trial Bundle', parentProduct: 'Neurix Focus & Energy Gum', parentProductId: '8392014826808', parentSku: 'GUM-12',
      template: 'volume', status: 'draft', tierCount: 2, orders: 0, createdAt: '2026-06-16',
      tiers: [
        { qty: 1, title: 'Trial', price: 29.99, compareAt: 34.99, gifts: [] },
        { qty: 2, title: 'Buy 2', price: 49.30, compareAt: 69.98, gifts: [] },
      ],
    },
  ],

  samples: {
    volume: {
      parentProduct: '',
      tiers: [
        { qty: 1, title: '', price: '', compareAt: '', gifts: [] },
        { qty: 2, title: '', price: '', compareAt: '', gifts: [] },
      ],
    },
  },
};
