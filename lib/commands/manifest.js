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

var Compiler = require('codius-engine').Compiler;

var winston = require('winston');

var ManifestCommand = function (codius) {
  this.codius = codius;
};

/**
 * Generate and output the contract's fully expanded manifest.
 */
ManifestCommand.prototype.run = function () {
  var currentDir = process.cwd();

  var engineConfig = this.codius.config.getEngineConfig();

  var compiler = new Compiler(engineConfig);

  var lastManifest;
  compiler.on('file', function (event) {
    if (event.isManifest) {
      lastManifest = event.data;
    }
  });

  // TODO Add feature to also print all manifests for all submodules
  // TODO Add feature to print manifest for a specific module
  // TODO Add feature to print manifest in canonically ordered form
  // TODO Add feature to print manifest in fully minified, hashable form
  // TODO Add feature to print hash of contract and other debug information
  var contractHash = compiler.compileModule(currentDir);
  process.stdout.write(lastManifest.toString('utf-8'));
  process.stdout.write('\n');
};

exports.ManifestCommand = ManifestCommand;
