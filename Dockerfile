# 使用 nginx 提供服务
FROM nginx:alpine

# 复制本地构建产物到 nginx 目录
COPY dist /usr/share/nginx/html

# 复制自定义 nginx 配置（支持前端路由）
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
