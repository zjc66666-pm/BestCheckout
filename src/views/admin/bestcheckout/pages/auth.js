import { icon } from '../components/common.js';
import { escapeHtml } from '../utils.js';
import { renderLanguageSwitcher } from '../i18n.js?rev=20260820-nmi-card-only1';
import { PROTOTYPE_ACCOUNTS } from '../session.js?rev=20260907-expired-link1';

function brand(href) {
  const dest = href || '#/landing';
  const label = dest.indexOf('app/') === 0 ? 'BestCheckout workspace' : 'BestCheckout home';
  return '<a class="portal-auth-brand" href="' + dest + '" aria-label="' + label + '"><img class="portal-mark" src="assets/brand-mark.svg?v=20260723transparentmark1" alt="" aria-hidden="true"/><strong>BestCheckout</strong></a>';
}

function authLayout(eyebrow, title, copy, formMarkup, foot) {
  return '<div class="portal-auth"><aside class="portal-auth-aside"><div>' + brand() + '<span class="portal-auth-kicker">Checkout growth for Shopify brands</span><h1>Build a better<br/><em>way to buy.</em></h1><p>One workspace for your checkout, offers, payment connections and order performance.</p></div><div class="portal-auth-aside-proof"><span>' + icon('shield', 18) + '</span><p>Your Shopify store stays in your control. BestCheckout connects only the data it needs to run your checkout.</p></div></aside><main class="portal-auth-main"><div class="portal-auth-card"><div class="portal-auth-mobile-brand">' + brand() + '</div><span class="portal-auth-eyebrow">' + eyebrow + '</span><h2>' + title + '</h2><p>' + copy + '</p>' + formMarkup + (foot || '') + '</div></main></div>';
}

function portalField(label, control, help) {
  return '<label class="portal-field" data-portal-field><span class="portal-field-label">' + label + '</span>' + control + '<span class="portal-field-error" data-field-error role="alert" hidden></span>' + (help ? '<small>' + help + '</small>' : '') + '</label>';
}

function portalFieldWithAction(label, control, action) {
  return '<div class="portal-field-with-action">' + portalField(label, control) + action + '</div>';
}

function renderDemoAccountHints() {
  const rows = PROTOTYPE_ACCOUNTS.filter(function (account) { return account.email !== 'hello@lavenderlabs.co'; }).map(function (account) {
    return '<button type="button" class="portal-demo-account" data-action="fill-demo-account" data-email="' + escapeHtml(account.email) + '" data-password="' + escapeHtml(account.password) + '"><strong>' + escapeHtml(account.label) + '</strong><span>' + escapeHtml(account.email) + ' · ' + escapeHtml(account.password) + '</span></button>';
  }).join('');
  return '<aside class="portal-demo-accounts" aria-label="Prototype test accounts"><p>Prototype test accounts</p>' + rows + '</aside>';
}

export function renderSignIn() {
  const form = '<form class="portal-form" id="portal-login-form" novalidate>'
    + portalField('Email', '<input required type="email" name="email" autocomplete="email" placeholder="you@company.com" data-validation-required="Enter your email address." data-validation-invalid="Enter a valid email address." />')
    + portalField('Password', '<div class="portal-password-field"><input required type="password" name="password" autocomplete="current-password" placeholder="Enter your password" data-validation-required="Enter your password." /><button type="button" aria-label="Show password">' + icon('eye', 16) + '</button></div>')
    + '<div class="portal-form-row"><label class="portal-check"><input type="checkbox" checked /> <span>Keep me signed in</span></label><button type="button" class="portal-inline-button" data-route="forgot-password">Forgot password?</button></div><button type="submit" class="portal-submit">Sign in ' + icon('arrow', 16) + '</button>'
    + '<p class="portal-auth-foot">New to BestCheckout? <button type="button" data-route="sign-up">Create your account</button></p>'
    + renderDemoAccountHints()
    + '</form>';
  return authLayout('Welcome back', 'Sign in to BestCheckout', 'Manage checkout growth for your Shopify store.', form);
}

export function renderForgotPassword() {
  const form = '<form class="portal-form" id="portal-forgot-password-form" novalidate>'
    + portalField('Email', '<input required type="email" name="email" autocomplete="email" autofocus data-validation-required="Enter your email address." data-validation-invalid="Enter a valid email address." />')
    + '<button type="submit" class="portal-submit">Send reset link ' + icon('arrow', 16) + '</button></form>';
  return authLayout('Password recovery', 'Reset your password', 'Enter the email address you use for BestCheckout. We’ll send a link to reset your password.', form, '<p class="portal-auth-foot">Remembered your password? <button type="button" data-route="sign-in">Back to sign in</button></p>');
}

