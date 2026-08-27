import { icon } from '../components/common.js';
import { marketingCtas } from '../session.js';

const capabilities = [
  { step: '01', iconName: 'sparkles', title: 'Own the purchase moment', description: 'On-brand checkout journeys', features: ['Visual builder', 'Custom domains', 'Native wallets'] },
  { step: '02', iconName: 'flow', title: 'Run a checkout funnel', description: 'Shopify gives you one checkout', features: ['Multiple checkouts', 'Upsell + Downsell', 'Audience routing'] },
  { step: '03', iconName: 'shield', title: 'Operate with confidence', description: 'Shopify stays in sync', features: ['Live inventory', 'Order tagging', 'Payment routing'] },
];

const heroPoints = [
  'Customize checkout without Shopify Plus',
  'No Shopify Payments? Avoid up to 2% in fees',
  'Richer Checkout, Upsell, Downsell, and Thank you templates',
];

const highlights = [
  {
    iconName: 'pages',
    figure: 'No Plus',
    title: 'Customize checkout without Shopify Plus',
    description: 'Shopify Plus is required to deeply customize native checkout. BestCheckout gives you branded checkout pages, funnels, and post-purchase offers on any paid Shopify plan.',
  },
  {
    iconName: 'card',
    figure: 'Up to 2%',
    title: 'No Shopify Payments? Avoid extra Shopify fees',
    description: 'Without Shopify Payments, Shopify native checkout adds up to 2% on third-party payments. BestCheckout collects on its own checkout page, so that extra Shopify fee does not apply.',
  },
];

const outcomes = [
  { value: '12,400', target: 12400, decimals: 0, prefix: '', suffix: '+', label: 'Shopify merchants running BestCheckout' },
  { value: '$2.8', target: 2.8, decimals: 1, prefix: '$', suffix: 'B+', label: 'GMV processed through BestCheckout journeys' },
  { value: '+23', target: 23, decimals: 0, prefix: '+', suffix: '%', label: 'Average checkout conversion lift vs. standard checkout' },
  { value: '99.98', target: 99.98, decimals: 2, prefix: '', suffix: '%', label: 'Shopify order sync reliability' },
];

const testimonialAvatar = 'assets/testimonials';
const testimonials = [
  { quote: 'We went live in 47 minutes. Recovery flow added 18% to monthly revenue without touching our Shopify theme. Orders sync before our fulfillment team even opens the dashboard.', metric: '+18% MRR', avatar: testimonialAvatar + '/sarah-chen.png?v=20260821-testimonial-avatars1', name: 'Sarah Chen', role: 'Founder, Vera & Oak Skincare' },
  { quote: 'Checkout conversion jumped from 2.1% to 3.4% in the first week. The offer sequencing logic is the clearest I have used - no guessing what fires when.', metric: '3.4% conversion', avatar: testimonialAvatar + '/marcus-williams.png?v=20260821-testimonial-avatars1', name: 'Marcus Williams', role: 'Head of Ecommerce, Northline Outerwear' },
  { quote: 'Post-purchase upsells that do not feel like spam. AOV lifted $34 on average and customer support tickets did not move. That is the signal.', metric: '+$34 AOV', avatar: testimonialAvatar + '/elena-rodriguez.png?v=20260821-testimonial-avatars1', name: 'Elena Rodriguez', role: 'DTC Lead, Compound Coffee Co.' },
  { quote: 'Every payment goes through our existing Shopify Payments setup. No re-onboarding, no split reconciliation. BestCheckout is a layer, not a replacement.', metric: '100% sync', avatar: testimonialAvatar + '/jordan-park.png?v=20260821-testimonial-avatars1', name: 'Jordan Park', role: 'Co-Founder, Assembly Home' },
  { quote: 'Cart abandonment recovery runs automatically now. We recovered 441 orders last month that would have been lost. The revenue dashboard shows exactly where it came from.', metric: '441 recovered', avatar: testimonialAvatar + '/priya-nadkarni.png?v=20260821-testimonial-avatars1', name: 'Priya Nadkarni', role: 'Founder, Vitality Labs' },
  { quote: 'The checkout builder let us match our brand voice perfectly. We went from generic Shopify checkout to an experience that feels like ours. Conversion lifted 26% month one.', metric: '+26% conversion', avatar: testimonialAvatar + '/alex-foster.png?v=20260821-testimonial-avatars1', name: 'Alex Foster', role: 'Creative Director, Lunar Apparel' },
];

const footerTrustBadges = [
  { label: 'Shopify Partner', icon: 'https://cdn.simpleicons.org/shopify/95BF47', className: 'shopify' },
  { label: 'Trusted Shops', icon: 'https://cdn.simpleicons.org/trustedshops/00B67A', className: 'trusted-shops' },
  { label: 'SecurityScorecard', icon: 'https://cdn.simpleicons.org/securityscorecard/FFFFFF', className: 'security-scorecard' },
  { label: 'GDPR ready', icon: 'https://cdn.simpleicons.org/europeanunion/FFCC00', className: 'gdpr' },
];

