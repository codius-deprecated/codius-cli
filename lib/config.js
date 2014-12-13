var url = require('url');
var winston = require('winston');

var EngineConfig = require('codius-engine').Config;

/**
 * Class to store and manage Codius CLI configuration.
 */
var Config = function (opts) {
  this.config = new EngineConfig(opts);
  this.config.logger = winston;
  this.config.codiusHost = opts.CODIUS_HOST || 'codius.host';
  this.config.allowUnauthorizedSsl = !!opts.CODIUS_UNAUTHORIZED_SSL || false;
};

Config.prototype.get = function (key, defaultValue) {
  if ("undefined" !== typeof this.config[key]) {
    return this.config[key];
  } else {
    return defaultValue;
  }
};

/**
 * Get a config object for codius-engine module.
 */
Config.prototype.getEngineConfig = function () {
  return this.config;
};

/**
 * Get Codius host URL.
 */
Config.prototype.getCodiusHostUrl = function () {
  if (this.config && this.config.codiusHost) {
    var hostUrl = url.parse(this.config.codiusHost);
    var hostName = hostUrl.hostname;
    var tokenSuffix = hostUrl.hostname;
    if (hostUrl.port) tokenSuffix += ':'+hostUrl.port;
    var apiPrefix = 'https://'+tokenSuffix;

    return {
      hostname: hostUrl.hostname,
      apiPrefix: apiPrefix,
      tokenSuffix: tokenSuffix
    };
  } else {
    throw new Error('Must set CODIUS_HOST environment variable');
  }
};

exports.Config = Config;
