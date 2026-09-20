// Public Supabase frontend configuration.
// This file may be committed to GitHub. Never place a service-role key or OpenRouter key here.
window.LEADHUNTER_CONFIG = {
  supabaseUrl: "https://enyttnuwdakqhshqjlef.supabase.co",
  supabaseAnonKey: "sb_publishable_J6tkV5I_OBt5T9bF4DHWQA_CC094i6s",
  checkoutFunctionUrl: "https://enyttnuwdakqhshqjlef.supabase.co/functions/v1/create-checkout",
  supportDraftFunctionUrl: "https://enyttnuwdakqhshqjlef.supabase.co/functions/v1/support-draft",
  saveSecretFunctionUrl: "https://enyttnuwdakqhshqjlef.supabase.co/functions/v1/save-secret",
  // Keep false while testing email login. Set true after Stripe/webhooks are live.
  requireActiveSubscription: false
};