const footerPaymentLogo = 'settings/assets/payments/payment-logo-sheet.svg?v=20260723paymentlogosheet3';
const brandMark = 'assets/brand-mark.svg?v=20260723brandmark1';
const LOOKBOOK_ASSET = 'v=20260824-webp1';
const LOOKBOOK_TYPES = [
  { key: 'all', label: 'All pages' },
  { key: 'checkout', label: 'Checkout' },
  { key: 'upsell', label: 'Upsell' },
  { key: 'downsell', label: 'Downsell' },
  { key: 'thankyou', label: 'Thank you' },
];
const LOOKBOOK_INDUSTRIES = [
  { key: 'all', label: 'All brands' },
  { key: 'baby', label: 'Baby' },
  { key: 'beauty', label: 'Beauty' },
  { key: 'fashion', label: 'Fashion' },
  { key: 'food', label: 'Food' },
  { key: 'jewelry', label: 'Jewelry' },
  { key: 'living', label: 'Living' },
  { key: 'pets', label: 'Pets' },
  { key: 'sport', label: 'Sport' },
  { key: 'wellness', label: 'Wellness' },
];
const FASHION = 'bestcheckout/covers-archive/generated-fashion/';
const WELLNESS = 'bestcheckout/covers-archive/generated-supplements/';
const JEWELRY = 'bestcheckout/covers-archive/generated-jewelry/';
const LIVING = 'bestcheckout/covers-archive/generated-living/';
const FOOD = 'bestcheckout/covers-archive/generated-food/';
const PETS = 'bestcheckout/covers-archive/generated-pets/';
const BABY = 'bestcheckout/covers-archive/generated-baby/';
const SPORT = 'bestcheckout/covers-archive/generated-sport/';
const MOBILE = 'bestcheckout/covers-archive/generated-mobile/';
const LOOKBOOK_PAGES = [
  { id: 'fashion-checkout-03', type: 'checkout', industry: 'fashion', title: 'Editorial checkout', brand: 'ATELIER', src: FASHION + 'fashion-checkout-03.png' },
  { id: 'beauty-checkout-3', type: 'checkout', industry: 'beauty', title: 'Dark luxury checkout', brand: 'AURA', src: 'bestcheckout/covers/checkout-3.png' },
  { id: 'beauty-editorial', type: 'checkout', industry: 'beauty', title: 'Hero + express pay', brand: 'AURA', src: MOBILE + 'co-editorial.png' },
  { id: 'fashion-checkout-01', type: 'checkout', industry: 'fashion', title: 'One-page checkout', brand: 'LINEA', src: FASHION + 'fashion-checkout-01.png' },
  { id: 'beauty-express', type: 'checkout', industry: 'beauty', title: 'Wallets first', brand: 'AURA', src: MOBILE + 'co-express.png' },
  { id: 'wellness-checkout-1', type: 'checkout', industry: 'wellness', title: 'Secure payment step', brand: 'VITALIS', src: WELLNESS + 'supplement-checkout-01.png' },
  { id: 'fashion-checkout-02', type: 'checkout', industry: 'fashion', title: 'Apple Pay + Shop Pay', brand: 'STUDIO 9', src: FASHION + 'fashion-checkout-02.png' },
  { id: 'beauty-checkout-1', type: 'checkout', industry: 'beauty', title: 'Saved-profile checkout', brand: 'AURA', src: 'bestcheckout/covers/checkout-1.png' },
  { id: 'fashion-checkout-04', type: 'checkout', industry: 'fashion', title: 'Review and pay', brand: 'RIVER', src: FASHION + 'fashion-checkout-04.png' },
  { id: 'beauty-checkout-2', type: 'checkout', industry: 'beauty', title: 'Product-led checkout', brand: 'AURA', src: 'bestcheckout/covers/checkout-2.png' },
  { id: 'beauty-wallet', type: 'checkout', industry: 'beauty', title: 'Wallet checkout', brand: 'AURA', src: MOBILE + 'co-wallet.png' },
  { id: 'wellness-checkout-3', type: 'checkout', industry: 'wellness', title: 'Night checkout', brand: 'PURE DAY', src: WELLNESS + 'supplement-checkout-03.png' },
  { id: 'fashion-checkout-05', type: 'checkout', industry: 'fashion', title: 'Quiet checkout', brand: 'ORIO', src: FASHION + 'fashion-checkout-05.png' },
  { id: 'wellness-checkout-2', type: 'checkout', industry: 'wellness', title: 'Daily stack checkout', brand: 'NORTHWELL', src: WELLNESS + 'supplement-checkout-02.png' },
  { id: 'beauty-trust', type: 'checkout', industry: 'beauty', title: 'Trust-first checkout', brand: 'AURA', src: MOBILE + 'co-trust.png' },
  { id: 'wellness-checkout-4', type: 'checkout', industry: 'wellness', title: 'Refill checkout', brand: 'VITALIS', src: WELLNESS + 'supplement-checkout-04.png' },
  { id: 'beauty-gift', type: 'checkout', industry: 'beauty', title: 'Gift checkout', brand: 'AURA', src: MOBILE + 'co-gift.png' },
  { id: 'wellness-checkout-5', type: 'checkout', industry: 'wellness', title: 'Subscribe checkout', brand: 'NORTHWELL', src: WELLNESS + 'supplement-checkout-05.png' },
  { id: 'fashion-upsell-02', type: 'upsell', industry: 'fashion', title: 'Carry it with you', brand: 'LINEA', src: 'bestcheckout/covers/upsell-1.png' },
  { id: 'fashion-upsell-01', type: 'upsell', industry: 'fashion', title: 'Complete the look', brand: 'LINEA', src: FASHION + 'fashion-upsell-01.png' },
  { id: 'fashion-upsell-03', type: 'upsell', industry: 'fashion', title: 'Add the scarf', brand: 'ATELIER', src: FASHION + 'fashion-upsell-03.png' },
  { id: 'fashion-upsell-04', type: 'upsell', industry: 'fashion', title: 'Pair the denim', brand: 'RIVER', src: FASHION + 'fashion-upsell-04.png' },
  { id: 'fashion-upsell-05', type: 'upsell', industry: 'fashion', title: 'One more piece', brand: 'ORIO', src: FASHION + 'fashion-upsell-05.png' },
  { id: 'beauty-upsell-2', type: 'upsell', industry: 'beauty', title: 'Choose your size', brand: 'AURA', src: 'bestcheckout/covers/upsell-2.png' },
  { id: 'wellness-upsell-1', type: 'upsell', industry: 'wellness', title: 'Morning stack', brand: 'VITALIS', src: WELLNESS + 'supplement-upsell-01.png' },
  { id: 'wellness-upsell-2', type: 'upsell', industry: 'wellness', title: 'Add magnesium', brand: 'NORTHWELL', src: WELLNESS + 'supplement-upsell-02.png' },
  { id: 'wellness-upsell-3', type: 'upsell', industry: 'wellness', title: 'Night recovery', brand: 'PURE DAY', src: WELLNESS + 'supplement-upsell-03.png' },
  { id: 'wellness-upsell-4', type: 'upsell', industry: 'wellness', title: 'Travel pack', brand: 'VITALIS', src: WELLNESS + 'supplement-upsell-04.png' },
  { id: 'wellness-upsell-5', type: 'upsell', industry: 'wellness', title: 'Double the supply', brand: 'NORTHWELL', src: WELLNESS + 'supplement-upsell-05.png' },
  { id: 'fashion-downsell-05', type: 'downsell', industry: 'fashion', title: 'Something small', brand: 'LINEA', src: 'bestcheckout/covers/downsell-1.png' },
  { id: 'fashion-downsell-01', type: 'downsell', industry: 'fashion', title: 'Keep a sample', brand: 'LINEA', src: FASHION + 'fashion-downsell-01.png' },
  { id: 'fashion-downsell-02', type: 'downsell', industry: 'fashion', title: 'A lighter option', brand: 'STUDIO 9', src: FASHION + 'fashion-downsell-02.png' },
  { id: 'fashion-downsell-03', type: 'downsell', industry: 'fashion', title: 'Stay with silk', brand: 'ATELIER', src: FASHION + 'fashion-downsell-03.png' },
  { id: 'fashion-downsell-04', type: 'downsell', industry: 'fashion', title: 'Start with the tee', brand: 'RIVER', src: FASHION + 'fashion-downsell-04.png' },
  { id: 'beauty-downsell-2', type: 'downsell', industry: 'beauty', title: 'Sleep Serum', brand: 'AURA', src: 'bestcheckout/covers/downsell-2.png' },
  { id: 'wellness-downsell-1', type: 'downsell', industry: 'wellness', title: 'Start smaller', brand: 'VITALIS', src: WELLNESS + 'supplement-downsell-01.png' },
  { id: 'wellness-downsell-2', type: 'downsell', industry: 'wellness', title: 'Trial bottle', brand: 'NORTHWELL', src: WELLNESS + 'supplement-downsell-02.png' },
  { id: 'wellness-downsell-3', type: 'downsell', industry: 'wellness', title: 'Single serve', brand: 'PURE DAY', src: WELLNESS + 'supplement-downsell-03.png' },
  { id: 'wellness-downsell-4', type: 'downsell', industry: 'wellness', title: 'Starter pack', brand: 'VITALIS', src: WELLNESS + 'supplement-downsell-04.png' },
  { id: 'wellness-downsell-5', type: 'downsell', industry: 'wellness', title: 'Keep the habit', brand: 'NORTHWELL', src: WELLNESS + 'supplement-downsell-05.png' },
  { id: 'beauty-thankyou-1', type: 'thankyou', industry: 'beauty', title: 'Thank you', brand: 'AURA', src: 'bestcheckout/covers/thankyou-1.png' },
  { id: 'fashion-thankyou-01', type: 'thankyou', industry: 'fashion', title: 'Order confirmed', brand: 'LINEA', src: FASHION + 'fashion-thankyou-01.png' },
  { id: 'fashion-thankyou-02', type: 'thankyou', industry: 'fashion', title: "You're in", brand: 'STUDIO 9', src: FASHION + 'fashion-thankyou-02.png' },
  { id: 'fashion-thankyou-03', type: 'thankyou', industry: 'fashion', title: 'On its way', brand: 'ATELIER', src: FASHION + 'fashion-thankyou-03.png' },
  { id: 'fashion-thankyou-04', type: 'thankyou', industry: 'fashion', title: 'Packed and ready', brand: 'RIVER', src: FASHION + 'fashion-thankyou-04.png' },
  { id: 'fashion-thankyou-05', type: 'thankyou', industry: 'fashion', title: 'See you soon', brand: 'ORIO', src: FASHION + 'fashion-thankyou-05.png' },
  { id: 'wellness-thankyou-1', type: 'thankyou', industry: 'wellness', title: "You're all set", brand: 'VITALIS', src: WELLNESS + 'supplement-thankyou-01.png' },
  { id: 'wellness-thankyou-2', type: 'thankyou', industry: 'wellness', title: 'First dose soon', brand: 'NORTHWELL', src: WELLNESS + 'supplement-thankyou-02.png' },
  { id: 'wellness-thankyou-3', type: 'thankyou', industry: 'wellness', title: 'Routine starts tonight', brand: 'PURE DAY', src: WELLNESS + 'supplement-thankyou-03.png' },
  { id: 'wellness-thankyou-4', type: 'thankyou', industry: 'wellness', title: 'Track your order', brand: 'VITALIS', src: WELLNESS + 'supplement-thankyou-04.png' },
  { id: 'wellness-thankyou-5', type: 'thankyou', industry: 'wellness', title: 'Welcome to the ritual', brand: 'NORTHWELL', src: WELLNESS + 'supplement-thankyou-05.png' },
  { id: 'jewelry-checkout-01', type: 'checkout', industry: 'jewelry', title: 'Fine chain checkout', brand: 'ORIO', src: JEWELRY + 'jewelry-checkout-01.png' },
  { id: 'jewelry-checkout-02', type: 'checkout', industry: 'jewelry', title: 'Editorial jewelry pay', brand: 'AURELIA', src: JEWELRY + 'jewelry-checkout-02.png' },
  { id: 'jewelry-upsell-01', type: 'upsell', industry: 'jewelry', title: 'Complete the set', brand: 'ORIO', src: JEWELRY + 'jewelry-upsell-01.png' },
  { id: 'jewelry-upsell-02', type: 'upsell', industry: 'jewelry', title: 'Stack the bracelet', brand: 'AURELIA', src: JEWELRY + 'jewelry-upsell-02.png' },
  { id: 'jewelry-downsell-01', type: 'downsell', industry: 'jewelry', title: 'A smaller sparkle', brand: 'ORIO', src: JEWELRY + 'jewelry-downsell-01.png' },
  { id: 'jewelry-downsell-02', type: 'downsell', industry: 'jewelry', title: 'Start with studs', brand: 'AURELIA', src: JEWELRY + 'jewelry-downsell-02.png' },
  { id: 'jewelry-thankyou-01', type: 'thankyou', industry: 'jewelry', title: "It's yours", brand: 'ORIO', src: JEWELRY + 'jewelry-thankyou-01.png' },
  { id: 'jewelry-thankyou-02', type: 'thankyou', industry: 'jewelry', title: 'How to care for it', brand: 'AURELIA', src: JEWELRY + 'jewelry-thankyou-02.png' },
  { id: 'jewelry-checkout-03', type: 'checkout', industry: 'jewelry', title: 'Signet checkout', brand: 'ORIO', src: JEWELRY + 'jewelry-checkout-03.png' },
  { id: 'jewelry-checkout-04', type: 'checkout', industry: 'jewelry', title: 'Watch checkout', brand: 'AURELIA', src: JEWELRY + 'jewelry-checkout-04.png' },
  { id: 'jewelry-checkout-05', type: 'checkout', industry: 'jewelry', title: 'Gift wrap checkout', brand: 'ORIO', src: JEWELRY + 'jewelry-checkout-05.png' },
  { id: 'jewelry-upsell-03', type: 'upsell', industry: 'jewelry', title: 'Add a charm', brand: 'ORIO', src: JEWELRY + 'jewelry-upsell-03.png' },
  { id: 'jewelry-upsell-04', type: 'upsell', industry: 'jewelry', title: 'The stacking ring', brand: 'AURELIA', src: JEWELRY + 'jewelry-upsell-04.png' },
  { id: 'jewelry-upsell-05', type: 'upsell', industry: 'jewelry', title: 'Keep it safe', brand: 'ORIO', src: JEWELRY + 'jewelry-upsell-05.png' },
  { id: 'jewelry-downsell-03', type: 'downsell', industry: 'jewelry', title: 'A single stud', brand: 'AURELIA', src: JEWELRY + 'jewelry-downsell-03.png' },
  { id: 'jewelry-downsell-04', type: 'downsell', industry: 'jewelry', title: 'A finer chain', brand: 'ORIO', src: JEWELRY + 'jewelry-downsell-04.png' },
  { id: 'jewelry-downsell-05', type: 'downsell', industry: 'jewelry', title: 'Last look', brand: 'AURELIA', src: JEWELRY + 'jewelry-downsell-05.png' },
  { id: 'jewelry-thankyou-03', type: 'thankyou', industry: 'jewelry', title: 'On its way', brand: 'ORIO', src: JEWELRY + 'jewelry-thankyou-03.png' },
  { id: 'jewelry-thankyou-04', type: 'thankyou', industry: 'jewelry', title: 'Gift note sent', brand: 'AURELIA', src: JEWELRY + 'jewelry-thankyou-04.png' },
  { id: 'jewelry-thankyou-05', type: 'thankyou', industry: 'jewelry', title: 'Lifetime shine', brand: 'ORIO', src: JEWELRY + 'jewelry-thankyou-05.png' },
  { id: 'living-checkout-01', type: 'checkout', industry: 'living', title: 'Lamp checkout', brand: 'HEARTH', src: LIVING + 'living-checkout-01.png' },
  { id: 'living-checkout-02', type: 'checkout', industry: 'living', title: 'Linen checkout', brand: 'ATLAS', src: LIVING + 'living-checkout-02.png' },
  { id: 'living-upsell-01', type: 'upsell', industry: 'living', title: 'Finish the corner', brand: 'HEARTH', src: LIVING + 'living-upsell-01.png' },
  { id: 'living-upsell-02', type: 'upsell', industry: 'living', title: 'Matching side table', brand: 'ATLAS', src: LIVING + 'living-upsell-02.png' },
  { id: 'living-downsell-01', type: 'downsell', industry: 'living', title: 'A smaller vessel', brand: 'HEARTH', src: LIVING + 'living-downsell-01.png' },
  { id: 'living-downsell-02', type: 'downsell', industry: 'living', title: 'Start with scent', brand: 'ATLAS', src: LIVING + 'living-downsell-02.png' },
  { id: 'living-thankyou-01', type: 'thankyou', industry: 'living', title: "It's on the way", brand: 'HEARTH', src: LIVING + 'living-thankyou-01.png' },
  { id: 'living-thankyou-02', type: 'thankyou', industry: 'living', title: 'How to settle it in', brand: 'ATLAS', src: LIVING + 'living-thankyou-02.png' },
  { id: 'living-checkout-03', type: 'checkout', industry: 'living', title: 'Lounge chair checkout', brand: 'HEARTH', src: LIVING + 'living-checkout-03.png' },
  { id: 'living-checkout-04', type: 'checkout', industry: 'living', title: 'Stoneware checkout', brand: 'ATLAS', src: LIVING + 'living-checkout-04.png' },
  { id: 'living-checkout-05', type: 'checkout', industry: 'living', title: 'Rug checkout', brand: 'HEARTH', src: LIVING + 'living-checkout-05.png' },
  { id: 'living-upsell-03', type: 'upsell', industry: 'living', title: 'Add the throw', brand: 'HEARTH', src: LIVING + 'living-upsell-03.png' },
  { id: 'living-upsell-04', type: 'upsell', industry: 'living', title: 'Serve it here', brand: 'ATLAS', src: LIVING + 'living-upsell-04.png' },
  { id: 'living-upsell-05', type: 'upsell', industry: 'living', title: 'Light the room', brand: 'HEARTH', src: LIVING + 'living-upsell-05.png' },
  { id: 'living-downsell-03', type: 'downsell', industry: 'living', title: 'A smaller bowl', brand: 'HEARTH', src: LIVING + 'living-downsell-03.png' },
  { id: 'living-downsell-04', type: 'downsell', industry: 'living', title: 'Start with linen', brand: 'ATLAS', src: LIVING + 'living-downsell-04.png' },
  { id: 'living-downsell-05', type: 'downsell', industry: 'living', title: 'Try three notes', brand: 'ATLAS', src: LIVING + 'living-downsell-05.png' },
  { id: 'living-thankyou-03', type: 'thankyou', industry: 'living', title: 'White-glove booked', brand: 'HEARTH', src: LIVING + 'living-thankyou-03.png' },
  { id: 'living-thankyou-04', type: 'thankyou', industry: 'living', title: 'Your pieces are moving', brand: 'ATLAS', src: LIVING + 'living-thankyou-04.png' },
  { id: 'living-thankyou-05', type: 'thankyou', industry: 'living', title: 'How to live with it', brand: 'HEARTH', src: LIVING + 'living-thankyou-05.png' },
  { id: 'food-checkout-01', type: 'checkout', industry: 'food', title: 'House roast checkout', brand: 'KILN', src: FOOD + 'food-checkout-01.png' },
  { id: 'food-checkout-02', type: 'checkout', industry: 'food', title: 'Olive oil checkout', brand: 'COMPOUND', src: FOOD + 'food-checkout-02.png' },
  { id: 'food-upsell-01', type: 'upsell', industry: 'food', title: 'Add the mug', brand: 'KILN', src: FOOD + 'food-upsell-01.png' },
  { id: 'food-upsell-02', type: 'upsell', industry: 'food', title: 'Pair the bread', brand: 'COMPOUND', src: FOOD + 'food-upsell-02.png' },
  { id: 'food-downsell-01', type: 'downsell', industry: 'food', title: 'A smaller bag', brand: 'KILN', src: FOOD + 'food-downsell-01.png' },
  { id: 'food-downsell-02', type: 'downsell', industry: 'food', title: 'Just the oil', brand: 'COMPOUND', src: FOOD + 'food-downsell-02.png' },
  { id: 'food-thankyou-01', type: 'thankyou', industry: 'food', title: 'Brew it tonight', brand: 'KILN', src: FOOD + 'food-thankyou-01.png' },
  { id: 'food-thankyou-02', type: 'thankyou', industry: 'food', title: 'First pour soon', brand: 'COMPOUND', src: FOOD + 'food-thankyou-02.png' },
  { id: 'food-checkout-03', type: 'checkout', industry: 'food', title: 'Pour-over checkout', brand: 'KILN', src: FOOD + 'food-checkout-03.png' },
  { id: 'food-checkout-04', type: 'checkout', industry: 'food', title: 'Honey checkout', brand: 'COMPOUND', src: FOOD + 'food-checkout-04.png' },
  { id: 'food-checkout-05', type: 'checkout', industry: 'food', title: 'Gift set checkout', brand: 'KILN', src: FOOD + 'food-checkout-05.png' },
  { id: 'food-upsell-03', type: 'upsell', industry: 'food', title: 'Add paper filters', brand: 'KILN', src: FOOD + 'food-upsell-03.png' },
  { id: 'food-upsell-04', type: 'upsell', industry: 'food', title: 'Pair the salt', brand: 'COMPOUND', src: FOOD + 'food-upsell-04.png' },
  { id: 'food-upsell-05', type: 'upsell', industry: 'food', title: 'Keep a travel tin', brand: 'KILN', src: FOOD + 'food-upsell-05.png' },
  { id: 'food-downsell-03', type: 'downsell', industry: 'food', title: 'A single pour', brand: 'COMPOUND', src: FOOD + 'food-downsell-03.png' },
  { id: 'food-downsell-04', type: 'downsell', industry: 'food', title: 'Just the beans', brand: 'KILN', src: FOOD + 'food-downsell-04.png' },
  { id: 'food-downsell-05', type: 'downsell', industry: 'food', title: 'Start with honey', brand: 'COMPOUND', src: FOOD + 'food-downsell-05.png' },
  { id: 'food-thankyou-03', type: 'thankyou', industry: 'food', title: 'Your roast is packed', brand: 'KILN', src: FOOD + 'food-thankyou-03.png' },
  { id: 'food-thankyou-04', type: 'thankyou', industry: 'food', title: 'The pantry is moving', brand: 'COMPOUND', src: FOOD + 'food-thankyou-04.png' },
  { id: 'food-thankyou-05', type: 'thankyou', industry: 'food', title: 'How to brew it', brand: 'KILN', src: FOOD + 'food-thankyou-05.png' },
  { id: 'pets-checkout-01', type: 'checkout', industry: 'pets', title: 'Daily kibble checkout', brand: 'GOODWOLF', src: PETS + 'pets-checkout-01.png' },
  { id: 'pets-checkout-02', type: 'checkout', industry: 'pets', title: 'Collar checkout', brand: 'PAWDAY', src: PETS + 'pets-checkout-02.png' },
  { id: 'pets-upsell-01', type: 'upsell', industry: 'pets', title: 'Add the bowl', brand: 'GOODWOLF', src: PETS + 'pets-upsell-01.png' },
  { id: 'pets-upsell-02', type: 'upsell', industry: 'pets', title: 'Extra treats', brand: 'PAWDAY', src: PETS + 'pets-upsell-02.png' },
  { id: 'pets-downsell-01', type: 'downsell', industry: 'pets', title: 'A smaller bag', brand: 'GOODWOLF', src: PETS + 'pets-downsell-01.png' },
  { id: 'pets-downsell-02', type: 'downsell', industry: 'pets', title: 'Starter pouch', brand: 'PAWDAY', src: PETS + 'pets-downsell-02.png' },
  { id: 'pets-thankyou-01', type: 'thankyou', industry: 'pets', title: "They're going to love this", brand: 'GOODWOLF', src: PETS + 'pets-thankyou-01.png' },
  { id: 'pets-thankyou-02', type: 'thankyou', industry: 'pets', title: 'On the way home', brand: 'PAWDAY', src: PETS + 'pets-thankyou-02.png' },
  { id: 'pets-checkout-03', type: 'checkout', industry: 'pets', title: 'Chew checkout', brand: 'GOODWOLF', src: PETS + 'pets-checkout-03.png' },
  { id: 'pets-checkout-04', type: 'checkout', industry: 'pets', title: 'Raincoat checkout', brand: 'PAWDAY', src: PETS + 'pets-checkout-04.png' },
  { id: 'pets-checkout-05', type: 'checkout', industry: 'pets', title: 'Bed checkout', brand: 'GOODWOLF', src: PETS + 'pets-checkout-05.png' },
  { id: 'pets-upsell-03', type: 'upsell', industry: 'pets', title: 'Add a chew', brand: 'GOODWOLF', src: PETS + 'pets-upsell-03.png' },
  { id: 'pets-upsell-04', type: 'upsell', industry: 'pets', title: 'Matching leash', brand: 'PAWDAY', src: PETS + 'pets-upsell-04.png' },
  { id: 'pets-upsell-05', type: 'upsell', industry: 'pets', title: 'Keep them full', brand: 'GOODWOLF', src: PETS + 'pets-upsell-05.png' },
  { id: 'pets-downsell-03', type: 'downsell', industry: 'pets', title: 'A smaller chew', brand: 'PAWDAY', src: PETS + 'pets-downsell-03.png' },
  { id: 'pets-downsell-04', type: 'downsell', industry: 'pets', title: 'Just the treats', brand: 'GOODWOLF', src: PETS + 'pets-downsell-04.png' },
  { id: 'pets-downsell-05', type: 'downsell', industry: 'pets', title: 'Start with a tag', brand: 'PAWDAY', src: PETS + 'pets-downsell-05.png' },
  { id: 'pets-thankyou-03', type: 'thankyou', industry: 'pets', title: 'Packed for them', brand: 'GOODWOLF', src: PETS + 'pets-thankyou-03.png' },
  { id: 'pets-thankyou-04', type: 'thankyou', industry: 'pets', title: 'Treats are coming', brand: 'PAWDAY', src: PETS + 'pets-thankyou-04.png' },
  { id: 'pets-thankyou-05', type: 'thankyou', industry: 'pets', title: 'How to feed', brand: 'GOODWOLF', src: PETS + 'pets-thankyou-05.png' },
  { id: 'baby-checkout-01', type: 'checkout', industry: 'baby', title: 'First onesie checkout', brand: 'NESTLING', src: BABY + 'baby-checkout-01.png' },
  { id: 'baby-checkout-02', type: 'checkout', industry: 'baby', title: 'Rattle checkout', brand: 'LULL', src: BABY + 'baby-checkout-02.png' },
  { id: 'baby-upsell-01', type: 'upsell', industry: 'baby', title: 'Add the wrap', brand: 'NESTLING', src: BABY + 'baby-upsell-01.png' },
  { id: 'baby-upsell-02', type: 'upsell', industry: 'baby', title: 'Matching muslin', brand: 'LULL', src: BABY + 'baby-upsell-02.png' },
  { id: 'baby-downsell-01', type: 'downsell', industry: 'baby', title: 'A smaller set', brand: 'NESTLING', src: BABY + 'baby-downsell-01.png' },
  { id: 'baby-downsell-02', type: 'downsell', industry: 'baby', title: 'Start with one', brand: 'LULL', src: BABY + 'baby-downsell-02.png' },
  { id: 'baby-thankyou-01', type: 'thankyou', industry: 'baby', title: 'Packed with care', brand: 'NESTLING', src: BABY + 'baby-thankyou-01.png' },
  { id: 'baby-thankyou-02', type: 'thankyou', industry: 'baby', title: 'Rest easy', brand: 'LULL', src: BABY + 'baby-thankyou-02.png' },
  { id: 'baby-checkout-03', type: 'checkout', industry: 'baby', title: 'Swaddle checkout', brand: 'NESTLING', src: BABY + 'baby-checkout-03.png' },
  { id: 'baby-checkout-04', type: 'checkout', industry: 'baby', title: 'Bottle checkout', brand: 'LULL', src: BABY + 'baby-checkout-04.png' },
  { id: 'baby-checkout-05', type: 'checkout', industry: 'baby', title: 'Blanket checkout', brand: 'NESTLING', src: BABY + 'baby-checkout-05.png' },
  { id: 'baby-upsell-03', type: 'upsell', industry: 'baby', title: 'Add the hat', brand: 'NESTLING', src: BABY + 'baby-upsell-03.png' },
  { id: 'baby-upsell-04', type: 'upsell', industry: 'baby', title: 'Matching cloth', brand: 'LULL', src: BABY + 'baby-upsell-04.png' },
  { id: 'baby-upsell-05', type: 'upsell', industry: 'baby', title: 'Keep a spare', brand: 'NESTLING', src: BABY + 'baby-upsell-05.png' },
  { id: 'baby-downsell-03', type: 'downsell', industry: 'baby', title: 'A single cloth', brand: 'LULL', src: BABY + 'baby-downsell-03.png' },
  { id: 'baby-downsell-04', type: 'downsell', industry: 'baby', title: 'Just the bib', brand: 'NESTLING', src: BABY + 'baby-downsell-04.png' },
  { id: 'baby-downsell-05', type: 'downsell', industry: 'baby', title: 'Start with lotion', brand: 'LULL', src: BABY + 'baby-downsell-05.png' },
  { id: 'baby-thankyou-03', type: 'thankyou', industry: 'baby', title: 'Softly packed', brand: 'NESTLING', src: BABY + 'baby-thankyou-03.png' },
  { id: 'baby-thankyou-04', type: 'thankyou', industry: 'baby', title: 'On its way', brand: 'LULL', src: BABY + 'baby-thankyou-04.png' },
  { id: 'baby-thankyou-05', type: 'thankyou', industry: 'baby', title: 'How to wash', brand: 'NESTLING', src: BABY + 'baby-thankyou-05.png' },
  { id: 'sport-checkout-01', type: 'checkout', industry: 'sport', title: 'Court runner checkout', brand: 'FIELD', src: SPORT + 'sport-checkout-01.png' },
  { id: 'sport-checkout-02', type: 'checkout', industry: 'sport', title: 'Training kit checkout', brand: 'NORTHLINE', src: SPORT + 'sport-checkout-02.png' },
  { id: 'sport-upsell-01', type: 'upsell', industry: 'sport', title: 'Add socks', brand: 'FIELD', src: SPORT + 'sport-upsell-01.png' },
  { id: 'sport-upsell-02', type: 'upsell', industry: 'sport', title: 'The matching bottle', brand: 'NORTHLINE', src: SPORT + 'sport-upsell-02.png' },
  { id: 'sport-downsell-01', type: 'downsell', industry: 'sport', title: 'A lighter pair', brand: 'FIELD', src: SPORT + 'sport-downsell-01.png' },
  { id: 'sport-downsell-02', type: 'downsell', industry: 'sport', title: 'Just the tee', brand: 'NORTHLINE', src: SPORT + 'sport-downsell-02.png' },
  { id: 'sport-thankyou-01', type: 'thankyou', industry: 'sport', title: 'See you out there', brand: 'FIELD', src: SPORT + 'sport-thankyou-01.png' },
  { id: 'sport-thankyou-02', type: 'thankyou', industry: 'sport', title: 'Break them in', brand: 'NORTHLINE', src: SPORT + 'sport-thankyou-02.png' },
  { id: 'sport-checkout-03', type: 'checkout', industry: 'sport', title: 'Cap checkout', brand: 'FIELD', src: SPORT + 'sport-checkout-03.png' },
  { id: 'sport-checkout-04', type: 'checkout', industry: 'sport', title: 'Band checkout', brand: 'NORTHLINE', src: SPORT + 'sport-checkout-04.png' },
  { id: 'sport-checkout-05', type: 'checkout', industry: 'sport', title: 'Bag checkout', brand: 'FIELD', src: SPORT + 'sport-checkout-05.png' },
  { id: 'sport-upsell-03', type: 'upsell', industry: 'sport', title: 'Add the cap', brand: 'FIELD', src: SPORT + 'sport-upsell-03.png' },
  { id: 'sport-upsell-04', type: 'upsell', industry: 'sport', title: 'Recovery band', brand: 'NORTHLINE', src: SPORT + 'sport-upsell-04.png' },
  { id: 'sport-upsell-05', type: 'upsell', industry: 'sport', title: 'Keep a spare', brand: 'FIELD', src: SPORT + 'sport-upsell-05.png' },
  { id: 'sport-downsell-03', type: 'downsell', industry: 'sport', title: 'A lighter cap', brand: 'NORTHLINE', src: SPORT + 'sport-downsell-03.png' },
  { id: 'sport-downsell-04', type: 'downsell', industry: 'sport', title: 'Just the band', brand: 'FIELD', src: SPORT + 'sport-downsell-04.png' },
  { id: 'sport-downsell-05', type: 'downsell', industry: 'sport', title: 'Start with socks', brand: 'NORTHLINE', src: SPORT + 'sport-downsell-05.png' },
  { id: 'sport-thankyou-03', type: 'thankyou', industry: 'sport', title: 'Laced and packed', brand: 'FIELD', src: SPORT + 'sport-thankyou-03.png' },
  { id: 'sport-thankyou-04', type: 'thankyou', industry: 'sport', title: 'The kit is moving', brand: 'NORTHLINE', src: SPORT + 'sport-thankyou-04.png' },
  { id: 'sport-thankyou-05', type: 'thankyou', industry: 'sport', title: 'How to train', brand: 'FIELD', src: SPORT + 'sport-thankyou-05.png' },
];
const LOOKBOOK_TEASER_IDS = [
  'fashion-checkout-03',
  'beauty-checkout-3',
  'beauty-editorial',
  'wellness-checkout-1',
  'fashion-upsell-02',
  'beauty-upsell-2',
  'fashion-downsell-05',
  'beauty-thankyou-1',
];

