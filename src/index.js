import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

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

// 配置KV资产处理
const assetOptions = {
  mapRequestToAsset: customMapRequestToAsset
};

// 处理视图计数请求
async function handleViewCount(request, env) {
  // 从KV获取当前计数
  let count = await env.VIEW_COUNTER.get('view_count');
  count = count ? parseInt(count) + 1 : 1;
  
  // 更新计数
  await env.VIEW_COUNTER.put('view_count', count.toString());
  
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
    
    // 处理所有其他请求，包括静态资源和单页应用路由
    try {
      return await getAssetFromKV(request, assetOptions);
    } catch (error) {
      // 如果出现错误，返回404页面
      return new Response('404 Not Found', {
        status: 404,
        headers: {
          'content-type': 'text/plain',
        },
      });
    }
  },
};
