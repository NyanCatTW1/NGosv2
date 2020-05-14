function getRandomNumber(bottom, top) {
  return Math.floor(Math.random() * (1 + top - bottom)) + bottom
}

function verifyAnswer(answer) {
  if (player.currentTaskAnswer === "") {
    term.echo("Error: You haven't start a task yet.")
    return
  }
  term.echo("Validating your answer...")
  runNetTimer(new Decimal(5), function() {
    if (player.currentTaskAnswer == answer) {
      term.echo("Correct answer! You got 0.01 money and 1 trust for submitting right answer.")
      player.money = player.money.plus(0.01)
      player.trust = player.trust.plus(1)
    } else {
      term.echo("Wrong answer! You lost 5 trust for submitting wrong answer.")
      player.trust = player.trust.minus(5)
    }
    player.currentTaskAnswer = ""
    player.currentTaskText = ""
  })
}

function spawnCaptcha(level) {
  term.echo("Requesting and downloading new task...")
  runCPUTimer(new Decimal(10), function() {
    term.echo("New task:")
    switch (level) {
      case 1:
        let random = Math.random()
        if (random < 0.8) {
          let string = `${getRandomNumber(1, 9)}${Math.random() < 0.5 ? "+" : "-"}${getRandomNumber(1, 9)}`
          player.currentTaskAnswer = eval(string)
          player.currentTaskText = `Submit the value of ${string}`
        } else if (random < 0.95) {
          let string = ""
          for (let i = 0; i < 6; i++) {
            string += getRandomNumber(1, 9).toString()
          }
          player.currentTaskAnswer = string
            .split("")
            .reverse()
            .join("")
          player.currentTaskText = `Submit the number ${string} in reversed text`
        } else {
          let string = ""
          let answer = 0
          for (let i = 0; i < 6; i++) {
            let randomDigit = getRandomNumber(1, 9)
            answer += randomDigit
            string += randomDigit.toString()
          }
          player.currentTaskAnswer = answer.toString()
          player.currentTaskText = `Submit the sum of digits for ${string}`
        }
    }
    term.echo(player.currentTaskText)
  })
}

function newCaptcha(level, forced) {
  if (player.currentTaskAnswer != "") {
    if (!forced) {
      term.echo("Warning: You have unfinished tasks!")
      term.echo("By giving up pervious task and request a new one you will lose 2 trusts")
      term.echo("Use --force argument if you are sure about this.")
      return
    } else {
      term.echo("Abandoning previous task")
      runCPUTimer(new Decimal(5), function() {
        term.echo("Task abandoned, you lost 2 trusts for that.")
        player.trust = player.trust.minus(2)
        spawnCaptcha(level)
      })
    }
  } else {
    spawnCaptcha(level)
  }
}

function captchaHelp() {
  term.echo("captcha: Captcha task manager")
  term.echo("Usage: 'captcha new' requests a new task for solving")
  term.echo(" ".repeat(7) + "'captcha current' displays the task in case you forgot it")
  term.echo(" ".repeat(7) + "'captcha submit X' submits X as the answer to the captcha")
  if (player.loreId >= 2) term.echo(" ".repeat(7) + "'captcha stat' displays the stat of your account")
  if (player.bestTrustStage >= 1) term.echo(" ".repeat(7) + "'captcha withdraw' withdraws all the money from your account, which makes them freely spendable to you")
  term.echo("You gain 0.01 money and 1 trust for solving a number captcha.")
}

function captchaCmd(...args) {
  if (player.loreId < 1) {
    fakeCommandNotFound("captcha")
    return
  }
  if (args.length === 0) {
    term.echo("You need to give an argument to use this command! Use 'captcha help' to see how to use this command correctly.")
  } else {
    switch (args[0]) {
      case "help":
        captchaHelp()
        break
      case "new":
        newCaptcha.call(null, 1, args[1] == "--force" ? true : false)
        break
      case "current":
        if (player.currentTaskText === "") {
          term.echo("Error: You haven't started a task yet.")
          return
        }
        term.echo("Current task:")
        term.echo(player.currentTaskText)
        break
      case "submit":
        if (args.length < 2) {
          term.echo("You need to type the answer to be submitted!")
          break
        }
        term.echo("Submitting your answer...")
        runNetTimer(new Decimal(5), function() {
          verifyAnswer.call(null, args[1])
        })
        break
      case "stat":
        if (player.loreId < 2) {
          term.echo("Error: You have done no task so far, so there isn't any stat to show.")
          break
        }
        term.echo("Requesting your stats from the server...")
        runNetTimer(new Decimal(5), function() {
          term.echo(`Money available for withdraw: ${player.money}`)
          term.echo(`Trust level: ${player.trust}`)
          switch (player.trustStage) {
            case 0:
              term.echo("Withdraw is available at 10 trust")
              break
            default:
              term.echo("You reached the highest trust we can handle right now, blame dev for this!")
              break
          }
        })
        break
      case "withdraw":
        if (player.bestTrustStage < 1) {
          term.echo("Error: No such option is available! Use 'captcha help' to see how to use this command correctly.")
        } else {
          term.echo("Verifying your trust level...")
          runNetTimer(new Decimal(5), function() {
            if (player.trustStage < 1) {
              term.echo("Sorry, but your trust level is too low for a withdraw, please retry once you gain at least 10 trust.")
            } else {
              term.echo("Trust level matches minimum requirement, withdrawing all money from your account...")
              runTimer({
                target: player.money,
                increase: new Decimal(0.01),
                onsuccess: function() {
                  player.withdrawnMoney = player.withdrawnMoney.plus(player.money)
                  player.money = new Decimal(0)
                  term.echo("Operation complete.")
                }
              })
            }
          })
        }
        break
      default:
        term.echo("Error: No such option is available! Use 'captcha help' to see how to use this command correctly.")
    }
  }
}
