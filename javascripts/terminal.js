$(function () {
  term = $('#terminal').terminal({
    help: function() {
      term.echo("help: Displays list of available commands")
      term.echo("rungame: Attempt to start the game")
    },
    rungame: function() {
      term.echo("Waiting 10 seconds for the game to startup....")
      runTimer(new Decimal(1e10),player.computer.cpu.power,new Decimal(10000),function() { player.rungameAttempts = player.rungameAttempts.plus(1) },function(){})
    }
  }, {
    greetings: "Welcome to NGos!\n© 2019 Nyan cat, All Rights Reserved.",
    prompt: 'NGos>',
    checkArity: false
  });
  fakeCommandNotFound = (cmdName) => term.echo(`[[;red;]Command '${cmdName}' Not Found!]`)
});