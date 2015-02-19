var Codius = require('../lib/codius').Codius;

it('runs the help command', function() { 
  var c = new Codius();
  c.runCommand('help');
});
