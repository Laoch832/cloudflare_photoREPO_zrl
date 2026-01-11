// functions/api/chat/heartbeat.js
export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response('OK', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const userId = body.userId;
    const key = `chat:heartbeat:${userId}`;
    
    // 存入 KV，设置 60 秒过期
    await env.CHAT_DATA.put(key, "1", { expirationTtl: 60 });
    
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
}