export function renderForgotPasswordSent() {
  const message = '<div class="portal-reset-sent" role="status"><span class="portal-reset-sent-icon">' + icon('email', 22) + '</span><p>If an account exists for that email address, we’ve sent a password reset link. The link expires in 30 minutes.</p></div><div class="portal-reset-actions"><button type="button" class="portal-submit" data-route="sign-in">Back to sign in</button><button type="button" class="portal-inline-button" data-route="forgot-password">Use a different email</button></div>';
  return authLayout('Password recovery', 'Check your email', 'Follow the link in the email to choose a new password.', message);
}

export function renderForgotPasswordCode(step) {
  if (step === 'complete') {
    const message = '<div class="portal-reset-sent" role="status"><span class="portal-reset-sent-icon">' + icon('check', 22) + '</span><p>Your password has been reset. Sign in with your new password.</p></div><div class="portal-reset-actions"><button type="button" class="portal-submit" data-route="sign-in">Back to sign in</button></div>';
    return authLayout('Password recovery', 'Password reset', 'Your BestCheckout account is ready to use.', message);
  }
  const codeInput = '<div class="portal-code-field"><input required type="text" name="verificationCode" inputmode="numeric" autocomplete="one-time-code" minlength="6" maxlength="6" pattern="[0-9]{6}" placeholder="Enter 6-digit code" data-validation-required="Enter the verification code." data-validation-too-short="Enter the 6-digit verification code." data-validation-invalid="Enter the 6-digit verification code." /><button type="button" class="portal-code-send" data-action="send-reset-code" data-reset-code-button>Send code</button></div>';
  const previewButton = '<a class="portal-email-preview-button" data-reset-email-preview-link href="#/password-reset-email-preview" target="_blank" rel="noopener" aria-label="Preview password reset email (prototype only)">' + icon('email', 14) + '<span>Preview email</span></a>';
  const form = '<form class="portal-form" id="portal-reset-password-form" novalidate>'
    + portalField('Email', '<input required type="email" name="email" autocomplete="email" autofocus placeholder="you@company.com" data-validation-required="Enter your email address." data-validation-invalid="Enter a valid email address." />')
    + portalFieldWithAction('Verification code', codeInput, previewButton)
    + portalField('New password', '<input required type="password" name="newPassword" autocomplete="new-password" minlength="8" placeholder="Create a new password" data-validation-required="Create a new password." data-validation-too-short="Use at least 8 characters." />')
    + portalField('Confirm new password', '<input required type="password" name="confirmPassword" autocomplete="new-password" minlength="8" placeholder="Re-enter your new password" data-validation-required="Confirm your new password." data-validation-too-short="Use at least 8 characters." />')
    + '<button type="submit" class="portal-submit">Reset password ' + icon('arrow', 16) + '</button></form>';
  return authLayout('Password recovery', 'Reset your password', 'Verify your email and choose a new password without leaving this page.', form, '<p class="portal-auth-foot">Remembered your password? <button type="button" data-route="sign-in">Back to sign in</button></p>');
}

export function renderSignUp() {
  const codeInput = '<div class="portal-code-field"><input required type="text" name="verificationCode" inputmode="numeric" autocomplete="one-time-code" minlength="6" maxlength="6" pattern="[0-9]{6}" placeholder="Enter 6-digit code" data-validation-required="Enter the verification code." data-validation-too-short="Enter the 6-digit verification code." data-validation-invalid="Enter the 6-digit verification code." /><button type="button" class="portal-code-send" data-action="send-signup-code" data-signup-code-button>Send code</button></div>';
  const previewButton = '<button type="button" class="portal-email-preview-button" data-action="preview-signup-email" aria-label="Preview verification email (prototype only)">' + icon('email', 14) + '<span>Preview email</span></button>';
  const form = '<form class="portal-form" id="portal-signup-form" novalidate>'
    + portalField('Work email', '<input required type="email" name="email" placeholder="you@company.com" autocomplete="email" data-validation-required="Enter your work email address." data-validation-invalid="Enter a valid work email address." />')
    + portalFieldWithAction('Verification code', codeInput, previewButton)
    + portalField('Password', '<input required minlength="8" type="password" name="password" placeholder="Create a password" autocomplete="new-password" data-validation-required="Create a password." data-validation-too-short="Use at least 8 characters." />')
    + portalField('Confirm password', '<input required minlength="8" type="password" name="confirmPassword" placeholder="Re-enter your password" autocomplete="new-password" data-validation-required="Confirm your password." data-validation-too-short="Use at least 8 characters." />')
    + '<button type="submit" class="portal-submit">Create account ' + icon('arrow', 16) + '</button><p class="portal-terms-note">By creating an account, you agree to the Terms and Privacy Policy.</p></form>';
  return authLayout('Get started', 'Create your BestCheckout account', 'Start with your Shopify store. You can build and test before sending buyers to a new checkout.', form, '<p class="portal-auth-foot">Already have an account? <button type="button" data-route="sign-in">Sign in</button></p>');
}

