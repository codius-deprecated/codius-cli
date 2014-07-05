var nopt = require('nopt');

var Config = require('./config').Config;

/**
 * Class to parse command line
 */
var CommandParser = function () {
  this.config = new Config;
};


/**
 * Parse process.env object.
 */
CommandParser.prototype.parseEnv = function (env) {
  // XXX
};

/**
 * Parse command line arguments.
 */
CommandParser.prototype.parseArgv = function (argv) {
  var parsed = nopt({}, {}, argv);
  this.config.command = parsed.argv.remain.shift();
};

/**
 * Return a configuration object initialized using previously parsed values.
 */
CommandParser.prototype.getConfig = function () {
  return this.config;
};

exports.CommandParser = CommandParser;
