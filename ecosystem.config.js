module.exports = {
  apps: [{
    name: "media-frontend",
    script: "serve",
    env: {
      PM2_SERVE_PATH: 'build',
      PM2_SERVE_PORT: 3000,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html'
    },
    watch: false,
    max_memory_restart: '1G',
    exp_backoff_restart_delay: 100,
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    max_restarts: 10,
    restart_delay: 4000
  }]
} 