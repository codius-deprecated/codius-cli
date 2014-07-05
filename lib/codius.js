var Q = require('q');

/**
 * Main class for Codius command line interface (CLI).
 *
 * Architecture is based on NPM.
 */
var Codius = function () {
  var _this = this;
  this.commands = {};
  Object.keys(Codius.commands).forEach(function (key) {
    var cmd = new Codius.commands[key](_this);
    _this.commands[key] = cmd.run.bind(cmd);
  });
};

Codius.commands = {
  'help': require('./commands/help').HelpCommand
};

Codius.prototype.load = function (config) {
  var deferred = Q.defer();

  this.config = config;

  // XXX Actually do something
  deferred.resolve({});

  return deferred.promise;
};

Codius.prototype.runCommand = function (commandName) {
  if ("function" !== typeof this.commands[commandName]) {
    throw new Error("Unknown command: "+commandName);
  }

  this.commands[commandName]();
};

exports.Codius = Codius;
