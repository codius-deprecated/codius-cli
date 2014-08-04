var express = require('express');
var winston = require('winston');

var Compiler = require('codius-engine').Compiler;
var FileManager = require('codius-engine').FileManager;
var Engine = require('codius-engine').Engine;

var ServeCommand = function (codius) {
  this.codius = codius;
};

/**
 * Upload a contract
 */
ServeCommand.prototype.run = function () {
  var currentDir = process.cwd();

  var engineConfig = this.codius.config.getEngineConfig();

  var compiler = new Compiler(engineConfig);
  var fileManager = new FileManager(engineConfig);

  compiler.on('file', function (event) {
    fileManager.storeFileWithHash(event.hash, event.data);
  });

  var contractHash = compiler.compileModule(currentDir);

  var engine = new Engine(engineConfig);

  // Spin up a little webserver
  var app = express();

  function routeRunContract(req, res) {
    var runner = engine.runContract(contractHash, '', function (error, result) {
      if (!res.headersSent) res.send(204);
    });

    runner.res = res;
  }

  app.all('/*', routeRunContract);

  var port = 2634;
  app.listen(port);

  winston.info('Serving contract '+contractHash);
  winston.info('http://localhost:'+port+'/');
};

exports.ServeCommand = ServeCommand;
