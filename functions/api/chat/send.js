// functions/api/chat/send.js
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
    const now = Date.now();
    const msgId = crypto.randomUUID();
    // Key 格式: chat:msg:<timestamp>:<id>
    const key = `chat:msg:${now}:${msgId}`;
    const messageData = {
      id: msgId,
      text: body.content,
      senderId: body.senderId,
      timestamp: now
    };
    
    // 存入 KV，设置 24 小时过期
    await env.CHAT_DATA.put(key, "", {
      metadata: messageData,
      expirationTtl: 86400 // 1 day
    });

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
}
