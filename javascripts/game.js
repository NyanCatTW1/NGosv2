function getInitPlayer() {
  return {
    computer: {
      cpu: {
        power: new Decimal(1)
      }
    },
    lastUpdate: new Date().getTime(),
  }
}
let player = getInitPlayer()
let timer = {
  time: new Decimal(0),
  current: new Decimal(0),
  increase: new Decimal(0),
  target: new Decimal(0),
  timeLimit: new Decimal(0)
}

function startInterval() {
  gameLoopIntervalId = setInterval(gameLoop,10)
}

function gameLoop(diff) { // 1 diff = 0.001 seconds
  var thisUpdate = new Date().getTime()
  if (typeof diff === 'undefined') var diff = Math.min(thisUpdate - player.lastUpdate, 21600000);
  timer.time = timer.time.plus(diff)
  timer.current = Decimal.min(timer.target,timer.current.plus(increase.div(1000).times(diff)))
  player.lastUpdate = thisUpdate
}

function resetTimer() {
  timer.time = new Decimal(0)
  timer.current = new Decimal(0)
}

function timerTick() {
  if (timer.time.gt(timer.timeLimit)) {
    term.echo("Error: Timeout.")
    return
  }
  term.update(-1, getFinalProgressBar(timer.current,timer.target,timer.increase))
  if (timer.current.gte(timer.target)) {
    term.echo("Done.")
    return
  }
  setTimeout(timerTick,20)
}

function runTimer(target,increase,timeLimit) {
  resetTimer()
  timer.increase = increase
  timer.target = target
  timer.timeLimit = timeLimit
  term.echo(getFinalProgressBar(timer.current,timer.target,timer.increase))
  timerTick()
}