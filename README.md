# Cloudflare Worker 静态图库

这是一个基于 Cloudflare Workers (Worker Sites) 的静态图库应用。
图片文件直接存储在 GitHub 仓库中，每次推送到 GitHub 时，通过构建脚本生成索引，并由 Cloudflare Worker 提供服务。

## 目录结构
```
├── public/
│   ├── images/       # 图片文件存放在这里
│   ├── index.html    # 前端页面
│   └── images.json   # (自动生成) 图片索引文件
├── src/
│   └── index.js      # Worker 逻辑 (负责静态资源托管)
├── scripts/
│   └── build-index.js # 构建脚本 (生成 images.json)
└── wrangler.toml     # 配置文件
```

## 如何添加图片
1. 将图片文件放入 `public/images/` 文件夹。
2. 提交并推送到 GitHub (如果你配置了自动部署)。
3. 或者在本地运行部署命令。

## 部署步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 本地预览
```bash
# 这会自动运行构建脚本生成索引，并启动本地服务器
npm run deploy # 实际上这里建议先 npm run build 然后 npx wrangler dev
# 或者简单点：
npm run build
npx wrangler dev
```

### 3. 部署到 Cloudflare
```bash
npm run deploy
```
这会执行以下操作：
1. 运行 `scripts/build-index.js`，扫描 `public/images` 目录，生成 `public/images.json`。
2. 运行 `wrangler deploy`，将 `public` 目录下的所有文件（包括图片）上传到 Cloudflare KV。
3. 发布 Worker。

## 注意事项
- Cloudflare Workers KV 对单个文件大小有一定限制（通常是 25MB），但对于一般图片足够了。
- 每次添加图片都需要重新部署。
- 这是一个完全“静态”的方案，不需要数据库，不需要 R2。
