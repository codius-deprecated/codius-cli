var Q = require('q');

var ImportCommand = function (codius) {
  this.codius = codius;
};

/**
 * Import an NPM module and convert it to a contracts module.
 */
ImportCommand.prototype.run = function () {
  var npm = require('npm');

  var package = this.codius.config.argv.remain.shift();
  return Q.ninvoke(npm, 'load', {})
    .then(function () {
      return Q.ninvoke(npm.commands, 'install', [package]);
    })
    .then(function () {

    })
};

exports.ImportCommand = ImportCommand;
