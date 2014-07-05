var Q = require('q');

/**
 * Main class for Codius command line interface (CLI).
 *
 * Architecture is based on NPM.
 */
var Codius = function () {

};

Codius.commands = {
};

Codius.prototype.load = function (config) {
  var deferred = Q.defer();

  // XXX Actually do something
  deferred.resolve({});

  return deferred.promise;
};

exports.Codius = Codius;
