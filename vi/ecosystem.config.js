module.exports = {
  apps: [
    {
      name: `${process.env.npm_package_name}-v${process.env.npm_package_version}`,
      script: './index.js',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss:SSS',
      min_uptime: 10000, // 10 seconds
      max_restarts: 3,
      max_memory_restart: '3G', // will restart if memory uses 2GB
      kill_timeout: 10000,
      interpreter: `node@${process.env.npm_package_engines_node}`,
    },
  ],
}
