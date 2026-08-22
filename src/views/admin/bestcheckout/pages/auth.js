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

export function renderConnectShopify() {
  const credentialsHelp = '<aside class="connect-credentials-help"><div><strong>Need your Client ID and Secret?</strong><span>Open your Shopify app\'s Settings in Shopify Dev Dashboard to find both credentials.</span></div><a href="help/#guide=connect-shopify" target="_blank" rel="noopener">View the guide ' + icon('external', 14) + '</a></aside>';
  const domainField = '<div class="portal-domain-input"><input required type="text" name="shopDomain" placeholder="your-store" pattern="[a-z0-9]+(-[a-z0-9]+)*" autocomplete="off" data-validation-required="Enter your Shopify store name." data-validation-invalid="Use the store name from your permanent myshopify.com address." /><span>.myshopify.com</span></div>';
  return '<div class="connect-flow"><header class="connect-header">' + brand() + '<button type="button" class="portal-inline-button" data-action="portal-signout">Sign out</button></header><main><div class="connect-card"><span class="connect-icon">' + icon('store', 23) + '</span><span class="portal-auth-eyebrow">Shopify connection</span><h1>Connect your Shopify store</h1><p>Use the app you create in Shopify Dev Dashboard. BestCheckout uses it only to keep checkout data current and write paid orders back to Shopify.</p><form class="portal-form" id="connect-shopify-form" novalidate>'
    + portalField('Shopify store address', domainField, 'Enter the permanent <strong>myshopify.com</strong> address, not your storefront domain.')
    + credentialsHelp
    + portalField('Client ID', '<input required type="text" name="clientId" placeholder="Paste your Client ID" autocomplete="off" data-validation-required="Enter your Shopify Client ID." />', 'Find this in the app\'s <strong>Settings</strong> page in Shopify Dev Dashboard.')
    + portalField('Secret', '<input required type="password" name="clientSecret" placeholder="Paste your Secret" autocomplete="new-password" data-validation-required="Enter your Shopify Secret." />', 'Stored securely and never shown again after you connect. Do not paste an Admin API access token here.')
    + '<div class="connect-confirmation" data-connect-confirmation><label class="portal-check portal-terms"><input type="checkbox" name="authorizationConfirmed" checked aria-describedby="connect-authorization-error" /> <span>I created this app in Shopify Dev Dashboard and authorize BestCheckout to use it for this store.</span></label><p id="connect-authorization-error" class="connect-confirmation-error" data-connect-confirmation-error role="alert" hidden>Confirm that you created this Shopify app and authorize BestCheckout before continuing.</p></div><div class="connect-form-actions"><button type="submit" class="portal-submit">Connect store ' + icon('arrow', 16) + '</button></div></form></div></main></div>';
}
