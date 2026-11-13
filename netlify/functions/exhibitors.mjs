// Members-only gate for the exhibitor page (?for=exhibitors).
// The password is the Exhibitors' password from the society website, held in the
// EXHIBITORS_PASSWORD variable on Netlify (never in this repo, which is public).
// Case and surrounding spaces are ignored. Nothing is remembered: the page asks
// again every time it's opened, so it always looks protected.
//   POST { password } -> { ok }
import { timingSafeEqual } from 'node:crypto';

const clean = (s) => String(s || '').trim().toLowerCase();
const same = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const reply = (ok, status) => new Response(JSON.stringify({ ok }), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export default async (req) => {
  const password = clean(process.env.EXHIBITORS_PASSWORD);
  if (!password) return reply(false, 500);
  if (req.method !== 'POST') return reply(false, 405);
  let given = '';
  try { given = clean((await req.json()).password); } catch {}
  return given && same(given, password) ? reply(true, 200) : reply(false, 401);
};

export const config = { path: '/api/exhibitors' };
