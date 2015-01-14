//------------------------------------------------------------------------------
/*
    This file is part of Codius: https://github.com/codius
    Copyright (c) 2014 Ripple Labs Inc.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

var url = require('url');
var winston = require('winston');

var EngineConfig = require('codius-engine').Config;

/**
 * Class to store and manage Codius CLI configuration.
 */
var Config = function (opts) {
  this.config = new EngineConfig(opts);
  this.config.logger = winston;
  this.config.codiusHost = opts.CODIUS_HOST || 'https://codius.host';
  this.config.allowUnauthorizedSsl = Boolean(opts.CODIUS_UNAUTHORIZED_SSL) || false;
  this.config.disableNacl = Boolean(opts.DISABLE_NACL) || true;
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
