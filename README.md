# BestCheckout merchant admin and marketing prototype

BestCheckout is a focused checkout-growth workspace for Shopify brands. It has its own website, sign-in journey and merchant admin. BestShopio is an internal capability foundation and is not shown to merchants.

## Product boundary

- Shopify remains the merchant's storefront and fulfillment workspace.
- BestCheckout creates the checkout order after payment, using synchronized Shopify product, discount and shipping data.
- BestCheckout sends completed paid orders back to Shopify for fulfillment and customer operations.
- Merchants create and authorize their own Shopify app connection. BestCheckout stores only the access needed to run checkout.

## Included prototype surfaces

- Marketing website: `landing/#/landing`
- Authentication: `#/sign-in`, `#/sign-up`
- Shopify connection guide: `#/connect-shopify`
- Overview and launch checklist: `#/home`
- Checkout flows: `#/funnels`
- Checkout, upsell, downsell and Thank you pages: `#/pages`
- Order status and Shopify order sync: `#/orders`
- Performance and activity: `#/performance`, `#/activity`
- Settings: Shopify store, checkout domain, payments, emails, tracking and store health: `#/settings?tab=store`

## Local preview

Run this in the repository root:

```powershell
python -m http.server 4175
```

Open the merchant admin at [http://127.0.0.1:4175/#/home](http://127.0.0.1:4175/#/home). The marketing website is at [http://127.0.0.1:4175/landing/#/landing](http://127.0.0.1:4175/landing/#/landing).

## Prototype conventions

- It is a static hash-routed prototype, so deep links work in local preview and GitHub Pages.
- English is the default. The lower-left language switcher changes product UI copy, not store names or product data.
- Merchant-facing pages avoid internal concepts such as BestShopio, Shopify distribution modes, webhook configuration, IDs and payment-routing internals.
- Existing Checkout Flow and Page Editor modules are reused; this project does not create a second editor.

## Publish safety

Only the static prototype assets are suitable for publication. Do not publish local docs, temporary files, screenshots, credentials or reference source code.