export function renderSignupVerificationEmailPage(email) {
  const recipient = escapeHtml(String(email || '').trim() || 'you@company.com');
  return '<div class="verification-email-page"><main class="verification-email-wrap"><p class="verification-email-context">Prototype-only · reference for the registration verification email. This page is not part of the production sign-up flow.</p><section class="verification-email-inbox" aria-label="Email metadata"><p><span>From</span><b>BestCheckout</b> <small>&lt;no-reply@bestcheckout.com&gt;</small></p><p><span>Subject</span><b>Verify your BestCheckout email</b></p></section><section class="verification-email-stage"><article class="verification-email-card"><div class="verification-email-bar"></div><header><a class="verification-email-brand" href="#/landing" aria-label="BestCheckout home"><img src="assets/brand-mark.svg?v=20260723transparentmark1" alt="" aria-hidden="true"/><strong>BestCheckout</strong></a></header><main><h1>Confirm your email address</h1><p class="verification-email-lead">You’re creating a BestCheckout account with <b>' + recipient + '</b>. Enter this code to confirm it’s you:</p><section class="verification-email-code" aria-label="Verification code 482913"><strong>482913</strong><span>This code expires in 10 minutes.</span></section><p class="verification-email-note">Keep this code private — BestCheckout will never ask you for it. If you didn’t request this, you can safely ignore this email.</p></main><footer><p>This is an automated message from BestCheckout — please don’t reply.</p><small>© 2026 BestCheckout</small></footer></article></section><a class="verification-email-back" href="#/sign-up">← Back to sign up</a></main></div>';
}

export function renderPasswordResetEmailPage(email) {
  const recipient = escapeHtml(String(email || '').trim() || 'you@company.com');
  return '<div class="verification-email-page"><main class="verification-email-wrap"><p class="verification-email-context">Prototype-only · reference for the password reset email. This page is not part of the production password recovery flow.</p><section class="verification-email-inbox" aria-label="Email metadata"><p><span>From</span><b>BestCheckout</b> <small>&lt;no-reply@bestcheckout.com&gt;</small></p><p><span>To</span><b>' + recipient + '</b></p><p><span>Subject</span><b>Reset your BestCheckout password</b></p></section><section class="verification-email-stage"><article class="verification-email-card"><div class="verification-email-bar"></div><header><a class="verification-email-brand" href="#/landing" aria-label="BestCheckout home"><img src="assets/brand-mark.svg?v=20260723transparentmark1" alt="" aria-hidden="true"/><strong>BestCheckout</strong></a></header><main><h1>Reset your password</h1><p class="verification-email-lead">We received a request to reset the password for your BestCheckout account. Enter this code on the password recovery page:</p><section class="verification-email-code" aria-label="Password reset code 731846"><strong>731846</strong><span>This code expires in 10 minutes.</span></section><p class="verification-email-note">Keep this code private. If you didn’t request a password reset, you can safely ignore this email and your password will stay unchanged.</p></main><footer><p>This is an automated message from BestCheckout — please don’t reply.</p><small>© 2026 BestCheckout</small></footer></article></section><a class="verification-email-back" href="#/forgot-password">← Back to password recovery</a></main></div>';
}

function shopHandle(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/\.myshopify\.com$/i, '')
    .replace(/[^a-z0-9-]/g, '');
}

function shopDomain(value) {
  const handle = shopHandle(value);
  return handle ? handle + '.myshopify.com' : '';
}

function connectFrame(card, logoHref) {
  return '<div class="connect-flow"><header class="connect-header">' + brand(logoHref) + '<button type="button" class="portal-inline-button" data-action="portal-signout">Sign out</button></header><main>' + card + '</main></div>';
}

function installLinkHref(shop) {
  return '#/connect-shopify?status=consent&shop=' + encodeURIComponent(shopHandle(shop) || 'your-store');
}

