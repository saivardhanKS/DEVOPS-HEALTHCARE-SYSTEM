FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

RUN mkdir -p /tmp/nginx/client_temp \
    /tmp/nginx/proxy_temp \
    /tmp/nginx/fastcgi_temp \
    /tmp/nginx/uwsgi_temp \
    /tmp/nginx/scgi_temp \
    && chown -R 101:101 /tmp/nginx \
    && chmod -R 700 /tmp/nginx

RUN sed -i 's|/var/cache/nginx/client_temp|/tmp/nginx/client_temp|g' /etc/nginx/nginx.conf \
    && sed -i 's|/var/cache/nginx/proxy_temp|/tmp/nginx/proxy_temp|g' /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]