#!/usr/bin/env node

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

var winston = require('winston');
var nconf = require('nconf');
var Codius = require('../lib/codius').Codius;
var Config = require('../lib/config').Config;

winston.cli();

// Use nconf to load command line arguments and environment variables
nconf.argv()
     .env()
     .file({ file: 'HOME/.config/codius/cli.json' });
var config = new Config(nconf.get());
var command = nconf.get('_')[0];

if (config.config.debug) {
  winston.default.transports.console.level = 'debug';
}

var codius = new Codius();
codius.load(config).then(function () {
  codius.runCommand(command);
}).catch(function (err) {
  console.error(err.stack ? err.stack : err);
  process.exit(1);
}).done();