function connectPendingCard(shop, renew) {
  const domain = escapeHtml(shopDomain(shop) || 'your-store.myshopify.com');
  const lead = renew
    ? 'We\'ll send a new install link for <b>' + domain + '</b> when it\'s ready.'
    : 'BestCheckout is creating a Custom App for <b>' + domain + '</b>.';
  const stepTwo = renew
    ? 'We\'ll email the store owner when the new link is ready.'
    : 'Usually about 1 day. We\'ll email the store owner when it\'s ready.';
  return '<div class="connect-card"><span class="connect-icon">' + icon('store', 23) + '</span><span class="portal-auth-eyebrow">Shopify connection</span><h1>We\'re preparing your install link</h1><p>' + lead + '</p><ol class="connect-status-steps"><li class="is-complete"><span>1</span><div><strong>Store submitted</strong><small>' + domain + '</small></div></li><li class="is-active"><span>2</span><div><strong>Preparing the install link</strong><small>' + stepTwo + '</small></div></li><li><span>3</span><div><strong>Install BestCheckout</strong><small>Install from BestCheckout or from the email we send.</small></div></li></ol>' + '</div>';
}

function installStoreButton(shop) {
  const handle = shopHandle(shop) || 'your-store';
  const domain = escapeHtml(shopDomain(handle));
  return '<a class="portal-submit" href="' + installLinkHref(handle) + '">Install ' + domain + ' ' + icon('arrow', 16) + '</a>';
}

function connectInstallCard(shop) {
  const handle = shopHandle(shop) || 'your-store';
  const domain = escapeHtml(shopDomain(handle));
  return '<div class="connect-card"><span class="connect-icon">' + icon('store', 23) + '</span><span class="portal-auth-eyebrow">Ready to install</span><h1>Install BestCheckout</h1><p>Your install link for <b>' + domain + '</b> is ready. Install here, or use the email we sent. Open Shopify with the <b>store owner</b> account, or a staff account that can manage and install apps.</p>' +
    '<div class="connect-form-actions">' + installStoreButton(handle) + '</div></div>';
}

function shopifyAdminIcon(name) {
  const paths = {
    search: '<circle cx="9" cy="9" r="5.5"/><path d="m13.2 13.2 4 4"/>',
    bell: '<path d="M10 2.8a2 2 0 0 0-2 2v.5C5.8 6.1 4.6 8 4.6 10.2V13.6L3.4 15.4h13.2L15.4 13.6v-3.4c0-2.2-1.2-4.1-3.4-4.9v-.5a2 2 0 0 0-2-2z"/><path d="M8.4 16.4a1.6 1.6 0 0 0 3.2 0"/>',
    chevron: '<path d="m6.2 8 3.8 3.8L13.8 8"/>',
    home: '<path d="M3.4 9.4 10 3.8l6.6 5.6V16a1 1 0 0 1-1 1h-3.4v-4.4H7.8V17H4.4a1 1 0 0 1-1-1z"/>',
    orders: '<rect x="4.2" y="3.4" width="11.6" height="13.2" rx="1.5"/><path d="M7 7.5h6M7 10.3h6M7 13.1h4"/>',
    products: '<path d="M4.2 10.2V5.6A1.2 1.2 0 0 1 5.4 4.4H11l5 5-5 5z"/><path d="M7.6 7.6h.01"/>',
    customers: '<circle cx="10" cy="7.2" r="2.3"/><path d="M4.8 16.2a5.2 5.2 0 0 1 10.4 0"/>',
    finance: '<circle cx="10" cy="10" r="6.3"/><path d="M10 6.6v6.8M8.3 8.4c.4-.7 1.1-1.1 2.1-1.1 1.1 0 1.9.5 1.9 1.5s-.8 1.4-2.1 1.7c-1.3.3-2.1.8-2.1 1.7 0 .9.9 1.6 2.2 1.6 1 0 1.7-.3 2.1-1"/>',
    analytics: '<path d="M4.2 15.8V10m4 5.8V5.8m4 10V9.4m4 6.4V7.4"/><path d="M3.4 16.4h13.4"/>',
    marketing: '<path d="M3.6 8.4h3.1L14 5v10.2l-7.3-3.4H3.6z"/><path d="M6.7 11.8v2.4a2.2 2.2 0 0 0 2 .2"/>',
    discounts: '<path d="M4.3 10.8 10.8 4.3h4.8v4.8L9.1 15.6a1.4 1.4 0 0 1-2 0l-2.8-2.8a1.4 1.4 0 0 1 0-2z"/><circle cx="13.3" cy="6.7" r=".8"/>',
    storefront: '<path d="M4.2 9.2h11.6v7H4.2zM3.6 9.2 4.8 4.8h10.4l1.2 4.4"/><path d="M8.2 16.2v-4h3.6v4"/>',
    pos: '<rect x="3.6" y="4" width="12.8" height="9" rx="1.4"/><path d="M7.4 16.4h5.2M10 13v3.4"/>',
    apps: '<rect x="3.6" y="3.6" width="5.2" height="5.2" rx="1"/><rect x="11.2" y="3.6" width="5.2" height="5.2" rx="1"/><rect x="3.6" y="11.2" width="5.2" height="5.2" rx="1"/><path d="M13.8 11.2v6M11.2 13.8h6"/>',
    settings: '<circle cx="10" cy="10" r="2.1"/><path d="M16.1 11.2c.1.5.1 1 .1 1.3l1.2.1-.7 1.7-1.1-.5a4.8 4.8 0 0 1-1.1.9l.2 1.2-1.8.4-.4-1.2a4.8 4.8 0 0 1-1.3.1l-.6 1-1.6-.8.5-1.1a4.8 4.8 0 0 1-.9-1.1l-1.2.2.1-1.8 1.1-.3A4.8 4.8 0 0 1 7 9.5L5.9 9.6l.7-1.7 1.1.5a4.8 4.8 0 0 1 1.1-.9L8.6 6.3l1.8-.4.4 1.2c.4 0 .9 0 1.3-.1l.6-1 1.6.8-.5 1.1c.4.3.7.7.9 1.1l1.2-.2z"/>',
    info: '<circle cx="10" cy="10" r="7.2"/><path d="M10 9.1v4.3M10 6.7h.01"/>',
  };
  return '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || '') + '</svg>';
}

