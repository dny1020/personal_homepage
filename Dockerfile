FROM nginx:alpine

# Install Python and supervisor
RUN apk add --no-cache python3 py3-pip supervisor curl && \
    python3 -m venv /opt/venv

# Activate virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Copy and install Python dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend app
COPY backend /app/backend

# Copy frontend files
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/*.html /usr/share/nginx/html/
COPY frontend/*.css /usr/share/nginx/html/
COPY frontend/*.js /usr/share/nginx/html/

# Create supervisor config
RUN mkdir -p /etc/supervisor.d
COPY <<EOF /etc/supervisor.d/supervisord.ini
[supervisord]
nodaemon=true
logfile=/dev/stdout
logfile_maxbytes=0

[program:backend]
command=/opt/venv/bin/gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
directory=/app/backend
environment=PATH="/opt/venv/bin:%(ENV_PATH)s"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

EXPOSE 80 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor.d/supervisord.ini"]
