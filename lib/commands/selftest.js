var Compiler = require('codius-engine').Compiler;
var FileManager = require('codius-engine').FileManager;
var Engine = require('codius-engine').Engine;

var concat = require('concat-stream');
var fs = require('fs');
var path = require('path');
var winston = require('winston');
var Promise = require('bluebird');

var SelfTestCommand = function (codius) {
  this.codius = codius;
};

/**
 * Run a contract
 */
SelfTestCommand.prototype.run = function () {
  var selftestDir = process.cwd();

  var engineConfig = this.codius.config.getEngineConfig();

  var compiler = new Compiler(engineConfig);
  var fileManager = new FileManager(engineConfig);

  var fileStoragePromises = [];
  compiler.on('file', function (event) {
    fileStoragePromises.push(fileManager.storeFileWithHash(event.hash, event.data));
  });

  var contractHash = compiler.compileModule(path.resolve(__dirname, '../selftest'));
  Promise.all(fileStoragePromises).then(function () {
    winston.info('Running self-test. If it works, it should print "Self-test succeeded"');

    var engine = new Engine(engineConfig);

    // Read input data from stdin
    if (engineConfig.input === '-') {
      process.stdin.setEncoding('utf-8');
      process.stdin.pipe(concat(function (inputData) {
        runContract(inputData);
      }));

    // Read input data from a file
    } else if (engineConfig.input) {
      fs.readFile(engineConfig.input, 'utf-8', function (error, fileData) {
        if (error) {
          winston.error(error);
          return;
        }

        runContract(fileData);
      });

    // No input data provided
    } else {
      runContract('');
    }

    function runContract(inputData) {
      engine.runContract(contractHash, inputData, function (error, result) {

      });
    }
  });
};

exports.SelfTestCommand = SelfTestCommand;
