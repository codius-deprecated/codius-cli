var winston = require('winston');

var EngineConfig = require('codius-engine').Config;

/**
 * Class to store and manage Codius CLI configuration.
 */
var Config = function (opts) {
  this.config = new EngineConfig(opts);
  this.config.logger = winston;
};

/**
 * Get a config object for codius-engine module.
 */
Config.prototype.getEngineConfig = function () {
  return this.config;
};

exports.Config = Config;
