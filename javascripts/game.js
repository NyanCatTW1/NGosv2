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
    nextCaptchaAnswer: "",
    money: new Decimal(0),
    trust: new Decimal(0),
    loreId: 0
  }
}
let player = getInitPlayer()
let timer = {
  time: new Decimal(0),
  current: new Decimal(0),
  increase: new Decimal(0),
  target: new Decimal(0),
  timeLimit: new Decimal(0),
  onfail: function(){},
  onsuccess: function(){}
}

function checkLore() {
  if (player.rungameAttempts.gte(1) && player.loreId === 0) {
    player.loreId++
    term.echo("Your computer is too weak for the game, you decides to do some captcha tasks online for some money for buying new hardwares.")
    term.echo("captcha command unlocked.")
  }
  if (player.trust.notEquals(0) && player.loreId === 1) {
    player.loreId++
    term.echo("You have just done a task, to see your money and trust, type 'captcha stat'")
    term.echo("stat unlocked for captcha command.")
  }
}

function startInterval() {
  gameLoopIntervalId = setInterval(gameLoop,10)
}

function gameLoop(diff) { // 1 diff = 0.001 seconds
  var thisUpdate = new Date().getTime()
  if (typeof diff === 'undefined') var diff = Math.min(thisUpdate - player.lastUpdate, 21600000);
  timer.time = timer.time.plus(diff)
  timer.current = Decimal.min(timer.target,timer.current.plus(timer.increase.div(1000).times(diff)))
  checkLore()
  player.lastUpdate = thisUpdate
}

function resetTimer() {
  timer.time = new Decimal(0)
  timer.current = new Decimal(0)
}

function timerTick() {
  if (timer.time.gt(timer.timeLimit)) {
    timer.onfail()
    return
  }
  term.update(term.last_index(), getFinalProgressBar(timer.current,timer.target,timer.increase))
  if (timer.current.gte(timer.target)) {
    timer.onsuccess()
    return
  }
  setTimeout(timerTick,20)
}

function getRandomNumber(bottom, top) {
  return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

function verifyAnswer(answer) {
  if (player.nextCaptchaAnswer === "") {
    term.echo("Error: You haven't start a task yet.")
  }
  if (player.nextCaptchaAnswer == answer) {
    term.echo("Correct answer! You got 0.01 money and 1 trust for submitting right answer.")
    player.money = player.money.plus(0.01)
    player.trust = player.trust.plus(1)
  } else {
    term.echo("Wrong answer! You lost 5 trust for submitting wrong answer.")
    player.trust = player.trust.minus(5)
  }
  player.nextCaptchaAnswer = ""
}

function newCaptcha(level) {
  switch(level) {
    case 1:
      let random = Math.random()
      if (random<0.8) {
        let string = `${getRandomNumber(1,9)}${Math.random<0.5?"+":"-"}${getRandomNumber(1,9)}`
        player.nextCaptchaAnswer = eval(string)
        term.echo(`Submit the value of ${string}`)
      } else if (random<0.95) {
        let string = ""
        for (let i=0;i<6;i++) {
          string += getRandomNumber(1,9).toString()
        }
        player.nextCaptchaAnswer = string.reverse()
        term.echo(`Submit ${string} in reversed text`)
      } else {
        let string = ""
        let answer = 0
        for (let i=0;i<6;i++) {
          let randomDigit = getRandomNumber(1,9)
          answer += randomDigit
          string += randomDigit.toString()
        }
        player.nextCaptchaAnswer = answer.toString()
        term.echo(`Submit sum of digits for ${string}`)
      }
  }
}

function runTimer(target,increase,timeLimit,onfail,onsuccess) {
  resetTimer()
  timer.increase = increase
  timer.target = target
  timer.timeLimit = timeLimit
  timer.onfail = onfail
  timer.onsuccess = onsuccess
  term.echo(getFinalProgressBar(timer.current,timer.target,timer.increase))
  timerTick()
}