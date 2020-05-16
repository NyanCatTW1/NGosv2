/* exported hidePrompt */
function hidePrompt() {
  term.set_prompt("")
}

/* exported showPrompt */
function showPrompt(prompt) {
  term.set_prompt(prompt)
}

// Code from https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
function copyStringToClipboard(str) {
  // Create new element
  var el = document.createElement("textarea")
  // Set value (string to be copied)
  el.value = str
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute("readonly", "")
  el.style = {
    position: "absolute",
    left: "-9999px"
  }
  document.body.appendChild(el)
  // Select text inside element
  el.select()
  // Copy text to clipboard
  document.execCommand("copy")
  // Remove temporary element
  document.body.removeChild(el)
}

$(function () {
  term = $("#terminal").terminal(
    {
      help: function () {
        term.echo("help: Displays list of available commands")
        term.echo("clear: Clears the terminal.")
        term.echo("save: Manual save in case autosave every 5 seconds isn't enough for you.")
        term.echo("export: Exports the save into your clipboard.")
        term.echo("import: Imports your exported save.")
        term.echo("deleteSave: HARD RESETS THE GAME WITHOUT ANYTHING IN RETURN")
        term.echo("rungame: Attempt to start the game")
        if (player.loreId >= 1) term.echo("captcha: Captcha task manager, use 'captcha help' for details.")
        if (player.loreId >= 3) term.echo("store: App Store for NGOS! Use 'store help' for details.")
        if (player.storeProgramsBought.includes("browser")) term.echo("browser: A web browser.")
        if (player.storeProgramsBought.includes("network")) term.echo("network: Network upgrade utility.")
        if (player.storeProgramsBought.includes("learn")) term.echo("learn: Teach yourself some skills so you can reach your target easier and faster. use 'learn help' for details.")
        if (player.loreId >= 8) term.echo("vi: The best text editor for programming.")
      },
      save: function () {
        saveGame()
        term.echo("Saved.")
      },
      export: function () {
        copyStringToClipboard(btoa(JSON.stringify(player)))
        term.echo("Save exported to your clipboard.")
      },
      import: function () {
        loadGame(prompt("Please paste your exported save below:"), true)
      },
      deleteSave: function () {
        term.echo("If you are very sure about deleting your save, please type the following command:")
        term.echo("rm -rf --no-preserve-root /")
      },
      rm: function (...args) {
        if (args.join(" ") == "-rf --no-preserve-root /") {
          term.echo("Deleting everything in 30 seconds, if you ran this command by mistake REFRESH YOUR BROWSER NOW!")
          runWaitTimer(30, function () {
            player = getInitPlayer()
            saveGame()
            term.clear()
            term.echo("System reset complete.")
          })
        } else {
          term.echo("Error: Invalid usage of rm, you might be running the wrong command or have made a typo.")
        }
      },
      rungame: function () {
        term.echo("Waiting 10 seconds for the game to startup....")
        runTimer({
          target: new Decimal(1e10),
          increase: player.computer.cpu.power,
          timeLimit: new Decimal(10000),
          onfail: function () {
            term.echo("Error: Timeout.")
            player.rungameAttempts = player.rungameAttempts.plus(1)
          },
          onsuccess: function () {
            term.echo("Done.")
          }
        })
      },
      captcha: captchaCmd,
      store: function (...args) {
        if (player.loreId < 3) {
          fakeCommandNotFound("store")
          return
        }
        if (args.length === 0) {
          term.echo("You need to give an argument to use this command! Use 'store help' to see how to use this command correctly.")
          return
        }
        switch (args[0]) {
          case "help":
            term.echo("store: The App Store.")
            term.echo("Usage: 'store list' shows a list of available programs.")
            term.echo(" ".repeat(7) + "'store stat' shows how much money is available.")
            term.echo(" ".repeat(7) + "'store buy X' buys the program with codename of X.")
            break
          case "list":
            term.echo("Downloading program list...")
            runNetTimer(new Decimal(5), function () {
              term.echo("Done, displaying list of programs available...")
              Object.keys(storeProgramList).forEach(function (codename) {
                let details = storeProgramList[codename]
                term.echo(`${details[0]}, costs ${shorten(details[1])} money.`)
                term.echo(`Owned? ${player.storeProgramsBought.includes(codename) ? "Yes" : "No"}`)
                term.echo(`Description: ${details[2]}`)
                term.echo(`Codename: ${codename}`)
                term.echo("")
              })
            })
            break
          case "stat":
            term.echo(`Available money: ${shorten(player.withdrawnMoney)}`)
            break
          case "buy":
            term.echo("Checking if the program exists and you can afford it...")
            runNetTimer(new Decimal(5), function () {
              let details = storeProgramList[args[1]]
              if (typeof details === "undefined") {
                term.echo("Error: The program you asked for don't exist! Make sure you are using the codename and not the full name.")
                return
              }
              if (player.storeProgramsBought.includes(args[1])) {
                term.echo(`Warning: You already owned this program!`)
                return
              }
              if (player.withdrawnMoney.lt(details[1])) {
                term.echo(`Warning: You can't afford this program! You have ${shorten(player.withdrawnMoney)} money but the program costs ${shorten(details[1])} money.`)
                return
              }
              term.echo("Purchasing and downloading the program...")
              runNetTimer(new Decimal(20), function () {
                player.withdrawnMoney = player.withdrawnMoney.minus(details[1])
                player.storeProgramsBought.push(args[1])
                term.echo("Purchase complete.")
              })
            })
            break
          default:
            term.echo("Error: No such option is available! Use 'store help' to see how to use this command correctly.")
        }
      },
      browser: function (...args) {
        if (!player.storeProgramsBought.includes("browser")) {
          fakeCommandNotFound("browser")
          return
        }
        term.echo("Starting the browser...")
        runCPUTimer(new Decimal(10), function () {
          term.echo("The browser has started, what should you look for?")
          showBrowseOptions(true)
          startProgram(browserCLI)
        })
      },
      network: function (...args) {
        if (!player.storeProgramsBought.includes("network")) {
          fakeCommandNotFound("network")
          return
        }
        if (args.length === 0) {
          term.echo("Better network available:")
          term.echo("Name: Dial-up network")
          term.echo("Cost: 2 money")
          term.echo("Speed: 5 packet/s")
          term.echo("Capacity: 10000 packets")
          term.echo("If you have enough money and wish to buy this network, run network purchase.")
          return
        }
        switch (args[0]) {
          case "purchase":
            term.echo("ENDGAME: The network upgrade system is still under development, please be patient!")
            break
          default:
            term.echo("Error: No such option is available! Use 'network' to see how to use this command correctly.")
            break
        }
      },
      learn: function (...args) {
        if (args.length === 0) {
          term.echo("You need to give an argument to use this command! Use 'learn help' to see how to use this command correctly.")
          return
        }
        switch (args[0]) {
          case "help":
            term.echo("learn: Git gud.")
            term.echo("Usage: 'learn list' lists available subjects to learn of")
            term.echo("'learn start X' makes you start learning about subject X")
            term.echo("'learn stat' displays how good you have gotten in all subjects")
            break
          case "list":
            term.echo("Subjects to learn of:")
            term.echo("Programming")
            break
          case "start": {
            let subject = args[1]
            let keepLearning = true
            let cycleDone = false
            switch (subject) {
              case "programming":
                learnProgramming()
                break
              default:
                term.echo(`Error: Subject "${subject}" does not exist or can't be learned`)
                break
            }
            break
          }
          case "stat":
            term.echo("Current stats:")
            term.echo(`Programming: level ${shortenCosts(player.skills.programming.level)}, next level at ${shortenCosts(expTillLevelUp("programming"))} more exp.`)
            break
        }
      },
      eval: function (...args) {
        if (args.length === 0) {
          term.echo("Warning: You are trying to access a DEV ONLY command, if you entered this command in error please don't bruteforce it, otherwise, please enter your order.")
        } else if (args.pop() == "FuckifIknow.") {
          let out = eval(args.join(" "))
          if (out === undefined) {
            term.echo("No value returned.")
          } else {
            try {
              term.echo(String(out))
            } catch (err) {
              term.echo("Error occured while displaying the result")
              term.echo(err)
            }
          }
        } else {
          term.echo("Error, verify required: Does The Black Moon Howl? Remove spaces please")
        }
      },
      vi: function (...args) {
        if (player.loreId < 8) {
          fakeCommandNotFound("vi")
          return
        }
        term.echo("ENDGAME: Look, this is gonna be one of the core mechanics, so I'm leaving it for after my exam, any questions? no? good.")
      }
    },
    {
      greetings: `Welcome${player.loreId > 0 ? " back" : ""} to NGos!\n© 2020 Nyan cat, All Rights Reserved.\nType 'help' for a list of available commands.`,
      prompt: "NGos>",
      checkArity: false,
      pauseEvents: false,
      keydown: function (event, term) {
        if (isLearning && event.originalEvent.code == "KeyC") {
          keepLearning = false
          term.echo("You will stop learning after this learn cycle.")
        }
      }
    }
  )
  fakeCommandNotFound = (cmdName) => term.echo(`[[;red;]Command '${cmdName}' Not Found!]`)
})
