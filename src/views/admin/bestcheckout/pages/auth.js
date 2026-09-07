import { icon } from '../components/common.js';
import { escapeHtml } from '../utils.js';
import { PROTOTYPE_ACCOUNTS } from '../session.js';

function brand() {
  return '<a class="portal-auth-brand" href="#/landing" aria-label="BestCheckout home"><img class="portal-mark" src="assets/brand-mark.svg?v=20260723transparentmark1" alt="" aria-hidden="true"/><strong>BestCheckout</strong></a>';
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
    + renderDemoAccountHints()
    + '</form>';
  return authLayout('Welcome back', 'Sign in to BestCheckout', 'Manage checkout growth for your Shopify store.', form, '<p class="portal-auth-foot">New to BestCheckout? <button type="button" data-route="sign-up">Create your account</button></p>');
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

function connectFrame(card) {
  return '<div class="connect-flow"><header class="connect-header">' + brand() + '<button type="button" class="portal-inline-button" data-action="portal-signout">Sign out</button></header><main>' + card + '</main></div>';
}

function connectDemoLinks(shop, current) {
  const q = shop ? '&shop=' + encodeURIComponent(shop) : '';
  const item = function (status, label) {
    const on = current === status ? ' is-current' : '';
    return '<a class="connect-demo-link' + on + '" href="#/connect-shopify?status=' + status + q + '">' + label + '</a>';
  };
  return '<aside class="connect-demo" aria-label="Prototype states"><p>Prototype states</p><div>' +
    '<a class="connect-demo-link" href="#/connect-shopify' + (shop ? '?shop=' + encodeURIComponent(shop) : '') + '">1. Enter store</a>' +
    item('pending', '2. Connecting') +
    item('install', '3. Waiting to install') +
    item('consent', '4. Shopify Install') +
    item('failed', 'Failed') +
    '<a class="connect-demo-link" href="#/install-email-preview' + (shop ? '?shop=' + encodeURIComponent(shop) : '') + '">Install email</a>' +
    '</div></aside>';
}

function connectPendingCard(shop) {
  const domain = escapeHtml(shopDomain(shop) || 'your-store.myshopify.com');
  return '<div class="connect-card"><span class="connect-icon">' + icon('store', 23) + '</span><span class="portal-auth-eyebrow">Shopify connection</span><h1>We\'re preparing your install link</h1><p>BestCheckout is creating a Custom App for <b>' + domain + '</b>. You do not need to open Shopify Dev Dashboard or paste any credentials.</p><ol class="connect-status-steps"><li class="is-complete"><span>1</span><div><strong>Store submitted</strong><small>' + domain + '</small></div></li><li class="is-active"><span>2</span><div><strong>Preparing the install link</strong><small>Usually about 1 day. We\'ll email the store owner when it\'s ready.</small></div></li><li><span>3</span><div><strong>Install BestCheckout</strong><small>The store owner opens the link and selects Install.</small></div></li></ol><p class="connect-status-note">Selecting Install in Shopify does not finish this step. BestCheckout becomes connected only after the callback succeeds.</p><div class="connect-form-actions"><a class="portal-submit" href="#/install-email-preview?shop=' + encodeURIComponent(shop) + '">Preview install email ' + icon('email', 16) + '</a><button type="button" class="portal-inline-button" data-route="connect-shopify?status=install&amp;shop=' + encodeURIComponent(shop) + '">Continue as emailed</button></div>' + connectDemoLinks(shop, 'pending') + '</div>';
}

function connectInstallCard(shop) {
  const domain = escapeHtml(shopDomain(shop) || 'your-store.myshopify.com');
  return '<div class="connect-card"><span class="connect-icon">' + icon('email', 23) + '</span><span class="portal-auth-eyebrow">Waiting to install</span><h1>Install BestCheckout from your email</h1><p>We sent an install link for <b>' + domain + '</b>. Open it with the <b>store owner</b> account for this shop, or a staff account that can manage and install apps.</p><ul class="connect-status-list"><li>Do not use a different Shopify store or a custom domain.</li><li>The Shopify install page may show our Partner company name as the developer.</li><li>After you select Install, return here and wait until this page shows Connected.</li></ul><div class="connect-form-actions"><button type="button" class="portal-submit" data-route="connect-shopify?status=consent&amp;shop=' + encodeURIComponent(shop) + '">Open Shopify install page ' + icon('arrow', 16) + '</button><a class="portal-inline-button" href="#/install-email-preview?shop=' + encodeURIComponent(shop) + '">Preview email</a></div>' + connectDemoLinks(shop, 'install') + '</div>';
}

function connectConsentCard(shop) {
  const domain = escapeHtml(shopDomain(shop) || 'your-store.myshopify.com');
  return '<div class="connect-card connect-consent-card"><span class="portal-auth-eyebrow">Shopify · prototype</span><h1>Install BestCheckout</h1><p class="connect-consent-store">Installing on <b>' + domain + '</b></p><dl class="connect-consent-meta"><div><dt>Developer</dt><dd>BestCheckout Partner</dd></div><div><dt>Access</dt><dd>Products, customers, orders, discounts, shipping, and checkout data needed to run hosted checkout.</dd></div></dl><p class="connect-status-note">This Custom App is created by BestCheckout for this store only. Installing grants access; BestCheckout is connected only after you return and the store shows as Connected.</p><div class="connect-form-actions"><a class="portal-submit" href="app/?rev=20260907-install-link1&amp;shopify=connected#/home">Install</a><button type="button" class="portal-inline-button" data-route="connect-shopify?status=install&amp;shop=' + encodeURIComponent(shop) + '">Cancel</button></div>' + connectDemoLinks(shop, 'consent') + '</div>';
}

function connectFailedCard(shop) {
  return '<div class="connect-card"><span class="connect-icon">' + icon('alert', 23) + '</span><span class="portal-auth-eyebrow">Connection failed</span><h1>We couldn\'t connect this store</h1><p>Check the store address and who opened the install link, then try again.</p><ul class="connect-status-list"><li>Use <b>your-store.myshopify.com</b>, not a www custom domain.</li><li>The person who installs must be the store owner or have permission to manage apps.</li><li>Selecting Install is not enough if BestCheckout does not receive the callback.</li></ul><div class="connect-form-actions"><button type="button" class="portal-submit" data-route="connect-shopify' + (shop ? '?shop=' + encodeURIComponent(shop) : '') + '">Try again</button></div>' + connectDemoLinks(shop, 'failed') + '</div>';
}

export function renderConnectShopify(route) {
  const query = route && route.query ? route.query : new URLSearchParams();
  const shop = shopHandle(query.get('shop'));
  const status = String(query.get('status') || '');
  if (status === 'pending') return connectFrame(connectPendingCard(shop || 'your-store'));
  if (status === 'install') return connectFrame(connectInstallCard(shop || 'your-store'));
  if (status === 'consent') return connectFrame(connectConsentCard(shop || 'your-store'));
  if (status === 'failed') return connectFrame(connectFailedCard(shop));
  const help = '<aside class="connect-credentials-help"><div><strong>You only enter the store address</strong><span>BestCheckout prepares the Custom App and emails the install link. You do not create an app or paste credentials.</span></div><a href="help/#guide=connect-shopify" target="_blank" rel="noopener">View the guide ' + icon('external', 14) + '</a></aside>';
  const domainField = '<div class="portal-domain-input"><input required type="text" name="shopDomain" placeholder="your-store" pattern="[a-z0-9]+(-[a-z0-9]+)*" autocomplete="off" value="' + escapeHtml(shop) + '" data-validation-required="Enter your Shopify store name." data-validation-invalid="Use the store name from your permanent myshopify.com address." /><span>.myshopify.com</span></div>';
  return connectFrame('<div class="connect-card"><span class="connect-icon">' + icon('store', 23) + '</span><span class="portal-auth-eyebrow">Shopify connection</span><h1>Connect your Shopify store</h1><p>Enter the permanent Shopify address. We\'ll prepare an install link and email it to you, usually within about 1 day.</p><form class="portal-form" id="connect-shopify-form" novalidate>'
    + portalField('Shopify store address', domainField, 'Enter <strong>your-store.myshopify.com</strong> only. Do not use a custom domain or add https://.')
    + help
    + '<div class="connect-form-actions"><button type="submit" class="portal-submit">Submit store ' + icon('arrow', 16) + '</button></div></form>'
    + connectDemoLinks(shop, '')
    + '</div>');
}

export function renderInstallEmailPage(shop) {
  const handle = shopHandle(shop) || 'your-store';
  const domain = escapeHtml(shopDomain(handle));
  return '<div class="verification-email-page"><main class="verification-email-wrap"><p class="verification-email-context">Prototype-only · install email sent after BestCheckout prepares the Custom App.</p><section class="verification-email-inbox" aria-label="Email metadata"><p><span>From</span><b>BestCheckout</b> <small>&lt;no-reply@bestcheckout.com&gt;</small></p><p><span>Subject</span><b>Install BestCheckout on ' + domain + '</b></p></section><section class="verification-email-stage"><article class="verification-email-card"><div class="verification-email-bar"></div><header><a class="verification-email-brand" href="#/landing" aria-label="BestCheckout home"><img src="assets/brand-mark.svg?v=20260723transparentmark1" alt="" aria-hidden="true"/><strong>BestCheckout</strong></a></header><main><h1>Install BestCheckout on your Shopify store</h1><p class="verification-email-lead">Your install link for <b>' + domain + '</b> is ready. Open it with the <b>store owner</b> account for this shop.</p><p class="verification-email-note">The Shopify page may show our Partner company as the developer. After you select Install, return to BestCheckout and wait until the store shows as Connected. Installing does not switch checkout traffic by itself.</p><p class="verification-email-note">Do not open this link while signed into a different Shopify store.</p><div class="connect-form-actions" style="margin-top:22px;padding-top:0;border:0;justify-content:flex-start"><a class="portal-submit" href="#/connect-shopify?status=consent&amp;shop=' + encodeURIComponent(handle) + '">Install BestCheckout</a></div></main><footer><p>This is an automated message from BestCheckout — please don’t reply.</p><small>© 2026 BestCheckout</small></footer></article></section><a class="verification-email-back" href="#/connect-shopify?status=install&amp;shop=' + encodeURIComponent(handle) + '">← Back to connection</a></main></div>';
}
