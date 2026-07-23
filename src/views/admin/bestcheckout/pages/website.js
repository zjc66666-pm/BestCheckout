import { icon } from '../components/common.js';

const capabilities = [
  { step: '01', iconName: 'sparkles', title: 'Own the purchase moment', description: 'On-brand checkout journeys', features: ['Visual builder', 'Custom domains', 'Native wallets'] },
  { step: '02', iconName: 'analytics', title: 'Offer with intent', description: 'Rules that stay clear', features: ['1-click upsells', 'A/B testing', 'Logic engine'] },
  { step: '03', iconName: 'shield', title: 'Operate with confidence', description: 'Shopify stays in sync', features: ['Live inventory', 'Order tagging', 'Payment routing'] },
];

const outcomes = [
  { value: '12,400', target: 12400, decimals: 0, prefix: '', suffix: '+', label: 'Shopify merchants running BestCheckout' },
  { value: '$2.8', target: 2.8, decimals: 1, prefix: '$', suffix: 'B+', label: 'GMV processed through BestCheckout journeys' },
  { value: '+23', target: 23, decimals: 0, prefix: '+', suffix: '%', label: 'Average checkout conversion lift vs. standard checkout' },
  { value: '99.98', target: 99.98, decimals: 2, prefix: '', suffix: '%', label: 'Shopify order sync reliability' },
];

const testimonials = [
  { quote: 'We went live in 47 minutes. Recovery flow added 18% to monthly revenue without touching our Shopify theme. Orders sync before our fulfillment team even opens the dashboard.', metric: '+18% MRR', initials: 'SC', name: 'Sarah Chen', role: 'Founder, Vera & Oak Skincare' },
  { quote: 'Checkout conversion jumped from 2.1% to 3.4% in the first week. The offer sequencing logic is the clearest I have used - no guessing what fires when.', metric: '3.4% conversion', initials: 'MW', name: 'Marcus Williams', role: 'Head of Ecommerce, Northline Outerwear' },
  { quote: 'Post-purchase upsells that do not feel like spam. AOV lifted $34 on average and customer support tickets did not move. That is the signal.', metric: '+$34 AOV', initials: 'ER', name: 'Elena Rodriguez', role: 'DTC Lead, Compound Coffee Co.' },
  { quote: 'Every payment goes through our existing Shopify Payments setup. No re-onboarding, no split reconciliation. BestCheckout is a layer, not a replacement.', metric: '100% sync', initials: 'JP', name: 'Jordan Park', role: 'Co-Founder, Assembly Home' },
  { quote: 'Cart abandonment recovery runs automatically now. We recovered 441 orders last month that would have been lost. The revenue dashboard shows exactly where it came from.', metric: '441 recovered', initials: 'PN', name: 'Priya Nadkarni', role: 'Founder, Vitality Labs' },
  { quote: 'The checkout builder let us match our brand voice perfectly. We went from generic Shopify checkout to an experience that feels like ours. Conversion lifted 26% month one.', metric: '+26% conversion', initials: 'AF', name: 'Alex Foster', role: 'Creative Director, Lunar Apparel' },
];

const footerTrustBadges = [
  { label: 'Shopify Partner', icon: 'https://cdn.simpleicons.org/shopify/95BF47', className: 'shopify' },
  { label: 'Trusted Shops', icon: 'https://cdn.simpleicons.org/trustedshops/00B67A', className: 'trusted-shops' },
  { label: 'SecurityScorecard', icon: 'https://cdn.simpleicons.org/securityscorecard/FFFFFF', className: 'security-scorecard' },
  { label: 'GDPR ready', icon: 'https://cdn.simpleicons.org/europeanunion/FFCC00', className: 'gdpr' },
];

const footerPaymentLogo = '../settings/assets/payments/payment-logo-sheet.svg?v=20260723paymentlogosheet3';
const brandMark = '../assets/brand-mark.svg?v=20260723brandmark1';

function renderFooterTrustBadge(item) {
  return `<span class="fable-trust-badge fable-trust-badge--${item.className}"><img src="${item.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async"/><span>${item.label}</span></span>`;
}

function previewChart() {
  return '<div class="fable-preview-chart"><i style="height:35%"></i><i style="height:53%"></i><i style="height:42%"></i><i style="height:78%"></i><i style="height:61%"></i><i style="height:90%"></i><i style="height:75%"></i></div>';
}

