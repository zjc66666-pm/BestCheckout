import { icon } from '../components/common.js';

function brand() {
  return '<a class="portal-auth-brand" href="#/" aria-label="BestCheckout home"><img class="portal-mark" src="../assets/brand-mark.svg?v=20260723transparentmark1" alt="" aria-hidden="true"/><strong>BestCheckout</strong></a>';
}

function authLayout(eyebrow, title, copy, formMarkup, foot) {
  return '<div class="portal-auth"><aside class="portal-auth-aside"><div>' + brand() + '<span class="portal-auth-kicker">Checkout growth for Shopify brands</span><h1>Build a better<br/><em>way to buy.</em></h1><p>One workspace for your checkout, offers, payment connections and order performance.</p></div><div class="portal-auth-aside-proof"><span>' + icon('shield', 18) + '</span><p>Your Shopify store stays in your control. BestCheckout connects only the data it needs to run your checkout.</p></div></aside><main class="portal-auth-main"><div class="portal-auth-card"><div class="portal-auth-mobile-brand">' + brand() + '</div><span class="portal-auth-eyebrow">' + eyebrow + '</span><h2>' + title + '</h2><p>' + copy + '</p>' + formMarkup + (foot || '') + '</div></main></div>';
}

function portalField(label, control, help) {
  return '<label class="portal-field" data-portal-field><span class="portal-field-label">' + label + '</span>' + control + '<span class="portal-field-error" data-field-error role="alert" hidden></span>' + (help ? '<small>' + help + '</small>' : '') + '</label>';
}

export function renderSignIn() {
  const form = '<form class="portal-form" id="portal-login-form" novalidate>'
    + portalField('Email', '<input required type="email" name="email" value="hello@lavenderlabs.co" autocomplete="email" data-validation-required="Enter your email address." data-validation-invalid="Enter a valid email address." />')
    + portalField('Password', '<div class="portal-password-field"><input required type="password" name="password" value="demo-password" autocomplete="current-password" data-validation-required="Enter your password." /><button type="button" aria-label="Show password">' + icon('eye', 16) + '</button></div>')
    + '<div class="portal-form-row"><label class="portal-check"><input type="checkbox" checked /> <span>Keep me signed in</span></label><button type="button" class="portal-inline-button" data-route="forgot-password">Forgot password?</button></div><button type="submit" class="portal-submit">Sign in ' + icon('arrow', 16) + '</button></form>';
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
  if (step === 'reset' || step === 'sent') {
    const form = '<form class="portal-form" id="portal-reset-password-form" novalidate>'
      + portalField('Verification code', '<input required type="text" name="verificationCode" inputmode="numeric" autocomplete="one-time-code" minlength="6" maxlength="6" pattern="[0-9]{6}" placeholder="Enter 6-digit code" data-validation-required="Enter the verification code." data-validation-too-short="Enter the 6-digit verification code." data-validation-invalid="Enter the 6-digit verification code." />', 'We sent a 6-digit code to your email address.')
      + portalField('New password', '<input required type="password" name="newPassword" autocomplete="new-password" minlength="8" placeholder="Create a new password" data-validation-required="Create a new password." data-validation-too-short="Use at least 8 characters." />')
      + portalField('Confirm new password', '<input required type="password" name="confirmPassword" autocomplete="new-password" minlength="8" placeholder="Re-enter your new password" data-validation-required="Confirm your new password." data-validation-too-short="Use at least 8 characters." />')
      + '<button type="submit" class="portal-submit">Reset password ' + icon('arrow', 16) + '</button></form>';
    return authLayout('Password recovery', 'Enter verification code', 'Use the code from your email and choose a new password.', form, '<p class="portal-auth-foot"><button type="button" data-route="forgot-password">Use a different email</button></p>');
  }
  const form = '<form class="portal-form" id="portal-forgot-password-form" novalidate>'
    + portalField('Email', '<input required type="email" name="email" autocomplete="email" autofocus data-validation-required="Enter your email address." data-validation-invalid="Enter a valid email address." />')
    + '<button type="submit" class="portal-submit">Send verification code ' + icon('arrow', 16) + '</button></form>';
  return authLayout('Password recovery', 'Reset your password', 'Enter the email address you use for BestCheckout. We’ll send a 6-digit verification code.', form, '<p class="portal-auth-foot">Remembered your password? <button type="button" data-route="sign-in">Back to sign in</button></p>');
}

