// functions/api/chat/poll.js
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

  try {
    // 1.1 获取最近消息 (列出 msg: 前缀的 keys)
    const list = await env.CHAT_DATA.list({ prefix: 'chat:msg:', limit: 100 });
    let messages = [];
    for (const key of list.keys) {
       if (key.metadata) {
         messages.push(key.metadata);
       }
    }
    // 按时间排序
    messages.sort((a, b) => a.timestamp - b.timestamp);
    
    // 1.2 获取在线用户 (列出 heartbeat: 前缀)
    const heartbeats = await env.CHAT_DATA.list({ prefix: 'chat:heartbeat:' });
    const activeCount = heartbeats.keys.length;

    return new Response(JSON.stringify({
      messages: messages,
      count: activeCount
    }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
}
