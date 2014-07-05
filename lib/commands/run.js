var Compiler = require('codius-engine').Compiler;
var FileManager = require('codius-engine').FileManager;
var Engine = require('codius-engine').Engine;

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

  engine.runContract(contractHash, function (error, result) {

  });
};

exports.RunCommand = RunCommand;