function shopifyNavItem(label, iconName, current) {
  return '<span class="shopify-install-nav-item' + (current ? ' is-current' : '') + '">' + shopifyAdminIcon(iconName) + '<span>' + escapeHtml(label) + '</span></span>';
}

function storeInitials(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return String(name || 'S').replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase() || 'S';
}

function connectConsentPage(shop) {
  const handle = shopHandle(shop) || 'your-store';
  const storeName = handle.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  const initials = storeInitials(storeName);
  const permissions = [
    'View products',
    'View customers',
    'View and edit orders',
    'View discounts',
    'View shipping settings',
    'View and edit draft orders',
  ];
  return '<div class="shopify-install-page">' +
    '<header class="shopify-install-topbar">' +
      '<div class="shopify-install-brand" aria-hidden="true"><svg viewBox="0 0 32 32" width="24" height="24"><path fill="#95BF47" d="M21.9 6.2s-.2-.2-.5-.2l-.4.1c0-.6-.2-1.4-.7-2.1C19.6 2.8 18.5 2.4 17 2.4c0 0-.1 0-.1.1-1-.7-2.2-.8-2.8-.8h-.1c-.8 0-1.6.2-2.3.6-.5-.4-1.1-.5-1.6-.5-3.2 0-4.7 4-5.1 6-1.4.4-2.4.7-2.5.8-.8.2-.8.3-.9 1C1.5 10.1.2 21.2.2 21.2l16.6 3.2 9.2-2 1.8-16.2c0-.3-.2-.5-.5-.5l-1.3-.3c.3-.9.4-1.7.1-2.3-.3-.6-.8-.9-1.4-.9-.2 0-.5 0-.8.1z"/><path fill="#5E8E3E" d="M21.4 6.1c0 .1-.1.1-.1.2-1.3.4-2.7.8-4.1 1.2.3-1.1.8-2.1 1.6-2.7.3.5.5.9.6 1.3zm-9.2-1.7c.1 0 .3 0 .4.1-.9.4-1.8 1.2-2.4 2.8-1.1.3-2.2.7-3.2 1C7.5 6.3 8.8 4.4 12.2 4.4z"/></svg><span>shopify</span></div>' +
      '<div class="shopify-search" aria-hidden="true">' + shopifyAdminIcon('search') + '<span>Search</span><kbd>CTRL K</kbd></div>' +
      '<div class="shopify-install-store">' +
        '<span class="shopify-install-bell" aria-hidden="true">' + shopifyAdminIcon('bell') + '</span>' +
        '<span class="shopify-install-store-switch">' +
          '<span class="shopify-install-avatar">' + escapeHtml(initials) + '</span>' +
          '<span class="shopify-install-store-name">' + escapeHtml(storeName) + '</span>' +
        '</span>' +
      '</div>' +
    '</header>' +
    '<div class="shopify-install-body"><aside class="shopify-install-sidebar" aria-hidden="true">' +
      '<div class="shopify-install-nav">' +
        '<div class="shopify-install-nav-group">' +
          shopifyNavItem('Home', 'home', true) +
          shopifyNavItem('Orders', 'orders') +
          shopifyNavItem('Products', 'products') +
          shopifyNavItem('Customers', 'customers') +
          shopifyNavItem('Finance', 'finance') +
          shopifyNavItem('Analytics', 'analytics') +
          shopifyNavItem('Marketing', 'marketing') +
          shopifyNavItem('Discounts', 'discounts') +
        '</div>' +
        '<div class="shopify-install-nav-group"><small>Sales channels</small>' + shopifyNavItem('Online Store', 'storefront') + shopifyNavItem('Point of Sale', 'pos') + '</div>' +
        '<div class="shopify-install-nav-group"><small>Apps</small>' + shopifyNavItem('Checkout Blocks', 'apps') + '</div>' +
      '</div>' +
      '<div class="shopify-install-settings">' + shopifyNavItem('Settings', 'settings') + '</div>' +
    '</aside><main class="shopify-install-main">' +
      '<div class="shopify-install-stage">' +
        '<h1>' + shopifyAdminIcon('apps') + '<span>Install app</span></h1>' +
        '<section class="shopify-install-panel">' +
          '<div class="shopify-install-banner" role="status"><span class="shopify-install-banner-icon" aria-hidden="true">' + shopifyAdminIcon('info') + '</span><div><strong>This app is exclusive to your store.</strong><p>BestCheckout was created exclusively for your store and can\'t be installed by anyone else. Contact the app developer if you need more information.</p></div></div>' +
          '<div class="shopify-install-app"><img class="shopify-install-app-icon" src="assets/brand-mark.svg?v=20260723transparentmark1" alt="" /><div><strong>BestCheckout</strong><small>Stanchigher Inc</small></div></div>' +
          '<div class="shopify-install-access">' +
            '<button type="button" class="shopify-install-access-toggle" data-action="toggle-shopify-access" aria-expanded="true"><span>This app needs access to:</span><span class="shopify-install-chevron" aria-hidden="true">' + shopifyAdminIcon('chevron') + '</span></button>' +
            '<div class="shopify-install-scopes">' + permissions.map(function (item) { return '<div class="shopify-install-scope">' + escapeHtml(item) + '</div>'; }).join('') + '</div>' +
          '</div>' +
        '</section>' +
        '<div class="shopify-install-actions"><a class="shopify-install-cancel" href="#/connect-shopify?status=install&amp;shop=' + encodeURIComponent(handle) + '">Cancel</a><a class="shopify-install-submit" href="app/?rev=20260907-install-link2&amp;shopify=connected#/home">Install</a></div>' +
      '</div>' +
    '</main></div></div>';
}

