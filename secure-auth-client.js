/* LeadHunter secure account gate.
 * Requires the public Supabase URL + anon key in supabase-config.js.
 * Secret keys are sent only to a Supabase Edge Function; they are never read back into the browser.
 */
(function(){
  const cfg=window.LEADHUNTER_CONFIG||{};
  const hasConfig=Boolean(cfg.supabaseUrl&&cfg.supabaseAnonKey&&window.supabase?.createClient);
  let client=null;
  if(hasConfig) client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);

  const css=`
    #lh-auth-gate{position:fixed;inset:0;z-index:200;background:#08090d;color:#f5f7fb;display:flex;align-items:center;justify-content:center;padding:24px;font-family:Inter,system-ui,sans-serif}
    #lh-auth-gate .lh-card{width:min(460px,100%);background:#15171f;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:28px;box-shadow:0 24px 90px rgba(0,0,0,.45)}
    #lh-auth-gate h1{font-size:22px;margin:0 0 8px}.lh-muted{color:#a1a1aa;font-size:13px;line-height:1.55}.lh-field{width:100%;height:42px;margin-top:8px;padding:0 13px;background:#0f1016;color:#fff;border:1px solid rgba(255,255,255,.1);border-radius:10px;box-sizing:border-box}.lh-btn{width:100%;height:42px;margin-top:12px;border:0;border-radius:999px;background:linear-gradient(100deg,#8b5cf6,#6366f1);color:#fff;font-weight:700;cursor:pointer}.lh-btn.secondary{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12)}.lh-error{color:#fca5a5;font-size:12px;margin-top:10px}.lh-success{color:#6ee7b7;font-size:12px;margin-top:10px}.lh-row{display:flex;gap:10px}.lh-row>*{flex:1}.lh-badge{display:inline-block;padding:5px 10px;border-radius:999px;background:rgba(139,92,246,.18);color:#c4b5fd;font-size:11px;font-weight:700;margin-bottom:14px}
  `;
  function injectCss(){if(document.getElementById('lh-auth-style'))return; const s=document.createElement('style');s.id='lh-auth-style';s.textContent=css;document.head.appendChild(s);}
  function gateHtml(message){return `<div id="lh-auth-gate"><div class="lh-card"><div class="lh-badge">LEAD RADAR SECURE ACCESS</div><h1>Account access</h1><p class="lh-muted">${message}</p><div id="lh-auth-body"></div></div></div>`;}
  function showGate(message){ injectCss(); if(!document.getElementById('lh-auth-gate')) document.body.insertAdjacentHTML('afterbegin',gateHtml(message)); }
  function removeGate(){document.getElementById('lh-auth-gate')?.remove();}
  function setBodyLocked(locked){document.body.style.overflow=locked?'hidden':'';}
  function renderAuthForm(){
    const body=document.getElementById('lh-auth-body'); if(!body)return;
    body.innerHTML=`<input id="lh-email" class="lh-field" type="email" placeholder="Email address" autocomplete="email"><input id="lh-password" class="lh-field" type="password" placeholder="Password" autocomplete="current-password"><div class="lh-row"><button id="lh-signin" class="lh-btn">Sign in</button><button id="lh-signup" class="lh-btn secondary">Create account</button></div><div id="lh-auth-message"></div>`;
    const message=(text,ok=false)=>{const el=document.getElementById('lh-auth-message');if(el){el.className=ok?'lh-success':'lh-error';el.textContent=text;}};
    const credentials=()=>({email:document.getElementById('lh-email')?.value.trim(),password:document.getElementById('lh-password')?.value});
    document.getElementById('lh-signin').onclick=async()=>{const c=credentials();if(!c.email||!c.password)return message('Enter your email and password.');const {error}=await client.auth.signInWithPassword(c);if(error)message(error.message);else await checkPaidAccess();};
    document.getElementById('lh-signup').onclick=async()=>{const c=credentials();if(!c.email||!c.password)return message('Enter an email and password.');if(c.password.length<8)return message('Use at least 8 characters for the password.');const {error}=await client.auth.signUp(c);if(error)message(error.message);else message('Account created. Check your email, then sign in.',true);};
  }
  async function allowAuthenticatedSession(session){
    removeGate();setBodyLocked(false);window.LEADHUNTER_AUTH.session=session;
    const {data:settings}=await client.from('user_settings').select('workflow,knowledge_base_links,ai_endpoint').eq('user_id',session.user.id).maybeSingle();
    if(settings) window.dispatchEvent(new CustomEvent('leadHunterSettingsLoaded',{detail:settings}));
    return true;
  }
  async function checkPaidAccess(){
    if(!client){showGate('Secure login is not configured yet. Create the Supabase project, add the public values to supabase-config.js, then deploy.');setBodyLocked(true);return false;}
    const {data:{session}}=await client.auth.getSession();
    const paidRequired=cfg.requireActiveSubscription!==false;
    if(!session){showGate(paidRequired?'Sign in with your email to continue. An active £20/month subscription is required.':'Sign in with your email to continue.');renderAuthForm();setBodyLocked(true);return false;}
    if(!paidRequired) return allowAuthenticatedSession(session);
    const {data:subscription,error}=await client.from('subscriptions').select('status,current_period_end').eq('user_id',session.user.id).maybeSingle();
    if(error||!subscription||subscription.status!=='active'){
      showGate(`<strong>Payment required</strong><br><br>Your account is signed in, but an active £20/month subscription is required to open the dashboard.`);
      const body=document.getElementById('lh-auth-body');
      if(body) body.innerHTML=`<button id="lh-checkout" class="lh-btn">Subscribe for £20/month</button><button id="lh-signout" class="lh-btn secondary">Sign out</button><div id="lh-auth-message"></div>`;
      document.getElementById('lh-checkout').onclick=async()=>{const url=cfg.checkoutFunctionUrl;if(!url){document.getElementById('lh-auth-message').textContent='Checkout is not configured yet.';return;}const r=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json'}});const d=await r.json();if(d.url)location.href=d.url;else document.getElementById('lh-auth-message').textContent=d.error||'Checkout could not start.';};
      document.getElementById('lh-signout').onclick=()=>client.auth.signOut();setBodyLocked(true);return false;
    }
    return allowAuthenticatedSession(session);
  }
  async function saveSupportSettings(settings){
    if(!client)throw new Error('Supabase is not configured');
    const {data:{user}}=await client.auth.getUser();if(!user)throw new Error('Sign in first');
    const {error}=await client.from('user_settings').upsert({user_id:user.id,workflow:settings.workflow,knowledge_base_links:settings.knowledgeBaseLinks||'',ai_endpoint:settings.aiEndpoint||'',updated_at:new Date().toISOString()},{onConflict:'user_id'});
    if(error)throw error;return true;
  }
  async function saveOpenRouterKey(key){
    if(!client)throw new Error('Supabase is not configured');
    const {data:{session}}=await client.auth.getSession();if(!session)throw new Error('Sign in first');
    const url=cfg.saveSecretFunctionUrl;if(!url)throw new Error('Secure secret-saving function is not configured');
    const r=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json'},body:JSON.stringify({provider:'openrouter',key})});
    const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not save key');return d;
  }
  async function requestSupportDraft(lead,offer,knowledgeBaseLinks){
    if(!client||!cfg.supportDraftFunctionUrl)return null;
    const {data:{session}}=await client.auth.getSession();if(!session)return null;
    const r=await fetch(cfg.supportDraftFunctionUrl,{method:'POST',headers:{Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json'},body:JSON.stringify({lead,offer,knowledgeBaseLinks})});
    const d=await r.json();if(!r.ok)throw new Error(d.error||'Support draft request failed');return d.draft||null;
  }
  window.LEADHUNTER_AUTH={client,session:null,checkPaidAccess,saveSupportSettings,saveOpenRouterKey,requestSupportDraft};
  document.addEventListener('DOMContentLoaded',async()=>{injectCss();await checkPaidAccess();if(client)client.auth.onAuthStateChange(()=>setTimeout(checkPaidAccess,0));});
})();
