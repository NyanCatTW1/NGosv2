$(function () {
  term = $('#terminal').terminal({
    help: function() {
      term.echo("help: Displays list of available commands")
      term.echo("rungame: Attempt to start the game")
      if (player.loreId >= 1) term.echo("captcha: Captcha task giver, use 'captcha help' for details.")
    },
    rungame: function() {
      term.echo("Waiting 10 seconds for the game to startup....")
      runTimer(new Decimal(1e10),player.computer.cpu.power,new Decimal(10000),function() { term.echo("Error: Timeout.");player.rungameAttempts = player.rungameAttempts.plus(1) },function(){ term.echo("Done.") })
    },
    captcha: function(...args) {
      if (player.loreId < 1) {
        fakeCommandNotFound("captcha")
        return
      }
      if (args.length === 0) {
        term.echo("You need to give an argument to use this command! Run 'captcha help' to see how to use this command correctly.")
      } else {
        switch (args[0]) {
          case "help":
            term.echo("captcha: Captcha task giver")
            term.echo("Usage: 'captcha new' requests a new task for solving")
            term.echo(" ".repeat(7) + "'captcha submit 123456' submits 123456 as the answer to the captcha")
            term.echo("You gains 0.01 money and 1 trust for finishing a number captcha.")
            break
          case "new":
            term.echo("Requesting and downloading new task...")
            runTimer(new Decimal(10),player.computer.internet.speed,new Decimal(1e308),function(){},function(){newCaptcha(1)})
          default:
            term.echo("Error: No such option is available! Run 'captcha help' to see how to use this command correctly.")
        }
      }
    }
  }, {
    greetings: "Welcome to NGos!\n© 2019 Nyan cat, All Rights Reserved.",
    prompt: 'NGos>',
    checkArity: false
  });
  fakeCommandNotFound = (cmdName) => term.echo(`[[;red;]Command '${cmdName}' Not Found!]`)
});