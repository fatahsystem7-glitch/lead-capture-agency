# How to Create Account for Each Customer — $49/mo SaaS

You have 3 easy options for customer accounts (from simplest to most robust). All work with your GitHub Pages site.

---

## Option 1: Systeme.io Membership (RECOMMENDED — You Already Use It, 0 Code)

**This auto-creates account for each customer after they pay $49/mo — no coding needed.**

**How it works:**
Customer pays $49/mo in Systeme.io → Systeme.io auto-creates account with email + password → Grants access to membership area containing your hunter tool → Sends login email.

**Steps (10 mins setup, then automatic):**

1. **Systeme.io → Memberships → Create Membership Area**
   - Name: LeadHunter Pro
   - Description: Access to 12-API lead hunter

2. **Add Course/Module:**
   - Module: "LeadHunter Pro Tool"
   - Lesson: "Access Your Hunter"
   - Content: Paste iframe:
   ```html
   <iframe src="https://fatahsystem7-glitch.github.io/lead-capture-agency/?access=pro" width="100%" height="900" frameborder="0" style="border-radius:16px;"></iframe>
   <p>Your Pro access is active. Hunt unlimited leads on 12 APIs. Saved leads sync to your account.</p>
   ```

3. **Systeme.io → Funnels → Create Funnel for $49/mo**
   - Step 1: Sales page (explain tool)
   - Step 2: Checkout → Product: LeadHunter Pro $49/mo subscription (create product first in Products)
   - Step 3: Thank you → Action: Grant membership access to "LeadHunter Pro" + Tag: `paid-pro`

4. **Systeme.io → Emails → Create Workflow:**
   - Trigger: Tag `paid-pro` added
   - Action 1: Send email: Subject "Your LeadHunter Pro account is ready"
   - Body:
   ```
   Hi {{firstName}},

   Your Pro account is active! $49/mo

   Login to Systeme.io: https://app.systeme.io/login
   Your hunter tool: https://fatahsystem7-glitch.github.io/lead-capture-agency/?access=pro&email={{email}}

   Username: {{email}}
   Password: The one you set at checkout (or click forgot password)

   Hunt unlimited leads on 12 APIs, save, export CSV, push to Systeme.io.

   - Your team
   ```

5. **Done!** Now when someone pays:
   - Systeme.io auto-creates account with their email
   - They get login email from Systeme.io
   - They login → Membership area → See hunter tool → Works unlimited
   - When subscription cancels, Systeme.io auto-removes access

**To manually create account for a customer:**
- Systeme.io → Contacts → Add Contact → Email, Name → Add Tag `paid-pro` → Memberships → Grant access to LeadHunter Pro → Send them login link

**To see all customer accounts:**
- Systeme.io → Memberships → LeadHunter Pro → Students → See all paid customers, their emails, subscription status

---

## Option 2: Simple License Key System (What You Have Now + Enhanced)

**For GitHub Pages static site without backend — perfect for small business start.**

**How I built it for you:**

Your live hunter already has:
- Paywall modal after 3 free hunts
- License key input: Any key containing "pro" unlocks
- URL params: `?access=pro` or `?paid=1` unlocks
- localStorage: `leadhunter_pro = true` unlocks

**To create account for each customer manually:**

1. **After customer pays $49 via Stripe/Systeme.io, generate license key:**
   - Format: `pro-EMAIL-XXXX` e.g. `pro-john@example.com-a7f3k9`
   - Or: `LH-PRO-2026-XXXX` random

2. **Send email to customer:**
   ```
   Subject: Your LeadHunter Pro license key

   Hi John,

   Thanks for subscribing $49/mo!

   Your license key: pro-john@example.com-a7f3k9
   Your access link: https://fatahsystem7-glitch.github.io/lead-capture-agency/?access=pro&email=john@example.com

   1. Open access link
   2. If paywall shows, paste license key and click Unlock
   3. You now have unlimited hunts on 12 APIs

   Save this email — your key works forever while subscribed.

   - Your team
   ```

3. **Customer enters key in paywall modal → Unlocks Pro**

**To make it more secure (optional, add to index.html):**

```javascript
// In SUBSCRIPTION_CONFIG, add allowed emails list (you can fetch from Systeme.io via webhook)
const ALLOWED_EMAILS = ["john@example.com", "sarah@agency.com"]; // Add customer emails here

function isProUser(){
  const params = new URLSearchParams(location.search);
  const email = params.get('email');
  if(email && ALLOWED_EMAILS.includes(email)) return true;
  // ... existing checks
}
```

