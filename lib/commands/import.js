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
