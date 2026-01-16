import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

// 自定义资产映射函数，支持单页应用路由
const customMapRequestToAsset = request => {
  const parsedUrl = new URL(request.url);
  
  // 检查请求是否是API请求
  if (parsedUrl.pathname.startsWith('/api/')) {
    return request;
  }
  
  // 检查请求是否是静态文件
  const isStaticFile = /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|json)$/i.test(parsedUrl.pathname);
  
  // 如果是静态文件，直接映射
  if (isStaticFile) {
    return mapRequestToAsset(request);
  }
  
  // 否则，映射到index.html，支持单页应用路由
  parsedUrl.pathname = '/index.html';
  return new Request(parsedUrl, request);
};

// 处理视图计数请求
async function handleViewCount(request, env) {
  // 尝试从KV获取当前计数
  let count = 0;
  if (env && env.VIEW_COUNTER) {
    try {
      count = await env.VIEW_COUNTER.get('view_count');
      count = count ? parseInt(count) + 1 : 1;
      await env.VIEW_COUNTER.put('view_count', count.toString());
    } catch (error) {
      console.error('KV error:', error);
      // 如果KV不可用，返回一个随机数作为fallback
      count = Math.floor(Math.random() * 1000) + 1;
    }
  } else {
    // 如果没有KV绑定，返回一个随机数作为fallback
    count = Math.floor(Math.random() * 1000) + 1;
  }
  
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

// 主Worker处理函数
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 处理API请求
    if (url.pathname === '/api/view-count') {
      return handleViewCount(request, env);
    }
    
    // 配置KV资产处理
    const assetOptions = {
      ASSET_NAMESPACE: env.__STATIC_CONTENT,
      ASSET_MANIFEST: assetManifest,
      mapRequestToAsset: customMapRequestToAsset
    };
    
    // 处理所有其他请求，包括静态资源和单页应用路由
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        assetOptions
      );
    } catch (error) {
      // 如果出现错误，返回404页面
      return new Response('404 Not Found: ' + error.message, {
        status: 404,
        headers: {
          'content-type': 'text/plain',
        },
      });
    }
  },
};
