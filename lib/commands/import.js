var Promise = require('bluebird');

var ImportCommand = function (codius) {
  this.codius = codius;
};

/**
 * Import an NPM module and convert it to a contracts module.
 */
ImportCommand.prototype.run = function () {
  var npm = Promise.promisifyAll(require('npm'));

  var package = this.codius.config.argv.remain.shift();
  return npm.loadAsync({})
    .then(function () {
      npm.commands = Promise.promisifyAll(npm.commands);
      return npm.commands.installAsync(package);
    })
    .then(function () {

    })
};

exports.ImportCommand = ImportCommand;