function lookbookSrc(page) {
  return String(page.src || '').replace(/\.png$/i, '.webp') + '?' + LOOKBOOK_ASSET;
}

function lookbookTypeLabel(type) {
  const found = LOOKBOOK_TYPES.filter(function (item) { return item.key === type; })[0];
  return found ? found.label : type;
}

function lookbookFilterKeys(items) {
  return items.map(function (item) { return item.key; }).filter(function (key) { return key !== 'all'; });
}

function interleaveLookbookPages(pages) {
  const industries = lookbookFilterKeys(LOOKBOOK_INDUSTRIES);
  const types = lookbookFilterKeys(LOOKBOOK_TYPES);
  const buckets = {};
  pages.forEach(function (page) {
    const key = page.industry + ':' + page.type;
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(page);
  });
  const result = [];
  let remaining = pages.length;
  let wave = 0;
  while (remaining > 0 && wave < pages.length + types.length) {
    let took = false;
    industries.forEach(function (industry, index) {
      if (!remaining) return;
      const start = (wave + index) % types.length;
      for (let step = 0; step < types.length; step += 1) {
        const bucket = buckets[industry + ':' + types[(start + step) % types.length]];
        if (bucket && bucket.length) {
          result.push(bucket.shift());
          remaining -= 1;
          took = true;
          break;
        }
      }
    });
    if (!took) break;
    wave += 1;
  }
  return result;
}