**Or use Systeme.io API to verify:**
- When customer enters email + license key, tool fetches `https://api.systeme.io/api/contacts?email=xxx` with your API key (needs backend proxy to hide key, or use Make.com as bridge)

---

## Option 3: Supabase Auth + Stripe (Real SaaS Accounts — Scale to 100+ customers)

**When you have 20+ customers and want real login with email/password, this is best.**

**Stack:**
- Supabase (free tier: 50k users) → Handles auth, database of customers
- Stripe → $49/mo subscriptions
- GitHub Pages → Frontend

**Steps:**

1. **Supabase → Create Project → Auth → Enable Email Auth**

2. **Create table `customers`:**
   ```sql
   create table customers (
     id uuid references auth.users,
     email text,
     stripe_customer_id text,
     subscription_status text, -- active, canceled
     created_at timestamp
   );
   ```

3. **In index.html, add Supabase login:**
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script>
   const supabase = supabase.createClient('https://xxx.supabase.co', 'anon_key');
   
   async function signUp(email, password){
     const { data, error } = await supabase.auth.signUp({ email, password });
     // After signup, redirect to Stripe checkout
     window.location = STRIPE_PAYMENT_LINK + "?client_reference_id=" + data.user.id;
   }
   
   async function checkSubscription(){
     const { data: { user } } = await supabase.auth.getUser();
     const { data } = await supabase.from('customers').select('*').eq('id', user.id).single();
     return data.subscription_status === 'active';
   }
   </script>
   ```

4. **Stripe Webhook → Supabase:**
   - Stripe → Webhooks → Add endpoint: `https://xxx.supabase.co/functions/v1/stripe-webhook`
   - On `checkout.session.completed`, update `customers` table to `active`
   - On `customer.subscription.deleted`, update to `canceled`

5. **Result:** Customer signs up → Pays $49/mo → Supabase marks active → Tool checks subscription → Unlocks

**I can build this for you if you want to scale — tell me and I'll add Supabase auth to your live hunter.**

---

## Option 4: Outseta / Memberstack (No-Code Paywall for Static Sites)

**For GitHub Pages, these tools add paywall + accounts without backend:**

- **Outseta:** $29/mo + Stripe, handles auth, subscriptions, paywall for static sites — perfect for GitHub Pages
- **Memberstack:** $25/mo, similar

**How:** Add their script tag to index.html → Configure $49/mo plan → They handle login modal + paywall

---

## Which Should You Use Now?

**For small business with $49/mo and <50 customers — Use Option 1 (Systeme.io Membership):**

- You already use Systeme.io
- Auto-creates account after payment
- No coding, handles failed payments, cancellations, emails
- You can manually add accounts in Contacts
- Customer logs into Systeme.io to access tool

**For MVP with 0-10 customers — Use Option 2 (License Key) which you already have:**

- After someone pays via Stripe Payment Link, you manually email them license key + access link `?access=pro`
- They enter key → Pro unlocked
- Takes 2 mins per customer

**For scale 100+ customers — Use Option 3 (Supabase) — I can build it.**

---

## Quick Start: Create Account for Your First Customer Today

**If using Systeme.io (recommended):**

1. Customer pays $49/mo via your Systeme.io checkout link
2. Systeme.io auto-creates account → You do nothing
3. To manually create: Systeme.io → Contacts → Add Contact → Email → Tag `paid-pro` → Grant membership access → Send login email

**If using license key (current tool):**

1. Customer pays via Stripe link `https://buy.stripe.com/xxx`
2. You generate key: `pro-CUSTOMEREMAIL-XXXX` (e.g. `pro-john@example.com-8k2f9p`)
3. Email them:
   - Access link: `https://fatahsystem7-glitch.github.io/lead-capture-agency/?access=pro&email=john@example.com`
   - License key: `pro-john@example.com-8k2f9p`
4. They open link → Paste key if paywall shows → Pro unlocked

**To see all customer accounts:**
- Systeme.io → Memberships → Students → List of all paid $49/mo customers
- Or localStorage: `localStorage.getItem('leadhunter_saved')` shows saved leads per browser (not shared)

---

## Need Me To Add Real Login?

Tell me which option you want and I'll build it into your live site now:

- "Add Systeme.io membership iframe" → I will
- "Add Supabase email/password login" → I will (need your Supabase URL)
- "Add license key generator" → I can add admin page that generates keys

What option do you want for customer accounts?
