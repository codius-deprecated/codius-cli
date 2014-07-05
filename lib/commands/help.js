var HelpCommand = function (codius) {
  this.codius = codius;
};

/**
 * Show the help.
 */
HelpCommand.prototype.run = function () {
  console.log('');
  console.log('Usage: codius <command>');
  console.log('');
  console.log('where <command> is one of:');

  var availableCommands = this.codius.commands;
  console.log('    ' + Object.keys(availableCommands).join(', '));

  console.log('');
};

exports.HelpCommand = HelpCommand;
