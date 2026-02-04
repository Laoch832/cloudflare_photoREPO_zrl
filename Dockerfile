# 使用 nginx 提供服务
FROM nginx:alpine

# 安装 Node.js 用于运行文件服务器
RUN apk add --no-cache nodejs npm

# 复制前端构建产物到 nginx 目录（不包含静态资源）
COPY dist /usr/share/nginx/html

# 创建静态资源目录（会被卷挂载覆盖）
RUN mkdir -p /usr/share/nginx/html/music \
    && mkdir -p /usr/share/nginx/html/images \
    && mkdir -p /usr/share/nginx/html/notes

# 复制文件服务器代码
COPY server /app/server
WORKDIR /app

# 安装文件服务器依赖
RUN npm install express multer cors

# 复制自定义 nginx 配置（支持前端路由和 API 代理）
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    # API 代理到文件服务器 \
    location /api/ { \
        proxy_pass http://localhost:3001/; \
        proxy_http_version 1.1; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        proxy_read_timeout 86400; \
        client_max_body_size 100M; \
    } \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动脚本：同时启动文件服务器和 nginx
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'node /app/server/file-server.js &' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

CMD ["/start.sh"]
