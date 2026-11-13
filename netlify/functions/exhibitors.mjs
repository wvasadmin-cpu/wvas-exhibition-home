// Members-only gate for the exhibitor page (?for=exhibitors).
// The password is the Exhibitors' password from the society website, held in the
// EXHIBITORS_PASSWORD variable on Netlify (never in this repo, which is public).
// Case and surrounding spaces are ignored. A correct password sets a 90-day cookie.
//   GET    -> { ok }  is this browser unlocked?
//   POST   -> { ok }  check { password }, set the cookie if right
//   DELETE -> { ok }  forget the cookie (the page's "Lock" link)
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'wvas_exhibitors';
const DAYS = 90;
const clean = (s) => String(s || '').trim().toLowerCase();
// The cookie holds a hash of the password, so changing the password locks everyone out again.
const token = (pw) => createHmac('sha256', pw).update('wvas-exhibitors').digest('hex');
const same = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const reply = (ok, status, cookie) => {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (cookie !== undefined) headers['Set-Cookie'] = cookie;
  return new Response(JSON.stringify({ ok }), { status, headers });
};

export default async (req) => {
  const password = clean(process.env.EXHIBITORS_PASSWORD);
  if (!password) return reply(false, 500);
  const want = token(password);

  if (req.method === 'POST') {
    let given = '';
    try { given = clean((await req.json()).password); } catch {}
    if (!given || !same(token(given), want)) return reply(false, 401);
    return reply(true, 200, `${COOKIE}=${want}; Path=/; Max-Age=${DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`);
  }
  if (req.method === 'DELETE') return reply(false, 200, `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);

  const have = (req.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(COOKIE + '='));
  return reply(!!have && same(have.slice(COOKIE.length + 1), want), 200);
};

export const config = { path: '/api/exhibitors' };
