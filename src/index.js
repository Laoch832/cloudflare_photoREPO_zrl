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

    // --- KV 浏览次数统计 ---

    // 获取浏览次数
    if (url.pathname === '/api/views') {
      try {
        let views = await env.CHAT_DATA.get('views', { type: 'json' }) || 0;
        return new Response(JSON.stringify({ views }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 增加浏览次数
    if (url.pathname === '/api/views/increment' && request.method === 'POST') {
      try {
        let views = await env.CHAT_DATA.get('views', { type: 'json' }) || 0;
        views++;
        await env.CHAT_DATA.put('views', views);
        return new Response(JSON.stringify({ views, success: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
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

      // 增强安全响应头
      headers.set('X-Content-Type-Options', 'nosniff')
      headers.set('X-Frame-Options', 'DENY')
      headers.set('X-XSS-Protection', '1; mode=block')
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      headers.set('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()')

      // 智能缓存策略 - 优化版
      const contentType = headers.get('content-type') || ''
      if (contentType.includes('text/html')) {
        // HTML: 短缓存，确保更新即时生效，同时利用 ETag 进行验证
        headers.set('Cache-Control', 'public, max-age=60, must-revalidate, stale-while-revalidate=300')
      } else if (contentType.includes('application/json')) {
        // JSON: 中等缓存，配合 ETag
        headers.set('Cache-Control', 'public, max-age=3600, must-revalidate, stale-while-revalidate=7200')
      } else if (contentType.includes('application/javascript')) {
        // JS: 较长缓存，适合频繁使用的脚本
        headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
      } else if (contentType.match(/image|font/)) {
        // 图片和字体: 长缓存，适合不经常变化的资源
        headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      } else if (contentType.includes('text/css')) {
        // CSS: 长缓存，适合不经常变化的样式表
        headers.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=2592000')
      } else {
        // 其他资源: 默认缓存策略
        headers.set('Cache-Control', 'public, max-age=86400, must-revalidate')
      }

      // 启用 Brotli 压缩
      headers.set('Content-Encoding', headers.get('Content-Encoding') || 'br')

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
