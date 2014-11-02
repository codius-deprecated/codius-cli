var net = require('net');
var express = require('express');
var winston = require('winston');
var Promise = require('bluebird');

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
  var self = this;

  var currentDir = process.cwd();

  var engineConfig = self.codius.config.getEngineConfig();

  var compiler = new Compiler(engineConfig);
  var fileManager = new FileManager(engineConfig);

  var fileStoragePromises = [];
  compiler.on('file', function (event) {
    fileStoragePromises.push(fileManager.storeFileWithHash(event.hash, event.data));
  });

  var contractHash = compiler.compileModule(currentDir);
  Promise.all(fileStoragePromises).then(function () {
    var engine = new Engine(engineConfig);
    var runner = engine.runContract(contractHash);

    runner.on('exit', function (code, signal) {
      process.exit(code ? code : 1);
    });

    function handleRequest (stream) {
      var listener;
      if (listener = runner.getPortListener(engineConfig.virtual_port)) {
        listener(stream);
      } else {
        function handleListener(event) {
          if (event.port !== engineConfig.virtual_port) return;

          runner.removeListener('portListener', handleListener);

          // Pass socket stream to contract
          event.listener(stream);
        }
        runner.on('portListener', handleListener);
      }

      stream.on('end', function () {
        winston.debug('Connection ended');
      });
    }

    var server = net.createServer(handleRequest);
    server.listen(engineConfig.virtual_port, function(err){
      if (err) {
        winston.error(err);
        return;
      }
      winston.info('Localhost server listening on port: ' + engineConfig.virtual_port);
    });
  });
};

exports.ServeCommand = ServeCommand;
