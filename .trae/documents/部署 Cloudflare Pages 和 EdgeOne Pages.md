# 部署 Cloudflare Pages 和 EdgeOne Pages

目前项目配置已就绪，以下是针对两个平台的部署方案：

## 1. Cloudflare Workers Sites (当前主部署)
GitHub Actions 流程文件：`.github/workflows/deploy.yml`
- **状态**：已配置为使用 `wrangler deploy`。
- **注意**：由于今天之前的部署尝试触发了 KV 写操作日限额 (1000次/天)，**今天的自动部署可能会失败**。请等待 UTC 00:00 (北京时间 08:00) 后重试。
- **触发方式**：Push 代码到 `main` 分支。

## 2. 腾讯云 EdgeOne Pages (备用部署)
GitHub Actions 流程文件：`.github/workflows/deploy-edgeone.yml`
- **状态**：已创建 Workflow 模板，但**强烈建议使用控制台集成**。
- **推荐部署方式**：
  1.  登录 [腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone/pages)。
  2.  新建项目 -> **连接 Git 仓库**。
  3.  选择此 GitHub 仓库。
  4.  构建配置：
      -   **构建命令**: `npm install && npm run build`
      -   **输出目录**: `public`
  5.  点击部署。
- **优势**：
  -   国内访问速度更快。
  -   完全兼容当前的静态架构 (无 KV 依赖)。
  -   无需在 GitHub Secrets 中配置复杂的 Token，由腾讯云直接拉取代码。

## 下一步行动
请确认是否要尝试手动触发一次 GitHub Actions，或者直接去腾讯云控制台连接仓库进行部署。
