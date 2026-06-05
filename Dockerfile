FROM nginx:alpine

# Copy site files
COPY index.html /usr/share/nginx/html/index.html
COPY proof/ /usr/share/nginx/html/proof/
COPY assets/ /usr/share/nginx/html/assets/
COPY favicon.svg /usr/share/nginx/html/favicon.svg
COPY favicon.ico /usr/share/nginx/html/favicon.ico
COPY apple-touch-icon.png /usr/share/nginx/html/apple-touch-icon.png

# Set correct permissions
RUN find /usr/share/nginx/html -type f -exec chmod 644 {} \;

# Custom nginx config for /proof routing
RUN printf 'server {\n\
    listen 8080;\n\
    listen [::]:8080;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    charset utf-8;\n\
    add_header X-Content-Type-Options nosniff;\n\
    add_header X-Frame-Options SAMEORIGIN;\n\
    # /proof/ clean URL\n\
    location /proof {\n\
        try_files $uri $uri/ /proof/index.html =404;\n\
    }\n\
    location /proof/ {\n\
        try_files $uri $uri/index.html =404;\n\
    }\n\
    location / {\n\
        try_files $uri $uri/ =404;\n\
    }\n\
    # Cache static assets\n\
    location ~* \\.(css|js|svg|ico|png|jpg|jpeg|woff2)$ {\n\
        expires 7d;\n\
        add_header Cache-Control "public";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
