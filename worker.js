/**
 * RECONX AI Worker
 * Cloudflare Workers proxy untuk AI API
 * 
 * Setup:
 * 1. Deploy ke Cloudflare Workers
 * 2. Set environment variables:
 *    - GROQ_API_KEY: API key dari console.groq.com (gratis)
 *    - ALLOWED_ORIGIN: URL GitHub Pages kamu (misal: https://username.github.io)
 * 3. (Opsional) Bind KV namespace dengan nama "KV" untuk rate limiting
 * 
 * Endpoint: POST https://reconx-ai.username.workers.dev
 * Body: { model, messages, max_tokens }
 */

export default {
  async fetch(request, env) {

    const CORS_HEADERS = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // ── Handle CORS preflight ──────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // ── Hanya izinkan POST ─────────────────────────────────
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // ── Validasi Origin (keamanan production) ─────────────
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    if (allowedOrigin !== '*' && !allowedOrigin.split(',').map(o => o.trim()).includes(origin)) {
      return new Response(
        JSON.stringify({ error: 'Origin not allowed' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Rate Limiting per IP (butuh KV namespace) ─────────
    if (env.KV) {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const key = `rate:${ip}`;
      try {
        const count = parseInt(await env.KV.get(key) || '0');
        if (count >= 30) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Try again in 1 hour.' }),
            { status: 429, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
          );
        }
        await env.KV.put(key, String(count + 1), { expirationTtl: 3600 });
      } catch (e) {
        // KV error — lanjutkan tanpa rate limiting
        console.error('KV error:', e.message);
      }
    }

    // ── Parse request body ─────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // ── Validasi messages ──────────────────────────────────
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: 'messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // ── Cek API key ────────────────────────────────────────
    if (!env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY not configured in Worker environment variables' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // ── Forward ke Groq API ────────────────────────────────
    let aiResponse;
    try {
      aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: body.model || 'llama-3.1-8b-instant',
          messages: body.messages,
          max_tokens: Math.min(body.max_tokens || 1000, 2000), // cap at 2000
          temperature: body.temperature || 0.7,
        })
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: `Failed to reach Groq API: ${e.message}` }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const data = await aiResponse.json();

    // ── Error dari Groq ────────────────────────────────────
    if (!aiResponse.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || `Groq API error: ${aiResponse.status}` }),
        { status: aiResponse.status, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // ── Success ────────────────────────────────────────────
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      }
    });
  }
}
