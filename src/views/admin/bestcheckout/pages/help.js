import { icon } from '../components/common.js';
import { marketingCtas } from '../session.js';

function brand() {
  return '<a class="help-brand" href="#/landing" aria-label="BestCheckout home"><img class="portal-mark" src="assets/brand-mark.svg?v=20260723brandmark1" alt="" aria-hidden="true"/><strong>BestCheckout</strong></a>';
}

function setupArticle() {
  return '<article class="help-article">'
    + '<a class="help-back" href="#/help">' + icon('back', 16) + '<span>Help Center</span></a>'
    + '<span class="help-eyebrow">Getting started</span>'
    + '<h1>Connect your Shopify store</h1>'
    + '<p class="help-article-lead">Submit your myshopify.com address. BestCheckout prepares a Custom App and emails an install link. You do not create an app or paste Client ID and Secret.</p>'
    + '<div class="help-callout">' + icon('shield', 19) + '<div><strong>You only enter the store address</strong><p>Use <b>your-store.myshopify.com</b>. After you submit, the connection stays in progress until the store owner installs BestCheckout and the callback succeeds.</p></div></div>'
    + '<section><h2>Before you start</h2><ul><li>Have access to the Shopify admin for the store you want to connect.</li><li>Use the permanent <b>myshopify.com</b> address — not the customer-facing domain and not a URL beginning with <b>https://</b>.</li><li>The person who later opens the install link must be the store owner, or have permission to manage and install apps.</li></ul></section>'
    + '<section><h2>1. Submit your store in BestCheckout</h2><p>Open Connect your Shopify store and enter <b>your-store.myshopify.com</b>. Select <b>Submit store</b>.</p><p class="help-muted">You do not open Shopify Dev Dashboard, create an app, or paste credentials.</p></section>'
    + '<section><h2>2. Wait for the install email</h2><p>BestCheckout prepares a Custom App for that store. This usually takes about 1 day. The page shows Connecting until the email is ready.</p></section>'
    + '<section><h2>3. Install BestCheckout</h2><p>When the install link is ready, install from this page in BestCheckout, or from the email we sent. Open Shopify with the store owner account for that shop. On the Shopify page, review the access and select <b>Install</b>.</p><ul><li>The developer name may be our Partner company, not your store name.</li><li>Do not open the link while signed into a different Shopify store.</li></ul></section>'
    + '<section><h2>4. Confirm BestCheckout shows Connected</h2><p>Return to BestCheckout and wait until the store status is Connected and catalog data begins to sync. Selecting Install in Shopify is not enough by itself.</p></section>'
    + '<section><h2>What this does not do</h2><p>A connected store can sync data and write paid orders back to Shopify. It does not switch live checkout traffic until you finish payments, domain, and publish a purchase flow.</p></section>'
    + '<div class="help-next">' + icon('check', 18) + '<div><strong>What happens next</strong><p>We will guide you through payments, a safe test order, and publishing your first purchase flow.</p></div></div>'
    + '</article>';
}

function helpHome() {
  return '<div class="help-home">'
    + '<section class="help-hero"><span class="help-eyebrow">BestCheckout Help Center</span><h1>Get your checkout ready to sell.</h1><p>Simple, merchant-friendly guidance for connecting your store, testing payments, and launching a purchase flow.</p></section>'
    + '<section class="help-topic-grid" aria-label="Help topics">'
    + '<a class="help-topic help-topic-primary" href="#/help/shopify-app-setup"><span>' + icon('store', 22) + '</span><div><small>Getting started</small><strong>Connect your Shopify store</strong><p>Submit your myshopify.com address, then install BestCheckout from the email we send.</p><em>Read guide ' + icon('arrow', 15) + '</em></div></a>'
    + '<article class="help-topic"><span>' + icon('flow', 22) + '</span><div><small>Checkout flows</small><strong>Build your first purchase flow</strong><p>Choose a checkout page, optionally add an offer, and use a safe test before launch.</p><em>Available in your account</em></div></article>'
    + '<article class="help-topic"><span>' + icon('card', 22) + '</span><div><small>Payments and orders</small><strong>Connect payments and test an order</strong><p>Check your payment account, place a test order, and keep fulfilled orders in Shopify.</p><em>Available in your account</em></div></article>'
    + '</section>'
    + '<section class="help-support"><div><span>' + icon('help', 20) + '</span><div><strong>Need help with store connection?</strong><p>Start with the connect guide. You only submit the store address; BestCheckout prepares the install link.</p></div></div><a href="#/help/shopify-app-setup">Open connect guide ' + icon('arrow', 15) + '</a></section>'
    + '</div>';
}

export function renderHelpCenter(route, session) {
  const isSetupGuide = route.segments[1] === 'shopify-app-setup';
  const ctas = marketingCtas(session);
  const accountHref = ctas.authenticated ? ctas.primaryHref : '#/sign-in';
  const accountLabel = ctas.authenticated ? ctas.primaryLabel : 'Go to your account';
  return '<div class="help-center">'
    + '<header class="help-header">' + brand() + '<nav aria-label="Help navigation"><a href="#/help"' + (isSetupGuide ? '' : ' aria-current="page"') + '>Help Center</a><a href="#/landing">Product</a><a href="' + accountHref + '" class="help-account-link">' + accountLabel + ' ' + icon('arrow', 15) + '</a></nav></header>'
    + '<main class="help-main">' + (isSetupGuide ? setupArticle() : helpHome()) + '</main>'
    + '<footer class="help-footer"><span>BestCheckout Help Center</span><a href="#/landing">BestCheckout home</a></footer>'
    + '</div>';
}
