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

    // --- KV 聊天室 API ---

    // 1. 获取消息和在线人数 (轮询)
    if (url.pathname === '/api/chat/poll') {
      try {
        // 获取消息记录
        let history = await env.CHAT_DATA.get('history', { type: 'json' }) || [];
        // 过滤 1 小时内的消息
        const now = Date.now();
        history = history.filter(msg => now - msg.timestamp < 3600000);
        
        // 获取在线用户 (心跳)
        let heartbeats = await env.CHAT_DATA.get('heartbeats', { type: 'json' }) || {};
        // 清理超过 30秒 无心跳的用户
        let activeCount = 0;
        const newHeartbeats = {};
        for (const [id, timestamp] of Object.entries(heartbeats)) {
          if (now - timestamp < 30000) {
            newHeartbeats[id] = timestamp;
            activeCount++;
          }
        }
        
        // 异步更新清理后的心跳 (不阻塞响应)
        ctx.waitUntil(env.CHAT_DATA.put('heartbeats', JSON.stringify(newHeartbeats)));

        return new Response(JSON.stringify({
          messages: history,
          count: activeCount
        }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 2. 发送消息
    if (url.pathname === '/api/chat/send' && request.method === 'POST') {
      try {
        const body = await request.json();
        const newMessage = {
          id: crypto.randomUUID(),
          text: body.content,
          senderId: body.senderId,
          timestamp: Date.now()
        };

        // 获取并更新历史记录
        let history = await env.CHAT_DATA.get('history', { type: 'json' }) || [];
        history.push(newMessage);
        // 保持最近 50 条，且过滤过期
        const now = Date.now();
        history = history.filter(msg => now - msg.timestamp < 3600000).slice(-50);
        
        await env.CHAT_DATA.put('history', JSON.stringify(history));

        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 3. 发送心跳
    if (url.pathname === '/api/chat/heartbeat' && request.method === 'POST') {
      try {
        const body = await request.json();
        const userId = body.userId;
        
        let heartbeats = await env.CHAT_DATA.get('heartbeats', { type: 'json' }) || {};
        heartbeats[userId] = Date.now();
        
        await env.CHAT_DATA.put('heartbeats', JSON.stringify(heartbeats));
        
        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // --- 静态资源服务 ---
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
