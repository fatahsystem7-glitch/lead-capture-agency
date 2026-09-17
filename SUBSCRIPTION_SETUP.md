# $49/mo Subscription Setup — Turn Hunter Into SaaS

You want $49/mo — perfect price. Here's how to add paywall + checkout to your live tool (works on GitHub Pages, no backend needed).

## Option 1: Systeme.io Checkout (Easiest — You Already Use It)

**Why Systeme.io:** You already plugged hunter into it, it handles subscriptions, failed payments, emails, membership access — all in one.

**Steps (10 mins):**

1. **Systeme.io → Funnels → Create Funnel**
   - Name: LeadHunter Pro $49/mo
   - Goal: Sell a product
   - Template: Any sales page

2. **Step 1: Sales Page**
   - Headline: "Find 30 Warm Leads/Week on Reddit & Q&A — $49/mo"
   - Add your GitHub Pages as demo: `<iframe src="https://fatahsystem7-glitch.github.io/lead-capture-agency/" width="100%" height="600"></iframe>` (blurred or limited to 3 leads)
   - CTA: "Get Access for $49/mo"

3. **Step 2: Checkout Page**
   - Systeme.io → Products → Create Product → Name: LeadHunter Pro → Price: $49/mo subscription
   - Connect Stripe/PayPal in Systeme.io → Settings → Payment Gateways
   - Add product to checkout page

4. **Step 3: Thank You / Membership Access**
   - Systeme.io → Memberships → Create Membership Area: "LeadHunter Pro"
   - Add page with full tool iframe: `<iframe src="https://fatahsystem7-glitch.github.io/lead-capture-agency/?access=pro" width="100%" height="900"></iframe>`
   - In Funnel → After purchase → Action: Grant membership access + Tag: `paid-pro`

5. **Workflow:**
   - Trigger: Tag `paid-pro` added → Action: Send email with access link: `https://fatahsystem7-glitch.github.io/lead-capture-agency/?access=pro&email={{email}}`

**Done!** People pay $49/mo in Systeme.io → Get access to full hunter.

---

## Option 2: Stripe Payment Links (Fastest, No Systeme.io Needed)

**Steps (5 mins):**

1. **Stripe Dashboard → Products → Create Product**
   - Name: LeadHunter Pro
   - Price: $49/mo recurring
   - Create → Copy **Payment Link** (looks like `https://buy.stripe.com/xxx`)

2. **Add Payment Link to Hunter:**
   - In `index.html`, find `STRIPE_PAYMENT_LINK` → Paste your link
   - Tool will show paywall modal with "Subscribe $49/mo" button → Links to Stripe Checkout
   - After payment, Stripe → Settings → Payment Links → After payment → Redirect to: `https://fatahsystem7-glitch.github.io/lead-capture-agency/?paid=1`

3. **Simple Access Check:**
   - Tool checks `?paid=1` or `localStorage.getItem('leadhunter_pro') === 'true'`
   - After Stripe payment, user lands on tool with `?paid=1` → Tool unlocks and saves pro status
   - For extra security, send email with license key via Stripe webhook → Zapier → Email

**Stripe Webhook (optional, more secure):**
- Stripe → Webhooks → Add endpoint: `https://hooks.zapier.com/...` → Event: `checkout.session.completed`
- Zapier → Trigger: Stripe → Action: Send email with access link + license key
- User enters license key in hunter to unlock

---

## What I Just Built For You

I updated your live hunter at https://fatahsystem7-glitch.github.io/lead-capture-agency/ with:

- **$49/mo Paywall Modal** — Shows after 3 free hunts or 5 saved leads
- **Pricing Banner:** $49/mo Pro vs Free
- **Checkout Buttons:** Stripe + Systeme.io (you just paste your links)
- **Access Control:** Checks `?access=pro`, `?paid=1`, or localStorage `leadhunter_pro`
- **Free Tier:** 3 hunts, 5 saved leads, 1 export — enough to see value, then paywall
- **Pro Unlocks:** Unlimited hunts, 12 APIs, unlimited saves, Systeme.io push, CSV export

**Config at top of index.html:**
```javascript
const SUBSCRIPTION_CONFIG = {
  price: 49,
  stripePaymentLink: "", // Paste your Stripe payment link here
  systemeIoLink: "", // Paste your Systeme.io checkout link here
  freeHunts: 3,
  freeSaves: 5
}
```

---

## Business Math for $49/mo SaaS

**Goal: $5k MRR = 102 customers @ $49/mo**

**Month 1:**
- Hunt for YOUR customers using your own tool: Find 20 agency owners/week asking for leads
- Offer: "I built tool that finds warm leads on Reddit — $49/mo, 7-day free trial, cancel anytime"
- Close 10 customers = $490 MRR

**Month 2:**
- 10 customers → referrals + Indie Hackers post + Product Hunt launch
- Close 20 more = 30 total = $1470 MRR

**Month 3:**
- Add YouTube + Twitter APIs (more value) → Raise to $69/mo for new users, keep $49 for early
- Close 30 more = 60 total = $2940 MRR

**Month 6:**
- 100 customers = $4900 MRR = $58k/year small business, solo, $0 hosting cost

**Churn control:** Your tool saves leads + pushes to Systeme.io — sticky, people keep paying because they get leads weekly.

---

## How to Set Your Payment Links Now

1. **Create Stripe Payment Link:**
   - https://dashboard.stripe.com/products → Create $49/mo → Copy link → Paste in `index.html` → Push

2. **Or Create Systeme.io Checkout:**
   - Systeme.io → Funnels → Create $49/mo product → Copy checkout URL → Paste in `index.html`

3. **Push update:**
   ```bash
   git add index.html
   git commit -m "feat: add $49/mo paywall with Stripe + Systeme.io checkout"
   git push
   ```

4. **Test:** Open hunter in incognito → Do 3 hunts → Paywall appears → Click Subscribe → Should go to your Stripe/Systeme.io checkout

Want me to add Stripe link for you? Just create product in Stripe and paste the payment link here, I'll wire it up and push.
