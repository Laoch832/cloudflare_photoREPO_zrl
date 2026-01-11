import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

const assetManifest = JSON.parse(manifestJSON)

// ChatRoom Durable Object
export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = new Set();
    this.history = []; // Simple in-memory history
  }

  async fetch(request) {
    // 处理 WebSocket 升级请求
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const { 0: client, 1: server } = new WebSocketPair();
    
    // 处理连接
    this.handleSession(server);

    return new Response(null, { status: 101, webSocket: client });
  }

  handleSession(webSocket) {
    // 接受连接
    webSocket.accept();
    this.sessions.add(webSocket);

    // 发送历史记录 (过滤 1 小时内的)
    const now = Date.now();
    this.history = this.history.filter(msg => now - msg.timestamp < 3600000);
    webSocket.send(JSON.stringify({ type: 'history', messages: this.history }));
    
    // 广播在线人数
    this.broadcast({ type: 'count', count: this.sessions.size });

    // 监听消息
    webSocket.addEventListener("message", async msg => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === 'message') {
          const message = {
            id: crypto.randomUUID(),
            text: data.content,
            timestamp: Date.now(),
            senderId: data.senderId // Pass through senderId
          };
          this.history.push(message);
          this.broadcast({ type: 'message', message });
        }
      } catch (err) {
        // ignore malformed
      }
    });

    // 监听关闭
    const closeOrError = () => {
      this.sessions.delete(webSocket);
      this.broadcast({ type: 'count', count: this.sessions.size });
    };
    webSocket.addEventListener("close", closeOrError);
    webSocket.addEventListener("error", closeOrError);
  }

  broadcast(message) {
    const msgStr = JSON.stringify(message);
    for (const session of this.sessions) {
      try {
        session.send(msgStr);
      } catch (err) {
        this.sessions.delete(session);
      }
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    // 允许跨域
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    }

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      })
    }

    const url = new URL(request.url)

    // 调试路由
    if (url.pathname === '/debug') {
      return new Response(JSON.stringify({
        message: 'Hello from Cloudflare Worker!',
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

    // 聊天室 WebSocket 路由
    if (url.pathname === '/api/chat') {
      // 获取 Durable Object 实例
      // 使用固定 ID 'global-chat' 确保所有用户连接到同一个房间
      const id = env.CHAT_ROOM.idFromName('global-chat');
      const obj = env.CHAT_ROOM.get(id);
      return obj.fetch(request);
    }

    try {
      // 自定义路由映射逻辑
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
