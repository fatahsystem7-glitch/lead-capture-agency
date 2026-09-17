# LeadPulse Backend Guide — How to Make It Functional

Your landing page at https://fatahsystem7-glitch.github.io/lead-capture-agency/ is **frontend-only** on GitHub Pages (static hosting). The form currently works with **localStorage + optional webhook**. Here's how to control the backend:

---

## 1️⃣ Current Functional Backend (Already Working)

**What happens when someone submits the form:**

1. Saves lead to browser `localStorage` (persists)
2. If you set a webhook URL, it POSTs JSON to your backend
3. Shows success toast + confetti

**View Your Leads — Admin Dashboard:**

- Go to: `https://fatahsystem7-glitch.github.io/lead-capture-agency/?admin=1`
- Or: `https://fatahsystem7-glitch.github.io/lead-capture-agency/#admin`
- Or click the small **"• Admin"** dot in footer (visible when you have leads)

Admin features:
- See all leads in table (name, business, email, phone, volume, date)
- Search/filter
- Export CSV
- Delete leads
- Total count + conversion stats

> This is client-side storage — good for demo, but for real production connect a webhook.

---

## 2️⃣ Connect to Real Backend (Choose One)

### Option A: GoHighLevel (Recommended for Agencies)
You built a GHL-style page, so this is native:

1. In GHL → Settings → Integrations → Webhooks → Create Inbound Webhook
2. Copy webhook URL like `https://services.leadconnectorhq.com/hooks/xxx/webhook/yyy`
3. In `index.html`, find `BACKEND_CONFIG` at top of `<script>`:
```javascript
const BACKEND_CONFIG = {
  webhookUrl: "https://services.leadconnectorhq.com/hooks/xxx/webhook/yyy", // <- paste here
  mode: "webhook" // or "both" to keep localStorage + webhook
}
```
4. Push to GitHub → All leads now flow into GHL contact + workflow

### Option B: Zapier / Make.com (No Code)
1. Create Zap: Trigger = Webhook → Catch Hook → Copy URL
2. Paste URL in `BACKEND_CONFIG.webhookUrl`
3. Add Zap action: Gmail, Google Sheets, Slack, etc.

### Option C: Google Sheets (Free CRM)
1. Create Google Sheet with headers: Timestamp, Name, Business, Email, Phone, Volume
2. Go to Extensions → Apps Script → Paste this:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), data.name, data.business, data.email, data.phone, data.volume, data.source || 'leadpulse']);
  return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
}
```
3. Deploy → Web App → Anyone can access → Copy URL → Paste in `BACKEND_CONFIG`

### Option D: Formspree / Getform (Email Leads)
1. Go to formspree.io → Create form → Copy endpoint `https://formspree.io/f/xxxx`
2. Set `webhookUrl` to that endpoint
3. Leads arrive via email

### Option E: Supabase / Firebase (Full Database)
```javascript
// Example Supabase
const BACKEND_CONFIG = {
  mode: "supabase",
  supabaseUrl: "https://xxx.supabase.co",
  supabaseKey: "eyJ...",
  table: "leads"
}
// Then in form handler, use supabase client to insert
```

### Option F: EmailJS (Send Email Directly from Frontend)
```javascript
emailjs.send("service_id","template_id",{
  name: data.name,
  email: data.email,
  phone: data.phone,
  business: data.business
})
```

---

## 3️⃣ How to Edit & Control

**Change copy, colors, pricing:**
- Open `index.html` → Search for text → Edit → Commit → Push → Live in 1-2 min

**Change webhook:**
- Edit `BACKEND_CONFIG.webhookUrl` in `<script>` section (line ~850)

**Add custom domain:**
- GitHub repo → Settings → Pages → Custom domain → `www.yourdomain.com`

**Add backend logic (serverless):**
- Create `api/` folder with Vercel/Netlify functions if you move off GitHub Pages
- Or keep GitHub Pages + use webhook to external backend

**Local dev:**
```bash
python -m http.server 8000
# open http://localhost:8000?admin=1 to see admin
```

---

## 4️⃣ Quick Setup for Production

1. Choose backend (GHL webhook recommended)
2. Paste webhook URL in `BACKEND_CONFIG`
3. Set `mode: "both"` to keep local backup + send to GHL
4. Push to GitHub:
```bash
git add index.html
git commit -m "feat: connect GHL webhook"
git push
```
5. Test form → Check GHL / Google Sheet → Check `?admin=1` for local backup

---

## 5️⃣ Need Help?

- Current live site: https://fatahsystem7-glitch.github.io/lead-capture-agency/
- Repo: https://github.com/fatahsystem7-glitch/lead-capture-agency
- Admin: https://fatahsystem7-glitch.github.io/lead-capture-agency/?admin=1

All leads are currently saved in browser — for team access, connect a webhook so leads go to shared sheet/CRM.
