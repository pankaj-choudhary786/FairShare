/**
 * Maps Supabase Auth errors to messages the user can act on.
 * Signup/login often return HTTP 400 with a JSON body; the browser only shows "400".
 */
export function toFriendlyAuthError(err) {
  if (!err) return new Error('Something went wrong. Please try again.');

  const code = err.code ?? '';
  const msg = String(err.message ?? '');
  const lower = msg.toLowerCase();
  const status = err.status;

  // HTTP 429 — Supabase rate-limits auth endpoints per IP (many retries while debugging)
  if (
    status === 429 ||
    code === 'too_many_requests' ||
    /rate limit|too many requests|429/i.test(msg)
  ) {
    return new Error(
      'Too many sign-up attempts from this network. Wait 5–15 minutes and try again, or sign up from another connection. This is Supabase’s rate limit, not your app code.'
    );
  }

  if (/captcha|hcaptcha|turnstile|challenge/i.test(msg) || /captcha/i.test(code)) {
    return new Error(
      'Sign-up is blocked by CAPTCHA settings. In Supabase: Authentication → Attack Protection → turn off CAPTCHA for development, or add a CAPTCHA widget and pass captchaToken in signUp options.'
    );
  }

  if (
    code === 'user_already_exists' ||
    /already registered|already exists|user already|duplicate/i.test(msg)
  ) {
    return new Error('This email is already registered. Try logging in instead.');
  }

  if (code === 'signup_disabled' || /sign\s*up.*disabled/i.test(msg)) {
    return new Error('New sign-ups are disabled in this Supabase project.');
  }

  if (code === 'weak_password' || /password.*policy|password.*requirement/i.test(lower)) {
    return new Error(msg || 'Password does not meet the project password rules (check Supabase Auth → Providers → Email).');
  }

  if (code === 'email_not_confirmed' || /confirm.*email/i.test(lower)) {
    return new Error('Check your inbox and confirm your email before signing in.');
  }

  if (code === 'invalid_credentials' || /invalid login|invalid password|wrong password/i.test(lower)) {
    return new Error('Invalid email or password.');
  }

  // Pass through Supabase message when present (often explains the 400)
  if (msg) return new Error(msg);

  return new Error('Request failed. Check Supabase Dashboard → Authentication → Providers and Attack Protection.');
}
