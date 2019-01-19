const config = require('./config');

module.exports = {
    apps : [{
      name: 'panf',
      script: './app.js',
      watch: ['lib', 'app.js', 'routes', 'src/locales', 'ecosystem.config.js'],
      interpreter: 'babel-node',
      env: {
        DEBUG: config.app.core.debug,
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    }]
  }