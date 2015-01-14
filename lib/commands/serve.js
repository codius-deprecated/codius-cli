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
var net = require('net');
var winston = require('winston');
var extend = require('extend');

var Compiler = require('codius-engine').Compiler;
var FileManager = require('codius-engine').FileManager;
var Engine = require('codius-engine').Engine;

var ServeCommand = function (codius) {
  this.codius = codius;
};

/**
 * Run a contract
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

  var contractHash = compiler.compileModule(currentDir),
      engine,
      env;

  return Promise.all(fileStoragePromises).then(function () {
    engine = new Engine(engineConfig);
    var numHosts = self.codius.config.config.hosts || 1;

    // Open a suitable number of sockets for this Codius group
    var sockets = [];
    function openNextSocket(minPort) {
      return self._openSocket(minPort).then(function (socket) {
        sockets.push(socket);

        // Keep opening sockets until we have enough
        if (sockets.length < numHosts) {
          return openNextSocket(socket.address().port+1);
        } else {
          return sockets;
        }
      });
    }

    return openNextSocket(engineConfig.virtual_port);
  }).then(function (sockets) {
    env = {
      CODIUS_GROUP: sockets.map(function (socket) {
        return 'localhost:'+socket.address().port;
      }).join(',')
    }

    return sockets;
  }).map(function (socket) {
    // We'll clone the environment, so that each runner can modify its copy.
    var runnerEnv = extend({}, env);
    return self._startRunner(engine, engineConfig, contractHash, socket, runnerEnv);
  }).then(function () {
    process.exit(0);
  });
};

/**
 * Open a TCP server on a free socket.
 *
 * This method will iterate until it finds a free port.
 */
ServeCommand.prototype._openSocket = function (minPort) {
  var self = this;

  return new Promise(function (resolve, reject) {
    var server = net.createServer();
    server.on('error', function (err) {
      if (err.code === 'EADDRINUSE') {
        // Try again with the next port number
        self._openSocket(minPort+1).then(resolve);
      } else {
        reject(err);
      }
    });

    server.on('listening', function () {
      winston.info('Localhost server listening on port: ' + server.address().port);
      resolve(server);
    });

    server.listen(minPort);
  });
}

ServeCommand.prototype._startRunner = function (engine, engineConfig, contractHash, socket, env) {
  return new Promise(function (resolve, reject) {
    env['CODIUS_SELF'] = 'localhost:'+socket.address().port;
    var runner = engine.runContract(contractHash, {
      env: env, 
      instance_id: env['CODIUS_SELF']
    });

    runner.on('exit', function (code, signal) {
      resolve(code);
    });

    socket.on('connection', handleRequest);

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
  });
}

exports.ServeCommand = ServeCommand;
