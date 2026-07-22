import { icon } from '../components/common.js';

function brand() {
  return '<a class="help-brand" href="#/landing" aria-label="BestCheckout home"><span class="portal-mark">B</span><strong>BestCheckout</strong></a>';
}

function setupArticle() {
  return '<article class="help-article">'
    + '<a class="help-back" href="#/help">' + icon('back', 16) + '<span>Help Center</span></a>'
    + '<span class="help-eyebrow">Getting started</span>'
    + '<h1>Connect your Shopify store</h1>'
    + '<p class="help-article-lead">Create an app in your own Shopify Dev Dashboard, then connect it to BestCheckout with its Client ID and Client secret. Your team remains in control of the app and can revoke access whenever you need.</p>'
    + '<div class="help-callout">' + icon('shield', 19) + '<div><strong>Use your permanent store address</strong><p>Enter <b>your-store.myshopify.com</b>, not the customer-facing domain shown in your storefront.</p></div></div>'
    + '<section><h2>Before you start</h2><ul><li>You need access to the Shopify admin for this store.</li><li>Only use a private, secure device when you create the app and copy its credentials.</li><li>Keep the Client secret private. BestCheckout never displays it again after a successful connection.</li></ul></section>'
    + '<section><h2>1. Open Shopify App development</h2><p>In Shopify admin, open <b>Settings</b> &rarr; <b>Apps</b> &rarr; <b>App development</b>. Shopify may show <b>Build apps in Dev Dashboard</b>; select it to continue in the current app-management experience.</p></section>'
    + '<section><h2>2. Create your app in Dev Dashboard</h2><p>In Dev Dashboard, open <b>Apps</b>, select <b>Create app</b>, and give it a clear name such as “BestCheckout connection”. Complete the app’s basic contact information, then save it.</p><p class="help-muted">This app belongs to your Shopify organization. BestCheckout does not create or take ownership of it.</p></section>'
    + '<section><h2>3. Copy the Client ID and Client secret</h2><p>Open your new app and select <b>Settings</b>. The <b>Credentials</b> section contains the Client ID and Client secret used by BestCheckout. Copy each value carefully; the secret is sensitive and should never be shared in chat or email.</p><figure class="help-screenshot"><img src="./src/views/admin/bestcheckout/assets/shopify-dev-dashboard-credentials-redacted.png" alt="Shopify Dev Dashboard app Settings page, showing the Credentials section with Client ID and Client secret values redacted" /><figcaption>Shopify Dev Dashboard &rarr; your app &rarr; Settings. Credential values and account details are redacted in this example.</figcaption></figure></section>'
    + '<section><h2>4. Return to BestCheckout and connect</h2><p>Enter the <b>myshopify.com</b> store address, Client ID, and Client secret. Confirm that you authorize this connection, then select <b>Connect store</b>. BestCheckout verifies the connection before any checkout goes live.</p></section>'
    + '<div class="help-next">' + icon('check', 18) + '<div><strong>What happens next</strong><p>We will guide you through payments, a safe test order, and publishing your first purchase flow.</p></div></div>'
    + '</article>';
}

function helpHome() {
  return '<div class="help-home">'
    + '<section class="help-hero"><span class="help-eyebrow">BestCheckout Help Center</span><h1>Get your checkout ready to sell.</h1><p>Simple, merchant-friendly guidance for connecting your store, testing payments, and launching a purchase flow.</p></section>'
    + '<section class="help-topic-grid" aria-label="Help topics">'
    + '<a class="help-topic help-topic-primary" href="#/help/shopify-app-setup"><span>' + icon('store', 22) + '</span><div><small>Getting started</small><strong>Connect your Shopify store</strong><p>Create an app in Shopify Dev Dashboard and securely connect it to BestCheckout.</p><em>Read guide ' + icon('arrow', 15) + '</em></div></a>'
    + '<article class="help-topic"><span>' + icon('flow', 22) + '</span><div><small>Checkout flows</small><strong>Build your first purchase flow</strong><p>Choose a checkout page, optionally add an offer, and use a safe test before launch.</p><em>Available in your account</em></div></article>'
    + '<article class="help-topic"><span>' + icon('card', 22) + '</span><div><small>Payments and orders</small><strong>Connect payments and test an order</strong><p>Check your payment account, place a test order, and keep fulfilled orders in Shopify.</p><em>Available in your account</em></div></article>'
    + '</section>'
    + '<section class="help-support"><div><span>' + icon('help', 20) + '</span><div><strong>Need help with store connection?</strong><p>Start with the Shopify app guide. It uses plain-language steps and keeps your access under your control.</p></div></div><a href="#/help/shopify-app-setup">Open Shopify app guide ' + icon('arrow', 15) + '</a></section>'
    + '</div>';
}

export function renderHelpCenter(route) {
  const isSetupGuide = route.segments[1] === 'shopify-app-setup';
  return '<div class="help-center">'
    + '<header class="help-header">' + brand() + '<nav aria-label="Help navigation"><a href="#/help"' + (isSetupGuide ? '' : ' aria-current="page"') + '>Help Center</a><a href="#/landing">Product</a><a href="#/sign-in" class="help-account-link">Go to your account ' + icon('arrow', 15) + '</a></nav></header>'
    + '<main class="help-main">' + (isSetupGuide ? setupArticle() : helpHome()) + '</main>'
    + '<footer class="help-footer"><span>BestCheckout Help Center</span><a href="#/landing">BestCheckout home</a></footer>'
    + '</div>';
}
