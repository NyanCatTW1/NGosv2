function hidePrompt() {
  term.set_prompt("")
}

function showPrompt(prompt="NGos>") {
  term.set_prompt(prompt)
}

// Code from https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
function copyStringToClipboard(str) {
  // Create new element
  var el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  el.style = {
    position: 'absolute',
    left: '-9999px'
  };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
}

$(function () {
  term = $('#terminal').terminal({
    help: function() {
      term.echo("help: Displays list of available commands")
      term.echo("clear: Clears the terminal.")
      term.echo("save: Manual save in case autosave every 5 seconds isn't enough for you.")
      term.echo("export: Exports the save into your clipboard.")
      term.echo("import: Imports your exported save.")
      term.echo("deleteSave: HARD RESETS THE GAME WITHOUT ANYTHING IN RETURN")
      term.echo("rungame: Attempt to start the game")
      if (player.loreId >= 1) term.echo("captcha: Captcha task manager, use 'captcha help' for details.")
      if (player.loreId >= 3) term.echo("store: Online store client in a command prompt! Use 'store help' for details.")
    },
    save: function() {
      saveGame()
      term.echo("Saved.")
    },
    export: function() {
      copyStringToClipboard(btoa(JSON.stringify(player)))
      term.echo("Save exported to your clipboard.")
    },
    import: function() {
      loadGame(prompt("Please paste your exported save below:"),true)
    },
    deleteSave: function() {
      term.echo("If you are very sure about deleting your save, please type the following command:")
      term.echo("rm -rf --no-preserve-root /")
    },
    rm: function(...args) {
      if (args.join(" ") == "-rf --no-preserve-root /") {
        term.echo("Deleting everything in 30 seconds, if you ran this command by mistake REFRESH YOUR BROWSER NOW!")
        runTimer(new Decimal(30),new Decimal(1),new Decimal(0),function(){},function(){ 
          player = getInitPlayer()
          saveGame()
          term.clear()
          term.echo("System reset complete.")
        })
      } else {
        term.echo("Error: Invalid usage of rm, you might be running the wrong command or have made a typo.")
      }
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
            term.echo("captcha: Captcha task manager")
            term.echo("Usage: 'captcha new' requests a new task for solving")
            term.echo(" ".repeat(7) + "'captcha current' displays the task in case you forgot it")
            term.echo(" ".repeat(7) + "'captcha submit 123456' submits 123456 as the answer to the captcha")
            if (player.loreId >= 2) term.echo(" ".repeat(7) + "'captcha stat' displays the stat of your account")
            if (player.bestTrustStage >= 1) term.echo(" ".repeat(7) + "'captcha withdraw' withdraws all the money from your account, which makes them spendable in store.")
            term.echo("You gain 0.01 money and 1 trust for solving a number captcha.")
            break;
          case "new":
            newCaptcha.call(null,1,args[1]=="--force"?true:false)
            break;
          case "current":
            if (player.currentTaskText === "") {
              term.echo("Error: You haven't start a task yet.")
              return
            }
            term.echo("Current task:")
            term.echo(player.currentTaskText)
            break;
          case "submit":
            if (args.length < 2) {
              term.echo("You need to type the answer to be submitted!")
              break;
            }
            term.echo("Submitting your answer...")
            runTimer(new Decimal(5),player.computer.internet.speed,new Decimal(0),function(){},function(){verifyAnswer.call(null,args[1])})
            break;
          case "stat":
            if (player.loreId < 2) {
              term.echo("Error: You have done no task so far, so there isn't any stat to show.")
              break;
            }
            term.echo("Requesting your stats from the server...")
            runTimer(new Decimal(5),player.computer.internet.speed,new Decimal(0),function(){},function(){
              term.echo(`Money available for withdraw: ${player.money}`)
              term.echo(`Trust level: ${player.trust}`)
              switch (player.trustStage) {
                case 0:
                  term.echo("Withdraw is available at 10 trust")
                  break;
                default:
                  term.echo("You reached the highest trust we can handle right now, blame dev for this!")
                  break;
              }
            })
            break;
          case "withdraw":
            if (player.bestTrustStage < 1) {
              term.echo("Error: No such option is available! Run 'captcha help' to see how to use this command correctly.")
            } else {
              term.echo("Verifying your trust level...")
              runTimer(new Decimal(5),player.computer.internet.speed,new Decimal(0),function(){},function(){
                if (player.trustStage < 1) {
                  term.echo("Sorry, but your trust level is too low for a withdraw, please retry once you gain at least 10 trust.")
                } else {
                  term.echo("Trust level matches minimem requirement, withdrawing all money from your account...")
                  runTimer(player.money,new Decimal(0.01),new Decimal(0),function(){},function(){
                    player.withdrawnMoney = player.withdrawnMoney.plus(player.money)
                    player.money = new Decimal(0)
                    term.echo("Operation complete.")
                  })
                }
              })
            }
            break;
          default:
            term.echo("Error: No such option is available! Run 'captcha help' to see how to use this command correctly.")
        }
      }
    },
    store: function(...args) {
      if (player.loreId < 3) {
        fakeCommandNotFound("store")
        return
      }
      term.echo("The store is still under devlopment!")
    }
  }, {
    greetings: "Welcome to NGos!\n© 2019 Nyan cat, All Rights Reserved.\nType 'help' for a list of available commands.",
    prompt: 'NGos>',
    checkArity: false
  });
  fakeCommandNotFound = (cmdName) => term.echo(`[[;red;]Command '${cmdName}' Not Found!]`)
});