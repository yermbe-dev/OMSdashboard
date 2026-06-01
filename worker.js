// Cloudflare Worker — handles /api/* routes, delegates everything else to static assets

const API_KEYS = {
  '/api/data': 'dashboard:state',
  '/api/event-plans': 'event-plans:state',
  '/api/sso-tracker': 'sso-tracker:state',
};

function checkAuth(request, env) {
  if (!env.PASSWORD) return true;
  const pw = request.headers.get('x-dashboard-password');
  return pw === env.PASSWORD;
}

async function handleApi(request, env, pathname) {
  const kvKey = API_KEYS[pathname];
  if (!kvKey) return new Response('Not found', { status: 404 });

  if (request.method === 'GET') {
    try {
      const data = await env.DATA.get(kvKey);
      return new Response(data || '{}', {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  if (request.method === 'POST') {
    if (!checkAuth(request, env)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    try {
      const body = await request.text();
      JSON.parse(body);
      await env.DATA.put(kvKey, body);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 400 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env, url.pathname);
    }
    return env.ASSETS.fetch(request);
  },
};
