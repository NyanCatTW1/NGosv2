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
