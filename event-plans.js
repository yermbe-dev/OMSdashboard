// Pages Function for event plans data — shares same KV namespace, different key
const KEY = 'event-plans:state';

function checkAuth(request, env) {
  if (!env.PASSWORD) return true;
  const pw = request.headers.get('x-dashboard-password');
  return pw === env.PASSWORD;
}

export async function onRequestGet(context) {
  const { env } = context;
  try {
    const data = await env.DATA.get(KEY);
    return new Response(data || '{}', {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!checkAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    const body = await request.text();
    JSON.parse(body);
    await env.DATA.put(KEY, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}
