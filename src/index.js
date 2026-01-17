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
  // 添加 .flac, .mp3, .wav, .ogg, .docx, .doc 等格式
  const isStaticFile = /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|json|flac|mp3|wav|ogg|docx|doc|pdf)$/i.test(parsedUrl.pathname);
  
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
      const value = await env.VIEW_COUNTER.get('view_count');
      // 如果没有值，初始化为 1
      count = value ? parseInt(value) + 1 : 1;
      await env.VIEW_COUNTER.put('view_count', count.toString());
    } catch (error) {
      console.error('KV error:', error);
      // KV 出错时，尽量不返回随机数，而是返回错误或0
      // 这里我们可以选择返回 1 或者 0，或者保留之前的错误处理但去掉随机数
      count = 0; 
    }
  } else {
    console.warn('VIEW_COUNTER KV binding not found');
    // 没有绑定 KV 时返回 0，提示用户配置
    count = 0;
  }
  
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*', // 允许跨域以便调试
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