export function renderSignUp() {
  const form = '<form class="portal-form" id="portal-signup-form" novalidate>'
    + portalField('Work email', '<input required type="email" name="email" placeholder="you@company.com" autocomplete="email" data-validation-required="Enter your work email address." data-validation-invalid="Enter a valid work email address." />')
    + portalField('Full name', '<input required type="text" name="name" placeholder="Your name" autocomplete="name" data-validation-required="Enter your full name." />')
    + portalField('Password', '<input required minlength="8" type="password" name="password" placeholder="Create a password" autocomplete="new-password" data-validation-required="Create a password." data-validation-too-short="Use at least 8 characters." />')
    + '<button type="submit" class="portal-submit">Create account ' + icon('arrow', 16) + '</button><p class="portal-terms-note">By creating an account, you agree to the Terms and Privacy Policy.</p></form>';
  return authLayout('Get started', 'Create your BestCheckout account', 'Start with your Shopify store. You can build and test before sending buyers to a new checkout.', form, '<p class="portal-auth-foot">Already have an account? <button type="button" data-route="sign-in">Sign in</button></p>');
}

export function renderConnectShopify() {
  const credentialsHelp = '<aside class="connect-credentials-help"><div><strong>Need your Client ID and Secret?</strong><span>Open your Shopify app\'s Settings in Shopify Dev Dashboard to find both credentials.</span></div><a href="../help/#guide=connect-shopify" target="_blank" rel="noopener">View the guide ' + icon('external', 14) + '</a></aside>';
  const domainField = '<div class="portal-domain-input"><input required type="text" name="shopDomain" placeholder="your-store" pattern="[a-z0-9]+(-[a-z0-9]+)*" autocomplete="off" data-validation-required="Enter your Shopify store name." data-validation-invalid="Use the store name from your permanent myshopify.com address." /><span>.myshopify.com</span></div>';
  return '<div class="connect-flow"><header class="connect-header">' + brand() + '<button type="button" class="portal-inline-button" data-action="portal-signout">Sign out</button></header><main><div class="connect-card"><span class="connect-icon">' + icon('store', 23) + '</span><span class="portal-auth-eyebrow">Shopify connection</span><h1>Connect your Shopify store</h1><p>Use the app you create in Shopify Dev Dashboard. BestCheckout uses it only to keep checkout data current and write paid orders back to Shopify.</p><form class="portal-form" id="connect-shopify-form" novalidate>'
    + portalField('Shopify store address', domainField, 'Enter the permanent <strong>myshopify.com</strong> address, not your storefront domain.')
    + credentialsHelp
    + portalField('Client ID', '<input required type="text" name="clientId" placeholder="Paste your Client ID" autocomplete="off" data-validation-required="Enter your Shopify Client ID." />', 'Find this in the app\'s <strong>Settings</strong> page in Shopify Dev Dashboard.')
    + portalField('Secret', '<input required type="password" name="clientSecret" placeholder="Paste your Secret" autocomplete="new-password" data-validation-required="Enter your Shopify Secret." />', 'Stored securely and never shown again after you connect. Do not paste an Admin API access token here.')
    + '<div class="connect-confirmation" data-connect-confirmation><label class="portal-check portal-terms"><input type="checkbox" name="authorizationConfirmed" checked aria-describedby="connect-authorization-error" /> <span>I created this app in Shopify Dev Dashboard and authorize BestCheckout to use it for this store.</span></label><p id="connect-authorization-error" class="connect-confirmation-error" data-connect-confirmation-error role="alert" hidden>Confirm that you created this Shopify app and authorize BestCheckout before continuing.</p></div><div class="connect-form-actions"><button type="submit" class="portal-submit">Connect store ' + icon('arrow', 16) + '</button></div></form></div></main></div>';
}
