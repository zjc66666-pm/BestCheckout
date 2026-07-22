import { icon } from '../components/common.js';

function brand() {
  return '<a class="help-brand" href="#/landing" aria-label="BestCheckout home"><span class="portal-mark">B</span><strong>BestCheckout</strong></a>';
}

function setupArticle() {
  return '<article class="help-article">'
    + '<a class="help-back" href="#/help">' + icon('back', 16) + '<span>Help Center</span></a>'
    + '<span class="help-eyebrow">Getting started</span>'
    + '<h1>Connect your Shopify store</h1>'
    + '<p class="help-article-lead">Create and release a Shopify Dev Dashboard app, copy its Client ID and Client secret, then enter those values in BestCheckout.</p>'
    + '<div class="help-callout">' + icon('shield', 19) + '<div><strong>You only need three values at the end</strong><p>Your <b>myshopify.com</b> store address, Client ID, and Client secret. Keep the app in your Shopify organization; BestCheckout never takes ownership of it.</p></div></div>'
    + '<section><h2>Before you start</h2><ul><li>Use a secure device and make sure you can access the Shopify admin for this store.</li><li>You need Shopify app-development permission. If you cannot see <b>Develop apps</b>, ask the store owner or organization administrator for the App developer role.</li><li>Use <b>your-store.myshopify.com</b> later — not the customer-facing domain and not a URL beginning with <b>https://</b>.</li></ul></section>'
    + '<section><h2>1. Open App development</h2><p>In Shopify admin, open <b>Settings</b> &rarr; <b>Apps</b> &rarr; <b>Develop apps</b> (it can also be named <b>App development</b>). Select the option to build and manage apps in Dev Dashboard.</p></section>'
    + '<section><h2>2. Create the Dev Dashboard app</h2><p>In Dev Dashboard, open <b>Apps</b> and select <b>Create app</b>. Choose <b>Start from Dev Dashboard</b>, enter a clear name such as “BestCheckout connection”, then select <b>Create</b>.</p><p class="help-muted">You do not need the Shopify CLI route for this credential-only connection flow. The app name is internal and does not appear to customers.</p></section>'
    + '<section><h2>3. Create and release the first version</h2><p>Open <b>Versions</b> for the new app and create the initial version. Complete the fields Shopify requires, select <b>Release</b>, then confirm the release dialog.</p><ul><li>If Shopify requires an App URL, use the safe placeholder <b>https://example.com</b> — never your storefront or myshopify.com address.</li><li>Leave legacy install flow off and leave redirect URLs blank unless your Shopify implementation gives you a specific redirect URL.</li><li>Keep permissions minimal. Add a scope list only when your BestCheckout setup explicitly requests it.</li></ul></section>'
    + '<section><h2>4. Copy the Client ID and Client secret</h2><p>Open <b>Apps</b>, select your app, then open <b>Settings</b>. In <b>Credentials</b>, copy the Client ID and Secret with Shopify’s copy buttons.</p><figure class="help-screenshot"><img src="../help/assets/shopify-dev-dashboard-credentials-redacted.png" alt="Shopify Dev Dashboard Credentials card with all account and credential values redacted" /><figcaption>Apps &rarr; your app &rarr; Settings &rarr; Credentials. The example is cropped and all account, email, Client ID, and secret values are redacted.</figcaption></figure><p class="help-muted">Treat the Client secret as a password. Do not put it in chat, email, spreadsheets, or source code. If it is exposed, use Shopify’s <b>Rotate</b> action immediately and replace the value in BestCheckout.</p></section>'
    + '<section><h2>5. Connect in BestCheckout</h2><p>Return to BestCheckout and enter <b>your-store.myshopify.com</b>, the Client ID, and the Client secret. Select <b>Connect store</b>. BestCheckout verifies the connection before any checkout traffic can go live.</p></section>'
    + '<section><h2>Official Shopify references</h2><ul><li><a href="https://shopify.dev/docs/apps/build/dev-dashboard/create-apps-using-dev-dashboard" target="_blank" rel="noopener">Create apps using Dev Dashboard</a></li><li><a href="https://shopify.dev/docs/apps/build/dev-dashboard/get-api-access-tokens?lang=node" target="_blank" rel="noopener">Find Client ID and Client secret</a></li><li><a href="https://shopify.dev/docs/apps/build/authentication-authorization/client-secrets" target="_blank" rel="noopener">Keep client credentials secure</a></li></ul></section>'
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
