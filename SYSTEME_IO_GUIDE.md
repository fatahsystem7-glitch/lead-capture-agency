# Plug LeadHunter into Systeme.io

Yes — LeadHunter can push leads directly into systeme.io as contacts + trigger your funnels.

## 3 Ways to Plug In (Choose One)

### Option 1: Direct API (Recommended - Auto-create contacts)

**How it works:** When you click ☆ Save on a Reddit lead, it auto-creates a contact in systeme.io with tags.

**Steps:**

1. **Get Systeme.io API Key:**
   - Login to systeme.io → Settings → Public API Keys → Create Key → Copy key (looks like `api_xxxx`)

2. **In LeadHunter, open left panel → Scroll to "Systeme.io Integration":**
   - Paste API Key
   - Enter Tag: e.g. `reddit-lead` or `lead-hunter`
   - Click Save
   - Toggle "Auto-push to Systeme.io" ON

3. **Now when you Save a lead:**
   - LeadHunter will POST to `https://api.systeme.io/api/contacts`
   - Creates contact: email = author@reddit.lead (or you edit email), name = Reddit author, custom fields = post title, subreddit, intent score, URL
   - Adds tag so you can trigger workflow: e.g. Workflow → Trigger: Tag added → Action: Send email / Add to funnel

**API Payload we send:**
```json
{
  "email": "agency_owner_23@reddit.lead",
  "firstName": "agency_owner_23",
  "fields": [
    {"slug": "reddit_post", "value": "Looking for CRM that does missed-call text-back"},
    {"slug": "subreddit", "value": "Entrepreneur"},
    {"slug": "intent_score", "value": "85"},
    {"slug": "post_url", "value": "https://reddit.com/r/Entrepreneur/..."},
    {"slug": "outreach_message", "value": "Hey, saw your post..."}
  ],
  "tags": [{"name": "reddit-lead"}]
}
```

> Note: Reddit doesn't give email, so we create placeholder email. You should manually message on Reddit first, then when they reply, update contact with real email. OR use this as internal lead list.

### Option 2: Webhook → Systeme.io Workflow (No API Key Needed)

Systeme.io Workflows can start via webhook:

1. In systeme.io → Automations → Workflows → Create → Trigger: Incoming Webhook → Copy webhook URL (looks like `https://app.systeme.io/api/webhooks/xxx`)

2. In LeadHunter → Systeme.io Integration → Paste webhook URL in "Webhook URL" field

3. Save lead → LeadHunter POSTs lead data to that webhook → Triggers your workflow → Creates contact / Sends email / Adds to course

**This is easier if you don't want to handle API keys.**

### Option 3: Embed LeadHunter INSIDE Systeme.io Funnel

You can embed the hunter tool directly inside a systeme.io funnel page:

1. In systeme.io → Funnels → Edit Step → Add Element → Raw HTML / Code

2. Paste this iframe code:

```html
<iframe 
  src="https://fatahsystem7-glitch.github.io/lead-capture-agency/" 
  width="100%" 
  height="900" 
  frameborder="0"
  style="border-radius: 16px; border: 1px solid #e5e7eb;">
</iframe>
```

3. Save → Your funnel now has live LeadHunter inside it. Your team can hunt leads without leaving systeme.io.

### Option 4: CSV Import (Simplest)

1. In LeadHunter → Hunt leads → Save interesting ones → Export CSV

2. In systeme.io → Contacts → Import → Upload CSV → Map fields → Add tag `reddit-leads` → Import

3. Then trigger email campaign to those contacts (after you contacted them on Reddit and got their real email).

---

## What I Just Built For You

I updated your live hunter at https://fatahsystem7-glitch.github.io/lead-capture-agency/ with:

- **Systeme.io Integration Panel** in left sidebar
- **API Key + Tag inputs** (saved in localStorage)
- **Auto-push toggle** — when ON, saving a lead also pushes to systeme.io
- **Manual "Push to Systeme.io" button** on each lead card
- **Webhook URL support** for no-code workflow trigger

**How to use:**
1. Open hunter → Left panel → Systeme.io Integration → Paste your API key or webhook URL
2. Hunt leads → Save → Automatically appears in systeme.io contacts
3. In systeme.io, create workflow: Tag added = `reddit-lead` → Send email sequence / Add to funnel

---

## Systeme.io Workflow Example

**Workflow 1: Reddit Lead Nurture**
- Trigger: Tag `reddit-lead` added
- Action 1: Wait 5 min
- Action 2: Send email: "Saw your Reddit post about {{reddit_post}} — here's how we solve it"
- Action 3: Add to course / funnel

**Workflow 2: Internal Notification**
- Trigger: Incoming webhook (LeadHunter)
- Action: Send email to yourself: "New high-intent lead: {{reddit_post}} in r/{{subreddit}} — Intent {{intent_score}}%"

---

## Need Help?

- Live hunter: https://fatahsystem7-glitch.github.io/lead-capture-agency/
- Repo: https://github.com/fatahsystem7-glitch/lead-capture-agency
- Your API key is stored only in your browser localStorage, never sent to our server (GitHub Pages is static)

Paste your systeme.io API key or webhook URL in the hunter and it will plug in instantly.
