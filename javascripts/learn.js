var isLearning = false
var keepLearning = true
var levelUpReqFuncs = {
  programming: (level) => level.plus(1),
  vi: (level) => (level.eq(0) ? new Decimal(10) : new Decimal(1 / 0))
}

function until(conditionFunction) {
  // https://stackoverflow.com/a/52657929

  const poll = (resolve) => {
    if (conditionFunction()) resolve()
    else setTimeout((_) => poll(resolve), 50)
  }

  return new Promise(poll)
}

var expTillLevelUp = (skill) => player.skills[skill].levelUpReq.minus(player.skills[skill].exp)
var updateLevelUpReq = (skill) => (player.skills[skill].levelUpReq = levelUpReqFuncs[skill](player.skills[skill].level))

function giveExp(skill, amount, showGain = true, showLevelUp = true) {
  if (player.skills[skill].levelUpReq.eq(1 / 0)) return
  player.skills[skill].exp = player.skills[skill].exp.plus(amount)
  if (showGain) term.echo(`Done! You gained ${shortenMoney(amount)} exp.`)
  if (player.skills[skill].exp.gte(player.skills[skill].levelUpReq)) {
    player.skills[skill].exp = new Decimal(0)
    player.skills[skill].level = player.skills[skill].level.plus(1)
    updateLevelUpReq(skill)
    if (showLevelUp) term.echo(`Your ${skill} skill has leveled up to level ${shortenMoney(player.skills[skill].level)}! Next level up at ${shortenMoney(player.skills[skill].levelUpReq)} more exp.`)
  } else {
    if (showGain) term.echo(`Next level up at ${shortenMoney(expTillLevelUp(skill))} more exp.`)
  }
}

async function learnProgramming() {
  isLearning = true
  keepLearning = true
  let cycleDone = false
  term.echo("You opened up the website and started to learn how to code...")
  term.echo("Press C to stop learning")
  while (keepLearning) {
    cycleDone = false
    term.echo("The webpage is being downloaded...")
    runNetTimer(new Decimal(10), function () {
      term.echo("The browser is rendering the webpage...")
      runCPUTimer(new Decimal(10), function () {
        term.echo("You are learning about the webpage's content...")
        runWaitTimer(5, function () {
          giveExp("programming", new Decimal(1))

          cycleDone = true
        })
      })
    })
    await until((_) => cycleDone == true)
  }
  isLearning = false
}