function workspacePreview() {
  return `
    <div class="fable-workspace" aria-label="BestCheckout conversion workspace preview">
      <span class="fable-float-pill fable-float-pill--recovery">Checkout recovery <strong>+18.1%</strong></span>
      <span class="fable-float-pill fable-float-pill--sync"><i></i> Shopify order synced</span>
      <div class="fable-workspace-shell">
        <aside class="fable-workspace-nav" aria-label="Preview navigation">
          <img class="fable-preview-logo" src="${brandMark}" alt="" aria-hidden="true"/>
          <i class="is-active">${icon('pages', 15)}</i><i>${icon('sparkles', 15)}</i><i>${icon('card', 15)}</i><i>${icon('analytics', 15)}</i><i>${icon('settings', 15)}</i>
        </aside>
        <div class="fable-workspace-main">
          <header><h3>Conversion command center</h3><span>${icon('calendar', 13)} Last 30 days ${icon('chevron', 13)}</span></header>
          <div class="fable-preview-stats">
            <article><small>Checkout conversion</small><strong>4.2%</strong><em>+0.3% vs wk</em></article>
            <article><small>AOV</small><strong>$127</strong><em>+$8 vs wk</em></article>
            <article><small>Recovery</small><strong>+18.1%</strong><em>$14.2k rec.</em></article>
          </div>
          <section class="fable-preview-funnel"><header><strong>Purchase funnel</strong><em>Live</em></header><div class="fable-funnel-line"><i></i><i></i><i></i><i></i></div><div class="fable-funnel-labels"><span><b>100%</b>Shopify cart</span><span><b>68%</b>Checkout</span><span><b>18%</b>Offer</span><span><b>14%</b>Thank you</span></div></section>
          <div class="fable-preview-lists">
            <section><h4>Active offers performance</h4><div><span>Post-purchase VIP</span><b>$12,450</b><i style="width:78%"></i></div><div><span>In-cart mystery bump</span><b>$4,210</b><i style="width:46%"></i></div><div><span>Shipping protection</span><b>$2,100</b><i style="width:26%"></i></div></section>
            <section><h4>Live sync activity <em>⌁</em></h4><div><i></i><span><b>#14092</b> Synced<small>Just now</small></span><strong>$127.00</strong></div><div><i></i><span><b>#14091</b> Synced<small>2m ago</small></span><strong>$84.50</strong></div><div><i></i><span><b>#14090</b> Synced<small>5m ago</small></span><strong>$210.00</strong></div></section>
          </div>
        </div>
      </div>
    </div>`;
}

function cardIcon(name) {
  return `<span class="fable-card-icon">${icon(name, 22)}</span>`;
}

