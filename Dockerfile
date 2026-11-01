
FROM nginx:alpine

# Create writable Nginx temporary directories for non-root execution
RUN mkdir -p \
    /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    && chown -R 101:101 /var/cache/nginx \
    && touch /tmp/nginx.pid \
    && chown 101:101 /tmp/nginx.pid

# Configure Nginx to use a writable PID file
RUN sed -i 's#pid .*;#pid /tmp/nginx.pid;#' /etc/nginx/nginx.conf

# Copy healthcare frontend files
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js

# Set frontend file permissions
RUN chmod 644 /usr/share/nginx/html/index.html \
    /usr/share/nginx/html/style.css \
    /usr/share/nginx/html/script.js

# Expose the Nginx HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
