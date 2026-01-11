import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'
const assetManifest = JSON.parse(manifestJSON)

export default {
  async fetch(request, env, ctx) {
    // 允许跨域
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response('OK', { headers: corsHeaders })
    }

    const url = new URL(request.url)
    const pathname = url.pathname

    // 调试路由
    if (url.pathname === '/debug') {
      return new Response(JSON.stringify({
        message: 'Hello from Cloudflare Worker (KV Chat)!',
        url: request.url,
        headers: Object.fromEntries(request.headers),
        cf: request.cf
      }, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    // --- KV 聊天室 API (解决并发覆盖问题) ---

    // 1. 获取消息和在线人数
    if (url.pathname === '/api/chat/poll') {
      try {
        // 1.1 获取最近消息 (列出 msg: 前缀的 keys)
        // limit: 50, reverse: true (获取最新的)
        // 注意：KV list 默认按 key 字典序排序。
        // key 格式: chat:msg:<timestamp>:<uuid>
        // timestamp 是数字，但为了正确排序，应补零对齐或直接倒序获取？
        // Cloudflare KV list 不支持 reverse。所以我们只能获取最新的 N 个？
        // 或者我们获取所有（如果不太多）？或者按 prefix 分片？
        // 为了简单，我们只获取最近一小时的 keys？prefix = chat:msg:<hour>? 不太好。
        // 简单方案：列出 limit 100，然后在内存中排序。
        // 为了避免 key 无限增长，我们需要定期清理（TTL）。
        
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

    // 2. 发送消息 (每个消息一个 Key)
    if (url.pathname === '/api/chat/send' && request.method === 'POST') {
      try {
        const body = await request.json();
        const now = Date.now();
        const msgId = crypto.randomUUID();
        // Key 格式: chat:msg:<timestamp>:<id>
        // 这样 list 时大致有序
        const key = `chat:msg:${now}:${msgId}`;
        const messageData = {
          id: msgId,
          text: body.content,
          senderId: body.senderId,
          timestamp: now
        };
        
        // 存入 KV，设置 24 小时过期 (自动清理)
        // 将内容存入 metadata 以便 list 时直接获取
        await env.CHAT_DATA.put(key, "", {
          metadata: messageData,
          expirationTtl: 86400 // 1 day
        });

        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 3. 发送心跳 (每个用户一个 Key)
    if (url.pathname === '/api/chat/heartbeat' && request.method === 'POST') {
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

    // --- 静态资源服务 ---
    try {
      const customMapRequestToAsset = (req) => {
        const url = new URL(req.url)
        if (url.pathname === '/gallery') {
          return new Request(`${url.origin}/gallery.html`, req)
        }
        if (url.pathname === '/notes') {
          return new Request(`${url.origin}/notes.html`, req)
        }
        return mapRequestToAsset(req)
      }

      const response = await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
          mapRequestToAsset: customMapRequestToAsset,
        }
      )

      // 为正常响应添加 CORS 头和 Cache-Control 头
      const headers = new Headers(response.headers)
      Object.keys(corsHeaders).forEach(key => headers.set(key, corsHeaders[key]))

      // 智能缓存策略
      const contentType = headers.get('content-type') || ''
      if (contentType.includes('text/html')) {
        // HTML: 不缓存或短缓存，确保更新即时生效
        headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
      } else if (contentType.includes('application/json') || contentType.includes('application/javascript')) {
        // JSON/JS: 中等缓存，配合 ETag (KV 自动处理)
        headers.set('Cache-Control', 'public, max-age=3600, must-revalidate')
      } else if (contentType.match(/image|font|css/)) {
        // 静态资源: 长缓存
        headers.set('Cache-Control', 'public, max-age=86400')
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })

    } catch (e) {
      let pathname = new URL(request.url).pathname
      
      // 如果是 404 错误（KV 中找不到文件），返回 404 页面
      if (e.message.includes('could not find')) {
        // 尝试获取自定义 404 页面
        try {
          const notFoundResponse = await getAssetFromKV(
            {
              request: new Request(new URL('/404.html', request.url), request),
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: assetManifest,
            }
          )
          return new Response(notFoundResponse.body, {
            status: 404,
            statusText: 'Not Found',
            headers: notFoundResponse.headers,
          })
        } catch (ignore) {}

        return new Response(`"${pathname}" not found`, {
          status: 404,
          statusText: 'not found',
          headers: corsHeaders,
        })
      }

      // 其他错误返回 500 并打印详情
      return new Response(`Internal Server Error: ${e.message}`, {
        status: 500,
        headers: corsHeaders,
      })
    }
  },
}
