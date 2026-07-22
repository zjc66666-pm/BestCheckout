import { icon } from '../components/common.js';

function mark() {
  return '<span class="portal-mark" aria-hidden="true">B</span>';
}

export function renderMarketingSite() {
  return `
    <div class="marketing-site marketing-site--motion">
      <header class="marketing-nav">
        <a class="marketing-brand" href="#/landing">${mark()}<strong>BestCheckout</strong></a>
        <nav aria-label="Primary">
          <a href="#/landing">Home</a>
          <a href="#/landing?section=results">Product</a>
          <a href="#/landing?section=how-it-works">How it works</a>
          <a href="../help/" target="_blank" rel="noopener">Help Center</a>
          <a href="../help/#guide=connect-shopify" target="_blank" rel="noopener">Connect guide</a>
        </nav>
        <div class="marketing-actions">
          <a class="marketing-login" href="#/sign-in">Sign in</a>
          <a class="marketing-cta" href="#/sign-up?next=connect-shopify">Start free</a>
        </div>
      </header>
      <main>
        <section class="marketing-hero" id="product">
          <div class="marketing-hero-atmosphere" aria-hidden="true">
            <i class="marketing-grid"></i><i class="marketing-orb marketing-orb-a"></i><i class="marketing-orb marketing-orb-b"></i><i class="marketing-orb marketing-orb-c"></i>
          </div>
          <div class="marketing-hero-copy">
            <span class="marketing-eyebrow marketing-eyebrow--signal"><i></i>Conversion infrastructure for Shopify</span>
            <h1>Make every checkout<br/><em>feel inevitable.</em></h1>
            <p>Design the path from cart to paid order, launch offers with confidence, and keep your Shopify operations in sync.</p>
            <div class="marketing-hero-actions">
              <a class="marketing-cta marketing-cta-large" href="#/sign-up?next=connect-shopify">Start free ${icon('arrow', 16)}</a>
              <a href="#/landing?section=results" class="marketing-text-link">Explore the product <span aria-hidden="true">&#8595;</span></a>
            </div>
            <div class="marketing-hero-proof">
              <span>${icon('check', 15)} No code required</span><span>${icon('check', 15)} Keep your Shopify store</span><span>${icon('check', 15)} Test before launch</span>
            </div>
          </div>
          <div class="marketing-hero-visual" aria-label="BestCheckout conversion workspace preview">
            <i class="marketing-preview-aura" aria-hidden="true"></i><div class="marketing-preview-orbit marketing-preview-orbit-a" aria-hidden="true"></div><div class="marketing-preview-orbit marketing-preview-orbit-b" aria-hidden="true"></div>
            <article class="marketing-preview-shell">
              <header class="marketing-preview-top"><span class="preview-logo">B</span><strong>BestCheckout</strong><span class="preview-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><small><i></i>Live</small></header>
              <div class="marketing-preview-body">
                <aside><span class="is-active">Overview</span><span>Checkout flows</span><span>Checkout pages</span><span>Orders</span><span>Performance</span></aside>
                <section>
                  <div class="preview-heading"><span>Conversion command center</span><b>Checkout 01 <em>Live</em></b></div>
                  <div class="preview-metrics"><div><small>Checkout conversion</small><strong>6.42%</strong><em>+0.84 pts</em></div><div><small>Average order value</small><strong>$86.20</strong><em>+18.1%</em></div></div>
                  <div class="preview-flow"><span>Shopify cart</span><i>${icon('arrow', 14)}</i><strong>Checkout</strong><i>${icon('arrow', 14)}</i><span>Offer</span><i>${icon('arrow', 14)}</i><span>Thank you</span></div>
                  <div class="preview-chart"><span class="preview-chart-label">Conversion signal</span><div><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
                </section>
              </div>
            </article>
            <article class="preview-signal-card preview-signal-card--rate"><span>Checkout recovery</span><strong>+18.1%</strong><small>vs. control</small></article>
            <article class="preview-signal-card preview-signal-card--sync"><i>${icon('check', 13)}</i><span>Shopify order synced</span></article>
          </div>
        </section>
        <section class="marketing-signal-rail" aria-label="BestCheckout capabilities">
          <div><span class="marketing-signal-index">01</span><strong>Own the purchase moment</strong><small>On-brand checkout journeys</small></div>
          <div><span class="marketing-signal-index">02</span><strong>Offer with intent</strong><small>Rules that stay clear</small></div>
          <div><span class="marketing-signal-index">03</span><strong>Operate with confidence</strong><small>Shopify stays in sync</small></div>
        </section>
        <section class="marketing-value" id="results">
          <div class="marketing-section-heading"><span class="marketing-eyebrow">Designed around the purchase</span><h2>One focused workspace.<br/>Every conversion lever.</h2><p>BestCheckout handles the high-intent moment after a shopper decides to buy—without making your team learn a new commerce platform.</p></div>
          <div class="marketing-value-grid">
            <article><span>${icon('pages', 21)}</span><h3>A checkout that looks like your brand</h3><p>Start with a proven checkout layout, then make safe changes to your logo, colors, pages and offers.</p></article>
            <article><span>${icon('sparkles', 21)}</span><h3>Offers buyers actually want</h3><p>Create a simple upsell or recovery offer in minutes. BestCheckout keeps the journey and eligibility rules clear.</p></article>
            <article><span>${icon('card', 21)}</span><h3>Payments that keep up</h3><p>Connect the payment accounts you use, validate the route, and launch only when checkout is ready.</p></article>
          </div>
        </section>
        <section class="marketing-process" id="how-it-works">
          <div class="marketing-section-heading"><span class="marketing-eyebrow">A simpler way to launch</span><h2>From store connection<br/>to first paid order.</h2></div>
          <ol>
            <li><span>01</span><div><h3>Connect your Shopify store</h3><p>Create and authorize an app in your own Shopify account. Your store stays yours.</p></div></li>
            <li><span>02</span><div><h3>Build the purchase flow</h3><p>Choose a checkout page, add an optional offer, and decide who should see it.</p></div></li>
            <li><span>03</span><div><h3>Launch with confidence</h3><p>Test payments, keep a control group, and let BestCheckout write paid orders back to Shopify.</p></div></li>
          </ol>
        </section>
        <section class="marketing-security">
          <div><span class="marketing-eyebrow">Built for control</span><h2>Your store. Your payment accounts. Your data.</h2><p>BestCheckout is a focused conversion layer. Shopify remains part of your operating workflow after every successful order.</p></div>
          <ul>
            <li>${icon('shield', 18)}<span><strong>Merchant-owned access</strong><small>Connect with the app created in your Shopify account.</small></span></li>
            <li>${icon('orders', 18)}<span><strong>Orders return to Shopify</strong><small>Continue fulfillment and customer operations where your team already works.</small></span></li>
            <li>${icon('analytics', 18)}<span><strong>Clear performance data</strong><small>See checkout conversion, order value and offer revenue in one place.</small></span></li>
          </ul>
        </section>
        <section class="marketing-final"><span class="marketing-eyebrow">Ready when you are</span><h2>Make the checkout your<br/>strongest sales page.</h2><p>Set up your first purchase flow in a guided workspace.</p><a class="marketing-cta marketing-cta-large" href="#/sign-up?next=connect-shopify">Start free ${icon('arrow', 16)}</a></section>
      </main>
      <footer class="marketing-footer"><a class="marketing-brand" href="#/landing">${mark()}<strong>BestCheckout</strong></a><span>Checkout growth for Shopify brands</span><div><a href="#/landing?section=results">Product</a><a href="#/landing?section=how-it-works">How it works</a><a href="../help/" target="_blank" rel="noopener">Help Center</a><a href="../help/#guide=connect-shopify" target="_blank" rel="noopener">Connect guide</a><a href="#/sign-in">Sign in</a></div></footer>
    </div>`;
}
