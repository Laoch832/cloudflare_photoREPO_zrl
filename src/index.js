import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

const assetManifest = JSON.parse(manifestJSON)

export default {
  async fetch(request, env, ctx) {
    try {
      // 尝试从 KV 获取静态资源
      // 默认情况下，这会处理 index.html, images/*, images.json 等
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      )
    } catch (e) {
      // 如果不是静态资源请求，或者文件不存在
      let pathname = new URL(request.url).pathname
      
      // 可以添加自定义 API 逻辑，但对于纯静态图库，这里只需要返回 404
      return new Response(`"${pathname}" not found`, {
        status: 404,
        statusText: 'not found',
      })
    }
  },
}