function lookbookHref(params) {
  const next = params || {};
  const query = new URLSearchParams();
  if (next.type && next.type !== 'all') query.set('type', next.type);
  if (next.industry && next.industry !== 'all') query.set('industry', next.industry);
  if (next.preview) query.set('preview', next.preview);
  const qs = query.toString();
  return '#/lookbook' + (qs ? '?' + qs : '');
}

function lookbookCard(page, href) {
  return '<a class="fable-look-card" href="' + href + '">' +
    '<span class="fable-look-visual"><img src="' + lookbookSrc(page) + '" alt="" loading="lazy" decoding="async"/></span>' +
    '<span class="fable-look-meta"><em>' + lookbookTypeLabel(page.type) + '</em><strong>' + page.title + '</strong><small>' + page.brand + '</small></span>' +
    '</a>';
}

function renderLookbookTeaser() {
  const cards = LOOKBOOK_TEASER_IDS.map(function (id) {
    const page = LOOKBOOK_PAGES.filter(function (item) { return item.id === id; })[0];
    return page ? lookbookCard(page, lookbookHref({ preview: page.id })) : '';
  }).join('');
  return '<section class="fable-section fable-lookbook-teaser" id="lookbook-teaser">' +
    '<div class="fable-container">' +
    '<div class="fable-lookbook-intro"><p class="fable-lookbook-kicker">Lookbook</p>' +
    '<h2 class="fable-section-title">Shopify checkout, 1:1.<br/>Then every checkout beyond it.</h2>' +
    '<p class="fable-lookbook-lead">Reproduce the familiar Shopify checkout exactly, then switch to branded, one-page, wallet-first, or editorial flows. Upsell, Downsell, and Thank you across beauty, fashion, jewelry, living, wellness — plus food, pets, baby, and sport.</p></div>' +
    '<div class="fable-look-grid fable-look-grid--teaser">' + cards + '</div>' +
    '<div class="fable-lookbook-more"><a class="fable-button fable-button--outline" href="#/lookbook">Open the lookbook ' + icon('arrow', 16) + '</a></div>' +
    '</div></section>';
}

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
          <section class="fable-preview-funnel"><header><strong>Checkout funnel</strong><em>Live</em></header><div class="fable-funnel-line"><i></i><i></i><i></i><i></i></div><div class="fable-funnel-labels"><span><b>Pay</b>Checkout</span><span><b>Yes</b>Upsell</span><span><b>No</b>Downsell</span><span><b>Done</b>Thank you</span></div></section>
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

