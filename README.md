# LeadPulse — Agency OS Landing Page

> **Stop losing leads. Start closing on autopilot.**

A complete, single-page agency landing page inspired by modern lead-generation and automation platforms (Leadverse / GoHighLevel style). Built as a high-converting CRO-focused static site ready for GitHub Pages.

![LeadPulse Preview](https://img.shields.io/badge/Stack-HTML%20%7C%20Tailwind%20%7C%20Vanilla%20JS-black?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%7C%20Tablet%20%7C%20Desktop-8B5CF6?style=for-the-badge)
![Dark Mode](https://img.shields.io/badge/Theme-Dark%20Mode%20Aesthetic-0A0A0B?style=for-the-badge)

### ✨ Features Included

**Structure & CRO Sections:**
- **Header / Navigation** — Sticky glass header, logo, anchor links (Services, Features, Pricing, Contact), high-converting CTA
- **Hero Section** — Attention-grabbing headline, social proof ticker, primary CTAs, live dashboard mockup with missed-call text-back simulation
- **Core Features Grid** — 6 cards: Missed-call text-back, Unified Inbox 2.0, Smart Booking Calendar, Funnel Builder, Nurture Workflows, Attribution & Analytics
- **Interactive Lead Calculator** — ROI estimator (leads/mo × close rate × deal value) with live recovered-lead and revenue projections
- **Social Proof / Testimonials** — 3 agency testimonials with MRR lift metrics + logo cloud
- **Pricing Table** — Starter / Growth (Most Popular) / Agency Scale with monthly/yearly toggle
- **Lead Capture Form** — Name, Email, Phone, Business Name + volume select, JS submit handler with success toast & confetti
- **Footer** — Copyright, legal links, social links, uptime status

**Technical Highlights:**
- ✅ Single self-contained `index.html` — production-ready for GitHub Pages
- ✅ Tailwind CSS via CDN (no build step)
- ✅ 100% responsive (mobile-first, tablet, desktop)
- ✅ Micro-animations: float, pulse, reveal on scroll, hover lift, progress bar
- ✅ Vanilla JS: calculator, pricing toggle, form validation, mobile menu, smooth scroll
- ✅ Modern dark-mode aesthetic with glass morphism, gradient borders, radial glows

### 🚀 Quick Start

No build needed. Just open `index.html` or serve it:

```bash
# Option 1: Open directly
open index.html

# Option 2: Local server
npx serve .
# or
python -m http.server 8000
```

### 📦 Deploy to GitHub Pages (2 minutes)

**If your agent pushed automatically:** Your site is live at `https://<username>.github.io/lead-capture-agency/`

**Manual steps:**

1. **Create repository:**
   - Go to https://github.com/new
   - Name: `lead-capture-agency`
   - Visibility: Public
   - Click Create

2. **Push code:**
   ```bash
   git init
   git add index.html README.md
   git commit -m "feat: launch LeadPulse agency OS landing page"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/lead-capture-agency.git
   git push -u origin main
   ```

3. **Enable Pages:**
   - Repo → Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` / `(root)`
   - Save → Wait 1-2 min
   - Live URL: `https://<YOUR_USERNAME>.github.io/lead-capture-agency/`

4. **Custom Domain (Optional):**
   - In Pages settings → Custom domain → enter `www.yourdomain.co.uk` → Save
   - In DNS manager add CNAME: `www` → `<username>.github.io`
   - Check Enforce HTTPS

### 🎨 Customization

- **Brand colors:** Edit Tailwind config in `<script>` tag — `brand.500` is primary `#8B5CF6`
- **Copy:** Search for headline in `index.html` — all sections are clearly commented
- **Calculator logic:** Adjust lift assumptions in `calc()` function (default +15% close rate, +27% missed-call recovery)
- **Form handler:** Replace simulated API in `leadForm` submit with your endpoint (GoHighLevel webhook, Zapier, etc.)

```javascript
// Example: Send to your webhook
await fetch('https://hooks.zapier.com/hooks/catch/...', {
  method: 'POST',
  body: JSON.stringify(Object.fromEntries(new FormData(form)))
})
```

### 🧪 CRO Notes

- Hero includes live social proof ("2,847 leads captured today")
- ROI calculator qualifies leads and demonstrates value before asking for email
- Pricing has decoy + most popular highlighting
- Form shows "3 spots left" urgency + live chat presence
- Toast confirmation creates dopamine hit + sets expectation for next step

---

Built with ❤️ for agencies who hate losing deals. 

**License:** MIT — Use for your agency, clients, or white-label.
