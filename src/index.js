import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

// 配置KV资产处理
const assetOptions = {
  // 可以添加自定义资产处理选项
};

// 处理静态资源请求
async function handleStaticAsset(request) {
  try {
    // 自定义资产映射，支持单页应用路由
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // 如果路径不是以文件扩展名结尾，并且不是根路径，尝试映射到index.html
    if (!pathname.endsWith('/') && !pathname.includes('.')) {
      pathname = '/';
    }
    
    // 创建一个新的请求，使用修改后的路径
    const modifiedRequest = new Request(
      new URL(pathname + url.search + url.hash, request.url),
      request
    );
    
    // 将请求映射到静态资产
    const mappedRequest = mapRequestToAsset(modifiedRequest);
    // 从KV获取资产
    return await getAssetFromKV(mappedRequest, assetOptions);
  } catch (e) {
    try {
      // 如果找不到资产，尝试返回index.html（单页应用路由支持）
      const indexRequest = new Request(
        new URL('/', request.url),
        request
      );
      const mappedIndexRequest = mapRequestToAsset(indexRequest);
      return await getAssetFromKV(mappedIndexRequest, assetOptions);
    } catch (indexError) {
      // 如果index.html也找不到，返回404
      return new Response('404 Not Found', {
        status: 404,
        headers: {
          'content-type': 'text/plain',
        },
      });
    }
  }
}

// 处理API请求
async function handleApiRequest(request) {
  // 处理API请求的逻辑
  return new Response(JSON.stringify({ message: 'API not implemented' }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

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
    if (url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/view-count') {
        return handleViewCount(request, env);
      }
      return handleApiRequest(request);
    }
    
    // 处理静态资源
    return handleStaticAsset(request);
  },
};
