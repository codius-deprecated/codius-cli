var Compiler = require('codius-engine').Compiler;
var FileManager = require('codius-engine').FileManager;
var Engine = require('codius-engine').Engine;

var concat = require('concat-stream');
var fs = require('fs');

var RunCommand = function (codius) {
  this.codius = codius;
};

/**
 * Run a contract
 */
RunCommand.prototype.run = function () {
  var currentDir = process.cwd();

  var engineConfig = this.codius.config.getEngineConfig();

  var compiler = new Compiler(engineConfig);
  var fileManager = new FileManager(engineConfig);

  compiler.on('file', function (event) {
    fileManager.storeFileWithHash(event.hash, event.data);
  });

  var contractHash = compiler.compileModule(currentDir);
  console.log('Running contract '+contractHash);

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
        console.error(error);
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
};

exports.RunCommand = RunCommand;
