FROM nginx:alpine

# Copy the website
COPY index.html /usr/share/nginx/html/index.html

# Configure nginx to listen on port 8080 (Fly.io requirement)
RUN sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf && \
    sed -i 's/listen\s*\[::\]:80/listen [::]:8080/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
