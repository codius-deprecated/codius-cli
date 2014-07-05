#!/usr/bin/env node

var CommandParser = require('../lib/commandparser').CommandParser;
var Codius = require('../lib/codius').Codius;

var parser = new CommandParser();

parser.parseEnv(process.env);
parser.parseArgv(process.argv);

var codius = new Codius();
codius.load(parser.getConfig()).then(function () {
  codius.runCommand(codius.config.command);
}).catch(function (err) {
  console.error(err.message);
  process.exit(1);
}).done();
