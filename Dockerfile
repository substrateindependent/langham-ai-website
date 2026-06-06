FROM nginx:alpine

# Copy the website files
COPY index.html /usr/share/nginx/html/index.html
COPY proof/index.html /usr/share/nginx/html/proof/index.html
RUN chmod 644 /usr/share/nginx/html/index.html && \
    chmod 644 /usr/share/nginx/html/proof/index.html

# Configure nginx: port 8080, clean URL routing for /proof and /proof/
RUN cat > /etc/nginx/conf.d/default.conf << 'NGINX_EOF'
server {
    listen 8080;
    listen [::]:8080;

    root /usr/share/nginx/html;
    index index.html;

    # Clean URL: /proof and /proof/ both serve proof/index.html
    location = /proof {
        try_files /proof/index.html =404;
    }
    location = /proof/ {
        try_files /proof/index.html =404;
    }

    # Homepage
    location / {
        try_files $uri $uri/ /index.html;
    }

    error_page 404 /index.html;
}
NGINX_EOF

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