function renderHeroPoints() {
  return '<ul class="fable-hero-points">' + heroPoints.map(function (point) {
    return '<li>' + icon('check', 14) + '<span>' + point + '</span></li>';
  }).join('') + '</ul>';
}

function renderHighlights() {
  return '<section class="fable-section fable-highlights" id="highlights">' +
    '<div class="fable-container">' +
    '<div class="fable-lookbook-intro"><p class="fable-lookbook-kicker">Highlights</p>' +
    '<h2 class="fable-section-title">More checkout control.<br/>Lower Shopify fees.</h2>' +
    '<p class="fable-lookbook-lead">Two limits of native Shopify checkout, lifted — without upgrading your plan.</p></div>' +
    '<div class="fable-highlights-grid">' + highlights.map(function (item) {
      return '<article>' + cardIcon(item.iconName) + '<strong>' + item.figure + '</strong><h3>' + item.title + '</h3><p>' + item.description + '</p></article>';
    }).join('') + '</div></div></section>';
}

function lookbookPage(id) {
  return LOOKBOOK_PAGES.filter(function (item) { return item.id === id; })[0] || null;
}

function funnelNode(page, kindLabel, note, extraClass) {
  if (!page) return '';
  return '<article class="fable-funnel-node' + (extraClass ? ' ' + extraClass : '') + '">' +
    '<span class="fable-funnel-node-visual"><img src="' + lookbookSrc(page) + '" alt="" loading="lazy" decoding="async"/></span>' +
    '<span class="fable-funnel-node-meta"><em>' + kindLabel + '</em><strong>' + page.title + '</strong><small>' + page.brand + '</small>' +
    (note ? '<b>' + note + '</b>' : '') +
    '</span></article>';
}

