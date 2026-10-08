/* BestShopio Admin · Settings prototype — sample data.
   Mirrors reference/bestvoy-admin web-antd settings module field shapes & copy:
     base/components/render.tsx + EditForm.tsx (config_function_settings,
       tab_oauth_google/_facebook)
     payments/components/* (tab_switch_payment_processor + tab_pay_stripe/
       _airwallex/_paypal — credentials live in per-provider modals)
     currency/index.vue + edit.vue (/country/currency/list, CurrencyItem)
     metafields/components/* + admin/metafield.ts (definitions per owner_resource)
     shippableLocations/* + admin/shippableLocation.ts (/store/city/list table)
     shippingRates/* + settings/shippingRates.ts (profiles -> zones -> rates)
   SECURITY: no real secrets/keys. Secret-ish fields are masked ("sk_live_••••")
   or empty. App.js reads this global; nothing here is sent anywhere. */
window.DATA_SETTINGS = {
  // =========================================================================
  // NOTIFICATIONS — store-level sender identity + checkout transactional email.
  // Bestreach returns the verification records. This surface never owns the
  // storefront/checkout domain, DNS, or SSL lifecycle.
  // =========================================================================
  notifications: {
    // shared brand — injected into every notification (set once, applies to all)
    brand: {
      storeName: 'Lavender Labs',
      logo: { name: 'lavender-labs-email-logo.png', set: true },
      primaryColor: '#0066e6',
      contactEmail: 'support@lavenderlabs.co',
      footerText: 'Lavender Labs · All rights reserved.',
      address: '2261 Market St, San Francisco, CA 94114, US',
    },
    // store languages — single language for now (Silixwear-ES retired). Framework keeps locale capability.
    locales: [ { code: 'en', label: 'English' } ],
    // One sender identity is shared by all shop transactional messages.
    sender: {
      activeDomainId: 'lavender-bestcheckout-default',
      // The platform domain is shared. This store-owned prefix is provisioned once and cannot be edited.
      platformLocalPart: 'lavenderlabs',
      profile: { fromName: 'Lavender Labs', localPart: 'lavenderlabs', replyTo: '' },
      domains: [
        { id: 'lavender-bestcheckout-default', domain: 'mail.bestcheckout.com', status: 'platform', default: true, records: [] },
      ],
    },
    deliveryLog: [],
    groups: [
      { key: 'checkout', label: 'Checkout customer emails', events: [
        { code: 'checkout_purchase_finalized', name: 'Order confirmation', cls: 'Transactional', priority: 'P0',
          desc: 'Sent once after payment and every Upsell or Downsell decision are complete.',
          config: { enabled: true, subject: 'Order #{{order.number}} confirmed', preheader: 'Thanks for your purchase — here are your order details.',
            headline: 'Thank you for your order!', copy: 'We’ve received your payment and your order is being prepared. We’ll send tracking details when it ships.', updatedAt: '2026-07-28' } },
        { code: 'checkout_refunded', name: 'Order refund', cls: 'Transactional', priority: 'P1',
          desc: 'Sent when a refund is approved for the customer.',
          config: { enabled: false, subject: 'Refund notification', preheader: 'Total amount refunded: {{refund.amount}}. It may take up to 10 days for this refund to appear in your account.',
            headline: 'Your order has been refunded', copy: 'Total amount refunded: {{refund.amount}}. It may take up to 10 days for this refund to appear in your account.', updatedAt: '' } },
      ] },
      { key: 'marketing', label: 'Marketing emails', events: [
        { code: 'abandoned_checkout', name: 'Abandoned checkout reminder', cls: 'Marketing', priority: 'P2',
          trigger: 'checkout_abandoned',
          desc: 'Sent once to a subscribed buyer 60 minutes after an unpaid Hosted Checkout becomes abandoned. Shopify native abandoned checkouts stay in Shopify.',
          config: { enabled: true, subject: 'You left items in checkout', preheader: 'Finish your order for {{store.name}} before it expires.',
            headline: 'Your checkout is still waiting', copy: 'You left items in checkout. Use the button below to return to the same unpaid Hosted Checkout and finish payment.', updatedAt: '2026-08-25' } },
      ] },
    ],
  },

  // =========================================================================
  // BASE  (config_function_settings + tab_oauth_google / tab_oauth_facebook).
  // Page title in real admin: "Basic settings".
  // =========================================================================
  base: {
    store: {
      // site_logo (.png) / site_ico (.ico) / no_data_icon (.png) — URLs in prod.
      logo:   { name: 'site_logo.png', set: true,  rec: '112x40px',  format: 'png' },
      ico:    { name: 'favicon.ico',   set: true,  rec: '32x32px',   format: 'ico' },
      noData: { name: '',              set: false, rec: '274x274px', format: 'png' },
      // site_font (multi-select). Options come from the rule in prod.
      fonts: ['Inter', 'Playfair Display'],
      fontOptions: ['Inter', 'Playfair Display', 'Roboto', 'Lato', 'Merriweather', 'Source Sans 3'],
    },
    product: {
      // sys_reply_status / show_ot_price  ('1' on / '0' off)
      reviews:  { on: true,  desc: 'When enabled, product review information will be displayed on the homepage, product listing, and product detail pages.' },
      original: { on: true,  desc: 'When enabled, the original price and "off" discount label will be displayed for the product.' },
    },
    order: {
      // order_id_prefix / auto_close_order_timer (minutes, default 360) /
      // auto_take_order_timer (days, default 7)
      prefix: 'EN',
      autoCancelMinutes: 360,
      abandonThresholdMinutes: 60,
      recoveryWindowHours: 48,
      autoReceiveDays: 7,
    },
    // Social login — in the live admin only Google login is rendered (the
    // Facebook row is commented out in render.tsx). Secrets ALWAYS masked/empty.
    social: [
      {
        key: 'googleLogin', name: 'Google login', linked: true,
        modalTitle: 'Connect Google developer account',
        blurb: 'Allows users to sign up and login with their Google account.',
        fields: {
          // oauth_google_client_id / _client_secret / _redirect_uris
          appId: '8417263905-prototype.apps.googleusercontent.com',
          appSecret: 'GOCSPX-••••••••••••••••',           // masked
          redirectUris: 'https://silix.bestshopio.com/auth/google/callback',
        },
      },
    ],
  },

  // Shopify is the source of truth for store identity. The primary domain is
  // synced with the store connection and used to suggest a checkout subdomain.
  shopifyConnection: {
    storeName: 'Lavender Labs',
    myshopifyDomain: 'lavender-labs.myshopify.com',
    primaryDomain: 'lavenderlabs.co',
    primaryDomainSyncedAt: 'Just now',
  },

  // =========================================================================
  // PAYMENTS  (tab_switch_payment_processor + tab_pay_airwallex/_stripe/_paypal)
  //   The page itself only persists the processor radio; each provider's
  //   credentials are entered in its own modal. Card order in real admin:
  //   Airwallex first, then Stripe. PayPal contributes one shared account to
  //   both PayPal Wallet and (when eligible) the primary Cards slot.
  // =========================================================================
  // v2 渠道/方式模型（见 app.js renderPayments + docs/支付对接现状_Stripe_Airwallex.md）
  //   卡+Express = 单处理方槽位（cardProcessor，仅 active 一个）；PayPal Wallet /
  //   Klarna 自有直连为独立方式。PayPal 复用同一收款账户，但仍受主卡槽位互斥约束。
  //   phase 1 = 上线版（3 BYO）；phase 2 = 渠道扩展（更多 PSP + Klarna 直连）。
  payments: {
    phase: 1,                 // 1 = 一期上线版；2 = 二期渠道扩展（演示路线图）
    cardProcessor: 'paypal_cards',  // 当前 active 的卡+Express 处理方（必须已连接）
    cardsOn: true,            // 结账页是否挂卡输入
    expressOn: true,          // 结账页是否挂 Express 块
    // 可连接的卡处理方（同一时间只能 active 一个）；phase2 的在一期标「二期」
    processors: [
      { key: 'stripe',    name: 'Stripe',       logo: 'stripe.svg',    connected: true, mode: 'live' },
      { key: 'airwallex', name: 'Airwallex',    logo: 'airwallex.svg', connected: false, mode: 'live' },
      { key: 'adyen',     name: 'Adyen',        connected: false, phase2: true, mode: 'live' },
      { key: 'checkout',  name: 'Checkout.com', connected: false, phase2: true, mode: 'live' },
      { key: 'mollie',    name: 'Mollie',       connected: false, phase2: true, mode: 'live' },
      { key: 'nmi',       name: 'NMI',          connected: false, phase2: true, mode: 'live' }, // Apple Pay / Google Pay under Cards; fixed address; no subscription or additional charge
      { key: 'braintree', name: 'Braintree',    connected: false, phase2: true, mode: 'live' },
      { key: 'worldpay',  name: 'Worldpay',     connected: false, mode: 'live' }, // Access Checkout SDK: cards only
      { key: 'nuvei',     name: 'Nuvei',        connected: false, mode: 'live' }, // Web SDK cards + Apple Pay + Google Pay; no local APMs
      { key: 'antom',     name: 'Antom',        connected: false, mode: 'live' }, // Cards plus wallets from the same account
      { key: 'useepay',   name: 'UseePay',      connected: false, mode: 'live' }, // Cards + Apple Pay
      { key: 'oceanpay',  name: 'Oceanpay',     connected: false, mode: 'live' }, // Google Pay under Cards; fixed address; no Apple Pay
    ],
    // PayPal 账户只连一次：Wallet、Cards、Apple Pay、Google Pay 共享同一收款账户。
    // 具体钱包是否展示由账户能力、Checkout 域名状态和买家环境共同决定。
    paypal: {
      connected: true,
      walletOn: true,
      mode: 'live',
      capabilities: { cards: 'enabled', wallet: 'enabled', applePay: 'enabled', googlePay: 'enabled', venmo: 'enabled' },
      domain: { checkout: 'checkout.lovecross.com', applePay: 'verified' },
      lastSynced: 'just now',
    },
    klarna: { directConnected: true, directOn: true, mode: 'live' }, // 自有直连，仅二期展示
    // Shop Pay 不占卡槽、不收密钥。是否可用按当前店铺读 Shopify Payments
    //（Lavender Labs 已开通，Aura Living 未开通，见 assets/nav.js）。
    shopPay: { shopifyPayments: false },
  },

  // =========================================================================
  // ADVERTISING & ANALYTICS (BestCheckout V1)
  // BestCheckout reuses the separate Meta / GA4 / GTM configuration contracts.
  // Storefront detection is runtime evidence only; it never becomes a saved
  // credential until a merchant confirms the corresponding configuration.
  // =========================================================================
  advertisingAnalytics: {
    meta: {
      detection: {
        pixelIds: ['128745690123042'],
        source: 'Detected on your Shopify storefront',
      },
      // Mirrors the independent Meta Pixel + CAPI configuration endpoint.
      config: {
        pixelId: '',
        accessToken: '',
        enabled: false,
      },
    },
    ga4: {
      detection: {
        measurementIds: ['G-4N8P7HJ2'],
        source: 'Detected on your Shopify storefront',
      },
      // Mirrors the independent GA4 configuration endpoint. API secret stays
      // optional so browser delivery works without GA4 Measurement Protocol.
      config: {
        measurementId: 'G-4N8P7HJ2',
        apiSecret: '',
        enabled: true,
      },
    },
    gtm: {
      detection: {
        containerIds: ['GTM-N8X4P6Q'],
        source: 'Detected on your Shopify storefront',
      },
      // Mirrors the independent GTM configuration endpoint.
      config: {
        containerId: 'GTM-N8X4P6Q',
        enabled: true,
      },
    },
    events: [
      { id: 'begin_checkout', label: 'Checkout started', meta: 'InitiateCheckout', ga4: 'begin_checkout', gtm: 'begin_checkout', delivery: 'Checkout session · once' },
      { id: 'checkout_contact_info', label: 'Contact information', meta: '—', ga4: 'checkout_contact_info', gtm: 'checkout_contact_info', delivery: 'Browser event' },
      { id: 'add_shipping_info', label: 'Shipping information', meta: '—', ga4: 'add_shipping_info', gtm: 'add_shipping_info', delivery: 'Browser event' },
      { id: 'add_payment_info', label: 'Payment information', meta: 'AddPaymentInfo', ga4: 'add_payment_info', gtm: 'add_payment_info', delivery: 'Browser event' },
      { id: 'post_purchase_offer_view', label: 'Post-purchase offer', meta: 'PostPurchaseOfferView', ga4: 'post_purchase_offer_view', gtm: 'post_purchase_offer_view', delivery: 'Browser event' },
      { id: 'post_purchase_offer_accept', label: 'Post-purchase offer accepted', meta: 'PostPurchaseOfferAccept', ga4: 'post_purchase_offer_accept', gtm: 'post_purchase_offer_accept', delivery: 'Browser event' },
      { id: 'post_purchase_offer_decline', label: 'Post-purchase offer declined', meta: 'PostPurchaseOfferDecline', ga4: 'post_purchase_offer_decline', gtm: 'post_purchase_offer_decline', delivery: 'Browser event' },
      { id: 'purchase', label: 'Completed purchase', meta: 'Purchase', ga4: 'purchase', gtm: 'purchase', delivery: 'Browser + server · once per order' },
    ],
  },

  // =========================================================================
  // CURRENCY  (/country/currency/list)  — CurrencyItem shape.
  //   Columns: Country / Currency code / Currency symbol / Status /
  //   Exchange rate (text) / Price rounding (text) / Action.  No "Rate" column.
  // =========================================================================
  currency: {
    defaultCurrency: 'USD $',
    list: [
      // exchange_rate_type: 0 = automatic, 1 = manual (matches edit.vue)
      // exchange_rate_round_type: 0 = do not round, 1 = round up
      { id: 1, country_name: 'United States',  country_code: 'US', original_currency: 'USD', currency_code: 'USD', currency_symbol: '$',  currency_status: 1, exchange_rate_type: 0, exchange_rate_type_text: 'Automatic', exchange_rate: '1.0000',   exchange_rate_auto_value: '1.0000',   exchange_rate_round_type: 0, exchange_rate_round: 0, exchange_rate_round_type_text: 'Do not round prices',          exchange_rate_decimal: 2 },
      { id: 2, country_name: 'United Kingdom', country_code: 'GB', original_currency: 'USD', currency_code: 'GBP', currency_symbol: '£',  currency_status: 1, exchange_rate_type: 0, exchange_rate_type_text: 'Automatic', exchange_rate: '0.7820',   exchange_rate_auto_value: '0.7820',   exchange_rate_round_type: 1, exchange_rate_round: 1, exchange_rate_round_type_text: 'Round up to the nearest GBP £', exchange_rate_decimal: 2 },
      { id: 3, country_name: 'Eurozone',       country_code: 'EU', original_currency: 'USD', currency_code: 'EUR', currency_symbol: '€',  currency_status: 1, exchange_rate_type: 1, exchange_rate_type_text: 'Manual',    exchange_rate: '0.9200',   exchange_rate_auto_value: '0.9180',   exchange_rate_round_type: 1, exchange_rate_round: 1, exchange_rate_round_type_text: 'Round up to the nearest EUR €', exchange_rate_decimal: 2 },
      { id: 4, country_name: 'Canada',         country_code: 'CA', original_currency: 'USD', currency_code: 'CAD', currency_symbol: 'C$', currency_status: 1, exchange_rate_type: 0, exchange_rate_type_text: 'Automatic', exchange_rate: '1.3650',   exchange_rate_auto_value: '1.3650',   exchange_rate_round_type: 0, exchange_rate_round: 0, exchange_rate_round_type_text: 'Do not round prices',          exchange_rate_decimal: 2 },
      { id: 5, country_name: 'Australia',      country_code: 'AU', original_currency: 'USD', currency_code: 'AUD', currency_symbol: 'A$', currency_status: 0, exchange_rate_type: 0, exchange_rate_type_text: 'Automatic', exchange_rate: '1.5120',   exchange_rate_auto_value: '1.5120',   exchange_rate_round_type: 0, exchange_rate_round: 0, exchange_rate_round_type_text: 'Do not round prices',          exchange_rate_decimal: 2 },
      { id: 6, country_name: 'Japan',          country_code: 'JP', original_currency: 'USD', currency_code: 'JPY', currency_symbol: '¥',  currency_status: 1, exchange_rate_type: 1, exchange_rate_type_text: 'Manual',    exchange_rate: '157.4000', exchange_rate_auto_value: '157.1000', exchange_rate_round_type: 1, exchange_rate_round: 1, exchange_rate_round_type_text: 'Round up to the nearest JPY ¥', exchange_rate_decimal: 0 },
      { id: 7, country_name: 'Singapore',      country_code: 'SG', original_currency: 'USD', currency_code: 'SGD', currency_symbol: 'S$', currency_status: 0, exchange_rate_type: 0, exchange_rate_type_text: 'Automatic', exchange_rate: '1.3480',   exchange_rate_auto_value: '1.3480',   exchange_rate_round_type: 0, exchange_rate_round: 0, exchange_rate_round_type_text: 'Do not round prices',          exchange_rate_decimal: 2 },
    ],
    // search bar (SearchForm.vue): field selector + keyword + Status + Exchange rate
    searchFieldOptions: [
      { label: 'Country',         value: 'country_name' },
      { label: 'Currency code',   value: 'currency_code' },
      { label: 'Currency symbol', value: 'currency_symbol' },
    ],
  },

  // =========================================================================
  // METAFIELDS  (admin/metafield.ts).  Resource picker -> definitions list
  //   (Name / Data Type / Used in) -> add/edit form. No namespace.key column,
  //   no System pill in the list.  "Used in" = value_count.
  // =========================================================================
  metafields: {
    resources: [
      { key: 'products', title: 'Product',          badge: '',    desc: 'Define metafields that apply to products.' },
      { key: 'variants', title: 'Product variants', badge: 'SKU', desc: 'Define metafields that apply to product variants.' },
    ],
    // definitions per owner_resource. typeLabel = type_label; usedIn = value_count.
    definitions: {
      products: [
        { id: 101, name: 'Care instructions', type: 'multi_line_text',  typeLabel: 'Multi-line text', usedIn: 128 },
        { id: 102, name: 'Country of origin', type: 'single_line_text', typeLabel: 'Single line text', usedIn: 96 },
        { id: 103, name: 'Warranty period',   type: 'number_integer',   typeLabel: 'Integer',          usedIn: 54 },
        { id: 104, name: 'Is eco-friendly',   type: 'boolean',          typeLabel: 'True / false',     usedIn: 41 },
        { id: 105, name: 'Spec sheet',        type: 'url',              typeLabel: 'URL',              usedIn: 33 },
      ],
      variants: [
        { id: 201, name: 'Net weight',     type: 'weight',           typeLabel: 'Weight',           usedIn: 312 },
        { id: 202, name: 'Box dimensions', type: 'dimension',        typeLabel: 'Dimension',        usedIn: 188 },
        { id: 203, name: 'Barcode (UPC)',  type: 'single_line_text', typeLabel: 'Single line text', usedIn: 405 },
      ],
    },
    // type picker for the add-definition form (getMetafieldTypes — grouped).
    typeOptions: [
      { group: 'Text',   types: [ { type: 'single_line_text', label: 'Single line text' }, { type: 'multi_line_text', label: 'Multi-line text' } ] },
      { group: 'Number', types: [ { type: 'number_integer', label: 'Integer' }, { type: 'number_decimal', label: 'Decimal' }, { type: 'money', label: 'Money' } ] },
      { group: 'Other',  types: [ { type: 'boolean', label: 'True / false' }, { type: 'choice_list', label: 'Choice list' }, { type: 'date', label: 'Date' }, { type: 'date_time', label: 'Date and time' }, { type: 'url', label: 'URL' }, { type: 'json', label: 'JSON' }, { type: 'weight', label: 'Weight' }, { type: 'dimension', label: 'Dimension' } ] },
    ],
  },

  // =========================================================================
  // SHIPPABLE LOCATIONS  ("Ship locations", /store/city/list).  Expandable
  //   table (continent > country > province): Country/Region / Located in /
  //   Status (is_show -> Visible/Hidden) / Sort / Action (edit+delete).
  // =========================================================================
  locations: {
    // top-level rows; children are lazy-loaded in prod (here inlined).
    tree: [
      {
        id: 1, name: 'North America', level: 1, code: '', is_show: 1, sort: 100, snum: 3, located_in: '', children: [
          { id: 11, name: 'United States', level: 2, code: 'US', is_show: 1, sort: 30, snum: 4, located_in: 'North America', children: [
            { id: 111, name: 'California', level: 3, code: 'US-CA', is_show: 1, sort: 0, located_in: 'North America > United States' },
            { id: 112, name: 'New York',   level: 3, code: 'US-NY', is_show: 1, sort: 0, located_in: 'North America > United States' },
            { id: 113, name: 'Texas',      level: 3, code: 'US-TX', is_show: 1, sort: 0, located_in: 'North America > United States' },
            { id: 114, name: 'Hawaii',     level: 3, code: 'US-HI', is_show: 0, sort: 0, located_in: 'North America > United States' },
          ] },
          { id: 12, name: 'Canada', level: 2, code: 'CA', is_show: 1, sort: 20, snum: 3, located_in: 'North America', children: [
            { id: 121, name: 'Ontario',          level: 3, code: 'CA-ON', is_show: 1, sort: 0, located_in: 'North America > Canada' },
            { id: 122, name: 'British Columbia', level: 3, code: 'CA-BC', is_show: 1, sort: 0, located_in: 'North America > Canada' },
            { id: 123, name: 'Quebec',           level: 3, code: 'CA-QC', is_show: 0, sort: 0, located_in: 'North America > Canada' },
          ] },
          { id: 13, name: 'Mexico', level: 2, code: 'MX', is_show: 0, sort: 0, snum: 0, located_in: 'North America' },
        ],
      },
      {
        id: 2, name: 'Europe', level: 1, code: '', is_show: 1, sort: 90, snum: 4, located_in: '', children: [
          { id: 21, name: 'United Kingdom', level: 2, code: 'GB', is_show: 1, sort: 0, snum: 0, located_in: 'Europe' },
          { id: 22, name: 'Germany',        level: 2, code: 'DE', is_show: 1, sort: 0, snum: 0, located_in: 'Europe' },
          { id: 23, name: 'France',         level: 2, code: 'FR', is_show: 1, sort: 0, snum: 0, located_in: 'Europe' },
          { id: 24, name: 'Spain',          level: 2, code: 'ES', is_show: 0, sort: 0, snum: 0, located_in: 'Europe' },
        ],
      },
      {
        id: 3, name: 'Asia Pacific', level: 1, code: '', is_show: 0, sort: 0, snum: 3, located_in: '', children: [
          { id: 31, name: 'Australia', level: 2, code: 'AU', is_show: 1, sort: 0, snum: 0, located_in: 'Asia Pacific' },
          { id: 32, name: 'Japan',     level: 2, code: 'JP', is_show: 0, sort: 0, snum: 0, located_in: 'Asia Pacific' },
          { id: 33, name: 'Singapore', level: 2, code: 'SG', is_show: 0, sort: 0, snum: 0, located_in: 'Asia Pacific' },
        ],
      },
    ],
  },

  // =========================================================================
  // SHIPPING RATES  (shippingRates.ts — profiles -> zones -> rates).
  //   condition_type: 'none' | 'weight' | 'price' ; price 0 => Free.
  // =========================================================================
  rates: {
    currencySymbol: '$',
    profiles: [
      {
        id: 1, name: 'General shipping rates', is_general: 1,
        zones_count: 3, products_count: 0, regions_count: 28,
        zones: [
          {
            id: 11, name: 'United States', areas: ['United States'],
            rates: [
              { id: 111, name: 'Standard (5-8 business days)', condition_type: 'price',  min_value: 0,   max_value: 50,   price: 6.99 },
              { id: 112, name: 'Free shipping over $50',       condition_type: 'price',  min_value: 50,  max_value: null, price: 0 },
              { id: 113, name: 'Express (2-3 business days)',  condition_type: 'none',   min_value: null, max_value: null, price: 14.99 },
            ],
          },
          {
            id: 12, name: 'Canada', areas: ['Canada'],
            rates: [
              { id: 121, name: 'Standard (7-12 business days)', condition_type: 'weight', min_value: 0,    max_value: 1000, price: 9.99 },
              { id: 122, name: 'Heavy parcel (over 1kg)',       condition_type: 'weight', min_value: 1000, max_value: null, price: 19.99 },
            ],
          },
          {
            id: 13, name: 'Europe', areas: ['United Kingdom', 'Germany', 'France'],
            rates: [], // intentionally empty -> "no rates" warning state
          },
        ],
      },
      {
        id: 2, name: 'Oversized furniture', is_general: 0,
        zones_count: 1, products_count: 12, regions_count: 2,
        // custom-profile products (custom/ProductsPanel — store_name + variants)
        products: [
          { product_id: 9001, store_name: 'Sectional sofa — 3 seat', spec_type: 1, variantNum: 4 },
          { product_id: 9002, store_name: 'Oak dining table', spec_type: 0, variantNum: 0 },
        ],
        zones: [
          {
            id: 21, name: 'United States', areas: ['United States'],
            rates: [
              { id: 211, name: 'Freight delivery', condition_type: 'price', min_value: 0, max_value: null, price: 79.0 },
            ],
          },
        ],
      },
    ],
    // areas not covered by any zone (NoChargeAreas) — derived in prod.
    noChargeAreas: ['Mexico', 'Spain', 'Australia', 'Japan', 'Singapore'],
    // ShippingRateNameSelect suggestions (getShippingRateExistNames)
    rateNameSuggestions: ['Standard', 'Express', 'Economy', 'Free shipping', 'Next day delivery', 'Local pickup'],
  },

  // Subscription plans are created in BestCheckout. Shopify Selling Plans and
  // third-party subscription apps are not imported — merchants recreate the offer.
  // Visibility: Active Bundle + Active Plan → product-page buy box; otherwise checkout only.
  subscriptions: {
    lastSyncedAt: '2026-09-05 13:42',
    lastSyncedLabel: '5 min ago',
    sellingPlans: [
      {
        key: 'PL-1001',
        id: 'PL-1001',
        origin: 'bestcheckout',
        visibility: 'checkout',
        status: 'active',
        name: 'Subscribe at checkout',
        product: 'Daily Multivitamin (60 ct)',
        productSku: 'VIT-60',
        productId: '8211044098164',
        catalogPrice: 38,
        interval: { every: 1, unit: 'month' },
        discount: { type: 'percent', value: 15 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has no active Bundle, so BestCheckout does not take over the product page. Checkout follows the shopper\'s subscribe checkbox only when this plan is active.',
        createdAt: '2026-09-01',
      },
      {
        key: 'PL-1002',
        id: 'PL-1002',
        origin: 'bestcheckout',
        visibility: 'pdp',
        status: 'active',
        name: 'Refill every 2 months',
        product: 'Neurix Focus & Energy Gum',
        productSku: 'GUM-12',
        productId: '8392014826808',
        catalogPrice: 34.99,
        interval: { every: 2, unit: 'month' },
        discount: { type: 'fixed', value: 6 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has an active Bundle. Shoppers pick One-time or Subscribe & Save on the product page.',
        createdAt: '2026-09-04',
      },
      {
        key: 'PL-1003',
        id: 'PL-1003',
        origin: 'bestcheckout',
        visibility: 'pdp',
        status: 'active',
        name: 'Coffee — every month',
        product: 'Signature Blend Coffee 500g',
        productSku: 'COF-500',
        productId: '8211044229232',
        catalogPrice: 30,
        interval: { every: 1, unit: 'month' },
        discount: { type: 'percent', value: 20 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has an active Bundle. Shoppers pick One-time or Subscribe & Save on the product page.',
        createdAt: '2026-09-06',
      },
      {
        key: 'PL-1004',
        id: 'PL-1004',
        origin: 'bestcheckout',
        visibility: 'checkout',
        status: 'draft',
        name: 'Coffee — every 2 months',
        product: 'Signature Blend Coffee 500g',
        productSku: 'COF-500',
        productId: '8211044229232',
        catalogPrice: 30,
        interval: { every: 2, unit: 'month' },
        discount: { type: 'percent', value: 15 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has an active Bundle. Shoppers pick One-time or Subscribe & Save on the product page.',
        createdAt: '2026-09-06',
      },
      {
        key: 'PL-1005',
        id: 'PL-1005',
        origin: 'bestcheckout',
        visibility: 'checkout',
        status: 'draft',
        name: 'Focus Gum — monthly',
        product: 'Neurix Focus & Energy Gum',
        productSku: 'GUM-12',
        productId: '8392014826808',
        catalogPrice: 34.99,
        interval: { every: 1, unit: 'month' },
        discount: { type: 'percent', value: 15 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has an active Bundle. Shoppers pick One-time or Subscribe & Save on the product page.',
        createdAt: '2026-09-07',
      },
      {
        key: 'PL-1006',
        id: 'PL-1006',
        origin: 'bestcheckout',
        visibility: 'checkout',
        status: 'active',
        name: 'Serum weekly refill',
        product: 'Vitamin C Serum Refill 30ml',
        productSku: 'SER-30',
        productId: '8312001183744',
        catalogPrice: 52,
        interval: { every: 1, unit: 'week' },
        discount: { type: 'percent', value: 10 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has no active Bundle, so BestCheckout does not take over the product page. Checkout follows the shopper\'s subscribe checkbox only when this plan is active.',
        createdAt: '2026-09-08',
      },
      {
        key: 'PL-1007',
        id: 'PL-1007',
        origin: 'bestcheckout',
        visibility: 'checkout',
        status: 'draft',
        name: 'Serum every 3 weeks',
        product: 'Vitamin C Serum Refill 30ml',
        productSku: 'SER-30',
        productId: '8312001183744',
        catalogPrice: 52,
        interval: { every: 3, unit: 'week' },
        discount: { type: 'fixed', value: 4 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has no active Bundle, so BestCheckout does not take over the product page. Checkout follows the shopper\'s subscribe checkbox only when this plan is active.',
        createdAt: '2026-09-08',
      },
      {
        key: 'PL-1008',
        id: 'PL-1008',
        origin: 'bestcheckout',
        visibility: 'checkout',
        status: 'active',
        name: 'Holiday candle — yearly',
        product: 'Limited Winter Candle',
        productSku: 'CND-WIN',
        productId: '8277004450912',
        catalogPrice: 28,
        interval: { every: 1, unit: 'year' },
        discount: { type: 'percent', value: 0 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has no active Bundle, so BestCheckout does not take over the product page. Checkout follows the shopper\'s subscribe checkbox only when this plan is active.',
        createdAt: '2026-09-09',
      },
      {
        key: 'PL-1009',
        id: 'PL-1009',
        origin: 'bestcheckout',
        visibility: 'pdp',
        status: 'active',
        name: 'Collagen — every month',
        product: 'Collagen Peptides 30-Day',
        productSku: 'COL-30',
        productId: '8401122092032',
        catalogPrice: 44,
        interval: { every: 1, unit: 'month' },
        discount: { type: 'percent', value: 25 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has an active Bundle. Shoppers pick One-time or Subscribe & Save on the product page.',
        createdAt: '2026-09-10',
      },
      {
        key: 'PL-1010',
        id: 'PL-1010',
        origin: 'bestcheckout',
        visibility: 'checkout',
        status: 'draft',
        name: 'Subscribe & Save — refill before you run out',
        product: 'Daily Immune Support Complex with Elderberry (90 ct)',
        productSku: 'IMM-90',
        productId: '8199003300864',
        catalogPrice: 36,
        interval: { every: 3, unit: 'month' },
        discount: { type: 'percent', value: 12 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has no active Bundle, so BestCheckout does not take over the product page. Checkout follows the shopper\'s subscribe checkbox only when this plan is active.',
        createdAt: '2026-09-11',
      },
      {
        key: 'PL-1011',
        id: 'PL-1011',
        origin: 'bestcheckout',
        visibility: 'pdp',
        status: 'active',
        name: 'Sleep gummies — every 2 weeks',
        product: 'Magnesium Sleep Gummies',
        productSku: 'MAG-60',
        productId: '8366007725056',
        catalogPrice: 26,
        interval: { every: 2, unit: 'week' },
        discount: { type: 'percent', value: 8 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has an active Bundle. Shoppers pick One-time or Subscribe & Save on the product page.',
        createdAt: '2026-09-12',
      },
      {
        key: 'PL-1012',
        id: 'PL-1012',
        origin: 'bestcheckout',
        visibility: 'pdp',
        status: 'active',
        name: 'Protein weekly',
        product: 'Protein Powder 2lb',
        productSku: 'PRO-2LB',
        productId: '8441881600000',
        catalogPrice: 48,
        interval: { every: 1, unit: 'week' },
        discount: { type: 'fixed', value: 12 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has an active Bundle. Shoppers pick One-time or Subscribe & Save on the product page.',
        createdAt: '2026-09-13',
      },
      {
        key: 'PL-1013',
        id: 'PL-1013',
        origin: 'bestcheckout',
        visibility: 'pdp',
        status: 'draft',
        name: 'Protein — every month',
        product: 'Protein Powder 2lb',
        productSku: 'PRO-2LB',
        productId: '8441881600000',
        catalogPrice: 48,
        interval: { every: 1, unit: 'month' },
        discount: { type: 'percent', value: 30 },
        sourceApp: 'BestCheckout',
        mapping: 'local',
        mappingNote: 'This product has an active Bundle. Shoppers pick One-time or Subscribe & Save on the product page.',
        createdAt: '2026-09-13',
      },
    ],
    // Contracts map GET subscription/lst + GET subscription/detail/:id.
    // Status values match the live API: active | unpaid | cancelled.
    // These are BestCheckout-activated contracts after payment, including
    // post-purchase Upsell / Downsell accepts. Kaching / other Shopify apps
    // keep their own historical contracts.
    contracts: [
      {
        id: 'SUB-20680', subscriptionId: 20680, customer: 'Owen Park', email: 'owen.park@example.com',
        plan: 'Subscribe at checkout', planKey: 'PL-1001', product: 'Editorial shell dress', productSku: 'DRS-EDT',
        status: 'active', next: '2026-10-07', amount: 39.43, currency: 'USD', cyclesDone: 1, qty: 1,
        interval: { every: 1, unit: 'month' }, gateway: 'airwallex', method: 'Visa ···· 4242',
        startedAt: '2026-09-07', address: '44 Pine Street, Portland, OR 97204, US', phone: '+1 503 555 0190',
        source: 'post_purchase',
        history: [{ id: 5088, sn: 'EN1088', date: '2026-09-07', amount: 37.35, status: 'paid' }],
      },
      {
        id: 'SUB-20471', subscriptionId: 20471, customer: 'Grace Lee', email: 'grace.lee@example.com',
        plan: 'Subscribe at checkout', planKey: 'PL-1001', product: 'Daily Multivitamin (60 ct)', productSku: 'VIT-60',
        status: 'active', next: '2026-08-20', amount: 32.3, currency: 'USD', cyclesDone: 1, qty: 1,
        interval: { every: 2, unit: 'month' }, gateway: 'airwallex', method: 'Visa ···· 4242',
        startedAt: '2026-06-20', address: '118 King Street, Suite 6, Seattle, WA 98101, US', phone: '+1 206 555 0188',
        history: [{ id: 5046, sn: 'EN1038', date: '2026-06-20', amount: 32.3, status: 'paid' }],
      },
      {
        id: 'SUB-20452', subscriptionId: 20452, customer: 'Liam Smith', email: 'liam.s@example.com',
        plan: 'Subscribe at checkout', planKey: 'PL-1001', product: 'Daily Multivitamin (60 ct)', productSku: 'VIT-60',
        status: 'active', next: '2026-07-19', amount: 32.3, currency: 'USD', cyclesDone: 3, qty: 1,
        interval: { every: 1, unit: 'month' }, gateway: 'paypal', method: 'PayPal',
        startedAt: '2026-03-19', address: '9 Oak Ave, Denver, CO 80202, US', phone: '+1 303 555 0144',
        history: [
          { id: 5032, sn: 'EN1024', date: '2026-06-19', amount: 32.3, status: 'paid' },
          { id: 5018, sn: 'EN1010', date: '2026-05-19', amount: 32.3, status: 'paid' },
        ],
      },
      {
        id: 'SUB-20460', subscriptionId: 20460, customer: 'Mia Anderson', email: 'mia.a@example.com',
        plan: 'Deliver every month', planKey: 'SP-1001', product: 'Signature Blend Coffee 500g', productSku: 'COF-500',
        status: 'active', next: '2026-06-23', amount: 24, currency: 'USD', cyclesDone: 1, qty: 1,
        interval: { every: 1, unit: 'month' }, gateway: 'airwallex', method: 'Visa ···· 4242',
        startedAt: '2026-04-23', address: '19 Willow Ct, San Diego, CA 92101, US', phone: '+1 619 555 0110',
        history: [{ id: 5028, sn: 'EN1020', date: '2026-05-23', amount: 24, status: 'paid' }],
      },
      {
        id: 'SUB-20522', subscriptionId: 20522, customer: 'Nora Patel', email: 'nora.patel@example.com',
        plan: 'Refill every 2 months', planKey: 'PL-1002', product: 'Neurix Focus & Energy Gum', productSku: 'GUM-12',
        status: 'active', next: '2026-07-20', amount: 28.99, currency: 'USD', cyclesDone: 1, qty: 1,
        interval: { every: 1, unit: 'month' }, gateway: 'stripe', method: 'Google Pay',
        startedAt: '2026-06-20', address: '19 Queen Victoria Street, London, EC4N 4SA, UK', phone: '+44 20 7946 0712',
        history: [{ id: 5052, sn: 'EN1044', date: '2026-06-20', amount: 28.99, status: 'paid' }],
      },
      {
        id: 'SUB-20518', subscriptionId: 20518, customer: 'Aisha Rahman', email: 'aisha.rahman@example.com',
        plan: 'Deliver every 2 months', planKey: 'SP-1002', product: 'Signature Blend Coffee 500g', productSku: 'COF-500',
        status: 'active', next: '2026-08-19', amount: 25.5, currency: 'USD', cyclesDone: 2, qty: 1,
        interval: { every: 2, unit: 'month' }, gateway: 'stripe', method: 'Apple Pay',
        startedAt: '2026-04-19', address: '18 Orchard Road, Level 10, Singapore 238823', phone: '+65 6555 0118',
        history: [
          { id: 5048, sn: 'EN1040', date: '2026-06-19', amount: 25.5, status: 'paid' },
          { id: 5004, sn: 'EN0996', date: '2026-04-19', amount: 25.5, status: 'paid' },
        ],
      },
      {
        id: 'SUB-20472', subscriptionId: 20472, customer: 'Grace Lee', email: 'grace.lee@example.com',
        plan: 'Deliver every month', planKey: 'SP-1001', product: 'Signature Blend Coffee 500g', productSku: 'COF-500',
        status: 'active', next: '2026-07-20', amount: 24, currency: 'USD', cyclesDone: 1, qty: 1,
        interval: { every: 1, unit: 'month' }, gateway: 'airwallex', method: 'Visa ···· 4242',
        startedAt: '2026-06-20', address: '118 King Street, Suite 6, Seattle, WA 98101, US', phone: '+1 206 555 0188',
        history: [{ id: 5046, sn: 'EN1038', date: '2026-06-20', amount: 24, status: 'paid' }],
      },
      {
        id: 'SUB-20473', subscriptionId: 20473, customer: 'Grace Lee', email: 'grace.lee@example.com',
        plan: 'Monthly refill', planKey: 'SP-2104', product: 'Daily Multivitamin (60 ct)', productSku: 'VIT-60',
        status: 'unpaid', next: '2026-06-16', amount: 31.92, currency: 'USD', cyclesDone: 2, qty: 1,
        interval: { every: 1, unit: 'month' }, gateway: 'stripe', method: 'Visa ···· 1881',
        startedAt: '2026-04-16', address: '118 King Street, Suite 6, Seattle, WA 98101, US', phone: '+1 206 555 0188',
        history: [
          { id: 5038, sn: 'EN1030', date: '2026-06-16', amount: 31.92, status: 'failed' },
          { id: 5012, sn: 'EN1004', date: '2026-05-16', amount: 31.92, status: 'paid' },
        ],
      },
      {
        id: 'SUB-20458', subscriptionId: 20458, customer: 'Isabella Martin', email: 'isabella.m@example.com',
        plan: 'Every 8 weeks', planKey: 'SP-3310', product: 'Vitamin C Serum Refill 30ml', productSku: 'SKN-VC30',
        status: 'cancelled', next: '', amount: 45, currency: 'USD', cyclesDone: 8, qty: 1,
        interval: { every: 8, unit: 'week' }, gateway: 'airwallex', method: 'Visa ···· 6677',
        startedAt: '2024-09-10', endedAt: '2026-05-10', address: '61 Walnut Dr, Chicago, IL 60601, US', phone: '+1 312 555 0166',
        history: [{ id: 4990, sn: 'EN0982', date: '2026-03-10', amount: 45, status: 'paid' }],
      },
    ],
  },
};
