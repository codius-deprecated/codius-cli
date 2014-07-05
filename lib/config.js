var EngineConfig = require('codius-engine').Config;

/**
 * Class to store and manage Codius CLI configuration.
 */
var Config = function () {
  this.command = 'help';
};

/**
 * Get a config object for codius-engine module.
 */
Config.prototype.getEngineConfig = function () {
  return new EngineConfig();
};

exports.Config = Config;
