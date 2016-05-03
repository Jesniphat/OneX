console.log('SS', process.env.SS);
module.exports = require('./config_' + (process.env.SS || 'dev_onex'));