function renderFunnelShowcase() {
  const checkoutA = lookbookPage('living-checkout-02');
  const checkoutB = lookbookPage('beauty-checkout-3');
  const checkoutC = lookbookPage('jewelry-checkout-02');
  const upsell = lookbookPage('fashion-upsell-02');
  const downsell = lookbookPage('fashion-downsell-05');
  const thankyou = lookbookPage('beauty-thankyou-1');
  return '<section class="fable-section fable-funnel" id="funnels">' +
    '<div class="fable-funnel-glow" aria-hidden="true"></div>' +
    '<div class="fable-container">' +
    '<div class="fable-lookbook-intro"><p class="fable-lookbook-kicker">Checkout flows</p>' +
    '<h2 class="fable-section-title">Shopify stops at pay.<br/>Your funnel keeps selling.</h2>' +
    '<p class="fable-lookbook-lead">Split traffic across more than one checkout, then connect Upsell, Downsell, and Thank you. Unmatched carts stay on Shopify Checkout.</p></div>' +
    '<div class="fable-funnel-canvas" aria-label="BestCheckout checkout funnel">' +
    '<div class="fable-funnel-stage"><div class="fable-funnel-entry"><span>' + icon('store', 16) + '</span><span><strong>Shopify cart</strong><small>Split across checkouts Shopify cannot run</small></span></div></div>' +
    '<div class="fable-funnel-rail" aria-hidden="true"></div>' +
    '<div class="fable-funnel-branch fable-funnel-branch--split" aria-hidden="true"><span>50%</span><span>30%</span><span>20%</span></div>' +
    '<div class="fable-funnel-stage fable-funnel-stage--checkouts">' +
      funnelNode(checkoutA, 'Checkout A', '50% traffic', 'fable-funnel-node--stack') +
      funnelNode(checkoutB, 'Checkout B', '30% traffic', 'fable-funnel-node--stack') +
      funnelNode(checkoutC, 'Checkout C', '20% traffic', 'fable-funnel-node--stack') +
    '</div>' +
    '<div class="fable-funnel-rail" aria-hidden="true"></div>' +
    '<div class="fable-funnel-branch" aria-hidden="true"><span>Accepts</span><span>Declines</span></div>' +
    '<div class="fable-funnel-stage fable-funnel-stage--offers">' + funnelNode(upsell, 'Upsell', '1-click add') + funnelNode(downsell, 'Downsell', 'A smaller yes') + '</div>' +
    '<div class="fable-funnel-rail" aria-hidden="true"></div>' +
    '<div class="fable-funnel-stage">' + funnelNode(thankyou, 'Thank you', 'Writes back to Shopify') + '</div>' +
    '</div>' +
    '<div class="fable-value-grid fable-funnel-points">' +
    '<article>' + cardIcon('flow') + '<h3>More than one Checkout</h3><p>Split traffic across more than one checkout, then connect Upsell, Downsell, and Thank you. Unmatched carts stay on Shopify Checkout.</p></article>' +
    '<article>' + cardIcon('sparkles') + '<h3>Offers after payment</h3><p>One-click Upsell when they say yes. A lighter Downsell when they say no. No extra card entry.</p></article>' +
    '<article>' + cardIcon('shield') + '<h3>Shopify stays the fallback</h3><p>Unmatched carts keep native Shopify Checkout. You never strand a buyer.</p></article>' +
    '</div></div></section>';
}

