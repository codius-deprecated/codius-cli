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

var Promise = require('bluebird');
var winston = require('winston');

/**
 * Main class for Codius command line interface (CLI).
 *
 * Architecture is based on NPM.
 */
var Codius = function () {
  var _this = this;
  this.commands = {};
  Object.keys(Codius.commands).forEach(function (key) {
    try {
      var cmd = new Codius.commands[key](_this);
      _this.commands[key] = cmd.run.bind(cmd);
    } catch (err) {
      winston.warn('Unable to load command `'+key+'`: ' + err);
    }
  });
};

Codius.commands = {
  'help': require('./commands/help').HelpCommand,
  'import': require('./commands/import').ImportCommand,
  'upload': require('./commands/upload').UploadCommand,
  'serve': require('./commands/serve').ServeCommand,
  'run': require('./commands/serve').ServeCommand,
  'manifest': require('./commands/manifest').ManifestCommand,
  'selftest': require('./commands/selftest').SelfTestCommand
};

Codius.prototype.load = function (config) {
  var deferred = Promise.defer();

  this.config = config;

  // XXX Actually do something
  deferred.resolve({});

  return deferred.promise;
};

Codius.prototype.runCommand = function (commandName) {
  if (!commandName) {
    commandName = 'help';
  }

  if ("function" !== typeof this.commands[commandName]) {
    throw new Error("Unknown command: "+commandName);
  }

  // Using Promise.all so it'll handle promises and non-promises. There is
  // probably a better way. but it's temporary anyway.
  // TODO: Once all commands are returning promises we can just do:
  //       this.commands[commandName]().done();
  Promise.all([this.commands[commandName]()]).done();
};

exports.Codius = Codius;
