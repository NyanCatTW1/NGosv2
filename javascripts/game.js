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
    withdrawnMoney: new Decimal(0),
    trust: new Decimal(0),
    loreId: 0,
    trustStage: 0,
    bestTrustStage: 0,
    storeProgramsBought: [],
    skills: {
      programming: {
        exp: new Decimal(0),
        level: new Decimal(0),
        levelUpReq: new Decimal(1),
        levelUpReqScale: new Decimal(1)
      }
    }
  }
}
var player = getInitPlayer()
let timer = {
  time: new Decimal(0),
  current: new Decimal(0),
  increase: new Decimal(0),
  target: new Decimal(0),
  timeLimit: new Decimal(0),
  thisProgressBarIndex: 0,
  onfail: function () {},
  onsuccess: function () {},
  currentPrompt: "NGos>"
}

function checkLore() {
  switch (player.loreId) {
    case 0:
      if (player.rungameAttempts.gte(1)) {
        player.loreId++
        term.echo("Your computer is too weak for the game, you decides to do some captcha tasks online for some money for buying new hardwares.")
        term.echo("captcha command available.")
      }
      break
    case 1:
      if (player.trust.notEquals(0)) {
        player.loreId++
        term.echo("You have just done a task, to see your money and trust, type 'captcha stat'")
        break
      }
    case 2:
      if (player.withdrawnMoney.notEquals(0)) {
        player.loreId++
        term.echo("Now that you have money to spend, you can buy programs with them at the store.")
        term.echo("store command available.")
      }
      break
    case 3:
      if (player.storeProgramsBought.includes("browser")) {
        player.loreId++
        term.echo("So, somehow you don't have a web browser until now, what should you start checking first with your browser though...")
        term.echo("OH! Speed up captcha solving! Why didn't I think of that first?")
        term.echo("Time to get your browser on and search how to do that.")
      }
      break
    case 7:
      if (player.skills.programming.levelUpReqScale.gte(5)) {
        player.loreId++
        term.echo("You learned the very basics of programming, stuff like hello world, messing with small numbers, outputting things...")
        term.echo("Now you think it's time you try and automate some stuff, maybe start with automatically accept tasks?")
        term.echo("People online say real programmers use vi, so you think you'll do that as well.")
        term.echo("vi command available")
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
      break
    case 1:
      if (player.trust.lt(10)) {
        term.echo("You have done mistakes and caused your trust to drop below 10.")
        term.echo("Withdraw is locked until you are trustworthy again.")
        player.trustStage--
      }
      break
  }
}

function startInterval() {
  gameLoopIntervalId = setInterval(gameLoop, 10)
}

function startGame() {
  let savefile = localStorage.getItem(saveName)
  if (!(savefile === null)) loadGame(savefile)
  startInterval()
  setInterval(saveGame, 5000)
}

function gameLoop(diff) {
  // 1 diff = 0.001 seconds
  var thisUpdate = new Date().getTime()
  if (typeof diff === "undefined") var diff = Math.min(thisUpdate - player.lastUpdate, 21600000)
  timer.time = timer.time.plus(diff)
  timer.current = Decimal.min(timer.target, timer.current.plus(timer.increase.div(1000).times(diff)))
  checkLore()
  checkTrustStage()
  player.bestTrustStage = Math.max(player.trustStage, player.bestTrustStage)
  player.lastUpdate = thisUpdate
}

function resetTimer() {
  timer.time = new Decimal(0)
  timer.current = new Decimal(0)
}

function timerTick() {
  if (timer.time.gt(timer.timeLimit) && timer.timeLimit.notEquals(0)) {
    showPrompt(timer.currentPrompt)
    term.resume()
    timer.onfail()
    return
  }
  term.update(timer.thisProgressBarIndex, getFinalProgressBar(timer.current, timer.target, timer.increase))
  if (timer.current.gte(timer.target)) {
    showPrompt(timer.currentPrompt)
    term.resume()
    timer.onsuccess()
    return
  }
  setTimeout(timerTick, 20)
}

function startProgram(programCLI) {
  term.push.call(term, programCLI[0], programCLI[1])
}

function runTimer(config) {
  resetTimer()
  timer.increase = config.increase
  timer.target = config.target
  timer.timeLimit = config.timeLimit || new Decimal(0)
  timer.onfail = config.onfail || function () {}
  timer.onsuccess = config.onsuccess || function () {}
  timer.currentPrompt = config.currentPrompt || "NGos>"
  term.pause(true)
  hidePrompt()
  term.echo(getFinalProgressBar(timer.current, timer.target, timer.increase))
  timer.thisProgressBarIndex = term.last_index()
  timerTick()
}

var runWaitTimer = (second, code, currentPrompt = "NGos>") =>
  runTimer({
    target: new Decimal(second),
    increase: new Decimal(1),
    onsuccess: code,
    currentPrompt: currentPrompt
  })
var runNetTimer = (kilobit, code, currentPrompt = "NGos>") =>
  runTimer({
    target: kilobit,
    increase: player.computer.internet.speed,
    onsuccess: code,
    currentPrompt: currentPrompt
  })
var runCPUTimer = (cycle, code, currentPrompt = "NGos>") =>
  runTimer({
    target: cycle,
    increase: player.computer.cpu.power,
    onsuccess: code,
    currentPrompt: currentPrompt
  })