function connectExpiredCard(shop) {
  const handle = shopHandle(shop) || 'your-store';
  const domain = escapeHtml(shopDomain(handle));
  return '<div class="connect-card"><span class="connect-icon is-warning">' + icon('alert', 23) + '</span><span class="portal-auth-eyebrow">Install link expired</span><h1>This install link has expired</h1><p>Shopify install links last 7 days. The previous link for <b>' + domain + '</b> can no longer be used. Request a new one and we\'ll email it to the store owner.</p><div class="connect-form-actions"><button type="button" class="portal-submit" data-action="request-new-install-link" data-shop="' + escapeHtml(handle) + '">Request a new install link</button></div><p class="portal-auth-foot"><button type="button" data-route="connect-shopify?shop=' + encodeURIComponent(handle) + '">Use a different store</button></p></div>';
}

function connectDisabledCard(shop, options) {
  const handle = shopHandle(shop) || 'your-store';
  const domain = escapeHtml(shopDomain(handle));
  const fromAdmin = options && options.fromAdmin;
  const linkExpired = options && options.linkExpired;
  const back = fromAdmin
    ? '<div class="connect-form-actions"><a class="portal-submit" href="app/#/home">Back to workspace</a></div>'
    : '';
  const action = linkExpired
    ? '<div class="connect-form-actions"><button type="button" class="portal-submit" data-action="request-new-install-link" data-shop="' + escapeHtml(handle) + '">Request new install link</button></div>'
    : '<div class="connect-form-actions"><a class="portal-submit" href="#/connect-shopify?status=consent&amp;shop=' + encodeURIComponent(handle) + '">Install app</a></div>';
  const note = linkExpired
    ? 'The app was uninstalled from this Shopify store. The previous install link has expired. Request a new one to reconnect it.'
    : 'The app was uninstalled from this Shopify store. Your install link is still valid. Install again to reconnect it.';
  return '<div class="connect-card"><span class="connect-icon is-warning">' + icon('alert', 23) + '</span><span class="portal-auth-eyebrow">Store disabled</span><h1>This store is disabled</h1><p>BestCheckout for <b>' + domain + '</b> is disabled. You can\'t open the workspace until the store is enabled again.</p><p>' + note + '</p>' + action + back + '</div>';
}