export function renderMarketingSite() {
  return `
    <div class="fable-site">
      <header class="fable-nav">
        <nav aria-label="Primary">
          <a class="fable-brand" href="#/landing"><img class="fable-brand-mark" src="${brandMark}" alt="" aria-hidden="true"/><span>BestCheckout</span></a>
          <div class="fable-nav-links">
            <a href="#/landing">Home</a><a href="#/landing?section=results">Product</a><a href="#/landing?section=how-it-works">How it works</a><a href="../help/">Help Center</a><a href="../help/#guide=connect-shopify">Connect guide</a>
          </div>
          <div class="fable-nav-actions"><a class="fable-mobile-guide" href="../help/#guide=connect-shopify">Connect guide</a><a class="fable-sign-in" href="#/sign-in">Sign in</a><a class="fable-button fable-button--small" href="#/sign-up?next=connect-shopify">Start free</a></div>
        </nav>
      </header>
      <main>
        <section class="fable-hero" id="product">
          <div class="fable-hero-aurora" aria-hidden="true"></div><div class="fable-hero-stars" aria-hidden="true"></div><div class="fable-hero-grid" aria-hidden="true"></div>
          <div class="fable-container fable-hero-layout">
            <div class="fable-hero-copy">
              <span class="fable-eyebrow">${icon('sparkles', 14)} Conversion infrastructure for Shopify</span>
              <h1>Make every checkout<br/><span>feel inevitable.</span></h1>
              <p>Design the path from cart to paid order, launch offers with confidence, and keep your Shopify operations in sync.</p>
              <div class="fable-hero-actions"><a class="fable-button" href="#/sign-up?next=connect-shopify">Start free ${icon('arrow', 16)}</a><a class="fable-button fable-button--outline" href="#/landing?section=results">Explore the product</a></div>
            </div>
            ${workspacePreview()}
          </div>
        </section>
        <section class="fable-outcomes" aria-label="BestCheckout merchant outcomes"><div class="fable-container fable-outcomes-grid">${outcomes.map((item) => `<article><strong data-fable-counter data-fable-counter-target="${item.target}" data-fable-counter-decimals="${item.decimals}" data-fable-counter-prefix="${item.prefix}"><span data-fable-counter-value>${item.value}</span><em>${item.suffix}</em></strong><p>${item.label}</p></article>`).join('')}</div></section>
        <section class="fable-section fable-capabilities" id="capabilities"><div class="fable-capability-glow" aria-hidden="true"></div><div class="fable-container"><div class="fable-capability-grid">${capabilities.map((item) => `<article><header>${cardIcon(item.iconName)}<b>${item.step}</b></header><h2>${item.title}</h2><p>${item.description}</p><div>${item.features.map((feature) => `<span>${feature}</span>`).join('')}</div></article>`).join('')}</div></div></section>
        <section class="fable-section" id="results"><div class="fable-container"><h2 class="fable-section-title">One focused workspace.<br/>Every conversion lever.</h2><div class="fable-value-grid"><article>${cardIcon('pages')}<h3>A checkout that looks like your brand</h3><p>Control every detail of the purchase experience. Match your brand voice, deploy custom workflows, and remove friction from the buyer journey.</p></article><article>${cardIcon('sparkles')}<h3>Offers buyers actually want</h3><p>Surface post-purchase upsells, cross-sells, and recovery flows that make sense for each order. No spam, no friction - just contextual relevance at the right moment.</p></article><article>${cardIcon('card')}<h3>Payments that keep up</h3><p>Every completed transaction writes back to Shopify automatically. Order fulfillment, inventory updates, and customer records stay in perfect sync with your store.</p></article></div></div></section>
        <section class="fable-section" id="how-it-works"><div class="fable-container"><h2 class="fable-section-title">How it works</h2><ol class="fable-process"><li><b>01</b><h3>Connect your Shopify store</h3><p>Authorize once and your store's products, orders, and inventory are immediately available.</p></li><li><b>02</b><h3>Build the purchase flow</h3><p>Design your checkout sequence, configure offer rules, and preview the full buyer journey before going live.</p></li><li><b>03</b><h3>Launch with confidence</h3><p>Go live in minutes. Merchants connect their own Shopify app and retain full ownership of their store data and payment accounts.</p></li></ol></div></section>
        <section class="fable-section fable-testimonials"><div class="fable-container"><h2 class="fable-section-title">Built for operators who<br/>move fast and measure everything.</h2><div class="fable-testimonial-grid">${testimonials.map((item) => `<article><div class="fable-stars" aria-label="Rated 5 out of 5 stars">★★★★★</div><blockquote>“${item.quote}”</blockquote><span class="fable-metric">${item.metric}</span><footer><i>${item.initials}</i><span><b>${item.name}</b><small>${item.role}</small></span></footer></article>`).join('')}</div></div></section>
        <section class="fable-section"><div class="fable-container"><h2 class="fable-section-title">Your store. Your payment accounts.<br/>Your data.</h2><div class="fable-trust-grid"><article>${cardIcon('shield')}<h3>Merchant-owned access</h3><p>You connect your own Shopify app; BestCheckout never holds your credentials.</p></article><article>${cardIcon('orders')}<h3>Shopify order sync</h3><p>Every completed checkout writes back to Shopify automatically.</p></article><article>${cardIcon('analytics')}<h3>Clear performance data</h3><p>Conversion rates, AOV, and recovery stats visible from day one.</p></article></div></div></section>
        <section class="fable-section fable-final"><div class="fable-container"><div><h2 class="fable-section-title">Make the checkout your<br/>strongest sales page.</h2><a class="fable-button" href="#/sign-up?next=connect-shopify">Start free ${icon('arrow', 16)}</a></div></div></section>
      </main>
      <footer class="fable-footer"><div class="fable-container fable-footer-main"><section class="fable-footer-brand"><strong><img class="fable-footer-brand-mark" src="${brandMark}" alt="" aria-hidden="true"/><span>BestCheckout</span></strong><p>Conversion infrastructure for Shopify brands.</p><div class="fable-trust-badges" aria-label="Trust and compliance badges">${footerTrustBadges.map(renderFooterTrustBadge).join('')}</div></section><nav><a href="#/landing">Home</a><a href="#/landing?section=results">Product</a><a href="#/landing?section=how-it-works">How it works</a><a href="../help/">Help Center</a><a href="../help/#guide=connect-shopify">Connect guide</a><a href="#/sign-in">Sign in</a></nav></div><div class="fable-container fable-footer-bottom"><small>© 2026 BestCheckout. All rights reserved.</small><section class="fable-payment-methods" aria-label="Supported payment methods"><span class="fable-footer-label">Supported payment methods</span><img class="fable-payment-logo" src="${footerPaymentLogo}" alt="American Express, Visa, Mastercard, UnionPay, PayPal, JCB, Discover, and Klarna" loading="lazy" decoding="async"/></section></div></footer>
    </div>`;
}
