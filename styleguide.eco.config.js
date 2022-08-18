'use strict'

process.on('SIGINT', () => {
  const { exec } = require('child_process')
  exec('pm2 delete all')
})

module.exports = {
  apps: [
    {
      name: 'gogojungle styleguide',
      script: './styleguide/server-styleguide.js',
      watch: false,
      wait_ready: true,
      error_file: './styleguide_build/logs/err',
      out_file: './styleguide_build/logs/out',
      log_date_format: 'YYYY-MM-DD HH:mm:ss:SSS',
      min_uptime: 10000, // 10 seconds
      max_restarts: 3,
      max_memory_restart: '2G', // will restart if memory uses 1GB
    },
  ],
}