function marketingNavLinks(active) {
  const lookbook = active === 'lookbook' ? ' aria-current="page"' : '';
  return '<a href="#/landing" data-landing-section="home">Home</a><a href="#/landing?section=funnels" data-landing-section="funnels">Funnels</a><a href="#/lookbook"' + lookbook + '>Lookbook</a><a href="#/landing?section=results" data-landing-section="results">Product</a><a href="#/landing?section=how-it-works" data-landing-section="how-it-works">How it works</a><a href="help/">Help Center</a><a href="help/#guide=connect-shopify">Connect guide</a>';
}

function marketingPrimaryButton(ctas, extraClass, withArrow) {
  return `<a class="fable-button${extraClass ? ' ' + extraClass : ''}" href="${ctas.primaryHref}">${ctas.primaryLabel}${withArrow ? ' ' + icon('arrow', 16) : ''}</a>`;
}

function renderMarketingFrame(session, options) {
  const ctas = marketingCtas(session);
  const active = options && options.active ? options.active : 'landing';
  const menuOpen = Boolean(session && session.marketingMenuOpen);
  const guestActions = ctas.authenticated
    ? `<button type="button" class="fable-sign-out" data-action="portal-signout">Sign out</button>${marketingPrimaryButton(ctas, 'fable-button--small', false)}`
    : `<a class="fable-sign-in" href="#/sign-in">Sign in</a>${marketingPrimaryButton(ctas, 'fable-button--small', false)}`;
  const mobileAccount = ctas.authenticated
    ? `<button type="button" class="fable-sign-out" data-action="portal-signout">Sign out</button>`
    : `<a class="fable-sign-in" href="#/sign-in">Sign in</a>`;
  const links = marketingNavLinks(active);
  return `
    <div class="fable-site${menuOpen ? ' is-menu-open' : ''}${active === 'lookbook' ? ' is-lookbook' : ''}">
      <header class="fable-nav${menuOpen ? ' is-open' : ''}">
        <nav aria-label="Primary">
          <a class="fable-brand" href="#/landing" data-landing-section="home" aria-label="BestCheckout home"><img class="fable-brand-mark" src="${brandMark}" alt="" aria-hidden="true"/><span>BestCheckout</span></a>
          <div class="fable-nav-links">
            ${links}
          </div>
          <div class="fable-nav-actions">${guestActions}<button type="button" class="fable-menu-toggle" data-action="toggle-marketing-menu" aria-expanded="${menuOpen}" aria-controls="fable-mobile-menu" aria-label="${menuOpen ? 'Close menu' : 'Open menu'}">${icon(menuOpen ? 'close' : 'menu', 20)}</button></div>
        </nav>
      </header>
      <div class="fable-mobile-menu" id="fable-mobile-menu" ${menuOpen ? '' : 'hidden'}>
        ${links}
        ${mobileAccount}
      </div>
      ${options && options.main ? options.main : ''}
      <footer class="fable-footer"><div class="fable-container fable-footer-main"><section class="fable-footer-brand"><strong><img class="fable-footer-brand-mark" src="${brandMark}" alt="" aria-hidden="true"/><span>BestCheckout</span></strong><p>Conversion infrastructure for Shopify brands.</p><div class="fable-trust-badges" aria-label="Trust and compliance badges">${footerTrustBadges.map(renderFooterTrustBadge).join('')}</div></section><nav>${links}<a href="${ctas.footerHref}">${ctas.footerLabel}</a></nav></div><div class="fable-container fable-footer-bottom"><small>© 2026 BestCheckout. All rights reserved.</small><section class="fable-payment-methods" aria-label="Supported payment methods"><span class="fable-footer-label">Supported payment methods</span><img class="fable-payment-logo" src="${footerPaymentLogo}" alt="American Express, Visa, Mastercard, UnionPay, PayPal, JCB, Discover, and Klarna" loading="lazy" decoding="async"/></section></div></footer>
    </div>`;
}