export function renderConnectShopify(route, options) {
  const query = route && route.query ? route.query : new URLSearchParams();
  const shop = shopHandle(query.get('shop'));
  const status = String(query.get('status') || '');
  const logoHref = options && options.logoHref ? options.logoHref : '#/landing';
  if (status === 'pending') return connectFrame(connectPendingCard(shop || 'your-store', query.get('renew') === '1'), logoHref);
  if (status === 'install') return connectFrame(connectInstallCard(shop || 'your-store'), logoHref);
  if (status === 'consent') return connectConsentPage(shop || 'your-store');
  if (status === 'expired') return connectFrame(connectExpiredCard(shop || 'your-store'), logoHref);
  if (status === 'disabled') return connectFrame(connectDisabledCard(shop || 'your-store', { fromAdmin: query.get('from') === 'admin', linkExpired: options && options.installLinkExpired }), logoHref);
  const domainField = '<div class="portal-domain-input"><input required type="text" name="shopDomain" placeholder="your-store" pattern="[a-z0-9]+(-[a-z0-9]+)*" autocomplete="off" value="' + escapeHtml(shop) + '" data-validation-required="Enter your Shopify store name." data-validation-invalid="Use the store name from your permanent myshopify.com address." /><span>.myshopify.com</span></div>';
  return connectFrame('<div class="connect-card"><span class="connect-icon">' + icon('store', 23) + '</span><span class="portal-auth-eyebrow">Shopify connection</span><h1>Connect your Shopify store</h1><p>Enter the permanent Shopify address. We\'ll prepare an install link and email it to you, usually within about 1 day.</p><form class="portal-form" id="connect-shopify-form" novalidate>'
    + portalField('Shopify store address', domainField, 'Enter <strong>your-store.myshopify.com</strong> only. Do not use a custom domain or add https://.')
    + '<div class="connect-form-actions"><button type="submit" class="portal-submit">Submit store ' + icon('arrow', 16) + '</button></div></form></div>', logoHref);
}

export function renderInstallEmailPage(shop) {
  const handle = shopHandle(shop) || 'your-store';
  const domain = escapeHtml(shopDomain(handle));
  return '<div class="verification-email-page"><main class="verification-email-wrap"><p class="verification-email-context">Prototype-only · install email sent after BestCheckout prepares the Custom App.</p><section class="verification-email-inbox" aria-label="Email metadata"><p><span>From</span><b>BestCheckout</b> <small>&lt;no-reply@bestcheckout.com&gt;</small></p><p><span>Subject</span><b>Install BestCheckout on ' + domain + '</b></p></section><section class="verification-email-stage"><article class="verification-email-card"><div class="verification-email-bar"></div><header><a class="verification-email-brand" href="#/landing" aria-label="BestCheckout home"><img src="assets/brand-mark.svg?v=20260723transparentmark1" alt="" aria-hidden="true"/><strong>BestCheckout</strong></a></header><main><h1>Install BestCheckout on your Shopify store</h1><p class="verification-email-lead">Your install link for <b>' + domain + '</b> is ready. Open it with the <b>store owner</b> account for this shop.</p><div class="connect-form-actions verification-email-install-actions">' + installStoreButton(handle) + '</div><p class="verification-email-note">Do not open this while signed into a different Shopify store.</p></main><footer><p>This is an automated message from BestCheckout — please don’t reply.</p><small>© 2026 BestCheckout</small></footer></article></section><a class="verification-email-back" href="#/connect-shopify?status=install&amp;shop=' + encodeURIComponent(handle) + '">← Back to connection</a></main></div>';
}

var OAUTH_CONSENT_SCOPES = [
  { id: 'shops.read', title: 'View your stores', titleZh: '查看你的店铺', desc: 'See which BestCheckout stores this account can access.', descZh: '查看这个账号能进入的 BestCheckout 店铺。' },
  { id: 'overview.read', title: 'View overview metrics', titleZh: '查看概览指标', desc: 'See GMV, orders, average order value, and conversion for your stores.', descZh: '查看各店的 GMV、订单、客单价和转化。' },
  { id: 'flows', title: 'View and edit purchase flows', titleZh: '查看和编辑购买流程', desc: 'See purchase flows, then create, edit, or publish them.', descZh: '查看购买流程，并可以创建、编辑或发布。' },
  { id: 'pages', title: 'View and edit checkout pages', titleZh: '查看和编辑结账页', desc: 'See checkout pages, then create or edit them.', descZh: '查看结账页，并可以创建或编辑。' },
  { id: 'orders.read', title: 'View orders', titleZh: '查看订单', desc: 'See order list and order details.', descZh: '查看订单列表和订单详情。' }
];

var OAUTH_CONSENT_STORES = [
  { name: 'Lavender Labs', domain: 'lavender-labs.myshopify.com' },
  { name: 'Aura Living', domain: 'aura-living.myshopify.com' },
  { name: 'Northline Goods', domain: 'northline-goods.myshopify.com' },
  { name: 'Kiln Coffee', domain: 'kiln-coffee.myshopify.com' }
];

