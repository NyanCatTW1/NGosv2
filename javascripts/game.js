function getInitPlayer() {
  return {
    computer: {
      cpu: {
        power: new Decimal(1)
      },
      internet: {
        speed: new Decimal(1)
      }
    },
    lastUpdate: new Date().getTime(),
    rungameAttempts: new Decimal(0),
    currentTaskAnswer: "",
    currentTaskText: "",
    money: new Decimal(0),
    trust: new Decimal(0),
    loreId: 0,
    trustStage: 0
  }
}
let player = getInitPlayer()
let timer = {
  time: new Decimal(0),
  current: new Decimal(0),
  increase: new Decimal(0),
  target: new Decimal(0),
  timeLimit: new Decimal(0),
  thisProgressBarIndex: 0,
  onfail: function () {},
  onsuccess: function () {}
}

function checkLore() {
  switch (player.loreId) {
    case 0:
      if (player.rungameAttempts.gte(1)) {
        player.loreId++
        term.echo("Your computer is too weak for the game, you decides to do some captcha tasks online for some money for buying new hardwares.")
        term.echo("captcha command available.")
      }
      break;
    case 1:
      if (player.trust.notEquals(0)) {
        player.loreId++
        term.echo("You have just done a task, to see your money and trust, type 'captcha stat'")
      break;
    }
  }
}

function checkTrustStage() {
  switch (player.trustStage) {
    case 0:
      if (player.trust.gte(10)) {
        term.echo("You have just reached 10 trusts! Congratluations!")
        term.echo("You should be able to withdraw your money with 'captcha withdraw' at this stage.")
        player.trustStage++
      }
      break;
    case 1:
      if (player.trust.lt(10)) {
        term.echo("You have done mistakes and caused your trust to drop below 10.")
        term.echo("Withdraw is locked until you are trustworthy again.")
        player.trustStage--
      }
      break;
  }
}

function startInterval() {
  gameLoopIntervalId = setInterval(gameLoop, 10)
}

function startGame() {
  loadGame()
  startInterval()
  setInterval(saveGame, 5000)
}

function gameLoop(diff) { // 1 diff = 0.001 seconds
  var thisUpdate = new Date().getTime()
  if (typeof diff === 'undefined') var diff = Math.min(thisUpdate - player.lastUpdate, 21600000);
  timer.time = timer.time.plus(diff)
  timer.current = Decimal.min(timer.target, timer.current.plus(timer.increase.div(1000).times(diff)))
  checkLore()
  checkTrustStage()
  player.lastUpdate = thisUpdate
}

function resetTimer() {
  timer.time = new Decimal(0)
  timer.current = new Decimal(0)
}

function timerTick() {
  if (timer.time.gt(timer.timeLimit) && timer.timeLimit.notEquals(0)) {
    showPrompt()
    term.resume()
    timer.onfail()
    return
  }
  term.update(timer.thisProgressBarIndex, getFinalProgressBar(timer.current, timer.target, timer.increase))
  if (timer.current.gte(timer.target)) {
    showPrompt()
    term.resume()
    timer.onsuccess()
    return
  }
  setTimeout(timerTick, 20)
}

function getRandomNumber(bottom, top) {
  return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
}

function verifyAnswer(answer) {
  if (player.currentTaskAnswer === "") {
    term.echo("Error: You haven't start a task yet.")
    return
  }
  term.echo("Validating your answer...")
  runTimer(new Decimal(5), player.computer.internet.speed, new Decimal(0), function () {}, function () {
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
  runTimer(new Decimal(10), player.computer.cpu.power, new Decimal(0), function () {}, function () {
    term.echo("Next task:")
    switch (level) {
    case 1:
      let random = Math.random()
      if (random < 0.8) {
        let string = `${getRandomNumber(1,9)}${Math.random()<0.5?"+":"-"}${getRandomNumber(1,9)}`
        player.currentTaskAnswer = eval(string)
        player.currentTaskText = `Submit the value of ${string}`
      } else if (random < 0.95) {
        let string = ""
        for (let i = 0; i < 6; i++) {
          string += getRandomNumber(1, 9).toString()
        }
        player.currentTaskAnswer = string.split("").reverse().join("")
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
      runTimer(new Decimal(5), player.computer.cpu.power, new Decimal(0), function () {}, function () {
        term.echo("Task abandoned, you lost 2 trusts for that.");
        player.trust = player.trust.minus(2)
        spawnCaptcha(level)
      })
    }
  } else {
    spawnCaptcha(level)
  }
}

function runTimer(target, increase, timeLimit, onfail, onsuccess) {
  resetTimer()
  timer.increase = increase
  timer.target = target
  timer.timeLimit = timeLimit
  timer.onfail = onfail
  timer.onsuccess = onsuccess
  term.pause(true)
  hidePrompt()
  term.echo(getFinalProgressBar(timer.current, timer.target, timer.increase))
  timer.thisProgressBarIndex = term.last_index()
  timerTick()
}