export function renderMarketingSite(session) {
  const ctas = marketingCtas(session);
  return renderMarketingFrame(session, {
    active: 'landing',
    main: `<main>
        <section class="fable-hero" id="product">
          <div class="fable-hero-aurora" aria-hidden="true"></div><div class="fable-hero-stars" aria-hidden="true"></div><div class="fable-hero-grid" aria-hidden="true"></div>
          <div class="fable-container fable-hero-layout">
            <div class="fable-hero-copy">
              <span class="fable-eyebrow">${icon('sparkles', 14)} Conversion infrastructure for Shopify</span>
              <h1>Make every checkout<br/><span>feel inevitable.</span></h1>
              <p>Design the path from cart to paid order, launch offers with confidence, and keep your Shopify operations in sync.</p>
              ${renderHeroPoints()}
              <div class="fable-hero-actions">${marketingPrimaryButton(ctas, '', true)}<a class="fable-button fable-button--outline" href="#/landing?section=results" data-landing-section="results">Explore the product</a></div>
            </div>
            ${workspacePreview()}
          </div>
        </section>
        <section class="fable-outcomes" aria-label="BestCheckout merchant outcomes"><div class="fable-container fable-outcomes-grid">${outcomes.map((item) => `<article><strong data-fable-counter data-fable-counter-target="${item.target}" data-fable-counter-decimals="${item.decimals}" data-fable-counter-prefix="${item.prefix}"><span data-fable-counter-value>${item.value}</span><em>${item.suffix}</em></strong><p>${item.label}</p></article>`).join('')}</div></section>
        ${renderHighlights()}
        <section class="fable-section fable-capabilities" id="capabilities"><div class="fable-capability-glow" aria-hidden="true"></div><div class="fable-container"><div class="fable-capability-grid">${capabilities.map((item) => `<article><header>${cardIcon(item.iconName)}<b>${item.step}</b></header><h2>${item.title}</h2><p>${item.description}</p><div>${item.features.map((feature) => `<span>${feature}</span>`).join('')}</div></article>`).join('')}</div></div></section>
        ${renderFunnelShowcase()}
        ${renderLookbookTeaser()}
        <section class="fable-section" id="results"><div class="fable-container"><h2 class="fable-section-title">One focused workspace.<br/>Every conversion lever.</h2><div class="fable-value-grid"><article>${cardIcon('pages')}<h3>A checkout that looks like your brand</h3><p>Control every detail of the purchase experience. Match your brand voice, deploy custom workflows, and remove friction from the buyer journey.</p></article><article>${cardIcon('flow')}<h3>A funnel Shopify checkout cannot run</h3><p>Run two or three Checkouts in one funnel — Shopify gives you one. Then Upsell, Downsell, and Thank you, with native Checkout as fallback.</p></article><article>${cardIcon('card')}<h3>Payments that keep up</h3><p>Every completed transaction writes back to Shopify automatically. Order fulfillment, inventory updates, and customer records stay in perfect sync with your store.</p></article></div></div></section>
        <section class="fable-section" id="how-it-works"><div class="fable-container"><h2 class="fable-section-title">How it works</h2><ol class="fable-process"><li><b>01</b><h3>Connect your Shopify store</h3><p>Authorize once and your store's products, orders, and inventory are immediately available.</p></li><li><b>02</b><h3>Build the checkout funnel</h3><p>Split traffic across more than one Checkout, then connect Upsell, Downsell, and Thank you. Preview the path before you go live.</p></li><li><b>03</b><h3>Launch with confidence</h3><p>Go live in minutes. Merchants connect their own Shopify app and retain full ownership of their store data and payment accounts.</p></li></ol></div></section>
        <section class="fable-section fable-testimonials"><div class="fable-container"><h2 class="fable-section-title">Built for operators who<br/>move fast and measure everything.</h2><div class="fable-testimonial-grid">${testimonials.map((item) => `<article><div class="fable-stars" aria-label="Rated 5 out of 5 stars">★★★★★</div><blockquote>“${item.quote}”</blockquote><span class="fable-metric">${item.metric}</span><footer><img class="fable-avatar" src="${item.avatar}" alt="" width="40" height="40" loading="lazy" decoding="async"/><span><b>${item.name}</b><small>${item.role}</small></span></footer></article>`).join('')}</div></div></section>
        <section class="fable-section"><div class="fable-container"><h2 class="fable-section-title">Your store. Your payment accounts.<br/>Your data.</h2><div class="fable-trust-grid"><article>${cardIcon('shield')}<h3>Merchant-owned access</h3><p>You connect your own Shopify app; BestCheckout never holds your credentials.</p></article><article>${cardIcon('orders')}<h3>Shopify order sync</h3><p>Every completed checkout writes back to Shopify automatically.</p></article><article>${cardIcon('analytics')}<h3>Clear performance data</h3><p>Conversion rates, AOV, and recovery stats visible from day one.</p></article></div></div></section>
        <section class="fable-section fable-final"><div class="fable-container"><div><h2 class="fable-section-title">Make the checkout your<br/>strongest sales page.</h2>${marketingPrimaryButton(ctas, '', true)}</div></div></section>
      </main>`,
  });
}

export function renderLookbookSite(session, query) {
  const ctas = marketingCtas(session);
  const type = (query && query.get('type')) || 'all';
  const industry = (query && query.get('industry')) || 'all';
  const previewId = query && query.get('preview');
  const filtered = LOOKBOOK_PAGES.filter(function (page) {
    return (type === 'all' || page.type === type) && (industry === 'all' || page.industry === industry);
  });
  const pages = industry === 'all' ? interleaveLookbookPages(filtered) : filtered;
  const preview = previewId ? LOOKBOOK_PAGES.filter(function (page) { return page.id === previewId; })[0] : null;
  const typeFilters = LOOKBOOK_TYPES.map(function (item) {
    return '<a class="fable-look-filter' + (item.key === type ? ' is-on' : '') + '" href="' + lookbookHref({ type: item.key, industry: industry }) + '">' + item.label + '</a>';
  }).join('');
  const industryFilters = LOOKBOOK_INDUSTRIES.map(function (item) {
    return '<a class="fable-look-filter' + (item.key === industry ? ' is-on' : '') + '" href="' + lookbookHref({ type: type, industry: item.key }) + '">' + item.label + '</a>';
  }).join('');
  const cards = pages.map(function (page) {
    return lookbookCard(page, lookbookHref({ type: type, industry: industry, preview: page.id }));
  }).join('');
  const closeHref = lookbookHref({ type: type, industry: industry });
  const lightbox = preview
    ? '<div class="fable-look-lightbox"><a class="fable-look-lightbox-back" href="' + closeHref + '" aria-label="Close preview"></a><figure><a class="fable-look-lightbox-x" href="' + closeHref + '" aria-label="Close">' + icon('close', 18) + '</a><img src="' + lookbookSrc(preview) + '" alt=""/><figcaption><em>' + lookbookTypeLabel(preview.type) + '</em><strong>' + preview.title + '</strong><small>' + preview.brand + '</small></figcaption><a class="fable-look-lightbox-close" href="' + closeHref + '">Close</a></figure></div>'
    : '';
  return renderMarketingFrame(session, {
    active: 'lookbook',
    main: `<main class="fable-lookbook-page">
        <section class="fable-lookbook-hero">
          <div class="fable-container">
            <p class="fable-lookbook-kicker">Lookbook</p>
            <h1>Shopify checkout, 1:1.<br/>Then every checkout beyond it.</h1>
            <p>Start from a familiar Shopify checkout, reproduced exactly. Then open branded, one-page, wallet-first, and editorial versions — plus Upsell, Downsell, and Thank you across beauty, fashion, jewelry, living, wellness, food, pets, baby, and sport.</p>
          </div>
        </section>
        <section class="fable-section fable-lookbook-gallery">
          <div class="fable-container">
            <div class="fable-look-filters" role="navigation" aria-label="Lookbook filters">
              <div>${typeFilters}</div>
              <div>${industryFilters}</div>
            </div>
            <div class="fable-look-grid">${cards || '<p class="fable-look-empty">No pages in this view.</p>'}</div>
            <div class="fable-lookbook-more">${marketingPrimaryButton(ctas, '', true)}</div>
          </div>
        </section>
        ${lightbox}
      </main>`,
  });
}