export function oauthConsentScopes() {
  return OAUTH_CONSENT_SCOPES;
}

export function renderOauthConsent(route, options) {
  const opts = options || {};
  const zh = opts.locale === 'zh';
  const t = function (en, cn) { return zh ? cn : en; };
  const client = String((route && route.query && route.query.get('client')) || opts.client || 'Claude');
  const email = opts.email || 'hello@lavenderlabs.co';
  const result = opts.result || '';
  const switcher = renderLanguageSwitcher(opts.locale || 'en', Boolean(opts.languageOpen));

  if (result === 'allowed' || result === 'denied') {
    const ok = result === 'allowed';
    return '<div class="oauth-consent-page">' +
      '<div class="oauth-consent-lang" data-i18n-skip>' + switcher + '</div>' +
      '<article class="oauth-consent-card oauth-consent-card--result">' +
        '<header class="oauth-consent-head">' + brand() + '</header>' +
        '<div class="oauth-result-mark' + (ok ? ' is-ok' : ' is-no') + '">' + icon(ok ? 'check' : 'close', 22) + '</div>' +
        '<h1>' + escapeHtml(ok
          ? t('This assistant can now use this BestCheckout account', '助手现在可以使用这个 BestCheckout 账号')
          : t('You denied access', '你已拒绝访问')) + '</h1>' +
        '<p class="oauth-consent-lead">' + escapeHtml(ok
          ? t('Return to the assistant to continue. You can revoke this later in BestCheckout.', '回到助手继续。之后可在 BestCheckout 里收回访问。')
          : t('Nothing was connected. You can start the connection again from the assistant.', '没有建立连接。你可以在助手里重新发起。')) + '</p>' +
        '<div class="oauth-consent-foot"><button type="button" class="button button-primary" data-action="oauth-consent-done">' + escapeHtml(t('Done', '完成')) + '</button></div>' +
      '</article></div>';
  }

  const rows = OAUTH_CONSENT_SCOPES.map(function (scope) {
    return '<li class="oauth-perm">' +
      '<span class="oauth-perm-mark" aria-hidden="true">' + icon('check', 14) + '</span>' +
      '<span><strong>' + escapeHtml(t(scope.title, scope.titleZh)) + '</strong>' +
      '<small>' + escapeHtml(t(scope.desc, scope.descZh)) + '</small></span></li>';
  }).join('');

  const shops = OAUTH_CONSENT_STORES.map(function (store) {
    return '<li class="oauth-perm">' +
      '<span class="oauth-perm-mark oauth-perm-mark--store" aria-hidden="true">' + icon('store', 14) + '</span>' +
      '<span><strong>' + escapeHtml(store.name) + '</strong>' +
      '<small>' + escapeHtml(store.domain) + '</small></span></li>';
  }).join('');

  return '<div class="oauth-consent-page">' +
    '<div class="oauth-consent-lang" data-i18n-skip>' + switcher + '</div>' +
    '<article class="oauth-consent-card">' +
      '<header class="oauth-consent-head">' + brand() + '</header>' +
      '<h1>' + escapeHtml(t(client + ' wants to access your BestCheckout data', client + ' 想访问你的 BestCheckout 数据')) + '</h1>' +
      '<p class="oauth-consent-lead">' + t(
        'Signed in as <b>' + escapeHtml(email) + '</b>',
        '当前登录 <b>' + escapeHtml(email) + '</b>'
      ) + '</p>' +
      '<section class="oauth-panel">' +
        '<h2>' + escapeHtml(t('What this account can allow', '这个账号能授予的权限')) + '</h2>' +
        '<p class="oauth-panel-note">' + escapeHtml(t(
          'The assistant only receives this account’s existing permissions. It cannot do more than you can.',
          '助手只会拥有这个账号已有的权限，不能越权。'
        )) + '</p>' +
        '<ul class="oauth-perm-list">' + rows + '</ul>' +
      '</section>' +
      '<section class="oauth-panel">' +
        '<h2>' + escapeHtml(t('Stores this account can reach', '这个账号能进入的店铺')) + '</h2>' +
        '<ul class="oauth-perm-list">' + shops + '</ul>' +
      '</section>' +
      '<div class="oauth-consent-foot">' +
        '<button type="button" class="button button-secondary" data-action="oauth-consent-deny">' + escapeHtml(t('Deny', '拒绝')) + '</button>' +
        '<button type="button" class="button button-primary" data-action="oauth-consent-allow">' + escapeHtml(t('Allow', '允许')) + '</button>' +
      '</div>' +
    '</article></div>';
}
