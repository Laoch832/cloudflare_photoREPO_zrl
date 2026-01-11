import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

const assetManifest = JSON.parse(manifestJSON)

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

    try {
      const response = await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      )

      // 为正常响应添加 CORS 头
      const headers = new Headers(response.headers)
      Object.keys(corsHeaders).forEach(key => headers.set(key, corsHeaders[key]))

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })

    } catch (e) {
      let pathname = new URL(request.url).pathname
      
      // 如果是 404 错误（KV 中找不到文件），返回 404
      if (e.message.includes('could not find')) {
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
