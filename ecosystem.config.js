const configs = require('./bin/infra/configs/global_config');

module.exports = {
  apps : [{
    name: 'app',
    script: './index.js',
    exec_mode: 'cluster',
    instances: configs.get('/instances') || 2
  }]
};
