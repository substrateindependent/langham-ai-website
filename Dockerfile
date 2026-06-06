FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY proof/index.html /usr/share/nginx/html/proof/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod 644 /usr/share/nginx/html/index.html \
    && chmod 644 /usr/share/nginx/html/proof/index.html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
