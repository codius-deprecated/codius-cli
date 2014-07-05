var Config = require('./config').Config;
/**
 * Class to parse command line
 */
var CommandParser = function () {

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

};

/**
 * Return a configuration object initialized using previously parsed values.
 */
CommandParser.prototype.getConfig = function () {
  return {};
};

exports.CommandParser = CommandParser;
